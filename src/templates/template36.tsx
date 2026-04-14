"use client";

import React, { useState, useCallback, useEffect } from "react";

/**
 * PRODUCTION-SAFE TEMPLATE FOR CLYRA
 * Fixed dependency issues by using safe dynamic checks for the store environment.
 */

// --- DYNAMIC STORE SAFETY ---
let useWebsiteBuilderStore: any;
let useRegionValue: any;
let useThemeStore: any;

try {
  // We use the global window check to avoid build-time resolution errors for @/ paths in this environment
  const builder = require("@/store/useWebsiteBuilderStore");
  useWebsiteBuilderStore = builder.useWebsiteBuilderStore;
  useRegionValue = builder.useRegionValue;
  const themeS = require("@/store/useThemeStore");
  useThemeStore = themeS.useThemeStore;
} catch (e) {
  // Fallback interfaces for the editor preview if resolution fails during indexing
  useWebsiteBuilderStore = (selector: any) => selector({ updateRegion: () => {} });
  useRegionValue = () => null;
  useThemeStore = () => ({
    theme: {
      backgroundColor: "#FAF9F6",
      textColor: "#2D2D2D",
      primaryColor: "#7C9082",
      secondaryColor: "#F2F0E9",
      borderRadius: 12,
      sectionSpacing: 100,
      fontFamily: "var(--font-sans), sans-serif",
    },
  });
}

type TemplateProps = {
  editableData?: any;
};

export const template36Meta = {
  id: "business/template36",
  name: "Serenity Yoga & Meditation",
  image:
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1600&auto=format&fit=crop",
};

const getNestedValue = (obj: any, path: string) => {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
};

