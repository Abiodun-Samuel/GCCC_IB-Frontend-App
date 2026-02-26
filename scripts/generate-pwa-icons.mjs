// scripts/generate-pwa-icons.mjs
import sharp from 'sharp';
import { mkdirSync } from 'fs';

mkdirSync('public/icons', { recursive: true });

const source = 'public/images/logo/gccc.png';

for (const size of [192, 512]) {
    await sharp(source)
        .resize(size, size, {
            fit: 'contain',
            background: { r: 10, g: 10, b: 10, alpha: 1 }, // #0a0a0a dark bg
        })
        .png()
        .toFile(`public/icons/pwa-${size}x${size}.png`);

    console.log(`✓ pwa-${size}x${size}.png`);
}

// Apple touch icon — 180x180
await sharp(source)
    .resize(180, 180, {
        fit: 'contain',
        background: { r: 10, g: 10, b: 10, alpha: 1 },
    })
    .png()
    .toFile('public/apple-touch-icon.png');

console.log('✓ apple-touch-icon.png');