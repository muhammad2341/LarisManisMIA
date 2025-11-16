import React from "react";
import { Send, X, ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Product } from "../types";

type Message = { role: "user" | "bot"; content: React.ReactNode };

const pricePatterns = [/harga\s*(?:di\s*|)bawah\s*(\d+)/i, /(\d+)\s*(?:rb|ribu)/i, /<\s*(\d+)/];
const caloriePatterns = [/kalori\s*(?:di\s*|)bawah\s*(\d+)/i, /kalori\s*<\s*(\d+)/i];

function parseNumber(text: string): number | null {
  const num = text.replace(/[^0-9]/g, "");
  if (!num) return null;
  return Number(num);
}

function extractQuery(raw: string) {
  const q = raw.toLowerCase();
  let maxPrice: number | undefined;
  let maxCalories: number | undefined;
  let sortBy: "price" | undefined;
  const categoryHints: string[] = [];
  const tags: string[] = [];
  let promoOnly = false;
  let cheapHint = false;
  let skincareHint = false;

  for (const p of pricePatterns) {
    const m = q.match(p);
    if (m && m[1]) {
      const n = parseNumber(m[1]);
      if (n) {
        maxPrice = n < 1000 ? n * 1000 : n;
        break;
      }
    }
  }

  for (const p of caloriePatterns) {
    const m = q.match(p);
    if (m && m[1]) {
      const n = parseNumber(m[1]);
      if (n) {
        maxCalories = n;
        break;
      }
    }
  }

  if (q.includes("murah") || q.includes("termurah") || q.includes("rekomendasi")) {
    sortBy = "price";
    cheapHint = true;
  }

  if (/\b(skincare)\b/.test(q)) {
    categoryHints.push("Kecantikan");
    skincareHint = true;
  }
  if (/\b(kecantikan)\b/.test(q)) categoryHints.push("Kecantikan");
  if (/\b(makanan)\b/.test(q)) categoryHints.push("Makanan");
  if (/\b(minuman)\b/.test(q)) categoryHints.push("Minuman");
  if (/\b(fashion)\b/.test(q)) categoryHints.push("Fashion");
  if (/\b(aksesoris)\b/.test(q)) categoryHints.push("Aksesoris");
  if (/\b(kerajinan)\b/.test(q)) categoryHints.push("Kerajinan");
  if (/\b(toserba|sembako)\b/.test(q)) categoryHints.push("Toserba");

  if (/\b(promo|diskon|voucher|gratis)\b/.test(q)) promoOnly = true;

  if (/(berkuah|kuah|sop|soto|rawon)/.test(q)) tags.push("berkuah");
  if (/(makanan kering|kering|goreng|keripik|kerupuk|serundeng)/.test(q)) tags.push("kering");
  if (/(sembako)/.test(q)) tags.push("sembako");

  const keywords = q
    .replace(/harga|kalori|dibawah|di bawah|murah|termurah|rekomendasi|makanan|minuman|produk|yang|<|rb|ribu|berkuah|kering|sembako|promo|diskon|voucher|gratis|skincare|kecantikan|toserba/gi, " ")
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean);

  return { maxPrice, maxCalories, sortBy, keywords, categoryHints, tags, promoOnly, cheapHint, skincareHint };
}

