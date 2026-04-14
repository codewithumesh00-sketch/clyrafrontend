"use client";

import React, { useState, useEffect } from "react";
import Script from "next/script";

/**
 * PRODUCTION-SAFE TEMPLATE FOR CLYRA
 * Template 22: Blog Magazine / Editorial UX
 */

// --- DYNAMIC STORE IMPORTS ---
let useWebsiteBuilderStore: any;
let useRegionValue: any;
let useThemeStore: any;

try {
  const websiteStore = require("@/store/useWebsiteBuilderStore");
  useWebsiteBuilderStore = websiteStore.useWebsiteBuilderStore;
  useRegionValue = websiteStore.useRegionValue;
  const themeStore = require("@/store/useThemeStore");
  useThemeStore = themeStore.useThemeStore;
} catch (e) {
  // Fallback for preview/compiler isolation
  useWebsiteBuilderStore = (selector: any) => selector({ updateRegion: () => {} });
  useRegionValue = () => null;
  useThemeStore = () => ({
    theme: {
      backgroundColor: "#fafafa",
      textColor: "#111827",
      primaryColor: "#e11d48",
      secondaryColor: "#ffffff",
      borderRadius: 0,
      sectionSpacing: 80,
      fontFamily: "Georgia, serif",
    },
  });
}

export const template22Meta = {
  id: "business/template22",
  name: "Blog Magazine",
  image: "https://images.unsplash.com/photo-1585241936939-f033100db50b?q=80&w=1600&auto=format&fit=crop",
};

type TemplateProps = {
  editableData?: any;
};

const getNestedValue = (obj: any, path: string) => {
  if (!obj) return undefined;
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
};

