"use client";

import { sectionLibrary } from "@/data/sectionLibrary";
import { useEditorBlocks } from "@/store/useEditorBlocks";

export default function SectionLibraryPanel() {
  const addSection = useEditorBlocks((state) => state.addSection);

  const sections = [
    "hero",
    "features",
    "pricing",
    "testimonials",
    "team",
    "footer",
  ] as const;

  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold">
        Section Library
      </h2>

      <div className="grid grid-cols-2 gap-3">
        {sections.map((section) => (
          <button
            key={section}
            onClick={() =>
              addSection(
                sectionLibrary[section].map((block) => ({
                  ...block,
                  id: crypto.randomUUID(),
                }))
              )
            }
            className="rounded-xl border px-4 py-3 text-sm font-medium capitalize hover:bg-gray-50"
          >
            + {section}
          </button>
        ))}
      </div>
    </div>
  );
}