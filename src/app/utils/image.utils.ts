/**
 * Converts an image URL to WebP format if it's not already
 * @param url Original image URL
 * @returns URL with WebP format
 */
export function getWebPUrl(url: string): string {
  // If URL already ends with .webp, return as is
  if (url.toLowerCase().endsWith('.webp')) {
    return url;
  }

  // If URL is from an image service that supports WebP conversion
  if (url.includes('dummyjson.com/image')) {
    return `${url}?format=webp`;
  }

  // For other URLs, try to append WebP format
  const urlObj = new URL(url);
  urlObj.searchParams.set('format', 'webp');
  return urlObj.toString();
}
