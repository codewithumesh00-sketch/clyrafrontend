"use client";

import { useMemo, useState } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { $getRoot } from "lexical";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import LexicalToolbar from "@/components/editor/LexicalToolbar";

const theme = {
  paragraph: "mb-2",
};

export default function EditorPage() {
  const [saveTime, setSaveTime] = useState("Not saved yet");

  const initialConfig = useMemo(() => {
    const saved =
      typeof window !== "undefined"
        ? localStorage.getItem("clyra-editor")
        : null;

    return {
      namespace: "ClyraEditor",
      theme,
      nodes: [HeadingNode, QuoteNode],
      editorState: saved || undefined,
      onError(error: Error) {
        throw error;
      },
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 px-6 py-10">
      <div className="mx-auto max-w-5xl rounded-3xl border border-white/60 bg-white/90 p-8 shadow-2xl backdrop-blur-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-black">
              Clyra Editor
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Create beautiful website content blocks with live styling
            </p>
          </div>

          <div className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white shadow">
            {saveTime}
          </div>
        </div>

        <LexicalComposer initialConfig={initialConfig}>
          <div className="sticky top-4 z-10 mb-6">
            <LexicalToolbar />
          </div>

          <div className="min-h-[500px] rounded-3xl border border-gray-200 bg-white p-6 shadow-inner">
            <RichTextPlugin
              contentEditable={
                <ContentEditable className="min-h-[420px] text-lg leading-8 text-black outline-none" />
              }
              placeholder={
                <div className="pointer-events-none text-lg text-gray-400">
                  Start writing your website content here...
                </div>
              }
              ErrorBoundary={() => (
                <div className="text-red-500">Editor Error</div>
              )}
            />

            <HistoryPlugin />

            <OnChangePlugin
              onChange={(editorState) => {
                const json = editorState.toJSON();
                localStorage.setItem(
                  "clyra-editor",
                  JSON.stringify(json)
                );

                setSaveTime(
                  `Saved ${new Date().toLocaleTimeString()}`
                );

                editorState.read(() => {
                  console.log("Text:", $getRoot().getTextContent());
                });
              }}
            />
          </div>
        </LexicalComposer>
      </div>
    </div>
  );
}