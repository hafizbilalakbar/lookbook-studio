import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, MapPin, Clock, Send, CheckCircle2, AlertCircle } from "lucide-react";
import ThemeSwitcher from "./ThemeSwitcher";
import Footer from "./Footer";

interface ContactPageProps {
  onBack: () => void;
  onNavigate?: (page: "about" | "contact" | "privacy" | "terms") => void;
}

export default function ContactPage({ onBack, onNavigate }: ContactPageProps) {
  const [form, setForm] = useState({ name: "", email: "", subject: "Studio Consultation", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError("Please complete all required fields.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    // Simulate luxury API response
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setForm({ name: "", email: "", subject: "Studio Consultation", message: "" });
    }, 1500);
  };

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
          <button onClick={() => onNavigate?.("contact")} className="text-accent cursor-pointer">Contact</button>
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

      {/* Main Grid Content */}
      <main className="max-w-6xl mx-auto w-full px-6 py-16 md:py-24 flex-1">
        
        {/* Page title */}
        <div className="space-y-4 mb-16 text-center md:text-left">
          <span className="font-mono text-[10px] tracking-widest text-accent uppercase font-semibold">CONNECT WITH US</span>
          <h1 className="font-serif-playfair text-4xl md:text-5xl font-light tracking-tight text-text-main">
            Studio <span className="italic font-normal text-accent">Concierge</span>
          </h1>
          <p className="text-muted font-light max-w-xl text-sm leading-relaxed">
            Inquire about custom visual integration plans, system white-label partnerships, or request professional editorial consultation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Side: Contact Form Card */}
          <div className="lg:col-span-7 bg-panel border border-line p-8 relative overflow-hidden">
            <AnimatePresence mode="wait">
              {!isSuccess ? (
                <motion.form
                  key="contact-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  <h3 className="font-serif-playfair text-2xl text-text-main font-light mb-4">Send an Inquiry</h3>

                  {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center space-x-2 rounded-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-muted uppercase tracking-wider block font-medium">Your Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full bg-bg/50 border border-line px-3.5 py-2 text-xs text-text-main focus:outline-none focus:border-accent transition-colors"
                        placeholder="E.g., Alexander McQueen"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] text-muted uppercase tracking-wider block font-medium">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full bg-bg/50 border border-line px-3.5 py-2 text-xs text-text-main focus:outline-none focus:border-accent transition-colors"
                        placeholder="E.g., alex@atelier.com"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-muted uppercase tracking-wider block font-medium">Subject</label>
                    <select
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      className="w-full bg-bg/50 border border-line px-3.5 py-2 text-xs text-text-main focus:outline-none focus:border-accent transition-colors"
                      disabled={isSubmitting}
                    >
                      <option value="Studio Consultation">Studio Consultation</option>
                      <option value="White-Label Integration">White-Label Integration</option>
                      <option value="Media & Press Inquiry">Media & Press Inquiry</option>
                      <option value="Technical Support Desk">Technical Support Desk</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-muted uppercase tracking-wider block font-medium">Message *</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={5}
                      className="w-full bg-bg/50 border border-line px-3.5 py-2 text-xs text-text-main focus:outline-none focus:border-accent transition-colors resize-none"
                      placeholder="Share details of your inquiry..."
                      disabled={isSubmitting}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-6 bg-accent text-bg font-semibold text-xs tracking-widest uppercase transition-all duration-300 hover:bg-accent/90 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="animate-pulse">Transmitting inquiry...</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Transmit Inquiry</span>
                      </>
                    )}
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="success-form"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="py-12 text-center space-y-6 flex flex-col items-center justify-center"
                >
                  <CheckCircle2 className="w-16 h-16 text-accent animate-bounce" />
                  <div className="space-y-2">
                    <h3 className="font-serif-playfair text-3xl text-text-main font-light">Inquiry Received</h3>
                    <p className="text-xs text-muted max-w-sm mx-auto leading-relaxed">
                      Thank you for contacting Lookbook Studio. A design consultant or support specialist will review your request and get back to you within 12 business hours.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="py-2 px-5 bg-panel border border-accent/30 hover:border-accent text-accent font-medium text-xs tracking-widest uppercase transition-all cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Side: Editorial Contact Channels */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-panel/40 border border-line p-8 space-y-6">
              <h3 className="font-serif-playfair text-xl text-text-main font-medium border-b border-line pb-4">Direct Channels</h3>
              
              <div className="space-y-6">
                {/* Channel 1 */}
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-accent/10 border border-accent/20 text-accent">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <span className="block text-[9px] text-muted uppercase tracking-wider font-semibold">Atelier Correspondence</span>
                    <span className="text-xs text-text-main font-mono">concierge@lookbook.studio</span>
                  </div>
                </div>

                {/* Channel 2 */}
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-accent/10 border border-accent/20 text-accent">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <span className="block text-[9px] text-muted uppercase tracking-wider font-semibold">HQ Address</span>
                    <span className="text-xs text-text-main font-mono">51 Rue du Faubourg Saint-Honoré, 75008 Paris, France</span>
                  </div>
                </div>

                {/* Channel 3 */}
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-accent/10 border border-accent/20 text-accent">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <span className="block text-[9px] text-muted uppercase tracking-wider font-semibold">Atelier Hours</span>
                    <span className="text-xs text-text-main font-mono">Mon — Fri: 09:00 - 18:00 CET</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Aesthetic quote / brand statement card */}
            <div className="border border-accent/20 p-8 space-y-3 relative">
              <div className="absolute top-0 right-4 transform -translate-y-1/2 bg-bg px-2 text-[10px] tracking-widest text-accent font-semibold">SARTORIAL PHILOSOPHY</div>
              <p className="font-serif-playfair italic text-sm text-text-main leading-relaxed">
                "Color is the keyboard, the eyes are the harmonies, the soul is the piano with many strings. The artist is the hand that plays."
              </p>
              <span className="block text-[9px] font-mono text-muted uppercase tracking-wider text-right">— Wassily Kandinsky</span>
            </div>
          </div>
        </div>

      </main>

      <Footer onNavigate={onNavigate} />
    </motion.div>
  );
}
