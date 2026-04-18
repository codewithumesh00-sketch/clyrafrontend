"use client";

import React, { useState } from "react";
import Script from "next/script";
import {
  useWebsiteBuilderStore,
  useRegionValue,
} from "@/store/useWebsiteBuilderStore";
import { useThemeStore } from "@/store/useThemeStore";

export const template7Meta = {
  id: "business/template7",
  name: "Agency Flow",
  image:
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1600&auto=format&fit=crop",
};

const getNestedValue = (obj: any, path: string) => {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
};

export default function Template7({
  editableData,
}: {
  editableData?: any;
}) {
  const [activePage, setActivePage] = useState<"home" | "about" | "contact">("home");
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

  // --- clyraweb EDITABLE WRAPPERS ---
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
        className={`focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-sm transition-all ${className}`}
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

  // --- UI COMPONENTS ---
  const Navbar = () => (
    <nav
      className="sticky top-0 w-full z-50 border-b backdrop-blur-md"
      style={{
        backgroundColor: `${theme.backgroundColor}F2`,
        borderColor: `${theme.textColor}15`
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4 min-w-0">
          <EditableImg
            regionKey="global.logo"
            fallback="https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop"
            className="w-8 h-8 rounded"
          />
          <EditableText
            regionKey="global.brand"
            fallback="FLOW DESIGN"
            className="font-black text-lg tracking-tighter uppercase whitespace-nowrap"
          />
        </div>

        <div className="hidden md:flex items-center gap-8">
          {(["home", "about", "contact"] as const).map((page) => (
            <button
              key={page}
              onClick={() => setActivePage(page)}
              className={`text-[11px] font-bold uppercase tracking-[0.2em] transition-all ${activePage === page ? "opacity-100" : "opacity-40 hover:opacity-100"
                }`}
              style={{ color: theme.textColor }}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest transition-transform active:scale-95"
          style={{
            backgroundColor: theme.primaryColor,
            color: "#fff",
            borderRadius: `${theme.borderRadius}px`
          }}
        >
          <EditableText regionKey="global.navCta" fallback="Start Project" />
        </button>
      </div>
    </nav>
  );

  const Home = () => (
    <div className="w-full">
      <section className="px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-10">
            <EditableText
              as="h1"
              regionKey="home.heroTitle"
              fallback="Digital experiences that drive velocity."
              className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter block"
            />
            <EditableText
              as="p"
              regionKey="home.heroSub"
              fallback="A strategic design partner for high-growth tech teams. We ship design systems and products in record time."
              className="text-xl opacity-60 leading-relaxed block max-w-lg"
            />
            <button
              className="px-10 py-5 text-sm font-black uppercase tracking-[0.2em]"
              style={{
                backgroundColor: theme.primaryColor,
                color: "#fff",
                borderRadius: `${theme.borderRadius}px`
              }}
            >
              <EditableText regionKey="home.heroCta" fallback="View Work" />
            </button>
          </div>
          <EditableImg
            regionKey="home.heroImg"
            fallback="https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1600&auto=format&fit=crop"
            className="w-full aspect-[4/5] object-cover shadow-2xl"
            style={{ borderRadius: `${theme.borderRadius * 2}px` }}
          />
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 py-24" style={{ backgroundColor: theme.secondaryColor }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-4">
                <EditableText
                  as="h3"
                  regionKey={`home.featureTitle${i}`}
                  fallback={i === 1 ? "Product Design" : i === 2 ? "Brand Strategy" : "Development"}
                  className="text-2xl font-black tracking-tight block"
                />
                <EditableText
                  as="p"
                  regionKey={`home.featureDesc${i}`}
                  fallback="End-to-end solutions tailored for the modern web ecosystem."
                  className="text-sm opacity-50 leading-relaxed block"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );

  const About = () => (
    <section className="px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-start">
        <div className="sticky top-32 space-y-8">
          <EditableText
            as="h2"
            regionKey="about.title"
            fallback="Velocity is our only metric."
            className="text-5xl md:text-7xl font-black tracking-tighter block"
          />
          <EditableText
            as="p"
            regionKey="about.desc"
            fallback="Flow Agency was built to solve one problem: the lag between strategy and shipping. We operate as an integrated part of your product team."
            className="text-xl opacity-70 leading-relaxed block"
          />
        </div>
        <div className="space-y-12">
          <EditableImg
            regionKey="about.img1"
            fallback="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1600&auto=format&fit=crop"
            className="w-full aspect-video object-cover"
            style={{ borderRadius: `${theme.borderRadius}px` }}
          />
        </div>
      </div>
    </section>
  );

  const Contact = () => (
    <section className="px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
      <div className="max-w-4xl mx-auto space-y-16">
        <div className="text-center space-y-6">
          <EditableText
            as="h2"
            regionKey="contact.title"
            fallback="Ready to flow?"
            className="text-6xl md:text-8xl font-black tracking-tighter block"
          />
          <EditableText
            as="p"
            regionKey="contact.sub"
            fallback="Drop us a line and we'll get back to you within 4 business hours."
            className="text-lg opacity-50 block"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-12 bg-white/5 p-12 border border-black/5" style={{ borderRadius: `${theme.borderRadius * 2}px` }}>
          <div className="space-y-8">
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest opacity-30">Inquiries</span>
              <EditableText regionKey="contact.email" fallback="hello@flow.agency" className="text-lg font-bold block underline" />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full p-4 bg-transparent border-b outline-none focus:border-black transition-colors"
              style={{ borderColor: `${theme.textColor}20` }}
            />
            <button
              className="w-full py-5 font-black uppercase tracking-widest text-xs"
              style={{
                backgroundColor: theme.primaryColor,
                color: "#fff",
                borderRadius: `${theme.borderRadius}px`
              }}
            >
              <EditableText regionKey="contact.btn" fallback="Send Inquiry" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <main
      className="w-full min-h-screen overflow-hidden break-words selection:bg-black selection:text-white"
      style={{
        fontFamily: theme.fontFamily,
        backgroundColor: theme.backgroundColor,
        color: theme.textColor
      }}
    >
      {/* Fallback to raw script for environments where next/script cannot be resolved */}
      <script
        src="https://upload-widget.cloudinary.com/global/all.js"
        async
      ></script>

      <Navbar />

      <div className="w-full">
        {activePage === "home" && <Home />}
        {activePage === "about" && <About />}
        {activePage === "contact" && <Contact />}
      </div>

      <footer
        className="px-4 sm:px-6 lg:px-8 py-20 border-t"
        style={{ borderColor: `${theme.textColor}10` }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="text-center md:text-left">
            <EditableText regionKey="global.brand" fallback="FLOW DESIGN" className="font-black tracking-tighter text-xl block" />
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            <EditableText regionKey="footer.copy" fallback="© 2024 FLOW." className="text-[10px] font-bold tracking-widest opacity-40 uppercase" />
          </div>
        </div>
      </footer>
    </main>
  );
}





