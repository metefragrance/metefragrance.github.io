import fs from "fs";

const p = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH,"utf8")).client_payload;
let html = fs.readFileSync("index.html","utf8");
const m = "<!-- ADMIN_AUTO_INSERT -->";

const card = `
<a class="card" data-name="${p.name}" href="${p.link}" target="_blank" rel="noopener">
  <img class="thumb" src="${p.img}" alt="${p.name}" loading="lazy">
  <div class="info"><div class="title">${p.name}</div><div class="price">${p.price} TL</div></div>
</a>
`;

if (!html.includes(m)) throw new Error("ADMIN_AUTO_INSERT marker yok");
fs.writeFileSync("index.html", html.replace(m, card + "\n" + m));
