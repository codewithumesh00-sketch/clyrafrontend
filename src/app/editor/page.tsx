"use client";

import LeftSidebar from "@/components/editor/LeftSidebar";
import RightSidebar from "@/components/editor/RightSidebar";
import TemplateRenderer from "@/components/editor/TemplateRenderer";
import { useWebsiteStore } from "@/store/useWebsiteStore";

export default function EditorPage() {
  const website = useWebsiteStore((state) => state.website);

  if (!website?.pages?.length) {
    return (
      <div className="h-screen flex items-center justify-center">
        No generated website found
      </div>
    );
  }

  const currentPage = website.pages[0];

  return (
    <div className="grid grid-cols-[260px_1fr_320px] h-screen">
      <LeftSidebar />
      <TemplateRenderer
        config={{
          sections: currentPage.sections,
        }}
      />
      <RightSidebar />
    </div>
  );
}