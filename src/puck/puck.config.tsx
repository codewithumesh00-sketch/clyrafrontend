"use client";

import type { Config } from "@puckeditor/core";

type Props = {
  HeroBlock: {
    title: string;
    subtitle: string;
    buttonText: string;
    imageUrl: string;
    backgroundColor: string;
    paddingTop: number;
    paddingBottom: number;
    mobileTitleSize: number;
    desktopTitleSize: number;
  };

  FeaturesBlock: {
    heading: string;
    description: string;
    backgroundColor: string;
    paddingY: number;
  };

  PricingBlock: {
    title: string;
    price: string;
    description: string;
    buttonText: string;
    backgroundColor: string;
    cardRadius: number;
  };
};

const config: Config<Props> = {
  components: {
    // ================= HERO =================
    HeroBlock: {
      label: "Hero Section",

      fields: {
        title: { type: "text" },
        subtitle: { type: "textarea" },
        buttonText: { type: "text" },

        // 🖼️ image url
        imageUrl: {
          type: "text",
          label: "Hero Image URL",
        },

        // 🎨 real color picker
        backgroundColor: {
          type: "custom",
          label: "Background Color",
          render: ({ value, onChange }: any) => (
            <input
              type="color"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="h-12 w-full cursor-pointer rounded-lg"
            />
          ),
        },

        // 📏 spacing sliders
        paddingTop: {
          type: "number",
          label: "Padding Top",
        },

        paddingBottom: {
          type: "number",
          label: "Padding Bottom",
        },

        // 📱 responsive font controls
        mobileTitleSize: {
          type: "number",
          label: "Mobile Title Size",
        },

        desktopTitleSize: {
          type: "number",
          label: "Desktop Title Size",
        },
      },

      defaultProps: {
        title: "Unlock the Power of SaaS",
        subtitle:
          "Discover how our software can transform your operations and boost productivity.",
        buttonText: "Get Started",
        imageUrl:
          "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1200&auto=format&fit=crop",
        backgroundColor: "#f8fafc",
        paddingTop: 80,
        paddingBottom: 80,
        mobileTitleSize: 42,
        desktopTitleSize: 72,
      },

      render: ({
        title,
        subtitle,
        buttonText,
        imageUrl,
        backgroundColor,
        paddingTop,
        paddingBottom,
        mobileTitleSize,
        desktopTitleSize,
      }) => (
        <section
          className="grid grid-cols-1 items-center gap-12 px-6 md:grid-cols-2 md:px-16"
          style={{
            backgroundColor,
            paddingTop,
            paddingBottom,
          }}
        >
          <div>
            <h1
              className="mb-6 font-extrabold leading-tight text-slate-900"
              style={{
                fontSize: `clamp(${mobileTitleSize}px, 6vw, ${desktopTitleSize}px)`,
              }}
            >
              {title}
            </h1>

            <p className="mb-8 max-w-xl text-xl leading-9 text-slate-600">
              {subtitle}
            </p>

            <button className="rounded-2xl bg-slate-900 px-8 py-4 text-white shadow-lg">
              {buttonText}
            </button>
          </div>

          <div>
            <img
              src={imageUrl}
              alt="Hero"
              className="h-[520px] w-full rounded-[32px] object-cover shadow-xl"
            />
          </div>
        </section>
      ),
    },

    // ================= FEATURES =================
    FeaturesBlock: {
      label: "Features",

      fields: {
        heading: { type: "text" },
        description: { type: "textarea" },

        backgroundColor: {
          type: "custom",
          label: "Section Color",
          render: ({ value, onChange }: any) => (
            <input
              type="color"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="h-12 w-full rounded-lg"
            />
          ),
        },

        paddingY: {
          type: "number",
          label: "Vertical Spacing",
        },
      },

      defaultProps: {
        heading: "Powerful Features",
        description:
          "Everything you need to grow your SaaS business.",
        backgroundColor: "#ffffff",
        paddingY: 100,
      },

      render: ({
        heading,
        description,
        backgroundColor,
        paddingY,
      }) => (
        <section
          className="px-6 text-center md:px-16"
          style={{
            backgroundColor,
            paddingTop: paddingY,
            paddingBottom: paddingY,
          }}
        >
          <h2 className="mb-4 text-4xl font-bold">{heading}</h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            {description}
          </p>
        </section>
      ),
    },

    // ================= PRICING =================
    PricingBlock: {
      label: "Pricing",

      fields: {
        title: { type: "text" },
        price: { type: "text" },
        description: { type: "textarea" },
        buttonText: { type: "text" },

        backgroundColor: {
          type: "custom",
          label: "Card Background",
          render: ({ value, onChange }: any) => (
            <input
              type="color"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="h-12 w-full rounded-lg"
            />
          ),
        },

        cardRadius: {
          type: "number",
          label: "Card Radius",
        },
      },

      defaultProps: {
        title: "Pro Plan",
        price: "$29/mo",
        description:
          "Best for growing startups and SaaS teams.",
        buttonText: "Choose Plan",
        backgroundColor: "#ffffff",
        cardRadius: 24,
      },

      render: ({
        title,
        price,
        description,
        buttonText,
        backgroundColor,
        cardRadius,
      }) => (
        <section className="px-6 py-24 md:px-16">
          <div
            className="mx-auto max-w-md border p-10 shadow-xl"
            style={{
              backgroundColor,
              borderRadius: `${cardRadius}px`,
            }}
          >
            <h3 className="mb-3 text-3xl font-bold">{title}</h3>
            <p className="mb-4 text-5xl font-extrabold">{price}</p>
            <p className="mb-8 text-slate-600">{description}</p>

            <button className="w-full rounded-2xl bg-slate-900 px-6 py-4 text-white">
              {buttonText}
            </button>
          </div>
        </section>
      ),
    },
  },
};

export default config;