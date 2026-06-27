/**
 * Image-link optimizer.
 *
 * Images are stored in the database as LINKS (URLs), never as blobs. This helper
 * keeps the stored link untouched but rewrites it at render time to deliver a
 * smaller, faster image:
 *   - Cloudinary: inject `f_auto` (webp/avif), `q_auto` (auto quality) and a
 *     width cap so the browser downloads only what it shows.
 *   - Other hosts (pravatar/picsum/etc.): returned unchanged.
 *
 * @param url   the stored image link
 * @param width target display width in px (the image is capped, never upscaled)
 */
export function optimizeImage(url?: string | null, width = 400): string {
  if (!url) return '';

  // Cloudinary delivery transformation, inserted right after "/upload/".
  if (url.includes('res.cloudinary.com') && url.includes('/upload/')) {
    const transform = `f_auto,q_auto,c_limit,w_${Math.round(width)}`;
    return url.replace('/upload/', `/upload/${transform}/`);
  }

  return url;
}
