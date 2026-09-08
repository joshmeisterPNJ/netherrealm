// netherRealm build — one source, two targets.
//   dist/nightform.html  fragment, for publishing as a Claude Artifact (has cross-device sync)
//   docs/index.html      standalone page, for GitHub Pages (per-device storage)
import fs from "node:fs";
import { icon } from "./tools/mkicon.mjs";

const cities = JSON.parse(fs.readFileSync("data/cities.json", "utf8"));
const venues = JSON.parse(fs.readFileSync("data/venues.json", "utf8"));
const tpl    = fs.readFileSync("src/app.html", "utf8");

const app = tpl.replace("/*__DATA__*/", JSON.stringify({ cities, venues }));

// ---- target 1: artifact fragment ----
fs.mkdirSync("dist", { recursive: true });
fs.writeFileSync("dist/nightform.html", app);

// ---- target 2: standalone document ----
const SPLIT = '\n<canvas id="stage">';
const cut = app.indexOf(SPLIT);
if (cut < 0) throw new Error("could not find the head/body split point");
const head = app.slice(0, cut);
const body = app.slice(cut);

const DESC = "Electronic music venues in London, Paris, Berlin and Amsterdam, mapped by city colour and intensity.";
const standalone = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="description" content="${DESC}">
<meta name="theme-color" content="#050506">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="netherRealm">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" href="icon-192.png" sizes="192x192">
<link rel="apple-touch-icon" href="icon-192.png">
<style>html,body{margin:0;background:#050506}img{max-width:100%}[hidden]{display:none!important}</style>
${head}
</head>
<body>
${body}
</body>
</html>
`;

fs.mkdirSync("docs", { recursive: true });
fs.writeFileSync("docs/index.html", standalone);
fs.writeFileSync("docs/.nojekyll", "");
fs.writeFileSync("docs/manifest.webmanifest", JSON.stringify({
  name: "netherRealm", short_name: "netherRealm", description: DESC,
  start_url: "./", scope: "./", display: "standalone",
  background_color: "#050506", theme_color: "#050506", orientation: "any",
  icons: [
    { src: "icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
    { src: "icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" }
  ]
}, null, 2));
fs.writeFileSync("docs/icon-192.png", icon(192));
fs.writeFileSync("docs/icon-512.png", icon(512));

const kb = n => (fs.statSync(n).size / 1024).toFixed(1) + "KB";
console.log(`venues   ${venues.length} across ${Object.keys(cities).length} cities`);
console.log(`artifact dist/nightform.html  ${kb("dist/nightform.html")}`);
console.log(`pages    docs/index.html      ${kb("docs/index.html")}  + manifest + icons`);
