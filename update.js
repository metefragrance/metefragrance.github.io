import fs from "fs";

const event = JSON.parse(
  fs.readFileSync(process.env.GITHUB_EVENT_PATH, "utf8")
);

const type = event.event_type;
const p = event.client_payload || {};

if (type !== "add") {
  console.log("ADD dışı event, çıkılıyor:", type);
  process.exit(0);
}

const FILE = "index.html";
let html = fs.readFileSync(FILE, "utf8");

const MARK = "<!-- ADMIN_AUTO_INSERT -->";

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

console.log("ADD: ürün başarıyla eklendi");
process.exit(0);