function matchProducts(products: Product[], query: ReturnType<typeof extractQuery>): Product[] {
  let results = products;
  const haystack = (p: Product) => `${p.name} ${p.category} ${p.storeName} ${p.description}`.toLowerCase();

  if (query.categoryHints && query.categoryHints.length > 0) {
    const set = new Set(query.categoryHints);
    results = results.filter((p) => set.has(p.category));
  }

  if (query.maxPrice !== undefined) {
    results = results.filter((p) => p.price <= (query.maxPrice as number));
  }
  if (query.maxCalories !== undefined) {
    results = results.filter((p) => (p.nutritionInfo?.calories ?? 999999) <= (query.maxCalories as number));
  }

  if (query.promoOnly) {
    results = results.filter((p) => {
      const h = haystack(p);
      return h.includes("promo") || h.includes("diskon") || h.includes("voucher") || (p.originalPrice && p.price < p.originalPrice);
    });
  }

  if (query.tags?.includes("berkuah")) {
    results = results.filter((p) => {
      const h = haystack(p);
      return /(kuah|berkuah|sop|soto|rawon)/.test(h);
    });
  }
  if (query.tags?.includes("kering")) {
    results = results.filter((p) => {
      const h = haystack(p);
      return /(kering|goreng|keripik|kerupuk|serundeng|kremes)/.test(h);
    });
  }
  if (query.tags?.includes("sembako")) {
    results = results.filter((p) => {
      const h = haystack(p);
      return h.includes("sembako") || p.category === "Toserba" || /(beras|minyak|gula|kecap|mie|telur)/.test(h);
    });
  }

  if (query.keywords.length > 0) {
    const ks = query.keywords;
    results = results.filter((p) => {
      const h = haystack(p);
      return ks.every((k) => h.includes(k));
    });
  }

  if (query.cheapHint && query.maxPrice === undefined) {
    let threshold = 30000;
    if (query.skincareHint || query.categoryHints.includes("Kecantikan")) {
      threshold = 200000;
    } else if (query.categoryHints.includes("Fashion")) {
      threshold = 150000;
    } else if (query.categoryHints.includes("Toserba")) {
      threshold = 30000;
    }
    results = results.filter((p) => p.price <= threshold);
  }

  if (query.sortBy === "price") {
    results = [...results].sort((a, b) => a.price - b.price);
  }
  if (!query.maxPrice && !query.maxCalories && query.keywords.length === 0 && !query.promoOnly && (!query.tags || query.tags.length === 0) && (!query.categoryHints || query.categoryHints.length === 0)) {
    results = [...results].sort((a, b) => a.price - b.price);
  }
  return results.slice(0, 5);
}


