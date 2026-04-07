export type SectionSchema = {
  type: string;
  variant?: string | number;
  props?: Record<string, unknown>;
};

export type WebsiteSchema = {
  page: string;
  theme?: "light" | "dark";
  seo?: {
    title: string;
    description: string;
  };
  layout?: {
    navbar?: boolean;
    footer?: boolean;
  };
  sections: SectionSchema[];
};

/* ================= DEFAULT PAGE SCHEMAS ================= */
const websiteSchemas: Record<string, WebsiteSchema> = {
  home: {
    page: "home",
    theme: "dark",
    seo: {
      title: "ClyraUI - AI Website Builder",
      description: "Create stunning AI-generated websites instantly.",
    },
    layout: {
      navbar: true,
      footer: true,
    },
    sections: [
      {
        type: "hero",
        variant: "v1",
        props: {
          title: "Welcome to ClyraUI",
          subtitle: "Build AI-powered websites in minutes",
          buttonText: "Start Building",
        },
      },
      {
        type: "features",
        variant: "v1",
        props: {
          title: "Why ClyraUI",
        },
      },
      {
        type: "pricing",
        variant: "v1",
        props: {},
      },
    ],
  },

  about: {
    page: "about",
    theme: "dark",
    seo: {
      title: "About ClyraUI",
      description: "Learn more about our AI website platform.",
    },
    layout: {
      navbar: true,
      footer: true,
    },
    sections: [
      {
        type: "hero",
        variant: "v2",
        props: {
          title: "About Our Company",
          subtitle: "We build AI-powered website experiences.",
          buttonText: "Explore",
        },
      },
      {
        type: "features",
        variant: "v1",
        props: {},
      },
    ],
  },

  contact: {
    page: "contact",
    theme: "light",
    seo: {
      title: "Contact Us",
      description: "Get in touch with the ClyraUI team.",
    },
    layout: {
      navbar: true,
      footer: true,
    },
    sections: [
      {
        type: "hero",
        variant: "v3",
        props: {
          title: "Contact Us",
          subtitle: "We would love to hear from you.",
          buttonText: "Send Message",
        },
      },
      {
        type: "contact",
        variant: "v1",
        props: {},
      },
    ],
  },
};

/* ================= STATIC PAGE FETCH ================= */
export async function getWebsiteSchemaBySlug(
  slug: string
): Promise<WebsiteSchema | null> {
  return websiteSchemas[slug] ?? websiteSchemas["home"];
}

/* ================= AI DYNAMIC SCHEMA ================= */
export function createDynamicSchema(
  prompt: string,
  page: string = "home"
): WebsiteSchema {
  const text = prompt.toLowerCase();

  const isSaaS =
    text.includes("saas") ||
    text.includes("software") ||
    text.includes("ai");

  return {
    page,
    theme: "dark",
    seo: {
      title: "AI Generated Website",
      description: "Generated dynamically from prompt.",
    },
    layout: {
      navbar: true,
      footer: true,
    },
    sections: [
      {
        type: "hero",
        variant: isSaaS ? "v2" : "v1",
        props: {
          title: isSaaS
            ? "Scale Faster with AI SaaS"
            : "Build stunning websites with AI",
          subtitle:
            "Generate beautiful multi-page websites instantly using prompts.",
          buttonText: "Start Building",
        },
      },
      {
        type: "features",
        variant: "v1",
        props: {},
      },
    ],
  };
}

/* ================= INDUSTRY DETECTION ================= */
export function detectIndustry(
  prompt: string
): "furniture" | "real-estate" | "gym" | "restaurant" | "saas" | "generic" {
  const text = prompt.toLowerCase();

  if (
    text.includes("chair") ||
    text.includes("table") ||
    text.includes("furniture") ||
    text.includes("sofa")
  ) {
    return "furniture";
  }

  if (
    text.includes("property") ||
    text.includes("real estate") ||
    text.includes("villa") ||
    text.includes("apartment")
  ) {
    return "real-estate";
  }

  if (
    text.includes("gym") ||
    text.includes("fitness") ||
    text.includes("trainer") ||
    text.includes("workout")
  ) {
    return "gym";
  }

  if (
    text.includes("restaurant") ||
    text.includes("food") ||
    text.includes("menu") ||
    text.includes("cafe")
  ) {
    return "restaurant";
  }

  if (
    text.includes("saas") ||
    text.includes("software") ||
    text.includes("ai") ||
    text.includes("startup")
  ) {
    return "saas";
  }

  return "generic";
}

/* ================= INDUSTRY SCHEMA ================= */
export function createIndustrySchema(
  industry: "furniture" | "real-estate" | "gym" | "restaurant" | "saas" | "generic",
  prompt: string
): WebsiteSchema {
  const base = createDynamicSchema(prompt);

  const sectionMap: Record<string, string[]> = {
    furniture: ["hero", "features", "pricing", "contact"],
    "real-estate": ["hero", "features", "contact"],
    gym: ["hero", "features", "pricing", "contact"],
    restaurant: ["hero", "features", "contact"],
    saas: ["hero", "features", "pricing", "contact"],
    generic: ["hero", "features", "pricing", "contact"],
  };

  const allowedSections = sectionMap[industry] || sectionMap.generic;

  return {
    ...base,
    sections: [
      ...base.sections.filter((section) =>
        allowedSections.includes(section.type)
      ),
      ...allowedSections
        .filter(
          (type) => !base.sections.some((section) => section.type === type)
        )
        .map((type) => ({
          type,
          variant: "v1",
          props: {},
        })),
    ],
  };
}