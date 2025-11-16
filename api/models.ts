export default async function handler(_req: any, res: any) {
  try {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      res.status(503).json({ error: "Gemini not configured" });
      return;
    }

    const r = await fetch("https://generativelanguage.googleapis.com/v1beta/models", {
      headers: { "x-goog-api-key": key },
    });
    const j = await r.json();
    res.status(r.ok ? 200 : r.status).json(j);
  } catch (e: any) {
    res.status(500).json({ error: "List models failed", message: e?.message || String(e) });
  }
}
