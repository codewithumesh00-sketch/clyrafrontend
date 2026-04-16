"use client";

import React, { useState, useCallback } from "react";
import Script from "next/script";

/**
 * PRODUCTION-SAFE TEMPLATE FOR CLYRA (SaaS Landing)
 * Fixed Module Resolution: Using relative/external aliases correctly for Clyra environment.
 */

// --- DYNAMIC STORE IMPORTS ---
// Since the compiler is strict about these paths, we use standard Clyra paths.
// In the Clyra environment, these are usually available via the build system.
import {
  useWebsiteBuilderStore,
  useRegionValue,
} from "@/store/useWebsiteBuilderStore";
import { useThemeStore } from "@/store/useThemeStore";

type TemplateProps = {
  editableData?: any;
};

export const template6Meta = {
  id: "business/template6",
  name: "Clyra SaaS Pro",
  image:
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1600&auto=format&fit=crop",
};

export default function Template6({
  editableData,
}: TemplateProps) {
  const [activePage, setActivePage] = useState<"home" | "about" | "contact">("home");
  const { theme } = useThemeStore();
  const updateRegion = useWebsiteBuilderStore((state: any) => state.updateRegion);

  const getNestedValue = (obj: any, path: string) => {
    return path.split(".").reduce((acc: any, part: string) => acc && acc[part], obj);
  };

  // --- HANDLERS ---
  const handleImageUpload = useCallback((regionKey: string) => {
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
  }, [updateRegion]);

  // --- EDITABLE COMPONENTS ---
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
        className={`focus:outline-none focus:ring-2 focus:ring-blue-400 rounded transition-all min-w-[20px] ${className}`}
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
        className={`cursor-pointer transition-opacity hover:opacity-90 max-w-full h-auto ${className}`}
        onDoubleClick={(e) => {
          e.stopPropagation();
          handleImageUpload(regionKey);
        }}
      />
    );
  };

  // --- UI SECTIONS ---
  const Navbar = () => (
    <nav className="w-full sticky top-0 z-50 border-b backdrop-blur-md" style={{ backgroundColor: `${theme.backgroundColor}F2`, borderColor: `${theme.textColor}1A` }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between overflow-hidden">
        <div className="flex items-center gap-2 flex-shrink-0">
          <EditableImg regionKey="global.logo" fallback="https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=100&h=100&fit=crop" className="w-8 h-8 rounded-md" />
          <EditableText regionKey="global.brand" fallback="CLYRA.IO" className="font-black text-lg tracking-tight" />
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          {(["home", "about", "contact"] as const).map((p) => (
            <button 
              key={p} 
              onClick={() => setActivePage(p)}
              className="text-sm font-medium capitalize transition-colors"
              style={{ color: activePage === p ? theme.primaryColor : theme.textColor, opacity: activePage === p ? 1 : 0.6 }}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="flex-shrink-0">
          <button 
            className="px-5 py-2 text-sm font-bold transition-all active:scale-95"
            style={{ backgroundColor: theme.primaryColor, color: "#FFFFFF", borderRadius: `${theme.borderRadius}px` }}
          >
            <EditableText regionKey="global.cta" fallback="Get Started" />
          </button>
        </div>
      </div>
    </nav>
  );

  const HomeView = () => (
    <div className="w-full overflow-hidden">
      {/* Hero */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 lg:py-32 flex justify-center">
        <div className="max-w-4xl text-center space-y-8">
          <div className="inline-block px-4 py-1.5 mb-4 text-xs font-bold tracking-widest uppercase rounded-full bg-blue-50 text-blue-600">
            <EditableText regionKey="home.hero.badge" fallback="Next Generation SaaS" />
          </div>
          <EditableText as="h1" regionKey="home.hero.title" fallback="Scale your workflow without limits." className="text-5xl sm:text-7xl font-black leading-tight tracking-tighter block break-words" />
          <EditableText as="p" regionKey="home.hero.sub" fallback="The all-in-one platform for high-performance teams. Built for reliability, designed for speed." className="text-lg opacity-60 max-w-2xl mx-auto block" />
          <div className="flex flex-wrap justify-center gap-4 pt-4">
             <button className="px-8 py-4 font-bold" style={{ backgroundColor: theme.primaryColor, color: "#FFF", borderRadius: `${theme.borderRadius}px` }}>
                <EditableText regionKey="home.hero.btnMain" fallback="Start Free Trial" />
             </button>
             <button className="px-8 py-4 font-bold border" style={{ borderColor: `${theme.textColor}20`, borderRadius: `${theme.borderRadius}px` }}>
                <EditableText regionKey="home.hero.btnSec" fallback="View Demo" />
             </button>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-gray-50/50" style={{ backgroundColor: theme.secondaryColor }}>
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-8 bg-white shadow-sm border border-gray-100 space-y-4" style={{ borderRadius: `${theme.borderRadius}px` }}>
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                 <EditableImg regionKey={`home.feature.${i}.icon`} fallback="https://images.unsplash.com/photo-1557683316-973673baf926?w=100&h=100&fit=crop" className="w-6 h-6 rounded" />
              </div>
              <EditableText as="h3" regionKey={`home.feature.${i}.title`} fallback={`Feature ${i}`} className="text-xl font-bold block" />
              <EditableText as="p" regionKey={`home.feature.${i}.desc`} fallback="Optimized algorithms for maximum throughput and seamless data integration." className="text-sm opacity-60 leading-relaxed block" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  const AboutView = () => (
    <section className="px-4 sm:px-6 lg:px-8 py-24 flex justify-center overflow-hidden">
      <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-16 items-center">
        <div className="relative group">
          <EditableImg regionKey="about.hero.img" fallback="https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&fit=crop" className="shadow-2xl" style={{ borderRadius: `${theme.borderRadius * 2}px` }} />
        </div>
        <div className="space-y-6">
          <EditableText as="h2" regionKey="about.title" fallback="Our Mission" className="text-4xl font-black tracking-tight block" />
          <EditableText as="p" regionKey="about.desc" fallback="We started Clyra to bridge the gap between complex engineering and beautiful design. Today, we power over 500+ global enterprises with zero downtime and elite security protocols." className="text-lg opacity-70 leading-relaxed block" />
          <div className="grid grid-cols-2 gap-8 pt-8">
            <div>
              <EditableText as="div" regionKey="about.stat1.val" fallback="99.9%" className="text-3xl font-black text-blue-600 block" />
              <EditableText as="div" regionKey="about.stat1.label" fallback="Uptime Guarantee" className="text-xs font-bold uppercase tracking-wider opacity-40 block" />
            </div>
            <div>
              <EditableText as="div" regionKey="about.stat2.val" fallback="24/7" className="text-3xl font-black text-blue-600 block" />
              <EditableText as="div" regionKey="about.stat2.label" fallback="Elite Support" className="text-xs font-bold uppercase tracking-wider opacity-40 block" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  const ContactView = () => (
    <section className="px-4 sm:px-6 lg:px-8 py-24 flex justify-center bg-white overflow-hidden">
      <div className="max-w-3xl w-full text-center space-y-12">
        <div className="space-y-4">
          <EditableText as="h2" regionKey="contact.title" fallback="Talk to our engineers." className="text-4xl font-black tracking-tight block" />
          <EditableText as="p" regionKey="contact.sub" fallback="Have a complex migration? Our team is ready to assist." className="opacity-60 block" />
        </div>
        <div className="grid gap-4 text-left">
          <div className="p-6 border rounded-xl space-y-2" style={{ borderColor: `${theme.textColor}1A`, borderRadius: `${theme.borderRadius}px` }}>
            <h4 className="text-xs font-bold uppercase tracking-widest opacity-40">Headquarters</h4>
            <EditableText regionKey="contact.hq" fallback="Tech Plaza, San Francisco, CA" className="font-bold block" />
          </div>
          <div className="p-6 border rounded-xl space-y-2" style={{ borderColor: `${theme.textColor}1A`, borderRadius: `${theme.borderRadius}px` }}>
            <h4 className="text-xs font-bold uppercase tracking-widest opacity-40">Inquiries</h4>
            <EditableText regionKey="contact.email" fallback="hello@clyra.io" className="font-bold block" />
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <div 
      className="min-h-screen w-full flex flex-col overflow-x-hidden min-w-0" 
      style={{ 
        fontFamily: theme.fontFamily || "Inter, sans-serif",
        backgroundColor: theme.backgroundColor,
        color: theme.textColor
      }}
    >
      {/* Cloudinary Script Loading using standard script for environment compatibility */}
      <script 
        src="https://upload-widget.cloudinary.com/global/all.js" 
        async 
      ></script>

      <Navbar />

      <main className="flex-grow w-full">
        {activePage === "home" && <HomeView />}
        {activePage === "about" && <AboutView />}
        {activePage === "contact" && <ContactView />}
      </main>

      <footer className="w-full px-4 sm:px-6 lg:px-8 py-12 border-t mt-auto" style={{ borderColor: `${theme.textColor}1A` }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <EditableImg regionKey="global.logo" fallback="https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=100&h=100&fit=crop" className="w-6 h-6 rounded-md" />
            <EditableText regionKey="global.brand" fallback="CLYRA.IO" className="font-bold text-sm tracking-tight" />
          </div>
          <EditableText regionKey="footer.copy" fallback="© 2024 Clyra Technologies. All rights reserved." className="text-xs opacity-40 block" />
          <div className="flex gap-6">
             <EditableText regionKey="footer.link1" fallback="Privacy" className="text-xs opacity-60 font-medium" />
             <EditableText regionKey="footer.link2" fallback="Terms" className="text-xs opacity-60 font-medium" />
          </div>
        </div>
      </footer>

      <style>{`
        [contenteditable]:focus {
          outline: none;
          background-color: rgba(59, 130, 246, 0.05);
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
        }
        .break-words {
          overflow-wrap: break-word;
          word-wrap: break-word;
          word-break: break-word;
        }
      `}</style>
    </div>
  );
}




