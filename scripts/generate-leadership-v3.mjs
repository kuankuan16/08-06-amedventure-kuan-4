import { execFile } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const outputDir = path.join(process.cwd(), "public/images/amed");
const cli = ["--yes", "--package", "@higgsfield/cli", "higgsfield"];

const prompt = `Use case: photorealistic-natural.
Asset type: AMED Ventures leadership section documentary photograph.
Primary request: Two seasoned MedTech founders and investors, one Asian man and one white man, naturally discussing a physical catheter prototype and regulatory drawings at a real Bay Area medical-device laboratory table.
Composition/framing: wide 16:9 environmental portrait; both people grouped naturally around the horizontal center third, waist-up, relaxed candid posture, neither looking at camera; keep the catheter and hands clearly visible.
Style/medium: an unretouched photograph made by a skilled documentary photographer for an authentic founder story; observational UGC credibility with restrained editorial composition; should feel captured in one real moment, not generated or staged.
Lighting/mood: one believable source of soft overcast window daylight from camera-left; gentle falloff across faces and clothing; ordinary practical room ambience; realistic midtone exposure; soft natural shadows with imperfect edges; restrained contrast and white balance; no artificial rim light and no luminous skin.
Camera behavior: full-frame camera, 50mm documentary lens, f/4, realistic depth of field, modest ISO grain, subtle lens softness away from focus, no computational HDR, no clarity boost, no excessive microcontrast.
Materials/textures: unretouched natural skin with pores, fine lines, small tonal irregularities and slight under-eye texture; individual hair strands; believable cotton fabric, paper and translucent catheter polymer.
Constraints: mature professional confidence; anatomically correct hands; physical catheter prototype clearly readable; no readable document text; no logos; no watermark.
Avoid: AI image look, hyperreal rendering, synthetic studio lighting, perfectly balanced fill light, glowing edges, cyan rim lights, dramatic spotlights, glossy or waxy skin, airbrushing, skin smoothing, oversharpening, HDR halos, fake bokeh, uncanny symmetry, duplicated objects, fashion campaign styling, generic stock-photo smiles, sci-fi holograms, neon cyberpunk, blood.`;

function parseJob(output) {
  const clean = output.replace(/\x1b\[[0-9;]*[A-Za-z]/g, "");
  const start = clean.indexOf("[");
  const end = clean.lastIndexOf("]");
  if (start < 0 || end < start) throw new Error(`No JSON job payload: ${clean}`);
  const job = JSON.parse(clean.slice(start, end + 1))[0];
  if (!job?.result_url) throw new Error(`Generation incomplete: ${clean}`);
  return job;
}

await mkdir(outputDir, { recursive: true });
const { stdout, stderr } = await execFileAsync(
  "npx",
  [...cli, "generate", "create", "gpt_image_2", "--prompt", prompt, "--aspect_ratio", "16:9", "--quality", "low", "--resolution", "2k", "--wait", "--wait-timeout", "20m", "--json", "--no-color"],
  { maxBuffer: 24 * 1024 * 1024 },
);
const job = parseJob(`${stdout}\n${stderr}`);
const png = path.join(outputDir, "leadership-founders-v3.png");
const jpg = path.join(outputDir, "leadership-founders-v3.jpg");
const response = await fetch(job.result_url);
if (!response.ok) throw new Error(`Download failed: ${response.status}`);
await writeFile(png, Buffer.from(await response.arrayBuffer()));
await execFileAsync("sips", ["-s", "format", "jpeg", "-s", "formatOptions", "88", png, "--out", jpg]);
console.log(jpg);
