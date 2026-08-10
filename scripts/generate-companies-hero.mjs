// Provenance record for public/images/amed/companies-hero-light.{png,jpg}
// Generated through the Higgsfield MCP, model `gpt_image_2`, 16:9, 1k, quality low.
//
// 2026-08-10 (current) — reframed from an R&D bench to the investor side of MedTech: a partner
// meeting room where a device prototype sits on the table alongside the term sheet. Keeps the
// natural-light documentary tone of leadership-founders-v3. Two variants; the first was selected.
export const prompt = `Naturalistic documentary photograph of a MedTech venture capital partner meeting room, shot on a 35mm prime with available light only. Soft overcast daylight from a floor-to-ceiling window overlooking a hazy city skyline, muted cool blue-grey palette, restrained desaturated colour, matte finish, not glossy or CGI. On the dark wood boardroom table: an open laptop, printed diligence documents and a term sheet, a notebook with handwriting, a coffee cup, and a single medical device prototype - a slim catheter in a clear tray - resting beside the papers as the subject under discussion. Empty leather chairs, no people. Calm, considered, institutional yet human. Wide horizontal composition with clear empty table space across the left third for typography.`;

// Superseded passes, kept so the direction is traceable:
// 2026-08-10 — R&D workbench in the same documentary tone; read as a lab, not as an investor.
export const benchPrompt = `Naturalistic documentary photograph of a real medical device R&D workbench, shot on a 35mm prime with available light only. Soft overcast daylight falling from a large window on the left, muted cool blue-grey palette, restrained desaturated colour, authentic working clutter: a stereo microscope, small blue parts bins, catheter tubing and hand-drawn engineering sketches on the bench. Unstyled and candid, no people, slight film grain, gentle shadows, matte finish, not glossy or CGI. Wide horizontal composition with calm empty bench space across the left third for typography.`;
// 2026-08-07 — first pass, high-key glossy studio look; off-tone against the Team photography.
export const highKeyPrompt = `Bright, airy editorial photograph inside a modern medical device research facility. Soft diffused daylight from a large window, predominantly white and pale grey surfaces, light aqua-teal glass accents, clean minimalist laboratory bench with a translucent cardiovascular catheter device in shallow focus. High-key lighting, luminous and optimistic, pale cool colour palette, subtle teal reflections, no people or only softly blurred silhouettes far in the background, wide cinematic composition with generous empty space on the left third for typography. Crisp, premium, architectural, light and open feeling.`;

// The PNG master is converted with:
//   sharp(png).jpeg({ quality: 88 }).toFile(jpg)
