"use client";

import React, { useState } from "react";

/**
 * PRODUCTION-SAFE TEMPLATE FOR CLYRA
 * Built with internal routing, dynamic theme support, and Cloudinary integration.
 * Beauty Salon Edition - Elegant, Soft, High-end UI/UX.
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
  // Fallback for preview/compiler isolation if paths are not yet indexed
  useWebsiteBuilderStore = (selector: any) => selector({ updateRegion: () => {} });
  useRegionValue = () => null;
  useThemeStore = () => ({
    theme: {
      backgroundColor: "#FAF6F0", 
      textColor: "#3D352F", 
      primaryColor: "#C19C74", 
      secondaryColor: "#F2EBE3", 
      borderRadius: 16,
      sectionSpacing: 96,
      fontFamily: "'Playfair Display', serif",
    },
  });
}

export const template13Meta = {
  id: "business/template13",
  name: "Beauty Salon Elegance",
  image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1600&auto=format&fit=crop",
};

type TemplateProps = {
  editableData?: any;
};

const getNestedValue = (obj: any, path: string) => {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
};

export default function Template13({ editableData }: TemplateProps) {
  const [activePage, setActivePage] = useState<"home" | "about" | "contact">("home");
  const { theme } = useThemeStore();
  const updateRegion = useWebsiteBuilderStore((state: any) => state.updateRegion);

  // --- IMAGE UPLOAD HANDLER ---
  const handleImageUpload = (regionKey: string) => {
    if (typeof window !== "undefined" && (window as any).cloudinary) {
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
        className={`focus:outline-none focus:ring-2 focus:ring-amber-200 rounded transition-all ${className}`}
      >
        {content}
      </Tag>
    );
  };

  const EditableImg = ({ regionKey, fallback, className = "", alt = "image" }: any) => {
    const hookValue = useRegionValue(regionKey);
    const dataValue = getNestedValue(editableData, regionKey);
    const src = hookValue ?? dataValue ?? fallback;

    return (
      <img
        src={src}
        alt={alt}
        className={`cursor-pointer transition-transform hover:scale-[1.02] duration-500 ${className}`}
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
      className="sticky top-0 w-full z-40 backdrop-blur-xl border-b transition-all duration-300"
      style={{
        backgroundColor: `${theme.backgroundColor}E6`,
        borderColor: `${theme.textColor}10`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-24 flex items-center justify-between gap-4 overflow-hidden">
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <EditableImg
            regionKey="global.logo"
            fallback="https://images.unsplash.com/photo-1551431009-a802eeec77b1?q=80&w=200&auto=format&fit=crop"
            className="w-12 h-12 object-cover rounded-full shadow-sm"
          />
          <EditableText
            regionKey="global.brand"
            fallback="AURA SALON"
            className="font-bold text-2xl tracking-widest whitespace-nowrap uppercase"
          />
        </div>

        <div className="hidden md:flex items-center gap-10 px-4">
          {["Home", "About", "Contact"].map((page) => (
            <button
              key={page}
              onClick={() => setActivePage(page.toLowerCase() as any)}
              className={`text-sm transition-all duration-300 uppercase tracking-[0.2em] relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-full after:h-[1px] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left ${
                activePage === page.toLowerCase() ? "after:scale-x-100 font-semibold" : "opacity-60 hover:opacity-100"
              }`}
              style={{ 
                color: activePage === page.toLowerCase() ? theme.primaryColor : theme.textColor
              }}
            >
              {page}
            </button>
          ))}
        </div>

        <div className="flex-shrink-0">
          <button
            className="px-8 py-3.5 font-medium text-sm transition-all hover:shadow-lg active:scale-95 tracking-widest uppercase"
            style={{
              backgroundColor: theme.primaryColor,
              color: "#ffffff",
              borderRadius: `${theme.borderRadius}px`,
            }}
          >
            <EditableText regionKey="global.navCta" fallback="BOOK APPOINTMENT" />
          </button>
        </div>
      </div>
    </nav>
  );

  const Footer = () => (
    <footer
      className="py-24 px-4 sm:px-6 lg:px-8 border-t"
      style={{
        backgroundColor: theme.backgroundColor,
        color: theme.textColor,
        borderColor: `${theme.textColor}10`,
      }}
    >
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 text-center md:text-left">
        <div className="md:col-span-2 space-y-6 pr-0 md:pr-12">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <EditableImg
              regionKey="global.logo"
              fallback="https://images.unsplash.com/photo-1551431009-a802eeec77b1?q=80&w=200&auto=format&fit=crop"
              className="w-10 h-10 rounded-full object-cover shadow-sm"
            />
            <EditableText regionKey="global.brand" fallback="AURA SALON" className="font-bold tracking-widest text-lg uppercase" />
          </div>
          <EditableText
            as="p"
            regionKey="footer.desc"
            fallback="Elevating your natural beauty with premium care, luxurious environments, and expert styling tailored specifically to you."
            className="text-sm opacity-70 leading-loose block max-w-sm mx-auto md:mx-0"
            style={{ fontFamily: "sans-serif" }}
          />
        </div>
        
        <div className="flex flex-col gap-5">
          <h4 className="font-bold uppercase tracking-[0.2em] text-xs opacity-50">Navigation</h4>
          {["Home", "About", "Contact"].map((p) => (
            <button 
              key={p} 
              onClick={() => setActivePage(p.toLowerCase() as any)} 
              className="hover:opacity-100 opacity-70 transition-opacity text-sm w-fit mx-auto md:mx-0 uppercase tracking-widest"
              style={{ fontFamily: "sans-serif" }}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="space-y-5">
          <h4 className="font-bold uppercase tracking-[0.2em] text-xs opacity-50">Say Hello</h4>
          <EditableText regionKey="footer.email" fallback="hello@aurasalon.com" className="text-sm block opacity-70 hover:opacity-100 transition-opacity" style={{ fontFamily: "sans-serif" }} />
          <EditableText regionKey="footer.phone" fallback="+1 (555) 123-4567" className="text-sm block opacity-70" style={{ fontFamily: "sans-serif" }} />
          <EditableText regionKey="footer.copy" fallback="© 2026 Aura Salon. All rights reserved." className="text-xs opacity-40 block pt-8" style={{ fontFamily: "sans-serif" }} />
        </div>
      </div>
    </footer>
  );

  // --- PAGE VIEWS ---
  const HomeView = () => (
    <div className="animate-in fade-in duration-1000 w-full min-w-0">
      <Section id="hero" bgType="primary" className="pt-12 md:pt-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="space-y-10 z-10 order-2 lg:order-1">
            <div className="space-y-4">
              <EditableText
                as="span"
                regionKey="hero.eyebrow"
                fallback="PREMIUM BEAUTY & SPA"
                className="text-sm font-bold tracking-[0.3em] uppercase block opacity-70"
                style={{ color: theme.primaryColor, fontFamily: "sans-serif" }}
              />
              <EditableText
                as="h1"
                regionKey="hero.title"
                fallback="Discover Your Inner Radiance."
                className="text-5xl md:text-7xl font-normal leading-[1.1] block"
              />
            </div>
            
            <EditableText
              as="p"
              regionKey="hero.subtitle"
              fallback="Step into an oasis of calm. Our expert stylists and therapists are dedicated to providing you with a transformative luxury experience."
              className="text-lg opacity-80 leading-relaxed block max-w-lg"
              style={{ fontFamily: "sans-serif" }}
            />
            
            <div className="flex flex-wrap gap-4 pt-4">
              <button
                className="px-10 py-4 font-medium uppercase tracking-widest text-sm shadow-xl hover:-translate-y-1 transition-transform"
                style={{ backgroundColor: theme.primaryColor, color: "#fff", borderRadius: `${theme.borderRadius}px` }}
              >
                <EditableText regionKey="hero.btn1" fallback="Book Session" />
              </button>
              <button
                className="px-10 py-4 font-medium uppercase tracking-widest text-sm border hover:-translate-y-1 transition-transform"
                style={{ 
                  borderColor: theme.textColor, 
                  color: theme.textColor, 
                  borderRadius: `${theme.borderRadius}px` 
                }}
                onClick={() => setActivePage("about")}
              >
                <EditableText regionKey="hero.btn2" fallback="Our Story" />
              </button>
            </div>
          </div>

          <div className="relative order-1 lg:order-2">
            <div className="absolute inset-0 translate-x-4 translate-y-4 opacity-50 rounded-2xl" style={{ backgroundColor: theme.primaryColor }}></div>
            <EditableImg
              regionKey="hero.img"
              fallback="https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=1400&auto=format&fit=crop"
              className="w-full aspect-[4/5] object-cover relative z-10 shadow-2xl"
              style={{ borderRadius: `${theme.borderRadius}px` }}
            />
          </div>
        </div>
      </Section>

      <Section id="services" bgType="secondary">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <EditableText as="h2" regionKey="services.title" fallback="Our Signature Services" className="text-4xl md:text-5xl mb-6 block" />
          <EditableText
            as="p"
            regionKey="services.subtitle"
            fallback="Tailored treatments designed to refresh, rejuvenate, and elevate your personal style."
            className="text-base opacity-70 leading-relaxed block"
            style={{ fontFamily: "sans-serif" }}
          />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { id: "1", title: "Hair Styling", desc: "Expert cuts, color, and treatments tailored to your unique features." },
            { id: "2", title: "Skin Care", desc: "Rejuvenating facials and therapies for a flawless, glowing complexion." },
            { id: "3", title: "Spa Rituals", desc: "Holistic body treatments to melt away stress and restore balance." }
          ].map((service, idx) => (
            <div key={idx} className="bg-white/40 p-10 backdrop-blur-sm border border-white/50 hover:-translate-y-2 transition-all duration-500" style={{ borderRadius: `${theme.borderRadius}px` }}>
              <EditableText as="h3" regionKey={`services.item${idx}.title`} fallback={service.title} className="text-2xl mb-4 block" />
              <EditableText
                as="p"
                regionKey={`services.item${idx}.desc`}
                fallback={service.desc}
                className="opacity-70 leading-loose text-sm"
                style={{ fontFamily: "sans-serif" }}
              />
            </div>
          ))}
        </div>
      </Section>
    </div>
  );

  const AboutView = () => (
    <Section id="about" bgType="primary">
      <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center animate-in slide-in-from-bottom-8 duration-1000 w-full min-w-0">
        <div className="relative">
           <EditableImg
            regionKey="about.img1"
            fallback="https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1200&auto=format&fit=crop"
            className="w-full aspect-[3/4] object-cover shadow-2xl"
            style={{ borderRadius: `${theme.borderRadius}px` }}
          />
        </div>
        <div className="space-y-8">
          <EditableText 
            as="span" 
            regionKey="about.eyebrow" 
            fallback="OUR PHILOSOPHY" 
            className="text-sm font-bold tracking-[0.3em] uppercase block opacity-70"
            style={{ color: theme.primaryColor, fontFamily: "sans-serif" }}
          />
          <EditableText 
            as="h2" 
            regionKey="about.title" 
            fallback="Beauty is an Art. Care is our Canvas." 
            className="text-5xl md:text-6xl font-normal leading-tight block" 
          />
          <EditableText
            as="p"
            regionKey="about.desc1"
            fallback="Founded on the belief that true beauty radiates from within, Aura Salon was created as a sanctuary. We blend modern techniques with timeless luxury to bring out the best version of you."
            className="text-lg opacity-80 leading-loose block"
            style={{ fontFamily: "sans-serif" }}
          />
          <EditableText
            as="p"
            regionKey="about.desc2"
            fallback="Our carefully selected products are cruelty-free and environmentally conscious, ensuring that your beauty journey is as kind to the earth as it is to your skin and hair."
            className="text-base opacity-60 leading-loose block"
            style={{ fontFamily: "sans-serif" }}
          />
        </div>
      </div>
    </Section>
  );

  const ContactView = () => (
    <Section id="contact" bgType="primary">
      <div className="max-w-5xl mx-auto animate-in zoom-in-95 duration-700 w-full min-w-0">
        <div className="text-center mb-16">
          <EditableText as="h1" regionKey="contact.title" fallback="Reserve Your Time" className="text-5xl md:text-7xl font-normal block mb-6" />
          <EditableText
            as="p"
            regionKey="contact.subtitle"
            fallback="Reach out to our concierge team to schedule your personalized session."
            className="text-lg opacity-70 max-w-xl mx-auto block"
            style={{ fontFamily: "sans-serif" }}
          />
        </div>

        <div 
          className="grid md:grid-cols-5 gap-0 overflow-hidden shadow-2xl border" 
          style={{ borderRadius: `${theme.borderRadius * 1.5}px`, borderColor: `${theme.textColor}10` }}
        >
          <div className="md:col-span-2 p-12 flex flex-col justify-between" style={{ backgroundColor: theme.secondaryColor }}>
            <div className="space-y-12">
              <div>
                <h4 className="text-xs font-bold uppercase opacity-50 tracking-[0.2em] mb-3" style={{ fontFamily: "sans-serif" }}>Visit Us</h4>
                <EditableText regionKey="contact.address" fallback="123 Serenity Boulevard, NY 10012" className="text-lg block leading-relaxed" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase opacity-50 tracking-[0.2em] mb-3" style={{ fontFamily: "sans-serif" }}>Contact</h4>
                <EditableText regionKey="contact.email" fallback="bookings@aurasalon.com" className="text-lg block" />
                <EditableText regionKey="contact.phone" fallback="+1 (555) 123-4567" className="text-lg block mt-2" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase opacity-50 tracking-[0.2em] mb-3" style={{ fontFamily: "sans-serif" }}>Hours</h4>
                <EditableText regionKey="contact.hours" fallback="Mon-Sat: 9am - 8pm | Sun: Closed" className="text-base opacity-80 block" style={{ fontFamily: "sans-serif" }} />
              </div>
            </div>
          </div>
          
          <div className="md:col-span-3 p-12 bg-white/50 backdrop-blur-md">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <input 
                  className="w-full p-4 bg-transparent border-b outline-none focus:border-opacity-100 transition-colors" 
                  style={{ borderColor: `${theme.textColor}30`, fontFamily: "sans-serif" }} 
                  placeholder="First Name" 
                />
                <input 
                  className="w-full p-4 bg-transparent border-b outline-none focus:border-opacity-100 transition-colors" 
                  style={{ borderColor: `${theme.textColor}30`, fontFamily: "sans-serif" }} 
                  placeholder="Last Name" 
                />
              </div>
              <input 
                className="w-full p-4 bg-transparent border-b outline-none focus:border-opacity-100 transition-colors" 
                style={{ borderColor: `${theme.textColor}30`, fontFamily: "sans-serif" }} 
                placeholder="Email Address" 
                type="email"
              />
              <select 
                className="w-full p-4 bg-transparent border-b outline-none focus:border-opacity-100 transition-colors opacity-70 appearance-none" 
                style={{ borderColor: `${theme.textColor}30`, fontFamily: "sans-serif" }}
              >
                <option value="">Select Service Area...</option>
                <option value="hair">Hair Styling</option>
                <option value="skin">Skin Care</option>
                <option value="spa">Spa Ritual</option>
              </select>
              <textarea 
                className="w-full p-4 bg-transparent border-b outline-none focus:border-opacity-100 transition-colors resize-none h-32" 
                style={{ borderColor: `${theme.textColor}30`, fontFamily: "sans-serif" }} 
                placeholder="Any specific requests or details?" 
              />
              <button 
                className="w-full py-5 font-medium uppercase tracking-[0.2em] text-sm mt-4 hover:opacity-90 transition-opacity" 
                style={{ backgroundColor: theme.primaryColor, color: "#fff", borderRadius: `${theme.borderRadius}px` }}
              >
                <EditableText regionKey="contact.submit" fallback="Request Appointment" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );

  return (
    <main
      className="min-h-screen selection:bg-amber-700 selection:text-white"
      style={{ fontFamily: theme.fontFamily, backgroundColor: theme.backgroundColor }}
    >
      {/* Script loading via standard HTML to avoid resolution errors */}
      <script src="https://upload-widget.cloudinary.com/global/all.js" async></script>
      
      <Navbar />

      <div className="flex flex-col w-full min-w-0">
        {activePage === "home" && <HomeView />}
        {activePage === "about" && <AboutView />}
        {activePage === "contact" && <ContactView />}
      </div>

      <Footer />

      <style>{`
        html { scroll-behavior: smooth; }
        [contenteditable]:focus { outline: none; background: rgba(0,0,0,0.03); }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-in-from-bottom-8 { from { transform: translateY(2rem); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes zoom-in-95 { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-in { animation-duration: 0.7s; animation-fill-mode: both; }
        .fade-in { animation-name: fade-in; }
        .slide-in-from-bottom-8 { animation-name: slide-in-from-bottom-8; }
        .zoom-in-95 { animation-name: zoom-in-95; }
      `}</style>
    </main>
  );
}