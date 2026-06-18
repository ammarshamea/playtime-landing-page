import sharp from "sharp";
import path from "path";

const input = path.join(process.cwd(), "public", "image.png");
const output = path.join(process.cwd(), "public", "playtime-logo.png");

const THRESHOLD = 28;

const { data, info } = await sharp(input)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

for (let i = 0; i < data.length; i += 4) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  if (r <= THRESHOLD && g <= THRESHOLD && b <= THRESHOLD) {
    data[i + 3] = 0;
  }
}

await sharp(data, {
  raw: { width: info.width, height: info.height, channels: 4 },
})
  .png()
  .toFile(output);

console.log(`Saved transparent logo → public/playtime-logo.png (${info.width}x${info.height})`);
