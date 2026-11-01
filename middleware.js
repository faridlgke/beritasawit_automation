// Gerbang login semua halaman (pemilik 1 November 2026). Jalan di server Vercel
// sebelum berkas apa pun dikirim, jadi halaman dan isinya tidak terkirim sebelum
// masuk. Rahasia hilang berarti semua ditolak, bukan semua dibuka.
const BEBAS = new Set(["/login", "/login.html", "/api/masuk", "/favicon.ico"]);

export const config = { matcher: "/:path*" };

async function tanda(teks, rahasia) {
  const kunci = await crypto.subtle.importKey("raw", new TextEncoder().encode(rahasia), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const hasil = await crypto.subtle.sign("HMAC", kunci, new TextEncoder().encode(teks));
  return Array.from(new Uint8Array(hasil), (b) => b.toString(16).padStart(2, "0")).join("");
}

async function sesiSah(request) {
  const rahasia = process.env.AUTH_RAHASIA;
  if (!rahasia) return false;
  const m = (request.headers.get("cookie") || "").match(/(?:^|;\s*)sesi=(\d+)\.([0-9a-f]{64})/);
  if (!m || Number(m[1]) < Date.now() / 1000) return false;
  const benar = await tanda(m[1], rahasia);
  let beda = 0;
  for (let i = 0; i < 64; i++) beda |= benar.charCodeAt(i) ^ m[2].charCodeAt(i);
  return beda === 0;
}

export default async function middleware(request) {
  const url = new URL(request.url);
  if (BEBAS.has(url.pathname) || (await sesiSah(request))) {
    return new Response(null, { headers: { "x-middleware-next": "1" } });
  }
  if (url.pathname.startsWith("/api/")) {
    return new Response(JSON.stringify({ ok: false, alasan: "Sesi habis, silakan masuk lagi." }), {
      status: 401, headers: { "content-type": "application/json", "cache-control": "no-store" },
    });
  }
  const lanjut = encodeURIComponent(url.pathname + url.search);
  return new Response(null, { status: 302, headers: { location: `/login?lanjut=${lanjut}`, "cache-control": "no-store" } });
}
