import fs from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire('/Users/vietmac/Documents/CODE/WEB- FAI/fai/package.json');
const sharp = require('sharp');

const targetUrls = [
  'https://pub-447bd44dfdac4938912655c855b8631c.r2.dev/fai/posts/2026/09/9ad62814d300-wireframing-thiet-ke-tu-goc-nhin-cua-ngu.webp',
  'https://pub-447bd44dfdac4938912655c855b8631c.r2.dev/fai/posts/2026/09/365fe6f47fab-ai-first-software-developer-lam-chu-ai-d.webp',
  'https://pub-447bd44dfdac4938912655c855b8631c.r2.dev/fai/posts/2026/09/11d71e66b922-hoc-sinh-thpt-chinh-phuc-ai-tai-fpt-apte.webp',
];

async function verifyWatermarkPixels() {
  for (let idx = 0; idx < targetUrls.length; idx++) {
    const url = targetUrls[idx];
    const res = await fetch(url);
    const buf = Buffer.from(await res.arrayBuffer());
    const meta = await sharp(buf).metadata();

    // Extract bottom-right quadrant where watermark is composited
    const cropW = Math.min(320, meta.width);
    const cropH = Math.min(120, meta.height);
    const left = meta.width - cropW;
    const top = meta.height - cropH;

    const { data } = await sharp(buf)
      .extract({ left, top, width: cropW, height: cropH })
      .raw()
      .toBuffer({ resolveWithObject: true });

    // Look for FPT orange color: R ~ 200-255, G ~ 80-160, B ~ 10-60
    let orangePixelCount = 0;
    for (let i = 0; i < data.length; i += 3) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      if (r > 190 && g > 70 && g < 170 && b < 70) {
        orangePixelCount++;
      }
    }

    console.log(`Image #${idx + 1} (${url.split('/').pop()}): found ${orangePixelCount} FAI brand orange pixels in watermark quadrant!`);
    if (orangePixelCount > 20) {
      console.log(`  -> Watermark confirmed present! ✅`);
    } else {
      console.warn(`  -> Warning: low orange pixel count (${orangePixelCount})`);
    }
  }
}

verifyWatermarkPixels().catch(console.error);
