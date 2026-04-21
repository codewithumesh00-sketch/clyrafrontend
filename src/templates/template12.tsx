"use client";

import React, { useState, useCallback } from "react";
import Script from "next/script";
import {
  useWebsiteBuilderStore,
  useRegionValue,
} from "@/store/useWebsiteBuilderStore";
import { useThemeStore } from "@/store/useThemeStore";

export const template12Meta = {
  id: "business/template12",
  name: "Travel Explorer",
  image:
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1600&auto=format&fit=crop",
};

type TemplateProps = {
  editableData?: any;
  isPublished?: boolean;
};

const getNestedValue = (obj: any, path: string) => {
  if (!obj || !path) return undefined;
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
};

export default function Template12({ editableData, isPublished = false }: TemplateProps) {
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

  const handleImageUpload = useCallback((regionKey: string) => {
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
  }, [updateRegion]);


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
        className={`cursor-pointer transition-transform hover:scale-[1.01] ${className}`}
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
        padding: `${theme.sectionSpacing}px 0`,
        backgroundColor: bgType === "primary" ? theme.backgroundColor : theme.secondaryColor,
        color: theme.textColor,
      }}
      className={`w-full max-w-full min-w-0 overflow-hidden flex justify-center break-words ${className}`}
    >
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">
        {children}
      </div>
    </section>
  );

  const Navbar = () => (
    <nav
      className="sticky top-0 w-full z-50 backdrop-blur-xl border-b transition-all"
      style={{
        backgroundColor: `${theme.secondaryColor}E6`,
        borderColor: `${theme.textColor}15`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-24 flex items-center justify-between gap-4 overflow-hidden">
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <EditableImg
            regionKey="global.logo"
            fallback="https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=150&h=150&fit=crop"
            className="w-12 h-12 object-cover shadow-sm"
            style={{ borderRadius: `${theme.borderRadius}px` }}
          />
          <EditableText
            regionKey="global.brand"
            fallback="WANDERLUST"
            className="font-black text-2xl tracking-tighter whitespace-nowrap uppercase"
            style={{ color: theme.primaryColor }}
          />
        </div>

        <div className="hidden md:flex items-center gap-10 px-4">
          {["Home", "About", "Contact"].map((page) => (
            <button
              key={page}
              onClick={() => setActivePage(page.toLowerCase() as any)}
              className={`text-sm font-bold transition-all uppercase tracking-widest relative group ${activePage === page.toLowerCase() ? "opacity-100" : "opacity-50 hover:opacity-100"
                }`}
              style={{ color: theme.textColor }}
            >
              {page}
              {activePage === page.toLowerCase() && (
                <span
                  className="absolute -bottom-2 left-0 w-full h-0.5 rounded-full"
                  style={{ backgroundColor: theme.primaryColor }}
                />
              )}
            </button>
          ))}
        </div>

        <div className="flex-shrink-0">
          <button
            className="px-8 py-3.5 font-bold text-xs uppercase tracking-widest transition-transform active:scale-95 shadow-lg"
            style={{
              backgroundColor: theme.primaryColor,
              color: "#fff",
              borderRadius: `${theme.borderRadius}px`,
            }}
          >
            <EditableText regionKey="global.navCta" fallback="Book Now" />
          </button>
        </div>
      </div>
    </nav>
  );

  const Footer = () => (
    <footer
      className="pt-24 pb-12 w-full border-t"
      style={{
        backgroundColor: theme.secondaryColor,
        color: theme.textColor,
        borderColor: `${theme.textColor}10`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-2 space-y-6">
          <div className="flex items-center gap-3">
            <EditableImg
              regionKey="global.logo"
              fallback="https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=150&h=150&fit=crop"
              className="w-10 h-10 object-cover"
              style={{ borderRadius: `${theme.borderRadius}px` }}
            />
            <EditableText regionKey="global.brand" fallback="WANDERLUST" className="font-black text-xl tracking-tighter" />
          </div>
          <EditableText
            as="p"
            regionKey="footer.desc"
            fallback="Crafting unforgettable journeys and bespoke adventures around the globe."
            className="text-sm opacity-70 leading-relaxed max-w-sm block"
          />
        </div>
        <div className="space-y-6">
          <h4 className="font-black uppercase tracking-widest text-xs opacity-50">Explore</h4>
          <div className="flex flex-col gap-3">
            {["Home", "About", "Contact"].map((p) => (
              <button key={p} onClick={() => setActivePage(p.toLowerCase() as any)} className="text-sm font-medium hover:opacity-70 text-left w-fit transition-opacity">
                {p}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <h4 className="font-black uppercase tracking-widest text-xs opacity-50">Legal</h4>
          <EditableText regionKey="footer.copy" fallback="© 2024 Wanderlust. All rights reserved." className="text-xs opacity-40 block" />
        </div>
      </div>
    </footer>
  );

  const HomeView = () => (
    <div className="animate-in fade-in duration-700">
      <section className="relative w-full px-4 sm:px-6 lg:px-8 py-12 md:py-20 flex justify-center" style={{ backgroundColor: theme.backgroundColor }}>
        <div className="max-w-7xl w-full relative">
          <EditableImg
            regionKey="home.hero.img"
            fallback="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2000&auto=format&fit=crop"
            className="w-full aspect-[4/3] md:aspect-[21/9] object-cover shadow-2xl"
            style={{ borderRadius: `${theme.borderRadius * 2}px` }}
          />
          <div
            className="absolute -bottom-10 left-4 right-4 md:left-12 md:right-auto md:w-[500px] p-8 md:p-12 backdrop-blur-xl bg-white/95 shadow-2xl border border-white/20"
            style={{ borderRadius: `${theme.borderRadius}px` }}
          >
            <EditableText
              as="h1"
              regionKey="home.hero.title"
              fallback="Discover the Unseen."
              className="text-4xl md:text-6xl font-black leading-[1.1] tracking-tighter block mb-4 text-gray-900"
            />
            <EditableText
              as="p"
              regionKey="home.hero.subtitle"
              fallback="Curated expeditions to the most breathtaking corners of the Earth."
              className="text-lg opacity-80 leading-relaxed block mb-8 text-gray-700"
            />
            <button
              className="px-8 py-4 font-bold uppercase tracking-widest text-sm shadow-xl"
              style={{ backgroundColor: theme.primaryColor, color: "#fff", borderRadius: `${theme.borderRadius}px` }}
              onClick={() => setActivePage("about")}
            >
              <EditableText regionKey="home.hero.btn" fallback="Start Journey" />
            </button>
          </div>
        </div>
      </section>

      <div className="h-24"></div>

      <Section id="destinations" bgType="secondary">
        <div className="mb-12">
          <EditableText as="h3" regionKey="home.dest.tag" fallback="Trending Now" className="text-xs font-black uppercase tracking-widest block mb-2" style={{ color: theme.primaryColor }} />
          <EditableText as="h2" regionKey="home.dest.title" fallback="Popular Destinations" className="text-4xl font-black tracking-tight block" />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="group relative overflow-hidden shadow-lg" style={{ borderRadius: `${theme.borderRadius}px` }}>
              <div className="aspect-[3/4] w-full overflow-hidden">
                <EditableImg
                  regionKey={`home.card${i}.img`}
                  fallback={
                    i === 1 ? "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&fit=crop" :
                      i === 2 ? "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&fit=crop" :
                        "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=800&fit=crop"
                  }
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-8">
                <EditableText as="h4" regionKey={`home.card${i}.title`} fallback={`Destination ${i}`} className="text-xl font-bold text-white block" />
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );

  const AboutView = () => (
    <Section id="about">
      <div className="grid lg:grid-cols-2 gap-16 items-center animate-in slide-in-from-bottom-4 duration-700">
        <div className="relative">
          <EditableImg
            regionKey="about.img1"
            fallback="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1000&fit=crop"
            className="w-full aspect-[4/5] object-cover shadow-2xl"
            style={{ borderRadius: `${theme.borderRadius}px` }}
          />
        </div>
        <div className="space-y-8">
          <EditableText as="h2" regionKey="about.title" fallback="We Build Experiences." className="text-5xl font-black tracking-tight block" />
          <EditableText
            as="p"
            regionKey="about.desc"
            fallback="We believe that travel is the ultimate catalyst for personal transformation. We obsess over the details so you can focus on the awe."
            className="text-lg opacity-75 leading-relaxed block"
          />
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
      className="min-h-screen selection:bg-blue-500 selection:text-white"
      style={{ fontFamily: theme.fontFamily, backgroundColor: theme.backgroundColor }}
    >
      {/* Cloudinary Script Loading using standard HTML tag for environment compatibility */}
      <script
        src="https://upload-widget.cloudinary.com/global/all.js"
        async
      ></script>

      <Navbar />

      <div className="flex flex-col w-full overflow-hidden">
        {activePage === "home" && <HomeView />}
        {activePage === "about" && <AboutView />}
        {activePage === "contact" && <ContactView />}
      </div>

      <Footer />

      <style dangerouslySetInnerHTML={{
        __html: `
        [contenteditable]:focus { outline: none; background: rgba(0,0,0,0.02); }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-in-from-bottom-4 { from { transform: translateY(1rem); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes zoom-in-95 { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-in { animation-duration: 0.5s; animation-fill-mode: both; }
        .fade-in { animation-name: fade-in; }
        .slide-in-from-bottom-4 { animation-name: slide-in-from-bottom-4; }
        .zoom-in-95 { animation-name: zoom-in-95; }
      `}} />
    </main>
  );
}







