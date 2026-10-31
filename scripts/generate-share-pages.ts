import fs from 'fs';
import path from 'path';
import { KIT_HOMES_SHARE_MAP } from '../src/data/kitHomeMetaMap';

/**
 * Script that generates static HTML landing pages for each of the 20 Kit Home models.
 * These pages are placed in public/share/ so Vite and Cloudflare serve them statically.
 * Each static HTML file contains that specific model's 3D artist impression image
 * in <meta property="og:image"> and <meta name="twitter:image">, with an instant
 * redirect to the full interactive application at /kit-homes?model=...
 */

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const targetDirs = [
  path.join(projectRoot, 'public', 'share'),
  path.join(projectRoot, 'dist', 'share')
];

function generateHtmlForModel(model: typeof KIT_HOMES_SHARE_MAP[0]): string {
  const title = `Techtural Kit Home — ${model.name} (${model.code})`;
  const description = `${model.name} (${model.code}) | ${model.bedrooms} Bed, ${model.bathrooms} Bath, ${model.buildingAreaSqm} m² | Turn-Key: PGK ${model.turnkeyPrice.toLocaleString()}. Engineered for Papua New Guinea.`;
  const imageUrl = model.image;
  const canonicalUrl = `https://techturalbuiltin.com/share/model-${model.officialNumber}`;

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta name="theme-color" content="#0f172a" />
    <link rel="icon" type="image/png" href="https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Techtural%20BuiltIn%20Logo/techtural%20builtin_logo25.png" />

    <!-- OpenGraph Social Share Card Tags -->
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Techtural BuiltIn" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:image:secure_url" content="${imageUrl}" />
    <meta property="og:image:type" content="image/jpeg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="675" />
    <meta property="og:image:alt" content="${model.name} (${model.code}) 3D Artist Impression Perspective" />
    <meta property="og:url" content="${canonicalUrl}" />

    <!-- Twitter / X Card Tags -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${imageUrl}" />
    <meta name="twitter:image:alt" content="${model.name} (${model.code}) 3D Artist Impression Perspective" />

    <!-- Instant redirect to interactive Kit Homes Page with Model pre-selected -->
    <meta http-equiv="refresh" content="0; url=/kit-homes?model=${model.id}" />
    <script>
      window.location.replace('/kit-homes?model=' + encodeURIComponent('${model.id}'));
    </script>

    <style>
      body {
        margin: 0;
        background-color: #020617;
        color: #f8fafc;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        text-align: center;
        padding: 24px;
        box-sizing: border-box;
      }
      .card {
        background: #0f172a;
        border: 1px solid #1e293b;
        border-radius: 24px;
        padding: 24px;
        max-width: 460px;
        width: 100%;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
      }
      .img {
        width: 100%;
        border-radius: 16px;
        aspect-ratio: 16/9;
        object-fit: cover;
        margin-bottom: 20px;
        border: 1px solid rgba(255, 255, 255, 0.1);
      }
      .badge {
        display: inline-block;
        background: rgba(245, 158, 11, 0.15);
        color: #fbbf24;
        border: 1px solid rgba(245, 158, 11, 0.3);
        font-size: 11px;
        font-weight: 700;
        padding: 4px 10px;
        border-radius: 9999px;
        margin-bottom: 12px;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
      h1 { margin: 0 0 10px 0; font-size: 20px; font-weight: 800; color: #ffffff; }
      p { margin: 0 0 20px 0; font-size: 13px; color: #94a3b8; line-height: 1.5; }
      .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: #f59e0b;
        color: #020617;
        font-weight: 700;
        font-size: 14px;
        text-decoration: none;
        padding: 12px 24px;
        border-radius: 14px;
        transition: background 0.2s;
        width: 100%;
        box-sizing: border-box;
      }
      .btn:hover { background: #d97706; }
    </style>
  </head>
  <body>
    <div class="card">
      <span class="badge">Model #${String(model.officialNumber).padStart(2, '0')} • 3D Artist Impression</span>
      <img class="img" src="${imageUrl}" alt="${model.name} 3D Artist Impression" />
      <h1>${model.name} (${model.code})</h1>
      <p>${description}</p>
      <a class="btn" href="/kit-homes?model=${model.id}">View Model &amp; Blueprints &rarr;</a>
    </div>
  </body>
</html>`;
}

export function generateAllSharePages() {
  for (const baseDir of targetDirs) {
    if (!fs.existsSync(baseDir)) {
      fs.mkdirSync(baseDir, { recursive: true });
    }

    for (const model of KIT_HOMES_SHARE_MAP) {
      const htmlContent = generateHtmlForModel(model);

      // 1. By official number: /share/model-1/index.html and /share/model-01/index.html
      const numberVariants = [
        `model-${model.officialNumber}`,
        `model-${String(model.officialNumber).padStart(2, '0')}`,
        `m${model.officialNumber}`,
        model.id,
        model.code.toLowerCase()
      ];

      for (const variant of numberVariants) {
        const variantDir = path.join(baseDir, variant);
        if (!fs.existsSync(variantDir)) {
          fs.mkdirSync(variantDir, { recursive: true });
        }
        fs.writeFileSync(path.join(variantDir, 'index.html'), htmlContent, 'utf-8');
      }
    }
  }

  console.log(`[SHARE PAGES] Successfully generated static OpenGraph 3D share pages for all 20 Kit Home models!`);
}

// Execute when run directly
generateAllSharePages();
process.exit(0);
