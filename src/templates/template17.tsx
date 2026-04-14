"use client";

import React, { useState, useEffect } from "react";

/**
 * PRODUCTION-SAFE TEMPLATE FOR CLYRA
 * Built with internal routing, dynamic theme support, and Cloudinary integration.
 * Topic: Pet Care & Grooming (template17)
 */

// --- DYNAMIC STORE IMPORTS ---
let useWebsiteBuilderStore: any;
let useRegionValue: any;
let useThemeStore: any;

try {
  const websiteStore = require("@/store/useWebsiteBuilderStore");
  useWebsiteBuilderStore = websiteStore.useWebsiteBuilderStore;
  useRegionValue = websiteStore.useRegionValue;
  const themeStore = require("@/store/useThemeStore");
  useThemeStore = themeStore.useThemeStore;
} catch (e) {
  // Fallback for preview/compiler isolation
  useWebsiteBuilderStore = (selector: any) => selector({ updateRegion: () => {} });
  useRegionValue = () => null;
  useThemeStore = () => ({
    theme: {
      backgroundColor: "#fffdfa", 
      textColor: "#3f2b26", 
      primaryColor: "#f4a261", 
      secondaryColor: "#e9edc9", 
      borderRadius: 24, 
      sectionSpacing: 80,
      fontFamily: "Nunito, Inter, sans-serif",
    },
  });
}

export const template17Meta = {
  id: "business/template17",
  name: "Pet Care & Grooming",
  image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=1600&auto=format&fit=crop",
};

type TemplateProps = {
  editableData?: any;
};

const getNestedValue = (obj: any, path: string) => {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
};

