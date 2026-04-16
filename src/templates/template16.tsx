"use client";

import React, { useState } from "react";
import Script from "next/script";
import {
  useWebsiteBuilderStore,
  useRegionValue,
} from "@/store/useWebsiteBuilderStore";
import { useThemeStore } from "@/store/useThemeStore";

export const template16Meta = {
  id: "business/template16",
  name: "Modern Car Rental",
  image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=1600&auto=format&fit=crop",
};

type TemplateProps = {
  editableData?: any;
};

const getNestedValue = (obj: any, path: string) => {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
};

export default function Template16({ editableData }: TemplateProps) {
  const [activePage, setActivePage] = useState<"home" | "about" | "contact">("home");
  const { theme } = useThemeStore();
  const updateRegion = useWebsiteBuilderStore((state: any) => state.updateRegion);

  // --- IMAGE UPLOAD HANDLER ---
  const handleImageUpload = (regionKey: string) => {
    if (typeof window !== "undefined" && (window as any).cloudinary) {
      if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || !process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET) {
        console.warn("Cloudinary env variables missing.");
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
        className={`cursor-pointer transition-transform duration-500 hover:scale-[1.02] ${className}`}
        style={style}
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
      <div className="w-full max-w-7xl">{children}</div>
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
            fallback="https://images.unsplash.com/photo-1549463591-14cc5bd1f008?w=100&h=100&fit=crop"
            className="w-12 h-12 object-cover"
            style={{ borderRadius: `${theme.borderRadius}px` }}
          />
          <EditableText
            regionKey="global.brand"
            fallback="VELOCITY"
            className="font-black text-2xl tracking-tight whitespace-nowrap"
          />
        </div>

        <div className="hidden md:flex items-center gap-10">
          {["Home", "About", "Contact"].map((page) => (
            <button
              key={page}
              onClick={() => setActivePage(page.toLowerCase() as any)}
              className={`text-sm font-bold transition-all ${
                activePage === page.toLowerCase() ? "scale-105" : "opacity-60 hover:opacity-100"
              }`}
              style={{ color: activePage === page.toLowerCase() ? theme.primaryColor : theme.textColor }}
            >
              {page}
            </button>
          ))}
        </div>

        <div className="flex-shrink-0">
          <button
            className="px-8 py-3.5 font-bold text-sm transition-transform active:scale-95 shadow-lg shadow-black/5"
            style={{
              backgroundColor: theme.primaryColor,
              color: "#fff",
              borderRadius: `${theme.borderRadius}px`,
            }}
          >
            <EditableText regionKey="global.navCta" fallback="BOOK NOW" />
          </button>
        </div>
      </div>
    </nav>
  );

  const Footer = () => (
    <footer
      className="py-24 px-4 sm:px-6 lg:px-8 border-t"
      style={{
        backgroundColor: theme.secondaryColor,
        color: theme.textColor,
        borderColor: `${theme.textColor}10`,
      }}
    >
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 text-center md:text-left">
        <div className="space-y-6 md:col-span-2">
          <div className="flex items-center justify-center md:justify-start gap-4">
            <EditableImg
              regionKey="global.logo"
              fallback="https://images.unsplash.com/photo-1549463591-14cc5bd1f008?w=100&h=100&fit=crop"
              className="w-10 h-10 object-cover"
              style={{ borderRadius: `${theme.borderRadius}px` }}
            />
            <EditableText regionKey="global.brand" fallback="VELOCITY" className="font-black text-xl" />
          </div>
          <EditableText
            as="p"
            regionKey="footer.desc"
            fallback="Elevating your journey. Premium car rentals for those who value performance, style, and uncompromising quality."
            className="text-sm opacity-60 leading-relaxed block max-w-sm mx-auto md:mx-0"
          />
        </div>
        
        <div className="flex flex-col gap-5">
          <h4 className="font-black tracking-widest text-xs opacity-40 uppercase">Explore</h4>
          {["Home", "About", "Contact"].map((p) => (
            <button key={p} onClick={() => setActivePage(p.toLowerCase() as any)} className="hover:opacity-60 text-sm font-semibold transition-opacity w-fit mx-auto md:mx-0">
              {p}
            </button>
          ))}
        </div>

        <div className="space-y-5">
          <h4 className="font-black tracking-widest text-xs opacity-40 uppercase">Contact Us</h4>
          <EditableText regionKey="footer.phone" fallback="+1 (800) 555-RIDE" className="text-sm font-semibold block" />
          <EditableText regionKey="footer.email" fallback="reservations@velocity.com" className="text-sm font-semibold block" />
          <EditableText regionKey="footer.copy" fallback="© 2024 Velocity. All rights reserved." className="text-xs opacity-40 block pt-6" />
        </div>
      </div>
    </footer>
  );

  // --- PAGE VIEWS ---
  const HomeView = () => (
    <div className="animate-in fade-in duration-700">
      <Section id="hero" bgType="primary">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="flex-1 space-y-8 z-10 w-full">
            <div className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-4 shadow-sm border"
                 style={{ backgroundColor: theme.secondaryColor, color: theme.primaryColor, borderColor: `${theme.textColor}10` }}>
              <EditableText regionKey="hero.badge" fallback="Premium Fleet 2024" />
            </div>
            <EditableText
              as="h1"
              regionKey="hero.title"
              fallback="Drive Your Dream."
              className="text-6xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tighter block break-words"
            />
            <EditableText
              as="p"
              regionKey="hero.subtitle"
              fallback="Experience the thrill of the open road with our exclusive collection of luxury and sports vehicles. Delivered to your door."
              className="text-lg md:text-xl opacity-70 leading-relaxed block max-w-xl font-medium"
            />
            <div className="flex flex-wrap gap-4 pt-4">
              <button
                className="px-10 py-5 font-black uppercase tracking-widest text-sm shadow-xl hover:scale-105 transition-transform"
                style={{ backgroundColor: theme.primaryColor, color: "#fff", borderRadius: `${theme.borderRadius}px` }}
              >
                <EditableText regionKey="hero.btn1" fallback="Reserve Now" />
              </button>
              <button
                className="px-10 py-5 font-black uppercase tracking-widest text-sm hover:scale-105 transition-transform border-2"
                style={{ backgroundColor: "transparent", color: theme.textColor, borderColor: `${theme.textColor}20`, borderRadius: `${theme.borderRadius}px` }}
              >
                <EditableText regionKey="hero.btn2" fallback="View Fleet" />
              </button>
            </div>
          </div>
          <div className="flex-1 w-full relative group">
            <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-3xl opacity-20 transition-transform group-hover:translate-x-6 group-hover:translate-y-6" style={{ backgroundColor: theme.primaryColor, borderRadius: `${theme.borderRadius * 2}px` }}></div>
            <EditableImg
              regionKey="hero.img"
              fallback="https://images.unsplash.com/photo-1617531653332-bd46c24f2068?q=80&w=2000&auto=format&fit=crop"
              className="w-full aspect-[4/3] lg:aspect-square object-cover shadow-2xl relative z-10"
              style={{ borderRadius: `${theme.borderRadius * 2}px` }}
            />
          </div>
        </div>
      </Section>

      <Section id="fleet" bgType="secondary">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <EditableText as="h2" regionKey="fleet.title" fallback="Featured Vehicles" className="text-4xl md:text-5xl font-black tracking-tighter block mb-6" />
          <EditableText as="p" regionKey="fleet.desc" fallback="Select from our meticulously maintained fleet of high-performance and luxury vehicles." className="text-lg opacity-60 block" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { id: "1", fallbackImg: "https://images.unsplash.com/photo-1503376760367-1154ce8a9cb5?w=800&fit=crop", name: "Porsche 911 Carrera", price: "$350 / day" },
            { id: "2", fallbackImg: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&fit=crop", name: "Corvette Stingray", price: "$280 / day" },
            { id: "3", fallbackImg: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&fit=crop", name: "Audi R8 V10", price: "$450 / day" }
          ].map((car) => (
            <div key={car.id} className="flex flex-col overflow-hidden bg-white shadow-xl transition-all hover:-translate-y-2 border" style={{ borderRadius: `${theme.borderRadius}px`, borderColor: `${theme.textColor}10`, backgroundColor: theme.backgroundColor }}>
              <div className="relative aspect-[4/3] overflow-hidden">
                <EditableImg regionKey={`fleet.${car.id}.img`} fallback={car.fallbackImg} className="w-full h-full object-cover" />
                <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm text-black text-xs font-black rounded-full">
                  <EditableText regionKey={`fleet.${car.id}.tag`} fallback="Available" />
                </div>
              </div>
              <div className="p-8 flex flex-col flex-1">
                <EditableText regionKey={`fleet.${car.id}.name`} fallback={car.name} className="text-2xl font-black mb-2 block" />
                <EditableText regionKey={`fleet.${car.id}.price`} fallback={car.price} className="text-lg font-semibold block mb-8" style={{ color: theme.primaryColor }} />
                <button className="mt-auto w-full py-4 font-bold text-sm tracking-wider uppercase border-2 transition-colors hover:bg-black hover:text-white" style={{ borderRadius: `${theme.borderRadius}px`, borderColor: theme.textColor }}>
                  <EditableText regionKey="global.bookBtn" fallback="Rent Now" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );

  const AboutView = () => (
    <Section id="about" bgType="primary">
      <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center animate-in slide-in-from-bottom-4 duration-700">
        <div className="order-2 lg:order-1 relative">
          <EditableImg
            regionKey="about.img"
            fallback="https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=1600&auto=format&fit=crop"
            className="w-full aspect-[4/5] object-cover shadow-2xl"
            style={{ borderRadius: `${theme.borderRadius * 2}px` }}
          />
        </div>
        <div className="order-1 lg:order-2 space-y-8">
          <EditableText as="h2" regionKey="about.title" fallback="Driven by Perfection." className="text-5xl lg:text-7xl font-black tracking-tighter block leading-tight" />
          <EditableText
            as="p"
            regionKey="about.desc1"
            fallback="Founded on the principle that the journey matters just as much as the destination, we provide an unmatched fleet of the world's most sought-after vehicles."
            className="text-lg opacity-80 leading-relaxed block font-medium"
          />
          <EditableText
            as="p"
            regionKey="about.desc2"
            fallback="Whether you're looking for an exotic thrill for the weekend, a refined luxury sedan for business, or a capable SUV for an adventure, our curated collection is ready."
            className="text-lg opacity-60 leading-relaxed block"
          />
          
          <div className="grid grid-cols-2 gap-8 pt-8">
            <div>
              <EditableText as="h3" regionKey="about.stat1.val" fallback="50+" className="text-4xl font-black block mb-2" style={{ color: theme.primaryColor }} />
              <EditableText as="p" regionKey="about.stat1.lbl" fallback="Luxury Vehicles" className="text-sm font-bold uppercase tracking-widest opacity-50 block" />
            </div>
            <div>
              <EditableText as="h3" regionKey="about.stat2.val" fallback="24/7" className="text-4xl font-black block mb-2" style={{ color: theme.primaryColor }} />
              <EditableText as="p" regionKey="about.stat2.lbl" fallback="Concierge Support" className="text-sm font-bold uppercase tracking-widest opacity-50 block" />
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
          <EditableText as="h1" regionKey="contact.title" fallback="Let's Talk." className="text-6xl md:text-7xl font-black tracking-tighter block mb-6" />
          <EditableText as="p" regionKey="contact.subtitle" fallback="Ready to get behind the wheel? Contact our concierge team to secure your reservation." className="text-xl opacity-70 block max-w-2xl mx-auto" />
        </div>

        <div className="grid lg:grid-cols-5 gap-12 bg-white/5 p-8 md:p-12 shadow-2xl border" style={{ borderRadius: `${theme.borderRadius * 2}px`, borderColor: `${theme.textColor}10`, backgroundColor: theme.secondaryColor }}>
          <div className="lg:col-span-2 space-y-10">
            <div>
              <h4 className="text-xs font-black uppercase opacity-40 tracking-widest mb-3">Headquarters</h4>
              <EditableText regionKey="contact.address" fallback="100 Luxury Lane, Suite 400" className="text-lg font-bold block" />
              <EditableText regionKey="contact.city" fallback="Beverly Hills, CA 90210" className="text-lg font-bold block" />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase opacity-40 tracking-widest mb-3">Direct Line</h4>
              <EditableText regionKey="contact.phone" fallback="+1 (800) 555-RIDE" className="text-2xl font-black block" style={{ color: theme.primaryColor }} />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase opacity-40 tracking-widest mb-3">Email Support</h4>
              <EditableText regionKey="contact.email" fallback="booking@velocity.com" className="text-lg font-bold block" />
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest opacity-50">First Name</label>
                <input className="w-full p-4 bg-transparent border-2 outline-none transition-colors focus:border-blue-500" style={{ borderColor: `${theme.textColor}15`, borderRadius: `${theme.borderRadius}px` }} placeholder="John" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest opacity-50">Last Name</label>
                <input className="w-full p-4 bg-transparent border-2 outline-none transition-colors focus:border-blue-500" style={{ borderColor: `${theme.textColor}15`, borderRadius: `${theme.borderRadius}px` }} placeholder="Doe" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest opacity-50">Desired Vehicle</label>
              <input className="w-full p-4 bg-transparent border-2 outline-none transition-colors focus:border-blue-500" style={{ borderColor: `${theme.textColor}15`, borderRadius: `${theme.borderRadius}px` }} placeholder="e.g. Porsche 911" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest opacity-50">Message</label>
              <textarea rows={4} className="w-full p-4 bg-transparent border-2 outline-none transition-colors focus:border-blue-500 resize-none" style={{ borderColor: `${theme.textColor}15`, borderRadius: `${theme.borderRadius}px` }} placeholder="Your dates and special requests..." />
            </div>
            <button className="w-full py-5 font-black uppercase tracking-widest text-sm shadow-xl hover:scale-[1.02] transition-transform" style={{ backgroundColor: theme.primaryColor, color: "#fff", borderRadius: `${theme.borderRadius}px` }}>
              <EditableText regionKey="contact.submit" fallback="Send Request" />
            </button>
          </div>
        </div>
      </div>
    </Section>
  );

  return (
    <main
      className="min-h-screen selection:bg-blue-500 selection:text-white"
      style={{ fontFamily: theme.fontFamily, backgroundColor: theme.backgroundColor }}
    >
      <Script
        src="https://upload-widget.cloudinary.com/global/all.js"
        strategy="afterInteractive"
      />
      
      <Navbar />

      <div className="flex flex-col w-full min-h-[calc(100vh-6rem)]">
        {activePage === "home" && <HomeView />}
        {activePage === "about" && <AboutView />}
        {activePage === "contact" && <ContactView />}
      </div>

      <Footer />

      <style>{`
        html { scroll-behavior: smooth; }
        [contenteditable]:focus { outline: none; box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.5); background: rgba(0,0,0,0.03); }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-in-from-bottom-4 { from { transform: translateY(2rem); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes zoom-in-95 { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-in { animation-duration: 0.6s; animation-fill-mode: both; animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1); }
        .fade-in { animation-name: fade-in; }
        .slide-in-from-bottom-4 { animation-name: slide-in-from-bottom-4; }
        .zoom-in-95 { animation-name: zoom-in-95; }
      `}</style>
    </main>
  );
}






