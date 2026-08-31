/**
 * Extracts the Google Drive file ID from any Drive URL variant.
 * Works with thumbnail URLs, file/d/ URLs, and uc?id= URLs.
 */
function extractDriveId(url) {
  if (!url) return null;
  // thumbnail?id=ID or uc?id=ID
  const idParam = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idParam) return idParam[1];
  // /d/ID/
  const dPath = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (dPath) return dPath[1];
  return null;
}

/**
 * Returns a Google Drive direct-download URL for a given image URL.
 * Falls back to the original URL if it's not a Drive URL.
 */
export function getDriveDownloadUrl(url) {
  const id = extractDriveId(url);
  if (id) return `https://drive.google.com/uc?export=download&id=${id}`;
  return url;
}

/**
 * Loads an image via an <img> element and draws it onto a canvas to get a Blob.
 * This bypasses the fetch() CORS restriction for images that the browser CAN display.
 * Note: if the server doesn't send CORS headers, the canvas becomes "tainted" and
 * toBlob() will throw a SecurityError — we catch that and return null.
 */
async function imageUrlToBlob(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous'; // request CORS headers
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(blob => resolve(blob), 'image/jpeg', 0.92);
      } catch {
        // SecurityError: tainted canvas (no CORS headers from server)
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

/**
 * Fetches an image as a File object using the canvas approach (CORS-safe).
 * Returns null if the image can't be captured (tainted canvas / load error).
 */
export async function fetchImageAsFile(url, filename) {
  const blob = await imageUrlToBlob(url);
  if (!blob) return null;
  return new File([blob], filename, { type: 'image/jpeg' });
}

/**
 * Checks if the browser supports sharing files via the Web Share API.
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
 * If no files could be captured (CORS), falls back to sharing text + URLs.
 */
export async function shareFiles(files, text = '', fallbackUrls = []) {
  if (!navigator.share) throw new Error('Web Share API not supported');

  if (files.length > 0) {
    // Try sharing actual image files
    try {
      await navigator.share({ files, text });
      return true;
    } catch (e) {
      if (e.name === 'AbortError') throw e; // user cancelled — re-throw
      // fall through to URL sharing
    }
  }

  // Fallback: share text + image links
  const linkList = fallbackUrls.map((u, i) => `Image ${i + 1}: ${getDriveDownloadUrl(u)}`).join('\n');
  await navigator.share({ text: text + (linkList ? '\n\n' + linkList : '') });
  return true;
}

/**
 * Downloads a single image.
 * - Tries canvas blob capture first (CORS-safe).
 * - Falls back to opening the Google Drive direct-download URL in a new tab.
 */
export async function downloadImage(url, filename) {
  // 1. Try canvas blob (works if CORS headers present)
  const blob = await imageUrlToBlob(url);
  if (blob) {
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(objectUrl);
    return;
  }

  // 2. Fallback: open Drive download URL in new tab (browser triggers save dialog)
  const downloadUrl = getDriveDownloadUrl(url);
  window.open(downloadUrl, '_blank', 'noopener');
}

/**
 * Sanitizes a product name to be safe for use as a filename.
 */
export function toFilename(name) {
  return (name || 'product').replace(/[^a-zA-Z0-9_\- ]/g, '').trim().replace(/\s+/g, '-') + '.jpg';
}
