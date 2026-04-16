"use client";

import React, { useState } from "react";
import Script from "next/script";
import {
  useWebsiteBuilderStore,
  useRegionValue,
} from "@/store/useWebsiteBuilderStore";
import { useThemeStore } from "@/store/useThemeStore";

export const template8Meta = {
  id: "business/template8",
  name: "Furniture Showcase",
  image:
    "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1600&auto=format&fit=crop",
};

type TemplateProps = {
  editableData?: any;
};

export default function Template8({ editableData }: TemplateProps) {
  const [activePage, setActivePage] = useState<"home" | "about" | "contact">("home");
  const { theme } = useThemeStore();
  const updateRegion = useWebsiteBuilderStore((state: any) => state.updateRegion);

  const getNestedValue = (obj: any, path: string) => {
    return path.split(".").reduce((acc, part) => acc && acc[part], obj);
  };

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
        className={`focus:outline-none focus:ring-1 focus:ring-blue-400/30 transition-all ${className}`}
      >
        {content}
      </Tag>
    );
  };

  const EditableImg = ({ regionKey, fallback, className = "", alt = "Furniture" }: any) => {
    const hookValue = useRegionValue(regionKey);
    const dataValue = getNestedValue(editableData, regionKey);
    const src = hookValue ?? dataValue ?? fallback;

    return (
      <img
        src={src}
        alt={alt}
        className={`cursor-pointer transition-opacity hover:opacity-90 max-w-full ${className}`}
        onDoubleClick={(e) => {
          e.stopPropagation();
          handleImageUpload(regionKey);
        }}
      />
    );
  };

  const HomeView = () => (
    <div className="w-full space-y-32 py-12 animate-in fade-in duration-1000">
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-8">
            <EditableText
              as="h1"
              regionKey="home.heroTitle"
              fallback="Artisanal Heritage. Modern Living."
              className="text-6xl md:text-8xl font-light tracking-tighter leading-[0.9] block"
            />
            <EditableText
              as="p"
              regionKey="home.heroDesc"
              fallback="We curate essential pieces that define the modern home—blending sustainable materials with timeless Scandinavian craftsmanship."
              className="text-xl opacity-60 block max-w-lg leading-relaxed"
            />
            <button
              className="px-12 py-5 text-xs font-bold uppercase tracking-[0.3em] transition-all hover:opacity-80 active:scale-95 shadow-lg"
              style={{
                backgroundColor: theme.primaryColor,
                color: "#fff",
                borderRadius: `${theme.borderRadius}px`,
              }}
            >
              <EditableText regionKey="home.heroCta" fallback="Explore Collection" />
            </button>
          </div>
          <div className="lg:col-span-5 relative">
            <EditableImg
              regionKey="home.heroImg"
              fallback="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1200&auto=format&fit=crop"
              className="w-full aspect-[3/4] object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700"
              style={{ borderRadius: `${theme.borderRadius}px` }}
            />
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 py-24" style={{ backgroundColor: theme.secondaryColor }}>
        <div className="max-w-3xl mx-auto text-center mb-20 space-y-4">
          <EditableText as="h2" regionKey="home.gridTitle" fallback="The Autumn Edit" className="text-4xl font-light block" />
          <div className="w-24 h-px bg-current mx-auto opacity-20" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-6">
              <div className="overflow-hidden bg-white">
                <EditableImg
                  regionKey={`home.item${i}Img`}
                  fallback={`https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?q=80&w=800&auto=format&fit=crop`}
                  className="w-full aspect-square object-cover"
                />
              </div>
              <div className="space-y-1">
                <EditableText regionKey={`home.item${i}Name`} fallback="Hand-Stitched Lounge" className="text-sm font-bold uppercase tracking-widest block" />
                <EditableText regionKey={`home.item${i}Price`} fallback="$1,200" className="text-sm opacity-50 block" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  const AboutView = () => (
    <div className="px-4 sm:px-6 lg:px-8 py-24 max-w-6xl mx-auto space-y-32 animate-in slide-in-from-bottom-8 duration-700">
      <div className="text-center space-y-6">
        <EditableText as="h1" regionKey="about.title" fallback="Honest Design." className="text-7xl font-light block" />
        <EditableText as="p" regionKey="about.sub" fallback="Transparency from forest to floor." className="text-xl opacity-50 block" />
      </div>
      <div className="grid md:grid-cols-2 gap-24 items-center">
        <EditableImg
          regionKey="about.mainImg"
          fallback="https://images.unsplash.com/photo-1517705008128-361805f42e86?q=80&w=1000&auto=format&fit=crop"
          className="w-full aspect-[4/5] object-cover"
        />
        <div className="space-y-8">
          <EditableText
            as="p"
            regionKey="about.para1"
            fallback="We believe that furniture is an investment in your quality of life. Our studio works exclusively with reclaimed solid oak and recycled steel, ensuring that every joint and finish is built to endure for generations."
            className="text-2xl leading-relaxed block font-light"
          />
          <EditableText
            as="p"
            regionKey="about.para2"
            fallback="Located in the heart of Copenhagen, our master woodworkers translate raw materials into functional poetry. No fast furniture. No compromises."
            className="text-lg opacity-60 leading-relaxed block"
          />
        </div>
      </div>
    </div>
  );

  const ContactView = () => (
    <div className="px-4 sm:px-6 lg:px-8 py-32 max-w-5xl mx-auto animate-in zoom-in-95 duration-500">
      <div className="grid lg:grid-cols-2 gap-24">
        <div className="space-y-12">
          <EditableText as="h1" regionKey="contact.title" fallback="Showroom Inquiries" className="text-6xl font-light leading-tight block" />
          <div className="space-y-8">
            <div>
              <h4 className="text-[10px] uppercase tracking-[0.4em] opacity-40 mb-3 font-black">Visit Our Studio</h4>
              <EditableText regionKey="contact.address" fallback="Kronprinsensgade 12, 1114 København, Denmark" className="block text-xl" />
            </div>
            <div>
              <h4 className="text-[10px] uppercase tracking-[0.4em] opacity-40 mb-3 font-black">Concierge</h4>
              <EditableText regionKey="contact.email" fallback="bespoke@oak-and-iron.com" className="block text-xl" />
            </div>
          </div>
        </div>
        <div className="p-12 border border-current opacity-90 space-y-6" style={{ borderRadius: `${theme.borderRadius}px` }}>
          <input
            type="text"
            placeholder="COLLECTION INTEREST"
            className="w-full bg-transparent border-b py-4 focus:outline-none placeholder:text-current placeholder:opacity-30 text-xs tracking-widest font-bold uppercase"
            style={{ borderColor: `${theme.textColor}30` }}
          />
          <textarea
            placeholder="TELL US ABOUT YOUR SPACE"
            rows={5}
            className="w-full bg-transparent border-b py-4 focus:outline-none placeholder:text-current placeholder:opacity-30 text-xs tracking-widest font-bold uppercase"
            style={{ borderColor: `${theme.textColor}30` }}
          />
          <button
            className="w-full py-6 text-[10px] font-black uppercase tracking-[0.5em] mt-4"
            style={{ backgroundColor: theme.primaryColor, color: "#fff", borderRadius: `${theme.borderRadius}px` }}
          >
            <EditableText regionKey="contact.btn" fallback="Book Consultation" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className="w-full min-h-screen overflow-x-hidden flex flex-col"
      style={{
        backgroundColor: theme.backgroundColor,
        color: theme.textColor,
        fontFamily: theme.fontFamily || "inherit",
      }}
    >
      <script src="https://upload-widget.cloudinary.com/global/all.js" async></script>

      {/* Navigation */}
      <nav className="w-full border-b sticky top-0 z-50 backdrop-blur-xl" style={{ borderColor: `${theme.textColor}10`, backgroundColor: `${theme.backgroundColor}F2` }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-24 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <EditableImg
              regionKey="nav.logo"
              fallback="https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=100&h=100&fit=crop"
              className="w-12 h-12 object-cover"
              style={{ borderRadius: theme.borderRadius }}
            />
            <EditableText regionKey="nav.brand" fallback="OAK & IRON" className="font-black tracking-[0.4em] text-xs uppercase" />
          </div>

          <div className="hidden md:flex gap-12">
            {["home", "about", "contact"].map((p) => (
              <button
                key={p}
                onClick={() => setActivePage(p as any)}
                className={`text-[10px] uppercase tracking-[0.4em] font-black transition-all ${activePage === p ? "opacity-100" : "opacity-30 hover:opacity-100"}`}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            className="px-6 py-3 text-[10px] font-black uppercase tracking-[0.3em] border border-current transition-all hover:bg-current hover:text-white"
            style={{ borderRadius: `${theme.borderRadius}px` }}
          >
            <EditableText regionKey="nav.cta" fallback="Login" />
          </button>
        </div>
      </nav>

      {/* Viewport */}
      <main className="flex-1 w-full max-w-7xl mx-auto">
        {activePage === "home" && <HomeView />}
        {activePage === "about" && <AboutView />}
        {activePage === "contact" && <ContactView />}
      </main>

      {/* Footer */}
      <footer className="w-full border-t py-24 px-4 sm:px-6 lg:px-8 mt-32" style={{ borderColor: `${theme.textColor}10`, backgroundColor: theme.secondaryColor }}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="md:col-span-2 space-y-8">
            <EditableText regionKey="nav.brand" fallback="OAK & IRON" className="font-black tracking-[0.5em] text-sm block" />
            <EditableText as="p" regionKey="footer.bio" fallback="Sustainable furniture for the modern minimalist. Every piece is handcrafted in our Copenhagen studio using reclaimed materials and traditional techniques." className="text-sm opacity-40 block max-w-md leading-relaxed" />
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30">Quick Navigation</h4>
            {["Home", "About", "Contact"].map(p => (
              <button key={p} onClick={() => setActivePage(p.toLowerCase() as any)} className="text-sm w-fit opacity-60 hover:opacity-100 transition-opacity uppercase tracking-widest">{p}</button>
            ))}
          </div>
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30">Legal</h4>
            <EditableText regionKey="footer.copy" fallback="© 2024 Oak & Iron Studio. All rights reserved." className="text-[10px] opacity-40 block tracking-widest leading-loose" />
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-in-from-bottom-8 { from { transform: translateY(2rem); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes zoom-in-95 { from { transform: scale(0.98); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-in { animation-duration: 0.8s; animation-fill-mode: both; }
        .fade-in { animation-name: fade-in; }
        .slide-in-from-bottom-8 { animation-name: slide-in-from-bottom-8; }
        .zoom-in-95 { animation-name: zoom-in-95; }
        [contenteditable]:focus { outline: none; border-bottom: 1px dashed rgba(0,0,0,0.1); }
      `}</style>
    </div>
  );
}





