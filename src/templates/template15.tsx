"use client";

import React, { useState } from "react";
import Script from "next/script";
import {
  useWebsiteBuilderStore,
  useRegionValue,
} from "@/store/useWebsiteBuilderStore";
import { useThemeStore } from "@/store/useThemeStore";



export const template15Meta = {
  id: "business/template15",
  name: "Construction Build",
  image:
    "https://images.unsplash.com/photo-1541888086225-f6409f874288?q=80&w=1600&auto=format&fit=crop",
};

type TemplateProps = {
  editableData?: any;
  isPublished?: boolean;
};

const getNestedValue = (obj: any, path: string) => {
  if (!obj) return undefined;
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
};

export default function Template15({ editableData, isPublished = false }: TemplateProps) {
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
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

      if (!cloudName) return;

      (window as any).cloudinary
        .createUploadWidget(
          {
            cloudName,
            uploadPreset,
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
        className={`focus:outline-none focus:ring-2 focus:ring-orange-500 rounded transition-all ${className}`}
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
      className="sticky top-0 w-full z-40 border-b shadow-sm"
      style={{
        backgroundColor: theme.backgroundColor,
        borderColor: `${theme.textColor}15`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-24 flex items-center justify-between gap-3 overflow-hidden">
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <EditableImg
            regionKey="global.logo"
            fallback="https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=100&h=100&fit=crop"
            className="w-12 h-12 object-cover border-2"
            style={{ borderColor: theme.primaryColor, borderRadius: `${theme.borderRadius}px` }}
          />
          <EditableText
            regionKey="global.brand"
            fallback="APEX BUILDERS"
            className="font-black text-2xl tracking-tight whitespace-nowrap uppercase"
          />
        </div>

        <div className="hidden md:flex items-center gap-8 px-4">
          {["Home", "About", "Contact"].map((page) => (
            <button
              key={page}
              onClick={() => setActivePage(page.toLowerCase() as any)}
              className={`text-sm font-bold transition-all uppercase tracking-widest border-b-2 py-1 ${activePage === page.toLowerCase() ? "border-current" : "border-transparent opacity-60 hover:opacity-100"
                }`}
              style={{ color: activePage === page.toLowerCase() ? theme.primaryColor : theme.textColor }}
            >
              {page}
            </button>
          ))}
        </div>

        <div className="flex-shrink-0 hidden sm:block">
          <button
            className="px-8 py-3 font-black text-sm transition-transform active:scale-95 uppercase tracking-wider"
            style={{
              backgroundColor: theme.primaryColor,
              color: "#ffffff",
              borderRadius: `${theme.borderRadius}px`,
            }}
          >
            <EditableText regionKey="global.navCta" fallback="GET A QUOTE" />
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
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left break-words">
        <div className="md:col-span-2 space-y-6">
          <div className="flex items-center justify-center md:justify-start gap-4">
            <EditableImg
              regionKey="global.logo"
              fallback="https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=100&h=100&fit=crop"
              className="w-10 h-10 object-cover"
              style={{ borderRadius: `${theme.borderRadius}px` }}
            />
            <EditableText regionKey="global.brand" fallback="APEX BUILDERS" className="font-black text-xl uppercase tracking-tight" />
          </div>
          <EditableText
            as="p"
            regionKey="footer.desc"
            fallback="Laying the foundation for tomorrow. We deliver structural excellence, on time and under budget."
            className="text-sm opacity-80 leading-relaxed block max-w-sm mx-auto md:mx-0"
          />
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="font-black uppercase tracking-widest text-xs opacity-50 mb-2">Company</h4>
          {["Home", "About", "Contact"].map((p) => (
            <button key={p} onClick={() => setActivePage(p.toLowerCase() as any)} className="hover:underline text-sm font-bold w-fit mx-auto md:mx-0 uppercase">
              {p}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <h4 className="font-black uppercase tracking-widest text-xs opacity-50 mb-2">Reach Us</h4>
          <EditableText regionKey="footer.email" fallback="projects@apexbuilders.com" className="text-sm font-bold block" />
          <EditableText regionKey="footer.phone" fallback="+1 (555) 987-6543" className="text-sm font-bold block" />
          <EditableText regionKey="footer.copy" fallback="© 2024 Apex Builders Inc." className="text-xs opacity-40 block pt-6" />
        </div>
      </div>
    </footer>
  );

  // --- PAGE VIEWS ---
  const HomeView = () => (
    <div className="animate-in fade-in duration-700 w-full flex flex-col">
      <Section id="hero" bgType="primary" className="pt-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="space-y-8 order-2 lg:order-1">
            <div className="inline-block px-4 py-1 border-2 font-black text-xs tracking-widest uppercase mb-4" style={{ borderColor: theme.primaryColor, color: theme.primaryColor }}>
              <EditableText regionKey="home.badge" fallback="HEAVY ENGINEERING & DESIGN" />
            </div>
            <EditableText
              as="h1"
              regionKey="home.hero.title"
              fallback="BUILDING THE FUTURE, TODAY."
              className="text-5xl sm:text-6xl md:text-7xl font-black leading-[1.05] tracking-tighter block uppercase"
            />
            <EditableText
              as="p"
              regionKey="home.hero.subtitle"
              fallback="From monumental commercial structures to robust industrial complexes, we engineer strength into every square inch."
              className="text-lg md:text-xl opacity-80 leading-relaxed block max-w-xl font-medium"
            />
            <div className="flex flex-wrap gap-4 pt-4">
              <button
                className="px-8 py-4 font-black uppercase tracking-widest text-sm shadow-xl transition-all"
                style={{ backgroundColor: theme.primaryColor, color: "#fff", borderRadius: `${theme.borderRadius}px` }}
                onClick={() => setActivePage("contact")}
              >
                <EditableText regionKey="home.hero.btn1" fallback="START PROJECT" />
              </button>
              <button
                className="px-8 py-4 font-black uppercase tracking-widest text-sm transition-all border-2"
                style={{ borderColor: theme.textColor, color: theme.textColor, borderRadius: `${theme.borderRadius}px` }}
                onClick={() => setActivePage("about")}
              >
                <EditableText regionKey="home.hero.btn2" fallback="OUR CAPABILITIES" />
              </button>
            </div>
          </div>
          <div className="relative order-1 lg:order-2">
            <EditableImg
              regionKey="home.hero.img"
              fallback="https://images.unsplash.com/photo-1541888086225-f6409f874288?q=80&w=1600&auto=format&fit=crop"
              className="w-full aspect-square lg:aspect-[4/5] object-cover shadow-2xl"
              style={{ borderRadius: `${theme.borderRadius}px`, borderBottom: `8px solid ${theme.primaryColor}` }}
            />
          </div>
        </div>
      </Section>

      <Section id="services" bgType="secondary">
        <div className="text-center mb-16 space-y-4">
          <EditableText as="h2" regionKey="home.services.title" fallback="CORE DIVISIONS" className="text-4xl md:text-5xl font-black uppercase tracking-tight block" />
          <EditableText as="p" regionKey="home.services.desc" fallback="Delivering end-to-end construction solutions with unwavering safety standards." className="text-lg opacity-70 block max-w-2xl mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white/5 p-8 border hover:-translate-y-2 transition-transform duration-300" style={{ borderColor: `${theme.textColor}15`, borderRadius: `${theme.borderRadius}px`, backgroundColor: theme.backgroundColor }}>
              <div className="w-16 h-16 mb-6 flex items-center justify-center font-black text-2xl" style={{ backgroundColor: theme.primaryColor, color: "#fff", borderRadius: `${theme.borderRadius}px` }}>
                0{i}
              </div>
              <EditableText as="h3" regionKey={`home.service.${i}.title`} fallback={i === 1 ? "COMMERCIAL" : i === 2 ? "INDUSTRIAL" : "INFRASTRUCTURE"} className="text-xl font-black uppercase tracking-wide block mb-4" />
              <EditableText as="p" regionKey={`home.service.${i}.desc`} fallback="Comprehensive planning and execution for large-scale developments and specialized facilities." className="opacity-70 leading-relaxed block text-sm font-medium" />
            </div>
          ))}
        </div>
      </Section>
    </div>
  );

  const AboutView = () => (
    <Section id="about" className="animate-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="relative">
          <EditableImg
            regionKey="about.img"
            fallback="https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1600&auto=format&fit=crop"
            className="w-full aspect-video lg:aspect-square object-cover shadow-2xl"
            style={{ borderRadius: `${theme.borderRadius}px` }}
          />
          <div className="absolute -bottom-8 -right-8 p-8 hidden md:block shadow-xl" style={{ backgroundColor: theme.primaryColor, color: "#fff", borderRadius: `${theme.borderRadius}px` }}>
            <EditableText regionKey="about.stats.years" fallback="25+" className="text-5xl font-black block" />
            <span className="text-sm font-bold uppercase tracking-widest mt-2 block">Years Building</span>
          </div>
        </div>
        <div className="space-y-8">
          <EditableText as="h2" regionKey="about.title" fallback="FORGED IN STEEL. PROVEN IN CONCRETE." className="text-4xl md:text-6xl font-black uppercase tracking-tighter block leading-tight" />
          <EditableText
            as="p"
            regionKey="about.desc"
            fallback="Apex Builders was founded on a simple premise: build it right, build it to last. Over the past two decades, we have transformed city skylines and erected facilities that drive global industry. Our team of veteran engineers, project managers, and tradesmen bring unmatched expertise to every job site."
            className="text-lg opacity-80 leading-relaxed block font-medium"
          />
          <div className="grid grid-cols-2 gap-8 pt-8 border-t" style={{ borderColor: `${theme.textColor}20` }}>
            <div>
              <EditableText regionKey="about.stat1.val" fallback="150+" className="text-4xl font-black block mb-2" style={{ color: theme.primaryColor }} />
              <EditableText regionKey="about.stat1.label" fallback="COMPLETED PROJECTS" className="text-xs font-bold uppercase tracking-widest opacity-60 block" />
            </div>
            <div>
              <EditableText regionKey="about.stat2.val" fallback="ZERO" className="text-4xl font-black block mb-2" style={{ color: theme.primaryColor }} />
              <EditableText regionKey="about.stat2.label" fallback="SAFETY INCIDENTS" className="text-xs font-bold uppercase tracking-widest opacity-60 block" />
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
      className="min-h-screen selection:bg-orange-500 selection:text-white flex flex-col w-full max-w-full overflow-x-hidden"
      style={{ fontFamily: theme.fontFamily, backgroundColor: theme.backgroundColor }}
    >
      {/* Dynamic script loading for Cloudinary in clyraweb environment */}
      <script src="https://upload-widget.cloudinary.com/global/all.js" async></script>

      <Navbar />

      <div className="flex flex-col w-full flex-1">
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

      <style dangerouslySetInnerHTML={{
        __html: `
        html { scroll-behavior: smooth; }
        body { overflow-x: hidden; }
        [contenteditable]:focus { outline: none; background: rgba(0,0,0,0.05); }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-in-from-bottom-4 { from { transform: translateY(1.5rem); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes zoom-in-95 { from { transform: scale(0.97); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-in { animation-duration: 0.6s; animation-fill-mode: both; animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1); }
        .fade-in { animation-name: fade-in; }
        .slide-in-from-bottom-4 { animation-name: slide-in-from-bottom-4; }
        .zoom-in-95 { animation-name: zoom-in-95; }
      `}} />
    </main>
  );
}





