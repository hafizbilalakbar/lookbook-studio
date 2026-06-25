import chroma from "chroma-js";

export interface ColorNameMap {
  hex: string;
  name: string;
}

// Curated database of luxury fashion colors used by premier fashion houses
export const FASHION_COLORS: ColorNameMap[] = [
  { hex: "#4A0E17", name: "Deep Maroon" },
  { hex: "#58111A", name: "Rich Burgundy" },
  { hex: "#800020", name: "Oxblood Red" },
  { hex: "#3D2314", name: "Chocolate Brown" },
  { hex: "#2B1B10", name: "Espresso Noir" },
  { hex: "#4B3621", name: "Rich Coffee" },
  { hex: "#8D7A6F", name: "Warm Taupe" },
  { hex: "#8B8589", name: "Muted Mauve" },
  { hex: "#9B7E8B", name: "Shadow Rose" },
  { hex: "#D4C9B9", name: "Stone Beige" },
  { hex: "#E5D9C4", name: "Sanddrift" },
  { hex: "#F2EAD3", name: "Champagne Cream" },
  { hex: "#FAF9F6", name: "Off-White" },
  { hex: "#EAE6DF", name: "Oatmeal Meringue" },
  { hex: "#F6F6F6", name: "Sea Salt" },
  { hex: "#FFFFFF", name: "Ethereal White" },
  { hex: "#C19A6B", name: "Camel Tan" },
  { hex: "#A27A5C", name: "Cognac Leather" },
  { hex: "#C3B091", name: "British Khaki" },
  { hex: "#B85C37", name: "Canyon Clay" },
  { hex: "#B7410E", name: "Rust Orange" },
  { hex: "#8A3324", name: "Burnt Umber" },
  { hex: "#D4AF37", name: "Mustard Ochre" },
  { hex: "#4B5320", name: "Olive Drab" },
  { hex: "#556B2F", name: "Forest Olive" },
  { hex: "#224230", name: "Emerald Spruce" },
  { hex: "#1E3F20", name: "British Racing Green" },
  { hex: "#8F9E8B", name: "Sage Green" },
  { hex: "#9CAF88", name: "Eucalyptus" },
  { hex: "#191D32", name: "Midnight Navy" },
  { hex: "#1B263B", name: "Regatta Navy" },
  { hex: "#7A8B99", name: "Dusty Blue" },
  { hex: "#8C9EA3", name: "Slate Mist" },
  { hex: "#B0E0E6", name: "Powder Blue" },
  { hex: "#0055A5", name: "French Blue" },
  { hex: "#36454F", name: "Slate Charcoal" },
  { hex: "#2E3033", name: "Carbon Noir" },
  { hex: "#7E848C", name: "Steel Grey" },
  { hex: "#0D0D0D", name: "Pure Black" },
  { hex: "#E2725B", name: "Sienna Terracotta" },
  { hex: "#4E2A47", name: "Plum Jam" },
  { hex: "#913831", name: "Crimson Blush" },
];

/**
 * Returns the closest luxury fashion color name for a given HEX value.
 * Uses Chroma.js's Lab distance for accuracy relative to human perception.
 */
export function getFashionColorName(hex: string): string {
  try {
    const target = chroma(hex);
    let bestName = "Bespoke Hue";
    let minDistance = Infinity;

    for (const item of FASHION_COLORS) {
      try {
        const current = chroma(item.hex);
        const dist = chroma.distance(target, current, "lab");
        if (dist < minDistance) {
          minDistance = dist;
          bestName = item.name;
        }
      } catch (e) {
        // Skip invalid comparisons
      }
    }

    return bestName;
  } catch (err) {
    return "Custom Shade";
  }
}

/**
 * Converts hex code to standard rgb() format string.
 */
export function hexToRgbString(hex: string): string {
  try {
    const rgb = chroma(hex).rgb();
    return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
  } catch {
    return "rgb(128, 128, 128)";
  }
}

/**
 * Validates a hex color. Returns standard hex with "#" prefix if valid, else fallback.
 */
export function validateHex(hex: string, fallback = "#800020"): string {
  try {
    if (!hex.startsWith("#")) {
      hex = "#" + hex;
    }
    if (chroma.valid(hex)) {
      return chroma(hex).hex();
    }
    return fallback;
  } catch {
    return fallback;
  }
}

/**
 * Converts RGB components to Hex string.
 */
export function rgbToHex(r: number, g: number, b: number): string {
  try {
    return chroma([r, g, b]).hex();
  } catch {
    return "#800020";
  }
}

/**
 * Generates custom brand harmony recommendations based on the actual detected hex codes.
 */
export function generateFashionRecommendations(upperHex: string, lowerHex: string): Array<{
  name: string;
  description: string;
  upperHex: string;
  lowerHex: string;
  upperName: string;
  lowerName: string;
}> {
  try {
    const upName = getFashionColorName(upperHex);
    const loName = getFashionColorName(lowerHex);

    const recommendations = [
      {
        name: `${upName} + Oatmeal Meringue`,
        description: `Softens the ${upName.toLowerCase()} upper segment with a light, warm neutral, projecting elegant leisure.`,
        upperHex: upperHex,
        lowerHex: "#EAE6DF",
        upperName: upName,
        lowerName: "Oatmeal Meringue"
      },
      {
        name: `Sea Salt + ${loName}`,
        description: `A crisp, modern lookboard framing that draws all attention down to your premium ${loName.toLowerCase()} lower piece.`,
        upperHex: "#F6F6F6",
        lowerHex: lowerHex,
        upperName: "Sea Salt",
        lowerName: loName
      },
      {
        name: `${upName} + Slate Charcoal`,
        description: `Introduces rich industrial grey to the lower half, creating a formal and structured urban silhouette.`,
        upperHex: upperHex,
        lowerHex: "#36454F",
        upperName: upName,
        lowerName: "Slate Charcoal"
      },
      {
        name: `Camel Tan + ${loName}`,
        description: `The iconic Ralph Lauren pairing. Anchoring the shoulders with structured warm camel and dark lower trousers.`,
        upperHex: "#C19A6B",
        lowerHex: lowerHex,
        upperName: "Camel Tan",
        lowerName: loName
      },
      {
        name: `${upName} + Champagne Cream`,
        description: `Classic high-society look combining rich ${upName.toLowerCase()} tones with a delicate, buttery cream.`,
        upperHex: upperHex,
        lowerHex: "#F2EAD3",
        upperName: upName,
        lowerName: "Champagne Cream"
      }
    ];

    return recommendations;
  } catch {
    return [];
  }
}
