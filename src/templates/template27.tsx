"use client";

import React, { useState } from "react";
import Script from "next/script";
import {
  useWebsiteBuilderStore,
  useRegionValue,
} from "@/store/useWebsiteBuilderStore";
import { useThemeStore } from "@/store/useThemeStore";



export const template27Meta = {
  id: "business/template27",
  name: "Artisan Bakery",
  image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1600&auto=format&fit=crop",
};

type TemplateProps = {
  editableData?: any;
};

const getNestedValue = (obj: any, path: string) => {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
};

export default function Template27({ editableData }: TemplateProps) {
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
        className={`focus:outline-none focus:ring-2 focus:ring-orange-300 rounded transition-all ${className}`}
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
        className={`cursor-pointer transition-opacity hover:opacity-90 object-cover ${className}`}
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
        borderColor: `${theme.textColor}15`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-24 flex items-center justify-between gap-4 overflow-hidden">
        <div className="flex items-center gap-3 min-w-0">
          <EditableImg
            regionKey="global.logo"
            fallback="https://images.unsplash.com/photo-1555507036-ab1f40ce88cb?w=150&h=150&fit=crop"
            className="w-12 h-12 shadow-sm"
            style={{ borderRadius: `${theme.borderRadius}px` }}
          />
          <EditableText
            regionKey="global.brand"
            fallback="Crumb & Canvas"
            className="font-bold text-2xl tracking-tight whitespace-nowrap"
          />
        </div>

        <div className="hidden md:flex items-center gap-8">
          {["Home", "About", "Contact"].map((page) => (
            <button
              key={page}
              onClick={() => setActivePage(page.toLowerCase() as any)}
              className={`text-base font-medium transition-all ${
                activePage === page.toLowerCase() ? "scale-105" : "opacity-60 hover:opacity-100"
              }`}
              style={{
                color: activePage === page.toLowerCase() ? theme.primaryColor : theme.textColor,
              }}
            >
              {page}
            </button>
          ))}
        </div>

        <div className="flex-shrink-0">
          <button
            className="px-8 py-3 font-bold text-sm transition-transform active:scale-95 shadow-md hover:shadow-lg"
            style={{
              backgroundColor: theme.primaryColor,
              color: "#fff",
              borderRadius: `${theme.borderRadius}px`,
            }}
          >
            <EditableText regionKey="global.navCta" fallback="Order Online" />
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
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 text-center md:text-left">
        <div className="md:col-span-2 space-y-6">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <EditableImg
              regionKey="global.logo"
              fallback="https://images.unsplash.com/photo-1555507036-ab1f40ce88cb?w=150&h=150&fit=crop"
              className="w-10 h-10 shadow-sm"
              style={{ borderRadius: `${theme.borderRadius}px` }}
            />
            <EditableText regionKey="global.brand" fallback="Crumb & Canvas" className="font-bold text-xl" />
          </div>
          <EditableText
            as="p"
            regionKey="footer.desc"
            fallback="Baking joy into every single bite. Locally sourced ingredients and generations of love."
            className="text-base opacity-75 leading-relaxed max-w-sm mx-auto md:mx-0 block"
          />
        </div>
        
        <div className="flex flex-col gap-4">
          <h4 className="font-bold text-lg mb-2">Explore</h4>
          {["Home", "About", "Contact"].map((p) => (
            <button
              key={p}
              onClick={() => setActivePage(p.toLowerCase() as any)}
              className="hover:underline opacity-75 hover:opacity-100 w-fit mx-auto md:mx-0 transition-opacity"
            >
              {p}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-lg mb-2">Say Hello</h4>
          <EditableText regionKey="footer.email" fallback="hello@crumbandcanvas.com" className="opacity-75 block" />
          <EditableText regionKey="footer.phone" fallback="+1 (555) 123-4567" className="opacity-75 block" />
          <EditableText
            regionKey="footer.copy"
            fallback="© 2024 Crumb & Canvas. All rights reserved."
            className="text-sm opacity-50 block pt-6"
          />
        </div>
      </div>
    </footer>
  );

  const HomeView = () => (
    <div className="animate-in fade-in duration-700">
      {/* Hero Section (Canva Collage Style) */}
      <Section id="hero" className="pt-12 pb-24">
        <div className="grid lg:grid-cols-12 gap-12 items-center min-h-[70vh]">
          <div className="lg:col-span-5 space-y-8 z-10">
            <EditableText
              as="h1"
              regionKey="hero.title"
              fallback="Freshly Baked Happiness."
              className="text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.1] tracking-tight block"
            />
            <EditableText
              as="p"
              regionKey="hero.subtitle"
              fallback="Handcrafted artisanal breads, delicate pastries, and custom cakes made fresh every single morning."
              className="text-lg md:text-xl opacity-80 leading-relaxed block"
            />
            <button
              className="px-10 py-4 font-bold text-lg shadow-xl hover:-translate-y-1 transition-all"
              style={{
                backgroundColor: theme.primaryColor,
                color: "#fff",
                borderRadius: `${theme.borderRadius}px`,
              }}
            >
              <EditableText regionKey="hero.btn1" fallback="See Our Menu" />
            </button>
          </div>
          
          <div className="lg:col-span-7 relative h-[500px] sm:h-[600px] w-full">
            {/* Main large image */}
            <EditableImg
              regionKey="hero.img1"
              fallback="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80&fit=crop"
              className="absolute right-0 top-0 w-4/5 h-4/5 shadow-2xl"
              style={{ borderRadius: `${theme.borderRadius * 1.5}px` }}
            />
            {/* Overlapping secondary image */}
            <EditableImg
              regionKey="hero.img2"
              fallback="https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=600&q=80&fit=crop"
              className="absolute left-0 bottom-0 w-1/2 h-1/2 shadow-xl border-8"
              style={{ 
                borderRadius: `${theme.borderRadius}px`,
                borderColor: theme.backgroundColor 
              }}
            />
          </div>
        </div>
      </Section>

      {/* Featured Menu Grid */}
      <Section id="featured" bgType="secondary">
        <div className="text-center mb-16 space-y-4">
          <EditableText
            as="h2"
            regionKey="featured.title"
            fallback="Today's Favorites"
            className="text-4xl md:text-5xl font-bold block"
          />
          <EditableText
            as="p"
            regionKey="featured.subtitle"
            fallback="Discover our most loved baked goods, fresh out of the oven."
            className="text-lg opacity-70 block max-w-2xl mx-auto"
          />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="group bg-white p-4 shadow-sm hover:shadow-xl transition-shadow duration-300"
              style={{ borderRadius: `${theme.borderRadius}px` }}
            >
              <div className="overflow-hidden mb-6" style={{ borderRadius: `${theme.borderRadius - 8}px` }}>
                <EditableImg
                  regionKey={`featured.item${item}.img`}
                  fallback={
                    item === 1
                      ? "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=600&q=80&fit=crop"
                      : item === 2
                      ? "https://images.unsplash.com/photo-1621236378699-8597faf6a176?w=600&q=80&fit=crop"
                      : "https://images.unsplash.com/photo-1587248720327-66be753d0dd3?w=600&q=80&fit=crop"
                  }
                  className="w-full aspect-[4/3] group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="px-2 space-y-2 pb-4">
                <EditableText
                  as="h3"
                  regionKey={`featured.item${item}.title`}
                  fallback={item === 1 ? "Classic Croissant" : item === 2 ? "Sourdough Loaf" : "Berry Tart"}
                  className="text-2xl font-bold block"
                />
                <EditableText
                  as="p"
                  regionKey={`featured.item${item}.desc`}
                  fallback="Baked fresh daily with premium butter and flour."
                  className="opacity-70 block text-sm"
                />
                <EditableText
                  as="p"
                  regionKey={`featured.item${item}.price`}
                  fallback={item === 1 ? "$4.50" : item === 2 ? "$8.00" : "$6.50"}
                  className="font-bold text-lg pt-2 block"
                  style={{ color: theme.primaryColor }}
                />
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );

  const AboutView = () => (
    <div className="animate-in slide-in-from-bottom-4 duration-700">
      <Section id="about" className="py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 relative">
            <div 
              className="absolute inset-0 opacity-20 -translate-x-6 translate-y-6"
              style={{ backgroundColor: theme.primaryColor, borderRadius: `${theme.borderRadius * 2}px` }}
            />
            <EditableImg
              regionKey="about.img"
              fallback="https://images.unsplash.com/photo-1556217477-874581ea7878?w=800&q=80&fit=crop"
              className="w-full aspect-square object-cover shadow-xl relative z-10"
              style={{ borderRadius: `${theme.borderRadius * 2}px` }}
            />
          </div>
          <div className="order-1 lg:order-2 space-y-8">
            <EditableText
              as="h2"
              regionKey="about.title"
              fallback="Our Baking Philosophy"
              className="text-5xl font-bold block leading-tight"
            />
            <EditableText
              as="p"
              regionKey="about.desc1"
              fallback="It started with a simple family recipe and a tiny oven. Today, we bring that same intimate passion to everything we bake, treating every loaf of bread and every delicate pastry as a work of art."
              className="text-lg opacity-80 leading-relaxed block"
            />
            <EditableText
              as="p"
              regionKey="about.desc2"
              fallback="We source our flour locally, use only organic butter, and believe that good things take time. That's why our sourdough ferments for 48 hours before it ever sees the heat."
              className="text-lg opacity-80 leading-relaxed block"
            />
            <div className="pt-6">
              <EditableImg
                regionKey="about.signature"
                fallback="https://upload.wikimedia.org/wikipedia/commons/f/f8/Stylized_signature_sample.svg"
                className="w-48 opacity-60 mix-blend-multiply"
              />
            </div>
          </div>
        </div>
      </Section>
    </div>
  );

  const ContactView = () => (
    <div className="animate-in zoom-in-95 duration-500">
      <Section id="contact" className="py-20">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16">
          <div className="space-y-12">
            <div>
              <EditableText
                as="h1"
                regionKey="contact.title"
                fallback="Drop by for a treat."
                className="text-5xl md:text-6xl font-bold block mb-6"
              />
              <EditableText
                as="p"
                regionKey="contact.subtitle"
                fallback="We'd love to see you. Come in for a coffee and a warm pastry."
                className="text-xl opacity-70 block"
              />
            </div>

            <div className="space-y-8">
              <div className="flex gap-4">
                <div 
                  className="w-12 h-12 flex items-center justify-center shrink-0" 
                  style={{ backgroundColor: theme.secondaryColor, borderRadius: theme.borderRadius }}
                >
                  📍
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Visit Us</h4>
                  <EditableText regionKey="contact.address" fallback="123 Baker Street, Flour District, NY 10001" className="opacity-80 block" />
                </div>
              </div>

              <div className="flex gap-4">
                <div 
                  className="w-12 h-12 flex items-center justify-center shrink-0" 
                  style={{ backgroundColor: theme.secondaryColor, borderRadius: theme.borderRadius }}
                >
                  ⏰
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Hours</h4>
                  <EditableText regionKey="contact.hours" fallback="Mon - Sat: 7am - 6pm / Sun: 8am - 3pm" className="opacity-80 block" />
                </div>
              </div>
            </div>
          </div>

          <div 
            className="p-8 sm:p-12 shadow-2xl"
            style={{ 
              backgroundColor: "#ffffff", 
              borderRadius: `${theme.borderRadius * 1.5}px` 
            }}
          >
            <h3 className="text-3xl font-bold mb-8">Special Orders</h3>
            <div className="space-y-6">
              <input 
                className="w-full p-4 bg-transparent border-b-2 outline-none transition-colors" 
                style={{ borderColor: `${theme.textColor}20` }} 
                placeholder="Your Name" 
              />
              <input 
                className="w-full p-4 bg-transparent border-b-2 outline-none transition-colors" 
                style={{ borderColor: `${theme.textColor}20` }} 
                placeholder="Email Address" 
              />
              <textarea 
                className="w-full p-4 bg-transparent border-b-2 outline-none transition-colors resize-none h-32" 
                style={{ borderColor: `${theme.textColor}20` }} 
                placeholder="Tell us about your event or special request..." 
              />
              <button 
                className="w-full py-5 font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-1" 
                style={{ 
                  backgroundColor: theme.primaryColor, 
                  color: "#fff", 
                  borderRadius: `${theme.borderRadius}px` 
                }}
              >
                <EditableText regionKey="contact.submit" fallback="Send Message" />
              </button>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );

  return (
    <main
      className="min-h-screen relative w-full overflow-x-hidden"
      style={{ fontFamily: theme.fontFamily, backgroundColor: theme.backgroundColor, color: theme.textColor }}
    >
      <script
        src="https://upload-widget.cloudinary.com/global/all.js"
        async
      ></script>
      
      <Navbar />

      <div className="flex flex-col w-full min-w-0">
        {activePage === "home" && <HomeView />}
        {activePage === "about" && <AboutView />}
        {activePage === "contact" && <ContactView />}
      </div>

      <Footer />

      <style>{`
        html, body { 
          scroll-behavior: smooth; 
          max-width: 100vw;
          overflow-x: hidden;
        }
        [contenteditable]:focus { 
          outline: none; 
          background: rgba(0,0,0,0.03); 
        }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-in-from-bottom-4 { from { transform: translateY(1.5rem); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes zoom-in-95 { from { transform: scale(0.97); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-in { animation-duration: 0.6s; animation-fill-mode: both; animation-timing-function: ease-out; }
        .fade-in { animation-name: fade-in; }
        .slide-in-from-bottom-4 { animation-name: slide-in-from-bottom-4; }
        .zoom-in-95 { animation-name: zoom-in-95; }
      `}</style>
    </main>
  );
}






