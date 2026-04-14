
"use client";

import React, { useState, useEffect } from "react";
import Script from "next/script";

/**
 * PRODUCTION-SAFE TEMPLATE FOR CLYRA
 * Built with internal routing, dynamic theme support, and Cloudinary integration.
 * Theme: "Resume Portfolio" (Canva-style Bento/Canvas UI)
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
  // Fallback for preview/compiler isolation if paths are not yet indexed
  useWebsiteBuilderStore = (selector: any) => selector({ updateRegion: () => {} });
  useRegionValue = () => null;
  useThemeStore = () => ({
    theme: {
      backgroundColor: "#fafafa",
      textColor: "#18181b",
      primaryColor: "#6366f1",
      secondaryColor: "#ffffff",
      borderRadius: 24,
      sectionSpacing: 60,
      fontFamily: "Inter, sans-serif",
    },
  });
}

export const template30Meta = {
  id: "business/template30",
  name: "Canva-Style Resume Portfolio",
  image: "https://images.unsplash.com/photo-1507238692062-5a04ce4befdc?q=80&w=1600&auto=format&fit=crop",
};

type TemplateProps = {
  editableData?: any;
};

const getNestedValue = (obj: any, path: string) => {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
};

export default function Template30({ editableData }: TemplateProps) {
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

  // --- LAYOUT HELPERS ---
  const Section = ({ children, id, bgType = "primary" }: any) => (
    <section
      id={id}
      style={{
        padding: `${theme.sectionSpacing}px 24px`,
        backgroundColor: bgType === "primary" ? "transparent" : theme.secondaryColor,
        color: theme.textColor,
      }}
      className="w-full flex justify-center overflow-hidden relative"
    >
      <div className="w-full max-w-6xl relative z-10">{children}</div>
    </section>
  );

  const Card = ({ children, className = "", style = {} }: any) => (
    <div
      className={`shadow-xl hover:shadow-2xl transition-shadow duration-500 overflow-hidden ${className}`}
      style={{
        backgroundColor: theme.secondaryColor,
        borderRadius: `${theme.borderRadius}px`,
        ...style,
      }}
    >
      {children}
    </div>
  );

  const Navbar = () => (
    <div className="w-full flex justify-center px-6 pt-6 z-50 absolute top-0 left-0 right-0">
      <nav
        className="w-full max-w-4xl backdrop-blur-xl shadow-lg border"
        style={{
          backgroundColor: `${theme.secondaryColor}E6`,
          borderColor: `${theme.textColor}10`,
          borderRadius: `9999px`, // Pill shape for Canva vibe
        }}
      >
        <div className="px-6 h-16 flex items-center justify-between gap-3 overflow-hidden">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <EditableImg
              regionKey="global.logo"
              fallback="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
              className="w-9 h-9 object-cover rounded-full"
            />
            <EditableText
              regionKey="global.brand"
              fallback="Alex.Design"
              className="font-bold text-lg tracking-tight whitespace-nowrap"
            />
          </div>

          <div className="hidden md:flex items-center gap-6 px-4">
            {["Home", "About", "Contact"].map((page) => (
              <button
                key={page}
                onClick={() => setActivePage(page.toLowerCase() as any)}
                className={`text-sm font-semibold transition-all ${
                  activePage === page.toLowerCase() ? "scale-105" : "opacity-60 hover:opacity-100"
                }`}
                style={{ color: activePage === page.toLowerCase() ? theme.primaryColor : theme.textColor }}
              >
                {page}
              </button>
            ))}
          </div>

          <div className="flex-shrink-0">
            <button
              onClick={() => setActivePage("contact")}
              className="px-5 py-2 font-bold text-sm transition-transform active:scale-95 shadow-md hover:shadow-lg"
              style={{
                backgroundColor: theme.primaryColor,
                color: "#fff",
                borderRadius: `9999px`,
              }}
            >
              <EditableText regionKey="global.navCta" fallback="Hire Me" />
            </button>
          </div>
        </div>
      </nav>
    </div>
  );

  const Footer = () => (
    <footer
      className="py-12 px-6 mt-12"
      style={{
        backgroundColor: theme.backgroundColor,
        color: theme.textColor,
      }}
    >
      <div className="max-w-6xl mx-auto flex flex-col items-center justify-center text-center gap-6">
        <div className="flex items-center gap-3">
          <EditableImg
            regionKey="global.logo"
            fallback="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
            className="w-10 h-10 object-cover rounded-full filter grayscale opacity-80"
          />
        </div>
        <EditableText
          as="h3"
          regionKey="footer.tagline"
          fallback="Let's build something beautiful together."
          className="text-xl font-medium opacity-80"
        />
        <div className="flex gap-6 mt-4">
          {["Home", "About", "Contact"].map((p) => (
            <button
              key={p}
              onClick={() => setActivePage(p.toLowerCase() as any)}
              className="text-sm font-bold opacity-60 hover:opacity-100 transition-opacity"
            >
              {p}
            </button>
          ))}
        </div>
        <EditableText
          regionKey="footer.copy"
          fallback="© 2026 Alex Design Portfolio. All rights reserved."
          className="text-xs opacity-40 mt-8 block"
        />
      </div>
    </footer>
  );

  // --- PAGE VIEWS ---

  const HomeView = () => (
    <div className="animate-in fade-in duration-700 pt-32">
      <Section id="home">
        {/* Bento Box Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[minmax(180px,auto)]">
          
          {/* Main Hero Card */}
          <Card className="md:col-span-8 md:row-span-2 p-8 lg:p-12 flex flex-col justify-center relative overflow-hidden group">
            {/* Abstract Canva-like background blob */}
            <div 
              className="absolute top-0 right-0 w-64 h-64 opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 transition-transform duration-700 group-hover:scale-150"
              style={{ backgroundColor: theme.primaryColor }}
            />
            <EditableText
              as="span"
              regionKey="home.hero.greeting"
              fallback="👋 Hello, I'm"
              className="text-lg font-semibold tracking-wide uppercase opacity-70 mb-2 block"
              style={{ color: theme.primaryColor }}
            />
            <EditableText
              as="h1"
              regionKey="home.hero.title"
              fallback="Alex Morgan"
              className="text-6xl md:text-8xl font-black leading-none tracking-tighter mb-4 z-10 relative"
            />
            <EditableText
              as="h2"
              regionKey="home.hero.subtitle"
              fallback="Product Designer & UX Engineer"
              className="text-2xl md:text-3xl font-light opacity-80 mb-8 z-10 relative"
            />
            <div className="z-10 relative mt-auto">
              <button
                onClick={() => setActivePage("about")}
                className="px-8 py-4 font-bold text-sm transition-transform active:scale-95 shadow-lg"
                style={{
                  backgroundColor: theme.textColor,
                  color: theme.backgroundColor,
                  borderRadius: `9999px`,
                }}
              >
                <EditableText regionKey="home.hero.btn" fallback="View My Journey" />
              </button>
            </div>
          </Card>

          {/* Profile Photo Card */}
          <Card className="md:col-span-4 md:row-span-2 p-2 relative group cursor-pointer">
             <EditableImg
                regionKey="home.profile.img"
                fallback="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1000&fit=crop"
                className="w-full h-full min-h-[300px] md:min-h-full object-cover"
                style={{ borderRadius: `${theme.borderRadius - 8}px` }}
              />
              {/* Canva style floating badge */}
              <div 
                className="absolute bottom-6 left-6 right-6 backdrop-blur-md p-4 flex items-center justify-between border"
                style={{ 
                  backgroundColor: `${theme.secondaryColor}CC`, 
                  borderRadius: `${theme.borderRadius - 8}px`,
                  borderColor: `${theme.textColor}15`
                }}
              >
                <div className="flex flex-col">
                  <EditableText regionKey="home.profile.badgeTitle" fallback="Experience" className="text-xs font-bold uppercase opacity-60" />
                  <EditableText regionKey="home.profile.badgeValue" fallback="8+ Years" className="text-lg font-black" />
                </div>
                <div 
                  className="w-10 h-10 flex items-center justify-center text-white"
                  style={{ backgroundColor: theme.primaryColor, borderRadius: '50%' }}
                >
                  ✦
                </div>
              </div>
          </Card>

          {/* Skills Bento Box */}
          <Card className="md:col-span-4 p-8 flex flex-col justify-center">
             <EditableText as="h3" regionKey="home.skills.title" fallback="Core Toolbox" className="text-xl font-bold mb-4" />
             <div className="flex flex-wrap gap-2">
                {["Figma", "React", "TypeScript", "Framer", "CSS"].map((skill, i) => (
                  <span 
                    key={i} 
                    className="px-3 py-1.5 text-xs font-bold tracking-wider rounded-full border"
                    style={{ borderColor: `${theme.textColor}20`, color: theme.textColor }}
                  >
                    {skill}
                  </span>
                ))}
             </div>
          </Card>

          {/* Stat Box */}
          <Card className="md:col-span-4 p-8 flex flex-col justify-center text-center" style={{ backgroundColor: theme.primaryColor, color: '#fff' }}>
             <EditableText as="h2" regionKey="home.stat.number" fallback="150+" className="text-5xl font-black mb-2" />
             <EditableText as="p" regionKey="home.stat.desc" fallback="Projects Delivered Worldwide" className="text-sm font-medium opacity-80" />
          </Card>

          {/* Philosophy / Quote Box */}
          <Card className="md:col-span-4 p-8 flex flex-col justify-center relative overflow-hidden">
             <div className="text-6xl absolute top-4 left-4 opacity-10 font-serif">"</div>
             <EditableText 
               as="p" 
               regionKey="home.quote.text" 
               fallback="Design is not just what it looks like and feels like. Design is how it works." 
               className="text-lg font-medium italic relative z-10 leading-relaxed" 
             />
             <EditableText 
               as="p" 
               regionKey="home.quote.author" 
               fallback="— Steve Jobs" 
               className="text-sm font-bold opacity-50 mt-4 relative z-10" 
             />
          </Card>
        </div>
      </Section>
    </div>
  );

  const AboutView = () => (
    <div className="animate-in slide-in-from-bottom-4 duration-700 pt-32">
      <Section id="about">
        <div className="flex flex-col gap-12">
          {/* Header Canvas Area */}
          <div className="w-full flex flex-col lg:flex-row gap-8 items-center">
            <div className="flex-1 space-y-6">
              <div 
                className="inline-block px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded-full"
                style={{ backgroundColor: `${theme.primaryColor}20`, color: theme.primaryColor }}
              >
                <EditableText regionKey="about.tag" fallback="My Story" />
              </div>
              <EditableText
                as="h1"
                regionKey="about.title"
                fallback="Crafting Digital Experiences That Matter."
                className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tight block"
              />
              <EditableText
                as="p"
                regionKey="about.desc"
                fallback="I bridge the gap between aesthetics and engineering. Over the past decade, I've worked with global brands to transform complex problems into elegant, user-centric solutions. My canvas is the screen, and my medium is code."
                className="text-xl opacity-70 leading-relaxed max-w-2xl block"
              />
            </div>
            <div className="flex-1 w-full relative">
              <Card className="w-full p-2 rotate-2 hover:rotate-0 transition-transform duration-500">
                 <EditableImg
                  regionKey="about.img"
                  fallback="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1600&auto=format&fit=crop"
                  className="w-full aspect-[4/3] object-cover"
                  style={{ borderRadius: `${theme.borderRadius - 8}px` }}
                />
              </Card>
              {/* Decorative overlapping Canva element */}
              <Card 
                className="absolute -bottom-8 -left-8 p-6 w-48 -rotate-6 shadow-2xl backdrop-blur-xl border"
                style={{ borderColor: `${theme.textColor}10`, backgroundColor: `${theme.secondaryColor}E6` }}
              >
                 <EditableText as="p" regionKey="about.sticker" fallback="Certified Expert 2026" className="text-sm font-black text-center" />
              </Card>
            </div>
          </div>

          {/* Timeline / Experience Bento */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <Card key={item} className="p-8 flex gap-6 items-start">
                <div 
                  className="w-12 h-12 flex-shrink-0 flex items-center justify-center text-xl font-bold"
                  style={{ backgroundColor: `${theme.primaryColor}15`, color: theme.primaryColor, borderRadius: '50%' }}
                >
                  {item}
                </div>
                <div>
                  <EditableText as="h3" regionKey={`about.exp${item}.role`} fallback={item === 1 ? "Lead Designer" : "Senior Developer"} className="text-xl font-bold block mb-1" />
                  <EditableText as="p" regionKey={`about.exp${item}.company`} fallback={item === 1 ? "Creative Agency Inc." : "Tech Startup"} className="text-sm opacity-60 font-semibold block mb-3 uppercase tracking-wide" />
                  <EditableText as="p" regionKey={`about.exp${item}.desc`} fallback="Spearheaded the redesign of core enterprise products, improving user retention by 40%." className="text-base opacity-80 leading-relaxed block" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Section>
    </div>
  );

  const ContactView = () => (
    <div className="animate-in zoom-in-95 duration-500 pt-32 pb-20 flex items-center justify-center min-h-[80vh]">
      <Section id="contact">
        <div className="max-w-4xl mx-auto w-full relative">
           {/* Decorative Background Canvas blobs */}
           <div 
              className="absolute top-0 left-0 w-96 h-96 opacity-20 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/4 pointer-events-none"
              style={{ backgroundColor: theme.primaryColor }}
            />
            <div 
              className="absolute bottom-0 right-0 w-96 h-96 opacity-10 rounded-full blur-3xl translate-y-1/2 translate-x-1/4 pointer-events-none"
              style={{ backgroundColor: theme.textColor }}
            />

          <Card className="w-full p-10 md:p-16 relative z-10 backdrop-blur-2xl border" style={{ borderColor: `${theme.textColor}10`, backgroundColor: `${theme.secondaryColor}F2` }}>
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div>
                  <EditableText as="h1" regionKey="contact.title" fallback="Let's Talk." className="text-5xl md:text-7xl font-black tracking-tighter block mb-4" />
                  <EditableText as="p" regionKey="contact.subtitle" fallback="Open for freelance opportunities, consulting, and exciting collaborations." className="text-lg opacity-70 block" />
                </div>
                
                <div className="space-y-6">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold uppercase opacity-40 tracking-widest mb-1">Email Me</span>
                    <EditableText as="span" regionKey="contact.email" fallback="hello@alex.design" className="text-xl font-bold" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold uppercase opacity-40 tracking-widest mb-1">Based In</span>
                    <EditableText as="span" regionKey="contact.location" fallback="San Francisco, CA" className="text-xl font-bold" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <input 
                  type="text" 
                  placeholder="Your Name" 
                  className="w-full p-5 bg-transparent border-b outline-none font-medium text-lg transition-colors focus:border-opacity-100" 
                  style={{ borderColor: `${theme.textColor}30`, color: theme.textColor }} 
                />
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  className="w-full p-5 bg-transparent border-b outline-none font-medium text-lg transition-colors focus:border-opacity-100" 
                  style={{ borderColor: `${theme.textColor}30`, color: theme.textColor }} 
                />
                <textarea 
                  placeholder="Tell me about your project" 
                  rows={4}
                  className="w-full p-5 bg-transparent border-b outline-none font-medium text-lg transition-colors focus:border-opacity-100 resize-none" 
                  style={{ borderColor: `${theme.textColor}30`, color: theme.textColor }} 
                />
                <button 
                  className="w-full py-5 mt-4 font-black uppercase tracking-widest text-sm transition-transform active:scale-95 shadow-xl" 
                  style={{ backgroundColor: theme.primaryColor, color: "#fff", borderRadius: `9999px` }}
                >
                  <EditableText regionKey="contact.submit" fallback="Send Message" />
                </button>
              </div>
            </div>
          </Card>
        </div>
      </Section>
    </div>
  );

  return (
    <main
      className="min-h-screen selection:bg-blue-500 selection:text-white relative overflow-hidden"
      style={{ fontFamily: theme.fontFamily, backgroundColor: theme.backgroundColor }}
    >
      <Script 
        src="https://upload-widget.cloudinary.com/global/all.js" 
        strategy="afterInteractive" 
      />
      
      <Navbar />

      <div className="flex flex-col w-full relative z-10">
        {activePage === "home" && <HomeView />}
        {activePage === "about" && <AboutView />}
        {activePage === "contact" && <ContactView />}
      </div>

      <Footer />

      <style>{`
        html { scroll-behavior: smooth; }
        [contenteditable]:focus { outline: none; background: rgba(125, 125, 125, 0.05); }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-in-from-bottom-4 { from { transform: translateY(2rem); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes zoom-in-95 { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-in { animation-duration: 0.6s; animation-fill-mode: both; animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1); }
        .fade-in { animation-name: fade-in; }
        .slide-in-from-bottom-4 { animation-name: slide-in-from-bottom-4; }
        .zoom-in-95 { animation-name: zoom-in-95; }
      `}</style>
    </main>
  );
}