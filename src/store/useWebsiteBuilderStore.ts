// D:\clyraui\frontend\src\store\useWebsiteBuilderStore.ts
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

/* ================================
   ✅ TYPES: TEMPLATE-FIRST ARCHITECTURE
================================ */

export type TemplateCategory =
  | "ecommerce"
  | "saas"
  | "business"
  | "portfolio"
  | "blog"
  | "landing"
  | "personal";

export type TemplateSchema = {
  category: TemplateCategory;
  templateId: string;
  prompt: string;
  styleMode?: "minimal" | "luxury" | "bold" | "playful" | "corporate";
  brandColors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
    text?: string;
  };

  // ✅ Universal editable data layer — template regions only
  editableData: {
    // 🧭 Global layout regions
    navbar?: {
      logo?: string;
      links?: Array<{ label: string; href: string }>;
      cta?: { label: string; href: string };
      style?: "transparent" | "solid" | "floating";
    };
    footer?: {
      columns?: Array<{
        title: string;
        links: Array<{ label: string; href: string }>;
      }>;
      social?: Array<{ platform: string; url: string }>;
      copyright?: string;
    };
    hero?: Record<string, any>;

    // 🛒 E-commerce regions
    products?: Array<{
      id: string;
      title: string;
      description: string;
      price: number;
      originalPrice?: number;
      image?: string;
      images?: string[];
      category: string;
      tags?: string[];
      rating?: number;
      reviews?: number;
      badge?: string;
      features?: string[];
      inStock?: boolean;
      slug: string;
    }>;
    collections?: Array<{
      id: string;
      title: string;
      description: string;
      image?: string;
      productIds: string[];
      slug: string;
    }>;
    cart?: {
      items: Array<{
        productId: string;
        quantity: number;
        variant?: string;
      }>;
      discountCode?: string;
      shippingMethod?: "standard" | "express" | "overnight";
    };

    // ✍️ Blog CMS regions
    blog?: {
      title?: string;
      description?: string;
      posts: Array<{
        id: string;
        title: string;
        excerpt: string;
        content?: string;
        image?: string;
        author?: {
          name: string;
          avatar?: string;
          role?: string;
        };
        publishedAt?: string;
        category?: string;
        tags?: string[];
        slug: string;
        featured?: boolean;
      }>;
      categories?: string[];
    };

    // 💼 SaaS/Business regions
    features?: Array<{
      id: string;
      icon?: string;
      title: string;
      description: string;
      cta?: { label: string; href: string };
    }>;
    pricing?: Array<{
      id: string;
      name: string;
      price: number;
      period: "month" | "year";
      features: string[];
      cta: { label: string; href: string };
      popular?: boolean;
    }>;
    testimonials?: Array<{
      id: string;
      name: string;
      role: string;
      company?: string;
      avatar?: string;
      text: string;
      rating?: number;
    }>;

    // 🎨 Portfolio regions
    projects?: Array<{
      id: string;
      title: string;
      description: string;
      image?: string;
      images?: string[];
      category: string;
      link?: string;
      technologies?: string[];
      slug: string;
    }>;

    // 📝 Extensible custom regions
    [key: string]: any;
  };

  metadata?: Record<string, any>;
};

export type SelectedRegion = string | null;

/* ================================
   ✅ STORE INTERFACE
================================ */

type TemplateBuilderStore = {
  // 🧠 Core state
  schema: TemplateSchema;
  selectedRegion: SelectedRegion;
  currentPage: string;

  // ♻️ Undo/Redo
  history: TemplateSchema[];
  future: TemplateSchema[];
  maxHistorySize: number;

  // ⚙️ Actions
  setSchema: (schema: TemplateSchema) => void;
  setSelectedRegion: (region: string | null) => void;
  setCurrentPage: (page: string) => void;
  updateRegion: (path: string, value: any) => void;
  undo: () => void;
  redo: () => void;
  clearHistory: () => void;
  loadTemplate: (category: TemplateCategory, templateId: string) => void;
  resetToDefault: () => void;
};

