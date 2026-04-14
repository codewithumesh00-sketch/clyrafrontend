"use client";

import React, { useMemo } from "react";
import { normalizeSiteContent } from "@/lib/siteContent";
import WebsiteRenderer from "@/components/renderer/WebsiteRenderer";

type StudioPreviewSchema = {
  page: string;
  theme: string;
  layout: {
    navbar: boolean;
    footer: boolean;
  };
  sections: Array<{
    type: string;
    variant: number;
    props: {
      title: string;
      subtitle: string;
      ctaText: string;
    };
  }>;
};

export function resolveStudioTemplateId(
  name?: string
): string {
  return (name || "default")
    .toLowerCase()
    .trim();
}

function buildFallbackSchema(
  content: Record<string, unknown>,
  templateId: string = "default"
): StudioPreviewSchema {
  const safeTitle =
    (content.title as string) ||
    (content.prompt as string) ||
    "Welcome to ClyraUI 🚀";

  const safeSubtitle =
    (content.subtitle as string) ||
    "Generated with Clyra Studio";

  const safeButtonText =
    (content.buttonText as string) ||
    "Get Started";

  return {
    page: templateId,
    theme: "light",
    layout: {
      navbar: true,
      footer: true,
    },
    sections: [
      {
        type: "hero",
        variant: 1,
        props: {
          title: safeTitle,
          subtitle: safeSubtitle,
          ctaText: safeButtonText,
        },
      },
    ],
  };
}

export function buildStudioExportSource(
  templateId: string,
  content: Record<string, unknown>
): string {
  const normalized = normalizeSiteContent(
    content ?? {}
  );

  const safeSchema = JSON.stringify(
    buildFallbackSchema(
      normalized,
      templateId
    ),
    null,
    2
  );

  return `"use client";

import React from "react";
import WebsiteRenderer from "@/components/renderer/WebsiteRenderer";

export default function Page() {
  const data = ${safeSchema};

  return (
    <div className="min-h-screen bg-white">
      <WebsiteRenderer schema={data as any} />
    </div>
  );
}
`;
}

export default function TemplateStudioPreview({
  templateId,
  content,
}: {
  templateId: string;
  content?: Record<string, unknown>;
}) {
  const data = useMemo(() => {
    const normalized = normalizeSiteContent(
      content ?? {}
    );

    return buildFallbackSchema(
      normalized,
      templateId
    );
  }, [content, templateId]);

  return (
    <div
      className="relative h-full min-h-0 w-full overflow-hidden rounded-2xl bg-white shadow-[inset_0_0_0_1px_rgb(228_228_231_/_0.9)]"
      data-studio-preview-frame
    >
      <div
        className="h-full overflow-y-auto overflow-x-hidden"
        data-studio-preview-scrollport
      >
        <WebsiteRenderer schema={data as any} />
      </div>
    </div>
  );
}