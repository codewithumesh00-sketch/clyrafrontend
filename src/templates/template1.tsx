"use client";

import React, { useState } from "react";
import Script from "next/script";
import {
  useWebsiteBuilderStore,
  useRegionValue,
} from "@/store/useWebsiteBuilderStore";
import { useThemeStore } from "@/store/useThemeStore";

export const template1Meta = {
  id: "business/elite",
  name: "Elite Modern Business",
  image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600&auto=format&fit=crop",
};

type TemplateProps = {
  editableData?: any;
  isPublished?: boolean;
};

const getNestedValue = (obj: any, path: string) => {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
};

export default function Template1({ editableData, isPublished = false }: TemplateProps) {
  const [activePage, setActivePage] = useState("home");
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

  // --- 🖼️ IMAGE UPLOAD HANDLER (Editor-only) ---
  const handleImageUpload = (regionKey: string) => {
    if (isPublished) return;
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("clyraweb-open-image-upload", {
        detail: { regionKey }
      }));
    }
  };

  // --- ✏️ EDITABLE TEXT COMPONENT ---
  const EditableText = ({ regionKey, fallback, as: Tag = "span", className = "" }: any) => {
    const hookValue = useRegionValue(regionKey);
    const dataValue = getNestedValue(editableData, regionKey);

    if (isPublished) {
      const content = dataValue ?? fallback;
      return <Tag className={className}>{content}</Tag>;
    }

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

  // --- 🖼️ EDITABLE IMAGE COMPONENT ---
  const EditableImg = ({ regionKey, fallback, className = "", alt = "image", style = {} }: any) => {
    const hookValue = useRegionValue(regionKey);
    const dataValue = getNestedValue(editableData, regionKey);

    if (isPublished) {
      const src = dataValue ?? fallback;
      return <img src={src} alt={alt} style={style} className={className} />;
    }

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

  // --- 📦 SECTION LAYOUT ---
  const Section = ({ children, id, className = "", bgType = "white" }: any) => {
    const bgColor = bgType === "primary"
      ? theme.primaryColor
      : bgType === "secondary"
        ? theme.secondaryColor
        : bgType === "dark"
          ? "#0f172a"
          : "#ffffff";

    const textColor = bgType === "dark" || bgType === "primary" ? "#ffffff" : theme.textColor;

    return (
      <section
        id={id}
        style={{
          padding: `${theme.sectionSpacing}px 24px`,
          backgroundColor: bgColor,
          color: textColor,
        }}
        className={`w-full flex justify-center overflow-hidden ${className}`}
      >
        <div className="w-full max-w-7xl">{children}</div>
      </section>
    );
  };

  // --- 🧭 NAVBAR ---
  const Navbar = () => (
    <nav
      className="sticky top-0 w-full z-50 backdrop-blur-md border-b shadow-sm"
      style={{
        backgroundColor: `${theme.backgroundColor}F5`,
        borderColor: `${theme.textColor}10`,
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => setActivePage("home")}
        >
          <EditableImg
            regionKey="global.logo"
            fallback="https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop"
            className="w-12 h-12 object-cover rounded-lg shadow-md"
          />
          <EditableText
            regionKey="global.brand"
            fallback="ELITE"
            className="font-bold text-2xl tracking-wider"
            style={{ color: theme.primaryColor }}
          />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-10">
          {["Home", "About", "Services", "Blog", "Contact"].map((page) => (
            <button
              key={page}
              onClick={() => {
                setActivePage(page.toLowerCase());
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`text-sm font-semibold transition-all uppercase tracking-widest hover:scale-105 ${activePage === page.toLowerCase() ? "opacity-100" : "opacity-60 hover:opacity-100"
                }`}
              style={{ color: activePage === page.toLowerCase() ? theme.primaryColor : theme.textColor }}
            >
              {page}
            </button>
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden lg:block">
          <button
            className="px-8 py-3 font-bold text-sm transition-all hover:scale-105 active:scale-95 shadow-lg"
            style={{
              backgroundColor: theme.primaryColor,
              color: "#fff",
              borderRadius: `${theme.borderRadius}px`,
            }}
          >
            <EditableText regionKey="global.navCta" fallback="GET STARTED" />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <div className="w-6 h-0.5 bg-current mb-1.5"></div>
          <div className="w-6 h-0.5 bg-current mb-1.5"></div>
          <div className="w-6 h-0.5 bg-current"></div>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden border-t px-6 py-4 space-y-3"
          style={{ backgroundColor: theme.backgroundColor, borderColor: `${theme.textColor}10` }}
        >
          {["Home", "About", "Services", "Blog", "Contact"].map((page) => (
            <button
              key={page}
              onClick={() => {
                setActivePage(page.toLowerCase());
                setMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="block w-full text-left py-2 text-sm font-semibold uppercase tracking-widest"
              style={{ color: theme.textColor }}
            >
              {page}
            </button>
          ))}
          <button
            className="w-full mt-4 px-8 py-3 font-bold text-sm"
            style={{
              backgroundColor: theme.primaryColor,
              color: "#fff",
              borderRadius: `${theme.borderRadius}px`,
            }}
          >
            <EditableText regionKey="global.navCta" fallback="GET STARTED" />
          </button>
        </div>
      )}
    </nav>
  );

  // --- 🦶 FOOTER ---
  const Footer = () => (
    <footer
      className="py-16 px-6 border-t"
      style={{
        backgroundColor: "#0f172a",
        color: "#ffffff",
        borderColor: `${theme.textColor}10`,
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <EditableImg
                regionKey="global.logo"
                fallback="https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop"
                className="w-10 h-10 rounded-lg"
              />
              <EditableText regionKey="global.brand" fallback="ELITE" className="font-bold text-xl" />
            </div>
            <EditableText
              as="p"
              regionKey="footer.desc"
              fallback="Transforming businesses with innovative solutions and strategic excellence."
              className="text-sm opacity-70 leading-relaxed"
            />
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold uppercase tracking-widest text-xs mb-4 opacity-40">Quick Links</h4>
            <div className="space-y-2">
              {["Home", "About", "Services", "Blog", "Contact"].map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setActivePage(p.toLowerCase());
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="block hover:opacity-100 opacity-70 transition-opacity text-sm"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold uppercase tracking-widest text-xs mb-4 opacity-40">Services</h4>
            <div className="space-y-2 text-sm opacity-70">
              <EditableText regionKey="footer.service1" fallback="Business Consulting" className="block" />
              <EditableText regionKey="footer.service2" fallback="Strategic Planning" className="block" />
              <EditableText regionKey="footer.service3" fallback="Digital Transformation" className="block" />
              <EditableText regionKey="footer.service4" fallback="Market Analysis" className="block" />
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-bold uppercase tracking-widest text-xs opacity-40">Contact</h4>
            <EditableText regionKey="footer.email" fallback="contact@elite-business.com" className="text-sm block opacity-70" />
            <EditableText regionKey="footer.phone" fallback="+1 (555) 123-4567" className="text-sm block opacity-70" />
            <EditableText regionKey="footer.address" fallback="123 Business Ave, Suite 100&#10;New York, NY 10001" className="text-sm block opacity-70 whitespace-pre-line" />
          </div>
        </div>

        <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
          <EditableText regionKey="footer.copy" fallback="© 2026 Elite Business Solutions. All rights reserved." className="text-xs opacity-40" />
          <div className="flex gap-6 text-xs opacity-40">
            <span className="cursor-pointer hover:opacity-100">Privacy Policy</span>
            <span className="cursor-pointer hover:opacity-100">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );

  // --- 🏠 HOME VIEW ---
  const HomeView = () => (
    <div className="animate-in fade-in duration-700">
      {/* Hero Section */}
      <section
        className="relative min-h-[90vh] flex items-center"
        style={{ backgroundColor: theme.backgroundColor }}
      >
        <div className="absolute inset-0 opacity-10">
          <EditableImg
            regionKey="hero.bgImage"
            fallback="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&auto=format&fit=crop"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-block px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest"
              style={{ backgroundColor: `${theme.primaryColor}20`, color: theme.primaryColor }}>
              <EditableText regionKey="hero.badge" fallback="Welcome to Elite" />
            </div>

            <EditableText
              as="h1"
              regionKey="hero.title"
              fallback="Elevate Your Business to New Heights"
              className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tight"
            />

            <EditableText
              as="p"
              regionKey="hero.subtitle"
              fallback="We provide innovative solutions and strategic expertise to help your business thrive in today's competitive landscape."
              className="text-xl opacity-70 leading-relaxed max-w-xl"
            />

            <div className="flex flex-wrap gap-4">
              <button
                className="px-10 py-4 font-bold uppercase tracking-widest text-sm shadow-xl hover:scale-105 transition-all"
                style={{ backgroundColor: theme.primaryColor, color: "#fff", borderRadius: `${theme.borderRadius}px` }}
                onClick={() => setActivePage("contact")}
              >
                <EditableText regionKey="hero.btn1" fallback="Get Started" />
              </button>
              <button
                className="px-10 py-4 font-bold uppercase tracking-widest text-sm border-2 hover:scale-105 transition-all"
                style={{ borderColor: theme.primaryColor, color: theme.primaryColor, borderRadius: `${theme.borderRadius}px` }}
                onClick={() => setActivePage("about")}
              >
                <EditableText regionKey="hero.btn2" fallback="Learn More" />
              </button>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <EditableImg
              regionKey="hero.img"
              fallback="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&auto=format&fit=crop"
              className="w-full aspect-square object-cover shadow-2xl"
              style={{ borderRadius: `${theme.borderRadius * 3}px` }}
            />
            <div
              className="absolute -bottom-8 -left-8 p-6 shadow-2xl"
              style={{ backgroundColor: theme.primaryColor, borderRadius: `${theme.borderRadius}px` }}
            >
              <div className="text-white">
                <div className="text-4xl font-black">10+</div>
                <div className="text-sm uppercase tracking-widest opacity-80">Years Experience</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <Section id="features">
        <div className="py-20">
          <div className="text-center mb-16">
            <EditableText
              as="h2"
              regionKey="features.title"
              fallback="Why Choose Elite"
              className="text-4xl md:text-5xl font-black tracking-tight mb-4"
            />
            <EditableText
              as="p"
              regionKey="features.subtitle"
              fallback="Discover what sets us apart from the competition"
              className="text-lg opacity-70 max-w-2xl mx-auto"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "📊",
                title: "Data-Driven Solutions",
                desc: "Leverage powerful analytics and insights to make informed business decisions."
              },
              {
                icon: "🚀",
                title: "Rapid Growth",
                desc: "Accelerate your business growth with our proven strategies and methodologies."
              },
              {
                icon: "🤝",
                title: "Expert Support",
                desc: "Get dedicated support from our team of industry experts and consultants."
              }
            ].map((feature, idx) => (
              <div
                key={idx}
                className="p-8 text-center group hover:scale-105 transition-all duration-300"
                style={{
                  backgroundColor: `${theme.primaryColor}08`,
                  borderRadius: `${theme.borderRadius * 2}px`
                }}
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="opacity-70 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Stats Section */}
      <Section id="stats" bgType="primary">
        <div className="py-20">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { num: "500+", label: "Clients Worldwide" },
              { num: "98%", label: "Success Rate" },
              { num: "50+", label: "Expert Consultants" },
              { num: "24/7", label: "Support Available" }
            ].map((stat, idx) => (
              <div key={idx} className="space-y-2">
                <div className="text-5xl md:text-6xl font-black">{stat.num}</div>
                <div className="text-sm uppercase tracking-widest opacity-80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* CTA Section */}
      <Section id="cta">
        <div className="py-20 text-center">
          <EditableText
            as="h2"
            regionKey="homeCta.title"
            fallback="Ready to Transform Your Business?"
            className="text-4xl md:text-5xl font-black tracking-tight mb-6"
          />
          <EditableText
            as="p"
            regionKey="homeCta.desc"
            fallback="Join hundreds of successful businesses that trust Elite"
            className="text-xl opacity-70 mb-8 max-w-2xl mx-auto"
          />
          <button
            className="px-12 py-5 font-bold uppercase tracking-widest text-sm shadow-xl hover:scale-105 transition-all"
            style={{ backgroundColor: theme.primaryColor, color: "#fff", borderRadius: `${theme.borderRadius}px` }}
            onClick={() => setActivePage("contact")}
          >
            <EditableText regionKey="homeCta.btn" fallback="Start Your Journey" />
          </button>
        </div>
      </Section>
    </div>
  );

  // --- ℹ️ ABOUT VIEW ---
  const AboutView = () => (
    <div className="animate-in fade-in duration-700">
      {/* Hero */}
      <section
        className="py-20 px-6"
        style={{ backgroundColor: theme.secondaryColor }}
      >
        <div className="max-w-7xl mx-auto text-center">
          <EditableText
            as="h1"
            regionKey="about.heroTitle"
            fallback="About Elite"
            className="text-5xl md:text-6xl font-black tracking-tight mb-4"
          />
          <EditableText
            as="p"
            regionKey="about.heroSubtitle"
            fallback="Your trusted partner in business excellence"
            className="text-xl opacity-70"
          />
        </div>
      </section>

      {/* Story Section */}
      <Section id="about-story">
        <div className="py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <EditableImg
                regionKey="about.img1"
                fallback="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop"
                className="w-full aspect-[4/3] object-cover shadow-2xl"
                style={{ borderRadius: `${theme.borderRadius * 2}px` }}
              />
            </div>
            <div className="space-y-6">
              <EditableText
                as="h2"
                regionKey="about.storyTitle"
                fallback="Our Story"
                className="text-4xl font-black tracking-tight"
              />
              <EditableText
                as="p"
                regionKey="about.storyDesc1"
                fallback="Founded with a vision to revolutionize business consulting, Elite has grown from a small startup to a global leader in strategic business solutions."
                className="text-lg opacity-70 leading-relaxed"
              />
              <EditableText
                as="p"
                regionKey="about.storyDesc2"
                fallback="Our team of experienced consultants brings decades of combined expertise across industries, helping businesses of all sizes achieve their goals."
                className="text-lg opacity-70 leading-relaxed"
              />
            </div>
          </div>
        </div>
      </Section>

      {/* Values Section */}
      <Section id="about-values" bgType="secondary">
        <div className="py-20">
          <div className="text-center mb-16">
            <EditableText
              as="h2"
              regionKey="about.valuesTitle"
              fallback="Our Core Values"
              className="text-4xl font-black tracking-tight mb-4"
            />
            <EditableText
              as="p"
              regionKey="about.valuesSubtitle"
              fallback="The principles that guide everything we do"
              className="text-lg opacity-70"
            />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Excellence", desc: "We strive for excellence in every project" },
              { title: "Innovation", desc: "Embracing cutting-edge solutions" },
              { title: "Integrity", desc: "Honest and transparent in all dealings" },
              { title: "Collaboration", desc: "Working together for success" }
            ].map((value, idx) => (
              <div key={idx} className="text-center p-6">
                <div
                  className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full text-2xl font-black"
                  style={{ backgroundColor: theme.primaryColor, color: "#fff" }}
                >
                  {idx + 1}
                </div>
                <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                <p className="opacity-70 text-sm">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Team Section */}
      <Section id="about-team">
        <div className="py-20">
          <div className="text-center mb-16">
            <EditableText
              as="h2"
              regionKey="about.teamTitle"
              fallback="Meet Our Leadership"
              className="text-4xl font-black tracking-tight mb-4"
            />
            <EditableText
              as="p"
              regionKey="about.teamSubtitle"
              fallback="Expert professionals dedicated to your success"
              className="text-lg opacity-70"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((member) => (
              <div key={member} className="text-center group">
                <EditableImg
                  regionKey={`about.teamImg${member}`}
                  fallback={`https://images.unsplash.com/photo-${member === 1 ? '1560250097-0b93528c311a' : member === 2 ? '1573496359142-b8d87734a5a2' : '1519084583320-bf568e9804c0'}?w=400&auto=format&fit=crop`}
                  className="w-full aspect-square object-cover mb-4 group-hover:scale-105 transition-transform"
                  style={{ borderRadius: `${theme.borderRadius * 2}px` }}
                />
                <h3 className="text-xl font-bold">Team Member {member}</h3>
                <p className="opacity-70 text-sm">Executive Position</p>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </div>
  );

  // --- 💼 SERVICES VIEW ---
  const ServicesView = () => (
    <div className="animate-in fade-in duration-700">
      {/* Hero */}
      <section
        className="py-20 px-6"
        style={{ backgroundColor: theme.secondaryColor }}
      >
        <div className="max-w-7xl mx-auto text-center">
          <EditableText
            as="h1"
            regionKey="services.heroTitle"
            fallback="Our Services"
            className="text-5xl md:text-6xl font-black tracking-tight mb-4"
          />
          <EditableText
            as="p"
            regionKey="services.heroSubtitle"
            fallback="Comprehensive solutions tailored to your needs"
            className="text-xl opacity-70"
          />
        </div>
      </section>

      {/* Services Grid */}
      <Section id="services-list">
        <div className="py-20">
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: "📈",
                title: "Business Consulting",
                desc: "Strategic guidance to optimize operations and drive growth",
                features: ["Market Analysis", "Process Optimization", "Growth Strategy"]
              },
              {
                icon: "💡",
                title: "Digital Transformation",
                desc: "Modernize your business with cutting-edge technology",
                features: ["Technology Integration", "Digital Strategy", "Automation"]
              },
              {
                icon: "📊",
                title: "Financial Planning",
                desc: "Expert financial advice for sustainable success",
                features: ["Budget Planning", "Investment Strategy", "Risk Management"]
              },
              {
                icon: "👥",
                title: "Human Resources",
                desc: "Build and manage your most valuable asset - your people",
                features: ["Talent Acquisition", "Training Programs", "Performance Management"]
              },
              {
                icon: "🎯",
                title: "Marketing Strategy",
                desc: "Elevate your brand and reach your target audience",
                features: ["Brand Development", "Digital Marketing", "Content Strategy"]
              },
              {
                icon: "🔒",
                title: "Risk Management",
                desc: "Protect your business from potential threats",
                features: ["Risk Assessment", "Compliance", "Security Planning"]
              }
            ].map((service, idx) => (
              <div
                key={idx}
                className="p-8 hover:shadow-2xl transition-all duration-300 group"
                style={{
                  backgroundColor: `${theme.primaryColor}05`,
                  borderRadius: `${theme.borderRadius * 2}px`,
                  border: `1px solid ${theme.primaryColor}20`
                }}
              >
                <div className="text-5xl mb-4">{service.icon}</div>
                <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                <p className="opacity-70 mb-6 leading-relaxed">{service.desc}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, fidx) => (
                    <li key={fidx} className="flex items-center gap-2 text-sm">
                      <span style={{ color: theme.primaryColor }}>✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Process Section */}
      <Section id="services-process" bgType="primary">
        <div className="py-20">
          <div className="text-center mb-16">
            <EditableText
              as="h2"
              regionKey="services.processTitle"
              fallback="Our Process"
              className="text-4xl font-black tracking-tight mb-4"
            />
            <EditableText
              as="p"
              regionKey="services.processSubtitle"
              fallback="How we deliver exceptional results"
              className="text-lg opacity-80"
            />
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Discovery", desc: "Understanding your needs" },
              { step: "02", title: "Strategy", desc: "Creating customized solutions" },
              { step: "03", title: "Implementation", desc: "Executing with precision" },
              { step: "04", title: "Support", desc: "Ongoing guidance & optimization" }
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="text-6xl font-black opacity-20 mb-4">{item.step}</div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="opacity-80 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section id="services-cta">
        <div className="py-20 text-center">
          <EditableText
            as="h2"
            regionKey="services.ctaTitle"
            fallback="Ready to Get Started?"
            className="text-4xl font-black tracking-tight mb-6"
          />
          <button
            className="px-12 py-5 font-bold uppercase tracking-widest text-sm shadow-xl hover:scale-105 transition-all"
            style={{ backgroundColor: theme.primaryColor, color: "#fff", borderRadius: `${theme.borderRadius}px` }}
            onClick={() => setActivePage("contact")}
          >
            <EditableText regionKey="services.ctaBtn" fallback="Schedule a Consultation" />
          </button>
        </div>
      </Section>
    </div>
  );

  // --- 📰 BLOG VIEW ---
  const BlogView = () => {
    const blogPosts = [
      {
        id: 1,
        title: "10 Strategies for Business Growth in 2026",
        excerpt: "Discover the latest strategies to accelerate your business growth in the modern economy.",
        date: "April 15, 2026",
        author: "Sarah Johnson",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop"
      },
      {
        id: 2,
        title: "The Future of Digital Transformation",
        excerpt: "Explore how emerging technologies are reshaping the business landscape.",
        date: "April 10, 2026",
        author: "Michael Chen",
        image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&auto=format&fit=crop"
      },
      {
        id: 3,
        title: "Building a High-Performance Team",
        excerpt: "Learn the secrets to creating and managing teams that deliver exceptional results.",
        date: "April 5, 2026",
        author: "Emily Rodriguez",
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop"
      }
    ];

    return (
      <div className="animate-in fade-in duration-700">
        {/* Hero */}
        <section
          className="py-20 px-6"
          style={{ backgroundColor: theme.secondaryColor }}
        >
          <div className="max-w-7xl mx-auto text-center">
            <EditableText
              as="h1"
              regionKey="blog.heroTitle"
              fallback="Insights & Resources"
              className="text-5xl md:text-6xl font-black tracking-tight mb-4"
            />
            <EditableText
              as="p"
              regionKey="blog.heroSubtitle"
              fallback="Stay updated with the latest business trends and strategies"
              className="text-xl opacity-70"
            />
          </div>
        </section>

        {/* Blog Posts */}
        <Section id="blog-posts">
          <div className="py-20">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <article
                  key={post.id}
                  className="group cursor-pointer"
                  style={{ borderRadius: `${theme.borderRadius * 2}px` }}
                >
                  <div className="overflow-hidden mb-4" style={{ borderRadius: `${theme.borderRadius * 2}px` }}>
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="space-y-3">
                    <div className="text-xs opacity-60">{post.date} • {post.author}</div>
                    <h3 className="text-xl font-bold group-hover:opacity-80 transition-opacity">{post.title}</h3>
                    <p className="opacity-70 text-sm leading-relaxed">{post.excerpt}</p>
                    <button
                      className="text-sm font-bold uppercase tracking-widest hover:opacity-80 transition-opacity"
                      style={{ color: theme.primaryColor }}
                    >
                      Read More →
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </Section>

        {/* Newsletter */}
        <Section id="blog-newsletter" bgType="secondary">
          <div className="py-20">
            <div className="max-w-2xl mx-auto text-center">
              <EditableText
                as="h2"
                regionKey="blog.newsletterTitle"
                fallback="Subscribe to Our Newsletter"
                className="text-3xl font-black tracking-tight mb-4"
              />
              <EditableText
                as="p"
                regionKey="blog.newsletterDesc"
                fallback="Get the latest insights delivered straight to your inbox"
                className="opacity-70 mb-8"
              />
              <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-3 bg-transparent border-2 outline-none focus:border-blue-500 transition-colors"
                  style={{ borderRadius: `${theme.borderRadius}px`, borderColor: `${theme.textColor}20` }}
                />
                <button
                  type="submit"
                  className="px-8 py-3 font-bold uppercase tracking-widest text-sm hover:scale-105 transition-transform"
                  style={{ backgroundColor: theme.primaryColor, color: "#fff", borderRadius: `${theme.borderRadius}px` }}
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </Section>
      </div>
    );
  };

  // --- 📬 CONTACT VIEW ---
  const ContactView = () => {
    const [formData, setFormData] = useState({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
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
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (res.ok) {
          setStatus("success");
          setFormData({ name: "", email: "", subject: "", message: "" });
          setTimeout(() => setStatus("idle"), 5000);
        } else {
          throw new Error();
        }
      } catch (err) {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 5000);
      }
    };

    return (
      <div className="animate-in fade-in duration-700">
        {/* Hero */}
        <section
          className="py-20 px-6"
          style={{ backgroundColor: theme.secondaryColor }}
        >
          <div className="max-w-7xl mx-auto text-center">
            <EditableText
              as="h1"
              regionKey="contact.heroTitle"
              fallback="Get In Touch"
              className="text-5xl md:text-6xl font-black tracking-tight mb-4"
            />
            <EditableText
              as="p"
              regionKey="contact.heroSubtitle"
              fallback="We'd love to hear from you. Let's start a conversation."
              className="text-xl opacity-70"
            />
          </div>
        </section>

        <Section id="contact-content">
          <div className="py-20">
            <div className="grid lg:grid-cols-2 gap-16">
              {/* Contact Info */}
              <div className="space-y-8">
                <div>
                  <EditableText
                    as="h2"
                    regionKey="contact.infoTitle"
                    fallback="Contact Information"
                    className="text-3xl font-black tracking-tight mb-6"
                  />
                  <EditableText
                    as="p"
                    regionKey="contact.infoDesc"
                    fallback="Fill out the form and our team will get back to you within 24 hours."
                    className="opacity-70 leading-relaxed"
                  />
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${theme.primaryColor}20`, borderRadius: `${theme.borderRadius}px` }}
                    >
                      <span className="text-2xl">📍</span>
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">Address</h4>
                      <EditableText
                        regionKey="contact.address"
                        fallback="123 Business Avenue, Suite 100&#10;New York, NY 10001"
                        className="opacity-70 text-sm whitespace-pre-line"
                      />
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${theme.primaryColor}20`, borderRadius: `${theme.borderRadius}px` }}
                    >
                      <span className="text-2xl">📧</span>
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">Email</h4>
                      <EditableText regionKey="contact.email" fallback="contact@elite-business.com" className="opacity-70 text-sm" />
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${theme.primaryColor}20`, borderRadius: `${theme.borderRadius}px` }}
                    >
                      <span className="text-2xl">📞</span>
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">Phone</h4>
                      <EditableText regionKey="contact.phone" fallback="+1 (555) 123-4567" className="opacity-70 text-sm" />
                    </div>
                  </div>
                </div>

                <div className="pt-8">
                  <EditableImg
                    regionKey="contact.mapImage"
                    fallback="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&auto=format&fit=crop"
                    className="w-full aspect-video object-cover shadow-lg"
                    style={{ borderRadius: `${theme.borderRadius * 2}px` }}
                  />
                </div>
              </div>

              {/* Contact Form */}
              <div
                className="p-8"
                style={{
                  backgroundColor: `${theme.primaryColor}05`,
                  borderRadius: `${theme.borderRadius * 3}px`
                }}
              >
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold mb-2">Name *</label>
                      <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-transparent border-2 outline-none focus:border-blue-500 transition-colors"
                        style={{ borderRadius: `${theme.borderRadius}px`, borderColor: `${theme.textColor}20` }}
                        required
                        disabled={status === "loading"}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-transparent border-2 outline-none focus:border-blue-500 transition-colors"
                        style={{ borderRadius: `${theme.borderRadius}px`, borderColor: `${theme.textColor}20` }}
                        required
                        disabled={status === "loading"}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2">Subject *</label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-transparent border-2 outline-none focus:border-blue-500 transition-colors"
                      style={{ borderRadius: `${theme.borderRadius}px`, borderColor: `${theme.textColor}20` }}
                      required
                      disabled={status === "loading"}
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="consulting">Business Consulting</option>
                      <option value="partnership">Partnership</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2">Message *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      className="w-full px-4 py-3 bg-transparent border-2 outline-none focus:border-blue-500 transition-colors resize-none"
                      style={{ borderRadius: `${theme.borderRadius}px`, borderColor: `${theme.textColor}20` }}
                      required
                      disabled={status === "loading"}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === "loading" || !formspreeEndpoint}
                    className={`w-full py-4 font-bold uppercase tracking-widest text-sm transition-all ${status === "loading" || !formspreeEndpoint
                        ? "opacity-60 cursor-not-allowed"
                        : "hover:scale-105 active:scale-95"
                      }`}
                    style={{
                      backgroundColor: theme.primaryColor,
                      color: "#fff",
                      borderRadius: `${theme.borderRadius}px`,
                    }}
                  >
                    {status === "loading" ? "Sending..." : "Send Message"}
                  </button>

                  {status === "success" && (
                    <p className="text-green-500 text-sm font-medium text-center">
                      ✓ Message sent successfully! We'll get back to you soon.
                    </p>
                  )}
                  {status === "error" && (
                    <p className="text-red-500 text-sm font-medium text-center">
                      ❌ Something went wrong. Please try again.
                    </p>
                  )}
                </form>
              </div>
            </div>
          </div>
        </Section>
      </div>
    );
  };

  // --- 🎬 MAIN RENDER ---
  return (
    <main
      className="min-h-screen selection:bg-blue-500 selection:text-white"
      style={{ fontFamily: theme.fontFamily, backgroundColor: theme.backgroundColor }}
    >
      {!isPublished && (
        <Script
          src="https://upload-widget.cloudinary.com/global/all.js"
          strategy="lazyOnload"
        />
      )}

      {isPublished && (
        <style>{`
          [contenteditable] {
            pointer-events: none !important;
            user-select: none !important;
            outline: none !important;
            -webkit-user-modify: read-only !important;
          }
        `}</style>
      )}

      <Navbar />

      <div className="flex flex-col w-full">
        {isPublished ? (
          <>
          <div id="clyra-page-home" style={{display: activePage === 'home' ? 'block' : 'none'}}><HomeView /></div>
          <div id="clyra-page-about" style={{display: activePage === 'about' ? 'block' : 'none'}}><AboutView /></div>
          <div id="clyra-page-services" style={{display: activePage === 'services' ? 'block' : 'none'}}><ServicesView /></div>
          <div id="clyra-page-blog" style={{display: activePage === 'blog' ? 'block' : 'none'}}><BlogView /></div>
          <div id="clyra-page-contact" style={{display: activePage === 'contact' ? 'block' : 'none'}}><ContactView /></div>
          </>
        ) : (
          <>
          {activePage === "home" && <HomeView />}
          {activePage === "about" && <AboutView />}
          {activePage === "services" && <ServicesView />}
          {activePage === "blog" && <BlogView />}
          {activePage === "contact" && <ContactView />}
          </>
        )}
      </div>

      <Footer />

      <style>{`
        html { scroll-behavior: smooth; }
        ${!isPublished ? `[contenteditable]:focus { outline: none; background: rgba(0,0,0,0.02); }` : ""}
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
