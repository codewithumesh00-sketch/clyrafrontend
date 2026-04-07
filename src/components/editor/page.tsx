"use client";

import React, { useMemo } from "react";
import LeftSidebar from "@/components/editor/LeftSidebar";
import RightSidebar from "@/components/editor/RightSidebar";
import TemplateRenderer from "@/components/editor/TemplateRenderer";

export default function EditorPage() {
  const config = useMemo(
    () => ({
      sections: [
        {
          type: "navbar",
          variant: "v1",
          props: {
            logo: "Clyra",
            links: ["Home", "Features", "Pricing", "Contact"],
          },
        },
        {
          type: "hero",
          variant: "v6",
          props: {
            title: "AI Website Builder",
            subtitle: "Generate beautiful websites from prompts instantly",
            ctaText: "Start Free",
          },
        },
        {
          type: "features",
          variant: "v3",
          props: {
            title: "Why Clyra",
          },
        },
        {
          type: "pricing",
          variant: "v2",
        },
        {
          type: "faq",
          variant: "v1",
        },
        {
          type: "footer",
          variant: "v1",
        },
      ],
    }),
    []
  );

  return (
    <div className="grid grid-cols-[260px_1fr_320px] h-screen">
      <LeftSidebar />
      <TemplateRenderer config={config} />
      <RightSidebar />
    </div>
  );
}