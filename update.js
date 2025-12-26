import fs from "fs";

const event = JSON.parse(
  fs.readFileSync(process.env.GITHUB_EVENT_PATH,"utf8")
);

const p = event.client_payload;
let html = fs.readFileSync("index.html","utf8");
const MARK = "<!-- ADMIN_AUTO_INSERT -->";

/* SİL */
if (event.action === "delete") {
  const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
  const rgx = new RegExp(
    `<a class="card"[\\s\\S]*?href="${esc(p.link)}"[\\s\\S]*?<\\/a>`,
    "g"
  );
  html = html.replace(rgx,"");
  fs.writeFileSync("index.html",html);
  process.exit(0);
}

/* EKLE */
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

if (!html.includes(MARK)) {
  throw new Error("ADMIN_AUTO_INSERT marker bulunamadı");
}

html = html.replace(MARK, card + "\n" + MARK);
fs.writeFileSync("index.html", html);