export const BuyerChatBot: React.FC<{ products: Product[] }> = ({ products }) => {
  const [open, setOpen] = React.useState(false);
  const [input, setInput] = React.useState("");
  const [messages, setMessages] = React.useState<Message[]>([
    {
      role: "bot",
      content: (
        <div>
          Halo! Saya bisa bantu cari:
          <ul className="list-disc ml-5 mt-2">
            <li>Harga di bawah 30 ribu</li>
            <li>Kalori di bawah 100</li>
            <li>Kata kunci seperti "es krim durian"</li>
            <li>Rekomendasi termurah</li>
            <li>Keyword: makanan berkuah/kering, sembako promo, skincare murah</li>
          </ul>
        </div>
      ),
    },
  ]);
  const navigate = useNavigate();

  const LogoBadge: React.FC<{ size?: number }> = ({ size = 36 }) => (
    <div className="relative" style={{ width: size, height: size }}>
      <div className="absolute -inset-1 bg-blue-200/40 blur-md rounded-full" />
      <div className="relative inline-flex items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white" style={{ width: size, height: size }}>
        <span className="font-extrabold" style={{ fontSize: Math.max(12, size * 0.38) }}>LM</span>
      </div>
      <Sparkles className="absolute -top-1 -right-1 w-3.5 h-3.5 text-yellow-300" />
    </div>
  );

  React.useEffect(() => {
    const openHandler = () => setOpen(true);
    window.addEventListener("open-buyer-chatbot", openHandler as EventListener);
    return () => window.removeEventListener("open-buyer-chatbot", openHandler as EventListener);
  }, []);

  const send = React.useCallback(async (queryText: string) => {
    if (!queryText.trim()) return;
    const userMsg: Message = { role: "user", content: queryText };
    setMessages((prev) => [...prev, userMsg]);
    const parsed = extractQuery(queryText);
    const results = matchProducts(products, parsed);

    const useGemini = import.meta.env.VITE_USE_GEMINI === "1";
    if (useGemini) {
      try {
        const resp = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: queryText,
            context: {
              products: results.map((p) => ({
                id: p.id,
                name: p.name,
                category: p.category,
                price: p.price,
                storeId: p.storeId,
                storeName: p.storeName,
                productUrl: `/product/${p.id}`,
                storeUrl: `/store/${p.storeId}`,
              })),
            },
          }),
        });
        if (!resp.ok) {
          throw new Error(`Chat API error ${resp.status}`);
        }
        const data = await resp.json();
        const text: string | undefined = typeof data?.text === "string" ? data.text.trim() : undefined;
        if (text && text.length > 0) {
          const summary = <div className="whitespace-pre-wrap mb-2">{text}</div>;
          const list = (
            <div className="space-y-2">
              {results.length === 0 ? (
                <div>Tidak ada yang cocok di katalog saat ini.</div>
              ) : (
                results.map((p) => (
                  <div key={p.id} className="flex items-center justify-between gap-3 rounded-lg border border-neutral-200 p-2">
                    <div>
                      <div className="font-semibold">{p.name}</div>
                      <div className="text-sm">Rp {p.price.toLocaleString("id-ID")} {p.nutritionInfo?.calories ? `• ${p.nutritionInfo.calories} kkal` : ""}</div>
                      <div className="text-xs mt-1">
                        <a href={`/product/${p.id}`} className="text-blue-600 hover:underline">Lihat produk</a>
                        <span className="mx-1">·</span>
                        <a href={`/store/${p.storeId}`} className="text-blue-600 hover:underline">Kunjungi toko</a>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate(`/product/${p.id}`)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-black text-white text-sm hover:opacity-90"
                      aria-label={`Lihat ${p.name}`}
                    >
                      Lihat <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          );
          const botMsg: Message = { role: "bot", content: <div>{summary}{list}</div> };
          setMessages((prev) => [...prev, botMsg]);
          setInput("");
          return;
        }
        // If no usable text, fall back to local rules
      } catch (e) {
        // fall back to local rule-based
      }
    }

    const botMsg: Message = {
      role: "bot",
      content:
        results.length === 0 ? (
          <div>Tidak ada yang cocok. Coba ubah kata kunci atau batas harga/kalori.</div>
        ) : (
          <div className="space-y-2">
            {results.map((p) => (
              <div key={p.id} className="flex items-center justify-between gap-3 rounded-lg border border-neutral-200 p-2">
                <div>
                  <div className="font-semibold">{p.name}</div>
                  <div className="text-sm">Rp {p.price.toLocaleString("id-ID")} {p.nutritionInfo?.calories ? `• ${p.nutritionInfo.calories} kkal` : ""}</div>
                  <div className="text-xs mt-1">
                    <a href={`/product/${p.id}`} className="text-blue-600 hover:underline">Lihat produk</a>
                    <span className="mx-1">·</span>
                    <a href={`/store/${p.storeId}`} className="text-blue-600 hover:underline">Kunjungi toko</a>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/product/${p.id}`)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-black text-white text-sm hover:opacity-90"
                  aria-label={`Lihat ${p.name}`}
                >
                  Lihat <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ),
    };

    setMessages((prev) => [...prev, botMsg]);
    setInput("");
  }, [products, navigate]);

  React.useEffect(() => {
    const onQuery = (e: Event) => {
      const ce = e as CustomEvent<{ query?: string }>;
      setOpen(true);
      const q = ce?.detail?.query || "";
      if (q) {
        setTimeout(() => {
          // fire and forget
          void send(q);
        }, 0);
      }
    };
    window.addEventListener("buyer-chatbot-query", onQuery as EventListener);
    return () => window.removeEventListener("buyer-chatbot-query", onQuery as EventListener);
  }, [send]);

  const quicks = ["Makanan berkuah", "Sembako promo", "Makanan kering", "Skincare murah"];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div className="mb-3 w-[min(96vw,560px)] rounded-3xl border border-neutral-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200 bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-3xl">
            <div className="flex items-center gap-3 font-semibold text-black">
              <LogoBadge size={38} />
              <span className="font-extrabold">Tanyakan AI Laris Manis</span>
            </div>
            <button className="p-1 rounded hover:bg-neutral-100" aria-label="Tutup chat" onClick={() => setOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="max-h-[60vh] overflow-y-auto px-5 py-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
                <div className={`inline-block rounded-2xl px-3 py-2 ${m.role === "user" ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white" : "bg-neutral-100 text-black"}`}>
                  {m.content}
                </div>
              </div>
            ))}
          </div>

          <div className="px-5 pb-3 flex flex-wrap gap-2">
            {quicks.map((q) => (
              <button key={q} onClick={() => send(q)} className="rounded-full bg-blue-50 text-blue-700 px-3 py-1.5 text-sm hover:bg-blue-100 border border-blue-200">
                {q}
              </button>
            ))}
          </div>

          <form
            className="flex items-center gap-2 border-t border-neutral-200 p-3"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tanyakan: harga < 30000, kalori < 100, ..."
              className="flex-1 rounded-xl border border-neutral-300 px-4 py-3.5 focus:outline-none"
            />
            <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-3.5 text-white font-semibold">
              <Send className="w-4 h-4" /> Kirim
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-white shadow-xl hover:opacity-90 ring-4 ring-purple-200/40"
        aria-expanded={open}
        aria-controls="buyer-chatbot"
      >
        <LogoBadge size={28} />
        <span className="font-extrabold tracking-tight">Tanyakan AI Laris Manis</span>
      </button>
    </div>
  );
};

export default BuyerChatBot;
