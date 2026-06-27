import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// In-memory cache (per server instance) so we never re-translate the same string.
const cache = new Map<string, string>();

async function translateOne(text: string, to: string): Promise<string> {
  const key = `${to}::${text}`;
  const cached = cache.get(key);
  if (cached !== undefined) return cached;

  try {
    // Free Google translate endpoint (no key). Called server-side to avoid CORS.
    const url =
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${encodeURIComponent(to)}&dt=t&q=` +
      encodeURIComponent(text);
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!res.ok) throw new Error('translate http ' + res.status);
    const data = await res.json();
    const out: string = Array.isArray(data?.[0]) ? data[0].map((s: any) => s?.[0] || '').join('') : '';
    const result = out || text;
    cache.set(key, result);
    return result;
  } catch {
    return text; // graceful fallback — show original if translation fails
  }
}

// POST { texts: string[], to?: 'ur' } -> { translations: string[] } (aligned to input order)
export async function POST(request: Request) {
  try {
    const { texts, to = 'ur' } = await request.json();
    if (!Array.isArray(texts)) return NextResponse.json({ translations: [] });

    // Limit + run with small concurrency so we don't hammer the endpoint.
    const list: string[] = texts.slice(0, 400).map((t) => String(t ?? ''));
    const results: string[] = new Array(list.length);
    const CONCURRENCY = 8;
    let i = 0;
    async function worker() {
      while (i < list.length) {
        const idx = i++;
        results[idx] = await translateOne(list[idx], to);
      }
    }
    await Promise.all(Array.from({ length: Math.min(CONCURRENCY, list.length) }, worker));

    return NextResponse.json({ translations: results });
  } catch (e: any) {
    return NextResponse.json({ translations: [], error: e?.message }, { status: 500 });
  }
}
