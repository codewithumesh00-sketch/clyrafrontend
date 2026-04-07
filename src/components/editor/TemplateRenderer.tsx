"use client";

import React from "react";
import { resolveBlock } from "@/components/registry/blockRegistry";

type Section = {
  type: string;
  variant: string;
  props?: Record<string, any>;
};

type Props = {
  config?: {
    sections?: Section[];
  };
};

export default function TemplateRenderer({
  config = {},
}: Props) {
  const sections = config.sections || [];

  return (
    <main className="min-h-screen bg-white">
      {sections.map((section, index) => {
        const Component = resolveBlock(
          section.type,
          section.variant
        );

        if (!Component) {
          return (
            <div
              key={index}
              className="p-6 text-sm text-red-500 border"
            >
              Missing block: {section.type}:{section.variant}
            </div>
          );
        }

        return (
          <Component
            key={`${section.type}-${section.variant}-${index}`}
            {...section.props}
          />
        );
      })}
    </main>
  );
}