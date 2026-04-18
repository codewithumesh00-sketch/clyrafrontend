"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const WebsiteRenderer = dynamic(
  () => import("@/components/renderer/WebsiteRenderer"),
  { ssr: false }
);

export default function PreviewPage() {
  const [schema, setSchema] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("clyraweb-preview-schema");
    if (saved) {
      setSchema(JSON.parse(saved));
    }
  }, []);

  if (!schema) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading preview...
      </div>
    );
  }

  return <WebsiteRenderer schema={schema} />;
}