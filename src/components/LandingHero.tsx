import { motion } from "motion/react";
import { Upload, Camera, Sparkles, Image as ImageIcon } from "lucide-react";
import React, { useRef } from "react";
import ThemeSwitcher from "./ThemeSwitcher";

interface LandingHeroProps {
  onImageSelected: (base64: string, name: string) => void;
  onCameraClick: () => void;
  isLoading: boolean;
  onNavigate?: (page: "about" | "contact" | "privacy" | "terms") => void;
}

const SAMPLE_OUTFITS = [
  {
    name: "Classic Olive & Ivory",
    url: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80",
    label: "Zara Editorial Style"
  },
  {
    name: "Cognac Trench & Charcoal",
    url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
    label: "Massimo Dutti Vibe"
  },
  {
    name: "Classic Navy & Camel",
    url: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80",
    label: "Ralph Lauren Classic"
  }
];

export default function LandingHero({ onImageSelected, onCameraClick, isLoading, onNavigate }: LandingHeroProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        onImageSelected(event.target.result as string, file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      processFile(file);
    }
  };

  const handleSampleSelect = async (url: string, name: string) => {
    try {
      // Fetch the Unsplash image and convert it to base64 to avoid CORS canvas issues when exporting!
      const res = await fetch(url);
      const blob = await res.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          onImageSelected(reader.result as string, name);
        }
      };
      reader.readAsDataURL(blob);
    } catch (err) {
      // Fallback direct URL if fetch blocked (though Unsplash usually supports CORS)
      onImageSelected(url, name);
    }
  };

  return (
    <div id="landing-hero" className="min-h-screen bg-bg text-text-main flex flex-col justify-between p-6 md:p-12 font-sans overflow-hidden relative">
      {/* Abstract luxury background lines */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(197,162,103,0.04),transparent)] pointer-events-none" />
      <div className="absolute top-[20%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent/10 to-transparent pointer-events-none" />
      <div className="absolute top-0 left-[20%] w-[1px] h-full bg-gradient-to-b from-transparent via-accent/5 to-transparent pointer-events-none" />

      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-center gap-4 z-10 border-b border-line pb-4">
        <div className="flex items-center space-x-3">
          <span className="font-serif-playfair text-2xl tracking-widest font-semibold text-text-main">
            Lookbook <span className="font-sans font-light text-sm italic tracking-normal text-accent opacity-80">Studio</span>
          </span>
        </div>
        <div className="flex items-center space-x-6">
          {onNavigate && (
            <div className="hidden md:flex space-x-6 text-[10px] tracking-widest text-muted uppercase font-semibold">
              <button onClick={() => onNavigate("about")} className="hover:text-accent transition cursor-pointer">About</button>
              <button onClick={() => onNavigate("contact")} className="hover:text-accent transition cursor-pointer">Contact</button>
            </div>
          )}
          <ThemeSwitcher />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-12 my-auto items-center z-10 max-w-7xl mx-auto w-full py-12">
        {/* Left Side: Brand Text */}
        <div className="lg:col-span-6 space-y-8 text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-4"
          >
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-accent/10 border border-accent/20 rounded-full text-[10px] tracking-widest uppercase text-accent font-medium">
              <Sparkles className="w-3 h-3 text-accent" />
              <span>Garment-Isolated Color Intelligence</span>
            </div>
            <h1 className="font-serif-playfair text-5xl md:text-7xl font-light leading-tight tracking-tight text-text-main">
              Sartorial Color <br />
              <span className="italic font-normal text-accent">Harmony Poster</span>
            </h1>
            <p className="text-sm text-muted font-light max-w-lg leading-relaxed">
              Design professional lookbooks dynamically generated from your outfit photography. Our system isolates garments, extracts accurate luxury color identities, and pairs them into stunning 4K editorial sheets suitable for Pinterest, e-commerce, and digital brand campaigns.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-8 py-4 bg-accent text-bg hover:bg-accent/90 font-semibold text-xs tracking-widest uppercase transition-all duration-300 rounded-none shadow-xl flex items-center justify-center space-x-2 cursor-pointer group"
            >
              <Upload className="w-4 h-4 group-hover:translate-y-[-2px] transition-transform" />
              <span>Upload Outfit Photo</span>
            </button>

            <button
              onClick={onCameraClick}
              className="px-8 py-4 bg-panel border border-accent/20 text-text-main hover:border-accent hover:text-accent font-medium text-xs tracking-widest uppercase transition-all duration-300 rounded-none flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Camera className="w-4 h-4 text-accent" />
              <span>Capture Selfie Outfit</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </motion.div>
        </div>

        {/* Right Side: Luxury Drop Zone */}
        <div className="lg:col-span-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.1 }}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="border border-dashed border-accent/20 bg-panel p-12 text-center relative group hover:border-accent/50 transition-all duration-500 flex flex-col justify-center items-center min-h-[350px] aspect-[4/3] backdrop-blur-sm cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            {isLoading ? (
              <div className="space-y-4">
                <div className="relative w-12 h-12 mx-auto">
                  <div className="absolute inset-0 border-2 border-accent/10 rounded-full" />
                  <div className="absolute inset-0 border-2 border-t-accent rounded-full animate-spin" />
                </div>
                <p className="font-serif-playfair text-xl italic text-accent">Analyzing Silhouettes...</p>
                <p className="text-xs text-muted">Isolating upper and lower pieces...</p>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-accent/5 border border-accent/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Upload className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-serif-playfair text-2xl font-light text-text-main mb-2">
                  Drag & Drop Outfit Portrait
                </h3>
                <p className="text-xs text-muted max-w-xs leading-relaxed font-light mb-4">
                  Supports portrait-oriented JPG, PNG, WEBP, or RAW files. Garments will be parsed and segmented automatically.
                </p>
                <span className="text-[10px] text-accent/80 uppercase tracking-widest border border-accent/20 bg-accent/5 px-3 py-1.5 font-medium">
                  Or click anywhere to browse
                </span>
              </>
            )}
          </motion.div>
        </div>
      </main>

      {/* Preset Outfit Trials Section */}
      <footer className="mt-12 z-10 border-t border-line pt-8">
        <p className="text-[10px] uppercase tracking-widest text-muted mb-4 text-center">
          Or interact with high-contrast luxury campaign samples:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto w-full">
          {SAMPLE_OUTFITS.map((sample, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4, scale: 1.02 }}
              onClick={(e) => {
                e.stopPropagation();
                handleSampleSelect(sample.url, sample.name);
              }}
              className="flex items-center space-x-4 bg-panel hover:bg-line/20 border border-line hover:border-accent/40 p-3 transition-all duration-300 cursor-pointer group"
            >
              <div className="w-14 h-18 bg-bg overflow-hidden shrink-0 border border-line">
                <img
                  src={sample.url}
                  alt={sample.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="text-left">
                <h4 className="font-serif-playfair text-sm text-text-main font-medium group-hover:text-accent transition">
                  {sample.name}
                </h4>
                <p className="text-[10px] text-accent tracking-widest uppercase font-semibold">
                  {sample.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </footer>
    </div>
  );
}
