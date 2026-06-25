export interface GarmentDetails {
  type: string;
  colorName: string;
  hex: string;
  rgb: string;
}

export interface ColorCombination {
  name: string;
  description: string;
  upperHex: string;
  lowerHex: string;
  upperName: string;
  lowerName: string;
}

export interface TypographySettings {
  fontFamily: string; // "font-serif-cormorant" | "font-serif-playfair" | "font-serif-bodoni" | "font-serif-baskerville" | "font-sans" | "font-mono"
  fontWeight: string; // "font-light" | "font-normal" | "font-medium" | "font-semibold" | "font-bold"
  fontSize: number; // base factor
  letterSpacing: string; // "tracking-tighter" | "tracking-tight" | "tracking-normal" | "tracking-wide" | "tracking-wider" | "tracking-widest"
  lineHeight: string; // "leading-none" | "leading-tight" | "leading-normal" | "leading-loose"
  textAlign: "left" | "center" | "right";
  textPosition: "top" | "center" | "bottom";
  textColorMode: "classic" | "matching" | "contrast" | "cross-color"; // control text coloring on blocks
  textShadow: boolean;
  customUpperLabel: string;
  customLowerLabel: string;
  showCategoryLabel: boolean;
  showColorName: boolean;
  showHexLabel: boolean;
  showRgbLabel: boolean;
  customLabelColor?: string;
  customTitleColor?: string;
}

export interface LookbookProject {
  id: string;
  name: string;
  image: string; // Data URL of the uploaded crop/original
  originalImage: string; // Original image uploaded
  upperGarment: GarmentDetails;
  lowerGarment: GarmentDetails;
  brandLogo: string | null; // Data URL of logo
  logoScale: number;
  logoPosition: "top-left" | "top-right" | "bottom-center";
  typography: TypographySettings;
  templateId: string;
  date: string;
  recommendations: ColorCombination[];
  upperPin: { x: number; y: number }; // percentage coordinates (0-100)
  lowerPin: { x: number; y: number };
  layoutDirection?: "palette-left" | "palette-right";
}

export interface BrandKit {
  logo: string | null;
  logoName: string | null;
  colors: string[];
  typographyPreset: {
    fontFamily: string;
    fontWeight: string;
    letterSpacing: string;
  };
}

export const TYPOGRAPHY_FONTS = [
  { id: "font-serif-cormorant", name: "Cormorant Garamond (Swiss Look)", className: "font-serif-cormorant" },
  { id: "font-serif-playfair", name: "Playfair Display (Zara Editorial)", className: "font-serif-playfair" },
  { id: "font-serif-bodoni", name: "Bodoni Moda (Vogue Premium)", className: "font-serif-bodoni" },
  { id: "font-serif-baskerville", name: "Libre Baskerville (Classic Heritage)", className: "font-serif-baskerville" },
  { id: "font-sans", name: "Inter Minimalist (Hugo Boss Modern)", className: "font-sans" },
  { id: "font-mono", name: "JetBrains Technical (Industrial Brutalist)", className: "font-mono" },
];

export const TEMPLATES = [
  { id: "pinterest", name: "Pinterest Lookbook Classic", description: "Balanced 40/60 lookbook layout ideal for Pinterest and mobile lookbooks." },
  { id: "editorial", name: "Zara Editorial", description: "Clean, fine-bordered luxury layout with classic high contrast text." },
  { id: "story", name: "Instagram Story Promo", description: "Minimal overlays with modern luxury brand markings." },
  { id: "catalog", name: "Massimo Dutti Catalog", description: "Soft background dividers and elegant catalog index cards." },
];