/* ================================
   ✅ STORAGE UTILS — CLEAN SYNC
================================ */
const STORAGE_KEY = "clyra-template-schema";

const saveSchemaToStorage = (schema: TemplateSchema) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(schema));
  } catch (error) {
    console.warn("Failed to save schema:", error);
  }
};

const loadSchemaFromStorage = (): TemplateSchema | null => {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as TemplateSchema) : null;
  } catch (error) {
    console.warn("Failed to load schema:", error);
    return null;
  }
};

/* ================================
   ✅ DEFAULT SCHEMA FACTORY
================================ */
const getDefaultSchema = (
  category: TemplateCategory = "ecommerce",
  templateId: string = "template1"
): TemplateSchema => ({
  category,
  templateId,
  prompt: "",
  styleMode: "luxury",
  brandColors: {
    primary: "#F59E0B",
    secondary: "#1F2937",
    accent: "#10B981",
    background: "#000000",
    text: "#FFFFFF",
  },
  editableData: {
    navbar: {
      logo: "/logo.svg",
      links: [
        { label: "Home", href: "/" },
        { label: "Shop", href: "/shop" },
        { label: "About", href: "/about" },
        { label: "Contact", href: "/contact" },
      ],
      cta: { label: "Get Started", href: "/signup" },
      style: "transparent",
    },
    footer: {
      columns: [
        {
          title: "Product",
          links: [
            { label: "Features", href: "/features" },
            { label: "Pricing", href: "/pricing" },
          ],
        },
        {
          title: "Company",
          links: [
            { label: "About", href: "/about" },
            { label: "Contact", href: "/contact" },
          ],
        },
      ],
      social: [
        { platform: "twitter", url: "https://twitter.com" },
        { platform: "instagram", url: "https://instagram.com" },
      ],
      copyright: "© 2026 Clyra. All rights reserved.",
    },
    hero: {
      title: "Define Your Elegance.",
      subtitle: "Curation of Excellence",
      ctaText: "SHOP COLLECTION",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=2000",
      styleMode: "minimal",
    },
    products: [],
    collections: [],
    blog: {
      title: "Latest Journal",
      description: "Latest updates, tips, and inspiration",
      posts: [],
      categories: ["All", "Design", "Technology", "Business", "Lifestyle"],
    },
    features: [],
    pricing: [],
    testimonials: [],
    projects: [],
  },
  metadata: {
    generatedAt: new Date().toISOString(),
    version: 1,
    lastModified: new Date().toISOString(),
  },
});

