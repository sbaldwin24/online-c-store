/**
 * Converts an image URL to WebP format if it's not already
 * @param url Original image URL
 * @returns URL with WebP format or original URL if conversion fails
 */
export function getWebPUrl(url: string): string {
  if (!url) {
    return '';
  }

  if (url.toLowerCase().endsWith('.webp')) {
    return url;
  }

  try {
    // If URL is from dummyjson.com image service
    if (url.includes('dummyjson.com/image')) {
      return `${url}?format=webp`;
    }

    // For other URLs, try to append WebP format
    const urlObj = new URL(url);
    urlObj.searchParams.set('format', 'webp');
    return urlObj.toString();
  } catch (error) {
    return url;
  }
}
