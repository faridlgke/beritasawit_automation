export async function POST() {
  return new Response(JSON.stringify({ ok: true }), {
    headers: { "content-type": "application/json", "cache-control": "no-store", "set-cookie": "sesi=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax" },
  });
}
