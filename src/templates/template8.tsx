"use client";

import React, { useState } from "react";
import Script from "next/script";
import {
  useWebsiteBuilderStore,
  useRegionValue,
} from "@/store/useWebsiteBuilderStore";
import { useThemeStore } from "@/store/useThemeStore";

export const template8Meta = {
  id: "business/template8",
  name: "Furniture Showcase",
  image:
    "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1600&auto=format&fit=crop",
};

type TemplateProps = {
  editableData?: any;
  isPublished?: boolean;
};

export default function Template8({ editableData, isPublished = false }: TemplateProps) {
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

  const getNestedValue = (obj: any, path: string) => {
    return path.split(".").reduce((acc, part) => acc && acc[part], obj);
  };

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
        className={`focus:outline-none focus:ring-1 focus:ring-blue-400/30 transition-all ${className}`}
      >
        {content}
      </Tag>
    );
  };

  const EditableImg = ({ regionKey, fallback, className = "", alt = "Furniture" }: any) => {
    const hookValue = useRegionValue(regionKey);
    const dataValue = getNestedValue(editableData, regionKey);
    const src = hookValue ?? dataValue ?? fallback;

    return (
      <img
        src={src}
        alt={alt}
        className={`cursor-pointer transition-opacity hover:opacity-90 max-w-full ${className}`}
        onDoubleClick={(e) => {
          e.stopPropagation();
          handleImageUpload(regionKey);
        }}
      />
    );
  };

  const HomeView = () => (
    <div className="w-full space-y-32 py-12 animate-in fade-in duration-1000">
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-8">
            <EditableText
              as="h1"
              regionKey="home.heroTitle"
              fallback="Artisanal Heritage. Modern Living."
              className="text-6xl md:text-8xl font-light tracking-tighter leading-[0.9] block"
            />
            <EditableText
              as="p"
              regionKey="home.heroDesc"
              fallback="We curate essential pieces that define the modern home—blending sustainable materials with timeless Scandinavian craftsmanship."
              className="text-xl opacity-60 block max-w-lg leading-relaxed"
            />
            <button
              className="px-12 py-5 text-xs font-bold uppercase tracking-[0.3em] transition-all hover:opacity-80 active:scale-95 shadow-lg"
              style={{
                backgroundColor: theme.primaryColor,
                color: "#fff",
                borderRadius: `${theme.borderRadius}px`,
              }}
            >
              <EditableText regionKey="home.heroCta" fallback="Explore Collection" />
            </button>
          </div>
          <div className="lg:col-span-5 relative">
            <EditableImg
              regionKey="home.heroImg"
              fallback="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1200&auto=format&fit=crop"
              className="w-full aspect-[3/4] object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700"
              style={{ borderRadius: `${theme.borderRadius}px` }}
            />
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 py-24" style={{ backgroundColor: theme.secondaryColor }}>
        <div className="max-w-3xl mx-auto text-center mb-20 space-y-4">
          <EditableText as="h2" regionKey="home.gridTitle" fallback="The Autumn Edit" className="text-4xl font-light block" />
          <div className="w-24 h-px bg-current mx-auto opacity-20" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-6">
              <div className="overflow-hidden bg-white">
                <EditableImg
                  regionKey={`home.item${i}Img`}
                  fallback={`https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?q=80&w=800&auto=format&fit=crop`}
                  className="w-full aspect-square object-cover"
                />
              </div>
              <div className="space-y-1">
                <EditableText regionKey={`home.item${i}Name`} fallback="Hand-Stitched Lounge" className="text-sm font-bold uppercase tracking-widest block" />
                <EditableText regionKey={`home.item${i}Price`} fallback="$1,200" className="text-sm opacity-50 block" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  const AboutView = () => (
    <div className="px-4 sm:px-6 lg:px-8 py-24 max-w-6xl mx-auto space-y-32 animate-in slide-in-from-bottom-8 duration-700">
      <div className="text-center space-y-6">
        <EditableText as="h1" regionKey="about.title" fallback="Honest Design." className="text-7xl font-light block" />
        <EditableText as="p" regionKey="about.sub" fallback="Transparency from forest to floor." className="text-xl opacity-50 block" />
      </div>
      <div className="grid md:grid-cols-2 gap-24 items-center">
        <EditableImg
          regionKey="about.mainImg"
          fallback="https://images.unsplash.com/photo-1517705008128-361805f42e86?q=80&w=1000&auto=format&fit=crop"
          className="w-full aspect-[4/5] object-cover"
        />
        <div className="space-y-8">
          <EditableText
            as="p"
            regionKey="about.para1"
            fallback="We believe that furniture is an investment in your quality of life. Our studio works exclusively with reclaimed solid oak and recycled steel, ensuring that every joint and finish is built to endure for generations."
            className="text-2xl leading-relaxed block font-light"
          />
          <EditableText
            as="p"
            regionKey="about.para2"
            fallback="Located in the heart of Copenhagen, our master woodworkers translate raw materials into functional poetry. No fast furniture. No compromises."
            className="text-lg opacity-60 leading-relaxed block"
          />
        </div>
      </div>
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
        <div className="w-full py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <EditableText as="h1" regionKey="contact.title" fallback="Let's Connect" className="text-5xl md:text-6xl font-black tracking-tighter block mb-6" />
            <EditableText as="p" regionKey="contact.subtitle" fallback="Ready to work together? Reach out and let's start the conversation." className="text-xl opacity-70 block" />
          </div>
        </div>

        <div className="w-full py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
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
    <div
      className="w-full min-h-screen overflow-x-hidden flex flex-col"
      style={{
        backgroundColor: theme.backgroundColor,
        color: theme.textColor,
        fontFamily: theme.fontFamily || "inherit",
      }}
    >
      <script src="https://upload-widget.cloudinary.com/global/all.js" async></script>

      {/* Navigation */}
      <nav className="w-full border-b sticky top-0 z-50 backdrop-blur-xl" style={{ borderColor: `${theme.textColor}10`, backgroundColor: `${theme.backgroundColor}F2` }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-24 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <EditableImg
              regionKey="nav.logo"
              fallback="https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=100&h=100&fit=crop"
              className="w-12 h-12 object-cover"
              style={{ borderRadius: theme.borderRadius }}
            />
            <EditableText regionKey="nav.brand" fallback="OAK & IRON" className="font-black tracking-[0.4em] text-xs uppercase" />
          </div>

          <div className="hidden md:flex gap-12">
            {["home", "about", "contact"].map((p) => (
              <button
                key={p}
                onClick={() => setActivePage(p as any)}
                className={`text-[10px] uppercase tracking-[0.4em] font-black transition-all ${activePage === p ? "opacity-100" : "opacity-30 hover:opacity-100"}`}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            className="px-6 py-3 text-[10px] font-black uppercase tracking-[0.3em] border border-current transition-all hover:bg-current hover:text-white"
            style={{ borderRadius: `${theme.borderRadius}px` }}
          >
            <EditableText regionKey="nav.cta" fallback="Login" />
          </button>
        </div>
      </nav>

      {/* Viewport */}
      <main className="flex-1 w-full max-w-7xl mx-auto">
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
      </main>

      {/* Footer */}
      <footer className="w-full border-t py-24 px-4 sm:px-6 lg:px-8 mt-32" style={{ borderColor: `${theme.textColor}10`, backgroundColor: theme.secondaryColor }}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="md:col-span-2 space-y-8">
            <EditableText regionKey="nav.brand" fallback="OAK & IRON" className="font-black tracking-[0.5em] text-sm block" />
            <EditableText as="p" regionKey="footer.bio" fallback="Sustainable furniture for the modern minimalist. Every piece is handcrafted in our Copenhagen studio using reclaimed materials and traditional techniques." className="text-sm opacity-40 block max-w-md leading-relaxed" />
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30">Quick Navigation</h4>
            {["Home", "About", "Contact"].map(p => (
              <button key={p} onClick={() => setActivePage(p.toLowerCase() as any)} className="text-sm w-fit opacity-60 hover:opacity-100 transition-opacity uppercase tracking-widest">{p}</button>
            ))}
          </div>
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30">Legal</h4>
            <EditableText regionKey="footer.copy" fallback="© 2024 Oak & Iron Studio. All rights reserved." className="text-[10px] opacity-40 block tracking-widest leading-loose" />
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-in-from-bottom-8 { from { transform: translateY(2rem); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes zoom-in-95 { from { transform: scale(0.98); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-in { animation-duration: 0.8s; animation-fill-mode: both; }
        .fade-in { animation-name: fade-in; }
        .slide-in-from-bottom-8 { animation-name: slide-in-from-bottom-8; }
        .zoom-in-95 { animation-name: zoom-in-95; }
        [contenteditable]:focus { outline: none; border-bottom: 1px dashed rgba(0,0,0,0.1); }
      `}</style>
    </div>
  );
}





