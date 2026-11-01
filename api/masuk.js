// Periksa username dan password di server. Yang tersimpan di env cuma hash scrypt,
// format "garam:hash", boleh beberapa dipisah spasi.
import { createHmac, scryptSync, timingSafeEqual } from "node:crypto";

const UMUR_DETIK = 14 * 24 * 3600;

function balas(status, isi, kepala = {}) {
  return new Response(JSON.stringify(isi), { status, headers: { "content-type": "application/json", "cache-control": "no-store", ...kepala } });
}

function samaTeks(a, b) {
  const x = Buffer.from(String(a)), y = Buffer.from(String(b));
  return x.length === y.length && timingSafeEqual(x, y);
}

function passwordBenar(password) {
  return (process.env.AUTH_PASS_HASH || "").split(/\s+/).filter(Boolean).some((baris) => {
    const [garam, hash] = baris.split(":");
    const harap = Buffer.from(hash || "", "hex");
    return harap.length > 0 && timingSafeEqual(scryptSync(String(password), garam, harap.length), harap);
  });
}

export async function POST(request) {
  const rahasia = process.env.AUTH_RAHASIA;
  if (!rahasia || !process.env.AUTH_USER) return balas(503, { ok: false, alasan: "Login belum disiapkan." });
  let isi;
  try {
    isi = await request.json();
  } catch {
    return balas(400, { ok: false, alasan: "Permintaan tidak sah." });
  }
  // Jeda kecil supaya menebak password berulang jadi lambat.
  await new Promise((r) => setTimeout(r, 400));
  if (!samaTeks(isi.username || "", process.env.AUTH_USER) || !passwordBenar(isi.password || "")) {
    return balas(401, { ok: false, alasan: "Username atau password salah." });
  }
  const habis = String(Math.floor(Date.now() / 1000) + UMUR_DETIK);
  const sah = createHmac("sha256", rahasia).update(habis).digest("hex");
  return balas(200, { ok: true }, { "set-cookie": `sesi=${habis}.${sah}; Path=/; Max-Age=${UMUR_DETIK}; HttpOnly; Secure; SameSite=Lax` });
}
