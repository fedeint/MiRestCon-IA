function json(statusCode, payload) {
  return {
    statusCode,
    headers: {
      "content-type": "application/json",
      "access-control-allow-origin": "*",
      "access-control-allow-headers": "content-type",
      "access-control-allow-methods": "POST,OPTIONS",
    },
    body: JSON.stringify(payload),
  };
}

exports.handler = async (event) => {
  try {
    if (event.httpMethod === "OPTIONS") {
      return json(200, { ok: true });
    }

    if (event.httpMethod !== "POST") {
      return json(405, { error: "Method Not Allowed" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return json(500, { error: "Missing GEMINI_API_KEY" });
    }

    const payload = event.body ? JSON.parse(event.body) : {};
    const { messages, system, tools, toolConfig, model } = payload || {};

    const finalModel = model || "gemini-1.5-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(finalModel)}:generateContent?key=${encodeURIComponent(apiKey)}`;

    const contents = [];
    if (system) {
      contents.push({ role: "user", parts: [{ text: `SYSTEM:\n${system}` }] });
    }

    if (Array.isArray(messages)) {
      for (const m of messages) {
        const role = m?.role === "assistant" ? "model" : "user";
        const text = String(m?.content ?? "");
        contents.push({ role, parts: [{ text }] });
      }
    }

    const body = { contents };
    if (Array.isArray(tools) && tools.length) body.tools = tools;
    if (toolConfig) body.toolConfig = toolConfig;

    const resp = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      return json(resp.status, { error: "Gemini error", data });
    }

    return json(200, { ok: true, data });
  } catch (err) {
    return json(500, {
      error: "Unhandled error",
      message: err?.message || String(err),
    });
  }
};
