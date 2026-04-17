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

    const body = event.body ? JSON.parse(event.body) : {};
    const { text } = body || {};

    if (!text || typeof text !== "string" || text.trim() === "") {
      return json(400, { error: "Missing or empty text field" });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${encodeURIComponent(apiKey)}`;

    const resp = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        model: "models/text-embedding-004",
        content: { parts: [{ text }] },
      }),
    });

    const data = await resp.json().catch(() => ({}));

    if (!resp.ok) {
      return json(resp.status, { error: "Gemini error", data });
    }

    const embedding = data?.embedding?.values;

    return json(200, { ok: true, embedding });
  } catch (err) {
    return json(500, {
      error: "Unhandled error",
      message: err?.message || String(err),
    });
  }
};
