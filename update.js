import fs from "fs";

const payload = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH,"utf8"));
const p = payload.client_payload;

const p = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH,"utf8")).client_payload;
let html = fs.readFileSync("index.html","utf8");
const marker = "<!-- ADMIN_AUTO_INSERT -->";
const m = "<!-- ADMIN_AUTO_INSERT -->";

const card = `
<a class="card" data-name="${p.name}" href="${p.link}" target="_blank" rel="noopener">
  <img class="thumb" src="${p.img}" alt="${p.name}" loading="lazy">
  <div class="info">
    <div class="title">${p.name}</div>
    <div class="price">${p.price} TL</div>
  </div>
  <div class="info"><div class="title">${p.name}</div><div class="price">${p.price} TL</div></div>
</a>
`;

if(!html.includes(marker)) throw new Error("Marker yok");
html = html.replace(marker, card + "\n" + marker);
fs.writeFileSync("index.html", html);
if (!html.includes(m)) throw new Error("ADMIN_AUTO_INSERT marker yok");
fs.writeFileSync("index.html", html.replace(m, card + "\n" + m));
