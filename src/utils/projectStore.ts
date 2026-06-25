import { LookbookProject, BrandKit, TEMPLATES } from "../types";
import { getFashionColorName, hexToRgbString, generateFashionRecommendations } from "./colorUtils";
import { extractGarmentColorsAuto } from "./imageSampler";

const STORAGE_KEY_PROJECTS = "lookbook_studio_projects";
const STORAGE_KEY_BRANDKIT = "lookbook_studio_brandkit";

export function loadStoredProjects(): LookbookProject[] {
  try {
    const val = localStorage.getItem(STORAGE_KEY_PROJECTS);
    return val ? JSON.parse(val) : [];
  } catch {
    return [];
  }
}

export function saveProjectsToStorage(projects: LookbookProject[]) {
  try {
    localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
  } catch {
    // Storage unavailable
  }
}

export function loadStoredBrandKit(): BrandKit {
  try {
    const val = localStorage.getItem(STORAGE_KEY_BRANDKIT);
    return val ? JSON.parse(val) : {
      logo: null,
      logoName: null,
      colors: ["#58111A", "#D4C9B9", "#36454F", "#C19A6B"],
      typographyPreset: {
        fontFamily: "font-serif-playfair",
        fontWeight: "font-normal",
        letterSpacing: "tracking-wide"
      }
    };
  } catch {
    return {
      logo: null,
      logoName: null,
      colors: ["#58111A", "#D4C9B9", "#36454F", "#C19A6B"],
      typographyPreset: {
        fontFamily: "font-serif-playfair",
        fontWeight: "font-normal",
        letterSpacing: "tracking-wide"
      }
    };
  }
}

export function saveBrandKitToStorage(kit: BrandKit) {
  try {
    localStorage.setItem(STORAGE_KEY_BRANDKIT, JSON.stringify(kit));
  } catch {
    // Storage unavailable
  }
}

/**
 * Creates a brand new default project layout given an image source.
 */
export async function createDefaultProject(
  imageSrc: string,
  name: string
): Promise<LookbookProject> {
  // 1. Instantly sample the image colors client-side to keep user experience responsive
  const detected = await extractGarmentColorsAuto(imageSrc);
  
  const upName = getFashionColorName(detected.upperHex);
  const loName = getFashionColorName(detected.lowerHex);

  const defaultProject: LookbookProject = {
    id: `project_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    name: name || "Bespoke Silhouette Lookbook",
    image: imageSrc,
    originalImage: imageSrc,
    upperGarment: {
      type: "Upper Piece",
      colorName: upName,
      hex: detected.upperHex,
      rgb: hexToRgbString(detected.upperHex)
    },
    lowerGarment: {
      type: "Lower Piece",
      colorName: loName,
      hex: detected.lowerHex,
      rgb: hexToRgbString(detected.lowerHex)
    },
    brandLogo: null,
    logoScale: 1.0,
    logoPosition: "bottom-center",
    typography: {
      fontFamily: "font-serif-playfair",
      fontWeight: "font-normal",
      fontSize: 1.0,
      letterSpacing: "tracking-wide",
      lineHeight: "leading-normal",
      textAlign: "center",
      textPosition: "center",
      textColorMode: "classic",
      textShadow: false,
      customUpperLabel: "Upper Piece",
      customLowerLabel: "Lower Piece",
      showCategoryLabel: true,
      showColorName: true,
      showHexLabel: true,
      showRgbLabel: true,
      customLabelColor: "",
      customTitleColor: ""
    },
    templateId: "pinterest",
    date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    recommendations: generateFashionRecommendations(detected.upperHex, detected.lowerHex),
    upperPin: { x: 50, y: 35 }, // Default sample pin coordinates (percentage)
    lowerPin: { x: 50, y: 65 },
    layoutDirection: "palette-left"
  };

  return defaultProject;
}
