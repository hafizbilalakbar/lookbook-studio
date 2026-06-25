import JSZip from "jszip";
import { saveAs } from "file-saver";
import { LookbookProject } from "../types";
import { render4KCanvas } from "./canvasExporter";

/**
 * Renders multiple projects to 4K posters and exports them as a single ZIP archive.
 */
export async function exportBatchAsZip(
  projects: LookbookProject[],
  format: "png" | "jpeg" | "webp" = "png",
  onProgress?: (index: number, total: number) => void
): Promise<void> {
  if (projects.length === 0) return;

  const zip = new JSZip();
  const folder = zip.folder("lookbook_studio_campaign");

  const mimeMap = {
    png: "image/png",
    jpeg: "image/jpeg",
    webp: "image/webp",
  };
  const mime = mimeMap[format] || "image/png";

  for (let i = 0; i < projects.length; i++) {
    const project = projects[i];
    try {
      if (onProgress) {
        onProgress(i + 1, projects.length);
      }

      // Render the 4K canvas for this specific project
      const canvas = await render4KCanvas(project);

      // Convert canvas to base64 or blob arraybuffer
      const dataUrl = canvas.toDataURL(mime, 1.0);
      const base64Data = dataUrl.split(",")[1];

      const safeName = project.name.trim().toLowerCase().replace(/\s+/g, "_") || `outfit_${i + 1}`;
      folder?.file(`${safeName}_lookbook.${format}`, base64Data, { base64: true });
    } catch {
      // Skip failed export
    }
  }

  try {
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, `lookbook_studio_campaign_${Date.now()}.zip`);
  } catch {
    throw new Error("Failed to generate ZIP archive.");
  }
}
