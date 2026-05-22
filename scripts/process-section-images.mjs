import sharp from "sharp";
import path from "path";

const assets = [
  "playtime-reports-analytics.png",
  "playtime-security-shield.png",
];

// Matches --bg-card (#171228)
const background = { r: 23, g: 18, b: 40, alpha: 1 };

for (const file of assets) {
  const filePath = path.join("public", file);
  const buffer = await sharp(filePath).ensureAlpha().raw().toBuffer({
    resolveWithObject: true,
  });

  const { data, info } = buffer;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3] / 255;

    // Remove light checkerboard / white backdrop pixels
    const isLight =
      (r > 210 && g > 210 && b > 210) ||
      (Math.abs(r - g) < 8 && Math.abs(g - b) < 8 && r > 180 && r < 245);

    if (isLight) {
      data[i] = background.r;
      data[i + 1] = background.g;
      data[i + 2] = background.b;
      data[i + 3] = 255;
      continue;
    }

    // Composite semi-transparent pixels onto card background
    data[i] = Math.round(background.r * (1 - a) + r * a);
    data[i + 1] = Math.round(background.g * (1 - a) + g * a);
    data[i + 2] = Math.round(background.b * (1 - a) + b * a);
    data[i + 3] = 255;
  }

  await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toFile(filePath);

  console.log(`Processed ${file}`);
}
