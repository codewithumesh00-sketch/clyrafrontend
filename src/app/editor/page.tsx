"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { $getRoot } from "lexical";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import {
  RotateCcw,
  RotateCw,
  Monitor,
  Tablet,
  Smartphone,
  Upload,
  Save,
  Eye,
  Menu,
  X,
  ChevronRight,
  Sparkles,
  LayoutTemplate,
  Palette,
  Layers,
  Plus,
  Undo2,
  Redo2,
} from "lucide-react";

import SectionLibraryPanel from "@/components/editor/SectionLibraryPanel";
import LexicalToolbar from "@/components/editor/LexicalToolbar";
import LivePreview from "@/components/editor/LivePreview";
import ThemeCustomizer from "@/components/editor/ThemeCustomizer";
import { useWebsiteBuilderStore } from "@/store/useWebsiteBuilderStore";

const theme = {
  paragraph: "mb-3 text-gray-700 leading-relaxed",
  heading: {
    h1: "text-4xl font-bold mb-4 text-gray-900",
    h2: "text-2xl font-semibold mb-3 text-gray-900",
    h3: "text-xl font-semibold mb-2 text-gray-900",
  },
  quote: "border-l-4 border-blue-500 pl-4 italic text-gray-600 my-4",
};

export default function EditorPage() {
  const schema = useWebsiteBuilderStore((state) => state.schema);
  const [mounted, setMounted] = useState(false);
  const [saveTime, setSaveTime] = useState("Not saved");
  const [savedState, setSavedState] = useState<string | null>(null);
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<"content" | "theme" | "sections">("content");
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("clyra-editor");
    if (saved) {
      setSavedState(saved);
      setLastSaved(new Date());
      setSaveTime(`Last saved ${new Date().toLocaleTimeString()}`);
    }
  }, []);

  const handleSave = useCallback(() => {
    const now = new Date();
    setLastSaved(now);
    setSaveTime(`Saved ${now.toLocaleTimeString()}`);
    // Show saving indicator
    const timer = setTimeout(() => {
      setSaveTime(`Last saved ${now.toLocaleTimeString()}`);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const previewWidth = {
    desktop: "100%",
    tablet: "768px",
    mobile: "375px",
  };

  const initialConfig = useMemo(() => {
    return {
      namespace: "ClyraEditor",
      theme,
      nodes: [HeadingNode, QuoteNode],
      editorState: savedState || undefined,
      onError(error: Error) {
        console.error(error);
      },
    };
  }, [savedState]);

  const getDeviceIcon = () => {
    switch (device) {
      case "desktop": return <Monitor className="h-4 w-4" />;
      case "tablet": return <Tablet className="h-4 w-4" />;
      case "mobile": return <Smartphone className="h-4 w-4" />;
    }
  };

  if (!mounted) {
    return (
      <div className="h-screen w-screen bg-white flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-xl"></div>
          <div className="text-gray-400">Loading editor...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-gray-50 flex flex-col">
      <LexicalComposer initialConfig={initialConfig}>
        {/* MODERN HEADER */}
        <header className="bg-white border-b border-gray-100 shadow-sm flex-shrink-0">
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-sm">C</span>
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Clyra
                </h1>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-1 bg-gray-50 rounded-xl p-1">
              {["desktop", "tablet", "mobile"].map((d) => (
                <button
                  key={d}
                  onClick={() => setDevice(d as any)}
                  className={`p-2 rounded-lg transition-all ${
                    device === d
                      ? "bg-white shadow-sm text-gray-900"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {d === "desktop" && <Monitor className="h-4 w-4" />}
                  {d === "tablet" && <Tablet className="h-4 w-4" />}
                  {d === "mobile" && <Smartphone className="h-4 w-4" />}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg">
                <Save className="h-3.5 w-3.5" />
                <span>{saveTime}</span>
              </div>

              <button
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
                  isPreviewMode
                    ? "bg-blue-50 text-blue-600 border border-blue-200"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Eye className="h-4 w-4" />
                <span className="text-sm">Preview</span>
              </button>

              <button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-sm hover:shadow-md">
                <Upload className="h-4 w-4" />
                <span className="hidden sm:inline">Publish</span>
              </button>
            </div>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* SIDEBAR */}
          <aside
            className={`
              fixed lg:relative z-20 lg:z-auto
              transform transition-transform duration-300 ease-in-out
              w-80 bg-white border-r border-gray-100 shadow-lg lg:shadow-none
              flex flex-col h-full
              ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
              ${isSidebarOpen && !window.matchMedia('(min-width: 1024px)').matches ? 'left-0' : ''}
            `}
          >
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white">
              <div className="flex gap-1 bg-gray-50 rounded-lg p-1 w-full">
                {[
                  { id: "content", icon: <Layers className="h-4 w-4" />, label: "Content" },
                  { id: "theme", icon: <Palette className="h-4 w-4" />, label: "Theme" },
                  { id: "sections", icon: <LayoutTemplate className="h-4 w-4" />, label: "Sections" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${
                      activeTab === tab.id
                        ? "bg-white shadow-sm text-gray-900"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab.icon}
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sidebar Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {activeTab === "content" && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">Content Editor</span>
                    </div>
                    <LexicalToolbar />
                    <div className="relative mt-3 min-h-[280px] rounded-xl border border-gray-200 bg-white overflow-hidden">
                      <div className="absolute inset-0 pointer-events-none rounded-xl ring-1 ring-inset ring-black/5" />
                      <div className="p-4">
                        <RichTextPlugin
                          contentEditable={
                            <ContentEditable className="min-h-[240px] outline-none text-sm leading-relaxed prose prose-sm max-w-none" />
                          }
                          placeholder={
                            <div className="absolute left-4 top-4 text-gray-400 text-sm pointer-events-none">
                              Write your content here...
                            </div>
                          }
                          ErrorBoundary={() => (
                            <div className="text-red-500 p-4">Something went wrong</div>
                          )}
                        />
                        <HistoryPlugin />
                        <OnChangePlugin
                          onChange={(editorState) => {
                            const json = editorState.toJSON();
                            localStorage.setItem("clyra-editor", JSON.stringify(json));
                            handleSave();
                            editorState.read(() => {
                              $getRoot().getTextContent();
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "theme" && (
                <div className="bg-white rounded-xl border border-gray-100 p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Palette className="h-4 w-4 text-gray-600" />
                    <h3 className="font-medium text-gray-900">Theme Customizer</h3>
                  </div>
                  <ThemeCustomizer />
                </div>
              )}

              {activeTab === "sections" && (
                <div className="bg-white rounded-xl border border-gray-100 p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <LayoutTemplate className="h-4 w-4 text-gray-600" />
                    <h3 className="font-medium text-gray-900">Section Library</h3>
                  </div>
                  <SectionLibraryPanel />
                </div>
              )}
            </div>
          </aside>

          {/* PREVIEW AREA */}
          <main className="flex-1 overflow-auto bg-gray-50">
            <div className="min-h-full p-4 md:p-6">
              <div className="flex justify-center">
                <div
                  className={`
                    transition-all duration-300 ease-in-out
                    ${isPreviewMode ? 'shadow-2xl' : 'shadow-sm'}
                    bg-white rounded-2xl overflow-hidden
                  `}
                  style={{
                    width: previewWidth[device],
                    maxWidth: "100%",
                    minHeight: "calc(100vh - 120px)",
                  }}
                >
                  {/* Preview Toolbar */}
                  {isPreviewMode && (
                    <div className="sticky top-0 z-10 bg-gray-50 border-b border-gray-100 p-2 text-center">
                      <span className="text-xs text-gray-400">Preview Mode</span>
                    </div>
                  )}
                  <div className={isPreviewMode ? "pointer-events-auto" : ""}>
                    <LivePreview schema={schema} />
                  </div>
                </div>
              </div>
            </div>
          </main>

          {/* Mobile overlay */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black/20 z-10 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
        </div>

        {/* Floating action buttons */}
        <div className="fixed bottom-6 right-6 flex gap-2">
          <button
            className="bg-white shadow-lg rounded-full p-3 hover:shadow-xl transition-all border border-gray-100"
            onClick={() => {
              const history = (window as any).__lexicalHistory;
              if (history?.undo) history.undo();
            }}
          >
            <Undo2 className="h-5 w-5 text-gray-600" />
          </button>
          <button
            className="bg-white shadow-lg rounded-full p-3 hover:shadow-xl transition-all border border-gray-100"
            onClick={() => {
              const history = (window as any).__lexicalHistory;
              if (history?.redo) history.redo();
            }}
          >
            <Redo2 className="h-5 w-5 text-gray-600" />
          </button>
          <button
            onClick={() => setDevice(device === "desktop" ? "mobile" : device === "mobile" ? "tablet" : "desktop")}
            className="bg-white shadow-lg rounded-full p-3 hover:shadow-xl transition-all border border-gray-100"
          >
            {getDeviceIcon()}
          </button>
        </div>
      </LexicalComposer>
    </div>
  );
}