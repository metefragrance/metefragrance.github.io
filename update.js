import fs from "fs";

const event = JSON.parse(
  fs.readFileSync(process.env.GITHUB_EVENT_PATH, "utf8")
);

const type = event.event_type;
const p = event.client_payload || {};

let html = fs.readFileSync("index.html", "utf8");
const MARK = "<!-- ADMIN_AUTO_INSERT -->";

/* =======================
   DELETE (GARANTİLİ)
   ======================= */
if (type === "delete") {
  if (!p.link) {
    console.log("DELETE: link yok");
    process.exit(0);
  }

  const before = html;

  // card bloğunu linke göre sil (daha esnek)
  html = html.replace(
    new RegExp(
      `<a[^>]+class="card"[\\s\\S]*?href="${p.link.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}"[\\s\\S]*?<\\/a>`,
      "i"
    ),
    ""
  );

  if (html === before) {
    console.log("DELETE: eşleşme yok, commit zorlanıyor");
    html += `\n<!-- delete-attempt:${Date.now()} -->\n`;
  }

  fs.writeFileSync("index.html", html);
  console.log("DELETE: işlem tamam");
  process.exit(0);
}

/* =======================
   ADD
   ======================= */
if (type === "add") {
  if (!html.includes(MARK)) {
    throw new Error("ADMIN_AUTO_INSERT marker yok");
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

console.log("Bilinmeyen event:", type);
process.exit(0);
