"use client";

import React, { useState } from "react";
import {
  useWebsiteBuilderStore,
  useRegionValue,
} from "@/store/useWebsiteBuilderStore";
import { useThemeStore } from "@/store/useThemeStore";
import Script from "next/script";

/**
 * PRODUCTION-SAFE TEMPLATE FOR clyraweb
 * Built with internal routing, dynamic theme support, and Cloudinary integration.
 */



export const template37Meta = {
  id: "business/template37",
  name: "Freelancer Personal Canvas",
  image: "https://images.unsplash.com/photo-1507238692062-710e956e2644?q=80&w=1600&auto=format&fit=crop",
};

type TemplateProps = {
  editableData?: any;
  isPublished?: boolean;
};

const getNestedValue = (obj: any, path: string) => {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
};

export default function Template37({ editableData, isPublished = false }: TemplateProps) {
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
      if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || !process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET) {
        return;
      }
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
        className={`focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded transition-all ${className}`}
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
        className={`cursor-pointer transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg ${className}`}
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
      className={`w-full flex justify-center min-w-0 overflow-hidden ${className}`}
    >
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 break-words">{children}</div>
    </section>
  );

  const Navbar = () => (
    <nav
      className="sticky top-0 w-full z-40 backdrop-blur-xl border-b"
      style={{
        backgroundColor: `${theme.backgroundColor}E6`,
        borderColor: `${theme.textColor}10`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-24 flex items-center justify-between gap-4 overflow-hidden">
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <EditableImg
            regionKey="global.logo"
            fallback="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=150&h=150&fit=crop"
            className="w-12 h-12 object-cover"
            style={{ borderRadius: `${theme.borderRadius}px` }}
          />
          <div className="flex flex-col">
            <EditableText
              regionKey="global.name"
              fallback="Alex Carter."
              className="font-extrabold text-2xl tracking-tight whitespace-nowrap"
            />
            <EditableText
              regionKey="global.role"
              fallback="Independent Creator"
              className="text-xs font-medium opacity-60 uppercase tracking-widest whitespace-nowrap"
            />
          </div>
        </div>

        <div className="hidden md:flex items-center gap-1 bg-black/5 p-1 rounded-full" style={{ backgroundColor: `${theme.textColor}08` }}>
          {["Home", "About", "Contact"].map((page) => (
            <button
              key={page}
              onClick={() => setActivePage(page.toLowerCase() as any)}
              className={`px-6 py-2.5 text-sm font-semibold rounded-full transition-all ${activePage === page.toLowerCase() ? "shadow-sm" : "opacity-60 hover:opacity-100"
                }`}
              style={{
                backgroundColor: activePage === page.toLowerCase() ? theme.secondaryColor : "transparent",
                color: theme.textColor,
              }}
            >
              {page}
            </button>
          ))}
        </div>

        <div className="flex-shrink-0 hidden sm:block">
          <button
            onClick={() => setActivePage("contact")}
            className="px-8 py-3.5 font-bold text-sm transition-transform active:scale-95 shadow-md hover:shadow-lg"
            style={{
              backgroundColor: theme.primaryColor,
              color: "#ffffff",
              borderRadius: `9999px`, // Pill shape for Canva vibe
            }}
          >
            <EditableText regionKey="global.navCta" fallback="Let's Talk" />
          </button>
        </div>
      </div>
    </nav>
  );

  const Footer = () => (
    <footer
      className="py-16 px-4 sm:px-6 lg:px-8 border-t"
      style={{
        backgroundColor: theme.secondaryColor,
        color: theme.textColor,
        borderColor: `${theme.textColor}10`,
      }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
        <div className="flex items-center gap-4">
          <EditableImg
            regionKey="global.logo"
            fallback="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=150&h=150&fit=crop"
            className="w-10 h-10 object-cover grayscale opacity-60"
            style={{ borderRadius: `${theme.borderRadius}px` }}
          />
          <div>
            <EditableText regionKey="global.name" fallback="Alex Carter." className="font-bold text-lg block" />
            <EditableText regionKey="footer.tagline" fallback="Designing the future, today." className="text-sm opacity-50 block" />
          </div>
        </div>
        <div className="flex gap-6">
          {["Home", "About", "Contact"].map((p) => (
            <button
              key={p}
              onClick={() => setActivePage(p.toLowerCase() as any)}
              className="text-sm font-medium opacity-60 hover:opacity-100 transition-opacity"
            >
              {p}
            </button>
          ))}
        </div>
        <div>
          <EditableText regionKey="footer.copy" fallback="© 2026 Alex Carter. All rights reserved." className="text-xs opacity-40 block" />
        </div>
      </div>
    </footer>
  );

  // --- PAGE VIEWS ---
  const HomeView = () => (
    <div className="animate-in fade-in duration-700 w-full">
      {/* Hero Section */}
      <Section id="hero" bgType="primary">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-8 z-10">
            <div className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-4" style={{ backgroundColor: `${theme.primaryColor}15`, color: theme.primaryColor }}>
              <EditableText regionKey="hero.badge" fallback="Available for Work" />
            </div>
            <EditableText
              as="h1"
              regionKey="hero.title"
              fallback="Crafting Digital Experiences that Inspire."
              className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tight block"
            />
            <EditableText
              as="p"
              regionKey="hero.subtitle"
              fallback="I specialize in UI/UX design, branding, and creative direction. Let's build something people actually want to use."
              className="text-lg md:text-xl opacity-70 leading-relaxed block max-w-2xl"
            />
            <div className="flex flex-wrap gap-4 pt-4">
              <button
                onClick={() => setActivePage("contact")}
                className="px-8 py-4 font-bold text-sm transition-transform active:scale-95 shadow-lg"
                style={{ backgroundColor: theme.primaryColor, color: "#fff", borderRadius: `9999px` }}
              >
                <EditableText regionKey="hero.btnPrimary" fallback="Hire Me" />
              </button>
              <button
                onClick={() => setActivePage("about")}
                className="px-8 py-4 font-bold text-sm transition-transform active:scale-95 border-2"
                style={{ borderColor: `${theme.textColor}20`, color: theme.textColor, borderRadius: `9999px` }}
              >
                <EditableText regionKey="hero.btnSecondary" fallback="My Journey" />
              </button>
            </div>
          </div>
          <div className="lg:col-span-5 relative">
            <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-3xl opacity-20" style={{ backgroundColor: theme.primaryColor }}></div>
            <EditableImg
              regionKey="hero.img"
              fallback="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1000&fit=crop"
              className="w-full aspect-[4/5] object-cover relative z-10 shadow-2xl"
              style={{ borderRadius: `${theme.borderRadius * 2}px` }}
            />
          </div>
        </div>
      </Section>

      {/* Services/Skills Section - Canva Vibe Cards */}
      <Section id="services" bgType="secondary">
        <div className="text-center mb-16">
          <EditableText as="h2" regionKey="services.title" fallback="What I Do" className="text-4xl font-black tracking-tight block mb-4" />
          <EditableText as="p" regionKey="services.desc" fallback="Delivering end-to-end creative solutions." className="text-lg opacity-60 max-w-2xl mx-auto block" />
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((num) => (
            <div key={num} className="p-8 shadow-sm hover:shadow-xl transition-shadow duration-300 border" style={{ backgroundColor: theme.backgroundColor, borderRadius: `${theme.borderRadius}px`, borderColor: `${theme.textColor}0A` }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-inner" style={{ backgroundColor: `${theme.primaryColor}15`, color: theme.primaryColor }}>
                <span className="font-black text-xl">0{num}</span>
              </div>
              <EditableText as="h3" regionKey={`services.item${num}Title`} fallback={`Service ${num}`} className="text-xl font-bold mb-3 block" />
              <EditableText as="p" regionKey={`services.item${num}Desc`} fallback="Comprehensive design strategy and flawless execution to elevate your brand identity." className="opacity-70 leading-relaxed text-sm block" />
            </div>
          ))}
        </div>
      </Section>

      {/* Portfolio Snippet */}
      <Section id="portfolio" bgType="primary">
        <div className="flex flex-col sm:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <EditableText as="h2" regionKey="portfolio.title" fallback="Selected Works" className="text-4xl font-black tracking-tight block mb-4" />
            <EditableText as="p" regionKey="portfolio.desc" fallback="A glimpse into my recent projects." className="text-lg opacity-60 block" />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((num) => (
            <div key={num} className="group relative overflow-hidden" style={{ borderRadius: `${theme.borderRadius}px` }}>
              <EditableImg
                regionKey={`portfolio.img${num}`}
                fallback={`https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=600&fit=crop&q=${num}`}
                className="w-full aspect-square object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <div>
                  <EditableText regionKey={`portfolio.item${num}Title`} fallback={`Project ${num}`} className="text-white font-bold text-xl block" />
                  <EditableText regionKey={`portfolio.item${num}Tag`} fallback="Branding" className="text-white/70 text-sm font-medium uppercase tracking-widest block mt-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );

  const AboutView = () => (
    <Section id="about" bgType="primary" className="animate-in slide-in-from-bottom-4 duration-700">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div className="order-2 lg:order-1 relative">
          <div className="absolute -inset-4 rounded-[2rem] opacity-30 blur-2xl -z-10" style={{ backgroundColor: theme.primaryColor }}></div>
          <EditableImg
            regionKey="about.heroImg"
            fallback="https://images.unsplash.com/photo-1554774853-719586f82d77?w=800&h=1000&fit=crop"
            className="w-full aspect-[3/4] object-cover shadow-2xl"
            style={{ borderRadius: `${theme.borderRadius * 2}px` }}
          />
        </div>
        <div className="order-1 lg:order-2 space-y-8">
          <EditableText as="h2" regionKey="about.title" fallback="The Mind Behind the Canvas." className="text-5xl md:text-6xl font-black tracking-tight leading-[1.1] block" />
          <EditableText
            as="p"
            regionKey="about.desc1"
            fallback="I am a multidisciplinary designer and creative strategist with over a decade of experience helping startups and enterprise brands tell their visual stories."
            className="text-lg opacity-80 leading-relaxed block"
          />
          <EditableText
            as="p"
            regionKey="about.desc2"
            fallback="My approach is rooted in empathy, aesthetics, and data. Every pixel matters, and every user journey is crafted with intent. When I'm not designing, I'm exploring modern architecture or brewing the perfect pour-over coffee."
            className="text-lg opacity-60 leading-relaxed block"
          />

          <div className="pt-8 border-t" style={{ borderColor: `${theme.textColor}15` }}>
            <h4 className="text-sm font-bold uppercase tracking-widest opacity-50 mb-6">Tools of the Trade</h4>
            <div className="flex flex-wrap gap-3">
              {["Figma", "React", "Webflow", "Adobe CC", "Spline 3D"].map((tool, i) => (
                <span key={i} className="px-5 py-2.5 rounded-full text-sm font-semibold border shadow-sm" style={{ backgroundColor: theme.secondaryColor, borderColor: `${theme.textColor}10` }}>
                  {tool}
                </span>
              ))}
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
      className="min-h-screen selection:bg-indigo-500 selection:text-white flex flex-col w-full max-w-full overflow-hidden"
      style={{ fontFamily: theme.fontFamily, backgroundColor: theme.backgroundColor }}
    >
      <Script
        src="https://upload-widget.cloudinary.com/global/all.js"
        strategy="afterInteractive"
      />

      <Navbar />

      <div className="flex flex-col w-full min-w-0 flex-1">
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
        [contenteditable]:focus { outline: none; background: rgba(0,0,0,0.03); box-shadow: 0 0 0 2px ${theme.primaryColor}55; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-in-from-bottom-4 { from { transform: translateY(2rem); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes zoom-in-95 { from { transform: scale(0.97); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-in { animation-duration: 0.6s; animation-fill-mode: both; animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1); }
        .fade-in { animation-name: fade-in; }
        .slide-in-from-bottom-4 { animation-name: slide-in-from-bottom-4; }
        .zoom-in-95 { animation-name: zoom-in-95; }
      `}</style>
    </main>
  );
}




