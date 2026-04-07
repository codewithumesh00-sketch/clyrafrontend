import dynamic from "next/dynamic";
import type { ComponentType } from "react";

/* ================= LAYOUT ================= */
const Navbar = dynamic(() => import("@/components/layout/Navbar"));
const Footer = dynamic(() => import("@/components/layout/Footer"));

/* ================= HERO ================= */
const HeroV1 = dynamic(() => import("@/components/sections/hero/HeroV1"));
const HeroV2 = dynamic(() => import("@/components/sections/hero/HeroV2"));
const HeroV3 = dynamic(() => import("@/components/sections/hero/HeroV3"));
const HeroV4 = dynamic(() => import("@/components/sections/hero/HeroV4"));
const HeroV5 = dynamic(() => import("@/components/sections/hero/HeroV5"));
const HeroV6 = dynamic(() => import("@/components/sections/hero/HeroV6"));

/* ================= FEATURES ================= */
const FeaturesV1 = dynamic(
  () => import("@/components/sections/features/FeaturesV1")
);
const FeaturesV2 = dynamic(
  () => import("@/components/sections/features/FeaturesV2")
);
const FeaturesV3 = dynamic(
  () => import("@/components/sections/features/FeaturesV3")
);
const FeaturesV4 = dynamic(
  () => import("@/components/sections/features/FeaturesV4")
);
const FeaturesV5 = dynamic(
  () => import("@/components/sections/features/FeaturesV5")
);

/* ================= FAQ ================= */
const FaqV1 = dynamic(() => import("@/components/sections/faq/faqV1"));
const FaqV2 = dynamic(() => import("@/components/sections/faq/faqV2"));
const FaqV3 = dynamic(() => import("@/components/sections/faq/faqV3"));
const FaqV4 = dynamic(() => import("@/components/sections/faq/faqV4"));
const FaqV5 = dynamic(() => import("@/components/sections/faq/faqV5"));

/* ================= PRICING ================= */
const PricingV1 = dynamic(
  () => import("@/components/sections/pricing/PricingV1")
);
const PricingV2 = dynamic(
  () => import("@/components/sections/pricing/PricingV2")
);
const PricingV3 = dynamic(
  () => import("@/components/sections/pricing/PricingV3")
);
const PricingV4 = dynamic(
  () => import("@/components/sections/pricing/PricingV4")
);
const PricingV5 = dynamic(
  () => import("@/components/sections/pricing/PricingV5")
);

/* ================= CTA ================= */
const CtaV1 = dynamic(() => import("@/components/sections/cta/ctaV1"));
const CtaV2 = dynamic(() => import("@/components/sections/cta/ctaV2"));

/* ================= TESTIMONIALS ================= */
const TestimonialsV1 = dynamic(
  () => import("@/components/sections/testimonials/testimonialsV1")
);
const TestimonialsV2 = dynamic(
  () => import("@/components/sections/testimonials/testimonialsV2")
);

export type BlockKey =
  | "navbar:v1"
  | "footer:v1"
  | "hero:v1"
  | "hero:v2"
  | "hero:v3"
  | "hero:v4"
  | "hero:v5"
  | "hero:v6"
  | "features:v1"
  | "features:v2"
  | "features:v3"
  | "features:v4"
  | "features:v5"
  | "faq:v1"
  | "faq:v2"
  | "faq:v3"
  | "faq:v4"
  | "faq:v5"
  | "pricing:v1"
  | "pricing:v2"
  | "pricing:v3"
  | "pricing:v4"
  | "pricing:v5"
  | "cta:v1"
  | "cta:v2"
  | "testimonials:v1"
  | "testimonials:v2";

export type BlockComponent = ComponentType<any>;

export const blockRegistry: Record<BlockKey, BlockComponent> = {
  /* Layout */
  "navbar:v1": Navbar,
  "footer:v1": Footer,

  /* Hero */
  "hero:v1": HeroV1,
  "hero:v2": HeroV2,
  "hero:v3": HeroV3,
  "hero:v4": HeroV4,
  "hero:v5": HeroV5,
  "hero:v6": HeroV6,

  /* Features */
  "features:v1": FeaturesV1,
  "features:v2": FeaturesV2,
  "features:v3": FeaturesV3,
  "features:v4": FeaturesV4,
  "features:v5": FeaturesV5,

  /* FAQ */
  "faq:v1": FaqV1,
  "faq:v2": FaqV2,
  "faq:v3": FaqV3,
  "faq:v4": FaqV4,
  "faq:v5": FaqV5,

  /* Pricing */
  "pricing:v1": PricingV1,
  "pricing:v2": PricingV2,
  "pricing:v3": PricingV3,
  "pricing:v4": PricingV4,
  "pricing:v5": PricingV5,

  /* CTA */
  "cta:v1": CtaV1,
  "cta:v2": CtaV2,

  /* Testimonials */
  "testimonials:v1": TestimonialsV1,
  "testimonials:v2": TestimonialsV2,
};

export function resolveBlock(type: string, variant: string) {
  const key = `${type}:${variant}` as BlockKey;
  return blockRegistry[key] ?? null;
}