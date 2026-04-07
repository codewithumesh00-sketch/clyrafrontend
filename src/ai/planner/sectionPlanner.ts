export function sectionPlanner(page: string, industry: string) {
  const text = industry.toLowerCase();

  /* ================= SMART HERO ================= */
  let heroVariant = "v1";

  if (text.includes("travel")) heroVariant = "v2";
  else if (text.includes("saas") || text.includes("software") || text.includes("ai"))
    heroVariant = "v4";
  else if (text.includes("furniture") || text.includes("chair"))
    heroVariant = "v3";
  else if (text.includes("real estate") || text.includes("property"))
    heroVariant = "v5";

  /* ================= SMART FEATURES ================= */
  let featureVariant = "v1";

  if (text.includes("travel")) featureVariant = "v2";
  else if (text.includes("saas")) featureVariant = "v4";
  else if (text.includes("furniture")) featureVariant = "v5";

  /* ================= SMART PRICING ================= */
  let pricingVariant = "v1";

  if (text.includes("travel")) pricingVariant = "v2";
  else if (text.includes("saas")) pricingVariant = "v4";
  else if (text.includes("furniture")) pricingVariant = "v3";

  const base = [
    { type: "navbar", variant: "v1" },
    { type: "hero", variant: heroVariant },
  ];

  const extra: Record<string, any[]> = {
    home: [
      { type: "features", variant: featureVariant },
      { type: "pricing", variant: pricingVariant },
      { type: "testimonials", variant: "v1" },
      { type: "footer", variant: "v1" },
    ],

    destinations: [
      { type: "features", variant: "v2" },
      { type: "testimonials", variant: "v2" },
      { type: "footer", variant: "v1" },
    ],

    packages: [
      { type: "pricing", variant: "v2" },
      { type: "testimonials", variant: "v1" },
      { type: "footer", variant: "v1" },
    ],

    features: [
      { type: "features", variant: featureVariant },
      { type: "pricing", variant: pricingVariant },
      { type: "footer", variant: "v1" },
    ],

    pricing: [
      { type: "pricing", variant: pricingVariant },
      { type: "testimonials", variant: "v1" },
      { type: "footer", variant: "v1" },
    ],

    testimonials: [
      { type: "testimonials", variant: "v2" },
      { type: "footer", variant: "v1" },
    ],
  };

  return [...base, ...(extra[page] || extra.home)];
}