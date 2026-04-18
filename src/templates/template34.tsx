"use client";

import React, { useState } from "react";
import Script from "next/script";
import {
  useWebsiteBuilderStore,
  useRegionValue,
} from "@/store/useWebsiteBuilderStore";
import { useThemeStore } from "@/store/useThemeStore";

export const template34Meta = {
  id: "business/template34",
  name: "Electronics Shop",
  image:
    "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=1600&auto=format&fit=crop",
};

type TemplateProps = {
  editableData?: any;
};

export default function Template34({ editableData }: TemplateProps) {
  const [activePage, setActivePage] = useState<"home" | "about" | "contact">("home");
  const { theme } = useThemeStore();
  const updateRegion = useWebsiteBuilderStore((state: any) => state.updateRegion);

  const getNestedValue = (obj: any, path: string) => {
    return path.split(".").reduce((acc, part) => acc && acc[part], obj);
  };

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
        className={`focus:outline-none focus:ring-1 focus:ring-cyan-500/50 rounded transition-all ${className}`}
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
        className={`cursor-pointer transition-transform duration-500 hover:scale-[1.02] ${className}`}
        onDoubleClick={(e) => {
          e.stopPropagation();
          handleImageUpload(regionKey);
        }}
      />
    );
  };

  const Navbar = () => (
    <nav
      className="sticky top-0 w-full z-[100] border-b backdrop-blur-xl"
      style={{
        backgroundColor: `${theme.backgroundColor}EE`,
        borderColor: `${theme.textColor}10`
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4 overflow-hidden">
        <div className="flex items-center gap-3 min-w-0">
          <EditableImg
            regionKey="global.logo"
            fallback="https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=100&h=100&fit=crop"
            className="w-10 h-10 object-cover rounded-xl"
          />
          <EditableText
            regionKey="global.brand"
            fallback="TECHNOVA"
            className="font-black text-xl tracking-[0.2em] uppercase truncate"
          />
        </div>

        <div className="hidden md:flex items-center gap-10">
          {["Home", "About", "Contact"].map((page) => (
            <button
              key={page}
              onClick={() => setActivePage(page.toLowerCase() as any)}
              className="text-xs font-bold tracking-[0.15em] uppercase transition-all hover:opacity-100"
              style={{
                color: theme.textColor,
                opacity: activePage === page.toLowerCase() ? 1 : 0.4,
                borderBottom: activePage === page.toLowerCase() ? `2px solid ${theme.primaryColor}` : 'none'
              }}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          className="px-5 py-2.5 text-xs font-black tracking-widest uppercase transition-all active:scale-95"
          style={{
            backgroundColor: theme.primaryColor,
            color: "#fff",
            borderRadius: theme.borderRadius
          }}
        >
          <EditableText regionKey="global.navCta" fallback="STORE" />
        </button>
      </div>
    </nav>
  );

  const HomeView = () => (
    <div className="w-full space-y-px overflow-hidden">
      <section className="relative w-full py-24 lg:py-40 px-4 sm:px-6 lg:px-8 flex justify-center overflow-hidden">
        <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-16 items-center">
          <div className="z-10 space-y-8">
            <div
              className="inline-block px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.3em] uppercase border"
              style={{ borderColor: `${theme.primaryColor}50`, color: theme.primaryColor }}
            >
              <EditableText regionKey="home.tagline" fallback="Next Generation Computing" />
            </div>
            <EditableText
              as="h1"
              regionKey="home.heroTitle"
              fallback="Experience The Future of Sound."
              className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter block break-words"
            />
            <EditableText
              as="p"
              regionKey="home.heroSub"
              fallback="Ultra-low latency, crystal clear resolution, and the most comfortable fit ever designed."
              className="text-lg opacity-60 max-w-lg block leading-relaxed"
            />
            <div className="flex flex-wrap gap-4">
              <button
                className="px-10 py-5 font-black uppercase tracking-widest text-xs"
                style={{ backgroundColor: theme.primaryColor, color: "#fff", borderRadius: theme.borderRadius }}
              >
                <EditableText regionKey="home.btn1" fallback="Order Now" />
              </button>
              <button
                className="px-10 py-5 font-black uppercase tracking-widest text-xs border"
                style={{ borderColor: `${theme.textColor}20`, borderRadius: theme.borderRadius }}
              >
                <EditableText regionKey="home.btn2" fallback="Watch Film" />
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-20 bg-cyan-500/10 blur-[120px] rounded-full animate-pulse" />
            <EditableImg
              regionKey="home.heroImg"
              fallback="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&auto=format"
              className="relative w-full aspect-square object-contain z-10"
            />
          </div>
        </div>
      </section>

      <section className="w-full py-24 px-4 sm:px-6 lg:px-8 flex justify-center bg-black/[0.02]">
        <div className="max-w-7xl w-full grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="p-10 border border-black/5 flex flex-col gap-6" style={{ borderRadius: theme.borderRadius }}>
              <div className="w-12 h-12 bg-black/5 rounded-lg flex items-center justify-center font-bold text-xl">0{i}</div>
              <EditableText as="h3" regionKey={`home.featureTitle${i}`} fallback={i === 1 ? "Adaptive ANC" : i === 2 ? "Spatial Audio" : "40h Battery"} className="text-2xl font-black tracking-tight block" />
              <EditableText as="p" regionKey={`home.featureDesc${i}`} fallback="Industry-leading noise cancellation that adapts to your environment in real-time." className="text-sm opacity-50 leading-relaxed block" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  const AboutView = () => (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-24 flex justify-center overflow-hidden">
      <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-20 items-center">
        <div className="order-2 lg:order-1">
          <EditableImg
            regionKey="about.img"
            fallback="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1000&fit=crop"
            className="w-full aspect-[4/5] object-cover"
            style={{ borderRadius: theme.borderRadius * 2 }}
          />
        </div>
        <div className="order-1 lg:order-2 space-y-8">
          <EditableText as="h2" regionKey="about.title" fallback="Engineering the Impossible." className="text-5xl md:text-7xl font-black tracking-tighter block" />
          <EditableText
            as="p"
            regionKey="about.desc"
            fallback="Since 2024, our mission has been simple: push the boundaries of what silicon and code can achieve. We don't just sell electronics; we sell milestones in human engineering."
            className="text-xl opacity-60 leading-relaxed block"
          />
          <div className="pt-8 grid grid-cols-2 gap-8 border-t" style={{ borderColor: `${theme.textColor}10` }}>
            <div>
              <EditableText regionKey="about.stat1" fallback="1.2M+" className="text-4xl font-black block" />
              <span className="text-xs uppercase tracking-widest opacity-40">Devices Shipped</span>
            </div>
            <div>
              <EditableText regionKey="about.stat2" fallback="99.9%" className="text-4xl font-black block" />
              <span className="text-xs uppercase tracking-widest opacity-40">Satisfaction Rate</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const ContactView = () => (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-24 flex justify-center overflow-hidden">
      <div className="max-w-3xl w-full text-center space-y-12">
        <EditableText as="h1" regionKey="contact.title" fallback="Support Hub" className="text-6xl md:text-8xl font-black tracking-tighter block" />
        <div className="grid md:grid-cols-2 gap-1 px-1 bg-black/5 border rounded-3xl overflow-hidden" style={{ borderColor: `${theme.textColor}10`, borderRadius: theme.borderRadius * 3 }}>
          <div className="p-12 text-left space-y-6">
            <h4 className="text-[10px] font-black tracking-[0.3em] uppercase opacity-40">Reach Out</h4>
            <div className="space-y-2">
              <EditableText regionKey="contact.email" fallback="hq@technova.io" className="text-2xl font-bold block" />
              <EditableText regionKey="contact.phone" fallback="+1 (555) 000-TECH" className="text-lg opacity-60 block" />
            </div>
            <EditableText regionKey="contact.address" fallback="Silicon Alley, New York, NY 10010" className="text-sm opacity-40 block pt-8" />
          </div>
          <div className="p-12 bg-white/40 backdrop-blur-sm space-y-4">
            <input className="w-full p-4 bg-white/50 border-b outline-none text-sm" style={{ borderColor: `${theme.textColor}10` }} placeholder="Serial Number" />
            <textarea className="w-full p-4 bg-white/50 border-b outline-none text-sm h-32" style={{ borderColor: `${theme.textColor}10` }} placeholder="Issue Details..." />
            <button
              className="w-full py-5 font-black uppercase tracking-widest text-xs"
              style={{ backgroundColor: theme.primaryColor, color: "#fff", borderRadius: theme.borderRadius }}
            >
              <EditableText regionKey="contact.submit" fallback="Open Ticket" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <main
      className="min-h-screen w-full relative overflow-x-hidden selection:bg-cyan-500 selection:text-white"
      style={{
        fontFamily: theme.fontFamily,
        backgroundColor: theme.backgroundColor,
        color: theme.textColor
      }}
    >
      <script
        src="https://upload-widget.cloudinary.com/global/all.js"
        async
      />

      <Navbar />

      <div className="w-full">
        {activePage === "home" && <HomeView />}
        {activePage === "about" && <AboutView />}
        {activePage === "contact" && <ContactView />}
      </div>

      <footer className="w-full py-20 px-4 sm:px-6 lg:px-8 border-t flex justify-center" style={{ borderColor: `${theme.textColor}10` }}>
        <div className="max-w-7xl w-full grid md:grid-cols-4 gap-12">
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-black rounded flex shrink-0" />
              <EditableText regionKey="global.brand" fallback="TECHNOVA" className="font-black tracking-widest" />
            </div>
            <EditableText as="p" regionKey="footer.bio" fallback="Defining the interface between human and machine through superior industrial design." className="text-sm opacity-40 max-w-xs block leading-relaxed" />
          </div>
          <div className="space-y-4">
            <h5 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30">Legal</h5>
            <div className="flex flex-col gap-2 text-xs font-bold uppercase tracking-tighter opacity-60">
              <span className="cursor-pointer hover:opacity-100">Privacy Policy</span>
              <span className="cursor-pointer hover:opacity-100">Warranty Info</span>
            </div>
          </div>
          <div className="space-y-4 text-right">
            <EditableText regionKey="footer.copy" fallback="© 2024 TECHNOVA INC." className="text-[10px] font-black opacity-20 block" />
          </div>
        </div>
      </footer>

      <style>{`
        * { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
        body { margin: 0; padding: 0; overflow-x: hidden; width: 100%; }
        [contenteditable]:focus { outline: none; box-shadow: 0 0 0 2px rgba(6, 182, 212, 0.2); }
        .break-words { overflow-wrap: break-word; }
      `}</style>
    </main>
  );
}





