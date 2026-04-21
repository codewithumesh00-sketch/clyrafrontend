"use client";

import React, { useState, useCallback, useEffect } from "react";
import Script from "next/script";
import {
  useWebsiteBuilderStore,
  useRegionValue,
} from "@/store/useWebsiteBuilderStore";
import { useThemeStore } from "@/store/useThemeStore";

export const template29Meta = {
  id: "business/template29",
  name: "NGO Charity Hope",
  image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1600&auto=format&fit=crop",
};

type TemplateProps = {
  editableData?: any;
  isPublished?: boolean;
};

const getNestedValue = (obj: any, path: string) => {
  if (!obj || !path) return undefined;
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
};

export default function Template29({ editableData, isPublished = false }: TemplateProps) {
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
        className={`focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-current rounded transition-all ${className}`}
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
        className={`cursor-pointer transition-transform hover:scale-[1.02] ${className}`}
        onDoubleClick={(e) => {
          e.stopPropagation();
          handleImageUpload(regionKey);
        }}
      />
    );
  };

  // --- LAYOUT WRAPPERS ---
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
      className="sticky top-0 w-full z-40 backdrop-blur-xl border-b"
      style={{
        backgroundColor: `${theme.backgroundColor}E6`,
        borderColor: `${theme.textColor}15`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-24 flex items-center justify-between gap-4 overflow-hidden">
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <EditableImg
            regionKey="global.logo"
            fallback="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=150&h=150&fit=crop"
            className="w-12 h-12 object-cover rounded-full shadow-sm flex-shrink-0"
          />
          <EditableText
            regionKey="global.brand"
            fallback="HOPE FOUNDATION"
            className="font-black text-xl md:text-2xl tracking-tighter whitespace-nowrap overflow-hidden text-ellipsis"
          />
        </div>

        <div className="hidden md:flex items-center gap-8 px-4">
          {["Home", "About", "Contact"].map((page) => (
            <button
              key={page}
              onClick={() => setActivePage(page.toLowerCase() as any)}
              className={`text-sm font-bold transition-all uppercase tracking-widest ${activePage === page.toLowerCase() ? "scale-105" : "opacity-60 hover:opacity-100"
                }`}
              style={{ color: activePage === page.toLowerCase() ? theme.primaryColor : theme.textColor }}
            >
              {page}
            </button>
          ))}
        </div>

        <div className="flex-shrink-0">
          <button
            className="px-8 py-3.5 font-bold text-sm transition-transform active:scale-95 shadow-lg hover:shadow-xl"
            style={{
              backgroundColor: theme.primaryColor,
              color: "#fff",
              borderRadius: `${theme.borderRadius * 2}px`,
            }}
          >
            <EditableText regionKey="global.navCta" fallback="DONATE NOW" />
          </button>
        </div>
      </div>
    </nav>
  );

  const Footer = () => (
    <footer
      className="py-24 border-t"
      style={{
        backgroundColor: theme.secondaryColor,
        color: theme.textColor,
        borderColor: `${theme.textColor}10`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-12 gap-12 text-center md:text-left">
        <div className="md:col-span-5 space-y-6">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <EditableImg
              regionKey="global.logo"
              fallback="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=150&h=150&fit=crop"
              className="w-10 h-10 rounded-full"
            />
            <EditableText regionKey="global.brand" fallback="HOPE FOUNDATION" className="font-black text-xl" />
          </div>
          <EditableText
            as="p"
            regionKey="footer.desc"
            fallback="Empowering communities through sustainable development, education, and immediate relief worldwide."
            className="text-base opacity-70 leading-relaxed block max-w-sm mx-auto md:mx-0"
          />
        </div>

        <div className="md:col-span-3 flex flex-col gap-4">
          <h4 className="font-black uppercase tracking-widest text-sm opacity-40 mb-2">Organization</h4>
          {["Home", "About", "Contact"].map((p) => (
            <button key={p} onClick={() => setActivePage(p.toLowerCase() as any)} className="hover:opacity-60 transition-opacity font-medium w-fit mx-auto md:mx-0">
              {p}
            </button>
          ))}
        </div>

        <div className="md:col-span-4 space-y-4">
          <h4 className="font-black uppercase tracking-widest text-sm opacity-40 mb-2">Get in Touch</h4>
          <EditableText regionKey="footer.email" fallback="hello@hopefoundation.org" className="text-base font-bold block" />
          <EditableText regionKey="footer.phone" fallback="+1 (555) 123-4567" className="text-base font-bold block" />
          <EditableText regionKey="footer.address" fallback="123 Charity Ave, New York, NY 10012" className="text-sm opacity-70 block pt-2" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t" style={{ borderColor: `${theme.textColor}10` }}>
        <EditableText regionKey="footer.copy" fallback="© 2024 Hope Foundation. All rights reserved." className="text-xs font-bold opacity-40 block text-center uppercase tracking-widest" />
      </div>
    </footer>
  );

  // --- PAGE VIEWS ---
  const HomeView = () => (
    <div className="animate-in fade-in duration-700 w-full min-w-0">
      <Section id="hero" bgType="primary" className="pt-8 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="space-y-8 order-2 lg:order-1 text-center lg:text-left">
            <div className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-2" style={{ backgroundColor: `${theme.primaryColor}15`, color: theme.primaryColor }}>
              <EditableText regionKey="hero.badge" fallback="Make an Impact Today" />
            </div>
            <EditableText
              as="h1"
              regionKey="hero.title"
              fallback="Bring Hope To Those Who Need It Most."
              className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tighter block break-words"
            />
            <EditableText
              as="p"
              regionKey="hero.subtitle"
              fallback="Join our global mission to provide clean water, quality education, and emergency shelter to vulnerable communities around the world."
              className="text-lg sm:text-xl opacity-70 leading-relaxed block max-w-2xl mx-auto lg:mx-0"
            />
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
              <button
                className="px-10 py-5 font-black uppercase tracking-widest text-sm shadow-xl hover:translate-y-[-2px] transition-all"
                style={{ backgroundColor: theme.primaryColor, color: "#fff", borderRadius: `${theme.borderRadius * 2}px` }}
              >
                <EditableText regionKey="hero.btnPrimary" fallback="Donate Monthly" />
              </button>
              <button
                className="px-10 py-5 font-bold uppercase tracking-widest text-sm hover:bg-opacity-5 transition-all border-2"
                style={{ borderColor: theme.textColor, color: theme.textColor, borderRadius: `${theme.borderRadius * 2}px` }}
                onClick={() => setActivePage("about")}
              >
                <EditableText regionKey="hero.btnSecondary" fallback="Our Mission" />
              </button>
            </div>
          </div>
          <div className="relative order-1 lg:order-2">
            <EditableImg
              regionKey="hero.img"
              fallback="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1600&auto=format&fit=crop"
              className="w-full aspect-square md:aspect-[4/3] lg:aspect-[4/5] object-cover shadow-2xl z-10 relative"
              style={{ borderRadius: `${theme.borderRadius * 3}px ${theme.borderRadius * 10}px ${theme.borderRadius * 3}px ${theme.borderRadius * 3}px` }}
            />
            <div
              className="absolute -bottom-6 -left-6 w-full h-full opacity-10 rounded-full z-0 blur-3xl"
              style={{ backgroundColor: theme.primaryColor }}
            />
          </div>
        </div>
      </Section>

      <Section id="impact" bgType="secondary">
        <div className="text-center mb-16 space-y-4">
          <EditableText as="h2" regionKey="impact.title" fallback="Our Global Impact" className="text-4xl font-black tracking-tight block" />
          <EditableText as="p" regionKey="impact.subtitle" fallback="Because of your generosity, we are changing lives every single day." className="text-lg opacity-70 max-w-2xl mx-auto block" />
        </div>
        <div className="grid sm:grid-cols-3 gap-8">
          {[
            { id: '1', num: "2.5M+", label: "Meals Served" },
            { id: '2', num: "150K", label: "Children Educated" },
            { id: '3', num: "45", label: "Countries Reached" },
          ].map((stat, i) => (
            <div key={i} className="p-10 text-center bg-white shadow-xl" style={{ borderRadius: `${theme.borderRadius * 2}px`, backgroundColor: theme.backgroundColor }}>
              <EditableText as="h3" regionKey={`impact.num${stat.id}`} fallback={stat.num} className="text-5xl lg:text-6xl font-black block mb-4" style={{ color: theme.primaryColor }} />
              <EditableText as="p" regionKey={`impact.label${stat.id}`} fallback={stat.label} className="font-bold uppercase tracking-widest text-sm opacity-60 block" />
            </div>
          ))}
        </div>
      </Section>
    </div>
  );

  const AboutView = () => (
    <Section id="about" bgType="primary" className="min-h-[80vh]">
      <div className="max-w-4xl mx-auto text-center space-y-12 animate-in slide-in-from-bottom-4 duration-700 w-full min-w-0">
        <EditableText as="h1" regionKey="about.title" fallback="Driven by Compassion. Guided by Action." className="text-5xl md:text-7xl font-black tracking-tighter leading-[1.1] block" />
        <EditableText
          as="p"
          regionKey="about.desc"
          fallback="Founded in 2005, the Hope Foundation began with a simple belief: everyone deserves a chance to thrive. Today, we are a global network of volunteers, donors, and community leaders working tirelessly to break the cycle of poverty."
          className="text-xl md:text-2xl opacity-70 leading-relaxed block max-w-3xl mx-auto"
        />
        <EditableImg
          regionKey="about.img"
          fallback="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1600&auto=format&fit=crop"
          className="w-full aspect-video object-cover shadow-2xl mt-12"
          style={{ borderRadius: `${theme.borderRadius * 3}px` }}
        />
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
      className="min-h-screen w-full flex flex-col selection:bg-black selection:text-white"
      style={{ fontFamily: theme.fontFamily, backgroundColor: theme.backgroundColor }}
    >
      {/* Script component handled defensively via standard script tag for previewer compatibility */}
      <script src="https://upload-widget.cloudinary.com/global/all.js" async></script>

      <Navbar />

      <div className="flex flex-col w-full flex-grow min-w-0">
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

      <Footer />

      <style>{`
        html, body { scroll-behavior: smooth; overflow-x: hidden; width: 100%; }
        [contenteditable]:focus { outline: none; background: rgba(0,0,0,0.03); }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-in-from-bottom-4 { from { transform: translateY(2rem); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes zoom-in-95 { from { transform: scale(0.97); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-in { animation-duration: 0.6s; animation-fill-mode: both; }
        .fade-in { animation-name: fade-in; }
        .slide-in-from-bottom-4 { animation-name: slide-in-from-bottom-4; }
        .zoom-in-95 { animation-name: zoom-in-95; }
      `}</style>
    </main>
  );
}







