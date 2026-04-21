"use client";

import React, { useState } from "react";
import Script from "next/script";
import {
  useWebsiteBuilderStore,
  useRegionValue,
} from "@/store/useWebsiteBuilderStore";
import { useThemeStore } from "@/store/useThemeStore";

/**
 * PRODUCTION-SAFE TEMPLATE FOR clyraweb
 * Built with internal routing, dynamic theme support, and Cloudinary integration.
 */



export const template18Meta = {
  id: "business/template18",
  name: "Photography Studio",
  image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=1600&auto=format&fit=crop",
};

type TemplateProps = {
  editableData?: any;
  isPublished?: boolean;
};

const getNestedValue = (obj: any, path: string) => {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
};

export default function Template18({ editableData, isPublished = false }: TemplateProps) {
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

  // --- clyraweb EDITABLE COMPONENTS ---
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
        className={`cursor-pointer transition-transform duration-700 hover:scale-[1.02] ${className}`}
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
      <div className="w-full max-w-7xl min-w-0 break-words">{children}</div>
    </section>
  );

  const Navbar = () => (
    <nav
      className="sticky top-0 w-full z-50 backdrop-blur-xl border-b transition-colors duration-300"
      style={{
        backgroundColor: `${theme.backgroundColor}E6`,
        borderColor: `${theme.textColor}10`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-24 flex items-center justify-between gap-4 overflow-hidden">
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <EditableText
            regionKey="global.brand"
            fallback="STUDIO.LENS"
            className="font-black text-2xl tracking-tighter whitespace-nowrap"
          />
        </div>

        <div className="hidden md:flex items-center gap-10 px-4">
          {["Home", "About", "Contact"].map((page) => (
            <button
              key={page}
              onClick={() => setActivePage(page.toLowerCase() as "home" | "about" | "contact")}
              className={`text-xs font-bold transition-all uppercase tracking-[0.2em] relative py-2 ${activePage === page.toLowerCase() ? "opacity-100" : "opacity-40 hover:opacity-100"
                }`}
              style={{ color: theme.textColor }}
            >
              {page}
              {activePage === page.toLowerCase() && (
                <span
                  className="absolute bottom-0 left-0 w-full h-[2px] transform origin-left transition-transform"
                  style={{ backgroundColor: theme.primaryColor }}
                />
              )}
            </button>
          ))}
        </div>

        <div className="flex-shrink-0">
          <button
            className="px-8 py-3.5 font-bold text-xs uppercase tracking-widest transition-transform hover:scale-105 active:scale-95"
            style={{
              backgroundColor: theme.textColor,
              color: theme.backgroundColor,
              borderRadius: `${theme.borderRadius}px`,
            }}
          >
            <EditableText regionKey="global.navCta" fallback="BOOK SESSION" />
          </button>
        </div>
      </div>
    </nav>
  );

  const Footer = () => (
    <footer
      className="py-24 px-6 sm:px-8 border-t"
      style={{
        backgroundColor: theme.backgroundColor,
        color: theme.textColor,
        borderColor: `${theme.textColor}10`,
      }}
    >
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-16">
        <div className="space-y-6 lg:col-span-2">
          <EditableText regionKey="global.brand" fallback="STUDIO.LENS" className="font-black text-3xl tracking-tighter block" />
          <EditableText
            as="p"
            regionKey="footer.desc"
            fallback="Capturing moments, creating legacy. A premier photography studio dedicated to visual storytelling and high-end editorial aesthetics."
            className="text-sm opacity-60 leading-relaxed block max-w-md"
          />
        </div>
        <div className="flex flex-col gap-6">
          <h4 className="font-bold uppercase tracking-[0.2em] text-xs opacity-40">Portfolio</h4>
          {["Home", "About", "Contact"].map((p) => (
            <button key={p} onClick={() => setActivePage(p.toLowerCase() as any)} className="hover:opacity-60 transition-opacity text-sm w-fit text-left">
              {p}
            </button>
          ))}
        </div>
        <div className="space-y-6">
          <h4 className="font-bold uppercase tracking-[0.2em] text-xs opacity-40">Inquiries</h4>
          <EditableText regionKey="footer.email" fallback="hello@studiolens.com" className="text-sm block hover:opacity-60 transition-opacity cursor-pointer" />
          <EditableText regionKey="footer.phone" fallback="+1 (555) 000-0000" className="text-sm block opacity-60" />
          <div className="pt-8">
            <EditableText regionKey="footer.copy" fallback="© 2026 Studio Lens. All rights reserved." className="text-xs opacity-30 block" />
          </div>
        </div>
      </div>
    </footer>
  );

  // --- PAGE VIEWS ---
  const HomeView = () => (
    <div className="animate-in fade-in duration-1000 w-full min-w-0">
      <Section id="hero" bgType="primary" className="!pt-12 !pb-24">
        <div className="flex flex-col gap-12">
          <div className="max-w-4xl space-y-6">
            <EditableText
              as="h1"
              regionKey="hero.title"
              fallback="VISUAL STORYTELLING REIMAGINED."
              className="text-5xl sm:text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter block break-words"
            />
            <EditableText
              as="p"
              regionKey="hero.subtitle"
              fallback="Award-winning editorial, commercial, and portrait photography capturing the essence of the modern era."
              className="text-lg sm:text-xl opacity-60 leading-relaxed block max-w-2xl"
            />
          </div>

          <div className="w-full relative group overflow-hidden" style={{ borderRadius: `${theme.borderRadius * 2}px` }}>
            <EditableImg
              regionKey="hero.mainImg"
              fallback="https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?q=80&w=2400&auto=format&fit=crop"
              className="w-full aspect-[16/9] md:aspect-[21/9] object-cover"
            />
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </div>
        </div>
      </Section>

      <Section id="gallery" bgType="secondary">
        <div className="space-y-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <EditableText as="h2" regionKey="gallery.title" fallback="SELECTED WORKS" className="text-4xl md:text-6xl font-black tracking-tighter block" />
            <EditableText as="p" regionKey="gallery.desc" fallback="A curated collection of our finest moments." className="text-sm uppercase tracking-[0.2em] opacity-50" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 w-full">
            <div className="space-y-4 sm:space-y-6 lg:space-y-8 mt-0 md:mt-12">
              <div className="overflow-hidden" style={{ borderRadius: `${theme.borderRadius}px` }}>
                <EditableImg
                  regionKey="gallery.img1"
                  fallback="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop"
                  className="w-full aspect-[3/4] object-cover"
                />
              </div>
              <div className="overflow-hidden" style={{ borderRadius: `${theme.borderRadius}px` }}>
                <EditableImg
                  regionKey="gallery.img2"
                  fallback="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1200&auto=format&fit=crop"
                  className="w-full aspect-square object-cover"
                />
              </div>
            </div>
            <div className="space-y-4 sm:space-y-6 lg:space-y-8">
              <div className="overflow-hidden" style={{ borderRadius: `${theme.borderRadius}px` }}>
                <EditableImg
                  regionKey="gallery.img3"
                  fallback="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1200&auto=format&fit=crop"
                  className="w-full aspect-square object-cover"
                />
              </div>
              <div className="overflow-hidden" style={{ borderRadius: `${theme.borderRadius}px` }}>
                <EditableImg
                  regionKey="gallery.img4"
                  fallback="https://images.unsplash.com/photo-1510705558058-25147392233f?q=80&w=1200&auto=format&fit=crop"
                  className="w-full aspect-[3/4] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );

  const AboutView = () => (
    <div className="animate-in slide-in-from-bottom-8 duration-700 w-full min-w-0">
      <Section id="about" bgType="primary">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          <div className="lg:col-span-5 space-y-8">
            <EditableText as="h4" regionKey="about.subtitle" fallback="THE VISION" className="text-xs font-black uppercase tracking-[0.3em] opacity-40 block" />
            <EditableText as="h2" regionKey="about.title" fallback="Light, Shadow, & Emotion." className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] block" />
            <EditableText
              as="p"
              regionKey="about.desc1"
              fallback="Founded in 2018, Studio Lens was born out of a desire to create imagery that transcends the ordinary. We approach every subject with a cinematic eye, treating light as our primary medium."
              className="text-lg opacity-70 leading-relaxed block"
            />
            <EditableText
              as="p"
              regionKey="about.desc2"
              fallback="Whether it's a high-fashion editorial or a deeply personal portrait, our goal remains the same: to reveal the authentic narrative within the frame."
              className="text-lg opacity-70 leading-relaxed block"
            />
            <div className="pt-8">
              <EditableImg
                regionKey="about.signature"
                fallback="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Stylized_signature_sample.svg/1024px-Stylized_signature_sample.svg.png"
                className="h-16 object-contain invert opacity-60"
                style={{ filter: theme.backgroundColor === '#ffffff' ? 'none' : 'invert(1)' }}
              />
            </div>
          </div>
          <div className="lg:col-span-7">
            <div className="relative overflow-hidden" style={{ borderRadius: `${theme.borderRadius * 2}px` }}>
              <EditableImg
                regionKey="about.img"
                fallback="https://images.unsplash.com/photo-1554046920-90dcac824bd6?q=80&w=1600&auto=format&fit=crop"
                className="w-full aspect-[4/5] object-cover"
              />
            </div>
          </div>
        </div>
      </Section>
    </div>
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
      className="min-h-screen w-full overflow-x-hidden selection:bg-white selection:text-black"
      style={{ fontFamily: theme.fontFamily, backgroundColor: theme.backgroundColor, color: theme.textColor }}
    >
      {/* Cloudinary Script Loading for Drag & Drop Functionality */}
      <script
        src="https://upload-widget.cloudinary.com/global/all.js"
        async
      ></script>

      <Navbar />

      <div className="flex flex-col w-full min-w-0 max-w-full">
        {activePage === "home" && <HomeView />}
        {activePage === "about" && <AboutView />}
        {activePage === "contact" && <ContactView />}
      </div>

      <Footer />

      <style>{`
        html { scroll-behavior: smooth; }
        body { overflow-x: hidden; }
        [contenteditable]:focus { outline: none; background: rgba(128,128,128,0.1); }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-in-from-bottom-8 { from { transform: translateY(2rem); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes zoom-in-95 { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-in { animation-duration: 0.7s; animation-fill-mode: both; animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1); }
        .fade-in { animation-name: fade-in; }
        .slide-in-from-bottom-8 { animation-name: slide-in-from-bottom-8; }
        .zoom-in-95 { animation-name: zoom-in-95; }
      `}</style>
    </main>
  );
}





