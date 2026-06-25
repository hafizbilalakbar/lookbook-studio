import React, { useRef, useState, useEffect } from "react";
import { LookbookProject, TYPOGRAPHY_FONTS } from "../types";
import { samplePixelPercent } from "../utils/imageSampler";
import { getFashionColorName, hexToRgbString, validateHex } from "../utils/colorUtils";
import { motion } from "motion/react";
import { Eye, ShieldAlert, Sparkles, Move } from "lucide-react";

interface LookbookPreviewProps {
  project: LookbookProject;
  onUpdateColors: (upperHex: string, lowerHex: string, upperName?: string, lowerName?: string) => void;
  onUpdatePinCoords: (pinType: "upper" | "lower", coords: { x: number; y: number }) => void;
  isAnalyzing: boolean;
}

export default function LookbookPreview({
  project,
  onUpdateColors,
  onUpdatePinCoords,
  isAnalyzing,
}: LookbookPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const [activeDrag, setActiveDrag] = useState<"upper" | "lower" | null>(null);

  // Map chosen font token to real Tailwind font class
  const activeFont = TYPOGRAPHY_FONTS.find((f) => f.id === project.typography.fontFamily) || TYPOGRAPHY_FONTS[1];

  // Helper to handle coordinate tracking on drag
  const handlePointerDown = (pinType: "upper" | "lower") => (e: React.PointerEvent) => {
    e.preventDefault();
    setActiveDrag(pinType);
    if (imageContainerRef.current) {
      imageContainerRef.current.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = async (e: React.PointerEvent) => {
    if (!activeDrag || !imageContainerRef.current) return;

    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = Math.min(Math.max(0, ((e.clientX - rect.left) / rect.width) * 100), 100);
    const y = Math.min(Math.max(0, ((e.clientY - rect.top) / rect.height) * 100), 100);

    onUpdatePinCoords(activeDrag, { x, y });
  };

  const handlePointerUp = async (e: React.PointerEvent) => {
    if (!activeDrag || !imageContainerRef.current) return;
    imageContainerRef.current.releasePointerCapture(e.pointerId);

    const pinType = activeDrag;
    setActiveDrag(null);

    // After drag release, sample the color at the final coordinate!
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = Math.min(Math.max(0, ((e.clientX - rect.left) / rect.width) * 100), 100);
    const y = Math.min(Math.max(0, ((e.clientY - rect.top) / rect.height) * 100), 100);

    const sampledHex = await samplePixelPercent(project.image, x, y);
    const sampledName = getFashionColorName(sampledHex);

    if (pinType === "upper") {
      onUpdateColors(sampledHex, project.lowerGarment.hex, sampledName, project.lowerGarment.colorName);
    } else {
      onUpdateColors(project.upperGarment.hex, sampledHex, project.upperGarment.colorName, sampledName);
    }
  };

  // Resolve weights
  const getFontWeightClass = () => {
    switch (project.typography.fontWeight) {
      case "font-light": return "font-light";
      case "font-medium": return "font-medium";
      case "font-semibold": return "font-semibold";
      case "font-bold": return "font-bold";
      default: return "font-normal";
    }
  };

  const getTextAlignClass = () => {
    switch (project.typography.textAlign) {
      case "left": return "text-left items-start px-8";
      case "right": return "text-right items-end px-8";
      default: return "text-center items-center px-4";
    }
  };

  const getTextJustifyClass = () => {
    switch (project.typography.textPosition) {
      case "top": return "justify-start pt-16";
      case "bottom": return "justify-end pb-16";
      default: return "justify-center";
    }
  };

  const isCatalog = project.templateId === "catalog";

  const getTextColorForBlock = (colorHex: string, blockType: "upper" | "lower") => {
    if (project.typography.textColorMode === "cross-color") {
      return blockType === "upper" ? (project.lowerGarment.hex || "#0E0E0F") : (project.upperGarment.hex || "#0E0E0F");
    }
    
    if (isCatalog) {
      return "#111111";
    }
    
    if (project.typography.customTitleColor) {
      return project.typography.customTitleColor;
    }
    
    if (project.typography.textColorMode === "classic") {
      return "#FFFFFF";
    }
    
    if (project.typography.textColorMode === "contrast") {
      if (!colorHex || colorHex === "transparent") return "#FFFFFF";
      const cleanHex = colorHex.startsWith("#") ? colorHex : "#" + colorHex;
      const r = parseInt(cleanHex.slice(1, 3), 16) || 0;
      const g = parseInt(cleanHex.slice(3, 5), 16) || 0;
      const b = parseInt(cleanHex.slice(5, 7), 16) || 0;
      const yiq = (r * 299 + g * 587 + b * 114) / 1000;
      return yiq >= 128 ? "#111111" : "#FFFFFF";
    }
    
    return "rgba(255, 255, 255, 0.9)";
  };

  const getLabelColorForBlock = (colorHex: string, blockType: "upper" | "lower") => {
    if (project.typography.customLabelColor) {
      return project.typography.customLabelColor;
    }
    return getTextColorForBlock(colorHex, blockType);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 h-full relative">
      {/* Workspace Status and Frame Mode */}
      <div className="w-full max-w-[450px] flex justify-between items-center mb-4 px-2">
        <div className="flex items-center space-x-2">
          <Eye className="w-4 h-4 text-accent/80" />
          <span className="text-[10px] text-muted tracking-widest uppercase font-semibold">
            Lookbook Studio Preview
          </span>
        </div>
        <span className="text-[9px] px-2.5 py-0.5 bg-bg/40 border border-line rounded-full text-accent font-semibold font-mono">
          9:16 aspect Ratio
        </span>
      </div>

      {/* Main 9:16 Poster Viewport Wrapper */}
      <div
        ref={containerRef}
        className={`w-full max-w-[450px] aspect-[9/16] bg-bg shadow-2xl relative border border-line overflow-hidden flex ${
          project.layoutDirection === "palette-right" ? "flex-row-reverse" : "flex-row"
        } select-none group`}
        id="lookbook-live-poster-preview"
      >
        {/* Is analyzing overlay */}
        {isAnalyzing && (
          <div className="absolute inset-0 bg-bg/85 z-30 flex flex-col items-center justify-center space-y-4 p-8 text-center">
            <div className="w-10 h-10 border-2 border-line border-t-accent rounded-full animate-spin" />
            <div className="space-y-1">
              <p className="font-serif-cormorant text-2xl italic text-text-main">Detecting Colors...</p>
              <p className="text-[10px] text-muted tracking-widest uppercase">Parsing clothing pixels & recommending...</p>
            </div>
          </div>
        )}

        {/* 1. LEFT PANEL (40% width) */}
        <div className={`w-[40%] h-full flex flex-col relative z-10 ${
          project.layoutDirection === "palette-right" ? "border-l" : "border-r"
        } border-line`}>
          {/* Upper Color Block */}
          <div
            className="h-[50%] w-full flex flex-col relative transition-all duration-300"
            style={{ backgroundColor: project.upperGarment.hex?.trim() ? validateHex(project.upperGarment.hex, "#0E0E0F") : "#0E0E0F" }}
          >
            {/* White card layout override for 'catalog' template */}
            {isCatalog && ((project.typography.showColorName && project.upperGarment.colorName?.trim()) || 
              (project.typography.showCategoryLabel && project.typography.customUpperLabel?.trim()) ||
              (project.typography.showHexLabel && project.upperGarment.hex?.trim()) ||
              (project.typography.showRgbLabel && project.upperGarment.rgb?.trim())) && (
              <div className="absolute inset-4 bg-panel/95 shadow-md border border-line z-10 flex flex-col justify-center p-4 text-text-main transition-all duration-300" />
            )}

            <div
              className={`absolute inset-0 z-20 flex flex-col transition-all duration-300 ${
                project.typography.textColorMode === "cross-color"
                  ? "items-center justify-center text-center font-bold px-4"
                  : `${getFontWeightClass()} ${getTextAlignClass()} ${getTextJustifyClass()}`
              }`}
              style={{
                color: getTextColorForBlock(project.upperGarment.hex, "upper"),
                textShadow: project.typography.textShadow ? "2px 2px 8px rgba(0,0,0,0.4)" : "none",
              }}
            >
              {project.typography.textColorMode === "cross-color" ? (
                project.typography.showColorName && project.upperGarment.colorName?.trim() && (
                  <h2
                    className={`${activeFont.className} leading-tight select-text font-bold`}
                    style={{ fontSize: `${1.4 * project.typography.fontSize}rem` }}
                  >
                    {project.upperGarment.colorName}
                  </h2>
                )
              ) : (
                <>
                  {project.typography.showCategoryLabel && project.typography.customUpperLabel?.trim() && (
                    <span
                      className={`text-[10px] italic mb-1 uppercase tracking-widest opacity-75 ${activeFont.className}`}
                      style={{ color: getLabelColorForBlock(project.upperGarment.hex, "upper") }}
                    >
                      {project.typography.customUpperLabel}
                    </span>
                  )}
                  {project.typography.showColorName && project.upperGarment.colorName?.trim() && (
                    <h2
                      className={`${activeFont.className} leading-tight mb-2 select-text`}
                      style={{
                        fontSize: `${1.4 * project.typography.fontSize}rem`,
                        color: project.typography.customTitleColor || "inherit"
                      }}
                    >
                      {project.upperGarment.colorName}
                    </h2>
                  )}
                  {project.typography.showHexLabel && project.upperGarment.hex?.trim() && (
                    <span className="text-[9px] font-mono tracking-widest opacity-60 uppercase mb-0.5 select-all">
                      {project.upperGarment.hex}
                    </span>
                  )}
                  {project.typography.showRgbLabel && project.upperGarment.rgb?.trim() && (
                    <span className="text-[8px] font-mono opacity-55">
                      {project.upperGarment.rgb}
                    </span>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Lower Color Block */}
          <div
            className="h-[50%] w-full flex flex-col relative transition-all duration-300"
            style={{ backgroundColor: project.lowerGarment.hex?.trim() ? validateHex(project.lowerGarment.hex, "#0E0E0F") : "#0E0E0F" }}
          >
            {/* White card layout override for 'catalog' template */}
            {isCatalog && ((project.typography.showColorName && project.lowerGarment.colorName?.trim()) || 
              (project.typography.showCategoryLabel && project.typography.customLowerLabel?.trim()) ||
              (project.typography.showHexLabel && project.lowerGarment.hex?.trim()) ||
              (project.typography.showRgbLabel && project.lowerGarment.rgb?.trim())) && (
              <div className="absolute inset-4 bg-panel/95 shadow-md border border-line z-10 flex flex-col justify-center p-4 text-text-main transition-all duration-300" />
            )}

            <div
              className={`absolute inset-0 z-20 flex flex-col transition-all duration-300 ${
                project.typography.textColorMode === "cross-color"
                  ? "items-center justify-center text-center font-bold px-4"
                  : `${getFontWeightClass()} ${getTextAlignClass()} ${getTextJustifyClass()}`
              }`}
              style={{
                color: getTextColorForBlock(project.lowerGarment.hex, "lower"),
                textShadow: project.typography.textShadow ? "2px 2px 8px rgba(0,0,0,0.4)" : "none",
              }}
            >
              {project.typography.textColorMode === "cross-color" ? (
                project.typography.showColorName && project.lowerGarment.colorName?.trim() && (
                  <h2
                    className={`${activeFont.className} leading-tight select-text font-bold`}
                    style={{ fontSize: `${1.4 * project.typography.fontSize}rem` }}
                  >
                    {project.lowerGarment.colorName}
                  </h2>
                )
              ) : (
                <>
                  {project.typography.showCategoryLabel && project.typography.customLowerLabel?.trim() && (
                    <span
                      className={`text-[10px] italic mb-1 uppercase tracking-widest opacity-75 ${activeFont.className}`}
                      style={{ color: getLabelColorForBlock(project.lowerGarment.hex, "lower") }}
                    >
                      {project.typography.customLowerLabel}
                    </span>
                  )}
                  {project.typography.showColorName && project.lowerGarment.colorName?.trim() && (
                    <h2
                      className={`${activeFont.className} leading-tight mb-2 select-text`}
                      style={{
                        fontSize: `${1.4 * project.typography.fontSize}rem`,
                        color: project.typography.customTitleColor || "inherit"
                      }}
                    >
                      {project.lowerGarment.colorName}
                    </h2>
                  )}
                  {project.typography.showHexLabel && project.lowerGarment.hex?.trim() && (
                    <span className="text-[9px] font-mono tracking-widest opacity-60 uppercase mb-0.5 select-all">
                      {project.lowerGarment.hex}
                    </span>
                  )}
                  {project.typography.showRgbLabel && project.lowerGarment.rgb?.trim() && (
                    <span className="text-[8px] font-mono opacity-55">
                      {project.lowerGarment.rgb}
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* 2. RIGHT PANEL (60% width): IMAGE PRESERVED */}
        <div
          ref={imageContainerRef}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="w-[60%] h-full relative overflow-hidden bg-bg select-none z-10 cursor-crosshair touch-none"
        >
          {project.image ? (
            <img
              src={project.image}
              alt="Model lookbook outfit"
              className="w-full h-full object-cover pointer-events-none select-none transition-transform duration-300"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-muted p-4 text-center">
              <span className="text-xs uppercase tracking-widest">Image Area</span>
            </div>
          )}

          {/* Luxury watermark stamp overlays based on templates */}
          {(project.templateId === "story" || project.templateId === "pinterest") && (
            <div className="absolute bottom-6 right-6 text-right select-none opacity-40 pointer-events-none z-20">
              <p className="text-[7px] tracking-widest font-mono text-white">LOOKBOOK STUDIO</p>
              <p className="text-[6px] tracking-widest font-mono text-white/60">LOOKBOOK VOL 01</p>
            </div>
          )}

          {/* Elegant logo overlay if configured */}
          {project.brandLogo && (
            <div
              className={`absolute z-20 pointer-events-none`}
              style={{
                top: project.logoPosition === "bottom-center" ? "auto" : "24px",
                bottom: project.logoPosition === "bottom-center" ? "24px" : "auto",
                left: project.logoPosition === "top-right" ? "auto" : project.logoPosition === "bottom-center" ? "50%" : "24px",
                right: project.logoPosition === "top-right" ? "24px" : "auto",
                transform: project.logoPosition === "bottom-center" ? "translateX(-50%)" : "none",
              }}
            >
              <img
                src={project.brandLogo}
                alt="Brand Logo"
                style={{ transform: `scale(${project.logoScale})` }}
                className="max-h-[35px] max-w-[120px] object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
          )}

          {/* Interactive Draggable Garment Sample Pins */}
          {project.image && !isAnalyzing && (
            <>
              {/* Upper Pin */}
              <div
                style={{
                  left: `${project.upperPin.x}%`,
                  top: `${project.upperPin.y}%`,
                }}
                onPointerDown={handlePointerDown("upper")}
                className="absolute z-20 w-8 h-8 -ml-4 -mt-4 flex items-center justify-center cursor-move touch-none"
              >
                <div className="relative group/pin flex flex-col items-center">
                  <div
                    className="w-4 h-4 rounded-full border-2 border-white shadow-lg relative flex items-center justify-center"
                    style={{ backgroundColor: project.upperGarment.hex }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping absolute" />
                  </div>
                  <div className="absolute top-5 bg-black/80 backdrop-blur-sm text-[8px] font-mono px-1.5 py-0.5 rounded border border-white/20 whitespace-nowrap text-white pointer-events-none opacity-90 transition-opacity">
                    UPPER
                  </div>
                </div>
              </div>

              {/* Lower Pin */}
              <div
                style={{
                  left: `${project.lowerPin.x}%`,
                  top: `${project.lowerPin.y}%`,
                }}
                onPointerDown={handlePointerDown("lower")}
                className="absolute z-20 w-8 h-8 -ml-4 -mt-4 flex items-center justify-center cursor-move touch-none"
              >
                <div className="relative group/pin flex flex-col items-center">
                  <div
                    className="w-4 h-4 rounded-full border-2 border-white shadow-lg relative flex items-center justify-center"
                    style={{ backgroundColor: project.lowerGarment.hex }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping absolute" />
                  </div>
                  <div className="absolute top-5 bg-black/80 backdrop-blur-sm text-[8px] font-mono px-1.5 py-0.5 rounded border border-white/20 whitespace-nowrap text-white pointer-events-none opacity-90 transition-opacity">
                    LOWER
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Guide/Interaction cue */}
      <div className="mt-3 flex items-center space-x-1.5 text-muted text-[10px] font-medium">
        <Move className="w-3.5 h-3.5 text-accent/60 animate-pulse" />
        <span>Drag the pins over fabrics to sample colors in real-time</span>
      </div>
    </div>
  );
}
