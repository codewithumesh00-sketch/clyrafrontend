"use client";

import React, { useState } from "react";
import Script from "next/script";

/**
 * PRODUCTION-SAFE TEMPLATE FOR CLYRA
 * Built with internal routing, dynamic theme support, and Cloudinary integration.
 * Theme: Canva-inspired Wedding Planner (Elegant, Serif typography, Soft layouts)
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
      backgroundColor: "#FAF9F7",
      textColor: "#2C302E",
      primaryColor: "#A3B19B",
      secondaryColor: "#FFFFFF",
      borderRadius: 16,
      sectionSpacing: 100,
      fontFamily: "Inter, sans-serif",
    },
  });
}

export const template31Meta = {
  id: "business/template31",
  name: "Wedding Planner",
  image:
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1600&auto=format&fit=crop",
};

type TemplateProps = {
  editableData?: any;
};

const getNestedValue = (obj: any, path: string) => {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
};

export default function Template31({ editableData }: TemplateProps) {
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
        className={`focus:outline-none focus:ring-1 focus:ring-opacity-50 transition-all ${className}`}
        style={{ outlineColor: theme.primaryColor }}
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
        className={`cursor-pointer transition-transform duration-500 hover:scale-[1.02] ${className}`}
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
        padding: `${theme.sectionSpacing}px 24px`,
        backgroundColor: bgType === "primary" ? theme.backgroundColor : theme.secondaryColor,
        color: theme.textColor,
      }}
      className={`w-full flex justify-center overflow-hidden min-w-0 ${className}`}
    >
      <div className="w-full max-w-6xl">{children}</div>
    </section>
  );

  const Navbar = () => (
    <nav
      className="sticky top-0 w-full z-40 backdrop-blur-xl border-b transition-all duration-300"
      style={{
        backgroundColor: `${theme.backgroundColor}E6`,
        borderColor: `${theme.textColor}10`,
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between gap-4 overflow-hidden">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <EditableImg
            regionKey="global.logo"
            fallback="https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=100&h=100&fit=crop"
            className="w-12 h-12 object-cover rounded-full shadow-sm"
          />
          <EditableText
            regionKey="global.brand"
            fallback="AURA WEDDINGS"
            className="font-serif font-medium text-2xl tracking-widest whitespace-nowrap uppercase"
          />
        </div>

        <div className="hidden md:flex items-center gap-10 px-4">
          {["Home", "About", "Contact"].map((page) => (
            <button
              key={page}
              onClick={() => setActivePage(page.toLowerCase() as any)}
              className={`text-xs font-medium transition-all uppercase tracking-[0.2em] relative after:content-[''] after:absolute after:-bottom-2 after:left-1/2 after:w-0 after:h-[1px] after:bg-current after:transition-all after:duration-300 hover:after:w-full hover:after:left-0 ${
                activePage === page.toLowerCase() ? "opacity-100 after:w-full after:left-0" : "opacity-60 hover:opacity-100"
              }`}
              style={{ color: theme.textColor }}
            >
              {page}
            </button>
          ))}
        </div>

        <div className="flex-shrink-0">
          <button
            className="px-8 py-3.5 font-medium text-xs uppercase tracking-[0.15em] transition-transform active:scale-95 shadow-sm hover:shadow-md"
            style={{
              backgroundColor: theme.primaryColor,
              color: "#fff",
              borderRadius: `${theme.borderRadius}px`,
            }}
          >
            <EditableText regionKey="global.navCta" fallback="Inquire Now" />
          </button>
        </div>
      </div>
    </nav>
  );

  const Footer = () => (
    <footer
      className="py-24 px-6 border-t"
      style={{
        backgroundColor: theme.secondaryColor,
        color: theme.textColor,
        borderColor: `${theme.textColor}10`,
      }}
    >
      <div className="max-w-6xl mx-auto grid md:grid-cols-12 gap-12 text-center md:text-left">
        <div className="md:col-span-5 space-y-6">
          <EditableText 
            as="h3" 
            regionKey="global.brand" 
            fallback="AURA WEDDINGS" 
            className="font-serif text-3xl tracking-widest uppercase block" 
          />
          <EditableText
            as="p"
            regionKey="footer.desc"
            fallback="Curating timeless celebrations for the modern romantic. Based in New York, traveling worldwide."
            className="text-sm opacity-70 leading-loose block max-w-sm mx-auto md:mx-0 font-light"
          />
        </div>
        
        <div className="md:col-span-3 flex flex-col gap-5">
          <h4 className="font-serif italic text-lg opacity-80">Navigate</h4>
          {["Home", "About", "Contact"].map((p) => (
            <button 
              key={p} 
              onClick={() => setActivePage(p.toLowerCase() as any)} 
              className="hover:opacity-100 opacity-60 text-sm tracking-widest uppercase w-fit mx-auto md:mx-0 transition-opacity"
            >
              {p}
            </button>
          ))}
        </div>

        <div className="md:col-span-4 space-y-5">
          <h4 className="font-serif italic text-lg opacity-80">Connect</h4>
          <EditableText 
            regionKey="footer.email" 
            fallback="hello@auraweddings.com" 
            className="text-sm tracking-widest uppercase block opacity-60 hover:opacity-100 transition-opacity cursor-pointer" 
          />
          <EditableText 
            regionKey="footer.social" 
            fallback="Instagram / Pinterest" 
            className="text-sm tracking-widest uppercase block opacity-60 hover:opacity-100 transition-opacity cursor-pointer" 
          />
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-24 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4" style={{ borderColor: `${theme.textColor}10` }}>
        <EditableText 
          regionKey="footer.copy" 
          fallback="© 2026 Aura Weddings. All rights reserved." 
          className="text-xs opacity-40 uppercase tracking-widest block" 
        />
        <span className="text-xs opacity-40 uppercase tracking-widest">Designed on Clyra</span>
      </div>
    </footer>
  );

  // --- PAGE VIEWS ---
  const HomeView = () => (
    <div className="animate-fade-in">
      <Section id="hero" bgType="secondary" className="!pt-12 !pb-24">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-center">
          <div className="lg:w-1/2 space-y-8 text-center lg:text-left z-10">
            <div className="space-y-4">
              <EditableText
                as="span"
                regionKey="hero.kicker"
                fallback="Bespoke Event Design"
                className="text-xs font-medium uppercase tracking-[0.3em] opacity-60 block"
              />
              <EditableText
                as="h1"
                regionKey="hero.title"
                fallback="Curating Your Forever."
                className="text-5xl md:text-7xl font-serif leading-[1.1] text-balance block"
              />
            </div>
            <EditableText
              as="p"
              regionKey="hero.subtitle"
              fallback="We transform your unique love story into an immersive, unforgettable celebration filled with intention, artistry, and effortless elegance."
              className="text-base md:text-lg opacity-75 leading-relaxed block max-w-md mx-auto lg:mx-0 font-light"
            />
            <div className="pt-4">
              <button
                onClick={() => setActivePage("contact")}
                className="px-10 py-4 text-xs uppercase tracking-[0.2em] transition-all hover:opacity-90 relative overflow-hidden group"
                style={{ backgroundColor: theme.primaryColor, color: "#fff", borderRadius: `${theme.borderRadius}px` }}
              >
                <span className="relative z-10"><EditableText regionKey="hero.btn1" fallback="Start Planning" /></span>
              </button>
            </div>
          </div>
          <div className="lg:w-1/2 w-full relative">
            <div className="absolute inset-0 bg-black/5 -m-4 md:-m-8 z-0" style={{ borderRadius: `${theme.borderRadius * 2}px` }} />
            <EditableImg
              regionKey="hero.img"
              fallback="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200&auto=format&fit=crop"
              className="w-full aspect-[4/5] object-cover relative z-10 shadow-xl"
              style={{ borderRadius: `${theme.borderRadius * 1.5}px` }}
            />
          </div>
        </div>
      </Section>

      <Section id="services" bgType="primary">
        <div className="text-center mb-20 space-y-4">
          <EditableText as="h2" regionKey="home.servicesTitle" fallback="Our Approach" className="text-4xl md:text-5xl font-serif block" />
          <div className="w-16 h-[1px] mx-auto mt-6" style={{ backgroundColor: theme.textColor, opacity: 0.2 }} />
        </div>
        
        <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
          {[
            { id: "s1", title: "Full Planning", img: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop" },
            { id: "s2", title: "Event Design", img: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=800&auto=format&fit=crop" },
            { id: "s3", title: "Coordination", img: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=800&auto=format&fit=crop" }
          ].map((srv, i) => (
            <div key={srv.id} className="group text-center space-y-6">
              <div className="overflow-hidden mx-auto max-w-[280px]" style={{ borderRadius: '1000px 1000px 0 0' }}>
                <EditableImg
                  regionKey={`home.${srv.id}Img`}
                  fallback={srv.img}
                  className="w-full aspect-[3/4] object-cover"
                />
              </div>
              <EditableText
                as="h3"
                regionKey={`home.${srv.id}Title`}
                fallback={srv.title}
                className="text-xl font-serif block pt-4"
              />
              <EditableText
                as="p"
                regionKey={`home.${srv.id}Desc`}
                fallback="Comprehensive guidance from conceptualization to the final dance, ensuring every detail reflects your aesthetic."
                className="text-sm opacity-60 leading-relaxed font-light block px-4"
              />
            </div>
          ))}
        </div>
      </Section>
    </div>
  );

  const AboutView = () => (
    <div className="animate-fade-in-up">
      <Section id="about" bgType="secondary">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          <div className="lg:col-span-5 relative order-2 lg:order-1">
             <div className="absolute top-8 -left-8 w-full h-full border z-0" style={{ borderColor: theme.primaryColor, borderRadius: '200px 200px 0 0' }} />
             <EditableImg
                regionKey="about.img"
                fallback="https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1000&auto=format&fit=crop"
                className="w-full aspect-[3/4] object-cover relative z-10"
                style={{ borderRadius: '200px 200px 0 0' }}
              />
          </div>
          <div className="lg:col-span-7 space-y-8 order-1 lg:order-2 text-center lg:text-left">
            <EditableText as="h2" regionKey="about.title" fallback="The Visionaries Behind the Veil" className="text-4xl md:text-6xl font-serif leading-tight block" />
            <div className="w-12 h-[1px] mx-auto lg:mx-0" style={{ backgroundColor: theme.primaryColor }} />
            <EditableText
              as="p"
              regionKey="about.desc"
              fallback="With over a decade of experience in luxury hospitality and high-fashion event production, we bring a calm, refined, and deeply personal approach to wedding planning. We believe your celebration should not only look breathtaking but feel effortlessly authentic to who you are as a couple."
              className="text-base md:text-lg opacity-75 leading-loose block font-light text-balance"
            />
            <EditableText
              as="p"
              regionKey="about.desc2"
              fallback="From sweeping floral installations to the delicate texture of your table linens, we obsess over the nuances so you can simply be present in the magic of your day."
              className="text-base md:text-lg opacity-75 leading-loose block font-light text-balance"
            />
          </div>
        </div>
      </Section>
    </div>
  );

  const ContactView = () => (
    <div className="animate-zoom-in">
      <Section id="contact" bgType="primary" className="min-h-[80vh] flex items-center">
        <div className="max-w-3xl mx-auto w-full text-center">
          <EditableText 
            as="h1" 
            regionKey="contact.title" 
            fallback="Let's Begin Your Journey" 
            className="text-4xl md:text-6xl font-serif block mb-6 text-balance" 
          />
          <EditableText 
            as="p" 
            regionKey="contact.subtitle" 
            fallback="Please share a few details about your upcoming celebration. We take on a limited number of events each year to ensure the highest level of dedication." 
            className="text-sm md:text-base opacity-60 leading-relaxed max-w-xl mx-auto block mb-16 font-light" 
          />
          
          <div className="bg-white/40 backdrop-blur-md p-8 md:p-14 border shadow-sm" style={{ borderRadius: `${theme.borderRadius}px`, borderColor: `${theme.textColor}10` }}>
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 text-left mb-12">
              <div>
                <h4 className="text-xs font-serif italic opacity-60 mb-3">Studio Location</h4>
                <EditableText regionKey="contact.address" fallback="100 Fifth Avenue, Suite 4A" className="font-medium text-sm block" />
                <EditableText regionKey="contact.city" fallback="New York, NY 10011" className="font-medium text-sm block" />
              </div>
              <div>
                <h4 className="text-xs font-serif italic opacity-60 mb-3">Direct Inquiries</h4>
                <EditableText regionKey="contact.email" fallback="hello@auraweddings.com" className="font-medium text-sm block" />
                <EditableText regionKey="contact.phone" fallback="+1 (555) 123-4567" className="font-medium text-sm block" />
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <input 
                  className="w-full pb-3 bg-transparent border-b outline-none text-sm transition-colors focus:border-current" 
                  style={{ borderColor: `${theme.textColor}30` }} 
                  placeholder="Your Name" 
                />
                <input 
                  className="w-full pb-3 bg-transparent border-b outline-none text-sm transition-colors focus:border-current" 
                  style={{ borderColor: `${theme.textColor}30` }} 
                  placeholder="Partner's Name" 
                />
              </div>
              <input 
                className="w-full pb-3 bg-transparent border-b outline-none text-sm transition-colors focus:border-current" 
                style={{ borderColor: `${theme.textColor}30` }} 
                placeholder="Email Address" 
              />
              <input 
                className="w-full pb-3 bg-transparent border-b outline-none text-sm transition-colors focus:border-current" 
                style={{ borderColor: `${theme.textColor}30` }} 
                placeholder="Anticipated Date & Location" 
              />
              <button 
                className="w-full py-5 mt-4 font-medium uppercase tracking-[0.2em] text-xs transition-opacity hover:opacity-90 shadow-sm" 
                style={{ backgroundColor: theme.primaryColor, color: "#fff", borderRadius: `${theme.borderRadius}px` }}
              >
                <EditableText regionKey="contact.submit" fallback="Submit Inquiry" />
              </button>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );

  return (
    <main
      className="min-h-screen w-full flex flex-col font-sans"
      style={{ fontFamily: theme.fontFamily, backgroundColor: theme.backgroundColor }}
    >
      <Script 
        src="https://upload-widget.cloudinary.com/global/all.js" 
        strategy="afterInteractive" 
      />
      
      <Navbar />

      <div className="flex-grow w-full flex flex-col">
        {activePage === "home" && <HomeView />}
        {activePage === "about" && <AboutView />}
        {activePage === "contact" && <ContactView />}
      </div>

      <Footer />

      <style>{`
        html { scroll-behavior: smooth; }
        [contenteditable]:focus { 
          outline: 1px dashed ${theme.primaryColor}; 
          background: rgba(0,0,0,0.01); 
          border-radius: 2px;
        }
        
        /* Serif font utility approximation */
        .font-serif { font-family: "Playfair Display", "Georgia", serif; }
        .font-sans { font-family: ${theme.fontFamily}; }
        
        @keyframes fade-in { 
          from { opacity: 0; } 
          to { opacity: 1; } 
        }
        @keyframes fade-in-up { 
          from { transform: translateY(20px); opacity: 0; } 
          to { transform: translateY(0); opacity: 1; } 
        }
        @keyframes zoom-in { 
          from { transform: scale(0.98); opacity: 0; } 
          to { transform: scale(1); opacity: 1; } 
        }
        
        .animate-fade-in { animation: fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .animate-fade-in-up { animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .animate-zoom-in { animation: zoom-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) both; }
      `}</style>
    </main>
  );
}