/**
 * Helper to dynamically update OpenGraph and Twitter social meta tags in client SPA.
 * Ensures the browser DOM head always reflects the active Kit Home model's 3D artist impression image.
 */

export interface SocialMetaOptions {
  title: string;
  description: string;
  imageUrl: string;
  url?: string;
  imageAlt?: string;
}

export function updateSocialMetaTags(options: SocialMetaOptions): void {
  if (typeof document === 'undefined') return;

  // Update Page Title
  document.title = options.title;

  // Helper function to set or append meta tag
  const setMeta = (attributeName: string, attributeValue: string, content: string) => {
    if (!content) return;
    let el = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attributeName, attributeValue);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  // OpenGraph Tags
  setMeta('property', 'og:title', options.title);
  setMeta('property', 'og:description', options.description);
  setMeta('property', 'og:image', options.imageUrl);
  setMeta('property', 'og:image:secure_url', options.imageUrl);
  setMeta('property', 'og:image:type', 'image/jpeg');
  setMeta('property', 'og:image:width', '1200');
  setMeta('property', 'og:image:height', '675');
  setMeta('property', 'og:image:alt', options.imageAlt || options.title);
  if (options.url) {
    setMeta('property', 'og:url', options.url);
  }

  // Twitter / X Card Tags
  setMeta('name', 'twitter:card', 'summary_large_image');
  setMeta('name', 'twitter:title', options.title);
  setMeta('name', 'twitter:description', options.description);
  setMeta('name', 'twitter:image', options.imageUrl);
  setMeta('name', 'twitter:image:alt', options.imageAlt || options.title);
}
