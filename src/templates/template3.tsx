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
  isPublished?: boolean;
};

export default function Template3({ editableData, isPublished = false }: TemplateProps) {
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

  // ========== CONTACT VIEW ==========
  const ContactView = () => {
    const [formData, setFormData] = React.useState({ name: "", email: "", phone: "", message: "" });
    const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!formspreeEndpoint) {
        alert("âš ï¸ Form is not connected. Please add your Formspree endpoint in the editor.");
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
      <div>
        <Section id="contact-header">
          <div className="text-center max-w-3xl mx-auto">
            <EditableText as="h1" regionKey="contact.title" fallback="Let's Connect" className="text-5xl md:text-6xl font-black tracking-tighter block mb-6" />
            <EditableText as="p" regionKey="contact.subtitle" fallback="Ready to work together? Reach out and let's start the conversation." className="text-xl opacity-70 block" />
          </div>
        </Section>

        <Section id="contact-form">
          <div className="grid md:grid-cols-2 gap-16">
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold mb-4">Visit Us</h3>
                <EditableText regionKey="contact.address" fallback="123 Business Avenue, Suite 100, New York, NY 10001" className="opacity-70 block" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-4">Contact Info</h3>
                <EditableText regionKey="contact.email" fallback="hello@example.com" className="opacity-70 block mb-2" />
                <EditableText regionKey="contact.phone" fallback="+1 (555) 123-4567" className="opacity-70 block" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-4">Follow Us</h3>
                <div className="flex gap-4">
                  {["LinkedIn", "Twitter", "Instagram"].map((social) => (
                    <span key={social} className="cursor-pointer hover:underline" style={{ color: theme.primaryColor }}>{social}</span>
                  ))}
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                className="w-full p-4 bg-transparent border-b outline-none focus:border-blue-500 transition-colors"
                style={{ borderColor: `${theme.textColor}20` }}
                required
                disabled={status === "loading"}
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Email"
                className="w-full p-4 bg-transparent border-b outline-none focus:border-blue-500 transition-colors"
                style={{ borderColor: `${theme.textColor}20` }}
                required
                disabled={status === "loading"}
              />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Your Phone"
                className="w-full p-4 bg-transparent border-b outline-none focus:border-blue-500 transition-colors"
                style={{ borderColor: `${theme.textColor}20` }}
                required
                disabled={status === "loading"}
              />
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your Message"
                rows={5}
                className="w-full p-4 bg-transparent border-b outline-none focus:border-blue-500 transition-colors resize-none"
                style={{ borderColor: `${theme.textColor}20` }}
                required
                disabled={status === "loading"}
              />
              <button
                type="submit"
                disabled={status === "loading" || !formspreeEndpoint}
                className={`w-full py-4 font-bold uppercase tracking-widest text-sm transition-all ${status === "loading" || !formspreeEndpoint ? "opacity-60 cursor-not-allowed" : "hover:opacity-90 active:scale-[0.98]"}`}
                style={{ backgroundColor: theme.primaryColor, color: "#fff", borderRadius: `${theme.borderRadius}px` }}
              >
                {status === "loading" ? "Sending..." : "Send Message"}
              </button>
              {status === "success" && <p className="text-green-500 text-sm font-medium animate-in fade-in">âœ“ Message sent successfully!</p>}
              {status === "error" && <p className="text-red-500 text-sm font-medium animate-in fade-in">âŒ Something went wrong. Please try again.</p>}
              {!formspreeEndpoint && !isPublished && <p className="text-amber-500 text-xs">âš ï¸ Connect your Formspree endpoint in the editor</p>}
            </form>
          </div>
        </Section>
      </div>
    );
  };

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
        {isPublished ? (
          <>
          <div id="clyra-page-home" style={{display: activePage === 'home' ? 'block' : 'none'}}><HomeView /></div>
          <div id="clyra-page-about" style={{display: activePage === 'about' ? 'block' : 'none'}}><AboutView /></div>
          <div id="clyra-page-contact" style={{display: activePage === 'contact' ? 'block' : 'none'}}><ContactView /></div>
          </>
        ) : (
          <>
          {activePage === "home" && <HomeView />}
          {activePage === "about" && <AboutView />}
          {activePage === "contact" && <ContactView />}
          </>
        )}
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






