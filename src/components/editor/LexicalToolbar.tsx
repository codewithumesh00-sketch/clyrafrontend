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
  const [editor] = useLexicalComposerContext();
  const [fontSize, setFontSize] = useState(16);
  const [color, setColor] = useState("#000000");

  const addBlock = useEditorBlocks((state) => state.addBlock);

  const applyTextStyle = () => {
    editor.update(() => {
      const selection = $getSelection();

      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, {
          color,
          "font-size": `${fontSize}px`,
        });
      }
    });
  };

  const applyHeading = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode("h1"));
      }
    });
  };

  const applyParagraph = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode());
      }
    });
  };

  const insertCTA = () => {
    addBlock({
      id: crypto.randomUUID(),
      type: "cta",
      content: "Get Started",
    });
  };

  const insertFAQ = () => {
    addBlock({
      id: crypto.randomUUID(),
      type: "faq",
      content: "What service do you provide?",
    });
  };

  const insertImage = () => {
    addBlock({
      id: crypto.randomUUID(),
      type: "image",
      content: "",
    });
  };

  return (
    <div className="mb-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      {/* Text tools */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
        >
          Bold
        </button>

        <button
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
        >
          Italic
        </button>

        <button
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          onClick={() =>
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")
          }
        >
          Underline
        </button>

        <button
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          onClick={applyHeading}
        >
          H1
        </button>

        <button
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          onClick={applyParagraph}
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
          onClick={applyTextStyle}
        >
          Apply Style
        </button>
      </div>

      {/* Website blocks */}
      <div className="mt-4 flex flex-wrap gap-3 border-t pt-4">
        <button
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          onClick={insertCTA}
        >
          CTA
        </button>

        <button
          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
          onClick={insertFAQ}
        >
          FAQ
        </button>

        <button
          className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
          onClick={insertImage}
        >
          Image
        </button>
      </div>
    </div>
  );
}