export default function Template22({ editableData }: TemplateProps) {
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
        className={`focus:outline-none focus:ring-2 focus:ring-blue-400 rounded transition-all ${className}`}
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

  const Section = ({ children, id, bgType = "primary", className = "" }: any) => (
    <section
      id={id}
      style={{
        padding: `${theme.sectionSpacing}px 24px`,
        backgroundColor: bgType === "primary" ? theme.backgroundColor : theme.secondaryColor,
        color: theme.textColor,
      }}
      className={`w-full flex justify-center overflow-hidden ${className}`}
    >
      <div className="w-full max-w-7xl">{children}</div>
    </section>
  );

  // --- EDITORIAL NAVBAR ---
  const Navbar = () => (
    <nav
      className="w-full z-40 border-b-2"
      style={{
        backgroundColor: theme.backgroundColor,
        borderColor: theme.textColor,
      }}
    >
      {/* Top Banner */}
      <div className="w-full border-b text-center py-2 text-xs uppercase tracking-widest font-bold opacity-80" style={{ borderColor: `${theme.textColor}20` }}>
        <EditableText regionKey="global.topBanner" fallback="The Daily Editorial • Fresh Perspectives Daily" />
      </div>
      
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
        {/* Brand Name (Magazine Style) */}
        <div className="flex-1 text-center md:text-left min-w-0">
          <EditableText
            regionKey="global.brand"
            fallback="THE CHRONICLE"
            className="font-black text-4xl md:text-6xl tracking-tighter whitespace-nowrap block"
          />
        </div>

        {/* Links */}
        <div className="flex items-center gap-6 md:gap-10">
          {["Home", "About", "Contact"].map((page) => (
            <button
              key={page}
              onClick={() => setActivePage(page.toLowerCase() as any)}
              className={`text-sm font-bold uppercase tracking-widest transition-colors ${
                activePage === page.toLowerCase() ? "" : "opacity-50 hover:opacity-100"
              }`}
              style={{ color: activePage === page.toLowerCase() ? theme.primaryColor : theme.textColor }}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );

  // --- FOOTER ---
  const Footer = () => (
    <footer
      className="py-16 px-6 border-t-4"
      style={{
        backgroundColor: theme.backgroundColor,
        color: theme.textColor,
        borderColor: theme.textColor,
      }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
        <div className="space-y-4 max-w-sm">
          <EditableText regionKey="global.brand" fallback="THE CHRONICLE" className="font-black text-3xl tracking-tighter block" />
          <EditableText
            as="p"
            regionKey="footer.desc"
            fallback="Award-winning journalism and editorial pieces covering culture, design, and modern living."
            className="text-sm opacity-70 leading-relaxed block"
          />
        </div>
        <div className="space-y-2">
          <h4 className="font-bold uppercase tracking-widest text-xs opacity-50 mb-4">Navigation</h4>
          <div className="flex gap-6">
            {["Home", "About", "Contact"].map((p) => (
              <button key={p} onClick={() => setActivePage(p.toLowerCase() as any)} className="hover:underline text-sm font-semibold uppercase tracking-wider">
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4" style={{ borderColor: `${theme.textColor}20` }}>
        <EditableText regionKey="footer.copy" fallback="© 2026 The Chronicle Media. All rights reserved." className="text-xs opacity-50 block" />
        <EditableText regionKey="footer.sublink" fallback="Privacy Policy | Terms of Service" className="text-xs opacity-50 block" />
      </div>
    </footer>
  );

  // --- PAGE VIEWS ---
  const HomeView = () => (
    <div className="animate-in fade-in duration-700">
      {/* Featured Headline Article */}
      <Section id="featured" className="border-b" style={{ borderColor: `${theme.textColor}20` }}>
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 relative group">
            <EditableImg
              regionKey="home.hero.img"
              fallback="https://images.unsplash.com/photo-1476242906366-d8eb64c2f661?q=80&w=1600&auto=format&fit=crop"
              className="w-full aspect-video md:aspect-[16/10] object-cover"
              style={{ borderRadius: `${theme.borderRadius}px` }}
            />
            <div className="absolute top-4 left-4 px-3 py-1 text-xs font-bold uppercase tracking-widest bg-white text-black">
              <EditableText regionKey="home.hero.tag" fallback="Featured Story" />
            </div>
          </div>
          <div className="lg:col-span-5 space-y-6 py-6">
            <EditableText
              as="h2"
              regionKey="home.hero.title"
              fallback="The Renaissance of Modern Architecture in Urban Spaces"
              className="text-5xl md:text-6xl font-black leading-[1.1] tracking-tighter block"
            />
            <EditableText
              as="p"
              regionKey="home.hero.excerpt"
              fallback="An in-depth look at how contemporary designers are reshaping the skylines of our most beloved cities, blending brutalist elements with natural ecosystems."
              className="text-lg opacity-80 leading-relaxed block"
            />
            <div className="flex items-center gap-4 pt-4 border-t" style={{ borderColor: `${theme.textColor}20` }}>
              <EditableText regionKey="home.hero.author" fallback="By Jane Doe" className="text-sm font-bold uppercase tracking-wider block" />
              <span className="opacity-30">•</span>
              <EditableText regionKey="home.hero.readtime" fallback="8 Min Read" className="text-sm opacity-60 block" />
            </div>
          </div>
        </div>
      </Section>

      {/* Article Grid */}
      <Section id="latest" bgType="secondary">
        <div className="flex items-center justify-between mb-12 border-b-2 pb-4" style={{ borderColor: theme.textColor }}>
          <EditableText as="h3" regionKey="home.grid.heading" fallback="Latest Dispatch" className="text-3xl font-black tracking-tight block" />
          <button className="text-xs font-bold uppercase tracking-widest hover:underline" style={{ color: theme.primaryColor }}>
            View All Reports
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-x-8 gap-y-16">
          {[1, 2, 3].map((item) => (
            <article key={item} className="space-y-4 group">
              <div className="overflow-hidden relative">
                <EditableImg
                  regionKey={`home.grid${item}.img`}
                  fallback={`https://images.unsplash.com/photo-1542435503-956c469947f6?q=80&w=800&auto=format&fit=crop&sig=${item}`}
                  className="w-full aspect-square object-cover transform transition-transform duration-700 group-hover:scale-105"
                  style={{ borderRadius: `${theme.borderRadius}px` }}
                />
              </div>
              <div className="space-y-2 pt-2">
                <EditableText
                  regionKey={`home.grid${item}.category`}
                  fallback={item === 1 ? "Culture" : item === 2 ? "Design" : "Technology"}
                  className="text-xs font-bold uppercase tracking-widest block"
                  style={{ color: theme.primaryColor }}
                />
                <EditableText
                  as="h4"
                  regionKey={`home.grid${item}.title`}
                  fallback="Understanding the Shift in Minimalist Aesthetics"
                  className="text-2xl font-bold leading-tight block group-hover:underline"
                />
                <EditableText
                  as="p"
                  regionKey={`home.grid${item}.excerpt`}
                  fallback="A brief exploration of why less is becoming more in the digital age."
                  className="text-sm opacity-70 leading-relaxed block"
                />
              </div>
            </article>
          ))}
        </div>
      </Section>
    </div>
  );

  const AboutView = () => (
    <Section id="about">
      <div className="max-w-4xl mx-auto space-y-12 animate-in slide-in-from-bottom-4 duration-700">
        <div className="text-center space-y-6 border-b pb-12" style={{ borderColor: `${theme.textColor}20` }}>
          <EditableText regionKey="about.kicker" fallback="The Masthead" className="text-sm font-bold uppercase tracking-widest block opacity-50" />
          <EditableText as="h1" regionKey="about.title" fallback="Truth in Design & Words." className="text-6xl font-black tracking-tighter block" />
        </div>
        
        <EditableImg
          regionKey="about.img"
          fallback="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1600&auto=format&fit=crop"
          className="w-full aspect-video object-cover shadow-lg"
          style={{ borderRadius: `${theme.borderRadius}px` }}
        />

        <div className="grid md:grid-cols-12 gap-8 pt-8">
          <div className="md:col-span-4 border-t-2 pt-4" style={{ borderColor: theme.textColor }}>
            <EditableText regionKey="about.mission.title" fallback="Our Mission" className="font-bold uppercase tracking-widest text-sm block mb-4" />
            <EditableText
              as="p"
              regionKey="about.mission.desc"
              fallback="To curate stories that matter. We dissect the intersection of life, art, and technology."
              className="text-sm opacity-80 leading-relaxed block"
            />
          </div>
          <div className="md:col-span-8 text-xl md:text-2xl leading-relaxed font-serif opacity-90 space-y-6">
            <EditableText
              as="p"
              regionKey="about.story1"
              fallback="Founded in a small studio, The Chronicle was born out of a desire for authentic, long-form journalism. We believe in taking our time to tell the whole story."
              className="block"
            />
            <EditableText
              as="p"
              regionKey="about.story2"
              fallback="Our editorial team spans the globe, bringing together diverse perspectives to challenge the status quo and deliver unparalleled insights into modern living."
              className="block"
            />
          </div>
        </div>
      </div>
    </Section>
  );

  const ContactView = () => (
    <Section id="contact" bgType="secondary">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center animate-in zoom-in-95 duration-500">
        <div className="space-y-8">
          <EditableText as="h1" regionKey="contact.title" fallback="Pitch a Story." className="text-6xl font-black tracking-tighter block leading-none" />
          <EditableText
            as="p"
            regionKey="contact.desc"
            fallback="We are always looking for fresh voices and compelling narratives. Send us your pitches, press releases, or general inquiries."
            className="text-lg opacity-70 leading-relaxed block"
          />
          <div className="space-y-6 pt-8 border-t" style={{ borderColor: `${theme.textColor}20` }}>
            <div>
              <h4 className="text-xs font-bold uppercase opacity-40 tracking-widest mb-1">Editorial Desk</h4>
              <EditableText regionKey="contact.email1" fallback="editor@thechronicle.com" className="font-bold text-lg block" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase opacity-40 tracking-widest mb-1">Press & Partnerships</h4>
              <EditableText regionKey="contact.email2" fallback="press@thechronicle.com" className="font-bold text-lg block" />
            </div>
          </div>
        </div>
        
        <div className="p-8 border-2 shadow-xl" style={{ borderColor: theme.textColor, backgroundColor: theme.backgroundColor, borderRadius: `${theme.borderRadius}px` }}>
          <h3 className="text-2xl font-black mb-6">Send a Dispatch</h3>
          <div className="space-y-5">
            <div>
              <label className="text-xs font-bold uppercase tracking-widest opacity-60 mb-2 block">Name</label>
              <input className="w-full p-3 bg-transparent border outline-none focus:ring-1" style={{ borderColor: `${theme.textColor}30` }} placeholder="Jane Doe" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest opacity-60 mb-2 block">Email</label>
              <input className="w-full p-3 bg-transparent border outline-none focus:ring-1" style={{ borderColor: `${theme.textColor}30` }} placeholder="jane@example.com" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest opacity-60 mb-2 block">Pitch / Message</label>
              <textarea className="w-full p-3 bg-transparent border outline-none focus:ring-1 h-32 resize-none" style={{ borderColor: `${theme.textColor}30` }} placeholder="Tell us your story..."></textarea>
            </div>
            <button className="w-full py-4 font-bold uppercase tracking-widest text-sm transition-transform active:scale-95 border-2" style={{ backgroundColor: theme.textColor, color: theme.backgroundColor, borderColor: theme.textColor }}>
              <EditableText regionKey="contact.submit" fallback="Submit Inquiry" />
            </button>
          </div>
        </div>
      </div>
    </Section>
  );

  return (
    <main
      className="min-h-screen selection:bg-black selection:text-white"
      style={{ fontFamily: theme.fontFamily, backgroundColor: theme.backgroundColor }}
    >
      {/* REQUIRED CLOUDINARY SCRIPT (Next/Script) */}
      <Script src="https://upload-widget.cloudinary.com/global/all.js" strategy="afterInteractive" />
      
      <Navbar />

      <div className="flex flex-col w-full min-h-[70vh]">
        {activePage === "home" && <HomeView />}
        {activePage === "about" && <AboutView />}
        {activePage === "contact" && <ContactView />}
      </div>

      <Footer />

      <style>{`
        html { scroll-behavior: smooth; }
        [contenteditable]:focus { outline: none; background: rgba(125, 125, 125, 0.1); }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-in-from-bottom-4 { from { transform: translateY(2rem); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes zoom-in-95 { from { transform: scale(0.97); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-in { animation-duration: 0.6s; animation-fill-mode: both; animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1); }
        .fade-in { animation-name: fade-in; }
        .slide-in-from-bottom-4 { animation-name: slide-in-from-bottom-4; }
        .zoom-in-95 { animation-name: zoom-in-95; }
      `}</style>
    </main>
  );
}