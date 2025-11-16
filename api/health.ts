export default async function handler(_req: any, res: any) {
  const ok = true;
  const gemini = Boolean(process.env.GEMINI_API_KEY);
  res.setHeader("Content-Type", "application/json");
  res.status(200).send(JSON.stringify({ ok, gemini }));
}
