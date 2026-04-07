"use client";

import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { resolveBlock } from "@/components/registry/blockRegistry";

type SectionSchema = {
  type: string;
  variant?: string | number;
  props?: Record<string, unknown>;
};

type PageSchema = {
  page: string;
  sections: SectionSchema[];
};

type HybridSchema = {
  theme?: "light" | "dark";
  layout?: {
    navbar?: boolean;
    footer?: boolean;
  };
  sections?: SectionSchema[];
  pages?: PageSchema[];
};

type Props = {
  schema?: HybridSchema;
};

/* ================================
   🔥 VARIANT NORMALIZER
================================ */
function normalizeVariant(type: string, variant: unknown): string {
  if (typeof variant === "number") return `v${variant}`;
  if (!variant || typeof variant !== "string") return "v1";

  if (variant.startsWith("v")) return variant;

  const typePrefix = `${type}V`;
  if (variant.startsWith(typePrefix)) {
    return `v${variant.replace(typePrefix, "")}`;
  }

  return "v1";
}

/* ================================
   🔥 SAFE BLOCK RENDER
================================ */
function SafeBlockRender({
  SelectedBlock,
  safeProps,
  sectionType,
}: {
  SelectedBlock: React.ComponentType<any>;
  safeProps: Record<string, unknown>;
  sectionType: string;
}) {
  try {
    return <SelectedBlock {...safeProps} />;
  } catch (error) {
    console.error("❌ BLOCK CRASH:", sectionType, safeProps, error);

    return (
      <div className="m-4 rounded-2xl border border-red-300 bg-red-50 p-6 text-red-600">
        Crash in block: <strong>{sectionType}</strong>
      </div>
    );
  }
}

/* ================================
   🔥 SCHEMA SANITIZER
================================ */
function sanitizeSchema(schema?: HybridSchema): {
  theme: "light" | "dark";
  layout: {
    navbar?: boolean;
    footer?: boolean;
  };
  pages: PageSchema[];
} {
  const safePages: PageSchema[] = Array.isArray(schema?.pages)
    ? schema.pages.map((page, index) => ({
        page:
          typeof page?.page === "string"
            ? page.page
            : `page-${index}`,
        sections: Array.isArray(page?.sections)
          ? page.sections
          : [],
      }))
    : [
        {
          page: "home",
          sections: Array.isArray(schema?.sections)
            ? schema.sections
            : [],
        },
      ];

  return {
    theme: schema?.theme === "dark" ? "dark" : "light",
    layout: schema?.layout || {},
    pages: safePages,
  };
}

/* ================================
   🔥 MAIN RENDERER
================================ */
export default function WebsiteRenderer({ schema }: Props) {
  const safeSchema = sanitizeSchema(schema);
  const isDark = safeSchema.theme === "dark";

  console.log("🔥 RAW SCHEMA =", schema);
  console.log("🔥 SAFE SCHEMA =", safeSchema);

  return (
    <div
      className={
        isDark
          ? "min-h-screen bg-black text-white"
          : "min-h-screen bg-white text-black"
      }
    >
      {/* Navbar */}
      {safeSchema.layout.navbar !== false && (
        <Navbar pages={safeSchema.pages} />
      )}

      {/* Dynamic page rendering */}
      <main>
        {safeSchema.pages.map((page, pageIndex) => (
          <section
            key={`${page.page}-${pageIndex}`}
            id={page.page}
            className="scroll-mt-24"
          >
            {(page.sections || []).map((section, sectionIndex) => {
              const variant = normalizeVariant(
                section.type,
                section.variant
              );

              const SelectedBlock = resolveBlock(
                section.type,
                variant
              );

              if (!SelectedBlock) {
                return (
                  <div
                    key={`${page.page}-${section.type}-${sectionIndex}`}
                    className="p-4 text-red-500"
                  >
                    Missing block: {section.type}:{variant}
                  </div>
                );
              }

              const safeProps =
                typeof section.props === "object" &&
                section.props !== null
                  ? section.props
                  : {};

              return (
                <div
                  key={`${page.page}-${section.type}-${sectionIndex}`}
                >
                  <SafeBlockRender
                    SelectedBlock={SelectedBlock}
                    safeProps={safeProps}
                    sectionType={section.type}
                  />
                </div>
              );
            })}
          </section>
        ))}
      </main>

      {/* Footer */}
      {safeSchema.layout.footer !== false && <Footer />}
    </div>
  );
}