import React, { useState, useRef } from "react";
import {
  LookbookProject,
  TYPOGRAPHY_FONTS,
  TEMPLATES,
  ColorCombination,
  BrandKit,
} from "../types";
import {
  Sparkles,
  Type,
  Palette,
  Briefcase,
  Download,
  Trash2,
  Copy,
  Undo2,
  Redo2,
  Camera,
  Image as ImageIcon,
  FolderOpen,
  Settings,
  Sliders,
  Check,
  Plus,
} from "lucide-react";
import { getFashionColorName, hexToRgbString, validateHex } from "../utils/colorUtils";

interface ControlPanelProps {
  project: LookbookProject;
  projects: LookbookProject[];
  brandKit: BrandKit;
  onUpdateProject: (updater: (prev: LookbookProject) => LookbookProject) => void;
  onSelectProject: (id: string) => void;
  onDeleteProject: (id: string) => void;
  onDuplicateProject: (id: string) => void;
  onSaveBrandKit: (kit: BrandKit) => void;
  onAddNewImages: (files: FileList) => void;
  onTriggerCamera: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onExport: (format: "png" | "jpeg" | "webp") => void;
  onExportBatch: (format: "png" | "jpeg" | "webp") => void;
  isExportingBatch: boolean;
  batchProgress: { current: number; total: number } | null;
}

