/**
 * Utility to check actual file format of any URL
 * Usage in browser console: checkFileFormat('https://example.com/file.gif')
 */
const checkFileFormat = async (url) => {
  try {
    const res = await fetch(url);
    const buffer = await res.arrayBuffer();
    const bytes = new Uint8Array(buffer).slice(0, 12);

    const isGIF = bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46;
    const isWebP = bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 && bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50;
    const isPNG = bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47;
    const isJPEG = bytes[0] === 0xFF && bytes[1] === 0xD8;

    const actualFormat = isGIF ? 'GIF' : isWebP ? 'WebP' : isPNG ? 'PNG' : isJPEG ? 'JPEG' : 'Unknown';
    const claimedExtension = url.split('.').pop().toUpperCase();
    const mismatch = claimedExtension !== actualFormat;

    console.log('=== FILE FORMAT CHECK ===');
    console.log('URL:', url);
    console.log('Claimed Extension:', claimedExtension);
    console.log('Actual Format:', actualFormat);
    console.log('First bytes:', Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join(' '));
    console.log(mismatch ? '❌ MISMATCH - Backend Issue!' : '✅ Format matches extension');
    console.log('=========================');

    return { url, claimedExtension, actualFormat, mismatch };
  } catch (e) {
    console.error('Failed to check:', url, e);
  }
};

// Expose globally so it can be called from browser console
window.checkFileFormat = checkFileFormat;

export default checkFileFormat;
