// Downloads each portfolio company's own logo from its own website into
// public/images/logos/. These are third-party trademarks used to identify AMED's
// investments — they are never generated or recreated, only fetched from source.
//
// Usage: node scripts/fetch-company-logos.mjs
// Prints a per-company report; anything marked MISS needs an official asset dropped in by hand.

import { mkdir, writeFile } from "node:fs/promises";

const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125 Safari/537.36";
const OUT = "public/images/logos";

const targets = [
  { slug: "imperative-care", site: "https://imperativecare.com/" },
  { slug: "supira-medical", site: "https://supiramedical.com/" },
  { slug: "instylla", site: "https://instylla.com/" },
  { slug: "kandu", site: "https://kandu.com/" },
  { slug: "tioga-medical", site: "https://tiogacardiovascular.com/" },
  { slug: "adona-medical", site: "https://adonamed.com/" },
  { slug: "truvic-medical", site: "https://truvicmedical.com/" },
  { slug: "atia-vision", site: "https://atiavision.com/" },
  { slug: "tulavi-therapeutics", site: "https://tulavi.com/" },
  { slug: "rejoni", site: "https://rejoni.com/" },
  { slug: "neurolutions", site: "https://www.neurolutions.com/" },
  { slug: "nuvera-medical", site: "https://nuveramedical.com/" },
  { slug: "ostial-corporation", site: "https://ostialflash.com/" },
  { slug: "akura-medical", site: "https://www.akuramedical.com/" },
  { slug: "sealonix", site: "https://sealonix.com/" },
];

const get = async (url, as = "text") => {
  const response = await fetch(url, { headers: { "user-agent": UA }, redirect: "follow", signal: AbortSignal.timeout(20000) });
  if (!response.ok) throw new Error(`${response.status}`);
  return as === "text" ? response.text() : Buffer.from(await response.arrayBuffer());
};

/** Ranked logo candidates: an explicit logo image beats an icon, which beats the social card. */
const candidates = (html, base) => {
  const found = [];
  const push = (raw, score) => {
    if (!raw) return;
    try { found.push({ url: new URL(raw.replace(/&amp;/g, "&"), base).href, score }); } catch {}
  };

  for (const tag of html.match(/<img[^>]+>/gi) ?? []) {
    if (!/logo/i.test(tag)) continue;
    const src = tag.match(/\ssrc="([^"]+)"/i)?.[1];
    if (/sticky|mobile|footer/i.test(tag)) push(src, 70);
    else push(src, /\.svg/i.test(src ?? "") ? 100 : 90);
  }
  for (const tag of html.match(/<link[^>]+rel="[^"]*icon[^"]*"[^>]*>/gi) ?? []) {
    const href = tag.match(/\shref="([^"]+)"/i)?.[1];
    const size = Number(tag.match(/sizes="(\d+)/i)?.[1] ?? 0);
    push(href, /\.svg/i.test(href ?? "") ? 60 : 30 + Math.min(size / 32, 20));
  }
  push(html.match(/property="og:image"[^>]*content="([^"]+)"/i)?.[1], 10);

  return found.sort((a, b) => b.score - a.score);
};

const extensionOf = (url) => (url.match(/\.(svg|png|webp|jpe?g)(?:$|\?)/i)?.[1] ?? "png").toLowerCase().replace("jpeg", "jpg");

await mkdir(OUT, { recursive: true });

for (const { slug, site } of targets) {
  try {
    const html = await get(site);
    let saved = false;
    for (const candidate of candidates(html, site).slice(0, 4)) {
      try {
        const bytes = await get(candidate.url, "buffer");
        if (bytes.length < 400) continue;
        const file = `${OUT}/${slug}.${extensionOf(candidate.url)}`;
        await writeFile(file, bytes);
        console.log(`OK   ${slug.padEnd(22)} ${(bytes.length / 1024).toFixed(0)}kB  ${candidate.url}`);
        saved = true;
        break;
      } catch {}
    }
    if (!saved) console.log(`MISS ${slug.padEnd(22)} no usable logo candidate on ${site}`);
  } catch (error) {
    console.log(`MISS ${slug.padEnd(22)} ${site} unreachable (${error.message})`);
  }
}