/* ================================
   ✅ ZUSTAND STORE — PURE & CLEAN
================================ */
export const useWebsiteBuilderStore = create<TemplateBuilderStore>()(
  persist(
    (set, get) => ({
      // 🧠 Initial state
      schema: loadSchemaFromStorage() || getDefaultSchema(),
      selectedRegion: null,
      currentPage: "home",
      history: [],
      future: [],
      maxHistorySize: 50,

      // ✅ Set full schema
      setSchema: (schema) => {
        set((state) => {
          if (JSON.stringify(state.schema) === JSON.stringify(schema)) {
            return state;
          }
          saveSchemaToStorage(schema);
          return {
            schema,
            history: [...state.history, state.schema].slice(-state.maxHistorySize),
            future: [],
          };
        });
      },

      // ✅ Select region for editing
      setSelectedRegion: (region) => set({ selectedRegion: region }),

      // ✅ Page navigation
      setCurrentPage: (page) => set({ currentPage: page }),

      // ✨ Universal region updater — array-safe, history-aware, synced
      updateRegion: (path, value) =>
        set((state) => {
          if (!state.schema) return state;

          const nextSchema = structuredClone(state.schema);
          const keys = path.split(".");
          let target: any = nextSchema.editableData;

          for (let i = 0; i < keys.length - 1; i++) {
            const currentKey = isNaN(Number(keys[i])) ? keys[i] : Number(keys[i]);
            const nextKey = keys[i + 1];
            const shouldBeArray = !isNaN(Number(nextKey));

            if (target[currentKey] === undefined) {
              target[currentKey] = shouldBeArray ? [] : {};
            }
            target = target[currentKey];
          }

          const lastKey = isNaN(Number(keys[keys.length - 1]))
            ? keys[keys.length - 1]
            : Number(keys[keys.length - 1]);

          target[lastKey] = value;

          nextSchema.metadata = {
            ...nextSchema.metadata,
            version: (nextSchema.metadata?.version || 0) + 1,
            lastModified: new Date().toISOString(),
          };

          saveSchemaToStorage(nextSchema);

          return {
            schema: nextSchema,
            history: [...state.history, state.schema].slice(-state.maxHistorySize),
            future: [],
          };
        }),

      // ♻️ Undo
      undo: () =>
        set((state) => {
          if (state.history.length === 0) return state;
          const previous = state.history[state.history.length - 1];
          return {
            schema: previous,
            history: state.history.slice(0, -1),
            future: [state.schema, ...state.future].slice(0, state.maxHistorySize),
            selectedRegion: null,
          };
        }),

      // ♻️ Redo
      redo: () =>
        set((state) => {
          if (state.future.length === 0) return state;
          const next = state.future[0];
          return {
            schema: next,
            history: [...state.history, state.schema].slice(-state.maxHistorySize),
            future: state.future.slice(1),
            selectedRegion: null,
          };
        }),

      // 🗑️ Clear history
      clearHistory: () => set({ history: [], future: [] }),

      // 🔄 Load new template
      loadTemplate: (category, templateId) => {
        const newSchema = getDefaultSchema(category, templateId);
        set((state) => {
          saveSchemaToStorage(newSchema);
          return {
            schema: newSchema,
            history: [...state.history, state.schema].slice(-state.maxHistorySize),
            future: [],
            selectedRegion: null,
            currentPage: "home",
          };
        });
      },

      // 🔄 Reset current template
      resetToDefault: () => {
        const { category, templateId } = get().schema;
        get().loadTemplate(category, templateId);
      },
    }),
    {
      name: "clyra-template-builder-storage",
      partialize: (state) => ({
        schema: state.schema,
        currentPage: state.currentPage,
      }),
    }
  )
);

/* ================================
   ✅ CLEAN HELPER HOOKS
================================ */

// 🎯 Get value by path: "hero.title" → string
export const useRegionValue = <T = any>(path: string): T | undefined => {
  const schema = useWebsiteBuilderStore((s) => s.schema);
  const keys = path.split(".");
  let value: any = schema.editableData;

  for (const key of keys) {
    const lookup = isNaN(Number(key)) ? key : Number(key);
    value = value?.[lookup];
    if (value === undefined) break;
  }

  return value as T | undefined;
};

// 🎯 Get currently selected region data
export const useSelectedRegionData = () => {
  const { selectedRegion, schema } = useWebsiteBuilderStore();
  if (!selectedRegion) return null;

  const keys = selectedRegion.split(".");
  let value: any = schema.editableData;

  for (const key of keys) {
    const lookup = isNaN(Number(key)) ? key : Number(key);
    value = value?.[lookup];
    if (value === undefined) break;
  }

  return value;
};

// 🎯 Domain-specific selectors
export const useProducts = () =>
  useWebsiteBuilderStore((s) => s.schema.editableData.products || [])

export const useBlogPosts = () =>
  useWebsiteBuilderStore((s) => s.schema.editableData.blog?.posts || []);

export const useCollections = () =>
  useWebsiteBuilderStore((s) => s.schema.editableData.collections || []);

export const useTestimonials = () =>
  useWebsiteBuilderStore((s) => s.schema.editableData.testimonials || []);

export const usePricingPlans = () =>
  useWebsiteBuilderStore((s) => s.schema.editableData.pricing || []);