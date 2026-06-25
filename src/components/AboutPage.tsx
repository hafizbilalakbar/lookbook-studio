import React from "react";
import { motion } from "motion/react";
import { Sparkles, Paintbrush, Cpu, Layers } from "lucide-react";
import ThemeSwitcher from "./ThemeSwitcher";
import Footer from "./Footer";

interface AboutPageProps {
  onBack: () => void;
  onNavigate?: (page: "about" | "contact" | "privacy" | "terms") => void;
}

export default function AboutPage({ onBack, onNavigate }: AboutPageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="min-h-screen bg-bg text-text-main flex flex-col justify-between"
    >
      {/* Premium Navigation Header */}
      <header className="border-b border-line px-6 py-4 md:px-12 bg-panel/50 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <span className="font-serif-playfair text-xl tracking-widest font-semibold text-text-main">
            Lookbook <span className="font-sans font-light text-xs italic text-accent">Studio</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center space-x-6 text-[10px] tracking-widest text-muted uppercase font-semibold">
          <button onClick={() => onNavigate?.("about")} className="text-accent cursor-pointer">About</button>
          <button onClick={() => onNavigate?.("contact")} className="hover:text-accent transition cursor-pointer">Contact</button>
        </nav>

        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="text-[10px] tracking-widest text-muted hover:text-accent transition uppercase cursor-pointer"
          >
            Studio
          </button>
          <ThemeSwitcher />
        </div>
      </header>

      {/* Main Luxury Content */}
      <main className="max-w-4xl mx-auto w-full px-6 py-16 md:py-24 space-y-16 flex-1">
        
        {/* Section 1: Intro */}
        <div className="space-y-6 text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-accent/10 border border-accent/20 rounded-full text-[10px] tracking-widest uppercase text-accent font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sartorial Color Intelligence</span>
          </div>
          <h1 className="font-serif-playfair text-4xl md:text-6xl font-light tracking-tight text-text-main leading-tight">
            The Intersection of <br />
            <span className="italic font-normal text-accent">Haute Couture & Code</span>
          </h1>
          <p className="text-muted font-light max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Lookbook Studio is an ultra-premium color intelligence suite designed for boutique clothing brands, 
            e-commerce catalog curators, and contemporary digital artists. By pairing custom garment-isolated 
            image sampling with beautiful editorial layouts, we transform simple outfit snapshots into beautiful, 
            production-ready marketing posters and lookbooks.
          </p>
        </div>

        {/* Separator Line */}
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

        {/* Section 2: Core Philosophy (Bento-inspired 3-Column layout) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-panel border border-line p-8 space-y-4 hover:border-accent/40 transition duration-300">
            <Paintbrush className="w-6 h-6 text-accent" />
            <h3 className="font-serif-playfair text-xl text-text-main">Editorial Elegance</h3>
            <p className="text-xs text-muted leading-relaxed font-light">
              We reject default layouts, purple gradients, and generic templates. Every visual system we generate 
              maintains a strict minimalist presentation, placing your sartorial silhouette at the focal center.
            </p>
          </div>

          <div className="bg-panel border border-line p-8 space-y-4 hover:border-accent/40 transition duration-300">
            <Cpu className="w-6 h-6 text-accent" />
            <h3 className="font-serif-playfair text-xl text-text-main">Isolated Extraction</h3>
            <p className="text-xs text-muted leading-relaxed font-light">
              Using fine-grain pixel coordinate tracking and automated color intelligence, we identify individual 
              garment tones, isolate shade codes, and map them to standard design swatches with zero manual lag.
            </p>
          </div>

          <div className="bg-panel border border-line p-8 space-y-4 hover:border-accent/40 transition duration-300">
            <Layers className="w-6 h-6 text-accent" />
            <h3 className="font-serif-playfair text-xl text-text-main">Digital Agility</h3>
            <p className="text-xs text-muted leading-relaxed font-light">
              Generate 4K raster posters suitable for social campaign channels, store indexes, Pinterest curation, or e-commerce lookbooks in a single, lightning-fast client-side export workflow.
            </p>
          </div>
        </div>

        {/* Section 3: Brand Story / History */}
        <div className="space-y-6">
          <span className="font-mono text-[10px] tracking-widest text-accent uppercase font-semibold">THE STUDIO CHRONICLES</span>
          <h2 className="font-serif-playfair text-3xl md:text-4xl text-text-main font-light leading-snug">
            Curated to elevate digital presence, crafted to simplify modern garment mapping.
          </h2>
          <div className="text-sm text-muted font-light space-y-4 leading-relaxed">
            <p>
              In traditional high fashion, lookbook curation has always required a manual suite of digital editors, visual merchandisers, and layout typographers. Our mission is to democratize this creative layer.
            </p>
            <p>
              By combining instant pixel sampling, dynamic font adjustments, custom logo integration, and a rich, robust palette cataloging engine, Lookbook Studio gives boutique designers and luxury collectors the precise agency to map, export, and archive their sartorial campaigns on demand.
            </p>
          </div>
        </div>

        {/* Section 4: Specifications */}
        <div className="bg-panel/50 border border-line p-8 font-mono space-y-6">
          <h4 className="text-xs text-accent uppercase tracking-widest font-semibold flex items-center space-x-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ENGINE METRICS & SPECIFICATIONS</span>
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <span className="block text-2xl font-light text-text-main font-serif-playfair">4K UHD</span>
              <span className="text-[9px] text-muted uppercase tracking-wider">Raster Canvas Output</span>
            </div>
            <div className="space-y-1">
              <span className="block text-2xl font-light text-text-main font-serif-playfair">Instant</span>
              <span className="text-[9px] text-muted uppercase tracking-wider">Garment Isolation</span>
            </div>
            <div className="space-y-1">
              <span className="block text-2xl font-light text-text-main font-serif-playfair">100%</span>
              <span className="text-[9px] text-muted uppercase tracking-wider">Client-Side Exports</span>
            </div>
            <div className="space-y-1">
              <span className="block text-2xl font-light text-text-main font-serif-playfair">Dual</span>
              <span className="text-[9px] text-muted uppercase tracking-wider">Light & Dark Modes</span>
            </div>
          </div>
        </div>

      </main>

      <Footer onNavigate={onNavigate} />
    </motion.div>
  );
}
