import { GoogleGenerativeAI } from "@google/generative-ai";

function mapModelName(name: string) {
  const n = (name || "").trim();
  if (
    n === "gemini-1.5-flash" ||
    n === "gemini-1.5-flash-latest" ||
    n === "gemini-1.0-pro" ||
    n === "gemini-1.0-pro-latest"
  ) {
    return "gemini-pro-latest";
  }
  return n || "gemini-pro-latest";
}

export default async function handler(req: any, res: any) {
  try {
    if (req.method !== "POST") {
      res.status(405).json({ error: "Method not allowed" });
      return;
    }

    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      res.status(503).json({ error: "Gemini not configured on server" });
      return;
    }

    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    const { query, context } = body;
    if (!query || typeof query !== "string") {
      res.status(400).json({ error: "Invalid 'query'" });
      return;
    }

    const genAI = new GoogleGenerativeAI(key);
    const modelName = mapModelName(process.env.GEMINI_MODEL || "gemini-pro-latest");
    const model = genAI.getGenerativeModel({ model: modelName });

    const system = `Anda adalah asisten belanja untuk platform UMKM Laris Manis.
Aturan ketat:
- HANYA gunakan data yang diberikan pada KONTEKS sebagai sumber kebenaran.
- Jangan mengarang produk/merk/harga yang tidak ada di KONTEKS.
- Jawab singkat dalam bahasa Indonesia (1-2 kalimat ringkas), sebagai pengantar.
- Jangan mencetak ulang semua detail; daftar produk akan dirender oleh klien.
- Jika tidak ada yang relevan, katakan ringkas bahwa tidak ditemukan di katalog.`;
    const contextText = context ? `\nKONTEKS:\n${JSON.stringify(context).slice(0, 6000)}` : "";
    const prompt = `${system}\n\nPERTANYAAN PENGGUNA:\n${query}${contextText}`;

    const result = await model.generateContent(prompt);
    const text = result && result.response && typeof result.response.text === "function" ? result.response.text() : "";
    res.status(200).json({ text });
  } catch (e: any) {
    const errPayload: any = {
      error: "Chat failed",
      message: e?.message || String(e),
      name: e?.name,
      status: e?.status,
    };
    try {
      if (e?.response) {
        errPayload.sdk = { hasResponse: true, responseKeys: Object.keys(e.response || {}) };
      }
    } catch {}
    res.status(500).json(errPayload);
  }
}
