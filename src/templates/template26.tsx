"use client";

import React, { useState, useEffect } from "react";
import {
  useWebsiteBuilderStore,
  useRegionValue,
} from "@/store/useWebsiteBuilderStore";
import { useThemeStore } from "@/store/useThemeStore";

export const template26Meta = {
  id: "business/template26",
  name: "Canva Chic Interior Design",
  image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1600&auto=format&fit=crop",
};

type TemplateProps = {
  editableData?: any;
};

const getNestedValue = (obj: any, path: string) => {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
};

export default function Template26({ editableData }: TemplateProps) {
  const [activePage, setActivePage] = useState<"home" | "about" | "contact">("home");
  const { theme } = useThemeStore();
  const updateRegion = useWebsiteBuilderStore((state: any) => state.updateRegion);

  // --- CLOUDINARY SCRIPT INJECTION (FIX FOR NEXT/SCRIPT ISSUE) ---
  useEffect(() => {
    const scriptId = "cloudinary-upload-widget-script";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://upload-widget.cloudinary.com/global/all.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

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
        className={`focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-gray-400 rounded transition-all break-words ${className}`}
        style={{ outline: "none" }}
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
        className={`cursor-pointer transition-opacity hover:opacity-90 max-w-full ${className}`}
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
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">{children}</div>
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
          <EditableText
            regionKey="global.brand"
            fallback="MAISON DE DESIGN"
            className="font-bold text-xl md:text-2xl tracking-widest uppercase whitespace-nowrap"
            style={{ fontFamily: theme.fontFamily }}
          />
        </div>

        <div className="hidden md:flex items-center gap-10 px-4">
          {["Home", "About", "Contact"].map((page) => (
            <button
              key={page}
              onClick={() => setActivePage(page.toLowerCase() as any)}
              className={`text-xs font-medium transition-all uppercase tracking-[0.2em] relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-full after:h-[1px] after:bg-current after:transition-transform after:duration-300 ${
                activePage === page.toLowerCase() ? "after:scale-x-100 opacity-100" : "after:scale-x-0 opacity-60 hover:opacity-100 hover:after:scale-x-100"
              }`}
              style={{ color: theme.textColor }}
            >
              {page}
            </button>
          ))}
        </div>

        <div className="flex-shrink-0">
          <button
            className="px-8 py-3 text-xs tracking-[0.2em] uppercase transition-all duration-300 hover:opacity-80"
            style={{
              backgroundColor: theme.textColor,
              color: theme.backgroundColor,
              borderRadius: `${theme.borderRadius}px`,
            }}
          >
            <EditableText regionKey="global.navCta" fallback="BOOK CONSULTATION" />
          </button>
        </div>
      </div>
    </nav>
  );

  const Footer = () => (
    <footer
      className="py-24 px-4 sm:px-6 lg:px-8 border-t mt-auto"
      style={{
        backgroundColor: theme.secondaryColor,
        color: theme.textColor,
        borderColor: `${theme.textColor}10`,
      }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-16">
        <div className="md:col-span-2 space-y-6">
          <EditableText 
            regionKey="global.brand" 
            fallback="MAISON DE DESIGN" 
            className="font-bold text-2xl tracking-widest uppercase block mb-6" 
            style={{ fontFamily: theme.fontFamily }}
          />
          <EditableText
            as="p"
            regionKey="footer.desc"
            fallback="Curating timeless spaces that elevate the everyday. We blend aesthetic intuition with architectural precision."
            className="text-sm opacity-70 leading-loose block max-w-md"
            style={{ fontFamily: "Inter, sans-serif" }}
          />
        </div>
        <div className="flex flex-col gap-4">
          <h4 className="font-bold uppercase tracking-[0.2em] text-xs opacity-50 mb-4">Studio</h4>
          {["Home", "About", "Contact"].map((p) => (
            <button 
              key={p} 
              onClick={() => setActivePage(p.toLowerCase() as any)} 
              className="text-sm w-fit text-left hover:opacity-60 transition-opacity"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              {p}
            </button>
          ))}
        </div>
        <div className="space-y-4">
          <h4 className="font-bold uppercase tracking-[0.2em] text-xs opacity-50 mb-4">Inquiries</h4>
          <EditableText regionKey="footer.email" fallback="hello@maisondesign.com" className="text-sm block" style={{ fontFamily: "Inter, sans-serif" }} />
          <EditableText regionKey="footer.phone" fallback="+1 (555) 123-4567" className="text-sm block" style={{ fontFamily: "Inter, sans-serif" }} />
          <EditableText regionKey="footer.copy" fallback="© 2026 Maison. All rights reserved." className="text-xs opacity-40 block pt-12" style={{ fontFamily: "Inter, sans-serif" }} />
        </div>
      </div>
    </footer>
  );

  const HomeView = () => (
    <div className="animate-in fade-in duration-1000 w-full overflow-hidden">
      <section className="relative w-full min-h-[85vh] flex items-center justify-center p-4 sm:p-8">
        <div className="absolute inset-0 z-0">
          <EditableImg
            regionKey="home.heroBg"
            fallback="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2000&auto=format&fit=crop"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col justify-end h-full mt-32 md:mt-48">
          <div 
            className="max-w-2xl p-8 sm:p-12 md:p-16 backdrop-blur-sm shadow-2xl"
            style={{ 
              backgroundColor: `${theme.backgroundColor}F2`,
              borderRadius: `${theme.borderRadius}px` 
            }}
          >
            <EditableText
              as="h1"
              regionKey="home.heroTitle"
              fallback="Crafting Spaces of Quiet Luxury."
              className="text-5xl md:text-7xl font-bold leading-[1.1] block mb-6"
              style={{ fontFamily: theme.fontFamily }}
            />
            <EditableText
              as="p"
              regionKey="home.heroSubtitle"
              fallback="Award-winning interior architecture for those who appreciate the poetry of space and light."
              className="text-base md:text-lg opacity-80 leading-relaxed block mb-10"
              style={{ fontFamily: "Inter, sans-serif" }}
            />
            <button
              className="px-10 py-4 text-xs tracking-[0.2em] uppercase transition-all duration-300 hover:opacity-80 border"
              style={{
                borderColor: theme.textColor,
                color: theme.textColor,
                borderRadius: `${theme.borderRadius}px`,
              }}
            >
              <EditableText regionKey="home.heroBtn" fallback="VIEW PORTFOLIO" />
            </button>
          </div>
        </div>
      </section>

      <Section id="philosophy" bgType="primary">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <EditableText
            as="h2"
            regionKey="home.philTitle"
            fallback="The Art of Living Well"
            className="text-3xl md:text-5xl font-bold block"
            style={{ fontFamily: theme.fontFamily }}
          />
          <EditableText
            as="p"
            regionKey="home.philText"
            fallback="We approach each project as a unique narrative. By blending organic textures, curated objects, and structural precision, we design environments that feel simultaneously expansive and deeply personal."
            className="text-lg md:text-xl opacity-70 leading-loose block font-light"
            style={{ fontFamily: "Inter, sans-serif" }}
          />
        </div>
      </Section>

      <Section id="projects" bgType="secondary">
        <div className="mb-16 flex flex-col md:flex-row justify-between items-end gap-6">
          <EditableText
            as="h2"
            regionKey="home.projectsTitle"
            fallback="Selected Works"
            className="text-4xl md:text-5xl font-bold block"
            style={{ fontFamily: theme.fontFamily }}
          />
          <EditableText
            regionKey="home.projectsSub"
            fallback="01 / PORTFOLIO"
            className="text-xs uppercase tracking-[0.2em] opacity-50 block pb-2"
            style={{ fontFamily: "Inter, sans-serif" }}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 flex-wrap">
          {[1, 2, 3].map((num) => (
            <div key={num} className="group cursor-pointer">
              <div className="overflow-hidden mb-6" style={{ borderRadius: `${theme.borderRadius}px` }}>
                <EditableImg
                  regionKey={`home.projectImg${num}`}
                  fallback={
                    num === 1 ? "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=800&auto=format&fit=crop" :
                    num === 2 ? "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=800&auto=format&fit=crop" :
                    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=800&auto=format&fit=crop"
                  }
                  className="w-full aspect-[3/4] object-cover transition-transform duration-1000 group-hover:scale-105"
                />
              </div>
              <EditableText
                regionKey={`home.projectTitle${num}`}
                fallback={`Project No. ${num}`}
                className="text-xl font-bold block mb-2"
                style={{ fontFamily: theme.fontFamily }}
              />
              <EditableText
                regionKey={`home.projectCat${num}`}
                fallback="RESIDENTIAL"
                className="text-xs tracking-[0.2em] uppercase opacity-50 block"
                style={{ fontFamily: "Inter, sans-serif" }}
              />
            </div>
          ))}
        </div>
      </Section>
    </div>
  );

  const AboutView = () => (
    <div className="animate-in slide-in-from-bottom-4 duration-1000 w-full overflow-hidden">
      <Section id="about-hero" bgType="primary">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="order-2 lg:order-1 space-y-10">
            <EditableText 
              regionKey="about.tag" 
              fallback="OUR STORY" 
              className="text-xs uppercase tracking-[0.2em] opacity-50 block" 
              style={{ fontFamily: "Inter, sans-serif" }}
            />
            <EditableText 
              as="h1" 
              regionKey="about.title" 
              fallback="Redefining the Modern Sanctuary." 
              className="text-5xl md:text-7xl font-bold leading-[1.1] block" 
              style={{ fontFamily: theme.fontFamily }}
            />
            <div className="w-16 h-[1px]" style={{ backgroundColor: theme.textColor }}></div>
            <EditableText
              as="p"
              regionKey="about.desc1"
              fallback="Founded on the principle that spaces shape our daily experiences, Maison De Design is a multidisciplinary studio focused on high-end residential and boutique commercial interiors. We believe in subtraction over addition."
              className="text-lg opacity-80 leading-loose block font-light"
              style={{ fontFamily: "Inter, sans-serif" }}
            />
            <EditableText
              as="p"
              regionKey="about.desc2"
              fallback="Our team of architects, designers, and artisans work collaboratively to source rare materials and craft bespoke furnishings, ensuring every project is an authentic reflection of its inhabitants."
              className="text-lg opacity-80 leading-loose block font-light"
              style={{ fontFamily: "Inter, sans-serif" }}
            />
          </div>
          <div className="order-1 lg:order-2">
            <EditableImg
              regionKey="about.img"
              fallback="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop"
              className="w-full aspect-[4/5] object-cover shadow-xl"
              style={{ borderRadius: `${theme.borderRadius}px` }}
            />
          </div>
        </div>
      </Section>

      <Section id="team" bgType="secondary">
        <div className="text-center mb-16">
          <EditableText
            as="h2"
            regionKey="about.teamTitle"
            fallback="The Visionaries"
            className="text-4xl md:text-5xl font-bold block"
            style={{ fontFamily: theme.fontFamily }}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {[1, 2, 3].map((num) => (
            <div key={num} className="text-center flex flex-col items-center">
              <EditableImg
                regionKey={`about.teamImg${num}`}
                fallback={
                  num === 1 ? "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop" :
                  num === 2 ? "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop" :
                  "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600&auto=format&fit=crop"
                }
                className="w-full aspect-square object-cover mb-6 grayscale hover:grayscale-0 transition-all duration-500"
                style={{ borderRadius: `${theme.borderRadius}px` }}
              />
              <EditableText
                regionKey={`about.teamName${num}`}
                fallback={num === 1 ? "Elena Rossi" : num === 2 ? "Marcus Chen" : "Sarah Jenkins"}
                className="text-xl font-bold block mb-1"
                style={{ fontFamily: theme.fontFamily }}
              />
              <EditableText
                regionKey={`about.teamRole${num}`}
                fallback={num === 1 ? "Principal Designer" : num === 2 ? "Lead Architect" : "Interior Stylist"}
                className="text-xs uppercase tracking-[0.2em] opacity-50 block"
                style={{ fontFamily: "Inter, sans-serif" }}
              />
            </div>
          ))}
        </div>
      </Section>
    </div>
  );

  const ContactView = () => (
    <div className="animate-in zoom-in-95 duration-1000 w-full overflow-hidden flex-grow flex flex-col">
      <Section id="contact" bgType="primary" className="flex-grow flex items-center">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 w-full">
          <div className="space-y-12">
            <div>
              <EditableText 
                as="h1" 
                regionKey="contact.title" 
                fallback="Let's create something beautiful." 
                className="text-5xl md:text-7xl font-bold leading-[1.1] block mb-6" 
                style={{ fontFamily: theme.fontFamily }}
              />
              <EditableText 
                as="p" 
                regionKey="contact.subtitle" 
                fallback="Whether you are building from the ground up or reimagining an existing space, we are here to guide the process." 
                className="text-lg opacity-70 leading-loose block font-light max-w-md" 
                style={{ fontFamily: "Inter, sans-serif" }}
              />
            </div>
            
            <div className="space-y-8 pt-8 border-t" style={{ borderColor: `${theme.textColor}20` }}>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-[0.2em] opacity-40 mb-3" style={{ fontFamily: "Inter, sans-serif" }}>Studio Location</h4>
                <EditableText regionKey="contact.address" fallback="125 Design Avenue, Suite 400" className="text-lg block" style={{ fontFamily: theme.fontFamily }}/>
                <EditableText regionKey="contact.city" fallback="New York, NY 10001" className="text-lg block" style={{ fontFamily: theme.fontFamily }}/>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-[0.2em] opacity-40 mb-3" style={{ fontFamily: "Inter, sans-serif" }}>Direct Inquiries</h4>
                <EditableText regionKey="contact.email" fallback="inquiries@maisondesign.com" className="text-lg block mb-1" style={{ fontFamily: theme.fontFamily }}/>
                <EditableText regionKey="contact.phone" fallback="+1 (555) 123-4567" className="text-lg block" style={{ fontFamily: theme.fontFamily }}/>
              </div>
            </div>
          </div>

          <div 
            className="p-8 sm:p-12 shadow-xl h-fit"
            style={{ 
              backgroundColor: theme.secondaryColor,
              borderRadius: `${theme.borderRadius}px` 
            }}
          >
            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-[0.2em] opacity-50" style={{ fontFamily: "Inter, sans-serif" }}>Name</label>
                <input 
                  type="text"
                  className="w-full pb-3 bg-transparent border-b outline-none transition-colors" 
                  style={{ borderColor: `${theme.textColor}30`, color: theme.textColor }} 
                  placeholder="Jane Doe" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-[0.2em] opacity-50" style={{ fontFamily: "Inter, sans-serif" }}>Email</label>
                <input 
                  type="email"
                  className="w-full pb-3 bg-transparent border-b outline-none transition-colors" 
                  style={{ borderColor: `${theme.textColor}30`, color: theme.textColor }} 
                  placeholder="jane@example.com" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-[0.2em] opacity-50" style={{ fontFamily: "Inter, sans-serif" }}>Project Details</label>
                <textarea 
                  className="w-full pb-3 bg-transparent border-b outline-none transition-colors resize-none h-24" 
                  style={{ borderColor: `${theme.textColor}30`, color: theme.textColor }} 
                  placeholder="Tell us about your space..." 
                />
              </div>
              <button 
                className="w-full py-5 text-xs font-bold uppercase tracking-[0.2em] transition-all hover:opacity-90 mt-4" 
                style={{ 
                  backgroundColor: theme.textColor, 
                  color: theme.backgroundColor, 
                  borderRadius: `${theme.borderRadius}px` 
                }}
              >
                <EditableText regionKey="contact.submitBtn" fallback="SUBMIT INQUIRY" />
              </button>
            </form>
          </div>
        </div>
      </Section>
    </div>
  );

  return (
    <main
      className="min-h-screen flex flex-col selection:bg-gray-200 selection:text-black w-full overflow-hidden"
      style={{ fontFamily: theme.fontFamily, backgroundColor: theme.backgroundColor }}
    >
      <Navbar />

      <div className="flex flex-col w-full flex-grow min-w-0">
        {activePage === "home" && <HomeView />}
        {activePage === "about" && <AboutView />}
        {activePage === "contact" && <ContactView />}
      </div>

      <Footer />

      <style dangerouslySetInnerHTML={{ __html: `
        html, body { 
          max-width: 100vw; 
          overflow-x: hidden; 
        }
        [contenteditable]:focus { 
          outline: none; 
          box-shadow: inset 0 -2px 0 0 rgba(0,0,0,0.1); 
        }
        @keyframes fade-in { 
          from { opacity: 0; } 
          to { opacity: 1; } 
        }
        @keyframes slide-in-from-bottom-4 { 
          from { transform: translateY(2rem); opacity: 0; } 
          to { transform: translateY(0); opacity: 1; } 
        }
        @keyframes zoom-in-95 { 
          from { transform: scale(0.98); opacity: 0; } 
          to { transform: scale(1); opacity: 1; } 
        }
        .animate-in { 
          animation-fill-mode: both; 
          animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }
        .fade-in { animation-name: fade-in; }
        .slide-in-from-bottom-4 { animation-name: slide-in-from-bottom-4; }
        .zoom-in-95 { animation-name: zoom-in-95; }
      `}} />
    </main>
  );
}



