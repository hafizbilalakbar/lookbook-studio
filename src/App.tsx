import { useState, useEffect, useCallback } from "react";
import { LookbookProject, BrandKit } from "./types";
import {
  loadStoredProjects,
  saveProjectsToStorage,
  loadStoredBrandKit,
  saveBrandKitToStorage,
  createDefaultProject,
} from "./utils/projectStore";
import { exportPoster } from "./utils/canvasExporter";
import { exportBatchAsZip } from "./utils/batchExporter";
import LandingHero from "./components/LandingHero";
import LookbookPreview from "./components/LookbookPreview";
import ControlPanel from "./components/ControlPanel";
import CameraModal from "./components/CameraModal";
import Footer from "./components/Footer";
import { getFashionColorName, hexToRgbString, generateFashionRecommendations } from "./utils/colorUtils";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Sparkles } from "lucide-react";

import AboutPage from "./components/AboutPage";
import ContactPage from "./components/ContactPage";
import PrivacyPage from "./components/PrivacyPage";
import TermsPage from "./components/TermsPage";
import ThemeSwitcher from "./components/ThemeSwitcher";

export default function App() {
  // State lists
  const [projects, setProjects] = useState<LookbookProject[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [brandKit, setBrandKit] = useState<BrandKit>(() => loadStoredBrandKit());
  
  // Page view state
  const [activeView, setActiveView] = useState<'main' | 'about' | 'contact' | 'privacy' | 'terms'>('main');

  // Scroll to top on page navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeView]);

  // Workspace statuses
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isExportingBatch, setIsExportingBatch] = useState(false);
  const [batchProgress, setBatchProgress] = useState<{ current: number; total: number } | null>(null);

  // Undo / Redo stacks
  const [undoStack, setUndoStack] = useState<LookbookProject[][]>([]);
  const [redoStack, setRedoStack] = useState<LookbookProject[][]>([]);

  // Load initial projects on mount
  useEffect(() => {
    const stored = loadStoredProjects();
    setProjects(stored);
    if (stored.length > 0) {
      setActiveProjectId(stored[0].id);
    }
  }, []);

  // Sync projects list back to local storage
  useEffect(() => {
    saveProjectsToStorage(projects);
  }, [projects]);

  // Find active project
  const activeProject = projects.find((p) => p.id === activeProjectId) || null;

  /**
   * Helper to push current projects snapshot to undo stack
   */
  const pushState = useCallback((currentProjects: LookbookProject[]) => {
    setUndoStack((prev) => [...prev, JSON.parse(JSON.stringify(currentProjects))]);
    setRedoStack([]); // Clear redo
  }, []);

  /**
   * Universal project updater
   */
  const updateActiveProject = useCallback(
    (updater: (prev: LookbookProject) => LookbookProject) => {
      if (!activeProjectId) return;
      
      setProjects((prevProjects) => {
        const idx = prevProjects.findIndex((p) => p.id === activeProjectId);
        if (idx === -1) return prevProjects;

        const original = prevProjects[idx];
        const updated = updater(original);

        // Simple guard to see if anything actually changed before writing history
        if (JSON.stringify(original) === JSON.stringify(updated)) {
          return prevProjects;
        }

        pushState(prevProjects);

        const next = [...prevProjects];
        next[idx] = updated;
        return next;
      });
    },
    [activeProjectId, pushState]
  );

  /**
   * Undo Action
   */
  const handleUndo = useCallback(() => {
    if (undoStack.length === 0) return;
    const previous = undoStack[undoStack.length - 1];
    setUndoStack((prev) => prev.slice(0, -1));
    setRedoStack((prev) => [...prev, JSON.parse(JSON.stringify(projects))]);
    setProjects(previous);
  }, [undoStack, projects]);

  /**
   * Redo Action
   */
  const handleRedo = useCallback(() => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setRedoStack((prev) => prev.slice(0, -1));
    setUndoStack((prev) => [...prev, JSON.parse(JSON.stringify(projects))]);
    setProjects(next);
  }, [redoStack, projects]);

  // Register Global Keyboard Listeners (Ctrl+Z and Ctrl+Y)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        handleUndo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleUndo, handleRedo]);

  const runServerColorAnalysis = async (projectToAnalyze: LookbookProject) => {
    try {
      const aiProvider = localStorage.getItem("ai_provider") || "auto";

      // Skip server analysis entirely if user chose local detection
      if (aiProvider === "local") return;

      setIsAnalyzing(true);
      const mime = projectToAnalyze.image.split(";")[0]?.split(":")[1] || "image/jpeg";
      const base64Data = projectToAnalyze.image.split(",")[1];

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: base64Data,
          mimeType: mime,
          provider: aiProvider,
        }),
      });

      if (!res.ok) {
        throw new Error("Analysis request failed.");
      }

      const data = await res.json();
      
      updateActiveProject((prev) => ({
        ...prev,
        upperGarment: {
          type: data.upperGarment?.type || prev.upperGarment.type,
          colorName: data.upperGarment?.colorName || prev.upperGarment.colorName,
          hex: data.upperGarment?.hex || prev.upperGarment.hex,
          rgb: data.upperGarment?.rgb || prev.upperGarment.rgb,
        },
        lowerGarment: {
          type: data.lowerGarment?.type || prev.lowerGarment.type,
          colorName: data.lowerGarment?.colorName || prev.lowerGarment.colorName,
          hex: data.lowerGarment?.hex || prev.lowerGarment.hex,
          rgb: data.lowerGarment?.rgb || prev.lowerGarment.rgb,
        },
        recommendations: data.matchingRecommendations || prev.recommendations,
      }));
    } catch {
      // Fallback to client-side pixel sampling
    } finally {
      setIsAnalyzing(false);
    }
  };

  /**
   * Handles user's main picture creation / upload
   */
  const handleAddNewLook = async (base64Url: string, filename: string) => {
    try {
      setIsAnalyzing(true);
      
      // 1. Create default setup lookbook project using fast client-side pixel extraction
      const newProj = await createDefaultProject(base64Url, filename.split(".")[0]);
      
      if (brandKit.logo) {
        newProj.brandLogo = brandKit.logo;
      }

      setProjects((prev) => {
        pushState(prev);
        const next = [newProj, ...prev];
        setActiveProjectId(newProj.id);
        return next;
      });

      // 2. Fire backend server-side visual analysis to refine color names and recommendations
      await runServerColorAnalysis(newProj);
    } catch {
      setIsAnalyzing(false);
    }
  };

  /**
   * Handles multiple batch uploads
   */
  const handleBatchUpload = async (files: FileList) => {
    if (files.length === 0) return;
    setIsAnalyzing(true);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      const promise = new Promise<string>((resolve) => {
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      });

      const base64 = await promise;
      await handleAddNewLook(base64, file.name);
    }
  };

  /**
   * Single export trigger
   */
  const handleSingleExport = async (format: "png" | "jpeg" | "webp") => {
    if (!activeProject) return;
    await exportPoster(activeProject, format);
  };

  /**
   * Bulk campaign exporter ZIP trigger
   */
  const handleBatchExport = async (format: "png" | "jpeg" | "webp") => {
    if (projects.length === 0) return;
    try {
      setIsExportingBatch(true);
      await exportBatchAsZip(projects, format, (current, total) => {
        setBatchProgress({ current, total });
      });
    } catch {
      // Batch export error
    } finally {
      setIsExportingBatch(false);
      setBatchProgress(null);
    }
  };

  const handleDuplicate = (id: string) => {
    const original = projects.find((p) => p.id === id);
    if (original) {
      pushState(projects);
      const duplicate: LookbookProject = JSON.parse(JSON.stringify(original));
      duplicate.id = `project_${Date.now()}_dup`;
      duplicate.name = `${original.name} (Copy)`;
      setProjects((prev) => [duplicate, ...prev]);
      setActiveProjectId(duplicate.id);
    }
  };

  const handleDelete = (id: string) => {
    pushState(projects);
    const next = projects.filter((p) => p.id !== id);
    setProjects(next);
    if (activeProjectId === id) {
      setActiveProjectId(next.length > 0 ? next[0].id : null);
    }
  };

  const handleUpdateColors = (upperHex: string, lowerHex: string, upperName?: string, lowerName?: string) => {
    updateActiveProject((prev) => {
      const uName = upperName || getFashionColorName(upperHex);
      const lName = lowerName || getFashionColorName(lowerHex);
      return {
        ...prev,
        upperGarment: {
          ...prev.upperGarment,
          hex: upperHex,
          rgb: hexToRgbString(upperHex),
          colorName: uName,
        },
        lowerGarment: {
          ...prev.lowerGarment,
          hex: lowerHex,
          rgb: hexToRgbString(lowerHex),
          colorName: lName,
        },
        recommendations: generateFashionRecommendations(upperHex, lowerHex),
      };
    });
  };

  const handleUpdatePinCoords = (pinType: "upper" | "lower", coords: { x: number; y: number }) => {
    // Avoid writing history logs on every single pixel hover movement, only when coordinate matches.
    // We update coordinate points smoothly.
    setProjects((prevProjects) => {
      const idx = prevProjects.findIndex((p) => p.id === activeProjectId);
      if (idx === -1) return prevProjects;
      const next = [...prevProjects];
      const proj = { ...next[idx] };
      if (pinType === "upper") {
        proj.upperPin = coords;
      } else {
        proj.lowerPin = coords;
      }
      next[idx] = proj;
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-bg text-text-main selection:bg-accent selection:text-bg">
      <AnimatePresence mode="wait">
        {activeView === "about" && (
          <AboutPage onBack={() => setActiveView("main")} onNavigate={setActiveView} />
        )}
        {activeView === "contact" && (
          <ContactPage onBack={() => setActiveView("main")} onNavigate={setActiveView} />
        )}
        {activeView === "privacy" && (
          <PrivacyPage onBack={() => setActiveView("main")} onNavigate={setActiveView} />
        )}
        {activeView === "terms" && (
          <TermsPage onBack={() => setActiveView("main")} onNavigate={setActiveView} />
        )}

        {activeView === "main" && (
          <div className="w-full">
            {!activeProject ? (
              <motion.div
                key="hero"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full min-h-screen flex flex-col justify-between"
              >
                <LandingHero
                  onImageSelected={handleAddNewLook}
                  onCameraClick={() => setIsCameraOpen(true)}
                  isLoading={isAnalyzing}
                  onNavigate={setActiveView}
                />
                <Footer onNavigate={setActiveView} />
              </motion.div>
            ) : (
              <motion.div
                key="studio"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-screen flex flex-col md:flex-row overflow-hidden"
              >
                {/* Left/Middle: Live interactive lookbook preview space */}
                <div className="flex-1 flex flex-col h-full bg-panel relative">
                  {/* Back navigation header */}
                  <div className="p-4 border-b border-line flex items-center justify-between z-20 bg-bg/50 backdrop-blur-md">
                    <button
                      onClick={() => {
                        setActiveProjectId(null);
                      }}
                      className="flex items-center space-x-2 text-muted hover:text-accent transition text-xs tracking-wider uppercase cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Exit Studio</span>
                    </button>
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-accent/80 animate-pulse" />
                      <span className="font-serif-playfair italic text-base text-text-main font-medium">
                        "{activeProject.name}"
                      </span>
                    </div>
                    <ThemeSwitcher />
                  </div>

                  {/* Main lookbook preview canvas */}
                  <div className="flex-1 overflow-auto bg-bg/80 flex items-center justify-center p-4">
                    <LookbookPreview
                      project={activeProject}
                      onUpdateColors={handleUpdateColors}
                      onUpdatePinCoords={handleUpdatePinCoords}
                      isAnalyzing={isAnalyzing}
                    />
                  </div>
                </div>

                {/* Right Side: Professional control deck */}
                <div className="w-full md:w-[420px] lg:w-[460px] h-full shrink-0">
                  <ControlPanel
                    project={activeProject}
                    projects={projects}
                    brandKit={brandKit}
                    onUpdateProject={updateActiveProject}
                    onSelectProject={setActiveProjectId}
                    onDeleteProject={handleDelete}
                    onDuplicateProject={handleDuplicate}
                    onSaveBrandKit={(kit) => {
                      setBrandKit(kit);
                      saveBrandKitToStorage(kit);
                    }}
                    onAddNewImages={handleBatchUpload}
                    onTriggerCamera={() => setIsCameraOpen(true)}
                    onUndo={handleUndo}
                    onRedo={handleRedo}
                    canUndo={undoStack.length > 0}
                    canRedo={redoStack.length > 0}
                    onExport={handleSingleExport}
                    onExportBatch={handleBatchExport}
                    isExportingBatch={isExportingBatch}
                    batchProgress={batchProgress}
                  />
                </div>
              </motion.div>
            )}
          </div>
        )}
      </AnimatePresence>

      {/* Selfie capturing camera overlay */}
      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(base64) => handleAddNewLook(base64, `selfie_look_${Date.now()}.jpg`)}
      />
    </div>
  );
}
