import chroma from "chroma-js";

/**
 * Helper to load an image URL into an HTMLImageElement safely.
 */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });
}

/**
 * Samples a single pixel color (in Hex) from an image at relative coordinates (percentage x, y).
 */
export async function samplePixelPercent(
  imageSrc: string,
  px: number, // percentage x (0 to 100)
  py: number  // percentage y (0 to 100)
): Promise<string> {
  try {
    const img = await loadImage(imageSrc);
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth || img.width;
    canvas.height = img.naturalHeight || img.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return "#800020";

    ctx.drawImage(img, 0, 0);

    const x = Math.min(Math.max(0, Math.floor((px / 100) * canvas.width)), canvas.width - 1);
    const y = Math.min(Math.max(0, Math.floor((py / 100) * canvas.height)), canvas.height - 1);

    const pixelData = ctx.getImageData(x, y, 1, 1).data;
    const hex = chroma([pixelData[0], pixelData[1], pixelData[2]]).hex();
    return hex;
  } catch {
    return "#800020";
  }
}

/**
 * Extracts initial dominant colors from Upper (y: 25-45%) and Lower (y: 55-75%) zones of an outfit.
 * Ignores white/black edges to attempt to capture actual fabrics.
 */
export async function extractGarmentColorsAuto(
  imageSrc: string
): Promise<{ upperHex: string; lowerHex: string }> {
  try {
    const img = await loadImage(imageSrc);
    const canvas = document.createElement("canvas");
    canvas.width = 150; // Use small canvas for fast color pooling
    canvas.height = 150;

    const ctx = canvas.getContext("2d");
    if (!ctx) return { upperHex: "#58111A", lowerHex: "#D4C9B9" };

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Helper to pool non-background, non-skin pixels
    const sampleZone = (startY: number, endY: number): string => {
      let rSum = 0, gSum = 0, bSum = 0, count = 0;
      const step = 2; // sample every 2nd pixel
      
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      const yStartIdx = Math.floor(startY * canvas.height);
      const yEndIdx = Math.floor(endY * canvas.height);

      for (let y = yStartIdx; y < yEndIdx; y += step) {
        // focus on the middle 60% horizontally to avoid side backgrounds
        const xStart = Math.floor(canvas.width * 0.2);
        const xEnd = Math.floor(canvas.width * 0.8);

        for (let x = xStart; x < xEnd; x += step) {
          const idx = (y * canvas.width + x) * 4;
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];
          const a = data[idx + 3];

          if (a < 150) continue;

          // Check if pixel is pure white, pure black, or skin-toned (rough check)
          const sum = r + g + b;
          const isWhite = r > 240 && g > 240 && b > 240;
          const isBlack = r < 20 && g < 20 && b < 20;
          const isSkin = r > 180 && g > 130 && b > 90 && r > g && g > b && (r - g) < 60;

          if (isWhite || isBlack || isSkin) {
            continue; // Ignore
          }

          rSum += r;
          gSum += g;
          bSum += b;
          count++;
        }
      }

      if (count > 0) {
        return chroma([Math.round(rSum / count), Math.round(gSum / count), Math.round(bSum / count)]).hex();
      }

      // fallback simple coordinates
      const midX = Math.floor(canvas.width / 2);
      const midY = Math.floor((startY + endY) / 2 * canvas.height);
      const fallbackIdx = (midY * canvas.width + midX) * 4;
      return chroma([data[fallbackIdx], data[fallbackIdx+1], data[fallbackIdx+2]]).hex();
    };

    const upperHex = sampleZone(0.25, 0.45);
    const lowerHex = sampleZone(0.55, 0.75);

    return { upperHex, lowerHex };
  } catch {
    return { upperHex: "#58111A", lowerHex: "#D4C9B9" };
  }
}
