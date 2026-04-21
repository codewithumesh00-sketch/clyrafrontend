"use client";

import React, { useState, useEffect } from "react";
import {
  useWebsiteBuilderStore,
  useRegionValue,
} from "@/store/useWebsiteBuilderStore";
import { useThemeStore } from "@/store/useThemeStore";

export const template26Meta = {
  id: "business/template26",
  name: "Canva Chic Interior Design",
  image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1600&auto=format&fit=crop",
};

type TemplateProps = {
  editableData?: any;
  isPublished?: boolean;
};

const getNestedValue = (obj: any, path: string) => {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
};

export default function Template26({ editableData, isPublished = false }: TemplateProps) {
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

  // --- CLOUDINARY SCRIPT INJECTION (FIX FOR NEXT/SCRIPT ISSUE) ---
  useEffect(() => {
    const scriptId = "cloudinary-upload-widget-script";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://upload-widget.cloudinary.com/global/all.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

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
        className={`focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-gray-400 rounded transition-all break-words ${className}`}
        style={{ outline: "none" }}
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
        className={`cursor-pointer transition-opacity hover:opacity-90 max-w-full ${className}`}
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
      className={`w-full flex justify-center overflow-hidden min-w-0 ${className}`}
    >
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">{children}</div>
    </section>
  );

  const Navbar = () => (
    <nav
      className="sticky top-0 w-full z-40 backdrop-blur-xl border-b transition-all duration-300"
      style={{
        backgroundColor: `${theme.backgroundColor}E6`,
        borderColor: `${theme.textColor}10`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-24 flex items-center justify-between gap-4 overflow-hidden">
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <EditableText
            regionKey="global.brand"
            fallback="MAISON DE DESIGN"
            className="font-bold text-xl md:text-2xl tracking-widest uppercase whitespace-nowrap"
            style={{ fontFamily: theme.fontFamily }}
          />
        </div>

        <div className="hidden md:flex items-center gap-10 px-4">
          {["Home", "About", "Contact"].map((page) => (
            <button
              key={page}
              onClick={() => setActivePage(page.toLowerCase() as any)}
              className={`text-xs font-medium transition-all uppercase tracking-[0.2em] relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-full after:h-[1px] after:bg-current after:transition-transform after:duration-300 ${activePage === page.toLowerCase() ? "after:scale-x-100 opacity-100" : "after:scale-x-0 opacity-60 hover:opacity-100 hover:after:scale-x-100"
                }`}
              style={{ color: theme.textColor }}
            >
              {page}
            </button>
          ))}
        </div>

        <div className="flex-shrink-0">
          <button
            className="px-8 py-3 text-xs tracking-[0.2em] uppercase transition-all duration-300 hover:opacity-80"
            style={{
              backgroundColor: theme.textColor,
              color: theme.backgroundColor,
              borderRadius: `${theme.borderRadius}px`,
            }}
          >
            <EditableText regionKey="global.navCta" fallback="BOOK CONSULTATION" />
          </button>
        </div>
      </div>
    </nav>
  );

  const Footer = () => (
    <footer
      className="py-24 px-4 sm:px-6 lg:px-8 border-t mt-auto"
      style={{
        backgroundColor: theme.secondaryColor,
        color: theme.textColor,
        borderColor: `${theme.textColor}10`,
      }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-16">
        <div className="md:col-span-2 space-y-6">
          <EditableText
            regionKey="global.brand"
            fallback="MAISON DE DESIGN"
            className="font-bold text-2xl tracking-widest uppercase block mb-6"
            style={{ fontFamily: theme.fontFamily }}
          />
          <EditableText
            as="p"
            regionKey="footer.desc"
            fallback="Curating timeless spaces that elevate the everyday. We blend aesthetic intuition with architectural precision."
            className="text-sm opacity-70 leading-loose block max-w-md"
            style={{ fontFamily: "Inter, sans-serif" }}
          />
        </div>
        <div className="flex flex-col gap-4">
          <h4 className="font-bold uppercase tracking-[0.2em] text-xs opacity-50 mb-4">Studio</h4>
          {["Home", "About", "Contact"].map((p) => (
            <button
              key={p}
              onClick={() => setActivePage(p.toLowerCase() as any)}
              className="text-sm w-fit text-left hover:opacity-60 transition-opacity"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              {p}
            </button>
          ))}
        </div>
        <div className="space-y-4">
          <h4 className="font-bold uppercase tracking-[0.2em] text-xs opacity-50 mb-4">Inquiries</h4>
          <EditableText regionKey="footer.email" fallback="hello@maisondesign.com" className="text-sm block" style={{ fontFamily: "Inter, sans-serif" }} />
          <EditableText regionKey="footer.phone" fallback="+1 (555) 123-4567" className="text-sm block" style={{ fontFamily: "Inter, sans-serif" }} />
          <EditableText regionKey="footer.copy" fallback="© 2026 Maison. All rights reserved." className="text-xs opacity-40 block pt-12" style={{ fontFamily: "Inter, sans-serif" }} />
        </div>
      </div>
    </footer>
  );

  const HomeView = () => (
    <div className="animate-in fade-in duration-1000 w-full overflow-hidden">
      <section className="relative w-full min-h-[85vh] flex items-center justify-center p-4 sm:p-8">
        <div className="absolute inset-0 z-0">
          <EditableImg
            regionKey="home.heroBg"
            fallback="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2000&auto=format&fit=crop"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col justify-end h-full mt-32 md:mt-48">
          <div
            className="max-w-2xl p-8 sm:p-12 md:p-16 backdrop-blur-sm shadow-2xl"
            style={{
              backgroundColor: `${theme.backgroundColor}F2`,
              borderRadius: `${theme.borderRadius}px`
            }}
          >
            <EditableText
              as="h1"
              regionKey="home.heroTitle"
              fallback="Crafting Spaces of Quiet Luxury."
              className="text-5xl md:text-7xl font-bold leading-[1.1] block mb-6"
              style={{ fontFamily: theme.fontFamily }}
            />
            <EditableText
              as="p"
              regionKey="home.heroSubtitle"
              fallback="Award-winning interior architecture for those who appreciate the poetry of space and light."
              className="text-base md:text-lg opacity-80 leading-relaxed block mb-10"
              style={{ fontFamily: "Inter, sans-serif" }}
            />
            <button
              className="px-10 py-4 text-xs tracking-[0.2em] uppercase transition-all duration-300 hover:opacity-80 border"
              style={{
                borderColor: theme.textColor,
                color: theme.textColor,
                borderRadius: `${theme.borderRadius}px`,
              }}
            >
              <EditableText regionKey="home.heroBtn" fallback="VIEW PORTFOLIO" />
            </button>
          </div>
        </div>
      </section>

      <Section id="philosophy" bgType="primary">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <EditableText
            as="h2"
            regionKey="home.philTitle"
            fallback="The Art of Living Well"
            className="text-3xl md:text-5xl font-bold block"
            style={{ fontFamily: theme.fontFamily }}
          />
          <EditableText
            as="p"
            regionKey="home.philText"
            fallback="We approach each project as a unique narrative. By blending organic textures, curated objects, and structural precision, we design environments that feel simultaneously expansive and deeply personal."
            className="text-lg md:text-xl opacity-70 leading-loose block font-light"
            style={{ fontFamily: "Inter, sans-serif" }}
          />
        </div>
      </Section>

      <Section id="projects" bgType="secondary">
        <div className="mb-16 flex flex-col md:flex-row justify-between items-end gap-6">
          <EditableText
            as="h2"
            regionKey="home.projectsTitle"
            fallback="Selected Works"
            className="text-4xl md:text-5xl font-bold block"
            style={{ fontFamily: theme.fontFamily }}
          />
          <EditableText
            regionKey="home.projectsSub"
            fallback="01 / PORTFOLIO"
            className="text-xs uppercase tracking-[0.2em] opacity-50 block pb-2"
            style={{ fontFamily: "Inter, sans-serif" }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 flex-wrap">
          {[1, 2, 3].map((num) => (
            <div key={num} className="group cursor-pointer">
              <div className="overflow-hidden mb-6" style={{ borderRadius: `${theme.borderRadius}px` }}>
                <EditableImg
                  regionKey={`home.projectImg${num}`}
                  fallback={
                    num === 1 ? "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=800&auto=format&fit=crop" :
                      num === 2 ? "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=800&auto=format&fit=crop" :
                        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=800&auto=format&fit=crop"
                  }
                  className="w-full aspect-[3/4] object-cover transition-transform duration-1000 group-hover:scale-105"
                />
              </div>
              <EditableText
                regionKey={`home.projectTitle${num}`}
                fallback={`Project No. ${num}`}
                className="text-xl font-bold block mb-2"
                style={{ fontFamily: theme.fontFamily }}
              />
              <EditableText
                regionKey={`home.projectCat${num}`}
                fallback="RESIDENTIAL"
                className="text-xs tracking-[0.2em] uppercase opacity-50 block"
                style={{ fontFamily: "Inter, sans-serif" }}
              />
            </div>
          ))}
        </div>
      </Section>
    </div>
  );

  const AboutView = () => (
    <div className="animate-in slide-in-from-bottom-4 duration-1000 w-full overflow-hidden">
      <Section id="about-hero" bgType="primary">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="order-2 lg:order-1 space-y-10">
            <EditableText
              regionKey="about.tag"
              fallback="OUR STORY"
              className="text-xs uppercase tracking-[0.2em] opacity-50 block"
              style={{ fontFamily: "Inter, sans-serif" }}
            />
            <EditableText
              as="h1"
              regionKey="about.title"
              fallback="Redefining the Modern Sanctuary."
              className="text-5xl md:text-7xl font-bold leading-[1.1] block"
              style={{ fontFamily: theme.fontFamily }}
            />
            <div className="w-16 h-[1px]" style={{ backgroundColor: theme.textColor }}></div>
            <EditableText
              as="p"
              regionKey="about.desc1"
              fallback="Founded on the principle that spaces shape our daily experiences, Maison De Design is a multidisciplinary studio focused on high-end residential and boutique commercial interiors. We believe in subtraction over addition."
              className="text-lg opacity-80 leading-loose block font-light"
              style={{ fontFamily: "Inter, sans-serif" }}
            />
            <EditableText
              as="p"
              regionKey="about.desc2"
              fallback="Our team of architects, designers, and artisans work collaboratively to source rare materials and craft bespoke furnishings, ensuring every project is an authentic reflection of its inhabitants."
              className="text-lg opacity-80 leading-loose block font-light"
              style={{ fontFamily: "Inter, sans-serif" }}
            />
          </div>
          <div className="order-1 lg:order-2">
            <EditableImg
              regionKey="about.img"
              fallback="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop"
              className="w-full aspect-[4/5] object-cover shadow-xl"
              style={{ borderRadius: `${theme.borderRadius}px` }}
            />
          </div>
        </div>
      </Section>

      <Section id="team" bgType="secondary">
        <div className="text-center mb-16">
          <EditableText
            as="h2"
            regionKey="about.teamTitle"
            fallback="The Visionaries"
            className="text-4xl md:text-5xl font-bold block"
            style={{ fontFamily: theme.fontFamily }}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {[1, 2, 3].map((num) => (
            <div key={num} className="text-center flex flex-col items-center">
              <EditableImg
                regionKey={`about.teamImg${num}`}
                fallback={
                  num === 1 ? "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop" :
                    num === 2 ? "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop" :
                      "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600&auto=format&fit=crop"
                }
                className="w-full aspect-square object-cover mb-6 grayscale hover:grayscale-0 transition-all duration-500"
                style={{ borderRadius: `${theme.borderRadius}px` }}
              />
              <EditableText
                regionKey={`about.teamName${num}`}
                fallback={num === 1 ? "Elena Rossi" : num === 2 ? "Marcus Chen" : "Sarah Jenkins"}
                className="text-xl font-bold block mb-1"
                style={{ fontFamily: theme.fontFamily }}
              />
              <EditableText
                regionKey={`about.teamRole${num}`}
                fallback={num === 1 ? "Principal Designer" : num === 2 ? "Lead Architect" : "Interior Stylist"}
                className="text-xs uppercase tracking-[0.2em] opacity-50 block"
                style={{ fontFamily: "Inter, sans-serif" }}
              />
            </div>
          ))}
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
      className="min-h-screen flex flex-col selection:bg-gray-200 selection:text-black w-full overflow-hidden"
      style={{ fontFamily: theme.fontFamily, backgroundColor: theme.backgroundColor }}
    >
      <Navbar />

      <div className="flex flex-col w-full flex-grow min-w-0">
        {activePage === "home" && <HomeView />}
        {activePage === "about" && <AboutView />}
        {activePage === "contact" && <ContactView />}
      </div>

      <Footer />

      <style dangerouslySetInnerHTML={{
        __html: `
        html, body { 
          max-width: 100vw; 
          overflow-x: hidden; 
        }
        [contenteditable]:focus { 
          outline: none; 
          box-shadow: inset 0 -2px 0 0 rgba(0,0,0,0.1); 
        }
        @keyframes fade-in { 
          from { opacity: 0; } 
          to { opacity: 1; } 
        }
        @keyframes slide-in-from-bottom-4 { 
          from { transform: translateY(2rem); opacity: 0; } 
          to { transform: translateY(0); opacity: 1; } 
        }
        @keyframes zoom-in-95 { 
          from { transform: scale(0.98); opacity: 0; } 
          to { transform: scale(1); opacity: 1; } 
        }
        .animate-in { 
          animation-fill-mode: both; 
          animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }
        .fade-in { animation-name: fade-in; }
        .slide-in-from-bottom-4 { animation-name: slide-in-from-bottom-4; }
        .zoom-in-95 { animation-name: zoom-in-95; }
      `}} />
    </main>
  );
}



