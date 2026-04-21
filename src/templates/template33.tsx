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
 * Theme: Mobile App Showcase (Canva-inspired UI/UX)
 */



export const template33Meta = {
  id: "business/template33",
  name: "Mobile App Showcase",
  image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1600&auto=format&fit=crop",
};

type TemplateProps = {
  editableData?: any;
  isPublished?: boolean;
};

const getNestedValue = (obj: any, path: string) => {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
};

export default function Template33({ editableData, isPublished = false }: TemplateProps) {
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
    if (typeof window !== "undefined" && (window as any).cloudinary && process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
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
        className={`focus:outline-none focus:ring-2 focus:ring-opacity-50 rounded transition-all min-w-0 break-words ${className}`}
        style={{ '--tw-ring-color': theme.primaryColor } as React.CSSProperties}
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
        className={`cursor-pointer transition-transform hover:scale-[1.02] max-w-full ${className}`}
        onDoubleClick={(e) => {
          e.stopPropagation();
          handleImageUpload(regionKey);
        }}
      />
    );
  };

  const Section = ({ children, id, bgType = "primary", customBg }: any) => (
    <section
      id={id}
      style={{
        padding: `${theme.sectionSpacing}px 0`,
        backgroundColor: customBg ? customBg : (bgType === "primary" ? theme.backgroundColor : theme.secondaryColor),
        color: bgType === "dark" ? "#ffffff" : theme.textColor,
      }}
      className="w-full flex justify-center overflow-hidden min-w-0"
    >
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex-wrap break-words">{children}</div>
    </section>
  );

  const Navbar = () => (
    <nav
      className="sticky top-0 w-full z-50 backdrop-blur-xl border-b max-w-full overflow-hidden min-w-0"
      style={{
        backgroundColor: `${theme.backgroundColor}E6`,
        borderColor: `${theme.textColor}10`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <EditableImg
            regionKey="global.logo"
            fallback="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200&auto=format&fit=crop"
            className="w-10 h-10 object-cover shadow-sm"
            style={{ borderRadius: `${theme.borderRadius / 2}px` }}
          />
          <EditableText
            regionKey="global.brand"
            fallback="AppFlow"
            className="font-extrabold text-xl tracking-tight whitespace-nowrap truncate"
          />
        </div>

        <div className="hidden md:flex items-center gap-8 px-4 flex-wrap">
          {["Home", "About", "Contact"].map((page) => (
            <button
              key={page}
              onClick={() => setActivePage(page.toLowerCase() as any)}
              className={`text-sm font-bold transition-all ${activePage === page.toLowerCase() ? "scale-105" : "opacity-60 hover:opacity-100"
                }`}
              style={{ color: activePage === page.toLowerCase() ? theme.primaryColor : theme.textColor }}
            >
              {page}
            </button>
          ))}
        </div>

        <div className="flex-shrink-0">
          <button
            className="px-6 py-2.5 font-bold text-sm shadow-md transition-transform hover:scale-105 active:scale-95"
            style={{
              backgroundColor: theme.primaryColor,
              color: "#ffffff",
              borderRadius: `${theme.borderRadius}px`,
            }}
          >
            <EditableText regionKey="global.navCta" fallback="Get the App" />
          </button>
        </div>
      </div>
    </nav>
  );

  const Footer = () => (
    <footer
      className="py-16 border-t w-full max-w-full overflow-hidden min-w-0"
      style={{
        backgroundColor: theme.backgroundColor,
        color: theme.textColor,
        borderColor: `${theme.textColor}10`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-4 gap-12 text-center md:text-left flex-wrap break-words">
        <div className="space-y-4 md:col-span-2">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <EditableImg
              regionKey="global.logo"
              fallback="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200&auto=format&fit=crop"
              className="w-8 h-8 object-cover"
              style={{ borderRadius: `${theme.borderRadius / 2}px` }}
            />
            <EditableText regionKey="global.brand" fallback="AppFlow" className="font-extrabold text-lg" />
          </div>
          <EditableText
            as="p"
            regionKey="footer.desc"
            fallback="Design seamlessly, build rapidly, and scale infinitely with the ultimate mobile platform."
            className="text-sm opacity-60 leading-relaxed block max-w-sm mx-auto md:mx-0"
          />
        </div>
        <div className="flex flex-col gap-3 min-w-0">
          <h4 className="font-bold text-xs opacity-50 uppercase tracking-widest mb-2">Platform</h4>
          {["Home", "About", "Contact"].map((p) => (
            <button key={p} onClick={() => setActivePage(p.toLowerCase() as any)} className="hover:opacity-70 text-sm font-medium w-fit mx-auto md:mx-0 transition-opacity">
              {p}
            </button>
          ))}
        </div>
        <div className="space-y-3 min-w-0">
          <h4 className="font-bold text-xs opacity-50 uppercase tracking-widest mb-2">Connect</h4>
          <EditableText regionKey="footer.email" fallback="hello@appflow.com" className="text-sm font-medium block" />
          <EditableText regionKey="footer.copy" fallback="© 2026 AppFlow Inc." className="text-xs opacity-40 block pt-4" />
        </div>
      </div>
    </footer>
  );

  // --- PAGE VIEWS ---
  const HomeView = () => (
    <div className="animate-fade-in w-full max-w-full overflow-hidden">
      {/* Hero Section */}
      <section
        id="hero"
        className="relative w-full flex justify-center overflow-hidden min-w-0"
        style={{
          padding: `${theme.sectionSpacing * 1.2}px 0`,
          background: `linear-gradient(135deg, ${theme.secondaryColor} 0%, ${theme.backgroundColor} 100%)`,
          color: theme.textColor,
        }}
      >
        {/* Abstract Background Blob (Canva style) */}
        <div
          className="absolute top-0 right-0 w-full md:w-1/2 h-full opacity-10 pointer-events-none"
          style={{ background: `radial-gradient(circle, ${theme.primaryColor} 0%, transparent 70%)` }}
        />

        <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="space-y-8 text-center lg:text-left flex-wrap break-words min-w-0">
            <div className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-wide" style={{ backgroundColor: `${theme.primaryColor}15`, color: theme.primaryColor }}>
              <EditableText regionKey="hero.badge" fallback="🚀 v2.0 Now Available on iOS & Android" />
            </div>
            <EditableText
              as="h1"
              regionKey="hero.title"
              fallback="Create your best work, on the go."
              className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-[1.1] tracking-tight block drop-shadow-sm"
            />
            <EditableText
              as="p"
              regionKey="hero.subtitle"
              fallback="The intuitive, powerful app designed for creators. Bring your ideas to life anywhere with our revolutionary mobile toolset."
              className="text-lg md:text-xl opacity-75 leading-relaxed block max-w-xl mx-auto lg:mx-0"
            />
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                className="px-8 py-4 font-bold text-base shadow-xl hover:-translate-y-1 transition-all"
                style={{ backgroundColor: theme.primaryColor, color: "#fff", borderRadius: `${theme.borderRadius}px` }}
              >
                <EditableText regionKey="hero.btnPrimary" fallback="Download Free" />
              </button>
              <button
                className="px-8 py-4 font-bold text-base transition-all hover:opacity-80"
                style={{ backgroundColor: "transparent", border: `2px solid ${theme.textColor}20`, color: theme.textColor, borderRadius: `${theme.borderRadius}px` }}
              >
                <EditableText regionKey="hero.btnSecondary" fallback="See Features" />
              </button>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-sm lg:max-w-md perspective-1000">
            {/* App Mockup Container */}
            <div className="relative transform rotate-y-[-10deg] rotate-x-[5deg] hover:rotate-0 transition-transform duration-700 ease-out shadow-2xl overflow-hidden"
              style={{ borderRadius: `${theme.borderRadius * 1.5}px`, border: `8px solid ${theme.backgroundColor}` }}>
              <EditableImg
                regionKey="hero.mockup"
                fallback="https://images.unsplash.com/photo-1607252656733-fd7421b05b49?q=80&w=800&auto=format&fit=crop"
                className="w-full aspect-[9/19] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <Section id="features" bgType="secondary">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <EditableText as="h2" regionKey="features.title" fallback="Everything you need to succeed" className="text-4xl md:text-5xl font-extrabold tracking-tight block" />
          <EditableText as="p" regionKey="features.desc" fallback="Beautiful templates, smart tools, and endless possibilities packed into one app." className="text-lg opacity-70 block" />
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((num) => (
            <div key={num} className="p-8 bg-white shadow-lg transition-transform hover:-translate-y-2" style={{ borderRadius: `${theme.borderRadius}px`, backgroundColor: theme.backgroundColor }}>
              <div className="w-14 h-14 mb-6 flex items-center justify-center text-2xl" style={{ backgroundColor: `${theme.primaryColor}15`, color: theme.primaryColor, borderRadius: `${theme.borderRadius / 1.5}px` }}>
                <EditableText regionKey={`features.icon${num}`} fallback={num === 1 ? "✨" : num === 2 ? "⚡" : "🛡️"} />
              </div>
              <EditableText as="h3" regionKey={`features.item${num}.title`} fallback={`Feature ${num}`} className="text-xl font-bold mb-3 block" />
              <EditableText as="p" regionKey={`features.item${num}.desc`} fallback="A brief description of this amazing feature highlighting user benefits." className="opacity-70 leading-relaxed block text-sm" />
            </div>
          ))}
        </div>
      </Section>
    </div>
  );

  const AboutView = () => (
    <div className="animate-slide-up w-full max-w-full overflow-hidden">
      <Section id="about" bgType="primary">
        <div className="grid lg:grid-cols-2 gap-16 items-center flex-wrap min-w-0 break-words">
          <div className="order-2 lg:order-1 relative">
            <div className="absolute inset-0 transform translate-x-4 translate-y-4 rounded-3xl opacity-20" style={{ backgroundColor: theme.primaryColor, borderRadius: `${theme.borderRadius * 2}px` }}></div>
            <EditableImg
              regionKey="about.img"
              fallback="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop"
              className="w-full aspect-square object-cover shadow-xl relative z-10"
              style={{ borderRadius: `${theme.borderRadius * 2}px` }}
            />
          </div>
          <div className="space-y-6 order-1 lg:order-2">
            <h4 className="text-sm font-bold uppercase tracking-widest" style={{ color: theme.primaryColor }}>Our Mission</h4>
            <EditableText as="h2" regionKey="about.title" fallback="Democratizing design for everyone." className="text-4xl md:text-5xl font-extrabold tracking-tight block" />
            <EditableText
              as="p"
              regionKey="about.desc"
              fallback="We started with a simple idea: powerful tools shouldn't be complicated. Our team has completely reimagined the mobile creative experience, focusing on drag-and-drop simplicity without sacrificing professional capabilities."
              className="text-lg opacity-75 leading-relaxed block"
            />
            <div className="pt-6 flex gap-8">
              <div>
                <EditableText as="div" regionKey="about.stat1Num" fallback="10M+" className="text-3xl font-extrabold block" style={{ color: theme.primaryColor }} />
                <EditableText as="div" regionKey="about.stat1Text" fallback="Active Users" className="text-sm font-bold opacity-60 uppercase tracking-wider block mt-1" />
              </div>
              <div>
                <EditableText as="div" regionKey="about.stat2Num" fallback="4.9" className="text-3xl font-extrabold block" style={{ color: theme.primaryColor }} />
                <EditableText as="div" regionKey="about.stat2Text" fallback="App Store Rating" className="text-sm font-bold opacity-60 uppercase tracking-wider block mt-1" />
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
      className="min-h-screen w-full max-w-full overflow-x-hidden relative"
      style={{ fontFamily: theme.fontFamily, backgroundColor: theme.backgroundColor }}
    >
      <Script
        src="https://upload-widget.cloudinary.com/global/all.js"
        strategy="afterInteractive"
      />

      <Navbar />

      <div className="flex flex-col w-full max-w-full overflow-hidden min-w-0">
        {activePage === "home" && <HomeView />}
        {activePage === "about" && <AboutView />}
        {activePage === "contact" && <ContactView />}
      </div>

      <Footer />

      <style>{`
        html, body { 
          max-width: 100vw; 
          overflow-x: hidden; 
          scroll-behavior: smooth; 
        }
        [contenteditable]:focus { 
          outline: none; 
          background: rgba(0,0,0,0.03); 
        }
        .perspective-1000 { perspective: 1000px; }
        .rotate-y-[-10deg] { transform: rotateY(-10deg); }
        .rotate-x-[5deg] { transform: rotateX(5deg); }
        
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-up { from { transform: translateY(2rem); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes zoom-in { from { transform: scale(0.97); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        
        .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
        .animate-slide-up { animation: slide-up 0.6s ease-out forwards; }
        .animate-zoom-in { animation: zoom-in 0.5s ease-out forwards; }
      `}</style>
    </main>
  );
}




