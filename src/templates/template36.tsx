"use client";

import React, { useState, useCallback, useEffect } from "react";
import Script from "next/script";
import {
  useWebsiteBuilderStore,
  useRegionValue,
} from "@/store/useWebsiteBuilderStore";
import { useThemeStore } from "@/store/useThemeStore";

/**
 * PRODUCTION-SAFE TEMPLATE FOR clyraweb
 * Fixed dependency issues by using safe dynamic checks for the store environment.
 */



type TemplateProps = {
  editableData?: any;
  isPublished?: boolean;
};

export const template36Meta = {
  id: "business/template36",
  name: "Serenity Yoga & Meditation",
  image:
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1600&auto=format&fit=crop",
};

const getNestedValue = (obj: any, path: string) => {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
};

export default function Template36({ editableData, isPublished = false }: TemplateProps) {
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
        className={`cursor-pointer transition-opacity hover:opacity-90 ${className}`}
        onDoubleClick={(e) => {
          e.stopPropagation();
          handleImageUpload(regionKey);
        }}
      />
    );
  };

  // --- LAYOUT COMPONENTS ---
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
      className="sticky top-0 w-full z-40 backdrop-blur-md border-b transition-colors duration-300"
      style={{
        backgroundColor: `${theme.backgroundColor}E6`,
        borderColor: `${theme.textColor}15`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-24 flex items-center justify-between gap-4 overflow-hidden">
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <EditableImg
            regionKey="global.logo"
            fallback="https://images.unsplash.com/photo-1600618528240-fb9fc964b853?w=100&h=100&fit=crop"
            className="w-12 h-12 object-cover rounded-full shadow-sm"
          />
          <EditableText
            regionKey="global.brand"
            fallback="AURA YOGA"
            className="font-light text-xl md:text-2xl tracking-[0.2em] whitespace-nowrap"
          />
        </div>

        <div className="hidden md:flex items-center gap-10 px-4">
          {["Home", "About", "Contact"].map((page) => (
            <button
              key={page}
              onClick={() => setActivePage(page.toLowerCase() as any)}
              className={`text-sm transition-all duration-300 uppercase tracking-widest ${activePage === page.toLowerCase()
                  ? "font-medium scale-105"
                  : "font-light opacity-60 hover:opacity-100 hover:scale-105"
                }`}
              style={{
                color: theme.textColor,
                borderBottom: activePage === page.toLowerCase() ? `2px solid ${theme.primaryColor}` : "2px solid transparent",
                paddingBottom: "4px"
              }}
            >
              {page}
            </button>
          ))}
        </div>

        <div className="flex-shrink-0">
          <button
            className="px-8 py-3 text-xs md:text-sm transition-all duration-300 uppercase tracking-[0.15em] hover:shadow-lg hover:-translate-y-0.5"
            style={{
              backgroundColor: theme.primaryColor,
              color: "#FFFFFF",
              borderRadius: `${theme.borderRadius}px`,
            }}
          >
            <EditableText regionKey="global.navCta" fallback="BOOK CLASS" />
          </button>
        </div>
      </div>
    </nav>
  );

  const Footer = () => (
    <footer
      className="py-24 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundColor: theme.secondaryColor,
        color: theme.textColor,
      }}
    >
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center gap-12">
        <div className="flex flex-col items-center gap-6">
          <EditableImg
            regionKey="global.logo"
            fallback="https://images.unsplash.com/photo-1600618528240-fb9fc964b853?w=100&h=100&fit=crop"
            className="w-16 h-16 rounded-full shadow-md"
          />
          <EditableText
            regionKey="global.brand"
            fallback="AURA YOGA"
            className="font-light text-2xl tracking-[0.2em]"
          />
          <EditableText
            as="p"
            regionKey="footer.desc"
            fallback="Cultivating mindfulness and movement in a chaotic world. Join our sanctuary."
            className="text-base font-light opacity-70 max-w-md leading-relaxed block"
          />
        </div>

        <div className="flex flex-wrap justify-center gap-8">
          {["Home", "About", "Contact"].map((p) => (
            <button
              key={p}
              onClick={() => setActivePage(p.toLowerCase() as any)}
              className="text-sm font-light tracking-widest uppercase opacity-70 hover:opacity-100 transition-opacity"
            >
              {p}
            </button>
          ))}
        </div>

        <div className="flex flex-col items-center gap-2 pt-12 border-t w-full max-w-md" style={{ borderColor: `${theme.textColor}15` }}>
          <EditableText regionKey="footer.email" fallback="hello@aurayoga.studio" className="text-sm font-light tracking-wider block" />
          <EditableText regionKey="footer.copy" fallback="© 2026 Aura Yoga. Designed with clyraweb." className="text-xs font-light opacity-40 block mt-4" />
        </div>
      </div>
    </footer>
  );

  // --- PAGE VIEWS ---
  const HomeView = () => (
    <div className="animate-fade-in">
      <Section id="hero" bgType="primary" className="min-h-[85vh] flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          <div className="space-y-10 order-2 lg:order-1 text-center lg:text-left">
            <div className="space-y-4">
              <EditableText
                as="h3"
                regionKey="hero.kicker"
                fallback="EMBRACE STILLNESS"
                className="text-sm md:text-base font-medium tracking-[0.3em] uppercase block opacity-60"
                style={{ color: theme.primaryColor }}
              />
              <EditableText
                as="h1"
                regionKey="hero.title"
                fallback="Find Your Inner Balance."
                className="text-5xl md:text-7xl font-light leading-[1.1] tracking-tight block"
              />
            </div>
            <EditableText
              as="p"
              regionKey="hero.subtitle"
              fallback="Experience holistic healing through movement, breath, and meditation in our tranquil studio environment."
              className="text-lg md:text-xl font-light opacity-75 leading-relaxed block max-w-xl mx-auto lg:mx-0"
            />
            <div className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start">
              <button
                className="px-10 py-4 uppercase tracking-[0.15em] text-sm font-medium transition-all duration-300 hover:-translate-y-1 hover:shadow-xl w-full sm:w-auto"
                style={{ backgroundColor: theme.primaryColor, color: "#FFFFFF", borderRadius: `${theme.borderRadius}px` }}
              >
                <EditableText regionKey="hero.btn1" fallback="Start Journey" />
              </button>
              <button
                className="px-10 py-4 uppercase tracking-[0.15em] text-sm font-medium transition-all duration-300 hover:opacity-70 w-full sm:w-auto"
                style={{ border: `1px solid ${theme.primaryColor}`, color: theme.primaryColor, borderRadius: `${theme.borderRadius}px` }}
              >
                <EditableText regionKey="hero.btn2" fallback="View Schedule" />
              </button>
            </div>
          </div>
          <div className="relative order-1 lg:order-2 w-full flex justify-center">
            <div className="relative w-full max-w-md lg:max-w-full aspect-[4/5] md:aspect-[3/4]">
              <div
                className="absolute inset-0 translate-x-4 translate-y-4 md:translate-x-8 md:translate-y-8 rounded-t-full rounded-b-full opacity-20"
                style={{ backgroundColor: theme.primaryColor }}
              ></div>
              <EditableImg
                regionKey="hero.img"
                fallback="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop"
                className="absolute inset-0 w-full h-full object-cover shadow-2xl rounded-t-full rounded-b-full"
              />
            </div>
          </div>
        </div>
      </Section>

      <Section id="features" bgType="secondary">
        <div className="text-center mb-16 md:mb-24">
          <EditableText
            as="h2"
            regionKey="features.title"
            fallback="Our Practices"
            className="text-3xl md:text-4xl font-light tracking-wide block"
          />
        </div>
        <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
          {[
            { id: "1", title: "Vinyasa Flow", desc: "Connect breath to movement in our dynamic and fluid sequences designed to build strength and grace." },
            { id: "2", title: "Guided Meditation", desc: "Find mental clarity and profound peace through expert-led stillness practices." },
            { id: "3", title: "Restorative Yin", desc: "Deep tissue release and complete relaxation using props for supported, prolonged poses." }
          ].map((item, idx) => (
            <div key={item.id} className="flex flex-col items-center text-center space-y-6 p-8 bg-white/5 backdrop-blur-sm transition-transform hover:-translate-y-2" style={{ borderRadius: `${theme.borderRadius}px`, border: `1px solid ${theme.textColor}10` }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center opacity-80" style={{ backgroundColor: `${theme.primaryColor}20`, color: theme.primaryColor }}>
                <span className="text-xl font-light">0{idx + 1}</span>
              </div>
              <EditableText as="h3" regionKey={`features.item${item.id}.title`} fallback={item.title} className="text-xl font-medium tracking-wider uppercase block" />
              <EditableText as="p" regionKey={`features.item${item.id}.desc`} fallback={item.desc} className="text-base font-light opacity-70 leading-relaxed block" />
            </div>
          ))}
        </div>
      </Section>
    </div>
  );

  const AboutView = () => (
    <Section id="about" className="animate-fade-in-up min-h-[85vh] flex items-center py-24">
      <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        <div className="relative w-full max-w-lg mx-auto lg:max-w-none">
          <div className="aspect-square relative rounded-full overflow-hidden shadow-2xl border-8" style={{ borderColor: theme.secondaryColor }}>
            <EditableImg
              regionKey="about.img"
              fallback="https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?q=80&w=1200&auto=format&fit=crop"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full opacity-30 blur-2xl" style={{ backgroundColor: theme.primaryColor }}></div>
        </div>
        <div className="space-y-8 text-center lg:text-left">
          <EditableText
            as="h4"
            regionKey="about.kicker"
            fallback="OUR PHILOSOPHY"
            className="text-sm font-medium tracking-[0.3em] uppercase block opacity-60"
            style={{ color: theme.primaryColor }}
          />
          <EditableText
            as="h2"
            regionKey="about.title"
            fallback="A Sanctuary for the Soul."
            className="text-4xl md:text-5xl font-light tracking-tight block leading-tight"
          />
          <EditableText
            as="p"
            regionKey="about.desc1"
            fallback="Founded on the principles of holistic wellness, Aura Yoga was created to be a refuge from the noise of modern life. We believe that true health encompasses the mind, body, and spirit."
            className="text-lg font-light opacity-80 leading-relaxed block"
          />
          <EditableText
            as="p"
            regionKey="about.desc2"
            fallback="Our expert instructors are dedicated to guiding you through a personal journey of discovery, offering support and wisdom at every stage of your practice."
            className="text-lg font-light opacity-80 leading-relaxed block"
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
      className="min-h-screen break-words overflow-x-hidden"
      style={{ fontFamily: theme.fontFamily, backgroundColor: theme.backgroundColor }}
    >
      {/* Script loading via native tag for better environment compatibility */}
      <script src="https://upload-widget.cloudinary.com/global/all.js" async />

      <Navbar />

      <div className="flex flex-col w-full min-w-0">
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
          background-color: rgba(0,0,0,0.03); 
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes fadeInScale { from { transform: scale(0.98); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }
        .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
        .animate-fade-in-scale { animation: fadeInScale 0.6s ease-out forwards; }
      `}</style>
    </main>
  );
}






