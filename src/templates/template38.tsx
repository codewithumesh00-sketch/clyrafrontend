"use client";

import React, { useState } from "react";
import Script from "next/script";
import {
  useWebsiteBuilderStore,
  useRegionValue,
} from "@/store/useWebsiteBuilderStore";
import { useThemeStore } from "@/store/useThemeStore";



export const template38Meta = {
  id: "business/template38",
  name: "Editorial News Portal",
  image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1600&auto=format&fit=crop",
};

type TemplateProps = {
  editableData?: any;
  isPublished?: boolean;
};

const getNestedValue = (obj: any, path: string) => {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
};

export default function Template38({ editableData, isPublished = false }: TemplateProps) {
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
        className={`cursor-pointer transition-opacity hover:opacity-90 ${className}`}
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
        backgroundColor: `${theme.backgroundColor}F0`,
        borderColor: `${theme.textColor}15`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-24 flex items-center justify-between gap-4 overflow-hidden">
        <div className="flex flex-col min-w-0 flex-shrink-0 cursor-pointer" onClick={() => setActivePage("home")}>
          <EditableText
            regionKey="global.brand"
            fallback="THE DAILY CHRONICLE"
            className="font-black text-2xl md:text-3xl tracking-tighter whitespace-nowrap uppercase"
          />
          <EditableText
            regionKey="global.brandSub"
            fallback="Unfiltered truth. Unmatched perspective."
            className="text-[10px] md:text-xs font-semibold tracking-widest uppercase opacity-50"
          />
        </div>

        <div className="hidden md:flex items-center gap-10">
          {["Home", "About", "Contact"].map((page) => (
            <button
              key={page}
              onClick={() => setActivePage(page.toLowerCase() as any)}
              className={`text-sm font-bold uppercase tracking-widest transition-colors ${activePage === page.toLowerCase() ? "" : "opacity-40 hover:opacity-100"
                }`}
              style={{ color: activePage === page.toLowerCase() ? theme.primaryColor : theme.textColor }}
            >
              {page}
            </button>
          ))}
        </div>

        <div className="flex-shrink-0 hidden sm:block">
          <button
            className="px-6 py-3 font-bold text-xs uppercase tracking-widest transition-transform hover:-translate-y-0.5 active:scale-95"
            style={{
              backgroundColor: theme.primaryColor,
              color: "#fff",
              borderRadius: `${theme.borderRadius}px`,
            }}
          >
            <EditableText regionKey="global.subscribe" fallback="SUBSCRIBE" />
          </button>
        </div>
      </div>
    </nav>
  );

  const Footer = () => (
    <footer
      className="py-16 px-4 sm:px-6 lg:px-8 border-t mt-auto"
      style={{
        backgroundColor: theme.backgroundColor,
        color: theme.textColor,
        borderColor: `${theme.textColor}15`,
      }}
    >
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 border-b pb-12 mb-8" style={{ borderColor: `${theme.textColor}10` }}>
        <div className="md:col-span-2 flex flex-col items-start space-y-4">
          <EditableText regionKey="global.brand" fallback="THE DAILY CHRONICLE" className="font-black text-2xl tracking-tighter uppercase" />
          <EditableText
            as="p"
            regionKey="footer.desc"
            fallback="Delivering independent, global news to keep you informed. Driven by facts, crafted with editorial excellence."
            className="text-sm opacity-70 leading-relaxed max-w-sm"
          />
        </div>
        <div className="flex flex-col gap-4">
          <h4 className="font-black uppercase tracking-widest text-xs opacity-40">Sections</h4>
          {["Home", "About", "Contact"].map((p) => (
            <button key={p} onClick={() => setActivePage(p.toLowerCase() as any)} className="hover:underline text-sm text-left w-fit font-semibold">
              {p}
            </button>
          ))}
        </div>
        <div className="space-y-4 flex flex-col items-start">
          <h4 className="font-black uppercase tracking-widest text-xs opacity-40">Contact Us</h4>
          <EditableText regionKey="footer.email" fallback="tips@dailychronicle.news" className="text-sm font-semibold hover:underline" />
          <EditableText regionKey="footer.phone" fallback="+1 (555) 123-4567" className="text-sm font-semibold" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <EditableText regionKey="footer.copy" fallback="© 2026 The Daily Chronicle. All rights reserved." className="text-xs font-semibold opacity-40" />
        <EditableText regionKey="footer.tagline" fallback="Journalism without borders." className="text-xs font-bold tracking-widest uppercase opacity-40" />
      </div>
    </footer>
  );

  const HomeView = () => (
    <div className="animate-in fade-in duration-700 w-full">
      {/* BREAKING NEWS TICKER */}
      <div className="w-full border-b flex items-center overflow-hidden px-4 sm:px-6 lg:px-8 py-3" style={{ borderColor: `${theme.textColor}10`, backgroundColor: theme.secondaryColor }}>
        <div className="max-w-7xl w-full mx-auto flex items-center gap-4">
          <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded" style={{ backgroundColor: theme.primaryColor, color: '#fff' }}>
            Trending
          </span>
          <EditableText
            regionKey="home.ticker"
            fallback="Global markets rally as new tech innovations break boundaries. Read the full analysis inside."
            className="text-xs font-semibold truncate flex-1"
          />
        </div>
      </div>

      <Section id="featured-news" className="pt-8 sm:pt-12">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 border-b pb-12 sm:pb-20" style={{ borderColor: `${theme.textColor}15` }}>
          <div className="lg:col-span-8 flex flex-col gap-6 group">
            <div className="relative overflow-hidden w-full aspect-[16/9]" style={{ borderRadius: `${theme.borderRadius}px` }}>
              <EditableImg
                regionKey="home.featured.img"
                fallback="https://images.unsplash.com/photo-1529245001476-85718a3d4638?q=80&w=1200&auto=format&fit=crop"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col gap-3">
              <EditableText
                regionKey="home.featured.tag"
                fallback="WORLD POLITICS"
                className="text-xs font-black uppercase tracking-widest"
                style={{ color: theme.primaryColor }}
              />
              <EditableText
                as="h1"
                regionKey="home.featured.title"
                fallback="The Dawn of a New Diplomatic Era: Summit Concludes with Historic Pacts."
                className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight"
              />
              <EditableText
                as="p"
                regionKey="home.featured.desc"
                fallback="Leaders from around the globe have signed an unprecedented agreement, promising sweeping changes to international trade and environmental commitments over the next decade."
                className="text-base sm:text-lg opacity-70 leading-relaxed max-w-3xl"
              />
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-8 lg:border-l lg:pl-12" style={{ borderColor: `${theme.textColor}15` }}>
            <div className="flex items-center gap-3 border-b pb-4" style={{ borderColor: `${theme.textColor}15` }}>
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.primaryColor }}></div>
              <h3 className="font-black uppercase tracking-widest text-sm">Editor's Picks</h3>
            </div>

            <div className="flex flex-col gap-2">
              <EditableText regionKey="home.side1.tag" fallback="TECHNOLOGY" className="text-[10px] font-black uppercase tracking-widest opacity-50" />
              <EditableText as="h4" regionKey="home.side1.title" fallback="Artificial Intelligence Regulations Proposed in New Bill" className="font-bold text-lg leading-snug hover:underline cursor-pointer" />
            </div>

            <div className="flex flex-col gap-2">
              <EditableText regionKey="home.side2.tag" fallback="ECONOMY" className="text-[10px] font-black uppercase tracking-widest opacity-50" />
              <EditableText as="h4" regionKey="home.side2.title" fallback="Inflation Rates Drop Surprisingly in Q3 Review" className="font-bold text-lg leading-snug hover:underline cursor-pointer" />
            </div>

            <div className="flex flex-col gap-2">
              <EditableText regionKey="home.side3.tag" fallback="CULTURE" className="text-[10px] font-black uppercase tracking-widest opacity-50" />
              <EditableText as="h4" regionKey="home.side3.title" fallback="The Resurgence of Abstract Art in Modern Galleries" className="font-bold text-lg leading-snug hover:underline cursor-pointer" />
            </div>
          </div>
        </div>
      </Section>

      <Section id="latest-news" className="pt-0">
        <div className="flex items-center justify-between mb-8 sm:mb-12">
          <h2 className="text-3xl font-black tracking-tighter">Latest Stories</h2>
          <span className="text-xs font-bold uppercase tracking-widest cursor-pointer hover:underline" style={{ color: theme.primaryColor }}>View All</span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          <div className="flex flex-col gap-4 group cursor-pointer">
            <div className="overflow-hidden aspect-video w-full" style={{ borderRadius: `${theme.borderRadius}px` }}>
              <EditableImg
                regionKey="home.card1.img"
                fallback="https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col gap-2">
              <EditableText regionKey="home.card1.tag" fallback="INNOVATION" className="text-[10px] font-black uppercase tracking-widest" style={{ color: theme.primaryColor }} />
              <EditableText as="h3" regionKey="home.card1.title" fallback="Next-Gen Chips Promise Quantum Leap in Computing" className="font-bold text-xl leading-snug group-hover:underline" />
              <EditableText as="p" regionKey="home.card1.desc" fallback="Tech giants unveil new architecture designed to bypass current silicon limitations." className="text-sm opacity-70 line-clamp-2" />
            </div>
          </div>

          <div className="flex flex-col gap-4 group cursor-pointer">
            <div className="overflow-hidden aspect-video w-full" style={{ borderRadius: `${theme.borderRadius}px` }}>
              <EditableImg
                regionKey="home.card2.img"
                fallback="https://images.unsplash.com/photo-1473163928189-364b2c4e1135?q=80&w=800&auto=format&fit=crop"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col gap-2">
              <EditableText regionKey="home.card2.tag" fallback="ENVIRONMENT" className="text-[10px] font-black uppercase tracking-widest" style={{ color: theme.primaryColor }} />
              <EditableText as="h3" regionKey="home.card2.title" fallback="Ocean Clean-up Initiative Reaches Historic Milestone" className="font-bold text-xl leading-snug group-hover:underline" />
              <EditableText as="p" regionKey="home.card2.desc" fallback="Over 1,000 tons of plastic have been successfully removed from the Pacific in record time." className="text-sm opacity-70 line-clamp-2" />
            </div>
          </div>

          <div className="flex flex-col gap-4 group cursor-pointer">
            <div className="overflow-hidden aspect-video w-full" style={{ borderRadius: `${theme.borderRadius}px` }}>
              <EditableImg
                regionKey="home.card3.img"
                fallback="https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?q=80&w=800&auto=format&fit=crop"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col gap-2">
              <EditableText regionKey="home.card3.tag" fallback="LIFESTYLE" className="text-[10px] font-black uppercase tracking-widest" style={{ color: theme.primaryColor }} />
              <EditableText as="h3" regionKey="home.card3.title" fallback="The Rise of Minimalist Living in Urban Centers" className="font-bold text-xl leading-snug group-hover:underline" />
              <EditableText as="p" regionKey="home.card3.desc" fallback="Why millennials are ditching space for location and adopting a 'less is more' philosophy." className="text-sm opacity-70 line-clamp-2" />
            </div>
          </div>
        </div>
      </Section>
    </div>
  );

  const AboutView = () => (
    <Section id="about" className="animate-in slide-in-from-bottom-4 duration-700">
      <div className="max-w-4xl mx-auto flex flex-col gap-12 text-center">
        <EditableText
          as="h1"
          regionKey="about.title"
          fallback="Our Mission: Truth Uncompromised."
          className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter leading-tight"
        />
        <div className="w-full aspect-[21/9] overflow-hidden" style={{ borderRadius: `${theme.borderRadius}px` }}>
          <EditableImg
            regionKey="about.img"
            fallback="https://images.unsplash.com/photo-1455390582262-044cdead27d8?q=80&w=1600&auto=format&fit=crop"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-12 text-left mt-8">
          <div className="space-y-4">
            <h3 className="font-black text-2xl uppercase tracking-tight">The Heritage</h3>
            <EditableText
              as="p"
              regionKey="about.desc1"
              fallback="Founded on the principles of rigorous journalism and uncompromising integrity, we have been delivering the stories that shape our world. We believe that an informed public is the cornerstone of a functioning society."
              className="text-base opacity-75 leading-relaxed"
            />
          </div>
          <div className="space-y-4">
            <h3 className="font-black text-2xl uppercase tracking-tight">The Vision</h3>
            <EditableText
              as="p"
              regionKey="about.desc2"
              fallback="In an era of misinformation, our newsroom leverages both cutting-edge technology and boots-on-the-ground reporting to separate fact from fiction. We don't just report the news; we provide context."
              className="text-base opacity-75 leading-relaxed"
            />
          </div>
        </div>
      </div>
    </Section>
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
      className="min-h-screen flex flex-col selection:bg-blue-500 selection:text-white"
      style={{ fontFamily: theme.fontFamily, backgroundColor: theme.backgroundColor }}
    >
      {/* Standard script injection for environments where next/script is unavailable */}
      <script
        src="https://upload-widget.cloudinary.com/global/all.js"
        async
      />

      <Navbar />

      <div className="flex-1 w-full flex flex-col">
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
        html { scroll-behavior: smooth; }
        [contenteditable]:focus { outline: none; background: rgba(125,125,125,0.1); }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-in-from-bottom-4 { from { transform: translateY(1rem); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes zoom-in-95 { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-in { animation-duration: 0.5s; animation-fill-mode: both; }
        .fade-in { animation-name: fade-in; }
        .slide-in-from-bottom-4 { animation-name: slide-in-from-bottom-4; }
        .zoom-in-95 { animation-name: zoom-in-95; }
      `}</style>
    </main>
  );
}





