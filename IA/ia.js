// IA/ia.js — Módulo principal DallIA

// ─── Estado global de la sesión ───────────────────────────────────────────────
let conversationHistory = []; // Array<{role: string, content: string}>
let ragDisabled = false;
let supabaseWarning = false;

// ─── 6.1 renderMarkdown(text) ─────────────────────────────────────────────────
// Convierte Markdown básico a HTML sin alterar el contenido semántico.
// Requirements: 1.4
function renderMarkdown(text) {
  if (typeof text !== "string") return "";

  // 1. Convertir **texto** → <strong>texto</strong>
  let html = text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

  // 2. Convertir bloques de líneas con "- " en listas <ul><li>…</li></ul>
  //    Agrupa líneas consecutivas que empiezan con "- " en un solo <ul>.
  html = html.replace(/((?:^|\n)- .+)+/g, (block) => {
    const items = block
      .split("\n")
      .filter((line) => line.startsWith("- "))
      .map((line) => `<li>${line.slice(2)}</li>`)
      .join("");
    return `<ul>${items}</ul>`;
  });

  // 3. Convertir \n restantes → <br>
  html = html.replace(/\n/g, "<br>");

  return html;
}

// ─── 6.3 filterAndSortChunks(chunks, threshold, topK) ────────────────────────
// Filtra por umbral de similitud, ordena descendente y limita a topK.
// Requirements: 3.2, 3.3
function filterAndSortChunks(chunks, threshold = 0.70, topK = 5) {
  return chunks
    .filter((chunk) => chunk.similarity >= threshold)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK);
}

// ─── 6.7 buildLLMPayload(chunks, userText, history) ──────────────────────────
// Construye el payload para el proxy LLM (netlify/functions/ai.js).
// Requirements: 4.1, 4.2, 4.3, 4.5
function buildLLMPayload(chunks, userText, history) {
  // Ordenar chunks por similitud descendente antes de ensamblar el contexto
  const sorted = [...chunks].sort((a, b) => b.similarity - a.similarity);

  let contextBlock;
  if (sorted.length === 0) {
    contextBlock =
      "NOTA: No se encontró contexto relevante en la base de documentos para esta pregunta. " +
      "Responde basándote únicamente en tu conocimiento general del restaurante.";
  } else {
    contextBlock =
      "CONTEXTO RELEVANTE:\n" +
      sorted
        .map((chunk, i) => `[${i + 1}] ${chunk.content}`)
        .join("\n\n");
  }

  const system =
    "Eres DallIA, el asistente de inteligencia artificial del restaurante MiRest. " +
    "Debes responder SIEMPRE en español. " +
    "Usa únicamente el contexto provisto para responder preguntas sobre el negocio " +
    "(recetas, proveedores, productos, operaciones, etc.). " +
    "Si la información no está en el contexto, indícalo con amabilidad.\n\n" +
    contextBlock;

  return {
    system,
    messages: history,
    model: "gemini-1.5-flash",
  };
}

// ─── 6.9 extractResponseText(data) ───────────────────────────────────────────
// Extrae el texto de la respuesta de Gemini sin modificarlo.
// Requirements: 4.4
function extractResponseText(data) {
  return data.candidates[0].content.parts[0].text;
}

// ─── 6.11 truncateHistory(history) ───────────────────────────────────────────
// Si el historial supera 40 mensajes (20 pares), descarta los pares más
// antiguos preservando siempre el mensaje más reciente del usuario.
// Requirements: 4.6, 6.5
function truncateHistory(history) {
  if (history.length <= 40) return history;

  // Tomar los últimos 40 mensajes (20 pares más recientes)
  return history.slice(history.length - 40);
}

// ─── Helper: appendToHistory ──────────────────────────────────────────────────
function appendToHistory(role, content) {
  conversationHistory.push({ role, content });
}

// ─── 7.1 getEmbedding(text) ───────────────────────────────────────────────────
// Convierte el texto en un vector de embedding llamando al proxy backend.
// Requirements: 2.1, 2.2, 2.4
async function getEmbedding(text) {
  const response = await fetch("/api/ai-embedding", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      `Error al generar el embedding: ${data.error || response.statusText}`
    );
  }

  return data.embedding;
}

// ─── 7.2 retrieveContext(embedding) ──────────────────────────────────────────
// Busca documentos relevantes en Supabase usando el vector de embedding.
// Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 8.2, 8.4
async function retrieveContext(embedding) {
  const config = window.MIREST_CONFIG || {};
  const SUPABASE_URL = config.supabaseUrl || config.SUPABASE_URL;
  const SUPABASE_ANON_KEY = config.supabaseAnonKey || config.SUPABASE_ANON_KEY;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error(
      "[DallIA] SUPABASE_URL o SUPABASE_ANON_KEY no están definidas en window.MIREST_CONFIG. " +
        "El RAG pipeline está deshabilitado. DallIA operará como chat simple."
    );
    ragDisabled = true;
    return [];
  }

  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/rpc/match_documents`,
      {
        method: "POST",
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: "Bearer " + SUPABASE_ANON_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query_embedding: embedding,
          match_threshold: 0.70,
          match_count: 5,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Supabase respondió con estado ${response.status}`);
    }

    const chunks = await response.json();
    return filterAndSortChunks(chunks);
  } catch (err) {
    console.error("[DallIA] Error al recuperar contexto de Supabase:", err);
    supabaseWarning = true;
    return [];
  }
}

