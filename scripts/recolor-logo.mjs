import sharp from "sharp";

const input = "public/brand/amed-logo-light.png";
const output = "public/brand/amed-logo-white.png";
const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

for (let y = 0; y < info.height; y += 1) {
  for (let x = 650; x < info.width; x += 1) {
    const index = (y * info.width + x) * info.channels;
    if (data[index + 3] === 0) continue;
    data[index] = 255;
    data[index + 1] = 255;
    data[index + 2] = 255;
  }
}

await sharp(data, {
  raw: { width: info.width, height: info.height, channels: info.channels },
}).png().toFile(output);
