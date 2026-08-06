import { execFile } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const outputDir = path.join(process.cwd(), "public/images/amed");
const cli = ["--yes", "--package", "@higgsfield/cli", "higgsfield"];

const prompt = `Use case: photorealistic-natural.
Asset type: AMED Ventures leadership section editorial photograph.
Primary request: Two seasoned MedTech founders and investors, one Asian man and one white man, having an authentic working discussion while examining a physical catheter prototype and regulatory drawings at a Bay Area medical-device laboratory table.
Composition/framing: cinematic wide 16:9 composition; place both people together near the horizontal center of the frame, balanced around the center third, with natural breathing room on both sides; waist-up candid interaction; neither person looks at camera.
Style/medium: authentic UGC influencer documentary photography elevated for a premium venture-capital website; credible, spontaneous and human rather than staged corporate stock photography.
Lighting/mood: realistic soft window daylight, subtle cool navy architectural background, restrained clinical blue palette, physically plausible exposure and optical depth.
Materials/textures: natural skin texture, clearly visible realistic pores, fine facial lines, individual hair strands, slight skin tonal variation, honest fabric texture, tactile catheter polymer and paper; retain subtle sensor grain and lens character.
Constraints: mature professional confidence; natural gestures; people centered more than the previous image; hands anatomically correct; catheter prototype clearly readable; no readable document text; no logos; no watermark.
Avoid: airbrushed or plastic skin, beauty retouching, waxy faces, excessive smoothing, uncanny expressions, generic handshake imagery, fashion campaign polish, HDR, teal-orange grading, sci-fi holograms, neon cyberpunk, blood, patient records.`;

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
const png = path.join(outputDir, "leadership-founders-v2.png");
const jpg = path.join(outputDir, "leadership-founders-v2.jpg");
const response = await fetch(job.result_url);
if (!response.ok) throw new Error(`Download failed: ${response.status}`);
await writeFile(png, Buffer.from(await response.arrayBuffer()));
await execFileAsync("sips", ["-s", "format", "jpeg", "-s", "formatOptions", "88", png, "--out", jpg]);
console.log(jpg);
