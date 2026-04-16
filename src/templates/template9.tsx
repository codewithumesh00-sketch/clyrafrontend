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

export const template9Meta = {
  id: "business/template9",
  name: "Real Estate Prime",
  image:
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1600&auto=format&fit=crop",
};

const getNestedValue = (obj: any, path: string) => {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
};

export default function Template9({ editableData }: TemplateProps) {
  const [activePage, setActivePage] = useState<"home" | "about" | "contact">("home");
  const { theme } = useThemeStore();
  const updateRegion = useWebsiteBuilderStore((state: any) => state.updateRegion);

  // --- CLOUDINARY HANDLER ---
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

  // --- CLYRA EDITABLE WRAPPERS ---
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
        className={`cursor-pointer transition-opacity hover:opacity-95 ${className}`}
        onDoubleClick={(e) => {
          e.stopPropagation();
          handleImageUpload(regionKey);
        }}
      />
    );
  };

  // --- LAYOUT COMPONENTS ---
  const Section = ({ children, bg = "primary", className = "" }: any) => (
    <section
      className={`w-full flex justify-center overflow-hidden py-16 sm:py-24 px-4 sm:px-6 lg:px-8 ${className}`}
      style={{
        backgroundColor: bg === "primary" ? theme.backgroundColor : theme.secondaryColor,
        color: theme.textColor,
      }}
    >
      <div className="w-full max-w-7xl">{children}</div>
    </section>
  );

  const Navbar = () => (
    <nav 
      className="sticky top-0 w-full z-50 border-b backdrop-blur-md"
      style={{ backgroundColor: `${theme.backgroundColor}EE`, borderColor: `${theme.textColor}15` }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between overflow-hidden">
        <div className="flex items-center gap-2 min-w-0">
          <EditableImg regionKey="global.logo" fallback="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=100" className="w-8 h-8 rounded" />
          <EditableText regionKey="global.brand" fallback="PRIME ESTATES" className="font-bold tracking-widest text-lg whitespace-nowrap" />
        </div>
        
        <div className="hidden md:flex items-center gap-10">
          {["Home", "About", "Contact"].map((p) => (
            <button
              key={p}
              onClick={() => setActivePage(p.toLowerCase() as any)}
              className="text-xs font-bold tracking-widest transition-colors"
              style={{ color: activePage === p.toLowerCase() ? theme.primaryColor : theme.textColor, opacity: activePage === p.toLowerCase() ? 1 : 0.6 }}
            >
              {p.toUpperCase()}
            </button>
          ))}
        </div>

        <button 
          className="px-6 py-2 text-xs font-bold tracking-widest border transition-all"
          style={{ borderColor: theme.primaryColor, color: theme.primaryColor, borderRadius: `${theme.borderRadius}px` }}
        >
          <EditableText regionKey="nav.cta" fallback="BOOK VIEWING" />
        </button>
      </div>
    </nav>
  );

  // --- VIEWS ---
  const HomeView = () => (
    <div className="w-full">
      <Section className="!pt-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-xs font-bold tracking-[0.3em] uppercase opacity-50">
              <span className="w-8 h-[1px] bg-current"></span>
              <EditableText regionKey="hero.tag" fallback="Luxury Real Estate" />
            </div>
            <EditableText 
              as="h1" 
              regionKey="hero.title" 
              fallback="Find Your Sanctuary." 
              className="text-5xl sm:text-7xl font-light leading-tight block break-words" 
            />
            <EditableText 
              as="p" 
              regionKey="hero.sub" 
              fallback="Exclusive listings in the world's most desirable locations. Designed for those who appreciate the finer details of architecture." 
              className="text-lg opacity-70 block max-w-md leading-relaxed" 
            />
            <div className="pt-4">
              <button 
                className="px-8 py-4 text-white font-bold text-xs tracking-widest shadow-2xl transition-transform active:scale-95"
                style={{ backgroundColor: theme.primaryColor, borderRadius: `${theme.borderRadius}px` }}
              >
                <EditableText regionKey="hero.btn" fallback="VIEW LISTINGS" />
              </button>
            </div>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden shadow-2xl" style={{ borderRadius: `${theme.borderRadius * 4}px` }}>
            <EditableImg regionKey="hero.mainImg" fallback="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200" className="w-full h-full object-cover" />
          </div>
        </div>
      </Section>

      <Section bg="secondary">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <EditableText as="h2" regionKey="featured.title" fallback="Featured Portfolio" className="text-3xl font-light tracking-tight block" />
          <EditableText as="p" regionKey="featured.desc" fallback="A handpicked selection of our most prestigious properties currently available." className="opacity-60 block" />
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="group space-y-4">
              <div className="aspect-square overflow-hidden" style={{ borderRadius: `${theme.borderRadius * 2}px` }}>
                <EditableImg regionKey={`prop.${i}.img`} fallback={`https://images.unsplash.com/photo-1600${50 + i}5154340-be6161a56a0c?w=600`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div>
                <EditableText regionKey={`prop.${i}.price`} fallback="$4,500,000" className="text-sm font-bold block" />
                <EditableText regionKey={`prop.${i}.title`} fallback="The Glass Pavilion" className="text-xl font-light block" />
                <EditableText regionKey={`prop.${i}.loc`} fallback="Malibu, California" className="text-xs opacity-50 uppercase tracking-widest block" />
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );

  const AboutView = () => (
    <Section>
      <div className="grid lg:grid-cols-2 gap-20 items-center">
        <div className="order-2 lg:order-1 relative">
          <div className="absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 opacity-20" style={{ borderColor: theme.textColor }}></div>
          <EditableImg regionKey="about.img" fallback="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1000" className="w-full aspect-[3/4] object-cover shadow-xl" style={{ borderRadius: `${theme.borderRadius}px` }} />
        </div>
        <div className="order-1 lg:order-2 space-y-8">
          <EditableText as="h2" regionKey="about.title" fallback="Legacy of Excellence" className="text-4xl sm:text-5xl font-light block" />
          <div className="space-y-4 text-lg opacity-70 leading-relaxed">
            <EditableText as="p" regionKey="about.p1" fallback="Founded on the principles of transparency and bespoke service, Prime Estates has navigated the high-end market for over two decades." className="block" />
            <EditableText as="p" regionKey="about.p2" fallback="We don't just sell houses; we curate lifestyles for the discerning individual who demands nothing but the absolute peak of architectural integrity." className="block" />
          </div>
          <div className="grid grid-cols-2 gap-8 pt-6 border-t" style={{ borderColor: `${theme.textColor}15` }}>
            <div>
              <div className="text-3xl font-bold" style={{ color: theme.primaryColor }}>20+</div>
              <div className="text-xs uppercase tracking-widest opacity-50">Years Experience</div>
            </div>
            <div>
              <div className="text-3xl font-bold" style={{ color: theme.primaryColor }}>$2B+</div>
              <div className="text-xs uppercase tracking-widest opacity-50">Assets Managed</div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );

  const ContactView = () => (
    <Section>
      <div className="max-w-5xl mx-auto grid lg:grid-cols-5 gap-12">
        <div className="lg:col-span-2 space-y-10">
          <EditableText as="h2" regionKey="contact.title" fallback="Connect With Our Partners" className="text-4xl font-light block" />
          <div className="space-y-6">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 mb-1">Global HQ</span>
              <EditableText regionKey="contact.address" fallback="Mayfair, London, UK" className="text-lg block" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 mb-1">Direct Line</span>
              <EditableText regionKey="contact.phone" fallback="+44 20 7946 0958" className="text-lg block" />
            </div>
          </div>
        </div>
        <div className="lg:col-span-3 bg-neutral-50 p-8 sm:p-12" style={{ backgroundColor: theme.secondaryColor, borderRadius: `${theme.borderRadius * 2}px` }}>
          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <input placeholder="Name" className="w-full bg-transparent border-b py-3 outline-none focus:border-black transition-colors" style={{ borderColor: `${theme.textColor}20` }} />
              <input placeholder="Email" className="w-full bg-transparent border-b py-3 outline-none focus:border-black transition-colors" style={{ borderColor: `${theme.textColor}20` }} />
            </div>
            <textarea placeholder="Tell us about your dream property..." rows={4} className="w-full bg-transparent border-b py-3 outline-none focus:border-black transition-colors resize-none" style={{ borderColor: `${theme.textColor}20` }} />
            <button className="w-full py-4 text-white font-bold text-xs tracking-widest" style={{ backgroundColor: theme.primaryColor, borderRadius: `${theme.borderRadius}px` }}>
              <EditableText regionKey="contact.submit" fallback="SEND INQUIRY" />
            </button>
          </div>
        </div>
      </div>
    </Section>
  );

  return (
    <div 
      className="min-h-screen w-full selection:bg-black selection:text-white overflow-x-hidden"
      style={{ fontFamily: theme.fontFamily, backgroundColor: theme.backgroundColor }}
    >
      <Script 
        src="https://upload-widget.cloudinary.com/global/all.js" 
        strategy="afterInteractive" 
      />
      
      <Navbar />
      
      <main className="w-full min-w-0">
        {activePage === "home" && <HomeView />}
        {activePage === "about" && <AboutView />}
        {activePage === "contact" && <ContactView />}
      </main>

      <footer className="w-full py-20 px-4 sm:px-6 lg:px-8 border-t" style={{ backgroundColor: theme.backgroundColor, borderColor: `${theme.textColor}10`, color: theme.textColor }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          <div className="space-y-2">
            <EditableText regionKey="global.brand" fallback="PRIME ESTATES" className="font-bold tracking-[0.3em] block" />
            <EditableText regionKey="footer.copy" fallback="© 2024 Prime Estates International. All Rights Reserved." className="text-[10px] opacity-40 block" />
          </div>
          <div className="flex gap-8">
            {["Instagram", "LinkedIn", "Twitter"].map(s => (
              <EditableText key={s} regionKey={`social.${s.toLowerCase()}`} fallback={s} className="text-[10px] font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity cursor-pointer" />
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}




