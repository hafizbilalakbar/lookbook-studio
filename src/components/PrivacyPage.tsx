import React from "react";
import { motion } from "motion/react";
import { ShieldCheck } from "lucide-react";
import ThemeSwitcher from "./ThemeSwitcher";
import Footer from "./Footer";

interface PrivacyPageProps {
  onBack: () => void;
  onNavigate?: (page: "about" | "contact" | "privacy" | "terms") => void;
}

export default function PrivacyPage({ onBack, onNavigate }: PrivacyPageProps) {
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
          <button onClick={() => onNavigate?.("about")} className="hover:text-accent transition cursor-pointer">About</button>
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

      {/* Main Legal Content */}
      <main className="max-w-4xl mx-auto w-full px-6 py-16 md:py-24 flex-1 space-y-12">
        
        {/* Title */}
        <div className="space-y-4 text-center">
          <span className="font-mono text-[10px] tracking-widest text-accent uppercase font-semibold">SECURITY & INTEGRITY STANDARD</span>
          <h1 className="font-serif-playfair text-4xl md:text-5xl font-light tracking-tight text-text-main">
            Privacy <span className="italic font-normal text-accent">Policy</span>
          </h1>
          <p className="text-muted font-mono text-xs">
            Last Updated: June 25, 2026 &bull; Revision 2.4.1
          </p>
        </div>

        {/* Separator Line */}
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

        {/* Highlight Banner */}
        <div className="bg-panel border border-line p-8 flex flex-col md:flex-row items-center gap-6">
          <ShieldCheck className="w-12 h-12 text-accent shrink-0" />
          <div className="space-y-1">
            <h4 className="font-serif-playfair text-lg text-text-main font-semibold">Our Privacy Commitment</h4>
            <p className="text-xs text-muted leading-relaxed font-light">
              Lookbook Studio is designed with an "offline-first, client-side execution" priority. Your uploaded garment images, logo brands, color swatches, and metadata are processed primarily in-browser to provide instant lookbook rendering and secure offline editing.
            </p>
          </div>
        </div>

        {/* Policy Sections */}
        <div className="space-y-10 font-sans text-sm text-text-secondary leading-relaxed font-light">
          
          {/* Section 1 */}
          <div className="space-y-3">
            <h3 className="font-serif-playfair text-xl text-text-main font-medium flex items-center space-x-2">
              <span className="text-accent font-mono text-xs">01 /</span>
              <span>Information We Process</span>
            </h3>
            <p>
              When you use Lookbook Studio, we process the following categories of information to generate your design sheets:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs text-muted">
              <li><strong>Outfit Photography:</strong> Uploaded images or real-time camera captures are processed directly inside your browser cache. They are never permanently stored on external database systems unless you request explicit backup features.</li>
              <li><strong>Color Coordinate Pins & Palettes:</strong> Your chosen Hex/RGB color parameters, garment types, and custom typography labels are stored in your browser's persistent LocalStorage for seamless sessions.</li>
              <li><strong>Brand Kits:</strong> Custom brand logos are stored in-browser to allow quick reapplication of lookbook headers.</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="space-y-3">
            <h3 className="font-serif-playfair text-xl text-text-main font-medium flex items-center space-x-2">
              <span className="text-accent font-mono text-xs">02 /</span>
              <span>How Information is Used</span>
            </h3>
            <p>
              Your data is utilized strictly to provide garment color matching services:
            </p>
            <p className="text-xs text-muted">
              We employ a secure, sandboxed server-side analysis route to enhance outfit photo analysis on demand. During this analysis, image pixel blocks are transmitted securely via encrypted HTTP pathways to perform instant hue separation. No training models consume your custom artwork, and all temporary payloads are wiped immediately after the analysis results are returned.
            </p>
          </div>

          {/* Section 3 */}
          <div className="space-y-3">
            <h3 className="font-serif-playfair text-xl text-text-main font-medium flex items-center space-x-2">
              <span className="text-accent font-mono text-xs">03 /</span>
              <span>Data Security and Encryption</span>
            </h3>
            <p>
              Lookbook Studio integrates rigorous security measures, including HTTPS encryption protocols, sandboxed browser execution frames, and custom CSP parameters to prevent illegal script execution. All exported high-definition lookbooks (PNG, JPEG, and ZIP) are compiled directly within your local device memory using advanced HTML5 Canvas APIs, maintaining absolute file integrity.
            </p>
          </div>

          {/* Section 4 */}
          <div className="space-y-3">
            <h3 className="font-serif-playfair text-xl text-text-main font-medium flex items-center space-x-2">
              <span className="text-accent font-mono text-xs">04 /</span>
              <span>Your Sovereign Rights</span>
            </h3>
            <p>
              Because your workspace data resides mostly on your own machine, you maintain complete, immediate control over it. You can clear all cached looks, saved campaign brand-kits, and project history stacks at any point by clearing your browser cache or using the "Reset Workspace" controls available inside the studio control panel.
            </p>
          </div>

        </div>

      </main>

      <Footer onNavigate={onNavigate} />
    </motion.div>
  );
}
