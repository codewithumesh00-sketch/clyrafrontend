"use client";

import React from "react";

interface Props {
  templateId: string;
  config: any;
}

/* Temporary template map (until you rebuild templates) */
const templateMap: Record<string, React.ComponentType<any>> = {};

export default function TemplateRenderer({
  templateId,
  config,
}: Props) {

  const Template = templateMap[templateId];

  if (!Template) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl font-semibold">
        No template found
      </div>
    );
  }

  return <Template config={config} />;
}