import { getShareMetadata } from '../src/data/kitHomeMetaMap';

/**
 * Cloudflare Pages & Workers Edge Middleware
 * Automatically intercepts requests with ?model=... or ?preview=...
 * and uses Cloudflare's native HTMLRewriter to inject that Model's 3D artist impression image
 * into <meta property="og:image"> and <meta name="twitter:image"> for social scrapers (WhatsApp, Facebook, Twitter, LinkedIn).
 */

export async function onRequest(context: any) {
  const request = context.request;
  const url = new URL(request.url);
  const modelParam = url.searchParams.get('model') || url.searchParams.get('preview');

  const response = await context.next();

  // If no model query param or response is not HTML, return as-is
  if (!modelParam) {
    return response;
  }

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('text/html')) {
    return response;
  }

  const model = getShareMetadata(modelParam);
  if (!model) {
    return response;
  }

  const title = `Techtural Kit Home — ${model.name} (${model.code})`;
  const description = `${model.name} (${model.code}) | ${model.bedrooms} Bed, ${model.bathrooms} Bath, ${model.buildingAreaSqm} m². Engineered for Papua New Guinea.`;
  const imageUrl = model.image;

  // Use Cloudflare's native HTMLRewriter to rewrite OpenGraph & Twitter tags on the fly
  // @ts-ignore
  if (typeof HTMLRewriter !== 'undefined') {
    // @ts-ignore
    return new HTMLRewriter()
      .on('title', {
        element(e: any) {
          e.setInnerContent(title);
        }
      })
      .on('meta[name="description"]', {
        element(e: any) {
          e.setAttribute('content', description);
        }
      })
      .on('meta[property="og:title"]', {
        element(e: any) {
          e.setAttribute('content', title);
        }
      })
      .on('meta[property="og:description"]', {
        element(e: any) {
          e.setAttribute('content', description);
        }
      })
      .on('meta[property="og:image"]', {
        element(e: any) {
          e.setAttribute('content', imageUrl);
        }
      })
      .on('meta[property="og:image:secure_url"]', {
        element(e: any) {
          e.setAttribute('content', imageUrl);
        }
      })
      .on('meta[name="twitter:image"]', {
        element(e: any) {
          e.setAttribute('content', imageUrl);
        }
      })
      .on('meta[name="twitter:title"]', {
        element(e: any) {
          e.setAttribute('content', title);
        }
      })
      .on('meta[name="twitter:description"]', {
        element(e: any) {
          e.setAttribute('content', description);
        }
      })
      .transform(response);
  }

  return response;
}
