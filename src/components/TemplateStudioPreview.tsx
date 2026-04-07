"use client";

import React, { useMemo } from "react";
import { normalizeSiteContent } from "@/lib/siteContent";
import WebsiteRenderer from "@/components/renderer/WebsiteRenderer";
import type { WebsiteSchema } from "@/lib/schemaStore";

export function resolveStudioTemplateId(name?: string): string {
  return (name || "default").toLowerCase();
}

function buildFallbackSchema(
  content: Record<string, unknown>
): WebsiteSchema {
  return {
    page: "studio-preview",
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
          title:
            (content.title as string) ||
            (content.prompt as string) ||
            "Welcome to ClyraUI 🚀",
        },
      },
    ],
  };
}

export function buildStudioExportSource(
  templateId: string,
  content: Record<string, unknown>
): string {
  const safe = JSON.stringify(buildFallbackSchema(content), null, 2);

  return `"use client";

import WebsiteRenderer from "@/components/renderer/WebsiteRenderer";

export default function Page() {
  const data = ${safe};

  return <WebsiteRenderer schema={data} />;
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
    const normalized = normalizeSiteContent(content ?? {});
    return buildFallbackSchema(normalized);
  }, [content]);

  return (
    <div
      className="relative h-full min-h-0 w-full overflow-hidden rounded-2xl bg-white shadow-[inset_0_0_0_1px_rgb(228_228_231_/_0.9)]"
      data-studio-preview-frame
    >
      <div
        className="h-full overflow-y-auto overflow-x-hidden"
        data-studio-preview-scrollport
      >
        <WebsiteRenderer schema={data} />
      </div>
    </div>
  );
}