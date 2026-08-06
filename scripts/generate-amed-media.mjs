import { execFile } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const root = process.cwd();
const imageDir = path.join(root, "public/images/amed");
const videoDir = path.join(root, "public/videos");
const cli = ["--yes", "--package", "@higgsfield/cli", "higgsfield"];

const direction = `Premium editorial MedTech photography for AMED Ventures. Deep indigo navy #3d3d7d, clinical cyan #09afd0, porcelain white and restrained ice-blue highlights. Real medical engineering materials: frosted glass, translucent polymers, braided catheters, brushed titanium and soft human skin. Calm, exact, credible, contemporary and investment-grade. Natural optical depth, subtle grain, sophisticated negative space and an art-directed 16mm documentary quality. No logos, no readable text, no sci-fi holograms, no blood, no identifiable patient records, no generic handshake stock photography, no neon cyberpunk, no exaggerated glowing organs.`;

const stills = [
  {
    name: "hero-vascular",
    ratio: "16:9",
    prompt: `Wide macro scene of a transparent neurovascular flow model suspended in a dark indigo clinical studio. Thousands of microscopic cyan tracer particles travel through branching vessels and gather into one precise intervention path, suggesting capital becoming clinical impact. A gloved engineer's hand enters softly at the far edge, authentic and understated. Central subject sits slightly right, generous dark negative space on the left and upper third for large typography. ${direction}`,
  },
  {
    name: "focus-cardiovascular",
    ratio: "4:3",
    prompt: `Close study of a next-generation percutaneous ventricular assist catheter and miniature impeller inside a transparent cardiovascular test loop. Controlled fluid movement, brushed metal, translucent tubing, one gloved hand adjusting a calibrated fixture. Composition reads as precision, velocity and cardiac support. ${direction}`,
  },
  {
    name: "focus-neurovascular",
    ratio: "4:3",
    prompt: `Macro view of a neurovascular aspiration catheter navigating a clear branching cerebral vessel phantom. Fine cyan particles reveal flow and clot-removal mechanics, instrument surfaces are tactile and believable, no blood. Composition reads as stroke intervention and recovery technology. ${direction}`,
  },
  {
    name: "focus-oncology",
    ratio: "4:3",
    prompt: `A scientist dispensing a translucent hydrogel embolic into a clear microvascular oncology phantom on a frosted glass bench. The hydrogel forms a delicate controlled network under soft cyan side light; authentic lab tools and subtle imperfections. Composition reads as targeted embolization and hemorrhage control. ${direction}`,
  },
  {
    name: "focus-surgical",
    ratio: "4:3",
    prompt: `Precision robotic surgical instrument and ophthalmic micro-tool performing a dry-lab test beneath a surgical microscope. Fine articulated mechanics, polished titanium, soft indigo drape and restrained cyan status light, photographed as real engineering documentation elevated to an editorial cover. ${direction}`,
  },
  {
    name: "leadership-founders",
    ratio: "16:9",
    prompt: `Two seasoned Asian and American MedTech founders and investors reviewing a physical catheter prototype and regulatory drawings at a long Bay Area laboratory table. Candid side angle, mature confidence, natural gestures, no one looking at camera, no readable document text. Bright daylight falls across the people while the architectural background remains indigo navy. Wide negative space for a closing statement. ${direction}`,
  },
];

function parseJob(output) {
  const clean = output.replace(/\x1b\[[0-9;]*[A-Za-z]/g, "");
  const start = clean.indexOf("[");
  const end = clean.lastIndexOf("]");
  if (start < 0 || end < start) throw new Error(`No JSON job payload: ${clean}`);
  const job = JSON.parse(clean.slice(start, end + 1))[0];
  if (!job?.result_url) throw new Error(`Generation incomplete: ${clean}`);
  return job;
}

async function runModel(model, args, timeout = "20m") {
  const { stdout, stderr } = await execFileAsync(
    "npx",
    [...cli, "generate", "create", model, ...args, "--wait", "--wait-timeout", timeout, "--json", "--no-color"],
    { maxBuffer: 24 * 1024 * 1024 },
  );
  return parseJob(`${stdout}\n${stderr}`);
}

async function download(url, destination) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Download failed ${response.status}: ${url}`);
  await writeFile(destination, Buffer.from(await response.arrayBuffer()));
}

async function generateStill(still) {
  console.log(`Generating ${still.name}`);
  const job = await runModel("gpt_image_2", [
    "--prompt", still.prompt,
    "--aspect_ratio", still.ratio,
    "--quality", "low",
    "--resolution", "2k",
  ]);
  const png = path.join(imageDir, `${still.name}.png`);
  const jpg = path.join(imageDir, `${still.name}.jpg`);
  await download(job.result_url, png);
  await execFileAsync("sips", ["-s", "format", "jpeg", "-s", "formatOptions", "86", png, "--out", jpg]);
  console.log(`Completed ${still.name}`);
}

async function main() {
  await mkdir(imageDir, { recursive: true });
  await mkdir(videoDir, { recursive: true });
  const queue = [...stills];
  await Promise.all(Array.from({ length: 3 }, async () => {
    while (queue.length) {
      const still = queue.shift();
      if (still) await generateStill(still);
    }
  }));
  const hero = path.join(imageDir, "hero-vascular.png");
  console.log("Generating hero motion");
  const video = await runModel("kling3_0", [
    "--prompt", "A nearly imperceptible cinematic push through the transparent vessel network. Cyan tracer particles flow steadily through the catheter path, liquid and tiny reflections move naturally, the gloved hand makes one restrained precise adjustment. Camera remains stable and premium. No morphing, no text, no new objects.",
    "--start_image", hero,
    "--aspect_ratio", "16:9",
    "--duration", "5",
    "--mode", "std",
    "--sound", "off",
  ]);
  await download(video.result_url, path.join(videoDir, "amed-hero.mp4"));
  console.log("Completed hero motion");
}

await main();
