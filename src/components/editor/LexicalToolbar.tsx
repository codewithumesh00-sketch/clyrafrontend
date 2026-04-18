"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  FORMAT_TEXT_COMMAND,
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
} from "lexical";
import { $setBlocksType, $patchStyleText } from "@lexical/selection";
import { $createHeadingNode } from "@lexical/rich-text";
import { useState } from "react";
import { useEditorBlocks } from "@/store/useEditorBlocks";

export default function LexicalToolbar() {
  const [fontSize, setFontSize] = useState(16);
  const [color, setColor] = useState("#000000");

  const applyTextStyle = () => {
    document.execCommand("foreColor", false, color);
    document.execCommand("fontSize", false, "7"); // Standard sizes, requires custom logic for exact px, but this is a proxy
  };

  const applyHeading = () => {
    document.execCommand("formatBlock", false, "H1");
  };

  const applyParagraph = () => {
    document.execCommand("formatBlock", false, "P");
  };

  const insertImage = () => {
    if (typeof window !== "undefined" && (window as any).cloudinary) {
      if (!(window as any).__toolbarCloudinaryWidget) {
        (window as any).__toolbarCloudinaryWidget = (window as any).cloudinary.createUploadWidget(
          {
            cloudName: (process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME && process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET) ? process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME : "demo",
            uploadPreset: (process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME && process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET) ? process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET : "docs_upload_example_us_preset",
            multiple: false,
            clientAllowedFormats: ["jpg", "jpeg", "png", "webp", "gif", "svg"],
          },
          (error: any, result: any) => {
            if (!error && result && result.event === "success") {
              // Insert image wherever the cursor currently is!
              document.execCommand("insertImage", false, result.info.secure_url);
            }
          }
        );
      }
      (window as any).__toolbarCloudinaryWidget.open();
    }
  };

  return (
    <div className="mb-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      {/* Text tools */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          onMouseDown={(e) => { e.preventDefault(); document.execCommand("bold"); }}
        >
          Bold
        </button>

        <button
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          onMouseDown={(e) => { e.preventDefault(); document.execCommand("italic"); }}
        >
          Italic
        </button>

        <button
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          onMouseDown={(e) => { e.preventDefault(); document.execCommand("underline"); }}
        >
          Underline
        </button>

        <button
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          onMouseDown={(e) => { e.preventDefault(); applyHeading(); }}
        >
          H1
        </button>

        <button
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          onMouseDown={(e) => { e.preventDefault(); applyParagraph(); }}
        >
          P
        </button>

        <input
          type="number"
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
          className="w-20 rounded-lg border border-gray-300 px-3 py-2 text-sm text-black"
        />

        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="h-10 w-14 cursor-pointer rounded border"
        />

        <button
          className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
          onMouseDown={(e) => { e.preventDefault(); applyTextStyle(); }}
        >
          Apply Style
        </button>
      </div>

      {/* Website blocks */}
      <div className="mt-4 flex flex-wrap gap-3 border-t pt-4">
        <button
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          onMouseDown={(e) => { e.preventDefault(); document.execCommand("insertHTML", false, `<button style="padding: 10px 20px; background: blue; color: white; border-radius: 5px;">Click Here</button>`); }}
        >
          CTA
        </button>

        <button
          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
          onMouseDown={(e) => { e.preventDefault(); document.execCommand("insertHTML", false, `<div><strong>Q: </strong>What is this?<br/><strong>A: </strong>This is an FAQ.</div>`); }}
        >
          FAQ
        </button>

        <button
          className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
          onMouseDown={(e) => { e.preventDefault(); insertImage(); }}
        >
          Image
        </button>
      </div>
    </div>
  );
}