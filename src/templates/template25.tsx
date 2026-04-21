"use client";

import React, { useState, useCallback } from "react";
import Script from "next/script";
import {
  useWebsiteBuilderStore,
  useRegionValue,
} from "@/store/useWebsiteBuilderStore";
import { useThemeStore } from "@/store/useThemeStore";

export const template25Meta = {
  id: "business/template25",
  name: "Aura Luxury Jewelry",
  image:
    "https://images.unsplash.com/photo-1599643478514-4a410f061f2c?q=80&w=1600&auto=format&fit=crop",
};

type TemplateProps = {
  editableData?: any;
  isPublished?: boolean;
};

const getNestedValue = (obj: any, path: string) => {
  if (!obj) return undefined;
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
};

export default function Template25({ editableData, isPublished = false }: TemplateProps) {
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
      if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) return;

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
        className={`focus:outline-none focus:ring-1 focus:ring-opacity-50 rounded transition-all outline-none ${className}`}
        style={{ outlineColor: theme.primaryColor }}
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
        className={`cursor-pointer transition-opacity duration-500 hover:opacity-80 ${className}`}
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
      <div className="w-full max-w-[1400px] px-4 sm:px-8 lg:px-12 mx-auto break-words">
        {children}
      </div>
    </section>
  );

  // --- UI COMPONENTS ---
  const Navbar = () => (
    <nav
      className="sticky top-0 w-full z-40 transition-all duration-300 border-b"
      style={{
        backgroundColor: `${theme.backgroundColor}F2`,
        backdropFilter: "blur(12px)",
        borderColor: `${theme.textColor}10`,
      }}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 h-24 flex items-center justify-between gap-4 overflow-hidden">
        {/* Left: Nav Links (Desktop) */}
        <div className="hidden md:flex items-center gap-8 flex-1 min-w-0">
          {["Home", "About", "Contact"].map((page) => (
            <button
              key={page}
              onClick={() => setActivePage(page.toLowerCase() as any)}
              className={`text-xs font-light uppercase tracking-[0.2em] transition-all duration-300 ${activePage === page.toLowerCase() ? "opacity-100" : "opacity-50 hover:opacity-100"
                }`}
              style={{ color: theme.textColor }}
            >
              {page}
            </button>
          ))}
        </div>

        {/* Center: Brand */}
        <div className="flex flex-col items-center justify-center flex-1 min-w-0">
          <EditableText
            regionKey="global.brand"
            fallback="A U R A"
            className="font-serif text-2xl lg:text-3xl tracking-[0.3em] whitespace-nowrap"
          />
          <EditableText
            regionKey="global.subbrand"
            fallback="FINE JEWELRY"
            className="text-[10px] uppercase tracking-[0.4em] opacity-60 mt-1 whitespace-nowrap"
          />
        </div>

        {/* Right: CTA */}
        <div className="flex justify-end flex-1 min-w-0">
          <button
            className="px-6 py-3 text-xs uppercase tracking-[0.15em] transition-all duration-500 border hover:bg-opacity-5"
            style={{
              borderColor: `${theme.textColor}30`,
              color: theme.textColor,
              backgroundColor: "transparent",
            }}
          >
            <EditableText regionKey="global.navCta" fallback="COLLECTIONS" />
          </button>
        </div>
      </div>

      {/* Mobile Nav Links */}
      <div className="md:hidden flex items-center justify-center gap-6 pb-4 border-t border-black/5 mt-2 pt-4">
        {["Home", "About", "Contact"].map((page) => (
          <button
            key={page}
            onClick={() => setActivePage(page.toLowerCase() as any)}
            className={`text-[10px] font-light uppercase tracking-[0.2em] transition-colors ${activePage === page.toLowerCase() ? "opacity-100" : "opacity-50"
              }`}
            style={{ color: theme.textColor }}
          >
            {page}
          </button>
        ))}
      </div>
    </nav>
  );

  const Footer = () => (
    <footer
      className="py-24 px-4 sm:px-8 border-t"
      style={{
        backgroundColor: theme.secondaryColor,
        color: theme.textColor,
        borderColor: `${theme.textColor}10`,
      }}
    >
      <div className="max-w-[1400px] mx-auto grid md:grid-cols-12 gap-12 lg:gap-8 items-start">
        <div className="md:col-span-4 flex flex-col gap-6">
          <EditableText regionKey="global.brand" fallback="A U R A" className="font-serif text-2xl tracking-[0.3em]" />
          <EditableText
            as="p"
            regionKey="footer.desc"
            fallback="Crafting timeless elegance for the modern individual. Every piece tells a story of heritage and brilliance."
            className="text-sm font-light leading-relaxed opacity-70 max-w-sm"
          />
        </div>

        <div className="md:col-span-2 md:col-start-7 flex flex-col gap-4">
          <h4 className="text-[10px] uppercase tracking-[0.3em] font-semibold opacity-50 mb-2">Explore</h4>
          {["Home", "About", "Contact"].map((p) => (
            <button key={p} onClick={() => setActivePage(p.toLowerCase() as any)} className="text-sm font-light text-left hover:opacity-60 transition-opacity w-fit">
              {p}
            </button>
          ))}
        </div>

        <div className="md:col-span-3 flex flex-col gap-4">
          <h4 className="text-[10px] uppercase tracking-[0.3em] font-semibold opacity-50 mb-2">Boutique</h4>
          <EditableText regionKey="footer.address" fallback="15 Place Vendôme, Paris" className="text-sm font-light block" />
          <EditableText regionKey="footer.email" fallback="concierge@aurajewelry.com" className="text-sm font-light block" />
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto mt-24 pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-light opacity-50" style={{ borderColor: `${theme.textColor}10` }}>
        <EditableText regionKey="footer.copy" fallback="© 2026 Aura Fine Jewelry. All Rights Reserved." />
        <EditableText regionKey="footer.terms" fallback="Terms of Service • Privacy Policy" />
      </div>
    </footer>
  );

  // --- PAGE VIEWS ---
  const HomeView = () => (
    <div className="animate-fade-in w-full">
      {/* Hero Section */}
      <section className="relative w-full h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 w-full h-full bg-black">
          <EditableImg
            regionKey="home.heroImg"
            fallback="https://images.unsplash.com/photo-1599643478514-4a410f061f2c?q=80&w=2000&auto=format&fit=crop"
            className="w-full h-full object-cover opacity-60"
          />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center gap-8">
          <EditableText
            as="h2"
            regionKey="home.heroSubtitle"
            fallback="THE NEW COLLECTION"
            className="text-xs md:text-sm uppercase tracking-[0.4em] text-white/80 font-light"
          />
          <EditableText
            as="h1"
            regionKey="home.heroTitle"
            fallback="Elegance Perfected."
            className="text-5xl md:text-7xl lg:text-8xl font-serif text-white tracking-wide"
          />
          <button
            className="mt-8 px-10 py-4 text-xs uppercase tracking-[0.2em] text-white border border-white hover:bg-white hover:text-black transition-all duration-500"
          >
            <EditableText regionKey="home.heroBtn" fallback="DISCOVER NOW" />
          </button>
        </div>
      </section>

      {/* Featured Collection */}
      <Section id="featured" bgType="primary">
        <div className="text-center mb-16 space-y-4">
          <EditableText as="h3" regionKey="home.featTitle" fallback="Signature Pieces" className="text-3xl md:text-4xl font-serif tracking-wide block" />
          <EditableText as="p" regionKey="home.featDesc" fallback="Meticulously crafted for the extraordinary moments." className="text-sm font-light opacity-60 uppercase tracking-[0.1em] block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 w-full">
          {[
            { id: '1', title: 'Rings', img: 'https://images.unsplash.com/photo-1605100804763-247f6612d540?q=80&w=800&auto=format&fit=crop' },
            { id: '2', title: 'Necklaces', img: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=800&auto=format&fit=crop' },
            { id: '3', title: 'Earrings', img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop' },
          ].map((item, idx) => (
            <div key={item.id} className="group cursor-pointer flex flex-col gap-6">
              <div className="relative overflow-hidden w-full aspect-[3/4]">
                <EditableImg
                  regionKey={`home.catImg${idx}`}
                  fallback={item.img}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
              </div>
              <div className="text-center flex flex-col items-center gap-2">
                <EditableText regionKey={`home.catTitle${idx}`} fallback={item.title} className="text-lg font-serif tracking-wider" />
                <div className="w-12 h-[1px] opacity-20" style={{ backgroundColor: theme.textColor }} />
                <span className="text-[10px] uppercase tracking-[0.2em] opacity-50">Explore</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Banner Section */}
      <section className="w-full relative h-[60vh] min-h-[400px] flex items-center">
        <EditableImg
          regionKey="home.bannerImg"
          fallback="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=2000&auto=format&fit=crop"
          className="absolute inset-0 w-full h-full object-cover brightness-75"
        />
        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 sm:px-8 text-white flex justify-end">
          <div className="max-w-lg space-y-6 bg-black/30 p-8 md:p-12 backdrop-blur-sm border border-white/10">
            <EditableText as="h3" regionKey="home.bannerTitle" fallback="The Art of Gifting" className="text-3xl font-serif tracking-wide block" />
            <EditableText as="p" regionKey="home.bannerDesc" fallback="Find the perfect expression of your devotion with our curated selection of fine jewelry." className="text-sm font-light leading-relaxed opacity-90 block" />
            <button className="text-xs uppercase tracking-[0.2em] border-b border-white pb-1 hover:opacity-70 transition-opacity mt-4 block">
              <EditableText regionKey="home.bannerLink" fallback="Shop Gifts" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );

  const AboutView = () => (
    <div className="animate-fade-in w-full">
      <Section id="about-hero" bgType="secondary">
        <div className="max-w-4xl mx-auto text-center space-y-8 py-12 md:py-24">
          <EditableText as="h1" regionKey="about.title" fallback="Our Heritage" className="text-4xl md:text-6xl font-serif tracking-wide block" />
          <EditableText
            as="p"
            regionKey="about.subtitle"
            fallback="A legacy built on uncompromising quality and peerless craftsmanship since 1924."
            className="text-lg font-light opacity-70 leading-relaxed block max-w-2xl mx-auto"
          />
        </div>
      </Section>

      <Section id="about-content">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="relative w-full aspect-[4/5] lg:aspect-square overflow-hidden">
            <EditableImg
              regionKey="about.img1"
              fallback="https://images.unsplash.com/photo-1573408301145-b98c46544ea0?q=80&w=1000&auto=format&fit=crop"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-8 flex flex-col justify-center">
            <EditableText as="h2" regionKey="about.heading1" fallback="Mastery in Every Detail" className="text-3xl font-serif tracking-wide block" />
            <EditableText
              as="p"
              regionKey="about.desc1"
              fallback="We source only the most exceptional diamonds and precious gems, working closely with master artisans who bring decades of experience to the bench. Every setting is meticulously polished, every stone perfectly aligned."
              className="text-sm font-light leading-loose opacity-80 block"
            />
            <EditableText
              as="p"
              regionKey="about.desc2"
              fallback="Our commitment to ethical sourcing and sustainable practices ensures that the beauty of our jewelry is matched by the integrity of its creation."
              className="text-sm font-light leading-loose opacity-80 block"
            />
            <div className="pt-8 border-t" style={{ borderColor: `${theme.textColor}20` }}>
              <EditableText regionKey="about.signature" fallback="Aura Founders" className="font-serif italic text-2xl opacity-60" />
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
      className="min-h-screen flex flex-col w-full relative"
      style={{ fontFamily: theme.fontFamily, backgroundColor: theme.backgroundColor }}
    >
      <Script
        src="https://upload-widget.cloudinary.com/global/all.js"
        strategy="afterInteractive"
      />

      <Navbar />

      <div className="flex flex-col w-full flex-1">
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
        html, body { 
          scroll-behavior: smooth; 
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }
        [contenteditable]:focus { 
          outline: none; 
          background: rgba(128,128,128,0.05); 
        }
        @keyframes fade-in { 
          from { opacity: 0; transform: translateY(10px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        .animate-fade-in { 
          animation: fade-in 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards; 
        }
      `}</style>
    </main>
  );
}



