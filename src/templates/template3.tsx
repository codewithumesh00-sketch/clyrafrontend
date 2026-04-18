"use client";

import React, { useState, useCallback } from "react";
import Script from "next/script";
import {
  useWebsiteBuilderStore,
  useRegionValue,
} from "@/store/useWebsiteBuilderStore";
import { useThemeStore } from "@/store/useThemeStore";

/**
 * PRODUCTION-SAFE TEMPLATE FOR clyraweb: PORTFOLIO PRO
 * Updated to handle module resolution safely in the preview environment.
 */



export const template3Meta = {
  id: "business/template3",
  name: "Portfolio Pro",
  image:
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1600&auto=format&fit=crop",
};

type TemplateProps = {
  editableData?: any;
};

export default function Template3({ editableData }: TemplateProps) {
  const [activePage, setActivePage] = useState<"home" | "about" | "contact">("home");
  const { theme } = useThemeStore();
  const updateRegion = useWebsiteBuilderStore((state: any) => state.updateRegion);

  // --- Helpers ---
  const getNestedValue = (obj: any, path: string) => {
    return path?.split(".").reduce((acc: any, part: string) => acc && acc[part], obj);
  };

  // --- Image Upload Handler (Cloudinary) ---
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

  // --- clyraweb Editable Components ---
  const EditableText = ({
    regionKey,
    fallback,
    as: Tag = "span",
    className = "",
  }: any) => {
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
        className={`focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-sm transition-all break-words ${className}`}
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
        className={`cursor-pointer hover:brightness-95 transition-all w-full max-w-full h-auto ${className}`}
        onDoubleClick={(e) => {
          e.stopPropagation();
          handleImageUpload(regionKey);
        }}
      />
    );
  };

  // --- Layout Components ---
  const Section = ({ children, bgType = "primary", className = "" }: any) => (
    <section
      style={{
        padding: `${theme.sectionSpacing}px 0`,
        backgroundColor: bgType === "primary" ? theme.backgroundColor : theme.secondaryColor,
        color: theme.textColor,
      }}
      className={`w-full flex justify-center px-4 sm:px-6 lg:px-8 overflow-hidden ${className}`}
    >
      <div className="w-full max-w-7xl min-w-0">{children}</div>
    </section>
  );

  const Navbar = () => (
    <nav
      className="sticky top-0 w-full z-50 backdrop-blur-xl border-b"
      style={{
        backgroundColor: `${theme.backgroundColor}EE`,
        borderColor: `${theme.textColor}10`,
        fontFamily: theme.fontFamily,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between overflow-hidden">
        <div className="flex items-center gap-4 min-w-0">
          <EditableText
            regionKey="global.brand"
            fallback="PORTFOLIO.PRO"
            className="font-black text-2xl tracking-tighter whitespace-nowrap"
          />
        </div>
        <div className="hidden md:flex items-center gap-10">
          {["Home", "About", "Contact"].map((page) => (
            <button
              key={page}
              onClick={() => setActivePage(page.toLowerCase() as any)}
              className={`text-xs font-bold uppercase tracking-widest transition-all ${activePage === page.toLowerCase() ? "opacity-100" : "opacity-40 hover:opacity-100"
                }`}
              style={{ color: theme.textColor }}
            >
              {page}
            </button>
          ))}
        </div>
        <button
          className="px-6 py-2.5 text-xs font-bold uppercase tracking-widest transition-transform active:scale-95 whitespace-nowrap"
          style={{
            backgroundColor: theme.primaryColor,
            color: theme.backgroundColor,
            borderRadius: `${theme.borderRadius}px`,
          }}
        >
          <EditableText regionKey="global.navCta" fallback="HIRE ME" />
        </button>
      </div>
    </nav>
  );

  const HomeView = () => (
    <div className="w-full">
      <Section className="min-h-[80vh] flex items-center">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-block px-3 py-1 bg-blue-500/10 text-blue-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
              <EditableText regionKey="hero.badge" fallback="Available for Projects" />
            </div>
            <EditableText
              as="h1"
              regionKey="hero.title"
              fallback="Design that drives digital growth."
              className="text-6xl sm:text-7xl lg:text-9xl font-black leading-[0.85] tracking-tighter block"
            />
            <EditableText
              as="p"
              regionKey="hero.subtitle"
              fallback="Senior Product Designer specializing in building high-conversion interfaces for global startups."
              className="text-lg sm:text-xl opacity-60 leading-relaxed max-w-xl block"
            />
            <div className="flex flex-wrap gap-4 pt-4">
              <button
                className="px-10 py-5 text-sm font-bold uppercase tracking-widest"
                style={{
                  backgroundColor: theme.primaryColor,
                  color: theme.backgroundColor,
                  borderRadius: `${theme.borderRadius}px`,
                }}
              >
                <EditableText regionKey="hero.mainCta" fallback="View Work" />
              </button>
              <button
                className="px-10 py-5 text-sm font-bold uppercase tracking-widest border"
                style={{
                  borderColor: `${theme.textColor}20`,
                  borderRadius: `${theme.borderRadius}px`,
                }}
              >
                <EditableText regionKey="hero.secCta" fallback="Strategy" />
              </button>
            </div>
          </div>
          <div className="lg:col-span-5 relative">
            <EditableImg
              regionKey="hero.mainImg"
              fallback="https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1000&auto=format&fit=crop"
              className="aspect-[3/4] object-cover grayscale hover:grayscale-0 transition-all duration-700"
              style={{ borderRadius: `${theme.borderRadius * 2}px` }}
            />
          </div>
        </div>
      </Section>

      <Section bgType="secondary">
        <div className="grid md:grid-cols-3 gap-1px bg-black/10">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-12 space-y-6" style={{ backgroundColor: theme.backgroundColor }}>
              <EditableText
                as="h3"
                regionKey={`feature.${i}.title`}
                fallback={`0${i}. Strategy`}
                className="text-xs font-black uppercase tracking-[0.3em] opacity-40 block"
              />
              <EditableText
                as="p"
                regionKey={`feature.${i}.desc`}
                fallback="Deep dive into user behavior and market trends to ensure every pixel serves a business purpose."
                className="text-xl font-medium leading-tight block"
              />
            </div>
          ))}
        </div>
      </Section>
    </div>
  );

  const AboutView = () => (
    <Section>
      <div className="grid lg:grid-cols-2 gap-20 items-start">
        <div className="sticky top-32">
          <EditableText
            as="h2"
            regionKey="about.title"
            fallback="Crafting digital excellence since 2014."
            className="text-5xl sm:text-7xl font-black leading-none tracking-tighter block"
          />
        </div>
        <div className="space-y-12">
          <EditableImg
            regionKey="about.img"
            fallback="https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1000&auto=format&fit=crop"
            className="w-full aspect-video object-cover"
            style={{ borderRadius: `${theme.borderRadius}px` }}
          />
          <EditableText
            as="div"
            regionKey="about.content"
            fallback="With over a decade of experience in the design industry, I have helped companies like Google, Airbnb, and Stripe launch products that millions of people love."
            className="text-2xl opacity-80 leading-relaxed block"
          />
          <div className="pt-8 grid grid-cols-2 gap-8 border-t" style={{ borderColor: `${theme.textColor}10` }}>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-2">Experience</p>
              <EditableText regionKey="about.stat1" fallback="12+ Years" className="text-2xl font-bold" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-2">Projects</p>
              <EditableText regionKey="about.stat2" fallback="240+ Delivered" className="text-2xl font-bold" />
            </div>
          </div>
        </div>
      </div>
    </Section>
  );

  const ContactView = () => (
    <Section className="min-h-[70vh] flex items-center">
      <div className="max-w-3xl">
        <EditableText
          as="h1"
          regionKey="contact.title"
          fallback="Let's build something iconic."
          className="text-6xl sm:text-8xl font-black leading-[0.85] tracking-tighter block mb-12"
        />
        <div className="space-y-6">
          <p className="text-xs font-black uppercase tracking-widest opacity-40">Inquiries</p>
          <EditableText
            regionKey="contact.email"
            fallback="hello@portfoliopro.com"
            className="text-3xl sm:text-5xl font-light underline decoration-1 underline-offset-8 block"
          />
        </div>
        <div className="mt-20 flex flex-wrap gap-12">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-2">Follow</p>
            <div className="flex gap-4">
              <EditableText regionKey="contact.social1" fallback="Twitter" className="text-sm font-bold" />
              <EditableText regionKey="contact.social2" fallback="LinkedIn" className="text-sm font-bold" />
            </div>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-2">Location</p>
            <EditableText regionKey="contact.loc" fallback="Remote / London" className="text-sm font-bold" />
          </div>
        </div>
      </div>
    </Section>
  );

  return (
    <main
      className="w-full min-h-screen overflow-x-hidden"
      style={{
        fontFamily: theme.fontFamily,
        backgroundColor: theme.backgroundColor,
        color: theme.textColor,
      }}
    >
      <script
        src="https://upload-widget.cloudinary.com/global/all.js"
        async
      ></script>

      <Navbar />

      <div className="w-full">
        {activePage === "home" && <HomeView />}
        {activePage === "about" && <AboutView />}
        {activePage === "contact" && <ContactView />}
      </div>

      <footer
        className="w-full py-12 px-4 sm:px-6 lg:px-8 border-t"
        style={{ borderColor: `${theme.textColor}10`, backgroundColor: theme.backgroundColor }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <EditableText
            regionKey="global.brand"
            fallback="PORTFOLIO.PRO"
            className="font-black text-lg tracking-tighter"
          />
          <EditableText
            regionKey="footer.copy"
            fallback="© 2024 PORTFOLIO PRO. ALL RIGHTS RESERVED."
            className="text-[10px] font-black tracking-[0.2em] opacity-30"
          />
          <div className="flex gap-8">
            <button onClick={() => window.scrollTo(0, 0)} className="text-[10px] font-black tracking-widest opacity-50 uppercase hover:opacity-100 transition-all">
              Back to Top
            </button>
          </div>
        </div>
      </footer>

      <style>{`
        ::selection {
          background-color: ${theme.primaryColor};
          color: ${theme.backgroundColor};
        }
        [contenteditable]:hover {
          background: rgba(0, 0, 0, 0.03);
        }
        html { scroll-behavior: smooth; }
      `}</style>
    </main>
  );
}






