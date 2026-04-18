"use client";

import React, { useState, useCallback } from "react";
import Script from "next/script";
import {
  useWebsiteBuilderStore,
  useRegionValue,
} from "@/store/useWebsiteBuilderStore";
import { useThemeStore } from "@/store/useThemeStore";



export const template11Meta = {
  id: "business/template11",
  name: "Modern Education Academy",
  image:
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1600&auto=format&fit=crop",
};

type TemplateProps = {
  editableData?: any;
};

const getNestedValue = (obj: any, path: string) => {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
};

export default function Template11({ editableData }: TemplateProps) {
  const [activePage, setActivePage] = useState<"home" | "about" | "contact">("home");
  const { theme } = useThemeStore();
  const updateRegion = useWebsiteBuilderStore((state: any) => state.updateRegion);

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
        className={`cursor-pointer transition-transform hover:scale-[1.02] ${className}`}
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
      className="sticky top-0 w-full z-40 backdrop-blur-xl border-b"
      style={{
        backgroundColor: `${theme.backgroundColor}E6`,
        borderColor: `${theme.textColor}15`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-24 flex items-center justify-between gap-4 overflow-hidden">
        <div className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer" onClick={() => setActivePage("home")}>
          <EditableImg
            regionKey="global.logo"
            fallback="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=100&h=100&fit=crop"
            className="w-12 h-12 object-cover"
            style={{ borderRadius: `${Math.min(theme.borderRadius, 16)}px` }}
          />
          <EditableText
            regionKey="global.brand"
            fallback="EduNova Academy"
            className="font-extrabold text-2xl tracking-tight whitespace-nowrap hidden sm:block"
          />
        </div>

        <div className="hidden md:flex items-center gap-8 px-4">
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
            className="px-8 py-3.5 font-bold text-sm transition-transform active:scale-95 shadow-lg hover:shadow-xl"
            style={{
              backgroundColor: theme.primaryColor,
              color: "#fff",
              borderRadius: `${theme.borderRadius * 1.5}px`,
            }}
          >
            <EditableText regionKey="global.navCta" fallback="Start Learning" />
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
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 lg:gap-16">
        <div className="space-y-6 md:col-span-2">
          <div className="flex items-center gap-3">
            <EditableImg
              regionKey="global.logo"
              fallback="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=100&h=100&fit=crop"
              className="w-10 h-10 object-cover"
              style={{ borderRadius: `${Math.min(theme.borderRadius, 12)}px` }}
            />
            <EditableText regionKey="global.brand" fallback="EduNova Academy" className="font-extrabold text-xl" />
          </div>
          <EditableText
            as="p"
            regionKey="footer.desc"
            fallback="Empowering the next generation of creative thinkers and innovators through accessible, world-class digital education."
            className="text-base opacity-70 leading-relaxed block max-w-sm"
          />
        </div>
        <div className="flex flex-col gap-4">
          <h4 className="font-bold text-sm opacity-50 mb-2">Quick Links</h4>
          {["Home", "About", "Contact"].map((p) => (
            <button key={p} onClick={() => setActivePage(p.toLowerCase() as any)} className="hover:underline text-left text-base font-medium w-fit">
              {p}
            </button>
          ))}
        </div>
        <div className="space-y-4">
          <h4 className="font-bold text-sm opacity-50 mb-2">Connect</h4>
          <EditableText regionKey="footer.email" fallback="hello@edunova.edu" className="text-base font-bold block" />
          <EditableText regionKey="footer.phone" fallback="+1 (555) 123-4567" className="text-base font-medium block opacity-80" />
          <EditableText regionKey="footer.copy" fallback="© 2024 EduNova Academy. All rights reserved." className="text-sm opacity-40 block pt-8" />
        </div>
      </div>
    </footer>
  );

  // --- PAGE VIEWS ---
  const HomeView = () => (
    <div className="animate-in fade-in duration-700 w-full max-w-full">
      <Section id="hero" bgType="primary">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center break-words">
          <div className="space-y-8 min-w-0">
            <div
              className="inline-block px-4 py-1.5 text-sm font-bold tracking-wide"
              style={{
                backgroundColor: `${theme.primaryColor}15`,
                color: theme.primaryColor,
                borderRadius: `${theme.borderRadius}px`,
              }}
            >
              <EditableText regionKey="hero.badge" fallback="🌟 #1 Top Rated Online Academy" />
            </div>
            <EditableText
              as="h1"
              regionKey="hero.title"
              fallback="Unlock Your True Potential Today"
              className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight block"
            />
            <EditableText
              as="p"
              regionKey="hero.subtitle"
              fallback="Join thousands of students learning cutting-edge skills from industry experts. Master design, coding, and business on your own schedule."
              className="text-lg sm:text-xl opacity-70 leading-relaxed block max-w-xl"
            />
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                className="px-8 py-4 font-bold text-base shadow-xl hover:translate-y-[-2px] transition-all"
                style={{ backgroundColor: theme.primaryColor, color: "#fff", borderRadius: `${theme.borderRadius * 1.5}px` }}
              >
                <EditableText regionKey="hero.btn1" fallback="Explore Courses" />
              </button>
              <button
                className="px-8 py-4 font-bold text-base transition-all hover:bg-black/5 dark:hover:bg-white/5"
                style={{ color: theme.textColor, borderRadius: `${theme.borderRadius * 1.5}px` }}
              >
                <EditableText regionKey="hero.btn2" fallback="Watch Video Preview" />
              </button>
            </div>
          </div>
          <div className="relative min-w-0 w-full">
            <div className="absolute inset-0 -translate-x-4 translate-y-4 rounded-[40px]" style={{ backgroundColor: theme.primaryColor, opacity: 0.1, borderRadius: `${theme.borderRadius * 2.5}px` }}></div>
            <EditableImg
              regionKey="hero.img"
              fallback="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&auto=format&fit=crop"
              className="w-full aspect-[4/3] object-cover relative z-10 shadow-2xl"
              style={{ borderRadius: `${theme.borderRadius * 2.5}px` }}
            />
          </div>
        </div>
      </Section>

      <Section id="features" bgType="secondary">
        <div className="text-center mb-16 space-y-4">
          <EditableText as="h2" regionKey="features.title" fallback="Why Choose EduNova?" className="text-4xl font-extrabold tracking-tight block" />
          <EditableText as="p" regionKey="features.subtitle" fallback="We provide a world-class learning experience designed for modern students." className="text-lg opacity-70 max-w-2xl mx-auto block" />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((num) => (
            <div
              key={num}
              className="p-8 sm:p-10 transition-all hover:translate-y-[-4px] shadow-sm hover:shadow-xl break-words"
              style={{
                backgroundColor: theme.backgroundColor,
                borderRadius: `${theme.borderRadius * 2}px`,
                border: `1px solid ${theme.textColor}08`,
              }}
            >
              <div
                className="w-16 h-16 mb-8 flex items-center justify-center text-2xl"
                style={{ backgroundColor: `${theme.primaryColor}15`, borderRadius: `${theme.borderRadius}px` }}
              >
                <EditableText regionKey={`features.icon${num}`} fallback={num === 1 ? "🎓" : num === 2 ? "💡" : "🌍"} />
              </div>
              <EditableText
                as="h3"
                regionKey={`features.item${num}.title`}
                fallback={num === 1 ? "Expert Instructors" : num === 2 ? "Interactive Projects" : "Global Community"}
                className="text-2xl font-bold mb-4 block"
              />
              <EditableText
                as="p"
                regionKey={`features.item${num}.desc`}
                fallback="Learn from industry leaders through hands-on assignments and engaging video content that sticks."
                className="text-base opacity-70 leading-relaxed block"
              />
            </div>
          ))}
        </div>
      </Section>
    </div>
  );

  const AboutView = () => (
    <Section id="about" className="animate-in slide-in-from-bottom-4 duration-700 w-full max-w-full">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div className="order-2 lg:order-1 relative min-w-0">
          <EditableImg
            regionKey="about.img"
            fallback="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&fit=crop"
            className="w-full aspect-[4/5] object-cover shadow-2xl"
            style={{ borderRadius: `${theme.borderRadius * 3}px` }}
          />
          <div
            className="absolute -bottom-8 -right-8 p-8 shadow-xl max-w-xs hidden sm:block"
            style={{ backgroundColor: theme.backgroundColor, borderRadius: `${theme.borderRadius * 2}px` }}
          >
            <EditableText as="h4" regionKey="about.statNum" fallback="50k+" className="text-4xl font-black block" style={{ color: theme.primaryColor }} />
            <EditableText as="p" regionKey="about.statText" fallback="Successful Graduates Worldwide" className="font-bold opacity-80 mt-2 block" />
          </div>
        </div>
        <div className="order-1 lg:order-2 space-y-8 min-w-0 break-words">
          <EditableText as="h2" regionKey="about.title" fallback="Redefining Education for the Modern Era" className="text-4xl sm:text-5xl font-extrabold tracking-tight block leading-[1.1]" />
          <EditableText
            as="p"
            regionKey="about.desc1"
            fallback="Founded with a singular vision: to democratize access to high-quality education. We blend cutting-edge pedagogy with immersive technology."
            className="text-lg opacity-80 leading-relaxed block"
          />
          <EditableText
            as="p"
            regionKey="about.desc2"
            fallback="Our curriculum is continuously updated in partnership with top tech companies to ensure you are learning the skills that matter today."
            className="text-lg opacity-80 leading-relaxed block"
          />
          <ul className="space-y-4 pt-4">
            {[1, 2, 3].map(i => (
              <li key={i} className="flex items-center gap-4">
                <span className="w-6 h-6 flex items-center justify-center text-white text-xs font-bold shadow-md" style={{ backgroundColor: theme.primaryColor, borderRadius: '50%' }}>✓</span>
                <EditableText regionKey={`about.bullet${i}`} fallback="Industry-recognized certifications" className="font-bold text-lg" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );

  const ContactView = () => (
    <Section id="contact" bgType="secondary" className="animate-in zoom-in-95 duration-500 w-full max-w-full">
      <div className="max-w-5xl mx-auto break-words">
        <div className="text-center mb-16 space-y-6">
          <EditableText as="h1" regionKey="contact.title" fallback="Get in Touch" className="text-5xl sm:text-6xl font-extrabold tracking-tight block" />
          <EditableText as="p" regionKey="contact.subtitle" fallback="Have questions about enrollment? Our admissions team is here to help you begin your journey." className="text-xl opacity-70 block max-w-2xl mx-auto" />
        </div>

        <div
          className="grid md:grid-cols-5 gap-0 shadow-2xl overflow-hidden"
          style={{ borderRadius: `${theme.borderRadius * 2}px`, backgroundColor: theme.backgroundColor }}
        >
          <div
            className="md:col-span-2 p-10 sm:p-12 text-white flex flex-col justify-between"
            style={{ backgroundColor: theme.primaryColor }}
          >
            <div className="space-y-10">
              <EditableText as="h3" regionKey="contact.infoTitle" fallback="Contact Information" className="text-2xl font-bold block" />
              <div className="space-y-8">
                <div>
                  <p className="text-sm font-bold opacity-60 uppercase tracking-wider mb-2">Admissions Office</p>
                  <EditableText regionKey="contact.address" fallback="123 Education Lane, Tech District, CA 94105" className="font-semibold text-lg block" />
                </div>
                <div>
                  <p className="text-sm font-bold opacity-60 uppercase tracking-wider mb-2">Direct Line</p>
                  <EditableText regionKey="contact.phone" fallback="+1 (800) 123-4567" className="font-semibold text-lg block" />
                </div>
                <div>
                  <p className="text-sm font-bold opacity-60 uppercase tracking-wider mb-2">Email Support</p>
                  <EditableText regionKey="contact.emailBox" fallback="admissions@edunova.edu" className="font-semibold text-lg block" />
                </div>
              </div>
            </div>
            <div className="mt-16 opacity-50 text-sm">
              <EditableText regionKey="contact.hours" fallback="Operating Hours: Mon-Fri, 9AM - 6PM PST" />
            </div>
          </div>

          <div className="md:col-span-3 p-10 sm:p-12">
            <div className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold opacity-70">First Name</label>
                  <input className="w-full p-4 bg-transparent border outline-none transition-all focus:ring-2 focus:ring-opacity-50" style={{ borderColor: `${theme.textColor}20`, borderRadius: `${theme.borderRadius}px` }} placeholder="John" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold opacity-70">Last Name</label>
                  <input className="w-full p-4 bg-transparent border outline-none transition-all focus:ring-2 focus:ring-opacity-50" style={{ borderColor: `${theme.textColor}20`, borderRadius: `${theme.borderRadius}px` }} placeholder="Doe" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold opacity-70">Email Address</label>
                <input className="w-full p-4 bg-transparent border outline-none transition-all focus:ring-2 focus:ring-opacity-50" style={{ borderColor: `${theme.textColor}20`, borderRadius: `${theme.borderRadius}px` }} placeholder="john@example.com" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold opacity-70">Message / Inquiry</label>
                <textarea rows={4} className="w-full p-4 bg-transparent border outline-none transition-all focus:ring-2 focus:ring-opacity-50 resize-none" style={{ borderColor: `${theme.textColor}20`, borderRadius: `${theme.borderRadius}px` }} placeholder="How can we help you today?"></textarea>
              </div>
              <button className="w-full py-5 font-bold text-lg shadow-md hover:shadow-lg transition-all" style={{ backgroundColor: theme.primaryColor, color: "#fff", borderRadius: `${theme.borderRadius}px` }}>
                <EditableText regionKey="contact.submitBtn" fallback="Send Message" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );

  return (
    <main
      className="min-h-screen selection:bg-black/10 dark:selection:bg-white/10 flex flex-col"
      style={{ fontFamily: theme.fontFamily, backgroundColor: theme.backgroundColor }}
    >
      <script
        src="https://upload-widget.cloudinary.com/global/all.js"
        async
      ></script>

      <Navbar />

      <div className="flex-1 flex flex-col w-full max-w-full overflow-hidden">
        {activePage === "home" && <HomeView />}
        {activePage === "about" && <AboutView />}
        {activePage === "contact" && <ContactView />}
      </div>

      <Footer />

      <style>{`
        html { scroll-behavior: smooth; }
        [contenteditable]:focus { outline: none; background: rgba(125, 125, 125, 0.05); border-radius: 4px; box-shadow: 0 0 0 2px rgba(125, 125, 125, 0.2); }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-in-from-bottom-4 { from { transform: translateY(2rem); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes zoom-in-95 { from { transform: scale(0.97); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-in { animation-duration: 0.6s; animation-fill-mode: both; animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1); }
        .fade-in { animation-name: fade-in; }
        .slide-in-from-bottom-4 { animation-name: slide-in-from-bottom-4; }
        .zoom-in-95 { animation-name: zoom-in-95; }
      `}</style>
    </main>
  );
}





