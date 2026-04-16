"use client";

import React, { useState } from "react";
import Script from "next/script";
import {
  useWebsiteBuilderStore,
  useRegionValue,
} from "@/store/useWebsiteBuilderStore";
import { useThemeStore } from "@/store/useThemeStore";

type TemplateProps = {
  editableData?: any;
};

export const template2Meta = {
  id: "business/template2",
  name: "Clyra E-commerce Elite",
  image:
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600&auto=format&fit=crop",
};

export default function Template2({ editableData }: TemplateProps) {
  const [activePage, setActivePage] = useState<"home" | "about" | "contact">("home");
  const { theme } = useThemeStore();
  const updateRegion = useWebsiteBuilderStore((state: any) => state.updateRegion);

  // --- Helper to resolve data from Store or Props ---
  const getVal = (path: string, fallback: string) => {
    const hookVal = useRegionValue(path);
    if (hookVal !== undefined && hookVal !== null) return hookVal;
    
    const parts = path.split(".");
    let current = editableData;
    for (const part of parts) {
      if (current && current[part] !== undefined) {
        current = current[part];
      } else {
        return fallback;
      }
    }
    return current ?? fallback;
  };

  // --- Cloudinary Integration ---
  const handleImageUpload = (path: string) => {
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
              updateRegion(path, result.info.secure_url);
            }
          }
        )
        .open();
    }
  };

  // --- Shared Editable Components ---
  const EditableText = ({ path, fallback, as: Tag = "span", className = "" }: any) => {
    const val = getVal(path, fallback);
    return (
      <Tag
        contentEditable
        suppressContentEditableWarning
        className={`focus:ring-2 focus:ring-blue-500 rounded-sm transition-all outline-none ${className}`}
        onBlur={(e: React.FocusEvent<HTMLElement>) => {
          const newText = e.currentTarget.innerText;
          if (newText !== val) updateRegion(path, newText);
        }}
        onDoubleClick={(e: React.MouseEvent) => {
          e.stopPropagation();
          (e.currentTarget as HTMLElement).focus();
        }}
      >
        {val}
      </Tag>
    );
  };

  const EditableImg = ({ path, fallback, className = "", style = {} }: any) => {
    const src = getVal(path, fallback);
    return (
      <img
        src={src}
        alt="Product/Content"
        style={style}
        className={`cursor-pointer hover:opacity-95 transition-opacity ${className}`}
        onDoubleClick={(e) => {
          e.stopPropagation();
          handleImageUpload(path);
        }}
      />
    );
  };

  // --- Layout Components ---
  const Navigation = () => (
    <nav 
      className="sticky top-0 z-50 w-full border-b backdrop-blur-xl"
      style={{ backgroundColor: `${theme.backgroundColor}ee`, borderColor: `${theme.textColor}15` }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between overflow-hidden">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActivePage("home")}>
          <EditableImg 
            path="brand.logo" 
            fallback="https://images.unsplash.com/photo-1549463591-14cc5bd1f008?w=100&h=100&fit=crop" 
            className="w-8 h-8 rounded-full object-cover"
          />
          <EditableText path="brand.name" fallback="ESTRELLA" className="font-black tracking-[0.2em] text-lg" />
        </div>

        <div className="hidden md:flex items-center gap-10">
          {(["home", "about", "contact"] as const).map((page) => (
            <button
              key={page}
              onClick={() => setActivePage(page)}
              className="text-[10px] uppercase tracking-[0.3em] font-bold transition-all"
              style={{ 
                color: theme.textColor, 
                opacity: activePage === page ? 1 : 0.4,
                borderBottom: activePage === page ? `2px solid ${theme.primaryColor}` : '2px solid transparent'
              }}
            >
              {page}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <button className="relative p-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
            <span className="absolute top-0 right-0 text-[8px] w-4 h-4 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: theme.primaryColor }}>0</span>
          </button>
        </div>
      </div>
    </nav>
  );

  const Footer = () => (
    <footer 
      className="w-full border-t py-20 mt-auto px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: theme.backgroundColor, color: theme.textColor, borderColor: `${theme.textColor}10` }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2 space-y-6">
          <EditableText path="brand.name" fallback="ESTRELLA" className="font-black tracking-[0.2em] text-xl block" />
          <EditableText path="footer.about" fallback="Curating the world's most exceptional pieces for the modern enthusiast." className="block text-sm opacity-60 leading-relaxed max-w-sm" />
        </div>
        <div className="flex flex-col gap-4">
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Support</p>
          <EditableText path="footer.link1" fallback="Shipping & Returns" className="text-sm cursor-pointer hover:underline block" />
          <EditableText path="footer.link2" fallback="Privacy Policy" className="text-sm cursor-pointer hover:underline block" />
        </div>
        <div className="flex flex-col gap-4">
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Newsletter</p>
          <div className="flex border-b pb-2" style={{ borderColor: `${theme.textColor}30` }}>
            <input type="email" placeholder="Email address" className="bg-transparent text-sm flex-1 outline-none" />
            <button className="text-[10px] font-bold uppercase tracking-tighter">Join</button>
          </div>
        </div>
      </div>
    </footer>
  );

  const HomeView = () => (
    <div className="w-full animate-in fade-in duration-700">
      <section className="w-full relative h-[85vh] flex items-center justify-center overflow-hidden">
        <EditableImg 
          path="home.heroImg" 
          fallback="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2000&auto=format&fit=crop" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 text-center px-4 space-y-8 max-w-4xl">
          <EditableText 
            path="home.heroTitle" 
            fallback="THE 2024 NOIR ARCHIVE" 
            className="text-white text-5xl md:text-9xl font-black tracking-tighter block leading-none" 
          />
          <EditableText 
            path="home.heroSubtitle" 
            fallback="A curated selection of seasonal essentials crafted for the avant-garde." 
            className="text-white text-sm md:text-lg opacity-90 block tracking-[0.2em] uppercase max-w-2xl mx-auto" 
          />
          <button 
            className="mt-8 px-14 py-5 text-[10px] font-bold tracking-[0.5em] uppercase transition-all hover:scale-105 active:scale-95 shadow-2xl"
            style={{ backgroundColor: '#fff', color: '#000', borderRadius: `${theme.borderRadius}px` }}
          >
            Shop Now
          </button>
        </div>
      </section>

      <section className="max-w-7xl mx-auto py-32 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-4">
          <div>
            <p className="text-[10px] font-bold tracking-[0.4em] uppercase opacity-40 mb-3">Seasonal Drop</p>
            <EditableText path="home.featuredTitle" fallback="New Arrivals" className="text-5xl font-black tracking-tight block" />
          </div>
          <button className="text-[10px] font-black tracking-[0.3em] uppercase border-b-2 pb-2 transition-opacity hover:opacity-60" style={{ borderColor: theme.primaryColor }}>Explore All</button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
          {[1, 2, 3].map((i) => (
            <div key={i} className="group cursor-pointer">
              <div className="relative aspect-[3/4] overflow-hidden mb-8" style={{ borderRadius: `${theme.borderRadius}px` }}>
                <EditableImg 
                  path={`home.product${i}.img`} 
                  fallback={`https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80`} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute top-6 right-6 bg-white/90 backdrop-blur px-4 py-2 text-[10px] font-black tracking-widest shadow-xl">COLLECTION</div>
              </div>
              <div className="space-y-2">
                <EditableText path={`home.product${i}.name`} fallback="Asymmetric Silk Wrap" className="block font-bold text-sm uppercase tracking-wide" />
                <div className="flex items-center gap-1 opacity-60">
                  <span className="text-sm font-medium">$</span>
                  <EditableText path={`home.product${i}.price`} fallback="320.00" className="text-sm font-medium" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  const AboutView = () => (
    <div className="max-w-7xl mx-auto py-32 px-4 sm:px-6 lg:px-8 space-y-40 animate-in slide-in-from-bottom-8 duration-700">
      <div className="grid md:grid-cols-2 gap-24 items-center">
        <div className="space-y-10 order-2 md:order-1">
          <EditableText path="about.title" fallback="Radical Transparency in Luxury" className="text-6xl md:text-7xl font-black tracking-tighter leading-[0.9] block" />
          <EditableText path="about.content" fallback="We founded Estrella on the principle that true luxury lies in the details—not just of the product, but of the supply chain. Our pieces are sourced from sustainable workshops that prioritize the artisan over the assembly line." className="block text-xl opacity-70 leading-relaxed font-light" />
          <div className="pt-6">
            <button className="px-10 py-4 border-2 font-bold text-[10px] tracking-[0.3em] uppercase transition-all hover:bg-black hover:text-white" style={{ borderColor: theme.textColor, borderRadius: `${theme.borderRadius}px` }}>Learn More</button>
          </div>
        </div>
        <div className="order-1 md:order-2">
          <EditableImg path="about.img" fallback="https://images.unsplash.com/photo-1441984904996-e0b6ba687e12?w=1000&fit=crop" className="w-full aspect-square object-cover shadow-2xl" style={{ borderRadius: `${theme.borderRadius * 4}px` }} />
        </div>
      </div>
    </div>
  );

  const ContactView = () => (
    <div className="max-w-7xl mx-auto py-32 px-4 sm:px-6 lg:px-8 animate-in zoom-in-95 duration-500">
      <div className="grid lg:grid-cols-3 gap-24">
        <div className="lg:col-span-1 space-y-16">
          <EditableText path="contact.title" fallback="Connect with our Studio" className="text-7xl font-black tracking-tighter block leading-none" />
          <div className="space-y-10">
            <div>
              <p className="text-[10px] uppercase font-black tracking-[0.4em] opacity-40 mb-4">Mailing Address</p>
              <EditableText path="contact.address" fallback="422 Broadway, SoHo, NY 10013" className="block text-base font-medium" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-black tracking-[0.4em] opacity-40 mb-4">Press & Sales</p>
              <EditableText path="contact.email" fallback="studio@estrella.archive" className="block text-base font-black border-b w-fit" />
            </div>
          </div>
        </div>
        <div className="lg:col-span-2 bg-neutral-50/50 border p-12 md:p-20" style={{ borderRadius: `${theme.borderRadius * 5}px`, borderColor: `${theme.textColor}10` }}>
          <div className="grid md:grid-cols-2 gap-10 mb-10">
            <div className="space-y-3">
              <label className="text-[10px] uppercase font-black tracking-widest opacity-40">Identity</label>
              <input type="text" placeholder="Your Name" className="w-full bg-white p-5 border-none shadow-sm outline-none text-sm focus:ring-1 ring-black/5" style={{ borderRadius: `${theme.borderRadius}px` }} />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] uppercase font-black tracking-widest opacity-40">Digital Reach</label>
              <input type="email" placeholder="Email Address" className="w-full bg-white p-5 border-none shadow-sm outline-none text-sm focus:ring-1 ring-black/5" style={{ borderRadius: `${theme.borderRadius}px` }} />
            </div>
          </div>
          <div className="space-y-3 mb-12">
            <label className="text-[10px] uppercase font-black tracking-widest opacity-40">Your Inquiry</label>
            <textarea rows={6} placeholder="How can we assist your journey?" className="w-full bg-white p-5 border-none shadow-sm outline-none text-sm focus:ring-1 ring-black/5" style={{ borderRadius: `${theme.borderRadius}px` }}></textarea>
          </div>
          <button 
            className="w-full py-6 text-[11px] font-black uppercase tracking-[0.5em] transition-transform active:scale-95 shadow-xl"
            style={{ backgroundColor: theme.primaryColor, color: '#fff', borderRadius: `${theme.borderRadius}px` }}
          >
            Submit Request
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <main 
      className="flex flex-col min-h-screen w-full overflow-x-hidden selection:bg-black selection:text-white"
      style={{ 
        backgroundColor: theme.backgroundColor, 
        color: theme.textColor, 
        fontFamily: theme.fontFamily || "Inter, sans-serif" 
      }}
    >
      {/* Script handled via standard script tag for compatibility if next/script resolution fails */}
      <script
        src="https://upload-widget.cloudinary.com/global/all.js"
        async
      />

      <Navigation />

      <div className="flex-1 w-full min-w-0">
        {activePage === "home" && <HomeView />}
        {activePage === "about" && <AboutView />}
        {activePage === "contact" && <ContactView />}
      </div>

      <Footer />

      <style>{`
        [contenteditable]:focus {
          outline: none;
          background: rgba(0,0,0,0.03);
          box-shadow: 0 0 0 2px rgba(0,0,0,0.1);
        }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-in-from-bottom-8 { from { transform: translateY(2rem); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes zoom-in-95 { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-in { animation-duration: 0.8s; animation-fill-mode: both; }
        .fade-in { animation-name: fade-in; }
        .slide-in-from-bottom-8 { animation-name: slide-in-from-bottom-8; }
        .zoom-in-95 { animation-name: zoom-in-95; }
        .break-words { word-break: break-word; }
      `}</style>
    </main>
  );
}




