export function generateSectionContent(prompt = "", type = "hero", variant = "v1") {
  const text = prompt.toLowerCase();

  const niche = detectNiche(text);

  switch (type) {
    case "hero":
      return generateHeroContent(niche, variant);

    case "features":
      return generateFeaturesContent(niche);

    case "testimonials":
      return generateTestimonialsContent(niche);

    case "pricing":
      return generatePricingContent(niche);

    case "faq":
      return generateFaqContent(niche);

    case "cta":
      return generateCTAContent(niche);

    case "footer":
      return generateFooterContent(niche);

    default:
      return {};
  }
}

/* ================= NICHE DETECTOR ================= */
function detectNiche(text) {
  if (text.includes("real estate")) return "realEstate";
  if (text.includes("saas") || text.includes("software")) return "saas";
  if (text.includes("agency")) return "agency";
  if (text.includes("portfolio")) return "portfolio";
  if (text.includes("restaurant")) return "restaurant";
  if (text.includes("ecommerce")) return "ecommerce";
  return "default";
}

/* ================= HERO CONTENT ================= */
function generateHeroContent(niche, variant) {
  const heroMap = {
    realEstate: {
      title: "Find Your Dream Property",
      subtitle:
        "Luxury villas, premium apartments, and investment-ready homes in prime locations.",
      buttonText: "Explore Properties",
    },
    saas: {
      title: "Scale Your Business with Smart SaaS",
      subtitle:
        "AI-powered workflows, automation, and growth tools built for modern startups.",
      buttonText: "Start Free Trial",
    },
    agency: {
      title: "Grow Your Brand with a Creative Agency",
      subtitle:
        "Stunning design systems, marketing funnels, and conversion-first experiences.",
      buttonText: "Book Strategy Call",
    },
    portfolio: {
      title: "Designing Digital Experiences That Convert",
      subtitle:
        "A modern portfolio showcasing creativity, development, and brand systems.",
      buttonText: "View Projects",
    },
    restaurant: {
      title: "Taste the Best Food in Town",
      subtitle:
        "Fresh ingredients, chef-crafted menus, and unforgettable dining experiences.",
      buttonText: "Book a Table",
    },
    ecommerce: {
      title: "Shop Premium Products Online",
      subtitle:
        "Fast delivery, secure checkout, and curated collections for modern shoppers.",
      buttonText: "Shop Now",
    },
    default: {
      title: "Build Modern Websites Instantly",
      subtitle:
        "AI-generated layouts, reusable blocks, and export-ready production code.",
      buttonText: "Get Started",
    },
  };

  return {
    ...heroMap[niche],
    variant,
  };
}

/* ================= FEATURES ================= */
function generateFeaturesContent(niche) {
  const map = {
    realEstate: {
      title: "Why clients trust our properties",
      subtitle: "Premium listings built for lifestyle and long-term investment.",
      items: [
        {
          title: "Prime Locations",
          description: "Verified homes in top city zones and fast-growing areas.",
        },
        {
          title: "High ROI",
          description: "Properties selected for strong rental and resale value.",
        },
        {
          title: "Trusted Advisors",
          description: "Expert agents guiding every step.",
        },
        {
          title: "Luxury Interiors",
          description: "Designer-ready spaces with modern architecture.",
        },
      ],
    },

    saas: {
      title: "Everything your SaaS needs",
      subtitle: "Modern systems designed for scale and growth.",
      items: [
        {
          title: "AI Automation",
          description: "Reduce manual work with smart workflows.",
        },
        {
          title: "Real-time Analytics",
          description: "Track user behavior and revenue instantly.",
        },
        {
          title: "Secure APIs",
          description: "Enterprise-grade integrations.",
        },
        {
          title: "Fast Deployment",
          description: "Ship product experiences quickly.",
        },
      ],
    },

    default: {
      title: "Powerful features",
      subtitle: "Everything needed to build premium websites faster.",
      items: [
        {
          title: "Dynamic Sections",
          description: "Reusable blocks powered by AI prompts.",
        },
        {
          title: "Live Editing",
          description: "Visual editor synced with schema rendering.",
        },
        {
          title: "Export Ready",
          description: "Download production-ready Next.js code.",
        },
        {
          title: "Theme Engine",
          description: "Automatic color system generation.",
        },
      ],
    },
  };

  return map[niche] || map.default;
}

/* ================= TESTIMONIALS ================= */
function generateTestimonialsContent(niche) {
  return {
    title: "Loved by growing brands",
    items: [
      {
        name: "Sarah Johnson",
        role: "Founder",
        quote: "This platform transformed our online presence completely.",
      },
      {
        name: "Michael Lee",
        role: "CEO",
        quote: "The AI-generated layouts saved us weeks of design work.",
      },
    ],
  };
}

/* ================= PRICING ================= */
function generatePricingContent() {
  return {
    title: "Simple pricing",
    plans: [
      {
        name: "Starter",
        price: "$19",
        features: ["1 website", "AI blocks", "Basic export"],
      },
      {
        name: "Pro",
        price: "$49",
        features: ["Unlimited pages", "Advanced themes", "Full export"],
      },
    ],
  };
}

/* ================= FAQ ================= */
function generateFaqContent() {
  return {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "Can I export the code?",
        answer: "Yes, full production-ready Next.js export is included.",
      },
      {
        question: "Can AI generate multiple pages?",
        answer: "Yes, landing, about, services, pricing, blog, and more.",
      },
    ],
  };
}

/* ================= CTA ================= */
function generateCTAContent() {
  return {
    title: "Ready to launch your next website?",
    subtitle: "Generate, customize, and export in minutes.",
    buttonText: "Start Building",
  };
}

/* ================= FOOTER ================= */
function generateFooterContent() {
  return {
    copyright: "© 2026 Clyra AI. All rights reserved.",
    links: ["About", "Pricing", "Contact", "Privacy"],
  };
}