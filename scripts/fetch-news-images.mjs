// Reads the story links in src/data/portfolio-news.ts, then pulls each publisher's own
// og:image, og:title and publication date. Images are written to public/images/news/.
// Run with: node scripts/fetch-news-images.mjs
import { mkdir, writeFile } from "node:fs/promises";
import { readFileSync } from "node:fs";

const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36";
const OUT = "public/images/news";

const source = readFileSync("src/data/portfolio-news.ts", "utf8");
const entries = [...source.matchAll(/"company":\s*"([^"]+)",\s*"url":\s*"([^"]+)"/g)]
  .map(([, company, url]) => ({ company, url }));

const meta = (html, ...names) => {
  for (const name of names) {
    const match = html.match(new RegExp(`<meta[^>]+(?:property|name)=["']${name}["'][^>]+content=["']([^"']+)["']`, "i"))
      ?? html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${name}["']`, "i"));
    if (match) return match[1];
  }
  return null;
};

await mkdir(OUT, { recursive: true });
const results = [];

for (const { company, url } of entries) {
  const slug = new URL(url).pathname.split("/").filter(Boolean).pop().replace(/\.html?$/, "").slice(0, 60);
  try {
    const html = await fetch(url, { headers: { "user-agent": UA } }).then((r) => r.text());
    const image = meta(html, "og:image", "twitter:image");
    const title = meta(html, "og:title") ?? null;
    const date = meta(html, "article:published_time", "datePublished", "date") ?? null;

    let file = null;
    if (image) {
      const absolute = new URL(image, url).href;
      const response = await fetch(absolute, { headers: { "user-agent": UA, referer: url } });
      if (response.ok) {
        const buffer = Buffer.from(await response.arrayBuffer());
        const extension = (absolute.match(/\.(jpe?g|png|webp)(?:\?|$)/i)?.[1] ?? "jpg").toLowerCase();
        file = `${OUT}/${slug}.${extension}`;
        await writeFile(file, buffer);
      }
    }
    results.push({ company, url, title, date, image, file });
    console.log(`${file ? "ok  " : "none"} ${company} — ${file ?? image ?? "no og:image"}`);
  } catch (error) {
    results.push({ company, url, error: String(error) });
    console.log(`fail ${company} — ${error}`);
  }
}

await writeFile(`${OUT}/_fetch-report.json`, JSON.stringify(results, null, 2));
