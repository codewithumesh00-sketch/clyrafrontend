"use client";

import React, { useState, useCallback } from "react";
import Script from "next/script";
import { useWebsiteBuilderStore, useRegionValue } from "@/store/useWebsiteBuilderStore";
import { useThemeStore } from "@/store/useThemeStore";

export const template35Meta = {
  id: "business/template35",
  name: "Startup Pitch",
  image: "https://images.unsplash.com/photo-1556761175-5973dc0f32d7?q=80&w=1600&auto=format&fit=crop",
};

type TemplateProps = {
  editableData?: any;
  isPublished?: boolean;
};

const getNestedValue = (obj: any, path: string) => {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
};

export default function Template40({ editableData, isPublished = false }: TemplateProps) {
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
        className={`cursor-pointer transition-transform duration-300 hover:scale-[1.02] hover:opacity-90 max-w-full ${className}`}
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
        padding: `${theme.sectionSpacing}px 0`,
        backgroundColor: bgType === "primary" ? theme.backgroundColor : theme.secondaryColor,
        color: theme.textColor,
      }}
      className="w-full flex justify-center overflow-hidden px-4 sm:px-6 lg:px-8"
    >
      <div className="w-full max-w-7xl min-w-0">{children}</div>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-24 flex items-center justify-between gap-4 overflow-hidden min-w-0">
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <EditableImg
            regionKey="global.logo"
            fallback="https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=200&h=200&fit=crop"
            className="w-12 h-12 object-cover rounded-xl shadow-sm"
          />
          <EditableText
            regionKey="global.brand"
            fallback="NovaTech AI"
            className="font-black text-2xl tracking-tight whitespace-nowrap hidden sm:block"
          />
        </div>

        <div className="hidden md:flex items-center gap-8 px-4 bg-black/5 dark:bg-white/5 rounded-full py-2">
          {["Home", "About", "Contact"].map((page) => (
            <button
              key={page}
              onClick={() => setActivePage(page.toLowerCase() as any)}
              className={`text-sm font-bold transition-all capitalize px-4 py-2 rounded-full ${activePage === page.toLowerCase() ? "shadow-md" : "opacity-60 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5"
                }`}
              style={{
                backgroundColor: activePage === page.toLowerCase() ? theme.backgroundColor : "transparent",
                color: theme.textColor,
              }}
            >
              {page}
            </button>
          ))}
        </div>

        <div className="flex-shrink-0 flex gap-2 sm:gap-4">
          <button
            onClick={() => setActivePage("contact")}
            className="px-6 py-3 font-bold text-sm transition-transform hover:-translate-y-1 active:scale-95 shadow-lg hidden sm:block"
            style={{
              backgroundColor: theme.primaryColor,
              color: "#fff",
              borderRadius: `${theme.borderRadius}px`,
            }}
          >
            <EditableText regionKey="global.navCta" fallback="Invest Now" />
          </button>
          <div className="md:hidden flex gap-2">
            {["Home", "About", "Contact"].map((page) => (
              <button
                key={page}
                onClick={() => setActivePage(page.toLowerCase() as any)}
                className="text-xs font-bold capitalize opacity-60 hover:opacity-100"
                style={{ color: activePage === page.toLowerCase() ? theme.primaryColor : theme.textColor }}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );

  const Footer = () => (
    <footer
      className="py-16 border-t px-4 sm:px-6 lg:px-8"
      style={{
        backgroundColor: theme.secondaryColor,
        color: theme.textColor,
        borderColor: `${theme.textColor}10`,
      }}
    >
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 text-center md:text-left min-w-0">
        <div className="space-y-6 md:col-span-2">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <EditableImg
              regionKey="global.logo"
              fallback="https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=200&h=200&fit=crop"
              className="w-10 h-10 rounded-xl"
            />
            <EditableText regionKey="global.brand" fallback="NovaTech AI" className="font-black text-xl" />
          </div>
          <EditableText
            as="p"
            regionKey="footer.desc"
            fallback="Empowering the next generation of digital infrastructure through advanced machine learning and scalable architectures."
            className="text-sm opacity-60 leading-relaxed block max-w-sm mx-auto md:mx-0"
          />
        </div>
        <div className="flex flex-col gap-4">
          <h4 className="font-bold uppercase tracking-widest text-xs opacity-40">Company</h4>
          {["Home", "About", "Contact"].map((p) => (
            <button key={p} onClick={() => setActivePage(p.toLowerCase() as any)} className="hover:opacity-60 text-sm font-semibold transition-opacity w-fit mx-auto md:mx-0">
              {p}
            </button>
          ))}
        </div>
        <div className="space-y-4">
          <h4 className="font-bold uppercase tracking-widest text-xs opacity-40">Investor Relations</h4>
          <EditableText regionKey="footer.email" fallback="investors@novatech.ai" className="text-sm font-bold block" />
          <EditableText regionKey="footer.phone" fallback="+1 (800) 555-0199" className="text-sm font-bold block" />
          <EditableText regionKey="footer.copy" fallback="© 2026 NovaTech AI Inc. All rights reserved." className="text-xs opacity-40 block pt-4" />
        </div>
      </div>
    </footer>
  );

  const HomeView = () => (
    <div className="animate-in fade-in duration-700 w-full min-w-0">
      {/* Hero Pitch Section */}
      <Section id="pitch-hero" bgType="primary">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-8 min-w-0">
          <div
            className="px-4 py-2 font-bold text-xs uppercase tracking-widest mb-4 inline-block"
            style={{ backgroundColor: `${theme.primaryColor}20`, color: theme.primaryColor, borderRadius: '100px' }}
          >
            <EditableText regionKey="home.heroBadge" fallback="Seed Round Open" />
          </div>
          <EditableText
            as="h1"
            regionKey="home.heroTitle"
            fallback="The Future of Autonomous Scale."
            className="text-5xl sm:text-6xl md:text-8xl font-black leading-[1.05] tracking-tighter block w-full"
          />
          <EditableText
            as="p"
            regionKey="home.heroSubtitle"
            fallback="We are building the intelligent layer for enterprise operations. Disrupting a $50B market with 10x faster deployments."
            className="text-lg sm:text-2xl opacity-70 leading-relaxed block max-w-2xl w-full"
          />
          <div className="pt-4 flex flex-wrap gap-4 justify-center w-full">
            <button
              onClick={() => setActivePage("contact")}
              className="px-8 py-4 font-bold text-lg transition-transform hover:-translate-y-1 shadow-xl w-full sm:w-auto"
              style={{ backgroundColor: theme.primaryColor, color: "#fff", borderRadius: `${theme.borderRadius}px` }}
            >
              <EditableText regionKey="home.ctaPrimary" fallback="View Deck" />
            </button>
            <button
              onClick={() => setActivePage("about")}
              className="px-8 py-4 font-bold text-lg transition-transform hover:-translate-y-1 w-full sm:w-auto"
              style={{ backgroundColor: `${theme.textColor}10`, color: theme.textColor, borderRadius: `${theme.borderRadius}px` }}
            >
              <EditableText regionKey="home.ctaSecondary" fallback="Meet the Team" />
            </button>
          </div>
        </div>

        <div className="mt-20 relative w-full rounded-2xl overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10 pointer-events-none"></div>
          <EditableImg
            regionKey="home.heroImg"
            fallback="https://images.unsplash.com/photo-1551434678-e076c223a692?w=2000&auto=format&fit=crop"
            className="w-full h-[400px] sm:h-[600px] object-cover"
            style={{ borderRadius: `${theme.borderRadius * 2}px` }}
          />
        </div>
      </Section>

      {/* Problem & Solution Section (Canva Style Cards) */}
      <Section id="problem-solution" bgType="secondary">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 min-w-0">
          {/* Problem Card */}
          <div
            className="p-8 sm:p-12 shadow-sm border transition-all hover:shadow-xl"
            style={{ backgroundColor: theme.backgroundColor, borderRadius: `${theme.borderRadius * 2}px`, borderColor: `${theme.textColor}10` }}
          >
            <div className="w-16 h-16 rounded-2xl mb-8 flex items-center justify-center text-3xl shadow-sm" style={{ backgroundColor: '#fee2e2' }}>
              ⚠️
            </div>
            <EditableText as="h3" regionKey="home.problemTitle" fallback="The Problem" className="text-3xl font-black mb-4 block" />
            <EditableText
              as="p"
              regionKey="home.problemDesc"
              fallback="Legacy systems are fragmented, costing enterprises an average of $2M annually in operational inefficiencies and manual data entry."
              className="text-lg opacity-70 leading-relaxed block"
            />
            <div className="mt-8 p-6 rounded-xl" style={{ backgroundColor: `${theme.textColor}05` }}>
              <EditableText as="h4" regionKey="home.problemStat" fallback="85% of companies report bottlenecking." className="font-bold text-xl block" />
            </div>
          </div>

          {/* Solution Card */}
          <div
            className="p-8 sm:p-12 shadow-sm border transition-all hover:shadow-xl relative overflow-hidden"
            style={{ backgroundColor: theme.backgroundColor, borderRadius: `${theme.borderRadius * 2}px`, borderColor: `${theme.textColor}10` }}
          >
            <div
              className="absolute top-0 right-0 w-64 h-64 opacity-10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{ backgroundColor: theme.primaryColor }}
            ></div>
            <div className="w-16 h-16 rounded-2xl mb-8 flex items-center justify-center text-3xl shadow-sm" style={{ backgroundColor: '#dcfce7' }}>
              💡
            </div>
            <EditableText as="h3" regionKey="home.solutionTitle" fallback="Our Solution" className="text-3xl font-black mb-4 block" />
            <EditableText
              as="p"
              regionKey="home.solutionDesc"
              fallback="A unified, AI-driven platform that automates workflows seamlessly, cutting deployment times by 90% and reducing overhead instantly."
              className="text-lg opacity-70 leading-relaxed block"
            />
            <div className="mt-8 p-6 rounded-xl" style={{ backgroundColor: `${theme.primaryColor}15`, color: theme.primaryColor }}>
              <EditableText as="h4" regionKey="home.solutionStat" fallback="10x Faster Deployments Guaranteed." className="font-bold text-xl block" />
            </div>
          </div>
        </div>
      </Section>

      {/* Traction / Market Section */}
      <Section id="traction" bgType="primary">
        <div className="text-center mb-16 max-w-3xl mx-auto min-w-0">
          <EditableText as="h2" regionKey="home.tractionTitle" fallback="Why Now? Traction & Market" className="text-4xl sm:text-5xl font-black tracking-tighter block mb-6" />
          <EditableText
            as="p"
            regionKey="home.tractionSubtitle"
            fallback="The timing is perfect. We have hit product-market fit and are ready to scale rapidly."
            className="text-xl opacity-70 leading-relaxed block"
          />
        </div>

        <div className="grid sm:grid-cols-3 gap-8 min-w-0">
          {[1, 2, 3].map((num) => (
            <div key={num} className="text-center p-8 rounded-2xl" style={{ backgroundColor: theme.secondaryColor }}>
              <EditableText
                as="h3"
                regionKey={`home.stat${num}Value`}
                fallback={num === 1 ? "$5M+" : num === 2 ? "120%" : "45+"}
                className="text-5xl sm:text-6xl font-black block mb-4"
                style={{ color: theme.primaryColor }}
              />
              <EditableText
                as="p"
                regionKey={`home.stat${num}Label`}
                fallback={num === 1 ? "ARR in Year 1" : num === 2 ? "MoM Growth" : "Enterprise Clients"}
                className="text-lg font-bold opacity-80 block uppercase tracking-wide"
              />
            </div>
          ))}
        </div>
      </Section>
    </div>
  );

  const AboutView = () => (
    <div className="animate-in slide-in-from-bottom-4 duration-700 w-full min-w-0">
      <Section id="vision" bgType="primary">
        <div className="grid lg:grid-cols-2 gap-12 sm:gap-20 items-center min-w-0">
          <EditableImg
            regionKey="about.img"
            fallback="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1000&fit=crop"
            className="w-full aspect-square sm:aspect-video lg:aspect-square object-cover shadow-2xl"
            style={{ borderRadius: `${theme.borderRadius * 2}px` }}
          />
          <div className="space-y-8">
            <EditableText as="h2" regionKey="about.title" fallback="Driven by Innovation. Built for Scale." className="text-4xl sm:text-6xl font-black tracking-tighter block leading-tight" />
            <EditableText
              as="p"
              regionKey="about.desc1"
              fallback="Founded in 2024 by ex-FAANG engineers, NovaTech AI was built on a simple premise: enterprise software doesn't have to be clunky."
              className="text-xl opacity-80 leading-relaxed block font-medium"
            />
            <EditableText
              as="p"
              regionKey="about.desc2"
              fallback="We spent two years in stealth building a proprietary engine that learns from organizational behavior. Today, we are proud to back some of the most innovative companies in the Fortune 500."
              className="text-lg opacity-60 leading-relaxed block"
            />
          </div>
        </div>
      </Section>

      <Section id="team" bgType="secondary">
        <div className="text-center mb-16 min-w-0">
          <EditableText as="h2" regionKey="about.teamTitle" fallback="The Founding Team" className="text-4xl sm:text-5xl font-black tracking-tighter block mb-6" />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 min-w-0">
          {[1, 2, 3].map((num) => (
            <div
              key={num}
              className="p-6 rounded-2xl text-center shadow-sm border transition-transform hover:-translate-y-2"
              style={{ backgroundColor: theme.backgroundColor, borderColor: `${theme.textColor}10` }}
            >
              <EditableImg
                regionKey={`about.teamImg${num}`}
                fallback={`https://images.unsplash.com/photo-${num === 1 ? '1560250097-0b93528c311a' : num === 2 ? '1573496359142-b8d87734a5a2' : '1519085360753-af0119f7cbe7'}?w=400&h=400&fit=crop`}
                className="w-32 h-32 mx-auto rounded-full object-cover mb-6 border-4 shadow-md"
                style={{ borderColor: theme.secondaryColor }}
              />
              <EditableText as="h3" regionKey={`about.teamName${num}`} fallback={num === 1 ? "Sarah Jenkins" : num === 2 ? "David Chen" : "Elena Rodriguez"} className="text-2xl font-black block mb-1" />
              <EditableText as="p" regionKey={`about.teamRole${num}`} fallback={num === 1 ? "CEO & Co-Founder" : num === 2 ? "CTO" : "Head of Growth"} className="text-sm font-bold block mb-4" style={{ color: theme.primaryColor }} />
              <EditableText as="p" regionKey={`about.teamBio${num}`} fallback={num === 1 ? "Ex-VP at Stripe. Scaled product from $1M to $100M." : num === 2 ? "Former Lead Architect at Google AI." : "Scaled 3 startups to successful exits."} className="text-sm opacity-60 leading-relaxed block" />
            </div>
          ))}
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
      className="min-h-screen w-full flex flex-col"
      style={{ fontFamily: theme.fontFamily, backgroundColor: theme.backgroundColor }}
    >
      <Script src="https://upload-widget.cloudinary.com/global/all.js" strategy="afterInteractive" />

      <Navbar />

      <div className="flex flex-col w-full flex-1">
        {activePage === "home" && <HomeView />}
        {activePage === "about" && <AboutView />}
        {activePage === "contact" && <ContactView />}
      </div>

      <Footer />

      <style>{`
        html { scroll-behavior: smooth; }
        [contenteditable]:focus { outline: none; background: rgba(0,0,0,0.03); box-shadow: 0 0 0 2px ${theme.primaryColor}50; }
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



