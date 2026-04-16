"use client";

import React, { useState } from "react";
import Script from "next/script";
import {
  useWebsiteBuilderStore,
  useRegionValue,
} from "@/store/useWebsiteBuilderStore";
import { useThemeStore } from "@/store/useThemeStore";

export const template1Meta = {
  id: "business/template1",
  name: "Clyra Modern Ecommerce",
  image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600&auto=format&fit=crop",
};

type TemplateProps = {
  editableData?: any;
};

const getNestedValue = (obj: any, path: string) => {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
};

export default function Template1({ editableData }: TemplateProps) {
  const [activePage, setActivePage] = useState("home");
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

  const Section = ({ children, id, bgType = "primary" }: any) => (
    <section
      id={id}
      style={{
        padding: `${theme.sectionSpacing}px 24px`,
        backgroundColor: bgType === "primary" ? theme.backgroundColor : theme.secondaryColor,
        color: theme.textColor,
      }}
      className="w-full flex justify-center overflow-hidden"
    >
      <div className="w-full max-w-7xl">{children}</div>
    </section>
  );

  const Navbar = () => (
    <nav
      className="sticky top-0 w-full z-40 backdrop-blur-md border-b"
      style={{
        backgroundColor: `${theme.backgroundColor}CC`,
        borderColor: `${theme.textColor}15`,
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-3 lg:gap-4 overflow-hidden">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <EditableImg
            regionKey="global.logo"
            fallback="https://images.unsplash.com/photo-1549463591-14cc5bd1f008?w=100&h=100&fit=crop"
            className="w-10 h-10 object-cover rounded-lg"
          />
          <EditableText
            regionKey="global.brand"
            fallback="CLYRA LUX"
            className="font-bold text-xl tracking-tighter whitespace-nowrap"
          />
        </div>

        <div className="hidden md:flex items-center gap-8 px-4">
          {["Home", "About", "Contact"].map((page) => (
            <button
              key={page}
              onClick={() => setActivePage(page.toLowerCase())}
              className={`text-sm font-semibold transition-colors uppercase tracking-widest ${
                activePage === page.toLowerCase() ? "" : "opacity-50 hover:opacity-100"
              }`}
              style={{ color: activePage === page.toLowerCase() ? theme.primaryColor : theme.textColor }}
            >
              {page}
            </button>
          ))}
        </div>

        <div className="flex-shrink-0">
          <button
            className="px-6 py-2.5 font-bold text-sm transition-transform active:scale-95"
            style={{
              backgroundColor: theme.primaryColor,
              color: "#fff",
              borderRadius: `${theme.borderRadius}px`,
            }}
          >
            <EditableText regionKey="global.navCta" fallback="SHOP NOW" />
          </button>
        </div>
      </div>
    </nav>
  );

  const Footer = () => (
    <footer
      className="py-20 px-6 border-t"
      style={{
        backgroundColor: theme.backgroundColor,
        color: theme.textColor,
        borderColor: `${theme.textColor}10`,
      }}
    >
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12 text-center md:text-left">
        <div className="space-y-4">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <EditableImg
              regionKey="global.logo"
              fallback="https://images.unsplash.com/photo-1549463591-14cc5bd1f008?w=100&h=100&fit=crop"
              className="w-8 h-8 rounded-full"
            />
            <EditableText regionKey="global.brand" fallback="CLYRA LUX" className="font-bold" />
          </div>
          <EditableText
            as="p"
            regionKey="footer.desc"
            fallback="Redefining modern commerce with AI-driven aesthetics."
            className="text-sm opacity-60 leading-relaxed block"
          />
        </div>
        <div className="flex flex-col gap-4">
          <h4 className="font-bold uppercase tracking-widest text-xs opacity-40">Pages</h4>
          {["Home", "About", "Contact"].map((p) => (
            <button key={p} onClick={() => setActivePage(p.toLowerCase())} className="hover:underline text-sm w-fit mx-auto md:mx-0">
              {p}
            </button>
          ))}
        </div>
        <div className="space-y-4">
          <h4 className="font-bold uppercase tracking-widest text-xs opacity-40">Contact</h4>
          <EditableText regionKey="footer.email" fallback="sales@clyra-lux.com" className="text-sm block" />
          <EditableText regionKey="footer.copy" fallback="© 2024 Clyra. Built for Scale." className="text-xs opacity-30 block pt-4" />
        </div>
      </div>
    </footer>
  );

  // --- PAGE VIEWS ---
  const HomeView = () => (
    <div className="animate-in fade-in duration-700">
      <Section id="hero">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <EditableText
              as="h1"
              regionKey="hero.title"
              fallback="Luxury Goods, Reimagined."
              className="text-6xl md:text-8xl font-black leading-[0.95] tracking-tighter block"
            />
            <EditableText
              as="p"
              regionKey="hero.subtitle"
              fallback="The premier destination for high-end digital and physical assets, curated by intelligence."
              className="text-xl opacity-70 leading-relaxed block max-w-lg"
            />
            <button
              className="px-10 py-5 font-black uppercase tracking-widest text-sm shadow-xl hover:translate-y-[-2px] transition-all"
              style={{ backgroundColor: theme.primaryColor, color: "#fff", borderRadius: `${theme.borderRadius}px` }}
            >
              <EditableText regionKey="hero.btn1" fallback="Explore Collection" />
            </button>
          </div>
          <div className="relative">
            <EditableImg
              regionKey="hero.img"
              fallback="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1000&auto=format&fit=crop"
              className="w-full aspect-[4/5] object-cover shadow-2xl"
              style={{ borderRadius: `${theme.borderRadius * 2}px` }}
            />
          </div>
        </div>
      </Section>
    </div>
  );

  const AboutView = () => (
    <Section id="about">
      <div className="grid lg:grid-cols-2 gap-20 items-center animate-in slide-in-from-bottom-4 duration-700">
        <EditableImg
          regionKey="about.img"
          fallback="https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1000&fit=crop"
          className="w-full aspect-video lg:aspect-[4/5] object-cover shadow-2xl"
          style={{ borderRadius: `${theme.borderRadius * 2}px` }}
        />
        <div className="space-y-6">
          <EditableText as="h2" regionKey="about.title" fallback="Our AI-Crafted Story" className="text-5xl font-black tracking-tighter block" />
          <EditableText
            as="p"
            regionKey="about.desc"
            fallback="At Clyra, we believe commerce is an art form. We combine the precision of predictive algorithms with the soul of human craftsmanship."
            className="text-lg opacity-70 leading-relaxed block"
          />
        </div>
      </div>
    </Section>
  );

  const ContactView = () => (
    <Section id="contact">
      <div className="max-w-4xl mx-auto text-center animate-in zoom-in-95 duration-500">
        <EditableText as="h1" regionKey="contact.title" fallback="Global Concierge" className="text-6xl font-black tracking-tighter block mb-12" />
        <div className="grid md:grid-cols-2 gap-12 bg-white/5 p-12 backdrop-blur-xl border border-white/10" style={{ borderRadius: `${theme.borderRadius * 3}px` }}>
          <div className="text-left space-y-8">
            <div>
              <h4 className="text-xs font-black uppercase opacity-40 tracking-widest mb-2">Location</h4>
              <EditableText regionKey="contact.address" fallback="1200 Avenue of the Americas, NY" className="font-bold block" />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase opacity-40 tracking-widest mb-2">Email</h4>
              <EditableText regionKey="contact.email" fallback="vip@clyra.com" className="font-bold block" />
            </div>
          </div>
          <div className="space-y-4">
            <input className="w-full p-4 bg-transparent border-b outline-none" style={{ borderColor: `${theme.textColor}20` }} placeholder="Your Name" />
            <button className="w-full py-5 font-black uppercase tracking-widest text-xs" style={{ backgroundColor: theme.primaryColor, color: "#fff", borderRadius: `${theme.borderRadius}px` }}>
              <EditableText regionKey="contact.submit" fallback="Send Inquiry" />
            </button>
          </div>
        </div>
      </div>
    </Section>
  );

  return (
    <main
      className="min-h-screen selection:bg-blue-500 selection:text-white"
      style={{ fontFamily: theme.fontFamily, backgroundColor: theme.backgroundColor }}
    >
      {/* Cloudinary Script Loading */}
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
        html { scroll-behavior: smooth; }
        [contenteditable]:focus { outline: none; background: rgba(0,0,0,0.02); }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-in-from-bottom-4 { from { transform: translateY(1rem); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes zoom-in-95 { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-in { animation-duration: 0.5s; animation-fill-mode: both; }
        .fade-in { animation-name: fade-in; }
        .slide-in-from-bottom-4 { animation-name: slide-in-from-bottom-4; }
        .zoom-in-95 { animation-name: zoom-in-95; }
      `}</style>
    </main>
  );
}




