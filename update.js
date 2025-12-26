import fs from "fs";

const event = JSON.parse(
  fs.readFileSync(process.env.GITHUB_EVENT_PATH, "utf8")
);

const type = event.event_type;
const p = event.client_payload || {};

const FILE = "index.html";
let html = fs.readFileSync(FILE, "utf8");

const MARK = "<!-- ADMIN_AUTO_INSERT -->";

/* =======================
   DELETE – GARANTİLİ
   ======================= */
if (type === "delete") {
  if (!p.link) {
    console.log("DELETE: link yok");
    process.exit(0);
  }

  const before = html;

  const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  html = html.replace(
    new RegExp(
      `<a[^>]*class="card"[\\s\\S]*?href="${esc(p.link)}"[\\s\\S]*?<\\/a>`,
      "gi"
    ),
    ""
  );

  // ⚠️ Eğer regex bir şey silemediyse bile
  // dosyayı MUTLAKA değiştiriyoruz
  if (html === before) {
    html += `\n<!-- FORCE_DELETE ${Date.now()} -->\n`;
    console.log("DELETE: eşleşme yoktu, zorunlu değişiklik eklendi");
  } else {
    console.log("DELETE: ürün silindi");
  }

  fs.writeFileSync(FILE, html);
  process.exit(0);
}

/* =======================
   ADD
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
  fs.writeFileSync(FILE, html);

  console.log("ADD: ürün eklendi");
  process.exit(0);
}

console.log("Bilinmeyen event_type:", type);
process.exit(0);
