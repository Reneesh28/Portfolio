import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputDir = path.resolve(__dirname, '../src/assets/images');
const outputDir = path.resolve(__dirname, '../src/assets/about');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Generate halftone SVG overlay buffer
function createHalftoneSvg(width, height, dotRadius = 1.5, spacing = 8, opacity = 0.15) {
  const dots = [];
  for (let x = spacing / 2; x < width; x += spacing) {
    for (let y = spacing / 2; y < height; y += spacing) {
      dots.push(`<circle cx="${x}" cy="${y}" r="${dotRadius}" fill="#111116" opacity="${opacity}"/>`);
    }
  }
  return Buffer.from(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      ${dots.join('')}
    </svg>
  `);
}

// Generate warm paper tint SVG buffer
function createPaperTintSvg(width, height) {
  return Buffer.from(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="#F4EFE6" opacity="0.18"/>
    </svg>
  `);
}

const sourceImages = [
  'manga_about_portrait',
  'manga_about_build',
  'manga_about_create',
  'manga_about_lead_explore',
  'manga_ai_architecture',
  'manga_creative_worldbuilding',
  'manga_protagonist_dark_fantasy',
  'manga_protagonist_isekai',
  'manga_protagonist_psychological',
  'manga_protagonist_scifi',
  'manga_protagonist_shonen',
  'manga_protagonist_slice_of_life',
];

async function processImage(name) {
  const inputPath = path.join(inputDir, `${name}.jpg`);
  if (!fs.existsSync(inputPath)) {
    console.warn(`Source image not found: ${inputPath}`);
    return;
  }

  const metadata = await sharp(inputPath).metadata();
  const targetWidth = Math.min(1200, metadata.width || 1200);

  // 1. SOFT treatment: lifted shadows, lowered contrast, faint halftone overlay, warm paper tint
  try {
    const baseSoft = await sharp(inputPath)
      .resize({ width: targetWidth, withoutEnlargement: true })
      .grayscale()
      .modulate({ brightness: 1.08, saturation: 0.9 })
      .linear(0.85, 25) // lift shadows, lower contrast
      .toBuffer({ resolveWithObject: true });

    const halftoneSoft = createHalftoneSvg(baseSoft.info.width, baseSoft.info.height, 1.2, 7, 0.12);
    const paperTint = createPaperTintSvg(baseSoft.info.width, baseSoft.info.height);

    await sharp(baseSoft.data)
      .composite([
        { input: halftoneSoft, blend: 'multiply' },
        { input: paperTint, blend: 'multiply' },
      ])
      .webp({ quality: 72 })
      .toFile(path.join(outputDir, `${name}.soft.webp`));
  } catch (err) {
    console.error(`Error soft treatment for ${name}:`, err);
  }

  // 2. TECH treatment: normalized, slightly sharpened, high-detail line emphasis, no tint
  try {
    await sharp(inputPath)
      .resize({ width: targetWidth, withoutEnlargement: true })
      .grayscale()
      .normalize()
      .sharpen({ sigma: 1.5, m1: 1.5, m2: 0.5 })
      .webp({ quality: 75 })
      .toFile(path.join(outputDir, `${name}.tech.webp`));
  } catch (err) {
    console.error(`Error tech treatment for ${name}:`, err);
  }

  // 3. SHARP treatment: strong contrast, heavier blacks, no tint
  try {
    await sharp(inputPath)
      .resize({ width: targetWidth, withoutEnlargement: true })
      .grayscale()
      .linear(1.35, -35) // strong contrast, heavy blacks
      .sharpen({ sigma: 1.8 })
      .webp({ quality: 72 })
      .toFile(path.join(outputDir, `${name}.sharp.webp`));
  } catch (err) {
    console.error(`Error sharp treatment for ${name}:`, err);
  }

  // 4. NOIR treatment: darkened, strong contrast, coarse halftone overlay
  try {
    const baseNoir = await sharp(inputPath)
      .resize({ width: targetWidth, withoutEnlargement: true })
      .grayscale()
      .modulate({ brightness: 0.88 })
      .linear(1.4, -45)
      .toBuffer({ resolveWithObject: true });

    const halftoneNoir = createHalftoneSvg(baseNoir.info.width, baseNoir.info.height, 2.0, 9, 0.22);

    await sharp(baseNoir.data)
      .composite([{ input: halftoneNoir, blend: 'multiply' }])
      .webp({ quality: 70 })
      .toFile(path.join(outputDir, `${name}.noir.webp`));
  } catch (err) {
    console.error(`Error noir treatment for ${name}:`, err);
  }

  // 5. NEGATIVE treatment: inverted and thresholded, faint gray midtone preserved, bg mapped to #0A0A0E
  try {
    await sharp(inputPath)
      .resize({ width: targetWidth, withoutEnlargement: true })
      .grayscale()
      .negate({ alpha: false })
      .linear(1.2, -10)
      .webp({ quality: 72 })
      .toFile(path.join(outputDir, `${name}.negative.webp`));
  } catch (err) {
    console.error(`Error negative treatment for ${name}:`, err);
  }

  console.log(`✓ Processed treatments for: ${name}`);
}

async function main() {
  console.log('Starting Manga About Image Treatment Pipeline...');
  for (const name of sourceImages) {
    await processImage(name);
  }
  console.log('All image treatments generated in src/assets/about/');
}

main().catch((err) => {
  console.error('Image treatment failed:', err);
  process.exit(1);
});
