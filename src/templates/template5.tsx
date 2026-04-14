"use client";

import React, { useState, useEffect } from "react";

/**
 * PRODUCTION-SAFE FITNESS COACH TEMPLATE FOR CLYRA
 * Resolved external module dependencies for isolated environment compatibility.
 */

// --- DYNAMIC STORE RESOLUTION ---
let useWebsiteBuilderStore: any;
let useRegionValue: any;
let useThemeStore: any;

try {
  // Attempt to resolve Clyra-specific stores
  const websiteStore = require("@/store/useWebsiteBuilderStore");
  useWebsiteBuilderStore = websiteStore.useWebsiteBuilderStore;
  useRegionValue = websiteStore.useRegionValue;
  const themeStore = require("@/store/useThemeStore");
  useThemeStore = themeStore.useThemeStore;
} catch (e) {
  // Fallback for environment isolation
  useWebsiteBuilderStore = (selector: any) => selector({ updateRegion: () => {} });
  useRegionValue = () => null;
  useThemeStore = () => ({
    theme: {
      backgroundColor: "#0a0a0a",
      textColor: "#ffffff",
      primaryColor: "#3b82f6",
      secondaryColor: "#171717",
      borderRadius: 4,
      sectionSpacing: 100,
      fontFamily: "Inter, sans-serif",
    },
  });
}

export const template5Meta = {
  id: "business/template5",
  name: "Elite Performance Coach",
  image:
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1600&auto=format&fit=crop",
};

type TemplateProps = {
  editableData?: any;
};

const getNestedValue = (obj: any, path: string) => {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
};

