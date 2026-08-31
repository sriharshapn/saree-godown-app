/**
 * Fetches an image URL as a File object (JPEG).
 * @param {string} url - The image URL to fetch
 * @param {string} filename - The filename to use (e.g. "product-name.jpg")
 * @returns {Promise<File>}
 */
export async function fetchImageAsFile(url, filename) {
  const response = await fetch(url, { mode: 'cors' });
  if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
  const blob = await response.blob();
  // Ensure it's treated as a JPEG
  const jpegBlob = blob.type.startsWith('image/') ? blob : new Blob([blob], { type: 'image/jpeg' });
  return new File([jpegBlob], filename, { type: jpegBlob.type });
}

/**
 * Checks if the browser supports sharing files via the Web Share API.
 * @returns {boolean}
 */
export function canShareFiles() {
  if (!navigator.canShare) return false;
  try {
    return navigator.canShare({ files: [new File([''], 'test.jpg', { type: 'image/jpeg' })] });
  } catch {
    return false;
  }
}

/**
 * Shares files using the Web Share API.
 * @param {File[]} files - Array of File objects to share
 * @param {string} text - Optional text to include in the share
 * @returns {Promise<boolean>} - true if shared, false if cancelled/failed
 */
export async function shareFiles(files, text = '') {
  if (!navigator.share) throw new Error('Web Share API not supported');
  await navigator.share({ files, text });
  return true;
}

/**
 * Downloads a single image from a URL as a JPG file.
 * Fallback for browsers that don't support file sharing.
 * @param {string} url - The image URL
 * @param {string} filename - The filename to save as
 */
export async function downloadImage(url, filename) {
  const response = await fetch(url, { mode: 'cors' });
  if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(objectUrl);
}

/**
 * Sanitizes a product name to be safe for use as a filename.
 * @param {string} name
 * @returns {string}
 */
export function toFilename(name) {
  return (name || 'product').replace(/[^a-zA-Z0-9_\- ]/g, '').trim().replace(/\s+/g, '-') + '.jpg';
}
