// Generates responsive AVIF/WebP/JPEG derivatives from public/images/new
// into public/images/home, plus the dimension manifest the Picture component reads.
//
// Idempotent: a target is skipped when it is newer than its source, so re-running
// after adding one photo only encodes that photo.
//
// Run: npm run images

import { readdir, mkdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const SRC_DIR = 'public/images/new';
const OUT_DIR = 'public/images/home';
const MANIFEST = 'src/components/Home/shared/imageManifest.json';

const WIDTHS = [480, 768, 1200, 1600];
const FORMATS = [
  { ext: 'avif', options: { quality: 50 } },
  { ext: 'webp', options: { quality: 72 } },
  { ext: 'jpg', options: { quality: 78, mozjpeg: true } },
];

const mtimeOf = async (file) => {
  try {
    return (await stat(file)).mtimeMs;
  } catch {
    return 0;
  }
};

const run = async () => {
  await mkdir(OUT_DIR, { recursive: true });

  const files = (await readdir(SRC_DIR)).filter((f) => /\.jpe?g$/i.test(f));
  const manifest = {};
  let encoded = 0;
  let skipped = 0;

  for (const file of files) {
    const srcPath = path.join(SRC_DIR, file);
    const name = path.parse(file).name;

    const { width, height } = await sharp(srcPath).metadata();

    // Never upscale: cap the ladder at the intrinsic width, and always include it.
    const widths = [...new Set(WIDTHS.filter((w) => w < width).concat(width))].sort(
      (a, b) => a - b
    );

    manifest[name] = { width, height, widths };

    const srcMtime = await mtimeOf(srcPath);

    for (const w of widths) {
      for (const { ext, options } of FORMATS) {
        const outPath = path.join(OUT_DIR, `${name}-${w}.${ext}`);

        if ((await mtimeOf(outPath)) > srcMtime) {
          skipped += 1;
          continue;
        }

        await sharp(srcPath)
          .resize({ width: w, withoutEnlargement: true })
          .toFormat(ext === 'jpg' ? 'jpeg' : ext, options)
          .toFile(outPath);

        encoded += 1;
      }
    }
  }

  const ordered = Object.fromEntries(
    Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b))
  );
  await writeFile(MANIFEST, `${JSON.stringify(ordered, null, 2)}\n`);

  console.log(`images: ${files.length} sources, ${encoded} encoded, ${skipped} up to date`);
  console.log(`manifest: ${MANIFEST}`);
};

run().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
