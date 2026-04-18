"use client";

import { sectionLibrary } from "@/data/sectionLibrary";
import { useEditorBlocks } from "@/store/useEditorBlocks";

export default function SectionLibraryPanel() {
  const sections = [
    "hero",
    "features",
    "pricing",
    "testimonials",
    "team",
    "footer",
  ] as const;

  const handleAddSection = (section: keyof typeof sectionLibrary) => {
    const blocks = sectionLibrary[section];
    let html = `<div style="margin: 24px 0; padding: 24px; border: 1px dashed #ccc; border-radius: 8px;">`;
    
    blocks.forEach((block) => {
      if (block.type === "cta") {
        html += `<div style="margin-bottom: 12px;"><button style="padding: 12px 24px; background: #2563eb; color: white; font-weight: bold; border-radius: 6px;">${block.content}</button></div>`;
      } else if (block.type === "faq") {
        html += `<div style="margin-bottom: 12px; font-size: 16px; font-weight: 500;">${block.content}</div>`;
      } else if (block.type === "image") {
        html += `<div style="margin-bottom: 12px; width: 100%; height: 200px; background: #f3f4f6; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #9ca3af;">[ Image Placeholder ]</div>`;
      } else if (block.type === "text") {
        html += `<p style="margin-bottom: 12px;">${block.content}</p>`;
      }
    });

    html += `</div><br/>`;
    
    // Prevent default to keep focus, then insert
    document.execCommand("insertHTML", false, html);
  };

  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold">
        Section Library
      </h2>

      <div className="grid grid-cols-2 gap-3">
        {sections.map((section) => (
          <button
            key={section}
            onMouseDown={(e) => {
              e.preventDefault(); // Keep focus on the template
              handleAddSection(section);
            }}
            className="rounded-xl border px-4 py-3 text-sm font-medium capitalize hover:bg-gray-50"
          >
            + {section}
          </button>
        ))}
      </div>
    </div>
  );
}