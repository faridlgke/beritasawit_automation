// Tombol pindah antar web automation di pojok kanan atas (3 November 2026).
// Satu berkas yang sama disalin ke lima web: PURNA, Sudut Periferal, garisbesarnya,
// BeritaSawit, FYGO. Kalau mengubah daftar, ubah di kelimanya.
// Warna mengikuti token halaman (--bg, --ink, --rule-2, --accent) dengan cadangan.
(function () {
  var WEB = [
    { nama: "PURNA", url: "https://purnaautomation.vercel.app", host: "purnaautomation.vercel.app", warna: "#C9B27E", review: true },
    { nama: "Sudut Periferal", url: "https://sudutperipheralautomation.vercel.app", host: "sudutperipheralautomation.vercel.app", warna: "#D11F26", review: true },
    { nama: "garisbesarnya", url: "https://www.garisbesarnya.my.id", host: "www.garisbesarnya.my.id", warna: "#F5C518", review: true },
    { nama: "BeritaSawit", url: "https://beritasawitautomation.vercel.app", host: "beritasawitautomation.vercel.app", warna: "#0DAC03", review: true },
    { nama: "FYGO", url: "https://globallyautomation.vercel.app", host: "globallyautomation.vercel.app", warna: "#5B86FF", review: false },
  ];
  var host = location.hostname.replace(/^garisbesarnya\.my\.id$/, "www.garisbesarnya.my.id");
  var diReview = /^\/review/.test(location.pathname);

  var gaya = document.createElement("style");
  gaya.textContent =
    "#pindah{position:absolute;top:12px;right:12px;z-index:9999;font:500 13px/1.2 system-ui,-apple-system,'Segoe UI',sans-serif}" +
    "#pindah.sebaris{position:relative;top:auto;right:auto;z-index:50;box-shadow:none}" +
    "#pindah.sebaris>button{box-shadow:none;padding:6px 11px}" +
    "#pindah>button{white-space:nowrap;display:flex;align-items:center;gap:7px;padding:7px 12px;border-radius:999px;cursor:pointer;" +
    "background:var(--bg,#fff);color:var(--ink,#111);border:1px solid var(--rule-2,#ccc);box-shadow:0 2px 10px rgba(0,0,0,.18);font:inherit}" +
    "#pindah>button:hover{border-color:var(--accent,#333)}" +
    "#pindah>button:focus-visible,#pindah a:focus-visible{outline:2px solid var(--accent,#333);outline-offset:2px}" +
    "#pindah .pnd-panah{font-size:10px;opacity:.7;transition:transform .15s}" +
    "#pindah[data-buka] .pnd-panah{transform:rotate(180deg)}" +
    "#pindah ul{list-style:none;margin:6px 0 0;padding:6px;position:absolute;right:0;min-width:210px;border-radius:12px;" +
    "background:var(--bg,#fff);border:1px solid var(--rule-2,#ccc);box-shadow:0 10px 30px rgba(0,0,0,.25)}" +
    "#pindah ul[hidden]{display:none}" +
    "#pindah a{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:8px;color:var(--ink,#111);text-decoration:none}" +
    "#pindah a:hover{background:var(--hover,rgba(127,127,127,.12))}" +
    "#pindah a[aria-current]{font-weight:700}" +
    "#pindah a[aria-current]::after{content:'di sini';margin-left:auto;font-size:11px;font-weight:500;opacity:.6}" +
    "#pindah .pnd-titik{width:9px;height:9px;border-radius:50%;flex:none;box-shadow:0 0 0 1px rgba(127,127,127,.35)}" +
    "@media (prefers-reduced-motion:reduce){#pindah .pnd-panah{transition:none}}";
  document.head.appendChild(gaya);

  var kini = WEB.filter(function (w) { return w.host === host; })[0];
  var bungkus = document.createElement("nav");
  bungkus.id = "pindah";
  bungkus.setAttribute("aria-label", "Pindah ke web brand lain");
  var tombol = document.createElement("button");
  tombol.type = "button";
  tombol.setAttribute("aria-expanded", "false");
  tombol.setAttribute("aria-controls", "pindah-daftar");
  tombol.innerHTML = '<span class="pnd-titik"></span><span class="pnd-nama"></span><span class="pnd-panah" aria-hidden="true">▼</span>';
  tombol.querySelector(".pnd-titik").style.background = kini ? kini.warna : "transparent";
  tombol.querySelector(".pnd-nama").textContent = kini ? kini.nama : "Pindah brand";
  var daftar = document.createElement("ul");
  daftar.id = "pindah-daftar";
  daftar.hidden = true;
  WEB.forEach(function (w) {
    var li = document.createElement("li");
    var a = document.createElement("a");
    a.href = w.url + (diReview && w.review ? "/review" : "/");
    if (w === kini) a.setAttribute("aria-current", "page");
    var t = document.createElement("span");
    t.className = "pnd-titik";
    t.style.background = w.warna;
    a.appendChild(t);
    a.appendChild(document.createTextNode(w.nama));
    li.appendChild(a);
    daftar.appendChild(li);
  });
  bungkus.appendChild(tombol);
  bungkus.appendChild(daftar);

  function atur(buka) {
    daftar.hidden = !buka;
    tombol.setAttribute("aria-expanded", String(buka));
    if (buka) bungkus.setAttribute("data-buka", "");
    else bungkus.removeAttribute("data-buka");
  }
  tombol.addEventListener("click", function () { atur(daftar.hidden); });
  document.addEventListener("click", function (e) { if (!bungkus.contains(e.target)) atur(false); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !daftar.hidden) { atur(false); tombol.focus(); }
  });

  // Halaman yang sudah punya navigasi di kanan atas (review) memasang tombolnya di
  // ujung navigasi itu, supaya tidak menimpa tautan yang ada. Halaman lain mengapung.
  function pasang() {
    var slot = document.querySelector("[data-pindah], header.laman nav");
    if (slot) {
      bungkus.className = "sebaris";
      slot.appendChild(bungkus);
    } else {
      document.body.appendChild(bungkus);
    }
  }
  if (document.body) pasang();
  else document.addEventListener("DOMContentLoaded", pasang);
})();
