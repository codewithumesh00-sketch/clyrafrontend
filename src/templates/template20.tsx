"use client";

import React, { useState } from "react";
import Script from "next/script";
import {
  useWebsiteBuilderStore,
  useRegionValue,
} from "@/store/useWebsiteBuilderStore";
import { useThemeStore } from "@/store/useThemeStore";

export const template20Meta = {
  id: "business/template20",
  name: "Crypto Startup",
  image: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=1600&auto=format&fit=crop",
};

type TemplateProps = {
  editableData?: any;
};

const getNestedValue = (obj: any, path: string) => {
  return path?.split(".").reduce((acc, part) => acc && acc[part], obj);
};

export default function Template20({ editableData }: TemplateProps) {
  const [activePage, setActivePage] = useState<"home" | "about" | "contact">("home");
  const { theme } = useThemeStore();
  const updateRegion = useWebsiteBuilderStore((state: any) => state.updateRegion);

  // --- IMAGE UPLOAD HANDLER ---
  const handleImageUpload = (regionKey: string) => {
    if (typeof window !== "undefined" && (window as any).cloudinary) {
      (window as any).cloudinary
        .createUploadWidget(
          {
            cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "demo",
            uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ml_default",
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
        className={`focus:outline-none focus:ring-1 focus:ring-cyan-500/50 rounded transition-all min-w-0 break-words ${className}`}
      >
        {content}
      </Tag>
    );
  };

  const EditableImg = ({ regionKey, fallback, className = "", alt = "image", style = {} }: any) => {
    const hookValue = useRegionValue(regionKey);
    const dataValue = getNestedValue(editableData, regionKey);
    const src = hookValue ?? dataValue ?? fallback;

    return (
      <img
        src={src}
        alt={alt}
        style={style}
        className={`cursor-pointer transition-all hover:brightness-110 ${className}`}
        onDoubleClick={(e) => {
          e.stopPropagation();
          handleImageUpload(regionKey);
        }}
      />
    );
  };

  // --- LAYOUT COMPONENTS ---
  const Section = ({ children, id, bgType = "primary" }: any) => (
    <section
      id={id}
      style={{
        padding: `${theme.sectionSpacing}px 0`,
        backgroundColor: bgType === "primary" ? theme.backgroundColor : theme.secondaryColor,
        color: theme.textColor,
      }}
      className="w-full flex justify-center overflow-hidden px-4 sm:px-6 lg:px-8"
    >
      <div className="w-full max-w-7xl">{children}</div>
    </section>
  );

  const Navbar = () => (
    <nav
      className="sticky top-0 w-full z-40 backdrop-blur-xl border-b transition-all"
      style={{
        backgroundColor: `${theme.backgroundColor}E6`,
        borderColor: `${theme.textColor}15`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-24 flex items-center justify-between gap-4 overflow-hidden">
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <EditableImg
            regionKey="global.logo"
            fallback="https://images.unsplash.com/photo-1622630998477-20b41cd0e0b2?w=128&h=128&fit=crop"
            className="w-10 h-10 object-cover rounded-xl border border-white/10 shadow-[0_0_15px_rgba(0,255,255,0.2)]"
          />
          <EditableText
            regionKey="global.brand"
            fallback="NEXUS"
            className="font-black text-xl tracking-[0.2em] whitespace-nowrap bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500"
          />
        </div>

        <div className="hidden md:flex items-center gap-8 px-4">
          {["Home", "About", "Contact"].map((page) => (
            <button
              key={page}
              onClick={() => setActivePage(page.toLowerCase() as any)}
              className={`text-xs font-bold transition-all uppercase tracking-widest ${
                activePage === page.toLowerCase() ? "opacity-100" : "opacity-40 hover:opacity-80"
              }`}
              style={{ color: activePage === page.toLowerCase() ? theme.primaryColor : theme.textColor }}
            >
              {page}
            </button>
          ))}
        </div>

        <div className="flex-shrink-0">
          <button
            className="px-6 py-3 font-black text-[10px] uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 shadow-lg"
            style={{
              backgroundColor: theme.primaryColor,
              color: "#fff",
              borderRadius: `${theme.borderRadius}px`,
            }}
          >
            <EditableText regionKey="global.navCta" fallback="LAUNCH APP" />
          </button>
        </div>
      </div>
    </nav>
  );

  const Footer = () => (
    <footer
      className="py-24 px-4 sm:px-6 lg:px-8 border-t relative overflow-hidden"
      style={{
        backgroundColor: theme.backgroundColor,
        color: theme.textColor,
        borderColor: `${theme.textColor}10`,
      }}
    >
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 text-center md:text-left relative z-10">
        <div className="space-y-6 md:col-span-2">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <EditableImg
              regionKey="global.logo"
              fallback="https://images.unsplash.com/photo-1622630998477-20b41cd0e0b2?w=128&h=128&fit=crop"
              className="w-8 h-8 rounded-lg"
            />
            <EditableText regionKey="global.brand" fallback="NEXUS" className="font-black tracking-[0.2em]" />
          </div>
          <EditableText
            as="p"
            regionKey="footer.desc"
            fallback="Building institutional-grade infrastructure for the decentralized economy."
            className="text-sm opacity-50 leading-relaxed block max-w-sm mx-auto md:mx-0"
          />
        </div>
        <div className="flex flex-col gap-4">
          <h4 className="font-black uppercase tracking-widest text-[10px] opacity-30">Protocol</h4>
          {["Home", "About", "Contact"].map((p) => (
            <button key={p} onClick={() => setActivePage(p.toLowerCase() as any)} className="hover:text-cyan-400 transition-colors text-sm w-fit mx-auto md:mx-0 font-medium opacity-60">
              {p}
            </button>
          ))}
        </div>
        <div className="space-y-4 flex flex-col items-center md:items-start">
          <h4 className="font-black uppercase tracking-widest text-[10px] opacity-30">Socials</h4>
          <EditableText regionKey="footer.social1" fallback="Twitter / X" className="text-sm block opacity-60 hover:text-cyan-400 cursor-pointer" />
          <EditableText regionKey="footer.social2" fallback="Discord" className="text-sm block opacity-60 hover:text-cyan-400 cursor-pointer" />
        </div>
      </div>
    </footer>
  );

  // --- VIEWS ---
  const HomeView = () => (
    <div className="animate-in fade-in duration-700 w-full min-w-0">
      <Section id="hero">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-w-0">
          <div className="space-y-8 relative z-10">
            <div className="inline-block px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-500/5 backdrop-blur-md">
              <EditableText
                regionKey="hero.badge"
                fallback="Protocol v2.0 Live"
                className="text-[10px] font-black text-cyan-400 uppercase tracking-widest"
              />
            </div>
            <EditableText
              as="h1"
              regionKey="hero.title"
              fallback="Decentralized Liquidity Optimized."
              className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.95] tracking-tighter block break-words"
            />
            <EditableText
              as="p"
              regionKey="hero.subtitle"
              fallback="The premier destination for high-efficiency swaps and institutional-grade yield strategies."
              className="text-lg opacity-60 leading-relaxed block max-w-xl break-words"
            />
            <div className="flex flex-wrap gap-4 pt-4">
              <button
                className="px-8 py-4 font-black uppercase tracking-widest text-[11px] transition-all hover:scale-105 active:scale-95 shadow-xl"
                style={{ backgroundColor: theme.primaryColor, color: "#fff", borderRadius: `${theme.borderRadius}px` }}
              >
                <EditableText regionKey="hero.btn1" fallback="START TRADING" />
              </button>
            </div>
          </div>
          <div className="relative aspect-square md:aspect-[4/3] lg:aspect-square flex items-center justify-center">
            <div className="absolute inset-0 bg-cyan-500/10 blur-[120px] rounded-full"></div>
            <EditableImg
              regionKey="hero.img"
              fallback="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1600&auto=format&fit=crop"
              className="relative w-full h-full object-cover shadow-2xl border border-white/5 z-10"
              style={{ borderRadius: `${theme.borderRadius * 2}px` }}
            />
          </div>
        </div>
      </Section>
    </div>
  );

  const AboutView = () => (
    <Section id="about">
      <div className="grid lg:grid-cols-2 gap-20 items-center animate-in slide-in-from-bottom-8 duration-700">
        <EditableImg
          regionKey="about.img"
          fallback="https://images.unsplash.com/photo-1639322537504-6427a16b0a28?q=80&w=1600&auto=format&fit=crop"
          className="w-full aspect-square object-cover shadow-2xl"
          style={{ borderRadius: `${theme.borderRadius * 2}px` }}
        />
        <div className="space-y-6">
          <EditableText as="h2" regionKey="about.title" fallback="Secured by Math." className="text-5xl font-black tracking-tighter block" />
          <EditableText
            as="p"
            regionKey="about.desc"
            fallback="Nexus utilizes zero-knowledge proofs and deterministic state channels to ensure that your assets are always under your control, with mathematically guaranteed security."
            className="text-lg opacity-60 leading-relaxed block"
          />
        </div>
      </div>
    </Section>
  );

  const ContactView = () => (
    <Section id="contact">
      <div className="max-w-4xl mx-auto text-center space-y-12 animate-in zoom-in-95 duration-500">
        <EditableText as="h1" regionKey="contact.title" fallback="Join the Network" className="text-6xl font-black tracking-tighter block" />
        <div className="bg-white/5 p-12 backdrop-blur-xl border border-white/10" style={{ borderRadius: `${theme.borderRadius * 2}px` }}>
          <div className="grid md:grid-cols-2 gap-8 text-left">
            <div className="space-y-4">
              <EditableText regionKey="contact.label1" fallback="Support Email" className="text-[10px] font-black uppercase tracking-widest opacity-40 block" />
              <EditableText regionKey="contact.email" fallback="protocol@nexus.io" className="text-xl font-bold block" />
            </div>
            <button className="w-full py-5 font-black uppercase tracking-widest text-[11px]" style={{ backgroundColor: theme.primaryColor, color: "#fff", borderRadius: `${theme.borderRadius}px` }}>
              <EditableText regionKey="contact.submit" fallback="SEND INQUIRY" />
            </button>
          </div>
        </div>
      </div>
    </Section>
  );

  return (
    <main
      className="min-h-screen w-full flex flex-col"
      style={{ fontFamily: theme.fontFamily, backgroundColor: theme.backgroundColor }}
    >
      <script src="https://upload-widget.cloudinary.com/global/all.js" async></script>
      
      <Navbar />

      <div className="flex-grow flex flex-col w-full min-w-0">
        {activePage === "home" && <HomeView />}
        {activePage === "about" && <AboutView />}
        {activePage === "contact" && <ContactView />}
      </div>

      <Footer />

      <style>{`
        html { scroll-behavior: smooth; }
        [contenteditable]:focus { outline: none; background: rgba(255,255,255,0.03); }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-in-from-bottom-8 { from { transform: translateY(2rem); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes zoom-in-95 { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-in { animation-duration: 0.6s; animation-fill-mode: both; }
        .fade-in { animation-name: fade-in; }
        .slide-in-from-bottom-8 { animation-name: slide-in-from-bottom-8; }
        .zoom-in-95 { animation-name: zoom-in-95; }
      `}</style>
    </main>
  );
}




