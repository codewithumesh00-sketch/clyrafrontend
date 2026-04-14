"use client";

import React, { useState, useCallback } from "react";

/**
 * PRODUCTION-SAFE TEMPLATE FOR CLYRA
 * Built with internal routing, dynamic theme support, and Cloudinary integration.
 * Topic: Law Firm (Template 14)
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
      backgroundColor: "#ffffff",
      textColor: "#111827",
      primaryColor: "#0B1B3D", 
      secondaryColor: "#F9FAFB",
      borderRadius: 4,
      sectionSpacing: 96,
      fontFamily: "Inter, sans-serif",
    },
  });
}

export const template14Meta = {
  id: "business/template14",
  name: "Modern Law Firm",
  image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=1600&auto=format&fit=crop",
};

type TemplateProps = {
  editableData?: any;
};

const getNestedValue = (obj: any, path: string) => {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
};

export default function Template14({ editableData }: TemplateProps) {
  const [activePage, setActivePage] = useState<"home" | "about" | "contact">("home");
  const { theme } = useThemeStore();
  const updateRegion = useWebsiteBuilderStore((state: any) => state.updateRegion);

  // --- IMAGE UPLOAD HANDLER ---
  const handleImageUpload = useCallback((regionKey: string) => {
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
  }, [updateRegion]);

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

  const EditableImg = ({ regionKey, fallback, className = "", alt = "image" }: any) => {
    const hookValue = useRegionValue(regionKey);
    const dataValue = getNestedValue(editableData, regionKey);
    const src = hookValue ?? dataValue ?? fallback;

    return (
      <img
        src={src}
        alt={alt}
        className={`cursor-pointer transition-opacity hover:opacity-90 ${className}`}
        onDoubleClick={(e) => {
          e.stopPropagation();
          handleImageUpload(regionKey);
        }}
      />
    );
  };

  const Section = ({ children, id, bgType = "primary" }: any) => (
    <section
      id={id}
      style={{
        padding: `${theme.sectionSpacing}px 24px`,
        backgroundColor: bgType === "primary" ? theme.backgroundColor : theme.secondaryColor,
        color: theme.textColor,
      }}
      className="w-full flex justify-center overflow-hidden"
    >
      <div className="w-full max-w-7xl min-w-0">{children}</div>
    </section>
  );

  const Navbar = () => (
    <nav
      className="sticky top-0 w-full z-40 backdrop-blur-md border-b"
      style={{
        backgroundColor: `${theme.backgroundColor}F2`,
        borderColor: `${theme.textColor}15`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-24 flex items-center justify-between gap-4 overflow-hidden">
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <EditableImg
            regionKey="global.logo"
            fallback="https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=100&h=100&fit=crop"
            className="w-12 h-12 object-cover rounded-sm shadow-sm"
          />
          <EditableText
            regionKey="global.brand"
            fallback="STERLING & CO."
            className="font-serif font-bold text-2xl tracking-widest whitespace-nowrap uppercase"
            style={{ color: theme.primaryColor }}
          />
        </div>

        <div className="hidden md:flex items-center gap-10 px-4">
          {["Home", "About", "Contact"].map((page) => (
            <button
              key={page}
              onClick={() => setActivePage(page.toLowerCase() as any)}
              className={`text-sm font-medium transition-colors uppercase tracking-widest ${
                activePage === page.toLowerCase() ? "" : "opacity-60 hover:opacity-100"
              }`}
              style={{ color: activePage === page.toLowerCase() ? theme.primaryColor : theme.textColor }}
            >
              {page}
            </button>
          ))}
        </div>

        <div className="flex-shrink-0">
          <button
            className="px-8 py-3 font-semibold text-xs transition-transform active:scale-95 uppercase tracking-widest shadow-md"
            style={{
              backgroundColor: theme.primaryColor,
              color: "#fff",
              borderRadius: `${theme.borderRadius}px`,
            }}
          >
            <EditableText regionKey="global.navCta" fallback="FREE CONSULTATION" />
          </button>
        </div>
      </div>
    </nav>
  );

  const Footer = () => (
    <footer
      className="py-24 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundColor: theme.primaryColor,
        color: "#ffffff",
      }}
    >
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 text-center md:text-left">
        <div className="space-y-6 md:col-span-2">
          <div className="flex items-center justify-center md:justify-start gap-4">
            <EditableImg
              regionKey="global.logo"
              fallback="https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=100&h=100&fit=crop"
              className="w-10 h-10 rounded-sm brightness-0 invert"
            />
            <EditableText 
              regionKey="global.brand" 
              fallback="STERLING & CO." 
              className="font-serif font-bold text-xl tracking-widest uppercase" 
            />
          </div>
          <EditableText
            as="p"
            regionKey="footer.desc"
            fallback="Relentless advocacy and unparalleled legal strategy for our clients. We stand by your side when it matters most."
            className="text-sm opacity-80 leading-relaxed block max-w-md"
          />
        </div>
        
        <div className="flex flex-col gap-4">
          <h4 className="font-serif font-bold uppercase tracking-widest text-sm text-[#D4AF37]">Navigation</h4>
          {["Home", "About", "Contact"].map((p) => (
            <button key={p} onClick={() => setActivePage(p.toLowerCase() as any)} className="hover:text-[#D4AF37] transition-colors text-sm w-fit mx-auto md:mx-0 opacity-80">
              {p}
            </button>
          ))}
        </div>
        
        <div className="space-y-4">
          <h4 className="font-serif font-bold uppercase tracking-widest text-sm text-[#D4AF37]">Offices</h4>
          <EditableText regionKey="footer.address" fallback="100 Wall Street, Suite 500, New York, NY 10005" className="text-sm opacity-80 block" />
          <EditableText regionKey="footer.phone" fallback="+1 (212) 555-0198" className="text-sm opacity-80 block" />
          <EditableText regionKey="footer.email" fallback="counsel@sterlinglaw.com" className="text-sm opacity-80 block pt-2" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/20 text-center flex flex-col md:flex-row justify-between items-center gap-4">
         <EditableText regionKey="footer.copy" fallback="© 2024 Sterling & Co. All rights reserved." className="text-xs opacity-50 block" />
         <EditableText regionKey="footer.disclaimer" fallback="Attorney Advertising. Prior results do not guarantee a similar outcome." className="text-xs opacity-50 block" />
      </div>
    </footer>
  );

  const HomeView = () => (
    <div className="animate-in fade-in duration-700 w-full min-w-0">
      <Section id="hero" bgType="secondary">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 pr-0 lg:pr-8">
            <div className="flex items-center gap-4">
              <div className="h-[2px] w-12 bg-[#D4AF37]"></div>
              <EditableText
                regionKey="hero.kicker"
                fallback="PREMIER LEGAL COUNSEL"
                className="text-xs font-bold tracking-[0.2em] text-[#D4AF37]"
              />
            </div>
            <EditableText
              as="h1"
              regionKey="hero.title"
              fallback="Defending Your Rights. Securing Your Future."
              className="text-5xl md:text-7xl font-serif font-bold leading-[1.1] text-gray-900 block"
            />
            <EditableText
              as="p"
              regionKey="hero.subtitle"
              fallback="With decades of combined experience, our distinguished partners provide aggressive, strategic representation for complex legal challenges."
              className="text-lg opacity-80 leading-relaxed block max-w-lg text-gray-700"
            />
            <div className="flex flex-wrap gap-4 pt-4">
              <button
                className="px-8 py-4 font-bold uppercase tracking-widest text-xs shadow-xl hover:bg-opacity-90 transition-all"
                style={{ backgroundColor: theme.primaryColor, color: "#fff", borderRadius: `${theme.borderRadius}px` }}
                onClick={() => setActivePage("contact")}
              >
                <EditableText regionKey="hero.btn1" fallback="REQUEST CONSULTATION" />
              </button>
              <button
                className="px-8 py-4 font-bold uppercase tracking-widest text-xs transition-all border-2"
                style={{ borderColor: theme.primaryColor, color: theme.primaryColor, borderRadius: `${theme.borderRadius}px` }}
                onClick={() => setActivePage("about")}
              >
                <EditableText regionKey="hero.btn2" fallback="MEET THE FIRM" />
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-[#D4AF37] translate-x-4 translate-y-4" style={{ borderRadius: `${theme.borderRadius}px` }}></div>
            <EditableImg
              regionKey="hero.img"
              fallback="https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=1000&auto=format&fit=crop"
              className="w-full aspect-[3/4] object-cover relative z-10 shadow-2xl"
              style={{ borderRadius: `${theme.borderRadius}px` }}
            />
          </div>
        </div>
      </Section>

      <Section id="practice-areas" bgType="primary">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <EditableText as="h2" regionKey="practice.title" fallback="Areas of Expertise" className="text-4xl font-serif font-bold block mb-6 text-gray-900" />
          <div className="h-1 w-20 bg-[#D4AF37] mx-auto mb-6"></div>
          <EditableText
            as="p"
            regionKey="practice.desc"
            fallback="We specialize in high-stakes litigation and complex transactional law, delivering unwavering support across multiple disciplines."
            className="text-gray-600 leading-relaxed block"
          />
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-10 border transition-all hover:-translate-y-2 hover:shadow-xl group" style={{ borderColor: `${theme.textColor}15`, borderRadius: `${theme.borderRadius}px`, backgroundColor: theme.secondaryColor }}>
            <div className="w-12 h-12 mb-6 rounded-full flex items-center justify-center bg-white shadow-sm border border-gray-100">
               <span className="text-[#D4AF37] text-xl">🏛</span>
            </div>
            <EditableText as="h3" regionKey="practice.1.title" fallback="Corporate Law" className="text-xl font-serif font-bold mb-4 block" />
            <EditableText as="p" regionKey="practice.1.desc" fallback="Comprehensive counsel for mergers, acquisitions, and high-level corporate structuring." className="text-sm opacity-70 leading-relaxed block" />
          </div>
          <div className="p-10 border transition-all hover:-translate-y-2 hover:shadow-xl group" style={{ borderColor: `${theme.textColor}15`, borderRadius: `${theme.borderRadius}px`, backgroundColor: theme.secondaryColor }}>
            <div className="w-12 h-12 mb-6 rounded-full flex items-center justify-center bg-white shadow-sm border border-gray-100">
               <span className="text-[#D4AF37] text-xl">⚖️</span>
            </div>
            <EditableText as="h3" regionKey="practice.2.title" fallback="Civil Litigation" className="text-xl font-serif font-bold mb-4 block" />
            <EditableText as="p" regionKey="practice.2.desc" fallback="Aggressive representation in federal and state courts for complex commercial disputes." className="text-sm opacity-70 leading-relaxed block" />
          </div>
          <div className="p-10 border transition-all hover:-translate-y-2 hover:shadow-xl group" style={{ borderColor: `${theme.textColor}15`, borderRadius: `${theme.borderRadius}px`, backgroundColor: theme.secondaryColor }}>
            <div className="w-12 h-12 mb-6 rounded-full flex items-center justify-center bg-white shadow-sm border border-gray-100">
               <span className="text-[#D4AF37] text-xl">🛡</span>
            </div>
            <EditableText as="h3" regionKey="practice.3.title" fallback="Criminal Defense" className="text-xl font-serif font-bold mb-4 block" />
            <EditableText as="p" regionKey="practice.3.desc" fallback="Vigorous defense strategies protecting your freedom, reputation, and future." className="text-sm opacity-70 leading-relaxed block" />
          </div>
        </div>
      </Section>
    </div>
  );

  const AboutView = () => (
    <Section id="about" bgType="secondary">
      <div className="grid lg:grid-cols-2 gap-20 items-center animate-in slide-in-from-bottom-4 duration-700">
        <div className="relative">
            <EditableImg
              regionKey="about.img"
              fallback="https://images.unsplash.com/photo-1556761175-5973dc0f32b7?q=80&w=1000&auto=format&fit=crop"
              className="w-full aspect-[4/5] object-cover shadow-2xl relative z-10 grayscale hover:grayscale-0 transition-all duration-700"
              style={{ borderRadius: `${theme.borderRadius}px` }}
            />
            <div className="absolute -bottom-8 -right-8 bg-white p-8 shadow-xl z-20 max-w-xs border-l-4 border-[#D4AF37]">
                <EditableText as="p" regionKey="about.quote" fallback='"Justice is truth in action. We embody both."' className="font-serif italic text-lg text-gray-800 block" />
            </div>
        </div>
        <div className="space-y-8 pl-0 lg:pl-8">
          <EditableText as="h2" regionKey="about.title" fallback="A Legacy of Excellence & Integrity" className="text-4xl md:text-5xl font-serif font-bold leading-tight block text-gray-900" />
          <div className="h-1 w-20 bg-[#D4AF37]"></div>
          <EditableText
            as="p"
            regionKey="about.desc1"
            fallback="Founded in 1998, Sterling & Co. has established itself as a premier litigation and corporate advisory firm. Our attorneys are recognized nationally for their sharp legal acumen and relentless dedication to our clients' success."
            className="text-lg text-gray-700 leading-relaxed block"
          />
          <EditableText
            as="p"
            regionKey="about.desc2"
            fallback="We approach every case with meticulous preparation and an aggressive pursuit of favorable outcomes. Whether at the negotiation table or in the courtroom, we are committed to achieving unparalleled results."
            className="text-base text-gray-600 leading-relaxed block"
          />
          <div className="grid grid-cols-2 gap-8 pt-6 border-t border-gray-200">
             <div>
                <EditableText as="h4" regionKey="about.stat1.val" fallback="$500M+" className="text-3xl font-serif font-bold text-[#D4AF37] block" />
                <EditableText as="p" regionKey="about.stat1.label" fallback="Recovered for Clients" className="text-xs uppercase tracking-widest font-bold text-gray-500 mt-2 block" />
             </div>
             <div>
                <EditableText as="h4" regionKey="about.stat2.val" fallback="25+" className="text-3xl font-serif font-bold text-[#D4AF37] block" />
                <EditableText as="p" regionKey="about.stat2.label" fallback="Years of Experience" className="text-xs uppercase tracking-widest font-bold text-gray-500 mt-2 block" />
             </div>
          </div>
        </div>
      </div>
    </Section>
  );

  const ContactView = () => (
    <Section id="contact" bgType="primary">
      <div className="max-w-6xl mx-auto animate-in zoom-in-95 duration-500">
        <div className="text-center mb-16">
          <EditableText as="h1" regionKey="contact.title" fallback="Confidential Evaluation" className="text-4xl md:text-5xl font-serif font-bold block mb-6 text-gray-900" />
          <EditableText as="p" regionKey="contact.subtitle" fallback="Contact our offices today to schedule a private consultation with one of our partners." className="text-gray-600 text-lg block" />
        </div>
        
        <div className="grid lg:grid-cols-5 gap-12 bg-white shadow-2xl overflow-hidden" style={{ borderRadius: `${theme.borderRadius}px` }}>
          <div className="lg:col-span-2 p-12 text-white flex flex-col justify-between" style={{ backgroundColor: theme.primaryColor }}>
            <div className="space-y-12">
              <div>
                <EditableText as="h3" regionKey="contact.infoTitle" fallback="Direct Contact" className="text-2xl font-serif font-bold mb-6 block" />
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-2">Office Address</h4>
                    <EditableText regionKey="contact.address" fallback="100 Wall Street, Suite 500\nNew York, NY 10005" className="opacity-90 block whitespace-pre-line" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-2">Telephone</h4>
                    <EditableText regionKey="contact.phone" fallback="+1 (212) 555-0198" className="opacity-90 block" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-2">Email Inquiries</h4>
                    <EditableText regionKey="contact.email" fallback="counsel@sterlinglaw.com" className="opacity-90 block" />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-16">
              <EditableText as="p" regionKey="contact.note" fallback="Emergency representation available 24/7." className="text-sm italic opacity-70 border-l-2 border-[#D4AF37] pl-4 block" />
            </div>
          </div>

          <div className="lg:col-span-3 p-12 lg:p-16">
            <EditableText as="h3" regionKey="contact.formTitle" fallback="Send an Inquiry" className="text-2xl font-serif font-bold mb-8 block text-gray-900" />
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <input className="w-full px-4 py-3 bg-gray-50 border border-gray-200 outline-none focus:border-[#D4AF37] transition-colors rounded-sm" placeholder="First Name" />
                <input className="w-full px-4 py-3 bg-gray-50 border border-gray-200 outline-none focus:border-[#D4AF37] transition-colors rounded-sm" placeholder="Last Name" />
              </div>
              <input className="w-full px-4 py-3 bg-gray-50 border border-gray-200 outline-none focus:border-[#D4AF37] transition-colors rounded-sm" placeholder="Email Address" />
              <input className="w-full px-4 py-3 bg-gray-50 border border-gray-200 outline-none focus:border-[#D4AF37] transition-colors rounded-sm" placeholder="Phone Number" />
              <textarea rows={5} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 outline-none focus:border-[#D4AF37] transition-colors rounded-sm resize-none" placeholder="Briefly describe your legal matter..."></textarea>
              <button className="w-full py-4 font-bold uppercase tracking-widest text-sm text-white shadow-md hover:bg-opacity-90 transition-all rounded-sm" style={{ backgroundColor: theme.primaryColor }}>
                <EditableText regionKey="contact.submitBtn" fallback="SUBMIT INQUIRY" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );

  return (
    <main
      className="min-h-screen selection:bg-[#D4AF37] selection:text-white flex flex-col"
      style={{ fontFamily: theme.fontFamily, backgroundColor: theme.backgroundColor }}
    >
      <script 
        src="https://upload-widget.cloudinary.com/global/all.js" 
        async 
      />
      
      <Navbar />

      <div className="flex-grow w-full flex flex-col min-w-0">
        {activePage === "home" && <HomeView />}
        {activePage === "about" && <AboutView />}
        {activePage === "contact" && <ContactView />}
      </div>

      <Footer />

      <style>{`
        html { scroll-behavior: smooth; }
        [contenteditable]:focus { 
          outline: none; 
          box-shadow: inset 0 0 0 2px rgba(212, 175, 55, 0.5);
          background: rgba(0,0,0,0.02); 
        }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-in-from-bottom-4 { from { transform: translateY(1rem); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes zoom-in-95 { from { transform: scale(0.97); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-in { animation-duration: 0.6s; animation-fill-mode: both; animation-timing-function: ease-out; }
        .fade-in { animation-name: fade-in; }
        .slide-in-from-bottom-4 { animation-name: slide-in-from-bottom-4; }
        .zoom-in-95 { animation-name: zoom-in-95; }
      `}</style>
    </main>
  );
}