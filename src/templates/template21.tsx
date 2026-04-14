"use client";

import React, { useState, useCallback } from "react";
import Script from "next/script";
import {
  useWebsiteBuilderStore,
  useRegionValue,
} from "@/store/useWebsiteBuilderStore";
import { useThemeStore } from "@/store/useThemeStore";

type TemplateProps = {
  editableData?: any;
};

export const template21Meta = {
  id: "business/template21",
  name: "AI Product Generator",
  image:
    "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1600&auto=format&fit=crop",
};

const getNestedValue = (obj: any, path: string) => {
  if (!obj) return undefined;
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
};

export default function Template21({ editableData }: TemplateProps) {
  const [activePage, setActivePage] = useState<"home" | "about" | "contact">("home");
  const { theme } = useThemeStore();
  const updateRegion = useWebsiteBuilderStore((state: any) => state.updateRegion);

  const handleImageUpload = useCallback(
    (regionKey: string) => {
      if (typeof window !== "undefined" && (window as any).cloudinary) {
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

        if (!cloudName || !uploadPreset) {
          console.warn("Cloudinary environment variables missing.");
          return;
        }

        (window as any).cloudinary
          .createUploadWidget(
            {
              cloudName,
              uploadPreset,
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
        className={`outline-none focus:ring-2 focus:ring-blue-400/50 rounded transition-all cursor-text ${className}`}
        style={style}
      >
        {content}
      </Tag>
    );
  };

  const EditableImg = ({ regionKey, fallback, className = "", alt = "Image", style = {} }: any) => {
    const hookValue = useRegionValue(regionKey);
    const dataValue = getNestedValue(editableData, regionKey);
    const src = hookValue ?? dataValue ?? fallback;

    return (
      <img
        src={src}
        alt={alt}
        className={`cursor-pointer hover:opacity-90 transition-opacity duration-300 ${className}`}
        style={style}
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
        padding: `${theme.sectionSpacing}px 0`,
        backgroundColor: bgType === "primary" ? theme.backgroundColor : theme.secondaryColor,
        color: theme.textColor,
      }}
      className={`w-full flex justify-center overflow-hidden min-w-0 ${className}`}
    >
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 min-w-0">{children}</div>
    </section>
  );

  const Navbar = () => (
    <nav
      className="sticky top-0 w-full z-50 backdrop-blur-xl border-b transition-all duration-300"
      style={{
        backgroundColor: `${theme.backgroundColor}E6`,
        borderColor: `${theme.textColor}10`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <EditableImg
            regionKey="global.logo"
            fallback="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=100&h=100&fit=crop"
            className="w-10 h-10 object-cover shadow-sm"
            style={{ borderRadius: `${theme.borderRadius}px` }}
          />
          <EditableText
            regionKey="global.brand"
            fallback="Nova AI"
            className="font-extrabold text-2xl tracking-tight truncate bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
          />
        </div>

        <div className="hidden md:flex items-center gap-8 px-4">
          {["Home", "About", "Contact"].map((page) => (
            <button
              key={page}
              onClick={() => setActivePage(page.toLowerCase() as any)}
              className={`text-sm font-semibold transition-all relative ${
                activePage === page.toLowerCase() ? "opacity-100" : "opacity-60 hover:opacity-100"
              }`}
              style={{ color: theme.textColor }}
            >
              {page}
              {activePage === page.toLowerCase() && (
                <span 
                  className="absolute -bottom-2 left-0 w-full h-0.5 rounded-full"
                  style={{ backgroundColor: theme.primaryColor }}
                />
              )}
            </button>
          ))}
        </div>

        <div className="flex-shrink-0">
          <button
            className="px-6 py-2.5 font-bold text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            style={{
              backgroundColor: theme.primaryColor,
              color: "#ffffff",
              borderRadius: `${theme.borderRadius}px`,
            }}
          >
            <EditableText regionKey="global.navCta" fallback="Start Generating" />
          </button>
        </div>
      </div>
    </nav>
  );

  const HomeView = () => (
    <div className="animate-in fade-in duration-700 w-full">
      <Section id="hero" className="relative">
        {/* Decorative background blobs for Canva-like aesthetic */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-purple-500/20 to-blue-500/20 rounded-full blur-3xl opacity-50 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto space-y-8 mt-10">
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-md shadow-sm border"
            style={{ borderRadius: '100px', borderColor: `${theme.textColor}10` }}
          >
            <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
            <EditableText
              as="span"
              regionKey="hero.badge"
              fallback="Nova AI 2.0 is now live"
              className="text-xs font-bold tracking-wide uppercase"
            />
          </div>

          <EditableText
            as="h1"
            regionKey="hero.title"
            fallback="Design beautiful assets with the power of AI"
            className="text-5xl sm:text-6xl md:text-7xl font-black leading-tight tracking-tighter"
          />
          
          <EditableText
            as="p"
            regionKey="hero.subtitle"
            fallback="Generate high-quality images, UI components, and brand assets in seconds. No design skills required. Just type and create."
            className="text-lg sm:text-xl opacity-70 leading-relaxed max-w-2xl"
          />
          
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            <button
              className="px-8 py-4 font-bold text-base shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto"
              style={{ backgroundColor: theme.primaryColor, color: "#fff", borderRadius: `${theme.borderRadius}px` }}
            >
              <EditableText regionKey="hero.ctaPrimary" fallback="Try for free" />
            </button>
            <button
              className="px-8 py-4 font-bold text-base border hover:bg-black/5 transition-all duration-300 w-full sm:w-auto"
              style={{ borderColor: `${theme.textColor}20`, color: theme.textColor, borderRadius: `${theme.borderRadius}px` }}
            >
              <EditableText regionKey="hero.ctaSecondary" fallback="View Gallery" />
            </button>
          </div>
        </div>

        <div className="mt-20 relative z-10 perspective-1000">
          <EditableImg
            regionKey="hero.dashboardImage"
            fallback="https://images.unsplash.com/photo-1664575602276-acd073f104c1?q=80&w=2000&auto=format&fit=crop"
            className="w-full h-auto object-cover shadow-[0_20px_50px_rgb(0,0,0,0.15)] transform rotate-x-12 hover:rotate-x-0 transition-transform duration-700 ease-out"
            style={{ borderRadius: `${theme.borderRadius * 2}px` }}
          />
        </div>
      </Section>

      <Section id="features" bgType="secondary">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <EditableText as="h2" regionKey="features.title" fallback="Everything you need to create" className="text-4xl md:text-5xl font-black tracking-tight block" />
          <EditableText as="p" regionKey="features.subtitle" fallback="Powerful tools wrapped in a beautiful, intuitive interface." className="text-lg opacity-70 block" />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((num) => (
            <div 
              key={num} 
              className="p-8 bg-white shadow-xl hover:shadow-2xl transition-all duration-300 group"
              style={{ borderRadius: `${theme.borderRadius * 1.5}px`, backgroundColor: theme.backgroundColor }}
            >
              <div 
                className="w-14 h-14 mb-6 flex items-center justify-center bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform duration-300"
                style={{ borderRadius: `${theme.borderRadius}px` }}
              >
                <EditableText regionKey={`features.icon${num}`} fallback={num === 1 ? "✨" : num === 2 ? "⚡" : "🎨"} className="text-2xl" />
              </div>
              <EditableText as="h3" regionKey={`features.card${num}.title`} fallback={`AI Feature ${num}`} className="text-xl font-bold mb-3 block" />
              <EditableText as="p" regionKey={`features.card${num}.desc`} fallback="Generate variations instantly with text prompts. Edit specific areas using natural language." className="opacity-70 leading-relaxed block" />
            </div>
          ))}
        </div>
      </Section>
    </div>
  );

  const AboutView = () => (
    <div className="animate-in slide-in-from-bottom-4 duration-700 w-full">
      <Section id="about">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
             <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-[3rem] blur-lg opacity-30"></div>
             <EditableImg
              regionKey="about.img"
              fallback="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1000&fit=crop"
              className="relative w-full aspect-square object-cover shadow-2xl"
              style={{ borderRadius: `${theme.borderRadius * 2}px` }}
            />
          </div>
          <div className="space-y-8">
            <div className="space-y-4">
              <EditableText as="h4" regionKey="about.tag" fallback="THE ENGINE" className="text-sm font-black uppercase tracking-widest text-blue-600 block" />
              <EditableText as="h2" regionKey="about.title" fallback="Built for creators, powered by next-gen AI" className="text-4xl md:text-5xl font-black tracking-tight leading-tight block" />
            </div>
            <EditableText
              as="p"
              regionKey="about.desc1"
              fallback="Our proprietary diffusion model understands context, lighting, and composition better than ever before. We trained it specifically on high-quality design assets to ensure every output is production-ready."
              className="text-lg opacity-70 leading-relaxed block"
            />
            <EditableText
              as="p"
              regionKey="about.desc2"
              fallback="Forget complex prompt engineering. Our intuitive UI lets you drag, drop, and edit with simple sliders and tools, while the AI handles the heavy lifting in the background."
              className="text-lg opacity-70 leading-relaxed block"
            />
            <div className="grid grid-cols-2 gap-6 pt-6 border-t" style={{ borderColor: `${theme.textColor}10` }}>
               <div>
                 <EditableText as="h3" regionKey="about.stat1.val" fallback="10M+" className="text-4xl font-black block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600" />
                 <EditableText as="p" regionKey="about.stat1.label" fallback="Assets Generated" className="text-sm font-bold uppercase opacity-50 mt-2 block" />
               </div>
               <div>
                 <EditableText as="h3" regionKey="about.stat2.val" fallback="99.9%" className="text-4xl font-black block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600" />
                 <EditableText as="p" regionKey="about.stat2.label" fallback="Uptime" className="text-sm font-bold uppercase opacity-50 mt-2 block" />
               </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );

  const ContactView = () => (
    <div className="animate-in zoom-in-95 duration-500 w-full">
      <Section id="contact" className="min-h-[80vh] flex items-center">
        <div className="w-full max-w-5xl mx-auto">
          <div 
            className="grid lg:grid-cols-5 gap-0 overflow-hidden shadow-2xl border"
            style={{ borderRadius: `${theme.borderRadius * 2}px`, backgroundColor: theme.backgroundColor, borderColor: `${theme.textColor}10` }}
          >
            <div 
              className="lg:col-span-2 p-12 text-white relative overflow-hidden flex flex-col justify-between"
              style={{ backgroundColor: theme.primaryColor }}
            >
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white opacity-10 blur-2xl"></div>
              <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-black opacity-10 blur-2xl"></div>
              
              <div className="relative z-10 space-y-6">
                <EditableText as="h2" regionKey="contact.title" fallback="Get in touch" className="text-4xl font-black tracking-tight block" />
                <EditableText as="p" regionKey="contact.subtitle" fallback="Have questions about Enterprise plans or API access? Our team is here to help." className="opacity-80 text-lg leading-relaxed block" />
              </div>

              <div className="relative z-10 space-y-6 mt-12">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">✉️</div>
                  <EditableText regionKey="contact.email" fallback="hello@nova-ai.com" className="font-semibold text-lg" />
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">📍</div>
                  <EditableText regionKey="contact.location" fallback="San Francisco, CA" className="font-semibold text-lg" />
                </div>
              </div>
            </div>

            <div className="lg:col-span-3 p-12 lg:p-16 space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold opacity-70">First Name</label>
                  <input 
                    placeholder="Jane" 
                    className="w-full px-4 py-3 bg-black/5 border-none outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    style={{ borderRadius: `${theme.borderRadius}px`, color: theme.textColor }} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold opacity-70">Last Name</label>
                  <input 
                    placeholder="Doe" 
                    className="w-full px-4 py-3 bg-black/5 border-none outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    style={{ borderRadius: `${theme.borderRadius}px`, color: theme.textColor }} 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold opacity-70">Work Email</label>
                <input 
                  placeholder="jane@company.com" 
                  className="w-full px-4 py-3 bg-black/5 border-none outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  style={{ borderRadius: `${theme.borderRadius}px`, color: theme.textColor }} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold opacity-70">How can we help?</label>
                <textarea 
                  placeholder="Tell us about your project..." 
                  rows={4}
                  className="w-full px-4 py-3 bg-black/5 border-none outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                  style={{ borderRadius: `${theme.borderRadius}px`, color: theme.textColor }} 
                />
              </div>
              <button 
                className="w-full py-4 font-bold text-base shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300" 
                style={{ backgroundColor: theme.primaryColor, color: "#fff", borderRadius: `${theme.borderRadius}px` }}
              >
                <EditableText regionKey="contact.submitBtn" fallback="Send Message" />
              </button>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );

  const Footer = () => (
    <footer
      className="py-12 px-6 border-t mt-auto"
      style={{
        backgroundColor: theme.backgroundColor,
        color: theme.textColor,
        borderColor: `${theme.textColor}10`,
      }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3">
          <EditableImg
            regionKey="global.logo"
            fallback="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=100&h=100&fit=crop"
            className="w-8 h-8 rounded-lg shadow-sm"
          />
          <EditableText regionKey="global.brand" fallback="Nova AI" className="font-bold text-xl tracking-tight" />
        </div>
        
        <div className="flex flex-wrap justify-center gap-6 opacity-70 text-sm font-semibold">
          {["Privacy Policy", "Terms of Service", "Twitter", "Discord"].map((link) => (
            <button key={link} className="hover:opacity-100 hover:text-blue-500 transition-colors">{link}</button>
          ))}
        </div>

        <EditableText 
          regionKey="footer.copyright" 
          fallback="© 2024 Nova AI Inc. All rights reserved." 
          className="text-sm opacity-50 font-medium" 
        />
      </div>
    </footer>
  );

  return (
    <main
      className="min-h-screen flex flex-col selection:bg-blue-500/30 w-full overflow-x-hidden"
      style={{ fontFamily: theme.fontFamily, backgroundColor: theme.backgroundColor }}
    >
      <Script
        src="https://upload-widget.cloudinary.com/global/all.js"
        strategy="afterInteractive"
      />

      <Navbar />

      <div className="flex-grow flex flex-col w-full">
        {activePage === "home" && <HomeView />}
        {activePage === "about" && <AboutView />}
        {activePage === "contact" && <ContactView />}
      </div>

      <Footer />

      <style dangerouslySetInnerHTML={{ __html: `
        html, body { 
          scroll-behavior: smooth; 
          overflow-x: hidden;
          width: 100%;
        }
        @keyframes fade-in { 
          from { opacity: 0; } 
          to { opacity: 1; } 
        }
        @keyframes slide-in-from-bottom-4 { 
          from { transform: translateY(2rem); opacity: 0; } 
          to { transform: translateY(0); opacity: 1; } 
        }
        @keyframes zoom-in-95 { 
          from { transform: scale(0.95); opacity: 0; } 
          to { transform: scale(1); opacity: 1; } 
        }
        .animate-in { 
          animation-duration: 0.6s; 
          animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
          animation-fill-mode: both; 
        }
        .fade-in { animation-name: fade-in; }
        .slide-in-from-bottom-4 { animation-name: slide-in-from-bottom-4; }
        .zoom-in-95 { animation-name: zoom-in-95; }
        
        /* Utility for Canva-like 3D card tilt effect fallback */
        .perspective-1000 { perspective: 1000px; }
        .rotate-x-12 { transform: rotateX(12deg) rotateY(-5deg); }
        .hover\\:rotate-x-0:hover { transform: rotateX(0deg) rotateY(0deg); }
      `}} />
    </main>
  );
}