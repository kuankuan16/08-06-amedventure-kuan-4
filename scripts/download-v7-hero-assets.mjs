import { mkdir, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";

const origin = "https://demo-amed-proposal.vercel.app/site/v7-fixed-film";
const output = join(process.cwd(), "public", "videos", "v7-fixed-film");
const assets = [
  "/videos/01-healthcare.mp4",
  "/videos/02-drug-discovery.mp4",
  "/videos/03-ai-innovation.mp4",
  "/videos/04-applied-impact.mp4",
  "/images/poster-01.jpg",
  "/images/poster-02.jpg",
  "/images/poster-03.jpg",
  "/images/poster-04.jpg",
];

await mkdir(output, { recursive: true });

for (let index = 0; index < assets.length; index += 4) {
  await Promise.all(
    assets.slice(index, index + 4).map(async (asset) => {
      const response = await fetch(`${origin}${asset}`);
      if (!response.ok) {
        throw new Error(`Could not download ${asset}: ${response.status}`);
      }
      const bytes = Buffer.from(await response.arrayBuffer());
      await writeFile(join(output, basename(asset)), bytes);
      console.log(`Downloaded ${basename(asset)} (${bytes.length} bytes)`);
    }),
  );
}