export default function ControlPanel({
  project,
  projects,
  brandKit,
  onUpdateProject,
  onSelectProject,
  onDeleteProject,
  onDuplicateProject,
  onSaveBrandKit,
  onAddNewImages,
  onTriggerCamera,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onExport,
  onExportBatch,
  isExportingBatch,
  batchProgress,
}: ControlPanelProps) {
  const [activeTab, setActiveTab] = useState<"upload" | "colors" | "typography" | "harmony" | "brand" | "settings">("upload");
  const [aiProvider, setAiProvider] = useState(() => localStorage.getItem("ai_provider") || "auto");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleUpperColorChange = (hex: string) => {
    const isEmpty = !hex || hex.trim() === "";
    onUpdateProject((prev) => ({
      ...prev,
      upperGarment: {
        ...prev.upperGarment,
        hex: hex,
        rgb: isEmpty ? "" : hexToRgbString(validateHex(hex, hex)),
        colorName: prev.upperGarment.colorName || (isEmpty ? "" : getFashionColorName(hex)),
      },
    }));
  };

  const handleLowerColorChange = (hex: string) => {
    const isEmpty = !hex || hex.trim() === "";
    onUpdateProject((prev) => ({
      ...prev,
      lowerGarment: {
        ...prev.lowerGarment,
        hex: hex,
        rgb: isEmpty ? "" : hexToRgbString(validateHex(hex, hex)),
        colorName: prev.lowerGarment.colorName || (isEmpty ? "" : getFashionColorName(hex)),
      },
    }));
  };

  const handleUpperNameChange = (name: string) => {
    onUpdateProject((prev) => ({
      ...prev,
      upperGarment: { ...prev.upperGarment, colorName: name },
    }));
  };

  const handleLowerNameChange = (name: string) => {
    onUpdateProject((prev) => ({
      ...prev,
      lowerGarment: { ...prev.lowerGarment, colorName: name },
    }));
  };

  const handleTypographyChange = <K extends keyof LookbookProject["typography"]>(
    key: K,
    value: LookbookProject["typography"][K]
  ) => {
    onUpdateProject((prev) => ({
      ...prev,
      typography: {
        ...prev.typography,
        [key]: value,
      },
    }));
  };

  // Logo uploading handler
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const base64 = event.target.result as string;
          onSaveBrandKit({
            ...brandKit,
            logo: base64,
            logoName: file.name,
          });
          onUpdateProject((prev) => ({
            ...prev,
            brandLogo: base64,
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectTemplate = (templateId: string) => {
    onUpdateProject((prev) => ({
      ...prev,
      templateId,
    }));
  };

  const handleApplyRecommendation = (comb: ColorCombination) => {
    onUpdateProject((prev) => ({
      ...prev,
      upperGarment: {
        ...prev.upperGarment,
        hex: comb.upperHex,
        rgb: hexToRgbString(comb.upperHex),
        colorName: comb.upperName,
      },
      lowerGarment: {
        ...prev.lowerGarment,
        hex: comb.lowerHex,
        rgb: hexToRgbString(comb.lowerHex),
        colorName: comb.lowerName,
      },
    }));
  };

  return (
    <div className="h-full bg-panel text-text-main flex flex-col border-l border-line select-none">
      {/* Studio Header Toolbar */}
      <div className="p-4 border-b border-line flex justify-between items-center bg-bg">
        <div className="flex items-center space-x-2">
          <Sliders className="w-4 h-4 text-accent/80 animate-pulse" />
          <span className="font-serif-playfair text-xs tracking-widest font-semibold text-text-main">
            C A M P A I G N  <span className="text-accent italic font-light">S T U D I O</span>
          </span>
        </div>

        {/* Undo / Redo */}
        <div className="flex items-center space-x-1">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="p-1.5 hover:bg-accent/10 border border-line hover:border-accent/40 text-muted hover:text-accent disabled:opacity-20 disabled:pointer-events-none transition cursor-pointer"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="p-1.5 hover:bg-accent/10 border border-line hover:border-accent/40 text-muted hover:text-accent disabled:opacity-20 disabled:pointer-events-none transition cursor-pointer"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Tab Selectors */}
      <div className="grid grid-cols-6 border-b border-line bg-bg">
        {[
          { id: "upload", icon: FolderOpen, label: "Files" },
          { id: "colors", icon: Palette, label: "Colors" },
          { id: "typography", icon: Type, label: "Fonts" },
          { id: "harmony", icon: Sparkles, label: "Matches" },
          { id: "brand", icon: Briefcase, label: "Brand" },
          { id: "settings", icon: Settings, label: "Settings" },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 flex flex-col items-center justify-center transition cursor-pointer relative ${
                isActive ? "text-accent bg-panel font-medium" : "text-muted hover:text-text-main hover:bg-bg"
              }`}
            >
              <Icon className="w-4 h-4 mb-1" />
              <span className="text-[9px] uppercase tracking-wider font-light">{tab.label}</span>
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent" />
              )}
            </button>
          );
        })}
      </div>

      {/* Workspace Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* TAB 1: FILES & CAMPAIGN QUEUE */}
        {activeTab === "upload" && (
          <div className="space-y-6">
            <div>
              <h3 className="font-serif-playfair text-xl text-text-main mb-1">Active Campaign Queue</h3>
              <p className="text-[10px] text-muted tracking-wider uppercase">Upload more looks to run batch exports</p>
            </div>

            {/* Grid of existing outfits */}
            <div className="grid grid-cols-3 gap-3">
              {projects.map((proj) => {
                const isActive = proj.id === project.id;
                return (
                  <div
                    key={proj.id}
                    onClick={() => onSelectProject(proj.id)}
                    className={`relative aspect-[3/4] border transition-all duration-300 cursor-pointer group ${
                      isActive ? "border-accent shadow-[0_0_12px_rgba(197,162,103,0.2)]" : "border-line hover:border-accent/40"
                    }`}
                  >
                    <img
                      src={proj.image}
                      alt={proj.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    {/* Tiny visual colors indicator */}
                    <div className="absolute bottom-1 left-1 flex space-x-1 bg-bg/40 px-1 py-0.5 rounded-full">
                      <div className="w-2 h-2 rounded-full border border-white/30" style={{ backgroundColor: proj.upperGarment.hex }} />
                      <div className="w-2 h-2 rounded-full border border-white/30" style={{ backgroundColor: proj.lowerGarment.hex }} />
                    </div>

                    {/* Quick controls on hover */}
                    <div className="absolute inset-0 bg-bg/70 opacity-0 group-hover:opacity-100 flex items-center justify-center space-x-1.5 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDuplicateProject(proj.id);
                        }}
                        className="p-1 bg-panel hover:bg-accent border border-accent/20 hover:text-text-main text-accent transition"
                        title="Duplicate Look"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteProject(proj.id);
                        }}
                        className="p-1 bg-red-950/60 hover:bg-red-800 border border-red-900/30 text-red-400 hover:text-text-main transition"
                        title="Delete Look"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Add New Look card */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="aspect-[3/4] border border-dashed border-accent/20 hover:border-accent/50 bg-accent/[0.01] hover:bg-accent/[0.03] flex flex-col items-center justify-center text-accent/60 hover:text-accent transition cursor-pointer"
              >
                <Plus className="w-5 h-5 mb-1" />
                <span className="text-[8px] uppercase tracking-widest font-medium">Add Look</span>
              </button>
            </div>

            {/* Trigger upload and camera actions */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="py-2.5 px-4 bg-accent/10 hover:bg-accent/20 border border-accent/30 text-accent text-xs font-semibold tracking-widest uppercase transition rounded-none flex items-center justify-center space-x-2 cursor-pointer"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Upload Look</span>
              </button>
              <button
                onClick={onTriggerCamera}
                className="py-2.5 px-4 bg-bg/5 hover:bg-accent/10 border border-line hover:border-accent/20 text-text-main text-xs font-semibold tracking-widest uppercase transition rounded-none flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5 text-accent" />
                <span>Capture Live</span>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => e.target.files && onAddNewImages(e.target.files)}
                accept="image/*"
                multiple
                className="hidden"
              />
            </div>

            <div className="border-t border-line pt-4">
              <span className="text-[10px] text-muted uppercase tracking-widest block mb-3 font-semibold">Project Metadata</span>
              <div className="space-y-3">
                <div>
                  <label className="text-[9px] text-muted uppercase tracking-wider block mb-1 font-medium">Campaign Lookbook Name</label>
                  <input
                    type="text"
                    value={project.name}
                    onChange={(e) => {
                      const v = e.target.value;
                      onUpdateProject((prev) => ({ ...prev, name: v }));
                    }}
                    className="w-full bg-bg/40 border border-line px-3 py-2 text-xs text-text-main focus:outline-none focus:border-accent transition-colors rounded-none"
                    placeholder="E.g., Winter Suit Campaign Look"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PALETTE EDITOR */}
        {activeTab === "colors" && (
          <div className="space-y-6">
            <div>
              <h3 className="font-serif-playfair text-xl text-text-main mb-1">Fabric Palette</h3>
              <p className="text-[10px] text-muted tracking-wider uppercase">Manually override and name isolated colors</p>
            </div>

            {/* Upper Garment */}
            <div className="bg-bg/40 border border-line p-4 space-y-4 rounded-sm">
              <div className="flex items-center justify-between border-b border-line pb-2">
                <span className="text-[10px] tracking-widest uppercase text-muted font-medium">Upper Silhouette Fabric</span>
                <div className="w-6 h-6 border border-accent/20 shadow-md" style={{ backgroundColor: project.upperGarment.hex }} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] text-muted uppercase tracking-wider block mb-1 font-medium">Garment Label</label>
                  <input
                    type="text"
                    value={project.typography.customUpperLabel}
                    onChange={(e) => handleTypographyChange("customUpperLabel", e.target.value)}
                    className="w-full bg-bg/40 border border-line px-2.5 py-1.5 text-xs text-text-main focus:outline-none focus:border-accent transition-colors rounded-none"
                    placeholder="E.g., Blazer Coat"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-muted uppercase tracking-wider block mb-1 font-medium">Fashion Hue Name</label>
                  <input
                    type="text"
                    value={project.upperGarment.colorName}
                    onChange={(e) => handleUpperNameChange(e.target.value)}
                    className="w-full bg-bg/40 border border-line px-2.5 py-1.5 text-xs text-text-main focus:outline-none focus:border-accent transition-colors rounded-none"
                    placeholder="E.g., Rich Burgundy"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 items-end">
                <div className="col-span-2">
                  <label className="text-[9px] text-muted uppercase tracking-wider block mb-1 font-medium">Hex Code</label>
                  <input
                    type="text"
                    value={project.upperGarment.hex}
                    onChange={(e) => handleUpperColorChange(e.target.value)}
                    className="w-full bg-bg/40 border border-line px-2.5 py-1.5 text-xs font-mono text-text-main focus:outline-none focus:border-accent transition-colors rounded-none uppercase"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-muted uppercase tracking-wider block mb-1 font-medium">Picker</label>
                  <input
                    type="color"
                    value={project.upperGarment.hex}
                    onChange={(e) => handleUpperColorChange(e.target.value)}
                    className="w-full bg-bg/40 border border-line p-0.5 h-8 cursor-pointer rounded-none"
                  />
                </div>
              </div>

              <div className="text-[9px] font-mono text-muted flex justify-between border-t border-line/50 pt-2">
                <span>RGB MONITOR</span>
                <span className="text-muted">{project.upperGarment.rgb}</span>
              </div>
            </div>

            {/* Lower Garment */}
            <div className="bg-bg/40 border border-line p-4 space-y-4 rounded-sm">
              <div className="flex items-center justify-between border-b border-line pb-2">
                <span className="text-[10px] tracking-widest uppercase text-muted font-medium">Lower Silhouette Fabric</span>
                <div className="w-6 h-6 border border-accent/20 shadow-md" style={{ backgroundColor: project.lowerGarment.hex }} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] text-muted uppercase tracking-wider block mb-1 font-medium">Garment Label</label>
                  <input
                    type="text"
                    value={project.typography.customLowerLabel}
                    onChange={(e) => handleTypographyChange("customLowerLabel", e.target.value)}
                    className="w-full bg-bg/40 border border-line px-2.5 py-1.5 text-xs text-text-main focus:outline-none focus:border-accent transition-colors rounded-none"
                    placeholder="E.g., Chino Pants"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-muted uppercase tracking-wider block mb-1 font-medium">Fashion Hue Name</label>
                  <input
                    type="text"
                    value={project.lowerGarment.colorName}
                    onChange={(e) => handleLowerNameChange(e.target.value)}
                    className="w-full bg-bg/40 border border-line px-2.5 py-1.5 text-xs text-text-main focus:outline-none focus:border-accent transition-colors rounded-none"
                    placeholder="E.g., Stone Beige"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 items-end">
                <div className="col-span-2">
                  <label className="text-[9px] text-muted uppercase tracking-wider block mb-1 font-medium">Hex Code</label>
                  <input
                    type="text"
                    value={project.lowerGarment.hex}
                    onChange={(e) => handleLowerColorChange(e.target.value)}
                    className="w-full bg-bg/40 border border-line px-2.5 py-1.5 text-xs font-mono text-text-main focus:outline-none focus:border-accent transition-colors rounded-none uppercase"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-muted uppercase tracking-wider block mb-1 font-medium">Picker</label>
                  <input
                    type="color"
                    value={project.lowerGarment.hex}
                    onChange={(e) => handleLowerColorChange(e.target.value)}
                    className="w-full bg-bg/40 border border-line p-0.5 h-8 cursor-pointer rounded-none"
                  />
                </div>
              </div>

              <div className="text-[9px] font-mono text-muted flex justify-between border-t border-line/50 pt-2">
                <span>RGB MONITOR</span>
                <span className="text-muted">{project.lowerGarment.rgb}</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: TYPOGRAPHY STUDIO */}
        {activeTab === "typography" && (
          <div className="space-y-6">
            <div>
              <h3 className="font-serif-playfair text-xl text-text-main mb-1">Typography Studio</h3>
              <p className="text-[10px] text-muted tracking-wider uppercase">Style fonts, scale factor, and alignment</p>
            </div>

            <div className="bg-bg/40 border border-line p-4 space-y-4 rounded-sm">
              {/* Font Family Selector */}
              <div>
                <label className="text-[9px] text-muted uppercase tracking-wider block mb-1.5 font-medium">Editorial Font Family</label>
                <div className="grid grid-cols-1 gap-1.5">
                  {TYPOGRAPHY_FONTS.map((font) => {
                    const isSelected = project.typography.fontFamily === font.id;
                    return (
                      <button
                        key={font.id}
                        onClick={() => handleTypographyChange("fontFamily", font.id)}
                        className={`px-3 py-2 text-left text-xs border tracking-wide flex justify-between items-center transition cursor-pointer ${
                          isSelected ? "border-accent bg-accent/10 text-accent" : "border-line hover:border-accent/40 text-muted hover:text-text-main bg-transparent"
                        }`}
                      >
                        <span className={font.className}>{font.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-accent" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Weight Selector */}
              <div>
                <label className="text-[9px] text-muted uppercase tracking-wider block mb-1.5 font-medium">Font Weight</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { id: "font-light", label: "Light" },
                    { id: "font-normal", label: "Book" },
                    { id: "font-medium", label: "Medium" },
                    { id: "font-bold", label: "Bold" },
                  ].map((w) => {
                    const isSelected = project.typography.fontWeight === w.id;
                    return (
                      <button
                        key={w.id}
                        onClick={() => handleTypographyChange("fontWeight", w.id)}
                        className={`py-1.5 text-center text-[10px] uppercase tracking-wider border transition cursor-pointer ${
                          isSelected ? "border-accent bg-accent/10 text-accent font-medium" : "border-line hover:border-accent/40 text-muted hover:text-text-main"
                        }`}
                      >
                        {w.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Scale Adjuster slider */}
              <div>
                <div className="flex justify-between text-[9px] text-muted uppercase tracking-wider mb-1 font-medium">
                  <span>Font Size Scale</span>
                  <span className="font-mono text-text-secondary">{Math.round(project.typography.fontSize * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="1.8"
                  step="0.05"
                  value={project.typography.fontSize}
                  onChange={(e) => handleTypographyChange("fontSize", parseFloat(e.target.value))}
                  className="w-full accent-accent cursor-pointer"
                />
              </div>

              {/* Text Alignments */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] text-muted uppercase tracking-wider block mb-1 font-medium">Text Alignment</label>
                  <div className="grid grid-cols-3 gap-1">
                    {[
                      { id: "left", label: "Left" },
                      { id: "center", label: "Center" },
                      { id: "right", label: "Right" },
                    ].map((align) => {
                      const isSelected = project.typography.textAlign === align.id;
                      return (
                        <button
                          key={align.id}
                          onClick={() => handleTypographyChange("textAlign", align.id as any)}
                          className={`py-1 border text-[9px] uppercase tracking-wider transition cursor-pointer ${
                            isSelected ? "border-accent bg-accent/10 text-accent font-medium" : "border-line text-muted hover:text-text-main"
                          }`}
                        >
                          {align.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="text-[9px] text-muted uppercase tracking-wider block mb-1 font-medium">Text Position</label>
                  <div className="grid grid-cols-3 gap-1">
                    {[
                      { id: "top", label: "Top" },
                      { id: "center", label: "Mid" },
                      { id: "bottom", label: "Bot" },
                    ].map((pos) => {
                      const isSelected = project.typography.textPosition === pos.id;
                      return (
                        <button
                          key={pos.id}
                          onClick={() => handleTypographyChange("textPosition", pos.id as any)}
                          className={`py-1 border text-[9px] uppercase tracking-wider transition cursor-pointer ${
                            isSelected ? "border-accent bg-accent/10 text-accent font-medium" : "border-line text-muted hover:text-text-main"
                          }`}
                        >
                          {pos.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Color Mode Selection */}
              <div>
                <label className="text-[9px] text-muted uppercase tracking-wider block mb-1 font-medium">Typography Contrast Mode</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: "classic", label: "Classic White" },
                    { id: "contrast", label: "Dynamic Contrast" },
                    { id: "matching", label: "Muted Match" },
                    { id: "cross-color", label: "Cross-Color Contrast" },
                  ].map((mode) => {
                    const isSelected = project.typography.textColorMode === mode.id;
                    return (
                      <button
                        key={mode.id}
                        onClick={() => handleTypographyChange("textColorMode", mode.id as any)}
                        className={`py-1.5 px-1 border text-[9px] uppercase tracking-wider text-center transition cursor-pointer ${
                          isSelected ? "border-accent bg-accent/10 text-accent font-medium" : "border-line text-muted hover:text-text-main"
                        }`}
                      >
                        {mode.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Typography Color Controls */}
              <div className="space-y-3 pt-3 border-t border-line">
                <span className="text-[9px] text-muted uppercase tracking-wider block font-medium">Custom Typography Colors</span>
                
                <div className="grid grid-cols-2 gap-3">
                  {/* Garment Label Color Picker */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-muted block font-mono">Label Text Color</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={project.typography.customLabelColor || "#FFFFFF"}
                        onChange={(e) => handleTypographyChange("customLabelColor", e.target.value)}
                        className="w-8 h-8 rounded-full border border-line bg-transparent cursor-pointer p-0 overflow-hidden"
                      />
                      <input
                        type="text"
                        value={project.typography.customLabelColor || ""}
                        placeholder="Default"
                        onChange={(e) => handleTypographyChange("customLabelColor", e.target.value)}
                        className="flex-1 bg-bg/50 border border-line text-xs py-1.5 px-2 text-text-main font-mono rounded-sm focus:outline-none focus:border-accent"
                      />
                    </div>
                  </div>

                  {/* Fashion Hue Name Color Picker */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-muted block font-mono">Title/Hue Text Color</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={project.typography.customTitleColor || "#FFFFFF"}
                        onChange={(e) => handleTypographyChange("customTitleColor", e.target.value)}
                        className="w-8 h-8 rounded-full border border-line bg-transparent cursor-pointer p-0 overflow-hidden"
                      />
                      <input
                        type="text"
                        value={project.typography.customTitleColor || ""}
                        placeholder="Default"
                        onChange={(e) => handleTypographyChange("customTitleColor", e.target.value)}
                        className="flex-1 bg-bg/50 border border-line text-xs py-1.5 px-2 text-text-main font-mono rounded-sm focus:outline-none focus:border-accent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Toggle Switche controls */}
              <div className="space-y-2 border-t border-line pt-3">
                <label className="flex items-center justify-between text-xs cursor-pointer group">
                  <span className="text-muted group-hover:text-text-main transition-colors">Display Category/Type Label</span>
                  <input
                    type="checkbox"
                    checked={project.typography.showCategoryLabel}
                    onChange={(e) => handleTypographyChange("showCategoryLabel", e.target.checked)}
                    className="accent-accent cursor-pointer"
                  />
                </label>
                <label className="flex items-center justify-between text-xs cursor-pointer group">
                  <span className="text-muted group-hover:text-text-main transition-colors">Display Fashion Hue Name</span>
                  <input
                    type="checkbox"
                    checked={project.typography.showColorName}
                    onChange={(e) => handleTypographyChange("showColorName", e.target.checked)}
                    className="accent-accent cursor-pointer"
                  />
                </label>
                <label className="flex items-center justify-between text-xs cursor-pointer group">
                  <span className="text-muted group-hover:text-text-main transition-colors">Display HEX Labels</span>
                  <input
                    type="checkbox"
                    checked={project.typography.showHexLabel}
                    onChange={(e) => handleTypographyChange("showHexLabel", e.target.checked)}
                    className="accent-accent cursor-pointer"
                  />
                </label>
                <label className="flex items-center justify-between text-xs cursor-pointer group">
                  <span className="text-muted group-hover:text-text-main transition-colors">Display RGB Labels</span>
                  <input
                    type="checkbox"
                    checked={project.typography.showRgbLabel}
                    onChange={(e) => handleTypographyChange("showRgbLabel", e.target.checked)}
                    className="accent-accent cursor-pointer"
                  />
                </label>
                <label className="flex items-center justify-between text-xs cursor-pointer group">
                  <span className="text-muted group-hover:text-text-main transition-colors">Drop text shadows</span>
                  <input
                    type="checkbox"
                    checked={project.typography.textShadow}
                    onChange={(e) => handleTypographyChange("textShadow", e.target.checked)}
                    className="accent-accent cursor-pointer"
                  />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: COLOR INTELLIGENCE ENG */}
        {activeTab === "harmony" && (
          <div className="space-y-6">
            <div>
              <h3 className="font-serif-playfair text-xl text-text-main mb-1">Color Intelligence</h3>
              <p className="text-[10px] text-muted tracking-wider uppercase">Sartorial recommendations & styling rules</p>
            </div>

            <div className="space-y-3">
              {project.recommendations && project.recommendations.length > 0 ? (
                project.recommendations.map((comb, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleApplyRecommendation(comb)}
                    className="bg-bg/40 border border-line hover:border-accent/40 hover:bg-bg/80 p-4 transition duration-300 cursor-pointer text-left space-y-3 group rounded-sm"
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-serif-playfair text-sm text-text-main group-hover:text-accent transition">
                        {comb.name}
                      </h4>
                      <span className="text-[7px] border border-accent/20 bg-accent/5 px-1 py-0.5 uppercase tracking-widest text-accent group-hover:border-accent/40 transition-colors">
                        Apply Preview
                      </span>
                    </div>

                    <p className="text-[10px] text-text-secondary leading-relaxed font-light">
                      {comb.description}
                    </p>

                    {/* Palette block preview */}
                    <div className="grid grid-cols-2 h-4 border border-line rounded-xs overflow-hidden">
                      <div className="h-full" style={{ backgroundColor: comb.upperHex }} title={comb.upperName} />
                      <div className="h-full" style={{ backgroundColor: comb.lowerHex }} title={comb.lowerName} />
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center bg-bg border border-line text-muted text-xs italic">
                  Upload an image to compute styling recommendations.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: BRAND KIT & TEMPLATES */}
        {activeTab === "brand" && (
          <div className="space-y-6">
            <div>
              <h3 className="font-serif-playfair text-xl text-text-main mb-1">Brand & Templates</h3>
              <p className="text-[10px] text-muted tracking-wider uppercase">Manage brand assets and layouts</p>
            </div>

            {/* Templates Selector */}
            <div className="space-y-3">
              <span className="text-[9px] text-muted uppercase tracking-widest font-semibold block">Layout Lookbook Preset</span>
              <div className="grid grid-cols-2 gap-3">
                {TEMPLATES.map((tmpl) => {
                  const isSelected = project.templateId === tmpl.id;
                  return (
                    <button
                      key={tmpl.id}
                      onClick={() => handleSelectTemplate(tmpl.id)}
                      className={`p-3 text-left border flex flex-col justify-between transition h-24 cursor-pointer relative rounded-sm ${
                        isSelected ? "border-accent bg-accent/5 text-accent shadow-[0_0_12px_rgba(197,162,103,0.1)]" : "border-line hover:border-accent/30 text-muted bg-transparent hover:text-text-main"
                      }`}
                    >
                      <span className="text-[10px] font-semibold tracking-wider">{tmpl.name}</span>
                      <span className="text-[8px] text-muted leading-tight font-light">{tmpl.description}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Lookbook Studio Layout Toggle */}
            <div className="space-y-3 bg-bg/40 border border-line p-4 rounded-sm">
              <span className="text-[9px] text-muted uppercase tracking-widest font-semibold block border-b border-line pb-2">
                Studio Viewport Layout Toggle
              </span>
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                {[
                  { id: "palette-left", label: "Palette Left / Image Right" },
                  { id: "palette-right", label: "Image Left / Palette Right" },
                ].map((layout) => {
                  const isSelected = (project.layoutDirection || "palette-left") === layout.id;
                  return (
                    <button
                      key={layout.id}
                      onClick={() => {
                        onUpdateProject((prev) => ({
                          ...prev,
                          layoutDirection: layout.id as "palette-left" | "palette-right",
                        }));
                      }}
                      className={`py-2.5 px-3 text-center border text-[10px] tracking-wider uppercase font-semibold transition cursor-pointer rounded-sm ${
                        isSelected
                          ? "border-accent bg-accent/10 text-accent font-bold"
                          : "border-line hover:border-accent/40 text-muted hover:text-text-main bg-transparent"
                      }`}
                    >
                      {layout.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Brand Logo Upload */}
            <div className="bg-bg/40 border border-line p-4 space-y-4 rounded-sm">
              <span className="text-[9px] tracking-widest uppercase text-muted block border-b border-line pb-2 font-medium">
                Brand Logo Stamp
              </span>

              {brandKit.logo ? (
                <div className="space-y-3">
                  <div className="p-4 bg-bg/40 border border-line flex items-center justify-center h-16 rounded-xs">
                    <img
                      src={brandKit.logo}
                      alt="Brand logo preview"
                      className="max-h-full max-w-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-muted">
                    <span className="truncate max-w-[150px]">{brandKit.logoName}</span>
                    <button
                      onClick={() => {
                        onSaveBrandKit({ ...brandKit, logo: null, logoName: null });
                        onUpdateProject((prev) => ({ ...prev, brandLogo: null }));
                      }}
                      className="text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                    >
                      Remove Logo
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => logoInputRef.current?.click()}
                  className="w-full py-4 border border-dashed border-accent/20 hover:border-accent/50 bg-transparent text-center text-xs text-accent/60 hover:text-accent transition cursor-pointer rounded-xs"
                >
                  Upload transparent PNG/SVG Logo
                </button>
              )}

              <input
                type="file"
                ref={logoInputRef}
                onChange={handleLogoUpload}
                accept="image/png, image/svg+xml"
                className="hidden"
              />

              {brandKit.logo && (
                <>
                  {/* Logo Positions */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "top-left", label: "Top L" },
                      { id: "top-right", label: "Top R" },
                      { id: "bottom-center", label: "Bottom" },
                    ].map((pos) => {
                      const isSelected = project.logoPosition === pos.id;
                      return (
                        <button
                          key={pos.id}
                          onClick={() => {
                            onUpdateProject((prev) => ({ ...prev, logoPosition: pos.id as any }));
                          }}
                          className={`py-1 border text-[9px] uppercase tracking-wider transition cursor-pointer ${
                            isSelected ? "border-accent bg-accent/10 text-accent font-medium" : "border-line text-muted hover:text-text-main"
                          }`}
                        >
                          {pos.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Logo Scale slider */}
                  <div>
                    <div className="flex justify-between text-[9px] text-muted uppercase tracking-wider mb-1 font-medium">
                      <span>Logo Scale</span>
                      <span className="font-mono text-text-secondary">{Math.round(project.logoScale * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.4"
                      max="1.6"
                      step="0.05"
                      value={project.logoScale}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        onUpdateProject((prev) => ({ ...prev, logoScale: val }));
                      }}
                      className="w-full accent-accent cursor-pointer"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* TAB 6: SETTINGS */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            <div>
              <h3 className="font-serif-playfair text-xl text-text-main mb-1">Settings</h3>
              <p className="text-[10px] text-muted tracking-wider uppercase">Application preferences & AI configuration</p>
            </div>

            {/* AI Provider Selector */}
            <div className="bg-bg/40 border border-line p-4 space-y-4 rounded-sm">
              <span className="text-[9px] text-muted uppercase tracking-widest font-semibold block border-b border-line pb-2">
                AI Color Analysis Provider
              </span>
              <p className="text-[10px] text-muted leading-relaxed">
                Choose which AI provider powers the fashion color naming engine.
                When set to Auto, the system uses Gemini if available, then OpenRouter,
                then falls back to local pixel sampling.
              </p>
              <div className="space-y-2 pt-1">
                {[
                  { id: "auto", label: "Auto Detect", desc: "Gemini \u2192 OpenRouter \u2192 Local" },
                  { id: "gemini", label: "Google Gemini", desc: "Requires GEMINI_API_KEY" },
                  { id: "openrouter", label: "OpenRouter", desc: "Requires OPENROUTER_API_KEY" },
                  { id: "local", label: "Local Detection", desc: "Client-side pixel sampling only" },
                ].map((option) => {
                  const isSelected = aiProvider === option.id;
                  return (
                    <button
                      key={option.id}
                      onClick={() => {
                        setAiProvider(option.id);
                        localStorage.setItem("ai_provider", option.id);
                      }}
                      className={`w-full p-3 text-left border transition cursor-pointer rounded-sm flex justify-between items-center ${
                        isSelected
                          ? "border-accent bg-accent/10 text-accent"
                          : "border-line hover:border-accent/30 text-muted hover:text-text-main bg-transparent"
                      }`}
                    >
                      <div>
                        <span className="text-xs font-semibold block">{option.label}</span>
                        <span className="text-[9px] text-muted">{option.desc}</span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-accent shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Provider Status */}
            <div className="bg-bg/40 border border-line p-4 space-y-3 rounded-sm">
              <span className="text-[9px] text-muted uppercase tracking-widest font-semibold block border-b border-line pb-2">
                Provider Status
              </span>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted">Google Gemini</span>
                  <span className="font-mono text-[10px]">
                    {aiProvider === "gemini" ? "Selected" : "Fallback"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted">OpenRouter</span>
                  <span className="font-mono text-[10px]">
                    {aiProvider === "openrouter" ? "Selected" : "Fallback"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted">Local Detection</span>
                  <span className="font-mono text-[10px] text-green-400">Always available</span>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="text-[9px] text-muted/50 leading-relaxed space-y-1 pt-2">
              <p>API keys are configured server-side via environment variables.</p>
              <p>Set GEMINI_API_KEY and/or OPENROUTER_API_KEY in your .env file.</p>
              <p>Keys are never exposed to the browser or stored in client code.</p>
            </div>
          </div>
        )}
      </div>

      {/* Campaign Exporter Center */}
      <div className="p-6 bg-bg border-t border-line space-y-4">
        <h4 className="text-[10px] text-muted uppercase tracking-widest text-left mb-1 font-semibold">Export Center</h4>
        
        {/* Single lookbook exporter */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onExport("png")}
            className="py-3 bg-accent text-bg hover:bg-accent/90 font-semibold text-xs tracking-widest uppercase transition flex items-center justify-center space-x-1.5 rounded-none cursor-pointer border border-accent"
          >
            <Download className="w-3.5 h-3.5" />
            <span>4K PNG</span>
          </button>
          <button
            onClick={() => onExport("jpeg")}
            className="py-3 bg-transparent hover:bg-accent/10 border border-accent/30 hover:border-accent/50 text-text-main font-medium text-xs tracking-widest uppercase transition flex items-center justify-center space-x-1.5 rounded-none cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-accent" />
            <span>4K JPG</span>
          </button>
        </div>

        {/* Batch Exporter */}
        <button
          onClick={() => onExportBatch("png")}
          disabled={isExportingBatch}
          className="w-full py-3 bg-accent/10 hover:bg-accent/15 border border-accent/20 text-accent disabled:bg-bg/30 disabled:text-muted disabled:border-none font-semibold text-xs tracking-widest uppercase transition flex items-center justify-center space-x-2 rounded-none cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-accent animate-pulse" />
          <span>
            {isExportingBatch
              ? `Packing ZIP (${batchProgress?.current}/${batchProgress?.total})...`
              : "Bulk Export Campaign ZIP"}
          </span>
        </button>

        {isExportingBatch && (
          <div className="w-full bg-accent/10 h-1 rounded-full overflow-hidden">
            <div
              className="bg-accent h-full transition-all duration-300"
              style={{
                width: `${((batchProgress?.current || 0) / (batchProgress?.total || 1)) * 100}%`,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
