import { initTheme } from '../scripts/ui-utils.js';
import { MODULES } from '../scripts/navigation.js';
import { resolveProfile } from './ai/profiles.js';
import { resolveModuleContext } from './ai/modules.js';
import { buildToolsForModule, executeToolCall } from './ai/tools/index.js';

/* ── UI Elements ── */
const iaInput = document.getElementById('iaInputLive');
const btnSend = document.getElementById('btnSendLive');
const btnMic = document.getElementById('btnMicLive');
const iaChatOverlay = document.getElementById('iaChatOverlay');
const iaVisualizerGfx = document.getElementById('iaVisualizerGfx');
const iaOrb = document.getElementById('iaOrb');
const quickCommandBtns = document.querySelectorAll('.quick-cmd');
const iaRoleSelect = document.getElementById('iaRoleSelect');

/* ── Visualizer Simulation ── */
function createVisualizer() {
  const bars = 12;
  iaVisualizerGfx.innerHTML = '';
  for (let i = 0; i < bars; i++) {
    const bar = document.createElement('div');
    bar.className = 'ia-gfx-bar';
    iaVisualizerGfx.appendChild(bar);
  }
}

let visualizerInterval = null;
function startVisualizer() {
  const bars = document.querySelectorAll('.ia-gfx-bar');
  iaOrb.classList.add('ia-orb--active');
  
  if (visualizerInterval) clearInterval(visualizerInterval);
  visualizerInterval = setInterval(() => {
    bars.forEach(bar => {
      const height = Math.random() * 50 + 10;
      bar.style.height = `${height}px`;
    });
  }, 100);
}

function stopVisualizer() {
  clearInterval(visualizerInterval);
  visualizerInterval = null;
  iaOrb.classList.remove('ia-orb--active');
  const bars = document.querySelectorAll('.ia-gfx-bar');
  bars.forEach(bar => {
    bar.style.height = '10px';
  });
}

/* ── Chat Logic ── */
function addMessage(role, text) {
  const msg = document.createElement('div');
  msg.className = `ia-msg ${role === 'user' ? 'ia-msg--user' : ''}`;
  msg.textContent = text;
  
  iaChatOverlay.appendChild(msg);
  iaChatOverlay.scrollTop = iaChatOverlay.scrollHeight;

  // Limit messages shown to keep it clean
  if (iaChatOverlay.children.length > 5) {
    iaChatOverlay.removeChild(iaChatOverlay.children[0]);
  }
}

function getRootPath() {
  return document?.body?.dataset?.rootPath || '../';
}

function resolveActiveModuleKey() {
  const explicit = document?.body?.dataset?.moduleKey;
  if (explicit && explicit !== 'ia') return explicit;
  return 'dashboard';
}

function resolveActiveRoleKey() {
  return localStorage.getItem('mirest-ia-role') || 'admin';
}

function setActiveRoleKey(roleKey) {
  localStorage.setItem('mirest-ia-role', roleKey);
}

function buildSystemPrompt({ moduleKey, roleKey }) {
  const profile = resolveProfile(roleKey);
  const mod = resolveModuleContext(moduleKey);
  const moduleList = MODULES.map((m) => `${m.label} (${m.key})`).join(', ');

  return [
    profile.system,
    `Contexto de módulo activo: ${mod.label}. Alcance: ${mod.scope}.`,
    `Módulos disponibles: ${moduleList}.`,
    'Reglas:',
    '- Responde en español.',
    '- Sé breve y accionable.',
    '- Si vas a ejecutar una acción (navegar/plan), usa herramientas.',
  ].join('\n');
}

async function callAi({ messages, system, tools }) {
  const root = getRootPath();
  const url = `${root}.netlify/functions/ai`;

  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      model: 'gemini-1.5-flash',
      system,
      messages,
      tools,
      toolConfig: { functionCallingConfig: { mode: 'AUTO' } },
    }),
  });

  const data = await resp.json();
  if (!resp.ok || !data?.ok) {
    throw new Error(data?.error || 'AI request failed');
  }
  return data.data;
}

function extractTextFromGemini(data) {
  const parts = data?.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts)) return '';

  return parts
    .map((p) => (typeof p?.text === 'string' ? p.text : ''))
    .filter(Boolean)
    .join('\n')
    .trim();
}

function extractToolCallsFromGemini(data) {
  const parts = data?.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts)) return [];

  const calls = [];
  for (const p of parts) {
    const fc = p?.functionCall;
    if (fc?.name) {
      calls.push({ name: fc.name, args: fc.args || {} });
    }
  }
  return calls;
}

async function processCommand(text) {
  if (!text) return;

  const moduleKey = resolveActiveModuleKey();
  const roleKey = resolveActiveRoleKey();
  const system = buildSystemPrompt({ moduleKey, roleKey });
  const tools = buildToolsForModule(moduleKey);

  addMessage('user', text);
  iaInput.value = '';

  startVisualizer();

  try {
    const messages = [{ role: 'user', content: text }];
    const aiData = await callAi({ messages, system, tools });

    const toolCalls = extractToolCallsFromGemini(aiData);
    for (const call of toolCalls) {
      const result = await executeToolCall(call);

      if (call.name === 'navigate_to_module' && result?.ok) {
        stopVisualizer();
        return;
      }

      if (call.name === 'create_action_plan' && result?.steps?.length) {
        addMessage('ai', `${result.title}\n- ${result.steps.join('\n- ')}`);
      }

      if (call.name === 'get_module_info') {
        addMessage('ai', `Módulo: ${result.label}\nAlcance: ${result.scope}`);
      }
    }

    const textOut = extractTextFromGemini(aiData);
    if (textOut) {
      addMessage('ai', textOut);
    } else if (!toolCalls.length) {
      addMessage('ai', 'Listo. ¿Qué más necesitas?');
    }
  } catch (err) {
    addMessage('ai', 'No pude conectar con la IA en este momento. Revisa la configuración del serverless y vuelve a intentar.');
  } finally {
    stopVisualizer();
  }
}

/* ── Events ── */
btnSend.addEventListener('click', () => processCommand(iaInput.value.trim()));
iaInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') processCommand(iaInput.value.trim());
});

quickCommandBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const command = btn.textContent.replace(/"/g, '');
    processCommand(command);
  });
});

let isListening = false;
btnMic.addEventListener('click', () => {
  isListening = !isListening;
  btnMic.classList.toggle('active', isListening);
  
  if (isListening) {
    startVisualizer();
    addMessage('ai', "Te escucho. Dime qué necesitas saber...");
  } else {
    stopVisualizer();
  }
});

/* ── Init ── */
createVisualizer();
initTheme('themeToggleIA', 'themeIconIA');
if (window.lucide) window.lucide.createIcons();

if (iaRoleSelect) {
  iaRoleSelect.value = resolveActiveRoleKey();
  iaRoleSelect.addEventListener('change', () => {
    const nextRole = iaRoleSelect.value;
    setActiveRoleKey(nextRole);
    const profile = resolveProfile(nextRole);
    addMessage('ai', `Perfil activo: ${profile.label}. ¿Qué necesitas?`);
  });
}

console.log('🚀 ARIA Live Engine inicializado');
