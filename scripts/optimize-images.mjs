#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import sharp from 'sharp';

const quality = Number.parseInt(process.env.IMAGE_QUALITY ?? '78', 10);
const overwrite = process.argv.includes('--overwrite');
const verbose = process.argv.includes('--verbose');

const projectRoot = process.cwd();
const backendStaticRoot = path.resolve(projectRoot, '..', 'resume-backend', 'app', 'static');
const frontendPublicRoot = path.resolve(projectRoot, 'public');

const watchedDirectories = [
  path.join(backendStaticRoot, 'certificate_thumbnails'),
  path.join(backendStaticRoot, 'projects'),
  frontendPublicRoot,
];

const supportedExtensions = new Set(['.png', '.jpg', '.jpeg']);

async function ensureDirectoryExists(targetPath) {
  try {
    await fs.mkdir(path.dirname(targetPath), { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
}

async function* walk(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      yield* walk(fullPath);
    } else {
      yield fullPath;
    }
  }
}

async function optimizeImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!supportedExtensions.has(ext)) {
    return { skipped: true };
  }

  const stat = await fs.stat(filePath);
  if (stat.size < 80 * 1024) {
    if (verbose) {
      console.log('Skipping small file', path.relative(projectRoot, filePath));
    }
    return { skipped: true };
  }

  const webpTarget = `${filePath.slice(0, -ext.length)}.webp`;

  await ensureDirectoryExists(webpTarget);

  await sharp(filePath, { failOnError: false })
    .webp({ quality, effort: 5 })
    .toFile(webpTarget);

  if (overwrite) {
    const pipeline = ext === '.png'
      ? sharp(filePath, { failOnError: false }).png({ compressionLevel: 9, palette: true })
      : sharp(filePath, { failOnError: false }).jpeg({ quality: Math.min(quality + 5, 90), mozjpeg: true });

    const tempPath = `${filePath}.tmp`;
    await pipeline.toFile(tempPath);
    await fs.rename(tempPath, filePath);
  }

  return { optimized: true, output: webpTarget };
}

async function main() {
  const summary = { scanned: 0, optimized: 0, skipped: 0 };

  for (const directory of watchedDirectories) {
    try {
      const stats = await fs.stat(directory);
      if (!stats.isDirectory()) {
        continue;
      }
    } catch (error) {
      if (error.code === 'ENOENT') {
        continue;
      }
      throw error;
    }

    for await (const filePath of walk(directory)) {
      summary.scanned += 1;
      try {
        const result = await optimizeImage(filePath);
        if (result.optimized) {
          summary.optimized += 1;
          if (verbose) {
            console.log('Optimized', path.relative(projectRoot, filePath));
          }
        } else {
          summary.skipped += 1;
        }
      } catch (error) {
        console.error('Failed to optimize', filePath, error);
      }
    }
  }

  console.log('Image optimization complete', summary);
  console.log('WebP versions have been written next to the original files.');
  if (!overwrite) {
    console.log('Re-run with --overwrite to recompress original PNG/JPEG assets.');
  }
}

main().catch((error) => {
  console.error('Image optimization failed', error);
  process.exitCode = 1;
});