export default function Template5({ editableData }: TemplateProps) {
  const [activePage, setActivePage] = useState<"home" | "about" | "contact">("home");
  const { theme } = useThemeStore();
  const updateRegion = useWebsiteBuilderStore((state: any) => state.updateRegion);

  // --- IMAGE UPLOAD HANDLER ---
  const handleImageUpload = (regionKey: string) => {
    if (typeof window !== "undefined" && (window as any).cloudinary) {
      (window as any).cloudinary
        .createUploadWidget(
          {
            cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
            uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
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
  };

  // --- EDITABLE COMPONENTS ---
  const EditableText = ({ regionKey, fallback, as: Tag = "span", className = "", style = {} }: any) => {
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
        className={`focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-1 -mx-1 transition-all ${className}`}
        style={style}
      >
        {content}
      </Tag>
    );
  };

  const EditableImg = ({ regionKey, fallback, className = "", alt = "fitness" }: any) => {
    const hookValue = useRegionValue(regionKey);
    const dataValue = getNestedValue(editableData, regionKey);
    const src = hookValue ?? dataValue ?? fallback;

    return (
      <img
        src={src}
        alt={alt}
        className={`cursor-pointer transition-all duration-500 ${className}`}
        onDoubleClick={(e) => {
          e.stopPropagation();
          handleImageUpload(regionKey);
        }}
      />
    );
  };

  // --- LAYOUT COMPONENTS ---
  const Navbar = () => (
    <nav 
      className="fixed top-0 w-full z-50 backdrop-blur-xl border-b border-white/5"
      style={{ backgroundColor: `${theme.backgroundColor}CC` }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4 flex-shrink-0">
          <EditableText 
            regionKey="global.brand" 
            fallback="ULTRAFIT." 
            className="text-2xl font-black italic tracking-tighter" 
            style={{ color: theme.primaryColor }}
          />
        </div>
        
        <div className="hidden md:flex items-center gap-10">
          {["Home", "About", "Contact"].map((p) => (
            <button
              key={p}
              onClick={() => setActivePage(p.toLowerCase() as any)}
              className="text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:opacity-100"
              style={{ 
                color: theme.textColor,
                opacity: activePage === p.toLowerCase() ? 1 : 0.4 
              }}
            >
              {p}
            </button>
          ))}
        </div>

        <button 
          className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest transition-transform active:scale-95"
          style={{ 
            backgroundColor: theme.primaryColor, 
            color: "#fff", 
            borderRadius: `${theme.borderRadius}px` 
          }}
          onClick={() => setActivePage("contact")}
        >
          <EditableText regionKey="global.cta" fallback="JOIN THE ELITE" />
        </button>
      </div>
    </nav>
  );

  const HomeView = () => (
    <div className="animate-in fade-in duration-1000">
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <EditableImg 
            regionKey="home.heroBg" 
            fallback="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2000&auto=format&fit=crop"
            className="w-full h-full object-cover opacity-30 grayscale scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <EditableText 
            as="h1" 
            regionKey="home.heroTitle" 
            fallback="STRONGER EVERY DAY." 
            className="text-6xl md:text-9xl font-black italic tracking-tighter leading-[0.85] mb-6 block uppercase"
            style={{ color: theme.textColor }}
          />
          <EditableText 
            as="p" 
            regionKey="home.heroSub" 
            fallback="High-performance coaching for the dedicated few. Science-based protocols, zero excuses." 
            className="text-lg md:text-xl opacity-60 max-w-2xl mx-auto mb-12 block font-medium"
          />
          <button 
            className="px-14 py-6 font-black uppercase tracking-tighter text-xl italic hover:brightness-125 transition-all"
            style={{ backgroundColor: theme.primaryColor, color: "#fff" }}
          >
            <EditableText regionKey="home.heroBtn" fallback="START TRAINING" />
          </button>
        </div>
      </section>

      <section className="py-24 border-y border-white/5" style={{ backgroundColor: theme.secondaryColor }}>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {[1,2,3,4].map(i => (
            <div key={i} className="space-y-1">
              <EditableText regionKey={`home.statVal${i}`} fallback={i === 1 ? "1.2k+" : i === 2 ? "12kg" : i === 3 ? "14wk" : "24/7"} className="text-4xl md:text-6xl font-black italic block" style={{ color: theme.primaryColor }} />
              <EditableText regionKey={`home.statLabel${i}`} fallback={i === 1 ? "ATHLETES" : i === 2 ? "AVG GAIN" : i === 3 ? "INTENSIVE" : "SUPPORT"} className="text-[10px] font-black tracking-[0.2em] opacity-30 block" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  const AboutView = () => (
    <div className="pt-32 pb-24 animate-in slide-in-from-bottom-4 duration-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="relative group">
            <div className="absolute -top-6 -left-6 w-32 h-32 z-0 border-t-[12px] border-l-[12px]" style={{ borderColor: theme.primaryColor }} />
            <EditableImg 
              regionKey="about.coachImg" 
              fallback="https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=1000&auto=format&fit=crop"
              className="relative z-10 w-full aspect-[4/5] object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000"
            />
          </div>
          <div className="space-y-10">
            <EditableText 
              as="h2" 
              regionKey="about.title" 
              fallback="THE METHODOLOGY." 
              className="text-5xl md:text-8xl font-black italic tracking-tighter leading-none block uppercase"
            />
            <EditableText 
              as="p" 
              regionKey="about.desc" 
              fallback="I bridge the gap between sports science and practical application. My programs are built on progressive overload, metabolic conditioning, and data-driven nutrition. We don't guess; we measure." 
              className="text-xl opacity-60 leading-relaxed block font-light"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-10 border-t border-white/10">
              {["BIOMECHANICS", "HYPERTROPHY", "ENDURANCE", "RECOVERY"].map((pill, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="w-1.5 h-6" style={{ backgroundColor: theme.primaryColor }} />
                  <EditableText regionKey={`about.pill${idx}`} fallback={pill} className="font-black italic tracking-widest text-sm opacity-90" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const ContactView = () => (
    <div className="pt-32 pb-24 min-h-screen animate-in zoom-in-95 duration-500">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <EditableText 
          as="h1" 
          regionKey="contact.title" 
          fallback="APPLICATION." 
          className="text-7xl md:text-[10rem] font-black italic tracking-tighter mb-4 block leading-none"
        />
        <EditableText 
          as="p" 
          regionKey="contact.sub" 
          fallback="I only accept 5 new athletes per month. Apply only if you are ready for extreme commitment." 
          className="text-lg opacity-40 mb-20 block uppercase tracking-widest"
        />
        
        <form className="text-left space-y-10">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-2 group">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 ml-1 group-focus-within:opacity-100 transition-opacity">Full Name</label>
              <input className="w-full bg-transparent border-b-2 border-white/10 p-4 focus:border-blue-500 transition-all outline-none font-black italic text-xl uppercase" />
            </div>
            <div className="space-y-2 group">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 ml-1 group-focus-within:opacity-100 transition-opacity">Email Address</label>
              <input className="w-full bg-transparent border-b-2 border-white/10 p-4 focus:border-blue-500 transition-all outline-none font-black italic text-xl uppercase" />
            </div>
          </div>
          <div className="space-y-2 group">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 ml-1 group-focus-within:opacity-100 transition-opacity">Primary Objective</label>
            <textarea className="w-full bg-transparent border-b-2 border-white/10 p-4 focus:border-blue-500 transition-all outline-none font-black italic text-xl uppercase h-24 resize-none" />
          </div>
          <button 
            type="button"
            className="w-full py-8 font-black uppercase tracking-widest italic text-2xl hover:brightness-125 transition-all"
            style={{ backgroundColor: theme.primaryColor, color: "#fff" }}
          >
            <EditableText regionKey="contact.btn" fallback="SUBMIT FOR REVIEW" />
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <main 
      className="w-full min-h-screen overflow-x-hidden selection:bg-blue-600 selection:text-white"
      style={{ 
        backgroundColor: theme.backgroundColor, 
        color: theme.textColor,
        fontFamily: theme.fontFamily 
      }}
    >
      <script 
        src="https://upload-widget.cloudinary.com/global/all.js" 
        async
      ></script>

      <Navbar />

      <div className="w-full">
        {activePage === "home" && <HomeView />}
        {activePage === "about" && <AboutView />}
        {activePage === "contact" && <ContactView />}
      </div>

      <footer className="py-20 border-t border-white/5 bg-black/40">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-12">
          <EditableText regionKey="global.brand" fallback="ULTRAFIT." className="text-4xl font-black italic tracking-tighter" style={{ color: theme.primaryColor }} />
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {["INSTAGRAM", "YOUTUBE", "X-TWITTER", "STRAVA"].map(social => (
              <EditableText key={social} regionKey={`footer.${social}`} fallback={social} className="text-[10px] font-black tracking-[0.4em] opacity-40 hover:opacity-100 cursor-pointer transition-opacity" />
            ))}
          </div>
          <EditableText regionKey="footer.copy" fallback="© 2024 ULTRA PERFORMANCE. NO LIMITS." className="text-[10px] font-bold tracking-widest opacity-20" />
        </div>
      </footer>

      <style>{`
        body { background-color: #0a0a0a; margin: 0; }
        [contenteditable]:focus { outline: none; background: rgba(255,255,255,0.05); }
        .animate-in { animation: 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-in-from-bottom-4 { from { transform: translateY(3rem); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes zoom-in-95 { from { transform: scale(0.98); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .fade-in { animation-name: fade-in; }
        .slide-in-from-bottom-4 { animation-name: slide-in-from-bottom-4; }
        .zoom-in-95 { animation-name: zoom-in-95; }
      `}</style>
    </main>
  );
}