// ─── 7.3 callLLM(payload) ────────────────────────────────────────────────────
// Envía el payload al proxy LLM y retorna el texto de la respuesta.
// Requirements: 4.3, 4.4
async function callLLM(payload) {
  let response;
  try {
    response = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (_networkErr) {
    throw new Error(
      "Problema de conexión. Verifica tu internet e intenta de nuevo."
    );
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      "DallIA no pudo procesar tu solicitud en este momento. Intenta de nuevo."
    );
  }

  return extractResponseText(data.data);
}

// ─── 7.4 sendMessage(userText) ───────────────────────────────────────────────
// Orquesta el pipeline completo: embedding → contexto → payload → LLM.
// Requirements: 2.2, 3.4, 4.3, 6.1, 6.2, 6.3, 7.3
async function sendMessage(userText) {
  supabaseWarning = false;

  setLoadingState(true);
  renderMessage("user", userText);
  appendToHistory("user", userText);

  try {
    const embedding = await getEmbedding(userText);
    const chunks = await retrieveContext(embedding);
    const payload = buildLLMPayload(chunks, userText, conversationHistory);
    const assistantText = await callLLM(payload);

    appendToHistory("assistant", assistantText);
    renderMessage("assistant", assistantText);

    if (supabaseWarning) {
      renderMessage(
        "assistant",
        "⚠️ Advertencia: DallIA está respondiendo sin acceso a la base de conocimiento. " +
          "La respuesta puede ser menos precisa."
      );
    }

    if (conversationHistory.length > 40) {
      conversationHistory = truncateHistory(conversationHistory);
    }
  } catch (err) {
    renderMessage(
      "assistant",
      `❌ ${err.message || "DallIA no pudo procesar tu solicitud en este momento."}`
    );
  } finally {
    setLoadingState(false);
  }
}

// ─── UI Helpers ───────────────────────────────────────────────────────────────

const WELCOME_MESSAGE =
  "¡Hola! Soy DallIA, el asistente de MiRest. Puedo ayudarte con preguntas sobre recetas, proveedores, productos y operaciones del restaurante. ¿En qué puedo ayudarte hoy?";

// ─── 8.1 renderMessage(role, content) ────────────────────────────────────────
// Crea un elemento DOM con la clase correcta según el rol y lo agrega al chat.
// Requirements: 1.1, 1.2, 1.4
function renderMessage(role, content) {
  const chatMessages = document.getElementById("chat-messages");
  const el = document.createElement("div");
  el.classList.add("message", role === "user" ? "message--user" : "message--assistant");

  const bubble = document.createElement("div");
  bubble.classList.add("message__bubble");

  if (role === "assistant") {
    bubble.innerHTML = renderMarkdown(content);
  } else {
    bubble.textContent = content;
  }

  el.appendChild(bubble);
  chatMessages.appendChild(el);
  scrollToBottom();
}

// ─── scrollToBottom() ────────────────────────────────────────────────────────
// Desplaza el área de mensajes hasta el último mensaje.
// Requirements: 1.1
function scrollToBottom() {
  const chatMessages = document.getElementById("chat-messages");
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// ─── 8.4 setLoadingState(isLoading) ──────────────────────────────────────────
// Habilita o deshabilita los controles de entrada según el estado de carga.
// Requirements: 7.2, 7.4
function setLoadingState(isLoading) {
  const chatInput = document.getElementById("chat-input");
  const btnSend = document.getElementById("btn-send");
  const typingIndicator = document.getElementById("typing-indicator");

  chatInput.disabled = isLoading;
  btnSend.disabled = isLoading;
  typingIndicator.style.display = isLoading ? "flex" : "none";

  if (!isLoading) {
    chatInput.focus();
  }
}

// ─── 8.6 updateCharCounter(length) ───────────────────────────────────────────
// Muestra los caracteres restantes en el contador.
// Requirements: 7.5
function updateCharCounter(length) {
  const charCounter = document.getElementById("char-counter");
  charCounter.textContent = 1000 - length;
}

// ─── 8.9 clearChat() ─────────────────────────────────────────────────────────
// Limpia el área de mensajes, reinicia el historial y muestra el mensaje de bienvenida.
// Requirements: 1.5, 6.4
function clearChat() {
  const chatMessages = document.getElementById("chat-messages");
  chatMessages.innerHTML = "";
  conversationHistory = [];
  renderMessage("assistant", WELCOME_MESSAGE);
}

// ─── Inicialización del módulo ────────────────────────────────────────────────
// Se ejecuta cuando el DOM está listo.
document.addEventListener("DOMContentLoaded", () => {
  const chatInput = document.getElementById("chat-input");
  const btnSend   = document.getElementById("btn-send");
  const btnNewChat = document.getElementById("btn-new-chat");

  // Evento: click en botón enviar
  btnSend.addEventListener("click", () => {
    const text = chatInput.value.trim();
    if (!text) return;
    chatInput.value = "";
    updateCharCounter(0);
    sendMessage(text);
  });

  // Evento: Enter sin Shift en el textarea
  chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      btnSend.click();
    }
  });

  // Evento: input → actualizar contador de caracteres
  chatInput.addEventListener("input", () => {
    updateCharCounter(chatInput.value.length);
  });

  // Evento: click en "Nueva conversación"
  btnNewChat.addEventListener("click", () => {
    clearChat();
    chatInput.focus();
  });

  // Inicializar: mostrar mensaje de bienvenida y enfocar input
  clearChat();
  chatInput.focus();
});
