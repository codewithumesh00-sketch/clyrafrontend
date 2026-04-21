"use client";

import React, { useState, useEffect } from "react";
import {
  useWebsiteBuilderStore,
  useRegionValue,
} from "@/store/useWebsiteBuilderStore";
import { useThemeStore } from "@/store/useThemeStore";

export const template28Meta = {
  id: "business/template28",
  name: "Gaming Zone Hub",
  image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1600&auto=format&fit=crop",
};

type TemplateProps = {
  editableData?: any;
  isPublished?: boolean;
};

const getNestedValue = (obj: any, path: string) => {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
};

export default function Template28({ editableData, isPublished = false }: TemplateProps) {
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

  // --- RESOLVED SCRIPT INJECTION ---
  useEffect(() => {
    const scriptId = "cloudinary-widget-script";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://upload-widget.cloudinary.com/global/all.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

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
        className={`focus:outline-none focus:ring-2 focus:ring-blue-500 rounded transition-all ${className}`}
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

  const EditableBackground = ({ regionKey, fallback, children, className = "" }: any) => {
    const hookValue = useRegionValue(regionKey);
    const dataValue = getNestedValue(editableData, regionKey);
    const src = hookValue ?? dataValue ?? fallback;

    return (
      <div
        className={`relative cursor-pointer group ${className}`}
        onDoubleClick={(e) => {
          e.stopPropagation();
          handleImageUpload(regionKey);
        }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 group-hover:scale-105"
          style={{ backgroundImage: `url(${src})` }}
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 w-full h-full flex flex-col">{children}</div>
      </div>
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
      className={`w-full flex justify-center overflow-hidden px-4 sm:px-6 lg:px-8 ${className}`}
    >
      <div className="w-full max-w-7xl min-w-0">{children}</div>
    </section>
  );

  const Navbar = () => (
    <nav
      className="sticky top-0 w-full z-50 backdrop-blur-xl border-b"
      style={{
        backgroundColor: `${theme.backgroundColor}E6`,
        borderColor: `${theme.textColor}15`,
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between gap-3 lg:gap-4 overflow-hidden">
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <EditableImg
            regionKey="global.logo"
            fallback="https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=200&h=200&fit=crop"
            className="w-12 h-12 object-cover"
            style={{ borderRadius: `${theme.borderRadius}px` }}
          />
          <EditableText
            regionKey="global.brand"
            fallback="NEXUS ARENA"
            className="font-black text-2xl tracking-tighter whitespace-nowrap uppercase italic"
          />
        </div>

        <div className="hidden md:flex items-center gap-10 px-4">
          {["Home", "About", "Contact"].map((page) => (
            <button
              key={page}
              onClick={() => setActivePage(page.toLowerCase() as any)}
              className={`text-xs font-black transition-all uppercase tracking-widest relative py-2 ${activePage === page.toLowerCase() ? "opacity-100" : "opacity-40 hover:opacity-100"
                }`}
              style={{ color: theme.textColor }}
            >
              {page}
              {activePage === page.toLowerCase() && (
                <span
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-1 rounded-full"
                  style={{ backgroundColor: theme.primaryColor, boxShadow: `0 0 12px ${theme.primaryColor}` }}
                />
              )}
            </button>
          ))}
        </div>

        <div className="flex-shrink-0">
          <button
            className="px-8 py-3.5 font-black text-xs uppercase tracking-[0.2em] transition-transform hover:scale-105 active:scale-95 shadow-lg italic"
            style={{
              backgroundColor: theme.primaryColor,
              color: "#fff",
              borderRadius: `${theme.borderRadius}px`,
              boxShadow: `0 0 25px ${theme.primaryColor}50`,
            }}
          >
            <EditableText regionKey="global.navCta" fallback="ENTER THE VOID" />
          </button>
        </div>
      </div>
    </nav>
  );

  const Footer = () => (
    <footer
      className="py-24 px-6 border-t relative overflow-hidden"
      style={{
        backgroundColor: theme.secondaryColor,
        color: theme.textColor,
        borderColor: `${theme.textColor}10`,
      }}
    >
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 relative z-10">
        <div className="space-y-6 md:col-span-2">
          <div className="flex items-center gap-3">
            <EditableImg
              regionKey="global.logo"
              fallback="https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=200&h=200&fit=crop"
              className="w-10 h-10 rounded-lg"
            />
            <EditableText regionKey="global.brand" fallback="NEXUS ARENA" className="font-black text-xl uppercase italic tracking-tighter" />
          </div>
          <EditableText
            as="p"
            regionKey="footer.desc"
            fallback="The world's leading pro-grade gaming destination. High-octane environments for high-performance players."
            className="text-sm opacity-50 leading-relaxed block max-w-sm"
          />
        </div>
        <div className="flex flex-col gap-4">
          <h4 className="font-black uppercase tracking-widest text-xs opacity-30 mb-2">Internal</h4>
          {["Home", "About", "Contact"].map((p) => (
            <button key={p} onClick={() => setActivePage(p.toLowerCase() as any)} className="hover:text-blue-400 text-sm w-fit font-bold opacity-70 transition-all">
              {p}
            </button>
          ))}
        </div>
        <div className="space-y-4">
          <h4 className="font-black uppercase tracking-widest text-xs opacity-30 mb-2">Protocol</h4>
          <EditableText regionKey="footer.discord" fallback="DISCORD // NEXUS" className="text-sm block font-bold hover:text-blue-500 cursor-pointer" />
          <EditableText regionKey="footer.copy" fallback=" 2026 NEXUS. CORE SYSTEM LOADED." className="text-[10px] font-mono opacity-20 block pt-8" />
        </div>
      </div>
    </footer>
  );

  const HomeView = () => (
    <div className="animate-in fade-in duration-700 w-full max-w-full">
      <section className="w-full px-4 sm:px-6 lg:px-8 pt-8 pb-16" style={{ backgroundColor: theme.backgroundColor }}>
        <div className="max-w-7xl mx-auto w-full overflow-hidden shadow-2xl relative" style={{ borderRadius: `${theme.borderRadius * 2}px` }}>
          <EditableBackground
            regionKey="hero.bgImg"
            fallback="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2000&auto=format&fit=crop"
            className="w-full min-h-[75vh] flex items-center p-8 md:p-16 lg:p-24"
          >
            <div className="max-w-3xl space-y-6 relative z-20">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-[2px]" style={{ backgroundColor: theme.primaryColor }}></span>
                <EditableText
                  regionKey="hero.badge"
                  fallback="NOW RECRUITING TOP TALENT"
                  className="text-xs font-black uppercase tracking-[0.4em] text-blue-400"
                />
              </div>
              <EditableText
                as="h1"
                regionKey="hero.title"
                fallback="GAMING WITHOUT LIMITS."
                className="text-6xl md:text-[9rem] font-black leading-[0.85] tracking-tighter block text-white drop-shadow-2xl uppercase italic"
              />
              <EditableText
                as="p"
                regionKey="hero.subtitle"
                fallback="Forge your legacy on professional-grade hardware. 0ms latency. 100% immersion. This is where legends play."
                className="text-lg md:text-xl text-white/70 leading-relaxed block font-medium max-w-xl"
              />
              <div className="pt-10 flex flex-wrap gap-5">
                <button
                  className="px-12 py-6 font-black uppercase tracking-[0.2em] text-sm shadow-2xl hover:translate-y-[-4px] transition-all italic"
                  style={{ backgroundColor: theme.primaryColor, color: "#fff", borderRadius: `${theme.borderRadius}px` }}
                >
                  <EditableText regionKey="hero.btn1" fallback="SECURE YOUR RIG" />
                </button>
              </div>
            </div>
          </EditableBackground>
        </div>
      </section>

      <Section id="features" bgType="secondary" className="py-32">
        <div className="grid md:grid-cols-3 gap-12">
          {[
            { id: "h1", t: "01. PRO GEAR", d: "Intel i9, RTX 4090, 500Hz. The apex of gaming.", i: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800" },
            { id: "h2", t: "02. THE ARENA", d: "Stadium seating and massive 4K LED walls.", i: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=800" },
            { id: "h3", t: "03. VR SUITE", d: "Full-body tracking in haptic flight chairs.", i: "https://images.unsplash.com/photo-1605901309584-818e25960b8f?w=800" },
          ].map((f, i) => (
            <div key={f.id} className="group cursor-default">
              <div className="overflow-hidden mb-6" style={{ borderRadius: `${theme.borderRadius}px` }}>
                <EditableImg
                  regionKey={`home.feat.${i}.img`}
                  fallback={f.i}
                  className="w-full aspect-[4/3] object-cover group-hover:scale-110 transition-transform duration-1000"
                />
              </div>
              <EditableText as="h3" regionKey={`home.feat.${i}.title`} fallback={f.t} className="text-xl font-black italic block mb-2" />
              <EditableText as="p" regionKey={`home.feat.${i}.desc`} fallback={f.d} className="text-sm opacity-50 block leading-relaxed" />
            </div>
          ))}
        </div>
      </Section>
    </div>
  );

  const AboutView = () => (
    <div className="animate-in slide-in-from-bottom-4 duration-700 w-full max-w-full">
      <Section id="about" className="py-32">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          <div className="relative group">
            <EditableImg
              regionKey="about.img"
              fallback="https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1600"
              className="w-full aspect-square object-cover grayscale hover:grayscale-0 transition-all duration-700"
              style={{ borderRadius: `${theme.borderRadius}px` }}
            />
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-600/20 backdrop-blur-3xl rounded-full -z-10 animate-pulse" />
          </div>
          <div className="space-y-10">
            <EditableText as="h2" regionKey="about.title" fallback="THE NEXUS PROTOCOL" className="text-5xl md:text-8xl font-black tracking-tighter italic uppercase block leading-[0.85]" />
            <EditableText
              as="p"
              regionKey="about.desc"
              fallback="Founded in 2024, Nexus Arena was built to bridge the gap between amateur play and professional esports. We provide the infrastructure, the hardware, and the community to push human limits."
              className="text-xl opacity-80 leading-relaxed block font-medium"
            />
            <div className="grid grid-cols-2 gap-10 pt-10 border-t border-white/10">
              <div>
                <EditableText as="span" regionKey="about.stat1" fallback="99.9%" className="text-5xl font-black block text-blue-500 italic" />
                <EditableText as="span" regionKey="about.stat1.l" fallback="UPTIME" className="text-xs font-black uppercase tracking-widest opacity-40 block" />
              </div>
              <div>
                <EditableText as="span" regionKey="about.stat2" fallback="24/7" className="text-5xl font-black block text-blue-500 italic" />
                <EditableText as="span" regionKey="about.stat2.l" fallback="DEPLOYED" className="text-xs font-black uppercase tracking-widest opacity-40 block" />
              </div>
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
      className="min-h-screen selection:bg-blue-600 selection:text-white flex flex-col"
      style={{ fontFamily: theme.fontFamily, backgroundColor: theme.backgroundColor }}
    >
      <Navbar />

      <div className="flex-grow flex flex-col w-full relative z-10 overflow-x-hidden">
        {isPublished ? (
          <>
          <div id="clyra-page-home"><HomeView /></div>
          <div id="clyra-page-about" style={{display:'none'}}><AboutView /></div>
          <div id="clyra-page-contact" style={{display:'none'}}><ContactView /></div>
          </>
        ) : (
          <>
          {activePage === "home" && <HomeView />}
          {activePage === "about" && <AboutView />}
          {activePage === "contact" && <ContactView />}
          </>
        )}
      </div>

      <Footer />

      <style>{`
        html { scroll-behavior: smooth; }
        [contenteditable]:focus { 
          outline: none; 
          background: rgba(255, 255, 255, 0.05); 
          box-shadow: 0 0 0 2px ${theme.primaryColor}50;
        }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-in-from-bottom-4 { from { transform: translateY(2rem); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes zoom-in-95 { from { transform: scale(0.97); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-in { animation-duration: 0.6s; animation-fill-mode: both; animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1); }
        .fade-in { animation-name: fade-in; }
        .slide-in-from-bottom-4 { animation-name: slide-in-from-bottom-4; }
        .zoom-in-95 { animation-name: zoom-in-95; }
        
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${theme.backgroundColor}; }
        ::-webkit-scrollbar-thumb { background: ${theme.primaryColor}; border-radius: 10px; }
      `}</style>
    </main>
  );
}




