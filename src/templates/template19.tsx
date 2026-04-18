"use client";

import React, { useState, useCallback } from "react";
import Script from "next/script";
import {
  useWebsiteBuilderStore,
  useRegionValue,
} from "@/store/useWebsiteBuilderStore";
import { useThemeStore } from "@/store/useThemeStore";

export const template19Meta = {
  id: "business/template19",
  name: "Event Planner Luxe",
  image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1600&auto=format&fit=crop",
};

type TemplateProps = {
  editableData?: any;
};

const getNestedValue = (obj: any, path: string) => {
  if (!obj) return undefined;
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
};

export default function Template19({ editableData }: TemplateProps) {
  const [activePage, setActivePage] = useState<"home" | "about" | "contact">("home");
  const updateRegion = useWebsiteBuilderStore((state: any) => state.updateRegion);
  const { theme } = useThemeStore();

  const handleImageUpload = useCallback((regionKey: string) => {
    if (typeof window !== "undefined" && (window as any).cloudinary) {
      const activeRegionKey = regionKey;
      (window as any).__clyraweb_active_upload_region = activeRegionKey;
      (window as any).__clyraweb_update_region = updateRegion;

      if (!(window as any).__cloudinaryWidget) {
        (window as any).__cloudinaryWidget = (window as any).cloudinary.createUploadWidget(
          {
            cloudName: (process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME && process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET) ? process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME : "demo",
            uploadPreset: (process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME && process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET) ? process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET : "docs_upload_example_us_preset",
            multiple: false,
            clientAllowedFormats: ["jpg", "jpeg", "png", "webp", "gif", "svg"],
            maxImageFileSize: 5000000,
          },
          (error: any, result: any) => {
            if (!error && result && result.event === "success") {
              const activeRegion = (window as any).__clyraweb_active_upload_region;
              const updateFn = (window as any).__clyraweb_update_region;
              if (activeRegion && updateFn) {
                updateFn(activeRegion, result.info.secure_url);
              }
            }
          }
        );
      }
      (window as any).__cloudinaryWidget.open();
    }
  }, [updateRegion]);


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

  const EditableImg = ({ regionKey, fallback, className = "", alt = "image", style = {} }: any) => {
    const hookValue = useRegionValue(regionKey);
    const dataValue = getNestedValue(editableData, regionKey);
    const src = hookValue ?? dataValue ?? fallback;

    return (
      <img
        src={src}
        alt={alt}
        style={style}
        className={`cursor-pointer transition-transform hover:scale-[1.01] ${className}`}
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
      className={`w-full flex justify-center overflow-hidden px-4 sm:px-6 lg:px-8 ${className}`}
    >
      <div className="w-full max-w-7xl min-w-0">{children}</div>
    </section>
  );

  const Navbar = () => (
    <nav
      className="sticky top-0 w-full z-40 backdrop-blur-xl shadow-sm px-4 sm:px-6 lg:px-8"
      style={{
        backgroundColor: `${theme.backgroundColor}F2`,
        borderBottom: `1px solid ${theme.textColor}10`,
      }}
    >
      <div className="max-w-7xl mx-auto h-24 flex items-center justify-between gap-4 overflow-hidden">
        <div className="flex items-center gap-4 min-w-0">
          <EditableImg
            regionKey="global.logo"
            fallback="https://images.unsplash.com/photo-1606836591695-4d58a73eba1e?w=150&h=150&fit=crop"
            className="w-12 h-12 object-cover"
            style={{ borderRadius: `${theme.borderRadius}px` }}
          />
          <EditableText
            regionKey="global.brand"
            fallback="AURA EVENTS"
            className="font-bold text-2xl tracking-[0.15em] whitespace-nowrap uppercase"
          />
        </div>

        <div className="hidden md:flex items-center gap-10">
          {["Home", "About", "Contact"].map((page) => (
            <button
              key={page}
              onClick={() => setActivePage(page.toLowerCase() as any)}
              className="text-sm font-medium transition-all uppercase tracking-widest relative group"
              style={{
                color: activePage === page.toLowerCase() ? theme.primaryColor : theme.textColor,
                opacity: activePage === page.toLowerCase() ? 1 : 0.6,
              }}
            >
              {page}
              <span
                className={`absolute -bottom-2 left-0 w-full h-[2px] transition-transform origin-left ${activePage === page.toLowerCase() ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                style={{ backgroundColor: theme.primaryColor }}
              />
            </button>
          ))}
        </div>

        <div className="flex-shrink-0">
          <button
            onClick={() => setActivePage("contact")}
            className="px-8 py-3.5 font-bold text-xs uppercase tracking-[0.2em] transition-transform hover:-translate-y-1 shadow-lg"
            style={{
              backgroundColor: theme.primaryColor,
              color: "#ffffff",
              borderRadius: `${theme.borderRadius}px`,
            }}
          >
            <EditableText regionKey="global.navCta" fallback="PLAN WITH US" />
          </button>
        </div>
      </div>
    </nav>
  );

  const HomeView = () => (
    <div className="animate-in fade-in duration-700 w-full max-w-full overflow-hidden">
      <Section id="hero" bgType="primary" className="!pt-8">
        <div
          className="relative w-full aspect-[4/3] md:aspect-[21/9] overflow-hidden group"
          style={{ borderRadius: `${theme.borderRadius * 2}px` }}
        >
          <EditableImg
            regionKey="hero.bg"
            fallback="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=2000&auto=format&fit=crop"
            className="w-full h-full object-cover transition-transform duration-[20s] group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center p-6 sm:p-12">
            <div
              className="bg-white/90 backdrop-blur-md p-8 sm:p-16 text-center max-w-4xl w-full mx-4 shadow-2xl"
              style={{
                borderRadius: `${theme.borderRadius * 1.5}px`,
                color: theme.textColor
              }}
            >
              <EditableText
                as="span"
                regionKey="hero.tagline"
                fallback="CURATED EXPERIENCES"
                className="text-xs sm:text-sm tracking-[0.4em] uppercase mb-6 block font-semibold opacity-70"
                style={{ color: theme.primaryColor }}
              />
              <EditableText
                as="h1"
                regionKey="hero.title"
                fallback="Moments Styled to Perfection."
                className="text-4xl sm:text-5xl md:text-7xl font-light leading-[1.1] tracking-tight block mb-8"
              />
              <EditableText
                as="p"
                regionKey="hero.subtitle"
                fallback="From intimate gatherings to grand celebrations, we design aesthetic, unforgettable events tailored entirely to your vision."
                className="text-base sm:text-lg opacity-80 leading-relaxed block max-w-2xl mx-auto mb-10"
              />
              <button
                onClick={() => setActivePage("about")}
                className="px-10 py-4 font-bold text-sm uppercase tracking-[0.2em] transition-all hover:bg-black hover:text-white border-2"
                style={{
                  borderColor: theme.primaryColor,
                  color: theme.primaryColor,
                  borderRadius: `${theme.borderRadius}px`,
                }}
              >
                <EditableText regionKey="hero.btn" fallback="DISCOVER OUR MAGIC" />
              </button>
            </div>
          </div>
        </div>
      </Section>

      <Section id="services" bgType="secondary">
        <div className="text-center mb-16 sm:mb-24">
          <EditableText
            as="h2"
            regionKey="services.title"
            fallback="Our Services"
            className="text-3xl sm:text-5xl font-light tracking-tight block mb-6"
          />
          <div className="w-20 h-1 mx-auto" style={{ backgroundColor: theme.primaryColor }} />
        </div>

        <div className="grid md:grid-cols-3 gap-8 sm:gap-12">
          {[1, 2, 3].map((num) => (
            <div
              key={num}
              className="flex flex-col gap-6 bg-white p-6 shadow-sm hover:shadow-xl transition-shadow"
              style={{ borderRadius: `${theme.borderRadius}px` }}
            >
              <div className="w-full aspect-[4/5] overflow-hidden relative" style={{ borderRadius: `${theme.borderRadius}px` }}>
                <EditableImg
                  regionKey={`services.img${num}`}
                  fallback={
                    num === 1 ? "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&fit=crop" :
                      num === 2 ? "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&fit=crop" :
                        "https://images.unsplash.com/photo-1530103862676-de8892ebe6f9?w=800&fit=crop"
                  }
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center">
                <EditableText
                  as="h3"
                  regionKey={`services.title${num}`}
                  fallback={num === 1 ? "Weddings" : num === 2 ? "Corporate" : "Social Soirées"}
                  className="text-xl font-medium tracking-wide uppercase block mb-3"
                />
                <EditableText
                  as="p"
                  regionKey={`services.desc${num}`}
                  fallback="Comprehensive planning and striking aesthetics for your most important days."
                  className="text-sm opacity-70 leading-relaxed block"
                />
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );

  const AboutView = () => (
    <Section id="about" className="animate-in slide-in-from-bottom-8 duration-700">
      <div className="grid lg:grid-cols-12 gap-12 lg:gap-24 items-center">
        <div className="lg:col-span-5 space-y-8 order-2 lg:order-1">
          <EditableText
            as="span"
            regionKey="about.tag"
            fallback="THE VISIONARY"
            className="text-xs font-bold uppercase tracking-[0.3em] opacity-60 block"
            style={{ color: theme.primaryColor }}
          />
          <EditableText
            as="h2"
            regionKey="about.title"
            fallback="Designing Dreams with Precision."
            className="text-4xl sm:text-6xl font-light leading-[1.1] tracking-tight block"
          />
          <EditableText
            as="p"
            regionKey="about.desc1"
            fallback="Aura Events was founded on a simple principle: every gathering should tell a story. We blend structural organization with boundless creativity to orchestrate events that feel effortless yet profoundly impactful."
            className="text-lg opacity-80 leading-relaxed block"
          />
          <EditableText
            as="p"
            regionKey="about.desc2"
            fallback="Our approach is deeply collaborative. We listen to the unspoken aesthetics you desire and translate them into physical spaces, ensuring that the ambiance, the florals, and the rhythm of the event are undeniably yours."
            className="text-lg opacity-80 leading-relaxed block"
          />
          <div className="pt-6">
            <EditableImg
              regionKey="about.signature"
              fallback="https://upload.wikimedia.org/wikipedia/commons/f/f3/Signature_of_John_Hancock.svg"
              className="w-40 h-auto opacity-40 filter mix-blend-multiply"
              alt="Signature"
            />
          </div>
        </div>
        <div className="lg:col-span-7 order-1 lg:order-2 relative">
          <div
            className="absolute -inset-4 sm:-inset-8 z-0 opacity-20"
            style={{
              backgroundColor: theme.primaryColor,
              borderRadius: `${theme.borderRadius * 2}px`
            }}
          />
          <EditableImg
            regionKey="about.img"
            fallback="https://images.unsplash.com/photo-1573164713988-8665fc963095?w=1200&fit=crop"
            className="w-full aspect-[4/5] object-cover relative z-10 shadow-2xl"
            style={{ borderRadius: `${theme.borderRadius}px` }}
          />
        </div>
      </div>
    </Section>
  );

  const ContactView = () => (
    <Section id="contact" bgType="secondary" className="animate-in zoom-in-95 duration-500 min-h-[80vh] flex items-center">
      <div
        className="w-full max-w-6xl mx-auto bg-white overflow-hidden shadow-2xl flex flex-col md:flex-row flex-wrap"
        style={{ borderRadius: `${theme.borderRadius * 2}px` }}
      >
        <div className="w-full md:w-5/12 relative aspect-square md:aspect-auto">
          <EditableImg
            regionKey="contact.img"
            fallback="https://images.unsplash.com/photo-1505902722417-c477ad4ea47d?w=1000&fit=crop"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        <div className="w-full md:w-7/12 p-8 sm:p-16 lg:p-24 flex flex-col justify-center">
          <EditableText
            as="h2"
            regionKey="contact.title"
            fallback="Let's Talk Details."
            className="text-4xl sm:text-5xl font-light tracking-tight block mb-4"
          />
          <EditableText
            as="p"
            regionKey="contact.subtitle"
            fallback="Fill out our inquiry form, and our design team will reach out to schedule your consultation."
            className="text-base opacity-70 mb-12 block max-w-md"
          />

          <div className="space-y-8 max-w-md">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-[0.2em] opacity-50">Name</label>
              <input
                className="w-full pb-3 bg-transparent border-b outline-none transition-colors"
                style={{ borderColor: `${theme.textColor}30` }}
                placeholder="Eleanor Shellstrop"
                readOnly
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-[0.2em] opacity-50">Event Type</label>
              <input
                className="w-full pb-3 bg-transparent border-b outline-none transition-colors"
                style={{ borderColor: `${theme.textColor}30` }}
                placeholder="Wedding, Corporate, etc."
                readOnly
              />
            </div>
            <button
              className="w-full py-5 mt-6 font-bold uppercase tracking-[0.2em] text-xs transition-transform hover:-translate-y-1 shadow-xl"
              style={{
                backgroundColor: theme.primaryColor,
                color: "#fff",
                borderRadius: `${theme.borderRadius}px`
              }}
            >
              <EditableText regionKey="contact.submit" fallback="SUBMIT INQUIRY" />
            </button>
          </div>

          <div className="mt-16 pt-8 border-t flex flex-col sm:flex-row gap-8 sm:gap-16" style={{ borderColor: `${theme.textColor}10` }}>
            <div>
              <EditableText as="h4" regionKey="contact.emailLabel" fallback="EMAIL" className="text-xs font-bold uppercase tracking-[0.2em] opacity-50 block mb-2" />
              <EditableText regionKey="contact.email" fallback="hello@auraevents.com" className="font-medium block" />
            </div>
            <div>
              <EditableText as="h4" regionKey="contact.phoneLabel" fallback="PHONE" className="text-xs font-bold uppercase tracking-[0.2em] opacity-50 block mb-2" />
              <EditableText regionKey="contact.phone" fallback="+1 (555) 000-0000" className="font-medium block" />
            </div>
          </div>
        </div>
      </div>
    </Section>
  );

  const Footer = () => (
    <footer
      className="py-16 px-4 sm:px-6 lg:px-8 border-t overflow-hidden break-words w-full max-w-full"
      style={{
        backgroundColor: theme.backgroundColor,
        color: theme.textColor,
        borderColor: `${theme.textColor}10`,
      }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-3">
          <EditableImg
            regionKey="global.logo"
            fallback="https://images.unsplash.com/photo-1606836591695-4d58a73eba1e?w=150&h=150&fit=crop"
            className="w-10 h-10 object-cover filter grayscale"
            style={{ borderRadius: `${theme.borderRadius}px` }}
          />
          <EditableText regionKey="global.brand" fallback="AURA EVENTS" className="font-bold tracking-[0.15em] uppercase" />
        </div>

        <div className="flex flex-wrap justify-center gap-6 sm:gap-10">
          {["Home", "About", "Contact"].map((p) => (
            <button
              key={p}
              onClick={() => setActivePage(p.toLowerCase() as any)}
              className="text-xs font-medium uppercase tracking-[0.2em] opacity-60 hover:opacity-100 transition-opacity"
            >
              {p}
            </button>
          ))}
        </div>

        <div className="text-center md:text-right">
          <EditableText
            regionKey="footer.copy"
            fallback="© 2024 Aura Events. All Rights Reserved."
            className="text-xs opacity-40 uppercase tracking-wider block"
          />
        </div>
      </div>
    </footer>
  );

  return (
    <main
      className="min-h-screen flex flex-col w-full max-w-full overflow-hidden"
      style={{
        fontFamily: theme.fontFamily,
        backgroundColor: theme.backgroundColor,
        color: theme.textColor
      }}
    >
      {/* Script loading via native HTML for better compatibility in editor */}
      <script src="https://upload-widget.cloudinary.com/global/all.js" async></script>

      <Navbar />

      <div className="flex-grow flex flex-col w-full max-w-full min-w-0">
        {activePage === "home" && <HomeView />}
        {activePage === "about" && <AboutView />}
        {activePage === "contact" && <ContactView />}
      </div>

      <Footer />

      <style>{`
        html, body { 
          max-width: 100vw; 
          overflow-x: hidden; 
        }
        [contenteditable]:focus { 
          outline: none; 
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5); 
          background: rgba(0,0,0,0.02); 
        }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-in-from-bottom-8 { from { transform: translateY(2rem); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes zoom-in-95 { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-in { animation-duration: 0.7s; animation-fill-mode: both; animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1); }
        .fade-in { animation-name: fade-in; }
        .slide-in-from-bottom-8 { animation-name: slide-in-from-bottom-8; }
        .zoom-in-95 { animation-name: zoom-in-95; }
      `}</style>
    </main>
  );
}








