"use client";

import React from "react";
import { useWebsiteBuilderStore } from "@/store/useWebsiteBuilderStore";
import { resolveTemplate } from "@/templates/templateRegistry";
import type { TemplateSchema } from "@/store/useWebsiteBuilderStore";

type Props = {
  schema?: TemplateSchema | null;
};

export default function WebsiteRenderer({
  schema,
}: Props) {
  const storeSchema = useWebsiteBuilderStore(
    (s) => s.schema
  );

  const currentSchema: TemplateSchema | null =
    schema ?? storeSchema ?? null;

  /* ================================
     🚀 TEMPLATE RESOLUTION
  ================================ */
  const selectedTemplate =
    currentSchema?.templateId
      ? resolveTemplate(currentSchema.templateId)
      : null;

  /* ================================
     ❌ TEMPLATE NOT FOUND
  ================================ */
  if (!selectedTemplate?.component) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="space-y-3 text-center">
          <h2 className="text-xl font-semibold">
            Missing Template
          </h2>

          <p className="text-sm opacity-70">
            {currentSchema?.templateId || "unknown"}
          </p>

          <p className="text-xs text-gray-500">
            Check templateRegistry.ts mapping
          </p>
        </div>
      </div>
    );
  }

  const SelectedComponent =
    selectedTemplate.component as React.ComponentType<{
      editableData?: any;
    }>;

  return (
    <div className="min-h-screen">
      <SelectedComponent
        key={JSON.stringify(currentSchema)}
        editableData={currentSchema}
      />
    </div>
  );
}