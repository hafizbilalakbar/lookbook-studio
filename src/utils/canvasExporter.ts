import { LookbookProject } from "../types";
import { saveAs } from "file-saver";
import { loadImage } from "./imageSampler";

/**
 * Renders the 4K poster (2160 x 3840) onto an HTML Canvas.
 * Can be used both for export and for generating high-res previews.
 */
export async function render4KCanvas(project: LookbookProject): Promise<HTMLCanvasElement> {
  const canvas = document.createElement("canvas");
  canvas.width = 2160;
  canvas.height = 3840;

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Could not get 2D context");

  const leftWidth = 864; // 40% of 2160
  const rightWidth = 1296; // 60% of 2160
  const blockHeight = 1920; // 50% of 3840

  const isPaletteRight = project.layoutDirection === "palette-right";
  const paletteX = isPaletteRight ? rightWidth : 0;
  const imageX = isPaletteRight ? 0 : leftWidth;

  const validateHexStr = (hex: string) => {
    if (!hex || hex.trim() === "") return "#0E0E0F";
    let formatted = hex.trim();
    if (!formatted.startsWith("#")) formatted = "#" + formatted;
    const isOk = /^#[0-9A-F]{3,8}$/i.test(formatted);
    return isOk ? formatted : "#0E0E0F";
  };

  // 1. Draw Top Block (Upper Garment Color)
  ctx.fillStyle = validateHexStr(project.upperGarment.hex);
  ctx.fillRect(paletteX, 0, leftWidth, blockHeight);

  // 2. Draw Bottom Block (Lower Garment Color)
  ctx.fillStyle = validateHexStr(project.lowerGarment.hex);
  ctx.fillRect(paletteX, blockHeight, leftWidth, blockHeight);

  // 3. Draw Image Panel (Cover Fit)
  // Fill dark background behind image to match preview's bg-neutral-900
  // Prevents thin border artifacts from anti-aliased edges on transparent canvas
  ctx.fillStyle = "#171717";
  ctx.fillRect(imageX, 0, rightWidth, 3840);

  if (project.image) {
    try {
      const img = await loadImage(project.image);
      const imgW = img.naturalWidth || img.width;
      const imgH = img.naturalHeight || img.height;

      const targetX = imageX;
      const targetY = 0;
      const targetW = rightWidth;
      const targetH = 3840;

      const imgRatio = imgW / imgH;
      const targetRatio = targetW / targetH;

      let sourceX = 0;
      let sourceY = 0;
      let sourceW = imgW;
      let sourceH = imgH;

      if (imgRatio > targetRatio) {
        // Image is wider than target: Crop left/right edges
        sourceW = imgH * targetRatio;
        sourceX = (imgW - sourceW) / 2;
      } else {
        // Image is taller than target: Crop top/bottom edges, but favor top portion slightly
        sourceH = imgW / targetRatio;
        sourceY = (imgH - sourceH) * 0.25; 
        if (sourceY < 0) sourceY = 0;
      }

      ctx.drawImage(img, sourceX, sourceY, sourceW, sourceH, targetX, targetY, targetW, targetH);
    } catch (err) {
      // Fallback placeholder grey if image loading fails
      ctx.fillStyle = "#EAEAEA";
      ctx.fillRect(imageX, 0, rightWidth, 3840);
      ctx.fillStyle = "#666666";
      ctx.font = "italic 40px serif";
      ctx.textAlign = "center";
      ctx.fillText("Model Image Unloaded", imageX + rightWidth / 2, 1920);
    }
  } else {
    // Empty state
    ctx.fillStyle = "#F5F5F5";
    ctx.fillRect(imageX, 0, rightWidth, 3840);
  }

  // 4. Draw Template Borders / Fine Lines (Zara / Massimo Dutti Aesthetics)
  if (project.templateId === "editorial") {
    // Elegant frame line between sections
    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(isPaletteRight ? rightWidth : leftWidth, 0);
    ctx.lineTo(isPaletteRight ? rightWidth : leftWidth, 3840);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(paletteX, blockHeight);
    ctx.lineTo(paletteX + leftWidth, blockHeight);
    ctx.stroke();
  } else if (project.templateId === "catalog") {
    // White card background behind colors for neat catalog index look
    const hasUpperText = (project.typography.showColorName && project.upperGarment.colorName?.trim()) || 
      (project.typography.showCategoryLabel && project.typography.customUpperLabel?.trim()) ||
      (project.typography.showHexLabel && project.upperGarment.hex?.trim()) ||
      (project.typography.showRgbLabel && project.upperGarment.rgb?.trim());

    const hasLowerText = (project.typography.showColorName && project.lowerGarment.colorName?.trim()) || 
      (project.typography.showCategoryLabel && project.typography.customLowerLabel?.trim()) ||
      (project.typography.showHexLabel && project.lowerGarment.hex?.trim()) ||
      (project.typography.showRgbLabel && project.lowerGarment.rgb?.trim());

    if (hasUpperText) {
      ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
      ctx.fillRect(paletteX + 50, 50, leftWidth - 100, blockHeight - 100);
    }
    if (hasLowerText) {
      ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
      ctx.fillRect(paletteX + 50, blockHeight + 50, leftWidth - 100, blockHeight - 100);
    }
  }

  // 5. Draw Typography on Panel Blocks
  const drawBlockText = (
    colorHex: string,
    colorName: string,
    label: string,
    yOffset: number, // 0 for upper, blockHeight for lower
    blockType: "upper" | "lower"
  ) => {
    ctx.save();

    // Determine readable text color based on background luminance
    let textColor = "#FFFFFF";
    if (project.typography.textColorMode === "cross-color") {
      textColor = blockType === "upper" ? (project.lowerGarment.hex || "#0E0E0F") : (project.upperGarment.hex || "#0E0E0F");
    } else if (project.typography.textColorMode === "classic") {
      textColor = "#FFFFFF"; // Keep it bright editorial
    } else if (project.typography.textColorMode === "contrast") {
      const cleanHex = colorHex.startsWith("#") ? colorHex : "#" + colorHex;
      const r = parseInt(cleanHex.slice(1, 3), 16) || 0;
      const g = parseInt(cleanHex.slice(3, 5), 16) || 0;
      const b = parseInt(cleanHex.slice(5, 7), 16) || 0;
      const yiq = (r * 299 + g * 587 + b * 114) / 1000;
      textColor = yiq >= 128 ? "#111111" : "#FFFFFF";
    } else {
      textColor = "rgba(255, 255, 255, 0.9)";
    }

    // Shadow settings
    if (project.typography.textShadow) {
      ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
      ctx.shadowBlur = 12;
      ctx.shadowOffsetX = 4;
      ctx.shadowOffsetY = 4;
    }

    const centerX = paletteX + leftWidth / 2;
    const baseCenterY = yOffset + blockHeight / 2;

    // Resolve Font Style
    let fontName = "Playfair Display";
    if (project.typography.fontFamily === "font-serif-cormorant") fontName = "Cormorant Garamond";
    else if (project.typography.fontFamily === "font-serif-bodoni") fontName = "Bodoni Moda";
    else if (project.typography.fontFamily === "font-serif-baskerville") fontName = "Libre Baskerville";
    else if (project.typography.fontFamily === "font-sans") fontName = "Inter";
    else if (project.typography.fontFamily === "font-mono") fontName = "JetBrains Mono";

    let weight = "normal";
    if (project.typography.textColorMode === "cross-color") {
      weight = "bold";
    } else if (project.typography.fontWeight === "font-light") weight = "300";
    else if (project.typography.fontWeight === "font-medium") weight = "500";
    else if (project.typography.fontWeight === "font-semibold") weight = "600";
    else if (project.typography.fontWeight === "font-bold") weight = "700";

    const textAlign = project.typography.textColorMode === "cross-color" ? "center" : project.typography.textAlign;
    ctx.textAlign = textAlign;
    let textX = centerX;
    if (textAlign === "left") textX = paletteX + 154;
    else if (textAlign === "right") textX = paletteX + leftWidth - 154;

    // Adjust font sizes proportionally for 4K
    // Preview renders at ~450x800, export at 2160x3840 = 4.8x scale
    // Preview sizes: title 1.4rem(~22.4px), label 10px, HEX 9px, RGB 8px
    const sizeMultiplier = project.typography.fontSize;
    const labelSize = Math.round(48 * sizeMultiplier);
    const titleSize = Math.round(108 * sizeMultiplier);
    const hexSize = Math.round(43 * sizeMultiplier);
    const rgbSize = Math.round(38 * sizeMultiplier);

    // Capitalize fashion-forward naming standard (Title Case Only, Never ALL CAPS)
    const capitalizeWords = (str: string) => {
      if (!str) return "";
      return str
        .toLowerCase()
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    };

    const formattedLabel = capitalizeWords(label);
    const formattedName = capitalizeWords(colorName);

    // Calculate layout vertical alignment
    // Preview uses pt-16/pb-16 (64px) padding, scaled 4.8x for 4K canvas
    let yPos = baseCenterY;
    if (project.typography.textColorMode !== "cross-color") {
      if (project.typography.textPosition === "top") {
        yPos = yOffset + 307;
      } else if (project.typography.textPosition === "bottom") {
        yPos = yOffset + blockHeight - 307;
      }
    }

    // Override text color if Catalog template is selected
    const isCatalog = project.templateId === "catalog";
    
    // Resolve custom text colors
    const finalLabelColor = project.typography.customLabelColor || (isCatalog ? "rgba(0, 0, 0, 0.5)" : "rgba(255, 255, 255, 0.7)");
    const finalTitleColor = project.typography.customTitleColor || (isCatalog ? "#111111" : textColor);
    const finalValueColor = isCatalog ? "rgba(0, 0, 0, 0.6)" : "rgba(255, 255, 255, 0.6)";

    if (project.typography.textColorMode === "cross-color") {
      // In cross-color mode: ONLY show color name, perfectly centered and bold
      if (project.typography.showColorName && colorName?.trim()) {
        ctx.fillStyle = textColor;
        ctx.font = `bold ${titleSize}px ${fontName}`;
        ctx.fillText(formattedName, textX, yPos);
      }
    } else {
      // 1. Label
      if (project.typography.showCategoryLabel && label?.trim()) {
        ctx.fillStyle = finalLabelColor;
        ctx.font = `italic ${labelSize}px ${fontName}`;
        ctx.fillText(formattedLabel, textX, yPos - 67);
      }

      // 2. Fashion Color Name
      if (project.typography.showColorName && colorName?.trim()) {
        ctx.fillStyle = finalTitleColor;
        ctx.font = `${weight} ${titleSize}px ${fontName}`;
        ctx.fillText(formattedName, textX, yPos);
      }

      // 3. HEX & RGB details
      let detailY = yPos + 144;
      ctx.fillStyle = finalValueColor;

      if (project.typography.showHexLabel && colorHex?.trim()) {
        ctx.font = `500 ${hexSize}px 'JetBrains Mono', monospace`;
        ctx.fillText(colorHex.toUpperCase(), textX, detailY);
        detailY += 53;
      }
      if (project.typography.showRgbLabel && colorHex?.trim()) {
        ctx.font = `500 ${rgbSize}px 'JetBrains Mono', monospace`;
        const rgbText = `RGB ${colorHex.slice(1).match(/.{2}/g)?.map(x => parseInt(x, 16)).join(", ")}`;
        ctx.fillText(rgbText, textX, detailY);
      }
    }

    ctx.restore();
  };

  // Always draw blocks (independent visibility checks are run inside drawBlockText)
  drawBlockText(
    project.upperGarment.hex,
    project.upperGarment.colorName,
    project.typography.customUpperLabel?.trim() ? project.typography.customUpperLabel : "",
    0,
    "upper"
  );

  drawBlockText(
    project.lowerGarment.hex,
    project.lowerGarment.colorName,
    project.typography.customLowerLabel?.trim() ? project.typography.customLowerLabel : "",
    blockHeight,
    "lower"
  );

  // 6. Draw Brand Logo overlays
  if (project.brandLogo) {
    try {
      const logoImg = await loadImage(project.brandLogo);
      const scale = project.logoScale || 1.0;
      const logoW = (logoImg.naturalWidth || logoImg.width) * scale * 0.8;
      const logoH = (logoImg.naturalHeight || logoImg.height) * scale * 0.8;

      let lx = imageX + 100;
      let ly = 100;

      if (project.logoPosition === "top-right") {
        lx = imageX + rightWidth - logoW - 100;
      } else if (project.logoPosition === "bottom-center") {
        lx = imageX + (rightWidth - logoW) / 2;
        ly = 3840 - logoH - 120;
      }

      ctx.drawImage(logoImg, lx, ly, logoW, logoH);
    } catch {
      // Logo rendering error
    }
  }

  // Draw standard lookup markings on templates (Instagram Story markings etc.)
  if (project.templateId === "story" || project.templateId === "pinterest") {
    ctx.save();
    ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
    ctx.font = "italic 28px 'JetBrains Mono', monospace";
    ctx.textAlign = "right";
    ctx.fillText("LOOKBOOK STUDIO", imageX + rightWidth - 80, 3840 - 80);
    ctx.fillText("4K HI-RES LOOKBOOK // VOL 01", imageX + rightWidth - 80, 3840 - 120);
    ctx.restore();
  }

  return canvas;
}

/**
 * Downloads the lookbook poster to user's local disk in requested formats.
 */
export async function exportPoster(
  project: LookbookProject,
  format: "png" | "jpeg" | "webp" = "png",
  quality = 1.0
): Promise<void> {
  try {
    const canvas = await render4KCanvas(project);
    const mimeMap = {
      png: "image/png",
      jpeg: "image/jpeg",
      webp: "image/webp",
    };

    const mime = mimeMap[format] || "image/png";
    const filename = `${project.name.toLowerCase().replace(/\s+/g, "_")}_lookbook.${format}`;

    canvas.toBlob(
      (blob) => {
        if (blob) {
          saveAs(blob, filename);
        }
      },
      mime,
      quality
    );
  } catch {
    alert("Export failed. Please try a different browser or file format.");
  }
}
