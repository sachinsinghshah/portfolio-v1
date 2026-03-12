import https from "https";
import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const sites = [
  { slug: "webscrapinghq",  url: "https://www.webscrapinghq.com/" },
  { slug: "lawly-ai-saas",  url: "https://lawly-ai-saas.vercel.app" },
  { slug: "shah-properties", url: "https://shah-properties.vercel.app/" },
  { slug: "chat-app-v1",   url: "https://chat-app-v1-prod.onrender.com/login" },
];

const outputDir = path.join(__dirname, "../public/screenshots");
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

function download(url, dest, redirectCount = 0) {
  return new Promise((resolve, reject) => {
    if (redirectCount > 5) return reject(new Error("Too many redirects"));

    const protocol = url.startsWith("https") ? https : http;
    const file = fs.createWriteStream(dest);

    protocol
      .get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (response) => {
        if (response.statusCode === 301 || response.statusCode === 302) {
          file.close();
          fs.unlink(dest, () => {});
          const location = response.headers.location;
          const next = location.startsWith("http") ? location : new URL(location, url).href;
          download(next, dest, redirectCount + 1).then(resolve).catch(reject);
          return;
        }
        if (response.statusCode !== 200) {
          file.close();
          fs.unlink(dest, () => {});
          reject(new Error(`HTTP ${response.statusCode}`));
          return;
        }
        response.pipe(file);
        file.on("finish", () => { file.close(); resolve(); });
      })
      .on("error", (err) => {
        fs.unlink(dest, () => {});
        reject(err);
      });
  });
}

for (const { slug, url } of sites) {
  // thum.io: free screenshot service, no API key required
  // width/1200 = capture at 1200px viewport, crop/800 = take top 800px
  const screenshotUrl = `https://image.thum.io/get/width/1200/crop/800/noanimate/${url}`;
  const dest = path.join(outputDir, `${slug}.png`);

  try {
    process.stdout.write(`Capturing ${slug}... `);
    await download(screenshotUrl, dest);
    const size = (fs.statSync(dest).size / 1024).toFixed(1);
    console.log(`✓  saved (${size} KB)`);
  } catch (err) {
    console.log(`✗  failed — ${err.message}`);
  }
}

console.log("\nDone. Screenshots saved to public/screenshots/");
