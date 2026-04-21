"use client";

import React, { useState } from "react";
import Script from "next/script";
import {
  useWebsiteBuilderStore,
  useRegionValue,
} from "@/store/useWebsiteBuilderStore";
import { useThemeStore } from "@/store/useThemeStore";

/**
 * PRODUCTION-SAFE TEMPLATE FOR clyraweb
 * Built with internal routing, dynamic theme support, and Cloudinary integration.
 * Topic: Course Seller (Template 39)
 * * NOTE: Switched from Next.js Script to native script tag for compatibility 
 * within the builder environment.
 */



export const template39Meta = {
  id: "business/template39",
  name: "Course Seller Academy",
  image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=1600&auto=format&fit=crop",
};

type TemplateProps = {
  editableData?: any;
  isPublished?: boolean;
};

const getNestedValue = (obj: any, path: string) => {
  return path.split(".").reduce((acc: any, part: string) => acc && acc[part], obj);
};

export default function Template39({ editableData, isPublished = false }: TemplateProps) {
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

  const Section = ({ children, id, bgType = "primary" }: any) => (
    <section
      id={id}
      style={{
        padding: `${theme.sectionSpacing}px 24px`,
        backgroundColor: bgType === "primary" ? theme.backgroundColor : theme.secondaryColor,
        color: theme.textColor,
      }}
      className="w-full flex justify-center overflow-hidden min-w-0"
    >
      <div className="w-full max-w-7xl">{children}</div>
    </section>
  );

  const Navbar = () => (
    <nav
      className="sticky top-0 w-full z-40 backdrop-blur-xl border-b transition-all"
      style={{
        backgroundColor: `${theme.backgroundColor}E6`,
        borderColor: `${theme.textColor}15`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4 overflow-hidden min-w-0">
        <div className="flex items-center gap-3 min-w-0 flex-shrink-0">
          <EditableImg
            regionKey="global.logo"
            fallback="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=100&h=100&fit=crop"
            className="w-10 h-10 object-cover shadow-sm"
            style={{ borderRadius: `${theme.borderRadius}px` }}
          />
          <EditableText
            regionKey="global.brand"
            fallback="EduMaster"
            className="font-extrabold text-xl tracking-tight whitespace-nowrap"
          />
        </div>

        <div className="hidden md:flex items-center justify-center gap-8 px-4 flex-1">
          {["Home", "About", "Contact"].map((page) => (
            <button
              key={page}
              onClick={() => setActivePage(page.toLowerCase() as any)}
              className={`text-sm font-semibold transition-all hover:-translate-y-0.5 ${activePage === page.toLowerCase() ? "" : "opacity-60 hover:opacity-100"
                }`}
              style={{ color: activePage === page.toLowerCase() ? theme.primaryColor : theme.textColor }}
            >
              {page}
            </button>
          ))}
        </div>

        <div className="flex-shrink-0">
          <button
            className="px-6 py-2.5 font-bold text-sm shadow-lg hover:shadow-xl transition-all active:scale-95"
            style={{
              backgroundColor: theme.primaryColor,
              color: "#fff",
              borderRadius: `${theme.borderRadius}px`,
            }}
          >
            <EditableText regionKey="global.navCta" fallback="Get Access" />
          </button>
        </div>
      </div>
    </nav>
  );

  const Footer = () => (
    <footer
      className="py-16 px-4 sm:px-6 lg:px-8 border-t w-full max-w-full overflow-hidden min-w-0"
      style={{
        backgroundColor: theme.secondaryColor,
        color: theme.textColor,
        borderColor: `${theme.textColor}10`,
      }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
        <div className="space-y-4">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <EditableImg
              regionKey="global.logo"
              fallback="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=100&h=100&fit=crop"
              className="w-8 h-8 object-cover"
              style={{ borderRadius: `${theme.borderRadius}px` }}
            />
            <EditableText regionKey="global.brand" fallback="EduMaster" className="font-extrabold text-lg" />
          </div>
          <EditableText
            as="p"
            regionKey="footer.desc"
            fallback="Empowering creators and students to build the future through accessible, world-class education."
            className="text-sm opacity-70 leading-relaxed block max-w-sm mx-auto md:mx-0"
          />
        </div>
        <div className="flex flex-col gap-4">
          <h4 className="font-bold tracking-widest text-xs opacity-50 uppercase">Navigation</h4>
          {["Home", "About", "Contact"].map((p) => (
            <button key={p} onClick={() => setActivePage(p.toLowerCase() as any)} className="hover:underline text-sm w-fit mx-auto md:mx-0 font-medium">
              {p}
            </button>
          ))}
        </div>
        <div className="space-y-4">
          <h4 className="font-bold tracking-widest text-xs opacity-50 uppercase">Connect</h4>
          <EditableText regionKey="footer.email" fallback="hello@edumaster.com" className="text-sm block font-medium" />
          <EditableText regionKey="footer.copy" fallback="© 2024 EduMaster. All rights reserved." className="text-xs opacity-40 block pt-4" />
        </div>
      </div>
    </footer>
  );

  // --- PAGE VIEWS ---
  const HomeView = () => (
    <div className="animate-in fade-in duration-700 w-full max-w-full overflow-hidden min-w-0 flex flex-col">
      <Section id="hero" bgType="primary">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-6 md:space-y-8 text-center lg:text-left">
            <div className="inline-block px-4 py-1.5 shadow-sm text-xs font-bold uppercase tracking-widest mb-2" style={{ backgroundColor: theme.secondaryColor, color: theme.primaryColor, borderRadius: `${theme.borderRadius}px` }}>
              <EditableText regionKey="hero.badge" fallback="Top Rated Academy" />
            </div>
            <EditableText
              as="h1"
              regionKey="hero.title"
              fallback="Unlock Your Potential with Expert-Led Courses."
              className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight block break-words"
            />
            <EditableText
              as="p"
              regionKey="hero.subtitle"
              fallback="Join thousands of students mastering high-income skills today. Practical, project-based learning designed for real-world success."
              className="text-lg md:text-xl opacity-70 leading-relaxed block max-w-xl mx-auto lg:mx-0"
            />
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <button
                className="px-8 py-4 font-bold text-sm shadow-xl hover:-translate-y-1 transition-all"
                style={{ backgroundColor: theme.primaryColor, color: "#fff", borderRadius: `${theme.borderRadius}px` }}
              >
                <EditableText regionKey="hero.btnPrimary" fallback="Browse Courses" />
              </button>
              <button
                className="px-8 py-4 font-bold text-sm shadow-sm border hover:bg-opacity-50 transition-all"
                style={{ backgroundColor: "transparent", color: theme.textColor, borderColor: `${theme.textColor}20`, borderRadius: `${theme.borderRadius}px` }}
              >
                <EditableText regionKey="hero.btnSecondary" fallback="Watch Intro" />
              </button>
            </div>
          </div>
          <div className="relative w-full px-4 sm:px-0">
            <div className="absolute inset-0 transform translate-x-4 translate-y-4 opacity-20" style={{ backgroundColor: theme.primaryColor, borderRadius: `${theme.borderRadius * 2}px` }}></div>
            <EditableImg
              regionKey="hero.img"
              fallback="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1600&auto=format&fit=crop"
              className="w-full aspect-square md:aspect-[4/3] object-cover shadow-2xl relative z-10"
              style={{ borderRadius: `${theme.borderRadius * 2}px` }}
            />
          </div>
        </div>
      </Section>

      <Section id="courses" bgType="secondary">
        <div className="space-y-16">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <EditableText as="h2" regionKey="courses.title" fallback="Featured Programs" className="text-3xl md:text-5xl font-black tracking-tight block" />
            <EditableText as="p" regionKey="courses.subtitle" fallback="Carefully crafted curriculum to take you from beginner to professional." className="text-base md:text-lg opacity-70 block" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <CourseCard
              id="1"
              category="DESIGN"
              title="UI/UX Masterclass"
              desc="Learn to design beautiful, user-centric interfaces from scratch."
              price="$99.00"
              fallbackImg="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop"
            />
            <CourseCard
              id="2"
              category="DEVELOPMENT"
              title="Full-Stack React App"
              desc="Build modern web applications using the latest web technologies."
              price="$149.00"
              fallbackImg="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop"
            />
            <CourseCard
              id="3"
              category="MARKETING"
              title="Digital Growth Strategy"
              desc="Master SEO, content, and paid ads to scale any digital business."
              price="$79.00"
              fallbackImg="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop"
            />
          </div>
        </div>
      </Section>
    </div>
  );

  const CourseCard = ({ id, category, title, desc, price, fallbackImg }: any) => (
    <div className="group flex flex-col shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden" style={{ borderRadius: `${theme.borderRadius}px`, backgroundColor: theme.backgroundColor }}>
      <EditableImg
        regionKey={`course${id}.img`}
        fallback={fallbackImg}
        className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div className="p-6 md:p-8 flex-1 flex flex-col gap-4">
        <EditableText regionKey={`course${id}.category`} fallback={category} className="text-xs font-bold uppercase tracking-widest opacity-60" style={{ color: theme.primaryColor }} />
        <EditableText as="h3" regionKey={`course${id}.title`} fallback={title} className="text-xl font-bold block" />
        <EditableText as="p" regionKey={`course${id}.desc`} fallback={desc} className="text-sm opacity-70 block flex-1" />
        <div className="flex items-center justify-between pt-4 mt-auto border-t" style={{ borderColor: `${theme.textColor}10` }}>
          <EditableText regionKey={`course${id}.price`} fallback={price} className="font-black text-lg" />
          <span className="text-sm font-bold hover:underline cursor-pointer" style={{ color: theme.primaryColor }}>Enroll &rarr;</span>
        </div>
      </div>
    </div>
  );

  const AboutView = () => (
    <div className="animate-in slide-in-from-bottom-4 duration-700 w-full max-w-full overflow-hidden min-w-0 flex flex-col">
      <Section id="about" bgType="primary">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="relative order-2 lg:order-1 px-4 sm:px-0">
            <EditableImg
              regionKey="about.img"
              fallback="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1000&fit=crop"
              className="w-full aspect-square md:aspect-[4/5] object-cover shadow-2xl relative z-10"
              style={{ borderRadius: `${theme.borderRadius * 2}px` }}
            />
            <div className="absolute -bottom-6 -right-6 p-6 shadow-xl z-20 backdrop-blur-xl" style={{ backgroundColor: `${theme.secondaryColor}E6`, borderRadius: `${theme.borderRadius}px` }}>
              <EditableText regionKey="about.stats" fallback="10k+ Students" className="font-black text-2xl block" />
              <EditableText regionKey="about.statsLabel" fallback="Trained Globally" className="text-sm opacity-70 block" />
            </div>
          </div>
          <div className="space-y-6 md:space-y-8 order-1 lg:order-2 text-center lg:text-left">
            <EditableText as="h2" regionKey="about.title" fallback="Meet Your Instructor" className="text-4xl md:text-5xl font-black tracking-tight block" />
            <EditableText
              as="p"
              regionKey="about.desc"
              fallback="With over 10 years of industry experience, I built EduMaster to bridge the gap between theoretical knowledge and practical, career-defining skills."
              className="text-lg md:text-xl opacity-70 leading-relaxed block"
            />
            <div className="grid grid-cols-2 gap-6 pt-4 border-t" style={{ borderColor: `${theme.textColor}15` }}>
              <div>
                <EditableText as="h4" regionKey="about.feat1Title" fallback="Expert Led" className="font-bold text-lg block" />
                <EditableText as="p" regionKey="about.feat1Desc" fallback="Learn from true professionals." className="text-sm opacity-60 block mt-1" />
              </div>
              <div>
                <EditableText as="h4" regionKey="about.feat2Title" fallback="Lifetime Access" className="font-bold text-lg block" />
                <EditableText as="p" regionKey="about.feat2Desc" fallback="Learn at your own pace." className="text-sm opacity-60 block mt-1" />
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
      className="min-h-screen selection:bg-blue-500 selection:text-white flex flex-col w-full max-w-full overflow-hidden min-w-0"
      style={{ fontFamily: theme.fontFamily, backgroundColor: theme.backgroundColor }}
    >
      {/* Cloudinary native script for standard web environment compatibility */}
      <script src="https://upload-widget.cloudinary.com/global/all.js" async />

      <Navbar />

      <div className="flex-grow flex flex-col w-full max-w-full overflow-hidden min-w-0">
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
          max-width: 100vw;
          overflow-x: hidden;
          scroll-behavior: smooth; 
        }
        [contenteditable]:focus { 
          outline: none; 
          background: rgba(125, 125, 125, 0.1); 
        }
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





