import { Sparkles } from "lucide-react";

interface FooterProps {
  onNavigate?: (page: "about" | "contact" | "privacy" | "terms") => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-bg border-t border-line text-text-main py-12 px-6 md:px-12 z-10 w-full relative">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        {/* Brand details and Tagline */}
        <div className="space-y-3 max-w-md">
          <div className="flex items-center space-x-2.5">
            <span className="font-serif-playfair text-xl tracking-widest font-semibold text-text-main uppercase">
              Lookbook <span className="font-sans font-light text-xs italic tracking-normal text-accent/90 lowercase">Studio</span>
            </span>
            <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
          </div>
          <p className="text-xs text-muted leading-relaxed font-light">
            Designed for contemporary luxury labels, catalog houses, and digital editorial curation. 
            Transforming sartorial silhouettes into high-resolution, pixel-perfect design sheets.
          </p>

          {/* Legal & Policy Navigation */}
          {onNavigate && (
            <div className="flex flex-wrap gap-x-6 gap-y-2 pt-3 text-[10px] uppercase tracking-widest text-muted">
              <button onClick={() => onNavigate("privacy")} className="hover:text-accent transition cursor-pointer text-left font-medium">Privacy Policy</button>
              <button onClick={() => onNavigate("terms")} className="hover:text-accent transition cursor-pointer text-left font-medium">Terms & Conditions</button>
            </div>
          )}
        </div>

        {/* Brand Specs & Build Information */}
        <div className="flex flex-col md:items-end text-left md:text-right space-y-2 font-mono">
          <div className="flex items-center space-x-2 text-[10px] tracking-widest text-accent font-semibold uppercase">
            <Sparkles className="w-3.5 h-3.5 text-accent/80" />
            <span>Sartorial Color Correlation Engine</span>
          </div>
          <p className="text-[9px] text-muted/50 tracking-wider">
            &copy; {new Date().getFullYear()} Lookbook Studio. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
