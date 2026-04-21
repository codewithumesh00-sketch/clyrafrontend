"use client";

import React, { useState } from "react";
import Script from "next/script";
import {
  useWebsiteBuilderStore,
  useRegionValue,
} from "@/store/useWebsiteBuilderStore";
import { useThemeStore } from "@/store/useThemeStore";

export const template23Meta = {
  id: "business/template23",
  name: "Sonic Echo Podcast Studio",
  image:
    "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=1600&auto=format&fit=crop",
};

type TemplateProps = {
  editableData?: any;
  isPublished?: boolean;
};

const getNestedValue = (obj: any, path: string) => {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
};

export default function Template23({ editableData, isPublished = false }: TemplateProps) {
  const [activePage, setActivePage] = useState<"home" | "about" | "contact">("home");
  const { theme } = useThemeStore();
  const storeUpdateRegion = useWebsiteBuilderStore((state: any) => state.updateRegion);
  const updateRegion = isPublished ? () => { } : storeUpdateRegion;

  const storeEndpoint = useWebsiteBuilderStore(
    (state: any) => state.schema?.editableData?.formspreeEndpoint
  );
  const formspreeEndpoint = isPublished
    ? editableData?.formspreeEndpoint
    : storeEndpoint || editableData?.formspreeEndpoint;

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

  // --- EDITABLE HELPERS ---
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
        className={`focus:outline-none focus:ring-1 focus:ring-white/20 rounded transition-all ${className}`}
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
        className={`cursor-pointer hover:brightness-110 transition-all ${className}`}
        onDoubleClick={(e) => {
          e.stopPropagation();
          handleImageUpload(regionKey);
        }}
      />
    );
  };

  const Section = ({ children, bg = "bg-transparent", className = "" }: any) => (
    <section
      className={`w-full flex justify-center overflow-hidden px-4 sm:px-6 lg:px-8 ${bg} ${className}`}
      style={{ paddingBlock: `${theme?.sectionSpacing || 80}px` }}
    >
      <div className="w-full max-w-7xl min-w-0">{children}</div>
    </section>
  );

  const Navbar = () => (
    <nav
      className="fixed top-0 w-full z-50 transition-all border-b border-white/5 backdrop-blur-xl"
      style={{ backgroundColor: `${theme?.backgroundColor || "#000000"}CC`, color: theme?.textColor || "#ffffff" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between overflow-hidden">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <EditableImg
            regionKey="global.logo"
            fallback="https://images.unsplash.com/photo-1589903308904-1010c2294adc?w=100&h=100&fit=crop"
            className="w-8 h-8 rounded-full border border-white/20"
          />
          <EditableText
            regionKey="global.brand"
            fallback="SONIC ECHO"
            className="font-black text-lg tracking-widest whitespace-nowrap"
          />
        </div>

        <div className="hidden md:flex items-center gap-10 px-8">
          {(["Home", "About", "Contact"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setActivePage(p.toLowerCase() as any)}
              className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:text-white ${activePage === p.toLowerCase() ? "opacity-100" : "opacity-40"
                }`}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="flex-shrink-0">
          <button
            className="px-6 py-2 text-[10px] font-black tracking-widest uppercase border border-white/20 hover:bg-white hover:text-black transition-all"
            style={{ borderRadius: `${theme?.borderRadius || 0}px` }}
          >
            <EditableText regionKey="global.navCta" fallback="BOOK SESSION" />
          </button>
        </div>
      </div>
    </nav>
  );

  const Home = () => (
    <div className="flex flex-col animate-in fade-in duration-700">
      <Section className="min-h-screen flex items-center pt-20">
        <div className="grid lg:grid-cols-12 gap-12 items-end">
          <div className="lg:col-span-8 space-y-6">
            <EditableText
              as="h1"
              regionKey="home.heroTitle"
              fallback="VOICE THE FUTURE."
              className="text-[12vw] lg:text-[10vw] font-black leading-[0.85] tracking-tighter block uppercase italic"
            />
            <div className="max-w-xl">
              <EditableText
                as="p"
                regionKey="home.heroSub"
                fallback="Professional audio architecture for world-class storytellers. Based in the heart of the creative district."
                className="text-lg lg:text-xl opacity-60 font-medium leading-relaxed block"
              />
            </div>
          </div>
          <div className="lg:col-span-4 relative group">
            <EditableImg
              regionKey="home.heroImg"
              fallback="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1000&auto=format&fit=crop"
              className="w-full aspect-[3/4] object-cover grayscale hover:grayscale-0 transition-all duration-700 shadow-2xl"
              style={{ borderRadius: `${theme?.borderRadius || 0}px` }}
            />
            <div className="absolute -bottom-6 -left-6 bg-white text-black p-8 hidden lg:block" style={{ borderRadius: `${theme?.borderRadius || 0}px` }}>
              <EditableText regionKey="home.statLabel" fallback="48-BIT AUDIO" className="text-[10px] font-black tracking-tighter" />
            </div>
          </div>
        </div>
      </Section>

      <Section className="bg-white/5">
        <div className="grid md:grid-cols-3 gap-1 px-1 bg-white/10">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-black p-12 space-y-4 hover:bg-neutral-900 transition-colors">
              <EditableText as="h3" regionKey={`home.featureTitle${i}`} fallback={i === 1 ? "RECORDING" : i === 2 ? "MIXING" : "DISTRIBUTION"} className="text-2xl font-black italic uppercase" />
              <EditableText as="p" regionKey={`home.featureDesc${i}`} fallback="State-of-the-art acoustics designed for crystal clear vocal capture." className="text-sm opacity-50 leading-relaxed block" />
            </div>
          ))}
        </div>
      </Section>
    </div>
  );

  const About = () => (
    <div className="flex flex-col pt-20 animate-in slide-in-from-bottom-4 duration-700">
      <Section>
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1">
            <EditableImg
              regionKey="about.img"
              fallback="https://images.unsplash.com/photo-1559523161-0fc0d8b38a7a?q=80&w=1000&auto=format&fit=crop"
              className="w-full aspect-square object-cover"
              style={{ borderRadius: `${theme?.borderRadius || 0}px` }}
            />
          </div>
          <div className="order-1 lg:order-2 space-y-8">
            <EditableText as="h2" regionKey="about.title" fallback="THE SOUND ARCHITECTS" className="text-6xl font-black italic uppercase leading-none" />
            <EditableText as="p" regionKey="about.desc" fallback="Founded in 2018, Sonic Echo has become the gold standard for independent podcasters and major networks alike." className="text-xl opacity-60 leading-relaxed block" />
            <div className="pt-8 grid grid-cols-2 gap-8">
              <div>
                <EditableText regionKey="about.stat1" fallback="5000+" className="text-4xl font-black block" />
                <EditableText regionKey="about.stat1Label" fallback="HOURS RECORDED" className="text-[10px] font-black opacity-40 uppercase tracking-widest" />
              </div>
              <div>
                <EditableText regionKey="about.stat2" fallback="12" className="text-4xl font-black block" />
                <EditableText regionKey="about.stat2Label" fallback="CHART TOPPERS" className="text-[10px] font-black opacity-40 uppercase tracking-widest" />
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );

  const Contact = () => {
    const [formData, setFormData] = React.useState({ name: "", email: "", phone: "", message: "" });
    const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!formspreeEndpoint) {
        alert("⚠️ Form is not connected. Please add your Formspree endpoint in the editor.");
        return;
      }
      setStatus("loading");
      try {
        const res = await fetch(formspreeEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          setStatus("success");
          setFormData({ name: "", email: "", phone: "", message: "" });
          setTimeout(() => setStatus("idle"), 5000);
        } else throw new Error();
      } catch {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 5000);
      }
    };

    return (
      <div className="flex flex-col pt-20 min-h-screen animate-in zoom-in-95 duration-500">
        <Section>
          <div className="max-w-3xl mx-auto space-y-16">
            <div className="text-center space-y-4">
              <EditableText as="h1" regionKey="contact.title" fallback="GET IN THE BOOTH" className="text-7xl font-black italic uppercase" />
              <EditableText as="p" regionKey="contact.sub" fallback="Ready to launch your series? Let's build your audio identity." className="text-xl opacity-50 block" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="NAME" required disabled={status === "loading"} className="w-full bg-white/5 border border-white/10 p-6 text-xs font-black tracking-widest outline-none focus:border-white transition-all uppercase" />
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="EMAIL" required disabled={status === "loading"} className="w-full bg-white/5 border border-white/10 p-6 text-xs font-black tracking-widest outline-none focus:border-white transition-all uppercase" />
              </div>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="PHONE" required disabled={status === "loading"} className="w-full bg-white/5 border border-white/10 p-6 text-xs font-black tracking-widest outline-none focus:border-white transition-all uppercase" />
              <textarea name="message" value={formData.message} onChange={handleChange} placeholder="PROJECT DETAILS" rows={6} required disabled={status === "loading"} className="w-full bg-white/5 border border-white/10 p-6 text-xs font-black tracking-widest outline-none focus:border-white transition-all uppercase resize-none" />
              <button type="submit" disabled={status === "loading" || !formspreeEndpoint} className={`w-full py-8 bg-white text-black font-black text-sm tracking-[0.4em] uppercase transition-all ${status === "loading" || !formspreeEndpoint ? "opacity-60 cursor-not-allowed" : "hover:bg-neutral-200"}`}>
                {status === "loading" ? "SENDING..." : "SUBMIT INQUIRY"}
              </button>
              {status === "success" && <p className="text-green-400 text-sm font-bold">✓ Message sent successfully!</p>}
              {status === "error" && <p className="text-red-400 text-sm font-bold">❌ Something went wrong. Please try again.</p>}
              {!formspreeEndpoint && !isPublished && <p className="text-amber-400 text-xs">⚠️ Connect your Formspree endpoint in the editor</p>}
            </form>
          </div>
        </Section>
      </div>
    );
  };

  return (
    <main
      className="w-full min-h-screen selection:bg-white selection:text-black overflow-x-hidden"
      style={{
        backgroundColor: theme?.backgroundColor || "#000000",
        color: theme?.textColor || "#ffffff",
        fontFamily: theme?.fontFamily || "'Inter', sans-serif"
      }}
    >
      <script src="https://upload-widget.cloudinary.com/global/all.js" async></script>

      <Navbar />

      <div className="w-full">
        {activePage === "home" && <Home />}
        {activePage === "about" && <About />}
        {activePage === "contact" && <Contact />}
      </div>

      <footer className="w-full py-20 border-t border-white/5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <EditableText regionKey="global.brand" fallback="SONIC ECHO" className="font-black text-xs tracking-widest" />
          </div>
          <EditableText
            regionKey="footer.copy"
            fallback="©2024 ARCHIVED RECORDINGS. ALL RIGHTS RESERVED."
            className="text-[10px] font-black opacity-30 tracking-widest"
          />
        </div>
      </footer>

      <style>{`
        body { margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #333; }
        .animate-in { animation-duration: 0.5s; animation-fill-mode: both; }
        .fade-in { animation-name: fade-in; }
        .slide-in-from-bottom-4 { animation-name: slide-in-from-bottom-4; }
        .zoom-in-95 { animation-name: zoom-in-95; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-in-from-bottom-4 { from { transform: translateY(1rem); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes zoom-in-95 { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>
    </main>
  );
}