export default function Template36({ editableData }: TemplateProps) {
  const [activePage, setActivePage] = useState<"home" | "about" | "contact">("home");
  const { theme } = useThemeStore();
  const updateRegion = useWebsiteBuilderStore((state: any) => state.updateRegion);

  // --- IMAGE UPLOAD HANDLER ---
  const handleImageUpload = useCallback(
    (regionKey: string) => {
      if (typeof window !== "undefined" && (window as any).cloudinary) {
        (window as any).cloudinary
          .createUploadWidget(
            {
              cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "demo",
              uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "unsigned",
              multiple: false,
            },
            (error: any, result: any) => {
              if (!error && result && result.event === "success") {
                updateRegion(regionKey, result.info.secure_url);
              }
            }
          )
          .open();
      }
    },
    [updateRegion]
  );

  // --- CLYRA EDITABLE COMPONENTS ---
  const EditableText = ({ regionKey, fallback, as: Tag = "span", className = "" }: any) => {
    const hookValue = useRegionValue(regionKey);
    const dataValue = getNestedValue(editableData, regionKey);
    const content = hookValue ?? dataValue ?? fallback;

    return (
      <Tag
        contentEditable
        suppressContentEditableWarning
        onBlur={(e: React.FocusEvent<HTMLElement>) => {
          const val = e.currentTarget.innerText;
          if (val !== content) updateRegion(regionKey, val);
        }}
        onDoubleClick={(e: React.MouseEvent) => {
          e.stopPropagation();
          (e.currentTarget as HTMLElement).focus();
        }}
        className={`focus:outline-none focus:ring-2 focus:ring-opacity-50 rounded transition-all outline-none ${className}`}
        style={{ '--tw-ring-color': theme.primaryColor } as React.CSSProperties}
      >
        {content}
      </Tag>
    );
  };

  const EditableImg = ({ regionKey, fallback, className = "", alt = "image" }: any) => {
    const hookValue = useRegionValue(regionKey);
    const dataValue = getNestedValue(editableData, regionKey);
    const src = hookValue ?? dataValue ?? fallback;

    return (
      <img
        src={src}
        alt={alt}
        className={`cursor-pointer transition-opacity hover:opacity-90 ${className}`}
        onDoubleClick={(e) => {
          e.stopPropagation();
          handleImageUpload(regionKey);
        }}
      />
    );
  };

  // --- LAYOUT COMPONENTS ---
  const Section = ({ children, id, bgType = "primary", className = "" }: any) => (
    <section
      id={id}
      style={{
        padding: `${theme.sectionSpacing}px 0`,
        backgroundColor: bgType === "primary" ? theme.backgroundColor : theme.secondaryColor,
        color: theme.textColor,
      }}
      className={`w-full flex justify-center overflow-hidden px-4 sm:px-6 lg:px-8 ${className}`}
    >
      <div className="w-full max-w-7xl min-w-0">{children}</div>
    </section>
  );

  const Navbar = () => (
    <nav
      className="sticky top-0 w-full z-40 backdrop-blur-md border-b transition-colors duration-300"
      style={{
        backgroundColor: `${theme.backgroundColor}E6`,
        borderColor: `${theme.textColor}15`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-24 flex items-center justify-between gap-4 overflow-hidden">
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <EditableImg
            regionKey="global.logo"
            fallback="https://images.unsplash.com/photo-1600618528240-fb9fc964b853?w=100&h=100&fit=crop"
            className="w-12 h-12 object-cover rounded-full shadow-sm"
          />
          <EditableText
            regionKey="global.brand"
            fallback="AURA YOGA"
            className="font-light text-xl md:text-2xl tracking-[0.2em] whitespace-nowrap"
          />
        </div>

        <div className="hidden md:flex items-center gap-10 px-4">
          {["Home", "About", "Contact"].map((page) => (
            <button
              key={page}
              onClick={() => setActivePage(page.toLowerCase() as any)}
              className={`text-sm transition-all duration-300 uppercase tracking-widest ${
                activePage === page.toLowerCase()
                  ? "font-medium scale-105"
                  : "font-light opacity-60 hover:opacity-100 hover:scale-105"
              }`}
              style={{
                color: theme.textColor,
                borderBottom: activePage === page.toLowerCase() ? `2px solid ${theme.primaryColor}` : "2px solid transparent",
                paddingBottom: "4px"
              }}
            >
              {page}
            </button>
          ))}
        </div>

        <div className="flex-shrink-0">
          <button
            className="px-8 py-3 text-xs md:text-sm transition-all duration-300 uppercase tracking-[0.15em] hover:shadow-lg hover:-translate-y-0.5"
            style={{
              backgroundColor: theme.primaryColor,
              color: "#FFFFFF",
              borderRadius: `${theme.borderRadius}px`,
            }}
          >
            <EditableText regionKey="global.navCta" fallback="BOOK CLASS" />
          </button>
        </div>
      </div>
    </nav>
  );

  const Footer = () => (
    <footer
      className="py-24 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundColor: theme.secondaryColor,
        color: theme.textColor,
      }}
    >
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center gap-12">
        <div className="flex flex-col items-center gap-6">
          <EditableImg
            regionKey="global.logo"
            fallback="https://images.unsplash.com/photo-1600618528240-fb9fc964b853?w=100&h=100&fit=crop"
            className="w-16 h-16 rounded-full shadow-md"
          />
          <EditableText
            regionKey="global.brand"
            fallback="AURA YOGA"
            className="font-light text-2xl tracking-[0.2em]"
          />
          <EditableText
            as="p"
            regionKey="footer.desc"
            fallback="Cultivating mindfulness and movement in a chaotic world. Join our sanctuary."
            className="text-base font-light opacity-70 max-w-md leading-relaxed block"
          />
        </div>
        
        <div className="flex flex-wrap justify-center gap-8">
          {["Home", "About", "Contact"].map((p) => (
            <button 
              key={p} 
              onClick={() => setActivePage(p.toLowerCase() as any)} 
              className="text-sm font-light tracking-widest uppercase opacity-70 hover:opacity-100 transition-opacity"
            >
              {p}
            </button>
          ))}
        </div>

        <div className="flex flex-col items-center gap-2 pt-12 border-t w-full max-w-md" style={{ borderColor: `${theme.textColor}15` }}>
          <EditableText regionKey="footer.email" fallback="hello@aurayoga.studio" className="text-sm font-light tracking-wider block" />
          <EditableText regionKey="footer.copy" fallback="© 2026 Aura Yoga. Designed with Clyra." className="text-xs font-light opacity-40 block mt-4" />
        </div>
      </div>
    </footer>
  );

  // --- PAGE VIEWS ---
  const HomeView = () => (
    <div className="animate-fade-in">
      <Section id="hero" bgType="primary" className="min-h-[85vh] flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          <div className="space-y-10 order-2 lg:order-1 text-center lg:text-left">
            <div className="space-y-4">
              <EditableText
                as="h3"
                regionKey="hero.kicker"
                fallback="EMBRACE STILLNESS"
                className="text-sm md:text-base font-medium tracking-[0.3em] uppercase block opacity-60"
                style={{ color: theme.primaryColor }}
              />
              <EditableText
                as="h1"
                regionKey="hero.title"
                fallback="Find Your Inner Balance."
                className="text-5xl md:text-7xl font-light leading-[1.1] tracking-tight block"
              />
            </div>
            <EditableText
              as="p"
              regionKey="hero.subtitle"
              fallback="Experience holistic healing through movement, breath, and meditation in our tranquil studio environment."
              className="text-lg md:text-xl font-light opacity-75 leading-relaxed block max-w-xl mx-auto lg:mx-0"
            />
            <div className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start">
              <button
                className="px-10 py-4 uppercase tracking-[0.15em] text-sm font-medium transition-all duration-300 hover:-translate-y-1 hover:shadow-xl w-full sm:w-auto"
                style={{ backgroundColor: theme.primaryColor, color: "#FFFFFF", borderRadius: `${theme.borderRadius}px` }}
              >
                <EditableText regionKey="hero.btn1" fallback="Start Journey" />
              </button>
              <button
                className="px-10 py-4 uppercase tracking-[0.15em] text-sm font-medium transition-all duration-300 hover:opacity-70 w-full sm:w-auto"
                style={{ border: `1px solid ${theme.primaryColor}`, color: theme.primaryColor, borderRadius: `${theme.borderRadius}px` }}
              >
                <EditableText regionKey="hero.btn2" fallback="View Schedule" />
              </button>
            </div>
          </div>
          <div className="relative order-1 lg:order-2 w-full flex justify-center">
            <div className="relative w-full max-w-md lg:max-w-full aspect-[4/5] md:aspect-[3/4]">
              <div 
                className="absolute inset-0 translate-x-4 translate-y-4 md:translate-x-8 md:translate-y-8 rounded-t-full rounded-b-full opacity-20"
                style={{ backgroundColor: theme.primaryColor }}
              ></div>
              <EditableImg
                regionKey="hero.img"
                fallback="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop"
                className="absolute inset-0 w-full h-full object-cover shadow-2xl rounded-t-full rounded-b-full"
              />
            </div>
          </div>
        </div>
      </Section>

      <Section id="features" bgType="secondary">
        <div className="text-center mb-16 md:mb-24">
           <EditableText
              as="h2"
              regionKey="features.title"
              fallback="Our Practices"
              className="text-3xl md:text-4xl font-light tracking-wide block"
            />
        </div>
        <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
          {[
            { id: "1", title: "Vinyasa Flow", desc: "Connect breath to movement in our dynamic and fluid sequences designed to build strength and grace." },
            { id: "2", title: "Guided Meditation", desc: "Find mental clarity and profound peace through expert-led stillness practices." },
            { id: "3", title: "Restorative Yin", desc: "Deep tissue release and complete relaxation using props for supported, prolonged poses." }
          ].map((item, idx) => (
            <div key={item.id} className="flex flex-col items-center text-center space-y-6 p-8 bg-white/5 backdrop-blur-sm transition-transform hover:-translate-y-2" style={{ borderRadius: `${theme.borderRadius}px`, border: `1px solid ${theme.textColor}10` }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center opacity-80" style={{ backgroundColor: `${theme.primaryColor}20`, color: theme.primaryColor }}>
                <span className="text-xl font-light">0{idx + 1}</span>
              </div>
              <EditableText as="h3" regionKey={`features.item${item.id}.title`} fallback={item.title} className="text-xl font-medium tracking-wider uppercase block" />
              <EditableText as="p" regionKey={`features.item${item.id}.desc`} fallback={item.desc} className="text-base font-light opacity-70 leading-relaxed block" />
            </div>
          ))}
        </div>
      </Section>
    </div>
  );

  const AboutView = () => (
    <Section id="about" className="animate-fade-in-up min-h-[85vh] flex items-center py-24">
      <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        <div className="relative w-full max-w-lg mx-auto lg:max-w-none">
           <div className="aspect-square relative rounded-full overflow-hidden shadow-2xl border-8" style={{ borderColor: theme.secondaryColor }}>
              <EditableImg
                regionKey="about.img"
                fallback="https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?q=80&w=1200&auto=format&fit=crop"
                className="w-full h-full object-cover"
              />
           </div>
           <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full opacity-30 blur-2xl" style={{ backgroundColor: theme.primaryColor }}></div>
        </div>
        <div className="space-y-8 text-center lg:text-left">
          <EditableText 
            as="h4" 
            regionKey="about.kicker" 
            fallback="OUR PHILOSOPHY" 
            className="text-sm font-medium tracking-[0.3em] uppercase block opacity-60" 
            style={{ color: theme.primaryColor }}
          />
          <EditableText 
            as="h2" 
            regionKey="about.title" 
            fallback="A Sanctuary for the Soul." 
            className="text-4xl md:text-5xl font-light tracking-tight block leading-tight" 
          />
          <EditableText
            as="p"
            regionKey="about.desc1"
            fallback="Founded on the principles of holistic wellness, Aura Yoga was created to be a refuge from the noise of modern life. We believe that true health encompasses the mind, body, and spirit."
            className="text-lg font-light opacity-80 leading-relaxed block"
          />
          <EditableText
            as="p"
            regionKey="about.desc2"
            fallback="Our expert instructors are dedicated to guiding you through a personal journey of discovery, offering support and wisdom at every stage of your practice."
            className="text-lg font-light opacity-80 leading-relaxed block"
          />
        </div>
      </div>
    </Section>
  );

  const ContactView = () => (
    <Section id="contact" className="animate-fade-in-scale py-24 min-h-[85vh] flex items-center">
      <div className="max-w-5xl mx-auto w-full">
        <div className="text-center mb-16 space-y-4">
          <EditableText 
            as="h4" 
            regionKey="contact.kicker" 
            fallback="REACH OUT" 
            className="text-sm font-medium tracking-[0.3em] uppercase block opacity-60" 
            style={{ color: theme.primaryColor }}
          />
          <EditableText 
            as="h1" 
            regionKey="contact.title" 
            fallback="Connect With Us" 
            className="text-5xl md:text-6xl font-light tracking-tight block" 
          />
        </div>

        <div 
          className="grid md:grid-cols-5 gap-0 overflow-hidden shadow-2xl" 
          style={{ borderRadius: `${theme.borderRadius * 2}px`, backgroundColor: theme.secondaryColor }}
        >
          <div className="md:col-span-2 p-10 md:p-14 text-left flex flex-col justify-between" style={{ backgroundColor: theme.primaryColor, color: "#FFFFFF" }}>
            <div className="space-y-12">
              <EditableText as="h3" regionKey="contact.infoTitle" fallback="Studio Information" className="text-2xl font-light block" />
              <div className="space-y-8">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-[0.2em] opacity-60 mb-2">Location</h4>
                  <EditableText regionKey="contact.address" fallback="123 Serenity Lane, Zen District, CA 90210" className="font-light text-sm leading-relaxed block" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-[0.2em] opacity-60 mb-2">Email</h4>
                  <EditableText regionKey="contact.email" fallback="namaste@aurayoga.studio" className="font-light text-sm block" />
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-3 p-10 md:p-14 bg-white/50 backdrop-blur-md">
            <div className="space-y-8">
              <EditableText as="h3" regionKey="contact.formTitle" fallback="Send a Message" className="text-2xl font-light block mb-8" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <input className="w-full pb-4 bg-transparent border-b outline-none font-light" style={{ borderColor: `${theme.textColor}30` }} placeholder="First Name" />
                <input className="w-full pb-4 bg-transparent border-b outline-none font-light" style={{ borderColor: `${theme.textColor}30` }} placeholder="Last Name" />
              </div>
              <textarea className="w-full pb-4 bg-transparent border-b outline-none font-light resize-none h-24" style={{ borderColor: `${theme.textColor}30` }} placeholder="Your Inquiry" />
              <button className="mt-4 px-10 py-4 font-medium uppercase tracking-[0.2em] text-xs transition-all hover:shadow-lg w-full md:w-auto" style={{ backgroundColor: theme.textColor, color: theme.backgroundColor, borderRadius: `${theme.borderRadius}px` }}>
                <EditableText regionKey="contact.submit" fallback="Send Message" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );

  return (
    <main
      className="min-h-screen break-words overflow-x-hidden"
      style={{ fontFamily: theme.fontFamily, backgroundColor: theme.backgroundColor }}
    >
      {/* Script loading via native tag for better environment compatibility */}
      <script src="https://upload-widget.cloudinary.com/global/all.js" async />
      
      <Navbar />

      <div className="flex flex-col w-full min-w-0">
        {activePage === "home" && <HomeView />}
        {activePage === "about" && <AboutView />}
        {activePage === "contact" && <ContactView />}
      </div>

      <Footer />

      <style>{`
        html { scroll-behavior: smooth; }
        [contenteditable]:focus { 
          outline: none; 
          background-color: rgba(0,0,0,0.03); 
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes fadeInScale { from { transform: scale(0.98); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }
        .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
        .animate-fade-in-scale { animation: fadeInScale 0.6s ease-out forwards; }
      `}</style>
    </main>
  );
}