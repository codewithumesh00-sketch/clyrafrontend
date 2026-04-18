import type { Block } from "@/store/useEditorBlocks";

export const sectionLibrary: Record<string, Block[]> = {
  hero: [
    {
      id: crypto.randomUUID(),
      type: "cta",
      content: "🚀 Start Building with clyraweb",
    },
    {
      id: crypto.randomUUID(),
      type: "image",
      content: "",
    },
  ],

  features: [
    {
      id: crypto.randomUUID(),
      type: "faq",
      content: "⚡ Lightning-fast AI website generation",
    },
    {
      id: crypto.randomUUID(),
      type: "faq",
      content: "🎨 Full design customization",
    },
    {
      id: crypto.randomUUID(),
      type: "faq",
      content: "📦 Export-ready code",
    },
  ],

  pricing: [
    {
      id: crypto.randomUUID(),
      type: "cta",
      content: "💎 Pro Plan - ₹999/month",
    },
    {
      id: crypto.randomUUID(),
      type: "cta",
      content: "🚀 Business Plan - ₹2999/month",
    },
  ],

  testimonials: [
    {
      id: crypto.randomUUID(),
      type: "faq",
      content: "⭐ clyraweb helped us launch in 1 day",
    },
    {
      id: crypto.randomUUID(),
      type: "faq",
      content: "🔥 Better than manual coding",
    },
  ],

  team: [
    {
      id: crypto.randomUUID(),
      type: "faq",
      content: "👨‍💻 Umesh - Founder & Full Stack Engineer",
    },
    {
      id: crypto.randomUUID(),
      type: "faq",
      content: "🎨 AI Design Team",
    },
  ],

  footer: [
    {
      id: crypto.randomUUID(),
      type: "faq",
      content: "© 2026 clyraweb. All rights reserved.",
    },
  ],
};