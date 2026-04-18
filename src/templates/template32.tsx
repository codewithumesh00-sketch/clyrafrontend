"use client";

import React, { useState, useEffect } from "react";
import {
  useWebsiteBuilderStore,
  useRegionValue,
} from "@/store/useWebsiteBuilderStore";
import { useThemeStore } from "@/store/useThemeStore";

export const template32Meta = {
  id: "business/template32",
  name: "Luxury Hotel & Resort",
  image: "https://images.unsplash.com/photo-1542314831-c6a4d2748608?q=80&w=1600&auto=format&fit=crop",
};

type TemplateProps = {
  editableData?: any;
};

const getNestedValue = (obj: any, path: string) => {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
};

export default function Template32({ editableData }: TemplateProps) {
  const [activePage, setActivePage] = useState<"home" | "about" | "contact">("home");
  const { theme } = useThemeStore();
  const updateRegion = useWebsiteBuilderStore((state: any) => state.updateRegion);

  // --- SCRIPT LOADING ---
  useEffect(() => {
    if (typeof window !== "undefined" && !(window as any).cloudinary) {
      const script = document.createElement("script");
      script.src = "https://upload-widget.cloudinary.com/global/all.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // --- IMAGE UPLOAD HANDLER ---
  const handleImageUpload = (regionKey: string) => {
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
        className={`focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all ${className}`}
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

  const Section = ({ children, id, bgType = "primary" }: any) => (
    <section
      id={id}
      style={{
        padding: `${theme.sectionSpacing}px 24px`,
        backgroundColor: bgType === "primary" ? theme.backgroundColor : theme.secondaryColor,
        color: theme.textColor,
      }}
      className="w-full flex justify-center overflow-hidden"
    >
      <div className="w-full max-w-7xl">{children}</div>
    </section>
  );

  const Navbar = () => (
    <nav
      className="sticky top-0 w-full z-40 backdrop-blur-xl border-b"
      style={{
        backgroundColor: `${theme.backgroundColor}EE`,
        borderColor: `${theme.textColor}15`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-24 flex items-center justify-between gap-4 overflow-hidden">
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <EditableImg
            regionKey="global.logo"
            fallback="https://images.unsplash.com/photo-1563911302283-d2bc129e7570?w=100&h=100&fit=crop"
            className="w-12 h-12 object-cover rounded-full shadow-sm"
          />
          <EditableText
            regionKey="global.brand"
            fallback="THE GRAND AURA"
            className="font-bold text-2xl tracking-widest whitespace-nowrap uppercase"
          />
        </div>

        <div className="hidden lg:flex items-center gap-10 px-4">
          {["Home", "About", "Contact"].map((page) => (
            <button
              key={page}
              onClick={() => setActivePage(page.toLowerCase() as any)}
              className={`text-sm font-medium transition-all uppercase tracking-[0.2em] ${activePage === page.toLowerCase() ? "" : "opacity-50 hover:opacity-100"
                }`}
              style={{
                color: theme.textColor,
                borderBottom: activePage === page.toLowerCase() ? `2px solid ${theme.primaryColor}` : "2px solid transparent",
                paddingBottom: "4px"
              }}
            >
              {page}
            </button>
          ))}
        </div>

        <div className="flex-shrink-0">
          <button
            className="px-8 py-3.5 font-semibold text-xs transition-transform active:scale-95 uppercase tracking-widest shadow-lg hover:shadow-xl"
            style={{
              backgroundColor: theme.primaryColor,
              color: "#ffffff",
              borderRadius: `${theme.borderRadius}px`,
            }}
          >
            <EditableText regionKey="global.navCta" fallback="RESERVE NOW" />
          </button>
        </div>
      </div>
    </nav>
  );

  const Footer = () => (
    <footer
      className="py-24 px-6 border-t"
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
              fallback="https://images.unsplash.com/photo-1563911302283-d2bc129e7570?w=100&h=100&fit=crop"
              className="w-10 h-10 rounded-full"
            />
            <EditableText regionKey="global.brand" fallback="THE GRAND AURA" className="font-bold text-xl tracking-widest uppercase" />
          </div>
          <EditableText
            as="p"
            regionKey="footer.desc"
            fallback="An oasis of luxury and tranquility. Experience hospitality redefined at our award-winning properties worldwide."
            className="text-base opacity-75 leading-relaxed block max-w-md mx-auto md:mx-0"
          />
        </div>

        <div className="flex flex-col gap-5">
          <h4 className="font-bold uppercase tracking-[0.2em] text-xs opacity-50 mb-2">Explore</h4>
          {["Home", "About", "Contact"].map((p) => (
            <button key={p} onClick={() => setActivePage(p.toLowerCase() as any)} className="hover:opacity-60 transition-opacity text-sm w-fit mx-auto md:mx-0 uppercase tracking-wider">
              {p}
            </button>
          ))}
        </div>

        <div className="space-y-5">
          <h4 className="font-bold uppercase tracking-[0.2em] text-xs opacity-50 mb-2">Contact Us</h4>
          <EditableText regionKey="footer.phone" fallback="+1 (800) 123-4567" className="text-sm block font-medium" />
          <EditableText regionKey="footer.email" fallback="reservations@grandaura.com" className="text-sm block font-medium" />
          <EditableText regionKey="footer.address" fallback="1 Luxury Way, Paradise City, PC 90210" className="text-sm block opacity-75 mt-4" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4" style={{ borderColor: `${theme.textColor}10` }}>
        <EditableText regionKey="footer.copy" fallback="© 2026 The Grand Aura. All rights reserved." className="text-xs opacity-50 block uppercase tracking-widest" />
        <div className="text-xs opacity-50 uppercase tracking-widest space-x-6">
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
        </div>
      </div>
    </footer>
  );

  // --- PAGE VIEWS ---
  const HomeView = () => (
    <div className="animate-in fade-in duration-1000">
      {/* Hero Section */}
      <section className="relative w-full h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <EditableImg
            regionKey="home.heroImg"
            fallback="https://images.unsplash.com/photo-1542314831-c6a4d2748608?q=80&w=2000&auto=format&fit=crop"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 mix-blend-multiply"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto space-y-8 flex flex-col items-center">
          <div className="inline-block px-4 py-1 border border-white/30 backdrop-blur-sm mb-4">
            <EditableText
              regionKey="home.heroTagline"
              fallback="★★★★★ 5-STAR LUXURY RESORT"
              className="text-white text-xs font-bold tracking-[0.3em] uppercase"
            />
          </div>
          <EditableText
            as="h1"
            regionKey="home.heroTitle"
            fallback="A Sanctuary of Elegance"
            className="text-5xl md:text-7xl lg:text-8xl font-normal text-white leading-tight block drop-shadow-lg"
          />
          <EditableText
            as="p"
            regionKey="home.heroSubtitle"
            fallback="Immerse yourself in unparalleled comfort and breathtaking views. Your extraordinary escape awaits."
            className="text-lg md:text-xl text-white/90 leading-relaxed block max-w-2xl font-light"
          />
          <button
            className="mt-8 px-12 py-5 font-bold uppercase tracking-widest text-sm transition-all hover:bg-white hover:text-black border border-white"
            style={{ backgroundColor: theme.primaryColor, color: "#fff", borderRadius: `${theme.borderRadius}px`, borderColor: theme.primaryColor }}
          >
            <EditableText regionKey="home.heroBtn" fallback="Check Availability" />
          </button>
        </div>

        {/* Visual Booking Bar (Purely UI for template) */}
        <div className="absolute bottom-0 left-0 w-full transform translate-y-1/2 px-4 z-20 hidden md:block">
          <div className="max-w-5xl mx-auto bg-white p-6 shadow-2xl flex flex-wrap gap-4 items-center justify-between" style={{ borderRadius: `${theme.borderRadius}px`, backgroundColor: theme.backgroundColor, color: theme.textColor }}>
            <div className="flex-1 px-4 border-r border-gray-200 min-w-[150px]">
              <span className="text-xs uppercase tracking-widest opacity-50 block mb-1">Check In</span>
              <span className="font-semibold">Oct 24, 2026</span>
            </div>
            <div className="flex-1 px-4 border-r border-gray-200 min-w-[150px]">
              <span className="text-xs uppercase tracking-widest opacity-50 block mb-1">Check Out</span>
              <span className="font-semibold">Oct 29, 2026</span>
            </div>
            <div className="flex-1 px-4 min-w-[150px]">
              <span className="text-xs uppercase tracking-widest opacity-50 block mb-1">Guests</span>
              <span className="font-semibold">2 Adults, 1 Room</span>
            </div>
            <button
              className="px-8 py-4 uppercase tracking-widest text-xs font-bold flex-shrink-0"
              style={{ backgroundColor: theme.textColor, color: theme.backgroundColor, borderRadius: `${theme.borderRadius}px` }}>
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <Section id="intro" bgType="primary">
        <div className="md:mt-16 text-center max-w-3xl mx-auto space-y-8">
          <EditableText
            as="h2"
            regionKey="home.introTitle"
            fallback="Welcome to Perfection"
            className="text-4xl md:text-5xl font-normal block"
          />
          <div className="w-16 h-0.5 mx-auto" style={{ backgroundColor: theme.primaryColor }}></div>
          <EditableText
            as="p"
            regionKey="home.introDesc"
            fallback="Nestled in the heart of the pristine coastline, The Grand Aura offers a retreat from the ordinary. From our Michelin-starred dining to our world-class spa, every detail is meticulously curated to provide an unforgettable experience."
            className="text-lg opacity-80 leading-loose block font-light"
          />
        </div>
      </Section>

      {/* Featured Rooms Section */}
      <Section id="rooms" bgType="secondary">
        <div className="space-y-16">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b pb-8" style={{ borderColor: `${theme.textColor}20` }}>
            <div className="space-y-4 max-w-xl">
              <EditableText as="span" regionKey="home.roomsSub" fallback="ACCOMMODATIONS" className="text-xs font-bold uppercase tracking-[0.3em] opacity-60 block" />
              <EditableText as="h2" regionKey="home.roomsTitle" fallback="Signature Suites & Villas" className="text-4xl md:text-5xl font-normal block" />
            </div>
            <button className="text-sm uppercase tracking-widest font-semibold border-b hover:opacity-70 transition-opacity pb-1" style={{ borderColor: theme.textColor }}>
              View All Rooms
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((num) => (
              <div key={num} className="group relative overflow-hidden bg-white shadow-xl flex flex-col" style={{ borderRadius: `${theme.borderRadius}px`, backgroundColor: theme.backgroundColor }}>
                <div className="relative aspect-[4/3] overflow-hidden">
                  <EditableImg
                    regionKey={`home.room${num}Img`}
                    fallback={
                      num === 1 ? "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1000&auto=format&fit=crop" :
                        num === 2 ? "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1000&auto=format&fit=crop" :
                          "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1000&auto=format&fit=crop"
                    }
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 text-xs font-bold uppercase tracking-widest text-black" style={{ borderRadius: `${theme.borderRadius}px` }}>
                    <EditableText regionKey={`home.room${num}Price`} fallback={num === 1 ? "$450 / Night" : num === 2 ? "$850 / Night" : "$1,200 / Night"} />
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-1">
                  <EditableText
                    as="h3"
                    regionKey={`home.room${num}Title`}
                    fallback={num === 1 ? "Ocean View Deluxe" : num === 2 ? "Premium Corner Suite" : "The Royal Villa"}
                    className="text-2xl mb-4 font-normal block"
                  />
                  <EditableText
                    as="p"
                    regionKey={`home.room${num}Desc`}
                    fallback="Spacious and elegantly appointed, featuring panoramic views, a king-size bed, and a lavish marble bathroom with a deep soaking tub."
                    className="text-sm opacity-70 leading-relaxed block mb-8 flex-1"
                  />
                  <button className="w-full py-4 text-xs font-bold uppercase tracking-widest border transition-colors hover:bg-black hover:text-white" style={{ borderColor: `${theme.textColor}30`, borderRadius: `${theme.borderRadius}px` }}>
                    Discover More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </div>
  );

  const AboutView = () => (
    <div className="animate-in slide-in-from-bottom-8 duration-700">
      <Section id="about-hero" bgType="primary">
        <div className="text-center max-w-4xl mx-auto space-y-8 mb-16 pt-12">
          <EditableText as="span" regionKey="about.sub" fallback="OUR STORY" className="text-xs font-bold uppercase tracking-[0.3em] opacity-60 block" />
          <EditableText as="h1" regionKey="about.title" fallback="A Legacy of Excellence" className="text-5xl md:text-7xl font-normal block" />
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="absolute inset-0 bg-black/5 translate-x-4 translate-y-4" style={{ borderRadius: `${theme.borderRadius * 2}px` }}></div>
            <EditableImg
              regionKey="about.img1"
              fallback="https://images.unsplash.com/photo-1551882547-ff40c0d12444?q=80&w=1200&auto=format&fit=crop"
              className="w-full aspect-[3/4] object-cover relative z-10 shadow-2xl"
              style={{ borderRadius: `${theme.borderRadius * 2}px` }}
            />
          </div>
          <div className="space-y-8 lg:pl-8">
            <EditableText as="h3" regionKey="about.heading1" fallback="Redefining Hospitality Since 1998" className="text-3xl md:text-4xl font-normal block" />
            <EditableText
              as="p"
              regionKey="about.desc1"
              fallback="What began as a single boutique property has blossomed into a globally recognized symbol of luxury. We believe that true hospitality is an art form—one that requires intuition, dedication, and an unwavering commitment to our guests' happiness."
              className="text-lg opacity-75 leading-relaxed block font-light"
            />
            <EditableText
              as="p"
              regionKey="about.desc2"
              fallback="Our architecture blends seamlessly with the natural surroundings, while our interiors celebrate local culture and modern design. Every space is crafted to inspire awe and foster deep relaxation."
              className="text-lg opacity-75 leading-relaxed block font-light"
            />

            <div className="grid grid-cols-2 gap-8 pt-8 border-t" style={{ borderColor: `${theme.textColor}20` }}>
              <div>
                <EditableText regionKey="about.stat1" fallback="25+" className="text-4xl font-normal block mb-2" />
                <span className="text-xs uppercase tracking-widest opacity-60">Global Locations</span>
              </div>
              <div>
                <EditableText regionKey="about.stat2" fallback="5★" className="text-4xl font-normal block mb-2" />
                <span className="text-xs uppercase tracking-widest opacity-60">Forbes Rating</span>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );

  const ContactView = () => (
    <div className="animate-in zoom-in-95 duration-700">
      <Section id="contact" bgType="primary">
        <div className="max-w-6xl mx-auto pt-12">
          <div className="text-center mb-16 space-y-6">
            <EditableText as="span" regionKey="contact.sub" fallback="GET IN TOUCH" className="text-xs font-bold uppercase tracking-[0.3em] opacity-60 block" />
            <EditableText as="h1" regionKey="contact.title" fallback="We Await Your Arrival" className="text-5xl md:text-7xl font-normal block" />
          </div>

          <div className="grid lg:grid-cols-5 gap-12 lg:gap-0 bg-white shadow-2xl overflow-hidden" style={{ borderRadius: `${theme.borderRadius * 2}px`, backgroundColor: theme.secondaryColor }}>

            {/* Contact Info Panel */}
            <div className="lg:col-span-2 p-12 flex flex-col justify-between" style={{ backgroundColor: theme.primaryColor, color: "#ffffff" }}>
              <div className="space-y-12">
                <div>
                  <h3 className="text-3xl font-normal mb-8">Contact Information</h3>
                  <p className="opacity-80 font-light leading-relaxed">Our concierge team is available 24/7 to assist you with reservations, special requests, and general inquiries.</p>
                </div>

                <div className="space-y-8">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest opacity-60 mb-2">Reservations</h4>
                    <EditableText regionKey="contact.phone" fallback="+1 (800) 123-4567" className="text-lg block" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest opacity-60 mb-2">Email</h4>
                    <EditableText regionKey="contact.email" fallback="reservations@grandaura.com" className="text-lg block" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest opacity-60 mb-2">Location</h4>
                    <EditableText regionKey="contact.address" fallback="1 Luxury Way, Paradise City, PC 90210" className="text-lg block leading-relaxed" />
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form Panel */}
            <div className="lg:col-span-3 p-12 lg:p-16">
              <h3 className="text-2xl font-normal mb-8">Send an Inquiry</h3>
              <div className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest opacity-60">First Name</label>
                    <input className="w-full p-4 bg-transparent border-b focus:border-black outline-none transition-colors" style={{ borderColor: `${theme.textColor}30` }} placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest opacity-60">Last Name</label>
                    <input className="w-full p-4 bg-transparent border-b focus:border-black outline-none transition-colors" style={{ borderColor: `${theme.textColor}30` }} placeholder="Doe" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest opacity-60">Email Address</label>
                  <input className="w-full p-4 bg-transparent border-b focus:border-black outline-none transition-colors" style={{ borderColor: `${theme.textColor}30` }} placeholder="john@example.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest opacity-60">Message</label>
                  <textarea rows={4} className="w-full p-4 bg-transparent border-b focus:border-black outline-none transition-colors resize-none" style={{ borderColor: `${theme.textColor}30` }} placeholder="How can we help make your stay perfect?"></textarea>
                </div>

                <button className="px-12 py-5 mt-4 font-bold uppercase tracking-widest text-sm transition-transform active:scale-95 shadow-xl hover:shadow-2xl" style={{ backgroundColor: theme.textColor, color: theme.backgroundColor, borderRadius: `${theme.borderRadius}px` }}>
                  <EditableText regionKey="contact.submit" fallback="Send Message" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </Section>
    </div>
  );

  return (
    <main
      className="min-h-screen selection:bg-black selection:text-white"
      style={{ fontFamily: theme.fontFamily, backgroundColor: theme.backgroundColor, color: theme.textColor }}
    >
      <Navbar />

      <div className="flex flex-col w-full">
        {activePage === "home" && <HomeView />}
        {activePage === "about" && <AboutView />}
        {activePage === "contact" && <ContactView />}
      </div>

      <Footer />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');
        html { scroll-behavior: smooth; }
        [contenteditable]:focus { outline: none; background: rgba(0,0,0,0.03); box-shadow: 0 0 0 2px rgba(0,0,0,0.1); border-radius: 4px; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-in-from-bottom-8 { from { transform: translateY(2rem); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes zoom-in-95 { from { transform: scale(0.97); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-in { animation-duration: 0.8s; animation-fill-mode: both; animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1); }
        .fade-in { animation-name: fade-in; }
        .slide-in-from-bottom-8 { animation-name: slide-in-from-bottom-8; }
        .zoom-in-95 { animation-name: zoom-in-95; }
      `}</style>
    </main>
  );
}



