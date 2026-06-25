import React from "react";
import { motion } from "motion/react";
import { Scale, HelpCircle } from "lucide-react";
import ThemeSwitcher from "./ThemeSwitcher";
import Footer from "./Footer";

interface TermsPageProps {
  onBack: () => void;
  onNavigate?: (page: "about" | "contact" | "privacy" | "terms") => void;
}

export default function TermsPage({ onBack, onNavigate }: TermsPageProps) {
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
          <span className="font-mono text-[10px] tracking-widest text-accent uppercase font-semibold">LEGAL COMPLIANCE FRAMEWORK</span>
          <h1 className="font-serif-playfair text-4xl md:text-5xl font-light tracking-tight text-text-main">
            Terms & <span className="italic font-normal text-accent">Conditions</span>
          </h1>
          <p className="text-muted font-mono text-xs">
            Last Updated: June 25, 2026 &bull; Revision 2.4.1
          </p>
        </div>

        {/* Separator Line */}
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

        {/* Highlight Banner */}
        <div className="bg-panel border border-line p-8 flex flex-col md:flex-row items-center gap-6">
          <Scale className="w-12 h-12 text-accent shrink-0" />
          <div className="space-y-1">
            <h4 className="font-serif-playfair text-lg text-text-main font-semibold">Commercial Utilization Right</h4>
            <p className="text-xs text-muted leading-relaxed font-light">
              All high-resolution campaign assets, editorial swatches, catalog sheets, and lookbook posters generated using Lookbook Studio are 100% royalty-free and license-clear for unlimited private and commercial marketing distribution.
            </p>
          </div>
        </div>

        {/* Policy Sections */}
        <div className="space-y-10 font-sans text-sm text-text-secondary leading-relaxed font-light">
          
          {/* Section 1 */}
          <div className="space-y-3">
            <h3 className="font-serif-playfair text-xl text-text-main font-medium flex items-center space-x-2">
              <span className="text-accent font-mono text-xs">01 /</span>
              <span>Acceptance of Terms</span>
            </h3>
            <p>
              By accessing Lookbook Studio, you declare to be bound by these Terms and Conditions and agree to comply with all regional, state, national, and international laws regulating digital intellectual properties. If you disagree with any specific clause detailed herein, you are strictly prohibited from utilizing the color correlation engine.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-3">
            <h3 className="font-serif-playfair text-xl text-text-main font-medium flex items-center space-x-2">
              <span className="text-accent font-mono text-xs">02 /</span>
              <span>Workspace Usage License</span>
            </h3>
            <p>
              Permission is granted to utilize the application for professional campaign drafting, color swatch coordination, and export. Under this user license, you agree NOT to:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs text-muted">
              <li>Reverse-engineer or systematically scrape the underlying garment isolate models or color matching recommendations.</li>
              <li>Attempt to disrupt the backend analysis server or bypass the visual secure boundaries established on our analysis endpoints.</li>
              <li>Utilize the lookbook generation canvas to compile offensive, copyright-infringing, or illicit visual materials.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="space-y-3">
            <h3 className="font-serif-playfair text-xl text-text-main font-medium flex items-center space-x-2">
              <span className="text-accent font-mono text-xs">03 /</span>
              <span>Disclaimer & Limitation of Liability</span>
            </h3>
            <p>
              The materials, colors, color names, and matching recommendations are provided on an "as is" and "as available" basis. Lookbook Studio makes no explicit or implicit warranties regarding perfect color accuracy under physical print, as screens differ across calibration spectrums.
            </p>
            <p className="text-xs text-muted">
              In no event shall Lookbook Studio, its creators, or its backend service providers be held liable for any damages (including, without limitation, loss of business revenue, campaign delay, or browser cache data corruption) arising out of the use or inability to use the software.
            </p>
          </div>

          {/* Section 4 */}
          <div className="space-y-3">
            <h3 className="font-serif-playfair text-xl text-text-main font-medium flex items-center space-x-2">
              <span className="text-accent font-mono text-xs">04 /</span>
              <span>Governing Jurisdiction</span>
            </h3>
            <p>
              Any legal claim, dispute, or litigation relating to Lookbook Studio shall be governed by the laws of Paris, France, without regard to its conflict of law provisions. Both parties consent to personal jurisdiction in the tribunals of Paris for resolving any disputes.
            </p>
          </div>

        </div>

      </main>

      <Footer onNavigate={onNavigate} />
    </motion.div>
  );
}
