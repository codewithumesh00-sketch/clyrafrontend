"use client";

import React, { useState } from "react";
import Script from "next/script";
import {
  useWebsiteBuilderStore,
  useRegionValue,
} from "@/store/useWebsiteBuilderStore";
import { useThemeStore } from "@/store/useThemeStore";

/**
 * PRODUCTION-SAFE TEMPLATE FOR clyraweb
 * Built with internal routing, dynamic theme support, and Cloudinary integration.
 * Theme: High-End Fashion Brand (Editorial / Canva-style Moodboard Aesthetic)
 */



export const template24Meta = {
  id: "business/template24",
  name: "Fashion Brand",
  image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1600&auto=format&fit=crop",
};

type TemplateProps = {
  editableData?: any;
};

const getNestedValue = (obj: any, path: string) => {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
};

export default function Template24({ editableData }: TemplateProps) {
  const [activePage, setActivePage] = useState("home");
  const { theme } = useThemeStore();
  const updateRegion = useWebsiteBuilderStore((state: any) => state.updateRegion);

  // --- IMAGE UPLOAD HANDLER ---
  const handleImageUpload = (regionKey: string) => {
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
  };

  // --- clyraweb EDITABLE COMPONENTS ---
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
        className={`focus:outline-none focus:ring-1 focus:ring-gray-300 transition-all ${className}`}
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
        className={`cursor-pointer transition-opacity hover:opacity-90 ${className}`}
        onDoubleClick={(e) => {
          e.stopPropagation();
          handleImageUpload(regionKey);
        }}
      />
    );
  };

  const Section = ({ children, id, bgType = "primary", fullWidth = false }: any) => (
    <section
      id={id}
      style={{
        padding: fullWidth ? "0" : `${theme.sectionSpacing}px 24px`,
        backgroundColor: bgType === "primary" ? theme.backgroundColor : theme.secondaryColor,
        color: theme.textColor,
      }}
      className="w-full flex justify-center overflow-hidden"
    >
      <div className={`w-full ${fullWidth ? "max-w-full" : "max-w-7xl"}`}>{children}</div>
    </section>
  );

  const Navbar = () => (
    <nav
      className="sticky top-0 w-full z-50 transition-all duration-300 border-b"
      style={{
        backgroundColor: `${theme.backgroundColor}F2`, // slight transparency
        borderColor: `${theme.textColor}15`,
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between gap-4 overflow-hidden">
        {/* Left Links */}
        <div className="hidden md:flex items-center gap-8 flex-1">
          {["Home", "About", "Contact"].map((page) => (
            <button
              key={page}
              onClick={() => setActivePage(page.toLowerCase())}
              className={`text-xs uppercase tracking-[0.2em] transition-all duration-300 ${activePage === page.toLowerCase() ? "font-bold" : "opacity-60 hover:opacity-100"
                }`}
              style={{ color: theme.textColor }}
            >
              {page}
            </button>
          ))}
        </div>

        {/* Center Brand */}
        <div className="flex-1 flex justify-center items-center min-w-0">
          <EditableText
            regionKey="global.brand"
            fallback="MAISON clyraweb"
            className="font-black text-2xl md:text-3xl tracking-widest whitespace-nowrap uppercase"
          />
        </div>

        {/* Right CTA */}
        <div className="flex-1 flex justify-end">
          <button
            className="px-6 py-3 text-xs uppercase tracking-[0.15em] font-medium transition-transform active:scale-95 border"
            style={{
              backgroundColor: theme.primaryColor,
              borderColor: theme.primaryColor,
              color: theme.backgroundColor,
              borderRadius: `${theme.borderRadius}px`,
            }}
          >
            <EditableText regionKey="global.navCta" fallback="SHOP NEW IN" />
          </button>
        </div>
      </div>

      {/* Mobile Menu Links (Visible only on small screens) */}
      <div className="md:hidden flex justify-center gap-6 pb-4 pt-2 px-4 overflow-x-auto">
        {["Home", "About", "Contact"].map((page) => (
          <button
            key={page}
            onClick={() => setActivePage(page.toLowerCase())}
            className={`text-[10px] uppercase tracking-[0.15em] whitespace-nowrap ${activePage === page.toLowerCase() ? "font-bold border-b border-current pb-1" : "opacity-60"
              }`}
            style={{ color: theme.textColor }}
          >
            {page}
          </button>
        ))}
      </div>
    </nav>
  );

  const Footer = () => (
    <footer
      className="pt-24 pb-12 px-6 border-t"
      style={{
        backgroundColor: theme.backgroundColor,
        color: theme.textColor,
        borderColor: `${theme.textColor}15`,
      }}
    >
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 text-center md:text-left mb-16">
        <div className="md:col-span-2 space-y-6">
          <EditableText regionKey="global.brand" fallback="MAISON clyraweb" className="font-black text-2xl tracking-widest uppercase block" />
          <EditableText
            as="p"
            regionKey="footer.desc"
            fallback="Defining modern elegance through sustainable practices and timeless silhouettes. Discover the new aesthetic."
            className="text-sm opacity-70 leading-loose max-w-md mx-auto md:mx-0 block"
          />
        </div>

        <div className="space-y-6">
          <h4 className="font-bold uppercase tracking-[0.2em] text-xs">Collections</h4>
          <div className="flex flex-col gap-3 text-sm opacity-70">
            <EditableText regionKey="footer.link1" fallback="Ready to Wear" className="hover:opacity-100 cursor-pointer block" />
            <EditableText regionKey="footer.link2" fallback="Accessories" className="hover:opacity-100 cursor-pointer block" />
            <EditableText regionKey="footer.link3" fallback="Lookbook Archive" className="hover:opacity-100 cursor-pointer block" />
          </div>
        </div>

        <div className="space-y-6">
          <h4 className="font-bold uppercase tracking-[0.2em] text-xs">Client Care</h4>
          <div className="flex flex-col gap-3 text-sm opacity-70">
            <EditableText regionKey="footer.contact1" fallback="concierge@maisonclyraweb.com" className="block" />
            <EditableText regionKey="footer.contact2" fallback="+1 (800) 123-4567" className="block" />
            <button onClick={() => setActivePage("contact")} className="hover:opacity-100 uppercase tracking-widest text-xs mt-2 text-left w-fit mx-auto md:mx-0">
              Contact Us →
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t" style={{ borderColor: `${theme.textColor}10` }}>
        <EditableText regionKey="footer.copy" fallback="© 2024 Maison clyraweb. All Rights Reserved." className="text-xs opacity-50 uppercase tracking-wider" />
        <div className="flex gap-4 text-xs opacity-50 uppercase tracking-wider">
          <span>Instagram</span>
          <span>Pinterest</span>
          <span>TikTok</span>
        </div>
      </div>
    </footer>
  );

  // --- PAGE VIEWS ---
  const HomeView = () => (
    <div className="animate-in fade-in duration-1000">
      {/* Editorial Hero Banner */}
      <Section id="hero" fullWidth={true}>
        <div className="relative w-full h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 w-full h-full">
            <EditableImg
              regionKey="hero.bgImg"
              fallback="https://images.unsplash.com/photo-1509631179647-0c11583e82fa?q=80&w=2000&auto=format&fit=crop"
              className="w-full h-full object-cover"
            />
            {/* Subtle Overlay */}
            <div className="absolute inset-0 bg-black/20 mix-blend-multiply"></div>
          </div>

          <div className="relative z-10 text-center px-6 max-w-4xl mx-auto text-white flex flex-col items-center">
            <EditableText
              as="h4"
              regionKey="hero.season"
              fallback="SPRING / SUMMER 2025"
              className="text-xs md:text-sm font-medium uppercase tracking-[0.3em] mb-6 block drop-shadow-md"
            />
            <EditableText
              as="h1"
              regionKey="hero.title"
              fallback="THE NEW SILHOUETTE"
              className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.9] block mb-8 drop-shadow-xl"
            />
            <button
              className="px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] bg-white text-black hover:bg-black hover:text-white transition-colors duration-500"
              style={{ borderRadius: `${theme.borderRadius}px` }}
            >
              <EditableText regionKey="hero.btn" fallback="Explore the Campaign" />
            </button>
          </div>
        </div>
      </Section>

      {/* Editor's Pick / Split Section */}
      <Section id="highlight">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-24 items-center">
          <div className="order-2 md:order-1 space-y-8">
            <EditableText as="h3" regionKey="home.highlightTitle" fallback="ELEVATED ESSENTIALS" className="text-3xl md:text-5xl font-light uppercase tracking-tight block" />
            <EditableText
              as="p"
              regionKey="home.highlightDesc"
              fallback="Curated pieces designed to build a foundational wardrobe. Experience the perfect blend of structural tailoring and fluid drape, created for the modern connoisseur."
              className="text-base md:text-lg opacity-70 leading-relaxed block max-w-md"
            />
            <button className="border-b-2 border-current pb-1 text-sm font-bold uppercase tracking-[0.15em] hover:opacity-60 transition-opacity">
              <EditableText regionKey="home.highlightLink" fallback="Shop The Edit" />
            </button>
          </div>
          <div className="order-1 md:order-2">
            <EditableImg
              regionKey="home.highlightImg"
              fallback="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000&auto=format&fit=crop"
              className="w-full aspect-[3/4] object-cover"
              style={{ borderRadius: `${theme.borderRadius}px` }}
            />
          </div>
        </div>
      </Section>

      {/* Canva-style Moodboard / Lookbook Grid */}
      <Section id="lookbook" bgType="secondary">
        <div className="text-center mb-16">
          <EditableText as="h2" regionKey="lookbook.title" fallback="THE LOOKBOOK" className="text-4xl font-light uppercase tracking-widest block" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
          {[
            { id: 1, img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop", text: "Look 01" },
            { id: 2, img: "https://images.unsplash.com/photo-1485230895905-ef05953c89b3?q=80&w=800&auto=format&fit=crop", text: "Look 02" },
            { id: 3, img: "https://images.unsplash.com/photo-1502163140606-888448ae8cfe?q=80&w=800&auto=format&fit=crop", text: "Look 03" },
          ].map((item, idx) => (
            <div key={idx} className={`group cursor-pointer ${idx === 1 ? 'md:mt-12' : ''}`}>
              <div className="overflow-hidden relative" style={{ borderRadius: `${theme.borderRadius}px` }}>
                <EditableImg
                  regionKey={`lookbook.img${item.id}`}
                  fallback={item.img}
                  className="w-full aspect-[4/5] object-cover transition-transform duration-1000 group-hover:scale-105"
                />
              </div>
              <div className="pt-6 text-center">
                <EditableText
                  regionKey={`lookbook.text${item.id}`}
                  fallback={item.text}
                  className="text-xs uppercase tracking-[0.2em] font-medium"
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-20 text-center">
          <button
            className="px-10 py-4 text-xs font-bold uppercase tracking-[0.2em] transition-colors border border-current hover:bg-black hover:text-white"
            style={{ borderRadius: `${theme.borderRadius}px` }}
          >
            <EditableText regionKey="lookbook.btn" fallback="View Full Archive" />
          </button>
        </div>
      </Section>
    </div>
  );

  const AboutView = () => (
    <div className="animate-in slide-in-from-bottom-8 duration-1000">
      {/* About Header */}
      <Section id="about-header" bgType="primary">
        <div className="max-w-4xl mx-auto text-center space-y-8 pt-12 pb-8">
          <EditableText as="h4" regionKey="about.subtitle" fallback="OUR STORY" className="text-xs font-bold uppercase tracking-[0.3em] opacity-50 block" />
          <EditableText as="h1" regionKey="about.title" fallback="REDEFINING MODERN LUXURY" className="text-4xl md:text-6xl font-light uppercase tracking-tighter leading-tight block" />
        </div>
      </Section>

      {/* Editorial Split Story */}
      <Section id="about-story" bgType="primary" fullWidth={true}>
        <div className="flex flex-col lg:flex-row w-full min-h-[70vh]">
          <div className="w-full lg:w-1/2 p-8 md:p-16 lg:p-24 flex items-center justify-center bg-gray-50" style={{ backgroundColor: theme.secondaryColor }}>
            <div className="max-w-lg space-y-8">
              <EditableText as="h3" regionKey="about.sectionTitle" fallback="CRAFTSMANSHIP & VISION" className="text-2xl font-light uppercase tracking-widest block" />
              <EditableText
                as="p"
                regionKey="about.desc1"
                fallback="Founded on the principles of minimalist beauty and structural integrity. Every garment is a testament to our dedication to quality, utilizing only ethically sourced materials and partnering with master artisans globally."
                className="text-lg opacity-80 leading-loose block"
              />
              <EditableText
                as="p"
                regionKey="about.desc2"
                fallback="We don't just follow trends; we observe the intersection of art, architecture, and daily life to create pieces that remain relevant long after the season ends."
                className="text-lg opacity-80 leading-loose block"
              />
            </div>
          </div>
          <div className="w-full lg:w-1/2 relative min-h-[50vh] lg:min-h-full">
            <EditableImg
              regionKey="about.img1"
              fallback="https://images.unsplash.com/photo-1550614000-4b95d4ebfaeb?q=80&w=1200&auto=format&fit=crop"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </Section>

      {/* Brand Values */}
      <Section id="about-values">
        <div className="grid md:grid-cols-3 gap-12 text-center py-12">
          {[
            { id: 1, title: "SUSTAINABILITY", desc: "Committed to eco-conscious production and circular fashion models." },
            { id: 2, title: "ARTISANRY", desc: "Collaborating with generational craftspeople to ensure unmatched quality." },
            { id: 3, title: "TIMELESSNESS", desc: "Designing outside the seasonal calendar for enduring relevance." }
          ].map((val, idx) => (
            <div key={idx} className="space-y-4">
              <EditableText as="h4" regionKey={`about.valTitle${val.id}`} fallback={val.title} className="text-sm font-bold uppercase tracking-[0.2em] block" />
              <EditableText as="p" regionKey={`about.valDesc${val.id}`} fallback={val.desc} className="text-sm opacity-60 leading-relaxed block px-4" />
            </div>
          ))}
        </div>
      </Section>
    </div>
  );

  const ContactView = () => (
    <Section id="contact">
      <div className="min-h-[70vh] flex flex-col justify-center animate-in zoom-in-95 duration-700 max-w-6xl mx-auto w-full py-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* Left: Info */}
          <div className="space-y-12">
            <div>
              <EditableText as="h1" regionKey="contact.title" fallback="GET IN TOUCH" className="text-4xl md:text-6xl font-light uppercase tracking-tighter block mb-6" />
              <EditableText as="p" regionKey="contact.subtitle" fallback="For press inquiries, private client services, or general questions, please reach out to our dedicated team." className="text-lg opacity-70 leading-relaxed block" />
            </div>

            <div className="space-y-8 pt-8 border-t" style={{ borderColor: `${theme.textColor}20` }}>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-[0.2em] opacity-40 mb-3">Flagship Boutique</h4>
                <EditableText regionKey="contact.address" fallback="123 Fashion Avenue, Le Marais, Paris 75003" className="font-medium text-lg block" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-[0.2em] opacity-40 mb-3">Client Concierge</h4>
                <EditableText regionKey="contact.email" fallback="concierge@maisonclyraweb.com" className="font-medium text-lg block mb-1" />
                <EditableText regionKey="contact.phone" fallback="+33 1 23 45 67 89" className="font-medium text-lg block" />
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="bg-white/5 p-8 md:p-12 border shadow-sm" style={{ borderColor: `${theme.textColor}15`, borderRadius: `${theme.borderRadius}px`, backgroundColor: theme.backgroundColor }}>
            <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-[0.1em] opacity-60">Full Name</label>
                <input
                  type="text"
                  className="w-full pb-3 bg-transparent border-b outline-none transition-colors focus:border-current"
                  style={{ borderColor: `${theme.textColor}30` }}
                  placeholder="Jane Doe"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-[0.1em] opacity-60">Email Address</label>
                <input
                  type="email"
                  className="w-full pb-3 bg-transparent border-b outline-none transition-colors focus:border-current"
                  style={{ borderColor: `${theme.textColor}30` }}
                  placeholder="jane@example.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-[0.1em] opacity-60">Inquiry Type</label>
                <select
                  className="w-full pb-3 bg-transparent border-b outline-none transition-colors focus:border-current appearance-none cursor-pointer"
                  style={{ borderColor: `${theme.textColor}30`, color: theme.textColor }}
                >
                  <option>Customer Service</option>
                  <option>Press & PR</option>
                  <option>Wholesale</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-[0.1em] opacity-60">Message</label>
                <textarea
                  rows={3}
                  className="w-full pb-3 bg-transparent border-b outline-none transition-colors focus:border-current resize-none"
                  style={{ borderColor: `${theme.textColor}30` }}
                  placeholder="How can we assist you?"
                />
              </div>
              <button
                className="w-full py-5 font-bold uppercase tracking-[0.2em] text-xs transition-colors"
                style={{ backgroundColor: theme.primaryColor, color: theme.backgroundColor, borderRadius: `${theme.borderRadius}px` }}
              >
                <EditableText regionKey="contact.submitBtn" fallback="Submit Inquiry" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </Section>
  );

  return (
    <main
      className="min-h-screen antialiased selection:bg-black selection:text-white"
      style={{ fontFamily: theme.fontFamily, backgroundColor: theme.backgroundColor }}
    >
      {/* Cloudinary Script Loading for Drag & Drop / Double Click Image Upload */}
      <script
        src="https://upload-widget.cloudinary.com/global/all.js"
        async
      ></script>

      <Navbar />

      <div className="flex flex-col w-full">
        {activePage === "home" && <HomeView />}
        {activePage === "about" && <AboutView />}
        {activePage === "contact" && <ContactView />}
      </div>

      <Footer />

      <style>{`
        /* Canva-style sleek animations and base styles */
        html { scroll-behavior: smooth; }
        [contenteditable]:focus { 
          outline: none; 
          background: rgba(128,128,128,0.05); 
          box-shadow: 0 0 0 1px rgba(0,0,0,0.1); 
        }
        
        @keyframes fade-in { 
          from { opacity: 0; } 
          to { opacity: 1; } 
        }
        @keyframes slide-in-from-bottom-8 { 
          from { transform: translateY(2rem); opacity: 0; } 
          to { transform: translateY(0); opacity: 1; } 
        }
        @keyframes zoom-in-95 { 
          from { transform: scale(0.98); opacity: 0; } 
          to { transform: scale(1); opacity: 1; } 
        }
        
        .animate-in { 
          animation-duration: 0.8s; 
          animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
          animation-fill-mode: both; 
        }
        .fade-in { animation-name: fade-in; }
        .slide-in-from-bottom-8 { animation-name: slide-in-from-bottom-8; }
        .zoom-in-95 { animation-name: zoom-in-95; }

        /* Hide scrollbar for the mobile nav */
        .overflow-x-auto::-webkit-scrollbar {
          display: none;
        }
        .overflow-x-auto {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </main>
  );
}