export default function Template17({ editableData }: TemplateProps) {
  const [activePage, setActivePage] = useState<"home" | "about" | "contact">("home");
  const { theme } = useThemeStore();
  const updateRegion = useWebsiteBuilderStore((state: any) => state.updateRegion);

  // --- SCRIPT LOADING FOR CLOUDINARY ---
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

  // --- CLYRA EDITABLE COMPONENTS ---
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
        className={`cursor-pointer transition-opacity hover:opacity-90 object-cover ${className}`}
        style={style}
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
      <div className="w-full max-w-6xl">{children}</div>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-24 flex items-center justify-between gap-3 overflow-hidden">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <EditableImg
            regionKey="global.logo"
            fallback="https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?w=100&h=100&fit=crop"
            className="w-12 h-12 rounded-full border-2"
            style={{ borderColor: theme.primaryColor }}
          />
          <EditableText
            regionKey="global.brand"
            fallback="Happy Paws"
            className="font-extrabold text-2xl tracking-tight whitespace-nowrap"
          />
        </div>

        <div className="hidden md:flex items-center gap-8 px-4 bg-white/30 py-3 rounded-full shadow-sm border border-black/5" style={{ borderRadius: 999 }}>
          {["Home", "About", "Contact"].map((page) => (
            <button
              key={page}
              onClick={() => setActivePage(page.toLowerCase() as any)}
              className={`text-sm font-bold transition-all px-4 py-1 rounded-full ${
                activePage === page.toLowerCase() ? "shadow-sm" : "opacity-70 hover:opacity-100"
              }`}
              style={{
                backgroundColor: activePage === page.toLowerCase() ? theme.backgroundColor : "transparent",
                color: activePage === page.toLowerCase() ? theme.primaryColor : theme.textColor,
              }}
            >
              {page}
            </button>
          ))}
        </div>

        <div className="flex-shrink-0">
          <button
            className="px-6 py-3 font-bold text-sm transition-transform active:scale-95 shadow-md hover:shadow-lg"
            style={{
              backgroundColor: theme.primaryColor,
              color: "#ffffff",
              borderRadius: 999, 
            }}
          >
            <EditableText regionKey="global.navCta" fallback="Book Visit" />
          </button>
        </div>
      </div>
    </nav>
  );

  const Footer = () => (
    <footer
      className="py-16 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundColor: theme.secondaryColor,
        color: theme.textColor,
      }}
    >
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12 text-center md:text-left">
        <div className="space-y-4">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <EditableImg
              regionKey="global.logo"
              fallback="https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?w=100&h=100&fit=crop"
              className="w-10 h-10 rounded-full"
            />
            <EditableText regionKey="global.brand" fallback="Happy Paws" className="font-extrabold text-xl" />
          </div>
          <EditableText
            as="p"
            regionKey="footer.desc"
            fallback="Premium care, grooming, and boarding for your furry best friends. Because they deserve the world."
            className="text-sm opacity-80 leading-relaxed block max-w-xs mx-auto md:mx-0"
          />
        </div>
        
        <div className="flex flex-col gap-3">
          <h4 className="font-extrabold uppercase tracking-widest text-xs opacity-50 mb-2">Quick Links</h4>
          {["Home", "About", "Contact"].map((p) => (
            <button 
              key={p} 
              onClick={() => setActivePage(p.toLowerCase() as any)} 
              className="hover:translate-x-1 transition-transform text-sm font-bold w-fit mx-auto md:mx-0"
              style={{ color: theme.primaryColor }}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          <h4 className="font-extrabold uppercase tracking-widest text-xs opacity-50 mb-2">Get in Touch</h4>
          <EditableText regionKey="footer.phone" fallback="+1 (555) 123-PAWS" className="text-sm font-bold block" />
          <EditableText regionKey="footer.email" fallback="hello@happypaws.care" className="text-sm font-bold block" />
          <EditableText regionKey="footer.copy" fallback="© 2024 Happy Paws Clinic." className="text-xs opacity-50 block pt-6" />
        </div>
      </div>
    </footer>
  );

  // --- PAGE VIEWS ---
  const HomeView = () => (
    <div className="animate-in fade-in">
      <Section id="hero" bgType="primary">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 text-center lg:text-left z-10">
            <div className="inline-block px-4 py-1.5 rounded-full text-xs font-bold mb-2 shadow-sm" style={{ backgroundColor: theme.secondaryColor, color: theme.textColor }}>
              <EditableText regionKey="hero.badge" fallback="🐾 #1 Rated Pet Spa in Town" />
            </div>
            <EditableText
              as="h1"
              regionKey="hero.title"
              fallback="Where Pets Are Treated Like Family."
              className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-[1.1] tracking-tight block text-balance"
            />
            <EditableText
              as="p"
              regionKey="hero.subtitle"
              fallback="Expert grooming, veterinary care, and luxury boarding services tailored for your furry companion's happiness."
              className="text-lg sm:text-xl opacity-80 leading-relaxed block max-w-lg mx-auto lg:mx-0 text-balance"
            />
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
              <button
                className="px-8 py-4 font-extrabold text-sm shadow-lg hover:scale-105 transition-transform"
                style={{ backgroundColor: theme.primaryColor, color: "#fff", borderRadius: theme.borderRadius }}
              >
                <EditableText regionKey="hero.btn1" fallback="Book Appointment" />
              </button>
              <button
                className="px-8 py-4 font-extrabold text-sm hover:bg-black/5 transition-colors"
                style={{ color: theme.textColor, borderRadius: theme.borderRadius }}
              >
                <EditableText regionKey="hero.btn2" fallback="Our Services" />
              </button>
            </div>
          </div>
          <div className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-square mx-auto max-w-lg lg:max-w-none">
            <div 
              className="absolute inset-0 translate-x-4 translate-y-4 opacity-50" 
              style={{ backgroundColor: theme.primaryColor, borderRadius: `${theme.borderRadius * 2}px` }}
            />
            <EditableImg
              regionKey="hero.img"
              fallback="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1000&auto=format&fit=crop"
              className="relative w-full h-full object-cover shadow-2xl z-10"
              style={{ borderRadius: `${theme.borderRadius}px ${theme.borderRadius * 3}px ${theme.borderRadius}px ${theme.borderRadius * 2}px` }}
            />
          </div>
        </div>
      </Section>

      <Section id="features" bgType="secondary">
        <div className="text-center mb-16">
          <EditableText as="h2" regionKey="features.title" fallback="Our Pawsome Services" className="text-4xl md:text-5xl font-extrabold tracking-tight block mb-4" />
          <EditableText as="p" regionKey="features.subtitle" fallback="Everything your pet needs under one roof." className="text-lg opacity-80 block" />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { id: "1", title: "Grooming & Spa", desc: "Bath, haircuts, and relaxing massages.", img: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=500&fit=crop" },
            { id: "2", title: "Veterinary Care", desc: "Routine checkups and emergency care.", img: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500&fit=crop" },
            { id: "3", title: "Daycare & Play", desc: "Supervised fun with furry friends.", img: "https://images.unsplash.com/photo-1544568100-847a948585b9?w=500&fit=crop" }
          ].map((feature, idx) => (
            <div 
              key={feature.id} 
              className="bg-white p-6 shadow-sm hover:shadow-xl transition-all flex flex-col gap-4 group"
              style={{ borderRadius: theme.borderRadius }}
            >
              <EditableImg
                regionKey={`feature.${idx}.img`}
                fallback={feature.img}
                className="w-full aspect-video object-cover mb-4 group-hover:scale-[1.02] transition-transform"
                style={{ borderRadius: theme.borderRadius - 8 }}
              />
              <EditableText as="h3" regionKey={`feature.${idx}.title`} fallback={feature.title} className="text-xl font-extrabold block" />
              <EditableText as="p" regionKey={`feature.${idx}.desc`} fallback={feature.desc} className="text-base opacity-70 block" />
            </div>
          ))}
        </div>
      </Section>
    </div>
  );

  const AboutView = () => (
    <div className="animate-in fade-in">
      <Section id="about" bgType="primary">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 relative">
            <div 
              className="absolute inset-0 -translate-x-4 -translate-y-4 opacity-50" 
              style={{ backgroundColor: theme.secondaryColor, borderRadius: `${theme.borderRadius * 3}px` }}
            />
            <EditableImg
              regionKey="about.img"
              fallback="https://images.unsplash.com/photo-1587300003388-59208cb962c6?w=1000&fit=crop"
              className="relative w-full aspect-[4/5] object-cover shadow-xl z-10"
              style={{ borderRadius: theme.borderRadius * 1.5 }}
            />
          </div>
          <div className="order-1 lg:order-2 space-y-8">
            <EditableText as="h2" regionKey="about.title" fallback="Passionate About Paws" className="text-5xl sm:text-6xl font-extrabold tracking-tight block text-balance" />
            <EditableText
              as="p"
              regionKey="about.desc1"
              fallback="Founded in 2010, Happy Paws started with a simple mission: to provide pets with the same level of care, love, and respect that humans expect. We are a team of certified groomers, experienced vets, and lifelong animal lovers."
              className="text-lg opacity-80 leading-relaxed block"
            />
            <EditableText
              as="p"
              regionKey="about.desc2"
              fallback="Every wagging tail and happy purr drives us forward. Our facilities are designed to be stress-free, engaging, and absolutely safe for your companions."
              className="text-lg opacity-80 leading-relaxed block"
            />
            
            <div className="p-6 mt-8 shadow-sm" style={{ backgroundColor: theme.secondaryColor, borderRadius: theme.borderRadius }}>
              <EditableText as="h4" regionKey="about.quote" fallback="“They are not just pets, they are family. And we treat them as such.”" className="text-xl font-bold italic block" />
              <EditableText as="p" regionKey="about.author" fallback="- Dr. Sarah Jenkins, Founder" className="text-sm font-bold opacity-70 block mt-2" />
            </div>
          </div>
        </div>
      </Section>
    </div>
  );

  const ContactView = () => (
    <div className="animate-in fade-in">
      <Section id="contact" bgType="primary">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <EditableText as="h1" regionKey="contact.title" fallback="Let's Connect!" className="text-5xl sm:text-6xl font-extrabold tracking-tight block mb-4" />
            <EditableText as="p" regionKey="contact.subtitle" fallback="Ready to book an appointment or have a question? We're all ears." className="text-xl opacity-80 block max-w-2xl mx-auto" />
          </div>

          <div 
            className="grid md:grid-cols-5 gap-0 overflow-hidden shadow-2xl" 
            style={{ borderRadius: theme.borderRadius * 1.5, backgroundColor: theme.secondaryColor }}
          >
            <div className="md:col-span-2 p-10 md:p-12 text-white flex flex-col justify-between relative overflow-hidden" style={{ backgroundColor: theme.primaryColor }}>
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white opacity-10 rounded-full" />
              
              <div className="relative z-10 space-y-10">
                <div>
                  <h4 className="text-sm font-extrabold uppercase tracking-widest opacity-80 mb-2">Visit Us</h4>
                  <EditableText regionKey="contact.address" fallback="123 Puppy Lane, Bark Avenue\nNew York, NY 10001" className="font-bold text-xl block whitespace-pre-line" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold uppercase tracking-widest opacity-80 mb-2">Call Us</h4>
                  <EditableText regionKey="contact.phone" fallback="+1 (555) 123-PAWS" className="font-bold text-xl block" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold uppercase tracking-widest opacity-80 mb-2">Hours</h4>
                  <EditableText regionKey="contact.hours" fallback="Mon-Fri: 8am - 7pm\nSat: 9am - 5pm\nSun: Closed" className="font-bold text-lg block whitespace-pre-line" />
                </div>
              </div>
            </div>

            <div className="md:col-span-3 p-10 md:p-12 bg-white flex flex-col justify-center">
              <div className="space-y-6 w-full">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold opacity-70">Pet Parent Name</label>
                    <input className="w-full p-4 bg-gray-50 border-none outline-none focus:ring-2" style={{ borderRadius: theme.borderRadius / 2 }} placeholder="Jane Doe" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold opacity-70">Pet Name</label>
                    <input className="w-full p-4 bg-gray-50 border-none outline-none focus:ring-2" style={{ borderRadius: theme.borderRadius / 2 }} placeholder="Buster" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold opacity-70">Email Address</label>
                  <input className="w-full p-4 bg-gray-50 border-none outline-none focus:ring-2" style={{ borderRadius: theme.borderRadius / 2 }} placeholder="jane@example.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold opacity-70">How can we help?</label>
                  <textarea className="w-full p-4 bg-gray-50 border-none outline-none focus:ring-2 resize-none h-32" style={{ borderRadius: theme.borderRadius / 2 }} placeholder="Tell us about your pet's needs..."></textarea>
                </div>
                <button className="w-full py-5 font-extrabold uppercase tracking-widest text-sm hover:scale-[1.02] transition-transform shadow-md" style={{ backgroundColor: theme.primaryColor, color: "#fff", borderRadius: theme.borderRadius }}>
                  <EditableText regionKey="contact.submit" fallback="Send Message" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );

  return (
    <main
      className="min-h-screen selection:bg-orange-300 selection:text-orange-900"
      style={{ fontFamily: theme.fontFamily, backgroundColor: theme.backgroundColor }}
    >
      <Navbar />

      <div className="flex flex-col w-full min-h-[70vh]">
        {activePage === "home" && <HomeView />}
        {activePage === "about" && <AboutView />}
        {activePage === "contact" && <ContactView />}
      </div>

      <Footer />

      <style>{`
        html { scroll-behavior: smooth; }
        [contenteditable]:focus { 
          outline: none; 
          box-shadow: 0 0 0 2px rgba(244, 162, 97, 0.5); 
          background: rgba(255,255,255,0.5); 
        }
        @keyframes fade-in { 
          from { opacity: 0; transform: translateY(15px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        .animate-in { 
          animation-duration: 0.6s; 
          animation-fill-mode: both; 
          animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1); 
        }
        .fade-in { animation-name: fade-in; }
        h1, h2, h3, h4, p, span { overflow-wrap: break-word; }
      `}</style>
    </main>
  );
}