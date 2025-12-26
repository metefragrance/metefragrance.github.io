import fs from "fs";

/* GitHub event datasını oku */
const event = JSON.parse(
  fs.readFileSync(process.env.GITHUB_EVENT_PATH, "utf8")
);

/*
  repository_dispatch event yapısı:
  event.event_type -> "add" | "delete"
  event.client_payload -> gönderdiğin veriler
*/
const type = event.event_type;
const p = event.client_payload || {};

/* index.html oku */
let html = fs.readFileSync("index.html", "utf8");

/* Marker */
const MARK = "<!-- ADMIN_AUTO_INSERT -->";

/* =======================
   DELETE (ÜRÜN SİL)
   ======================= */
if (type === "delete") {
  if (!p.link) {
    console.log("DELETE: link yok, çıkılıyor");
    process.exit(0);
  }

  // regex için escape
  const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const regex = new RegExp(
    `<a class="card"[\\s\\S]*?href="${esc(p.link)}"[\\s\\S]*?<\\/a>`,
    "g"
  );

  const before = html.length;
  html = html.replace(regex, "");
  const after = html.length;

  fs.writeFileSync("index.html", html);

  console.log(
    after < before
      ? "DELETE: ürün silindi"
      : "DELETE: eşleşen ürün bulunamadı"
  );

  process.exit(0);
}

/* =======================
   ADD (ÜRÜN EKLE)
   ======================= */
if (type === "add") {
  if (!html.includes(MARK)) {
    throw new Error("ADMIN_AUTO_INSERT marker bulunamadı");
  }

  const badgeHtml = p.badge
    ? `<span class="badge">${p.badge}</span>`
    : "";

  const card = `
<a class="card" data-name="${p.name}" href="${p.link}" target="_blank" rel="noopener">
  ${badgeHtml}
  <img class="thumb" src="${p.img}" alt="${p.name}" loading="lazy">
  <div class="info">
    <div class="title">${p.name}</div>
    <div class="price">${p.price} TL</div>
  </div>
</a>
`;

  html = html.replace(MARK, card + "\n" + MARK);
  fs.writeFileSync("index.html", html);

  console.log("ADD: ürün eklendi");
  process.exit(0);
}

/* =======================
   DİĞER DURUM
   ======================= */
console.log("Bilinmeyen event_type:", type);
process.exit(0);
