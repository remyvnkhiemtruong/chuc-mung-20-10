import sharp from 'sharp';
import fs from 'node:fs/promises';
const { recipients } = JSON.parse(await fs.readFile('recipients.json', 'utf8'));
await fs.mkdir('public/assets/photos', { recursive: true });
for (const { slug } of recipients) {
  for (const width of [480, 960, 1440]) {
    const result = await sharp(`source-photos/${slug}.png`).rotate()
      .resize({ width, withoutEnlargement: true }).webp({ quality: 86 })
      .toFile(`public/assets/photos/${slug}-${width}.webp`);
    console.log(`${slug} ${width}: ${Math.round(result.size / 1024)} KB`);
  }
}
