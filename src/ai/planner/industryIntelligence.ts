export function industryIntelligence(industry: string) {
  const map: Record<string, any> = {
    travel: {
      pages: ["home", "destinations", "packages", "contact"],
      sections: ["hero", "destinations", "gallery", "testimonials"],
      cta: "Book Your Dream Trip",
      theme: "light"
    },

    saas: {
      pages: ["home", "features", "pricing", "contact"],
      sections: ["hero", "features", "pricing", "faq"],
      cta: "Start Free Trial",
      theme: "dark"
    },

    furniture: {
      pages: ["home", "catalog", "custom-orders", "contact"],
      sections: ["hero", "products", "gallery", "reviews"],
      cta: "Order Custom Furniture",
      theme: "light"
    },

    restaurant: {
      pages: ["home", "menu", "gallery", "reservation"],
      sections: ["hero", "menu", "chef-special", "testimonials"],
      cta: "Reserve Your Table",
      theme: "dark"
    }
  };

  return map[industry] || map.business;
}