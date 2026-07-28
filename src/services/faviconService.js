let originalFaviconHref = null;

function getFaviconLink() {
  let link = document.querySelector("link[rel~='icon']");
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  return link;
}

/**
 * setFaviconBadge
 *
 * Draws a small red circular badge with the unread count over the current
 * favicon and swaps the <link rel="icon"> to the result. Falls back to
 * restoring the original favicon when count is 0 or falsy.
 *
 * @param {number} count
 */
export function setFaviconBadge(count) {
  const link = getFaviconLink();

  if (!originalFaviconHref) {
    originalFaviconHref = link.href || '/favicon.ico';
  }

  if (!count || count <= 0) {
    link.href = originalFaviconHref;
    return;
  }

  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const img = new Image();
  img.onload = () => {
    ctx.clearRect(0, 0, size, size);
    ctx.drawImage(img, 0, 0, size, size);

    const badgeRadius = size * 0.3;
    const cx = size - badgeRadius - 1;
    const cy = badgeRadius + 1;

    ctx.beginPath();
    ctx.arc(cx, cy, badgeRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#dc2626';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${badgeRadius}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(count > 9 ? '9+' : String(count), cx, cy + 1);

    link.href = canvas.toDataURL('image/png');
  };
  img.onerror = () => {
    // Original favicon couldn't be loaded onto the canvas (e.g. cross-origin) —
    // leave the favicon as-is rather than throwing.
  };
  img.src = originalFaviconHref;
}

/**
 * clearFaviconBadge
 *
 * Restores the original, un-badged favicon.
 */
export function clearFaviconBadge() {
  setFaviconBadge(0);
}