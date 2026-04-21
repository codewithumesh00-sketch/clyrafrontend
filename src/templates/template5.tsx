"use client";

import React, { useState } from "react";
import Script from "next/script";
import {
  useWebsiteBuilderStore,
  useRegionValue,
} from "@/store/useWebsiteBuilderStore";
import { useThemeStore } from "@/store/useThemeStore";

export const template5Meta = {
  id: "fitness/fitcore",
  name: "Fitcore",
  image:
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1600&auto=format&fit=crop",
};

type TemplateProps = {
  editableData?: any;
  isPublished?: boolean;
};

const getNestedValue = (obj: any, path: string) => {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
};

export default function Template5({ editableData, isPublished = false }: TemplateProps) {
  const [activePage, setActivePage] = useState<"home" | "programs" | "about" | "blog" | "contact">("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  // --- EDITABLE COMPONENTS ---
  const EditableText = ({ regionKey, fallback, as: Tag = "span", className = "", style = {} }: any) => {
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
        className={`focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-1 -mx-1 transition-all ${className}`}
        style={style}
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
        className={`cursor-pointer transition-all duration-500 ${className}`}
        onDoubleClick={(e) => {
          e.stopPropagation();
          handleImageUpload(regionKey);
        }}
      />
    );
  };

  // --- LAYOUT COMPONENTS ---
  const Navbar = () => (
    <nav
      className="fixed top-0 w-full z-50 backdrop-blur-xl border-b border-white/5"
      style={{ backgroundColor: `${theme.backgroundColor}CC` }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4 flex-shrink-0">
          <EditableText
            regionKey="global.brand"
            fallback="FITCORE."
            className="text-2xl font-black italic tracking-tighter"
            style={{ color: theme.primaryColor }}
          />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          {[
            { label: "Home", key: "home" },
            { label: "Programs", key: "programs" },
            { label: "About", key: "about" },
            { label: "Blog", key: "blog" },
            { label: "Contact", key: "contact" }
          ].map((page) => (
            <button
              key={page.key}
              onClick={() => {
                setActivePage(page.key as any);
                setMobileMenuOpen(false);
              }}
              className="text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:opacity-100"
              style={{
                color: theme.textColor,
                opacity: activePage === page.key ? 1 : 0.4
              }}
            >
              {page.label}
            </button>
          ))}
        </div>

        {/* Desktop CTA + Edit Button */}
        <div className="hidden lg:flex items-center gap-4">
          <button
            className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest transition-transform active:scale-95"
            style={{
              backgroundColor: theme.primaryColor,
              color: "#fff",
              borderRadius: `${theme.borderRadius}px`
            }}
            onClick={() => {
              setActivePage("contact");
              setMobileMenuOpen(false);
            }}
          >
            <EditableText regionKey="global.cta" fallback="JOIN FITCORE" />
          </button>

          {/* ✅ EDIT BUTTON - DESKTOP */}
          {!isPublished && (
            <button
              onClick={() => window.location.href = "/editor"}
              className="px-4 py-2.5 text-[10px] font-black uppercase tracking-widest border transition-transform active:scale-95"
              style={{
                borderColor: theme.primaryColor,
                color: theme.primaryColor,
                borderRadius: `${theme.borderRadius}px`
              }}
            >
              EDIT
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ color: theme.textColor }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-20 left-0 right-0 backdrop-blur-xl border-b border-white/5 py-6 px-4" style={{ backgroundColor: `${theme.backgroundColor}F5` }}>
          <div className="flex flex-col gap-4">
            {[
              { label: "Home", key: "home" },
              { label: "Programs", key: "programs" },
              { label: "About", key: "about" },
              { label: "Blog", key: "blog" },
              { label: "Contact", key: "contact" }
            ].map((page) => (
              <button
                key={page.key}
                onClick={() => {
                  setActivePage(page.key as any);
                  setMobileMenuOpen(false);
                }}
                className="text-left text-[10px] font-black uppercase tracking-[0.2em] py-2"
                style={{
                  color: theme.textColor,
                  opacity: activePage === page.key ? 1 : 0.4
                }}
              >
                {page.label}
              </button>
            ))}

            <button
              className="w-full mt-2 px-6 py-2.5 text-[10px] font-black uppercase tracking-widest"
              style={{
                backgroundColor: theme.primaryColor,
                color: "#fff",
                borderRadius: `${theme.borderRadius}px`
              }}
              onClick={() => {
                setActivePage("contact");
                setMobileMenuOpen(false);
              }}
            >
              <EditableText regionKey="global.cta" fallback="JOIN FITCORE" />
            </button>

            {/* ✅ EDIT BUTTON - MOBILE */}
            {!isPublished && (
              <button
                onClick={() => {
                  window.location.href = "/editor";
                  setMobileMenuOpen(false);
                }}
                className="w-full mt-2 px-6 py-2.5 text-[10px] font-black uppercase tracking-widest border"
                style={{
                  borderColor: theme.primaryColor,
                  color: theme.primaryColor,
                  borderRadius: `${theme.borderRadius}px`
                }}
              >
                EDIT WEBSITE
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );

  const HomeView = () => (
    <div className="animate-in fade-in duration-1000">
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <EditableImg
            regionKey="home.heroBg"
            fallback="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2000&auto=format&fit=crop"
            className="w-full h-full object-cover opacity-30 grayscale scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <EditableText
            as="h1"
            regionKey="home.heroTitle"
            fallback="BUILD YOUR BEST SELF."
            className="text-6xl md:text-9xl font-black italic tracking-tighter leading-[0.85] mb-6 block uppercase"
            style={{ color: theme.textColor }}
          />
          <EditableText
            as="p"
            regionKey="home.heroSub"
            fallback="Personalized fitness coaching for real results. Train smarter, live stronger, transform completely."
            className="text-lg md:text-xl opacity-60 max-w-2xl mx-auto mb-12 block font-medium"
          />
          <button
            className="px-14 py-6 font-black uppercase tracking-tighter text-xl italic hover:brightness-125 transition-all"
            style={{ backgroundColor: theme.primaryColor, color: "#fff" }}
            onClick={() => setActivePage("programs")}
          >
            <EditableText regionKey="home.heroBtn" fallback="EXPLORE PROGRAMS" />
          </button>
        </div>
      </section>

      <section className="py-24 border-y border-white/5" style={{ backgroundColor: theme.secondaryColor }}>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="space-y-1">
              <EditableText regionKey={`home.statVal${i}`} fallback={i === 1 ? "500+" : i === 2 ? "98%" : i === 3 ? "24/7" : "5★"} className="text-4xl md:text-6xl font-black italic block" style={{ color: theme.primaryColor }} />
              <EditableText regionKey={`home.statLabel${i}`} fallback={i === 1 ? "CLIENTS" : i === 2 ? "SUCCESS" : i === 3 ? "SUPPORT" : "RATING"} className="text-[10px] font-black tracking-[0.2em] opacity-30 block" />
            </div>
          ))}
        </div>
      </section>

      {/* Featured Programs Preview */}
      <section className="py-24" style={{ backgroundColor: theme.backgroundColor }}>
        <div className="max-w-7xl mx-auto px-4">
          <EditableText
            as="h2"
            regionKey="home.featuredTitle"
            fallback="POPULAR PROGRAMS"
            className="text-4xl md:text-5xl font-black italic tracking-tighter text-center mb-16 block uppercase"
          />
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="group cursor-pointer" onClick={() => setActivePage("programs")}>
                <div className="relative overflow-hidden mb-4">
                  <EditableImg
                    regionKey={`home.programImg${i}`}
                    fallback={`https://images.unsplash.com/photo-${i === 1 ? '1571019613454-1cb2f99b2d8b' : i === 2 ? '1534438327276-14e5300c3a48' : '1517836357463-d25dfeac3438'}?q=80&w=800&auto=format&fit=crop`}
                    className="w-full aspect-[4/3] object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <EditableText regionKey={`home.programTitle${i}`} fallback={i === 1 ? "Strength Builder" : i === 2 ? "Fat Loss Accelerator" : "Mobility Master"} className="text-xl font-black italic block mb-2" />
                <EditableText regionKey={`home.programDesc${i}`} fallback="Transform your physique with science-based training." className="text-sm opacity-60 block" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );

  const ProgramsView = () => (
    <div className="pt-32 pb-24 animate-in slide-in-from-bottom-4 duration-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <EditableText
          as="h1"
          regionKey="programs.title"
          fallback="OUR PROGRAMS"
          className="text-5xl md:text-8xl font-black italic tracking-tighter leading-none block uppercase text-center mb-16"
        />

        <div className="grid md:grid-cols-2 gap-12">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="group border border-white/10 rounded-lg overflow-hidden hover:border-white/30 transition-all" style={{ borderRadius: `${theme.borderRadius}px` }}>
              <EditableImg
                regionKey={`programs.img${i}`}
                fallback={`https://images.unsplash.com/photo-${i === 1 ? '1571019613454-1cb2f99b2d8b' : i === 2 ? '1534438327276-14e5300c3a48' : i === 3 ? '1517836357463-d25dfeac3438' : '1594381898411-846e7d193883'}?q=80&w=800&auto=format&fit=crop`}
                className="w-full h-48 object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
              />
              <div className="p-6 space-y-4">
                <EditableText regionKey={`programs.title${i}`} fallback={i === 1 ? "Strength Builder" : i === 2 ? "Fat Loss Accelerator" : i === 3 ? "Mobility Master" : "Athletic Performance"} className="text-2xl font-black italic block" />
                <EditableText regionKey={`programs.desc${i}`} fallback="A comprehensive program designed to help you achieve your fitness goals with personalized coaching and proven methods." className="opacity-60 block" />
                <div className="flex items-center gap-4 pt-4">
                  <EditableText regionKey={`programs.duration${i}`} fallback="8 Weeks" className="text-sm font-bold" style={{ color: theme.primaryColor }} />
                  <EditableText regionKey={`programs.level${i}`} fallback="All Levels" className="text-sm opacity-60" />
                </div>
                <button
                  className="px-6 py-2 text-[10px] font-black uppercase tracking-widest mt-4"
                  style={{ backgroundColor: theme.primaryColor, color: "#fff", borderRadius: `${theme.borderRadius}px` }}
                  onClick={() => setActivePage("contact")}
                >
                  <EditableText regionKey={`programs.cta${i}`} fallback="GET STARTED" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const AboutView = () => (
    <div className="pt-32 pb-24 animate-in slide-in-from-bottom-4 duration-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="relative group">
            <div className="absolute -top-6 -left-6 w-32 h-32 z-0 border-t-[12px] border-l-[12px]" style={{ borderColor: theme.primaryColor }} />
            <EditableImg
              regionKey="about.coachImg"
              fallback="https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=1000&auto=format&fit=crop"
              className="relative z-10 w-full aspect-[4/5] object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000"
            />
          </div>
          <div className="space-y-10">
            <EditableText
              as="h2"
              regionKey="about.title"
              fallback="THE FITCORE METHOD."
              className="text-5xl md:text-8xl font-black italic tracking-tighter leading-none block uppercase"
            />
            <EditableText
              as="p"
              regionKey="about.desc"
              fallback="I bridge the gap between sports science and practical application. My programs are built on progressive overload, metabolic conditioning, and data-driven nutrition. We don't guess; we measure results."
              className="text-xl opacity-60 leading-relaxed block font-light"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-10 border-t border-white/10">
              {["PERSONALIZED", "SCIENCE-BASED", "RESULTS-DRIVEN", "24/7 SUPPORT"].map((pill, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="w-1.5 h-6" style={{ backgroundColor: theme.primaryColor }} />
                  <EditableText regionKey={`about.pill${idx}`} fallback={pill} className="font-black italic tracking-widest text-sm opacity-90" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const BlogView = () => (
    <div className="pt-32 pb-24 animate-in slide-in-from-bottom-4 duration-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <EditableText
          as="h1"
          regionKey="blog.title"
          fallback="FITCORE INSIGHTS"
          className="text-5xl md:text-8xl font-black italic tracking-tighter leading-none block uppercase text-center mb-16"
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <article key={i} className="group cursor-pointer">
              <div className="relative overflow-hidden mb-4">
                <EditableImg
                  regionKey={`blog.img${i}`}
                  fallback={`https://images.unsplash.com/photo-${i % 2 === 0 ? '1571019613454-1cb2f99b2d8b' : '1534438327276-14e5300c3a48'}?q=80&w=800&auto=format&fit=crop`}
                  className="w-full aspect-[16/9] object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                />
              </div>
              <EditableText regionKey={`blog.date${i}`} fallback="Jan 15, 2024" className="text-xs opacity-40 font-bold uppercase tracking-wider block mb-2" />
              <EditableText regionKey={`blog.headline${i}`} fallback={i === 1 ? "5 Mistakes Killing Your Gains" : i === 2 ? "Nutrition Myths Debunked" : i === 3 ? "Recovery: The Secret Weapon" : i === 4 ? "Home Workout Essentials" : i === 5 ? "Mindset for Success" : "Progressive Overload Explained"} className="text-xl font-black italic block mb-3 group-hover:opacity-80 transition-opacity" />
              <EditableText regionKey={`blog.excerpt${i}`} fallback="Discover the science-backed strategies that actually work for building strength and losing fat." className="text-sm opacity-60 line-clamp-3" />
            </article>
          ))}
        </div>

        <div className="text-center mt-16">
          <button className="px-8 py-3 text-[10px] font-black uppercase tracking-widest border" style={{ borderColor: theme.primaryColor, color: theme.primaryColor, borderRadius: `${theme.borderRadius}px` }}>
            <EditableText regionKey="blog.loadMore" fallback="LOAD MORE ARTICLES" />
          </button>
        </div>
      </div>
    </div>
  );

  const ContactView = () => {
    const [formData, setFormData] = React.useState({ name: "", email: "", phone: "", message: "" });
    const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!formspreeEndpoint) {
        alert("⚠️ Form is not connected. Please add your Formspree endpoint in the editor.");
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
        <div className="w-full py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <EditableText as="h1" regionKey="contact.title" fallback="Let's Connect" className="text-5xl md:text-6xl font-black tracking-tighter block mb-6" />
            <EditableText as="p" regionKey="contact.subtitle" fallback="Ready to transform your fitness journey? Reach out and let's start the conversation." className="text-xl opacity-70 block" />
          </div>
        </div>

        <div className="w-full py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16">
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold mb-4">Visit Us</h3>
                  <EditableText regionKey="contact.address" fallback="123 Fitness Avenue, Suite 100, Los Angeles, CA 90001" className="opacity-70 block" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4">Contact Info</h3>
                  <EditableText regionKey="contact.email" fallback="hello@fitcore.com" className="opacity-70 block mb-2" />
                  <EditableText regionKey="contact.phone" fallback="+1 (555) 234-5678" className="opacity-70 block" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4">Follow Us</h3>
                  <div className="flex gap-4">
                    {["Instagram", "YouTube", "TikTok", "Strava"].map((social) => (
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
                  placeholder="Your Phone (Optional)"
                  className="w-full p-4 bg-transparent border-b outline-none focus:border-blue-500 transition-colors"
                  style={{ borderColor: `${theme.textColor}20` }}
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
                {status === "success" && <p className="text-green-500 text-sm font-medium animate-in fade-in">✓ Message sent successfully!</p>}
                {status === "error" && <p className="text-red-500 text-sm font-medium animate-in fade-in">❌ Something went wrong. Please try again.</p>}
                {!formspreeEndpoint && !isPublished && <p className="text-amber-500 text-xs">⚠️ Connect your Formspree endpoint in the editor</p>}
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <main
      className="w-full min-h-screen overflow-x-hidden selection:bg-blue-600 selection:text-white"
      style={{
        backgroundColor: theme.backgroundColor,
        color: theme.textColor,
        fontFamily: theme.fontFamily
      }}
    >
      <Script
        src="https://upload-widget.cloudinary.com/global/all.js"
        strategy="lazyOnload"
      />

      <Navbar />

      <div className="w-full">
        {isPublished ? (
          <>
          <div id="clyra-page-home" style={{display: activePage === 'home' ? 'block' : 'none'}}><HomeView /></div>
          <div id="clyra-page-programs" style={{display: activePage === 'programs' ? 'block' : 'none'}}><ProgramsView /></div>
          <div id="clyra-page-about" style={{display: activePage === 'about' ? 'block' : 'none'}}><AboutView /></div>
          <div id="clyra-page-blog" style={{display: activePage === 'blog' ? 'block' : 'none'}}><BlogView /></div>
          <div id="clyra-page-contact" style={{display: activePage === 'contact' ? 'block' : 'none'}}><ContactView /></div>
          </>
        ) : (
          <>
          {activePage === "home" && <HomeView />}
          {activePage === "programs" && <ProgramsView />}
          {activePage === "about" && <AboutView />}
          {activePage === "blog" && <BlogView />}
          {activePage === "contact" && <ContactView />}
          </>
        )}
      </div>

      <footer className="py-20 border-t border-white/5 bg-black/40">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-12">
          <EditableText regionKey="global.brand" fallback="FITCORE." className="text-4xl font-black italic tracking-tighter" style={{ color: theme.primaryColor }} />
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {["INSTAGRAM", "YOUTUBE", "TIKTOK", "STRAVA"].map(social => (
              <EditableText key={social} regionKey={`footer.${social}`} fallback={social} className="text-[10px] font-black tracking-[0.4em] opacity-40 hover:opacity-100 cursor-pointer transition-opacity" />
            ))}
          </div>
          <EditableText regionKey="footer.copy" fallback="© 2024 FITCORE. TRAIN SMART. LIVE STRONG." className="text-[10px] font-bold tracking-widest opacity-20" />
        </div>
      </footer>

      <style>{`
        body { background-color: #0a0a0a; margin: 0; }
        [contenteditable]:focus { outline: none; background: rgba(255,255,255,0.05); }
        .animate-in { animation: 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-in-from-bottom-4 { from { transform: translateY(3rem); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes zoom-in-95 { from { transform: scale(0.98); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .fade-in { animation-name: fade-in; }
        .slide-in-from-bottom-4 { animation-name: slide-in-from-bottom-4; }
        .zoom-in-95 { animation-name: zoom-in-95; }
        .line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </main>
  );
}