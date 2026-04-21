"use client";

import { useRouter } from "next/navigation";
import React, {
  memo,
  useMemo,
  Suspense,
  useCallback,
  useState,
  useEffect,
} from "react";
import dynamic from "next/dynamic";
import {
  ExternalLink,
  Sparkles,
  Copy,
  Check,
  Monitor,
  Smartphone,
  Tablet,
  Loader2,
  Zap,
  Shield,
  Globe,
  Palette,
  Layers,
  Code,
  Pencil, // ✅ RE-ADDED: Edit icon
} from "lucide-react";

import type { TemplateSchema } from "@/types/template";

const WebsiteRenderer = dynamic(
  () => import("@/components/renderer/WebsiteRenderer"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full flex-col items-center justify-center gap-6">
        <div className="relative">
          <div className="absolute inset-0 animate-ping rounded-full bg-yellow-500/20" />
          <div className="relative h-16 w-16 animate-spin rounded-full border-2 border-yellow-500/30 border-t-yellow-500" />
          <Sparkles className="absolute inset-0 m-auto h-6 w-6 animate-pulse text-yellow-400" />
        </div>
        <div className="text-center space-y-2">
          <p className="text-lg font-semibold bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
            Rendering your template
          </p>
          <p className="text-sm text-gray-500">AI is assembling components, styles & data...</p>
        </div>
      </div>
    ),
  }
);

interface LivePreviewProps {
  schema?: TemplateSchema | any;
  isDark?: boolean;
}

type DeviceView = "desktop" | "tablet" | "mobile";

/* ================================
   ✅ Legacy Category Detection Helper
=============================== */
const detectLegacyCategory = (sections: any[]) => {
  if (sections.some((s) => s.type?.toLowerCase().includes("blog"))) {
    return "blog";
  }
  if (sections.some((s) => s.type?.toLowerCase().includes("pricing"))) {
    return "saas";
  }
  return "ecommerce";
};

function LivePreviewComponent({
  schema,
  isDark = true,
}: LivePreviewProps) {
  const [copied, setCopied] = useState(false);
  const [deviceView, setDeviceView] = useState<DeviceView>("desktop");
  const [typedText, setTypedText] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  const router = useRouter();

  /* ================================
     ✅ Template-First Schema Normalization
  ================================ */
  function migrateLegacySchema(oldSchema: any): TemplateSchema {
    const sections = oldSchema.sections || oldSchema.pages?.[0]?.sections || [];
    const editableData: Record<string, any> = {};

    sections.forEach((section: any) => {
      const type = section.type;
      const props = section.props || {};

      if (type === "hero" || type === "Hero") {
        editableData.hero = props;
      } else if (type === "navbar" || type === "Navbar") {
        editableData.navbar = props;
      } else if (type === "footer" || type === "Footer") {
        editableData.footer = props;
      } else if (type === "products" || type === "ProductGrid") {
        editableData.products = props.items || [];
      } else if (type === "features" || type === "FeaturesGrid") {
        editableData.features = props.items || [];
      } else if (type === "testimonials" || type === "Testimonials") {
        editableData.testimonials = props.items || [];
      } else if (type === "blog" || type === "BlogPosts") {
        editableData.blog = { posts: props.posts || [] };
      }
    });

    const category = detectLegacyCategory(sections);
    const resolvedTemplateId = oldSchema.templateId || "template1";

    return {
      category,
      templateId: resolvedTemplateId,
      prompt: oldSchema.prompt || "",
      styleMode: oldSchema.theme === "dark" ? "luxury" : "minimal",
      editableData,
      metadata: {
        migratedFrom: "legacy",
        migratedAt: new Date().toISOString(),
      },
    };
  }

  const liveSchema = useMemo<TemplateSchema | null>(() => {
    if (!schema) return null;
    const parsed = schema.data ? schema.data : schema;

    if (parsed?.templateId && parsed?.editableData) {
      return parsed as TemplateSchema;
    }

    if (parsed?.pages || parsed?.sections) {
      console.warn("⚠️ Detected legacy schema — migrating to template format");
      const migrated = migrateLegacySchema(parsed);

      if (typeof window !== "undefined") {
        localStorage.setItem("clyraweb-generated-schema", JSON.stringify(migrated));
        localStorage.removeItem("clyraweb-live-schema");
      }
      return migrated;
    }
    return null;
  }, [schema]);

  const fullText = "Create. Build. Deploy.";

  /* ================================
     ✅ Content Check Logic
  ================================ */
  const hasContent = useMemo(() => {
    if (!liveSchema) return false;
    return !!(
      liveSchema.templateId &&
      liveSchema.editableData &&
      Object.keys(liveSchema.editableData).length > 0
    );
  }, [liveSchema]);

  /* ================================
     🎬 Typing Animation
  ================================ */
  useEffect(() => {
    if (!hasContent) {
      let index = 0;
      setTypedText("");
      setCursorVisible(true);

      const typeInterval = setInterval(() => {
        if (index < fullText.length) {
          setTypedText(fullText.slice(0, index + 1));
          index++;
        } else {
          clearInterval(typeInterval);
        }
      }, 100);

      const cursorInterval = setInterval(() => {
        setCursorVisible(prev => !prev);
      }, 530);

      return () => {
        clearInterval(typeInterval);
        clearInterval(cursorInterval);
      };
    } else {
      setTypedText("");
      setCursorVisible(false);
    }
  }, [hasContent]);

  /* ================================
     ✅ Memoized Schema for Renderer
  ================================ */
  const memoizedSchema = useMemo(() => {
    if (!liveSchema?.templateId) return null;
    return JSON.parse(JSON.stringify(liveSchema));
  }, [liveSchema]);

  /* ================================
     ✅ Storage Sync (Preview-Only Keys)
  ================================ */
  useEffect(() => {
    if (!memoizedSchema || typeof window === "undefined") return;

    const schemaString = JSON.stringify(memoizedSchema);

    localStorage.setItem("clyraweb-template-schema", schemaString);
    localStorage.removeItem("clyraweb-generated-schema");

    window.dispatchEvent(new CustomEvent("clyraweb-schema-updated", {
      detail: { schema: memoizedSchema }
    }));

    console.log("🔥 TEMPLATE PREVIEW SAVED:", {
      templateId: memoizedSchema.templateId,
      category: memoizedSchema.category,
      regions: Object.keys(memoizedSchema.editableData || {}),
    });
  }, [memoizedSchema]);

  /* ================================
     🚀 Open Preview in New Tab
  ================================ */
  const handleOpenNewTab = useCallback(() => {
    if (!memoizedSchema) return;

    try {
      localStorage.setItem("clyraweb-preview-schema", JSON.stringify(memoizedSchema));

      const params = new URLSearchParams({
        t: Date.now().toString(),
        template: memoizedSchema.templateId,
        category: memoizedSchema.category,
      });

      router.push(`/preview?${params.toString()}`);
    } catch (error) {
      console.error("Preview open failed:", error);
    }
  }, [memoizedSchema, router]);

  /* ================================
     ✏️ Open Editor (NEW: Added Back)
  ================================ */
  const handleOpenEditor = useCallback(() => {
    if (!memoizedSchema) return;

    try {
      // Store schema for editor to pick up
      localStorage.setItem("clyraweb-editor-schema", JSON.stringify(memoizedSchema));

      const params = new URLSearchParams({
        t: Date.now().toString(),
        template: memoizedSchema.templateId,
        category: memoizedSchema.category,
        source: "live-preview",
      });

      // Navigate to editor route
      router.push(`/editor?${params.toString()}`);
    } catch (error) {
      console.error("Editor open failed:", error);
    }
  }, [memoizedSchema, router]);

  /* ================================
     📋 Copy Schema to Clipboard
  ================================ */
  const handleCopySchema = useCallback(async () => {
    if (!memoizedSchema) return;
    try {
      await navigator.clipboard.writeText(
        JSON.stringify(memoizedSchema, null, 2)
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  }, [memoizedSchema]);

  /* ================================
     📱 Device View Widths
  ================================ */
  const deviceWidths = {
    desktop: "w-full",
    tablet: "max-w-4xl w-[1024px]",
    mobile: "max-w-sm w-[375px]",
  };

  /* ================================
     🎨 Template Badge Colors
  ================================ */
  const categoryStyles: Record<string, { bg: string; text: string; border: string }> = {
    ecommerce: { bg: "bg-yellow-500/10", text: "text-yellow-400", border: "border-yellow-500/20" },
    saas: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20" },
    blog: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/20" },
    portfolio: { bg: "bg-pink-500/10", text: "text-pink-400", border: "border-pink-500/20" },
    business: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
    landing: { bg: "bg-cyan-500/10", text: "text-cyan-400", border: "border-cyan-500/20" },
  };

  const currentCategoryStyle = categoryStyles[liveSchema?.category || "ecommerce"] || categoryStyles.ecommerce;

  return (
    <div
      className={`relative h-full w-full overflow-hidden transition-colors duration-500 ${isDark ? "bg-[#0a0a0a] text-white" : "bg-gray-50 text-gray-900"
        }`}
    >
      {/* ✨ Animated Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className={`absolute -top-1/2 -left-1/2 h-[800px] w-[800px] rounded-full blur-3xl transition-all duration-1000 ${isDark ? "opacity-20" : "opacity-10"
            }`}
          style={{
            background: "radial-gradient(circle, rgba(245,158,11,0.3) 0%, rgba(16,185,129,0.1) 50%, transparent 70%)",
            animation: "orbPulse 8s ease-in-out infinite",
          }}
        />
        <div
          className={`absolute top-1/4 right-0 h-[600px] w-[600px] rounded-full blur-3xl transition-all duration-1000 ${isDark ? "opacity-20" : "opacity-10"
            }`}
          style={{
            background: "radial-gradient(circle, rgba(16,185,129,0.3) 0%, rgba(245,158,11,0.1) 50%, transparent 70%)",
            animation: "orbPulse 8s ease-in-out infinite 2s",
          }}
        />
        <div
          className={`absolute inset-0 transition-opacity duration-1000 ${isDark ? "opacity-100" : "opacity-40"
            }`}
          style={{
            backgroundImage: `
              linear-gradient(${isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"} 1px, transparent 1px),
              linear-gradient(90deg, ${isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"} 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* 🎛️ Action Bar */}
      {hasContent && liveSchema && (
        <div
          className={`sticky top-0 z-30 border-b backdrop-blur-xl transition-all duration-300 ${isDark ? "border-white/10 bg-[#0a0a0a]/80" : "border-black/10 bg-white/80"
            }`}
        >
          <div className="flex w-full items-center justify-between px-3 py-2">
            <div className="flex items-center gap-3">
              {/* Template Badge */}
              <div className={`flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-medium border ${currentCategoryStyle.bg} ${currentCategoryStyle.text} ${currentCategoryStyle.border}`}>
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
                </span>
                <span className="capitalize">{liveSchema.category}</span>
                <span className="text-gray-500">•</span>
                <span className="font-mono">{liveSchema.templateId}</span>
              </div>

              {/* Device Toggle */}
              <div className={`flex items-center rounded-md p-0.5 ${isDark ? "bg-white/10" : "bg-black/5"}`}>
                {(["desktop", "tablet", "mobile"] as DeviceView[]).map((device) => {
                  const Icon = { desktop: Monitor, tablet: Tablet, mobile: Smartphone }[device];
                  return (
                    <button
                      key={device}
                      onClick={() => setDeviceView(device)}
                      className={`rounded-sm p-1 transition-all ${deviceView === device
                        ? isDark ? "bg-white/20 text-white shadow-sm" : "bg-white text-black shadow-sm"
                        : isDark ? "text-gray-400 hover:text-white hover:bg-white/10" : "text-gray-500 hover:text-black hover:bg-black/5"
                        }`}
                      title={`View as ${device}`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* ✏️ Edit Button (NEW: Added Back) */}
              <button
                onClick={handleOpenEditor}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all ${isDark
                  ? "border-yellow-500/30 bg-yellow-500/10 hover:bg-yellow-500/20 hover:border-yellow-500/50 text-yellow-400"
                  : "border-yellow-600/30 bg-yellow-50 hover:bg-yellow-100 hover:border-yellow-600/50 text-yellow-700"
                  }`}
                title="Edit template"
              >
                <Pencil size={12} />
                <span className="hidden sm:inline">Edit</span>
              </button>

              {/* Copy Button */}
              <button
                onClick={handleCopySchema}
                className={`group rounded-lg p-1.5 transition-all ${isDark ? "hover:bg-white/10 text-gray-400 hover:text-white" : "hover:bg-black/5 text-gray-500 hover:text-black"
                  }`}
                title="Copy schema JSON"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-green-400" />
                ) : (
                  <Copy className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
                )}
              </button>

              {/* Preview Button */}
              <button
                onClick={handleOpenNewTab}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all ${isDark ? "border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30" : "border-black/20 bg-black/5 hover:bg-black/10 hover:border-black/30"
                  }`}
              >
                <ExternalLink size={12} />
                <span className="hidden sm:inline">Preview</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🖥️ Main Content */}
      <div className={`relative overflow-auto ${!hasContent ? "h-full" : "h-[calc(100%-40px)]"}`}>
        {!hasContent ? (
          /* 🎬 Empty State */
          <div className="relative flex h-full w-full flex-col items-center justify-center gap-6 text-center">
            <div
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider ${isDark ? "bg-yellow-500/10 border border-yellow-500/20 text-yellow-300" : "bg-yellow-100 border border-yellow-200 text-yellow-700"
                }`}
              style={{ animation: "slideDown 0.8s ease forwards", opacity: 0 }}
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gradient-to-r from-yellow-500 to-amber-500" />
              Template Engine Ready
            </div>
            <h1
              className="text-4xl font-bold sm:text-6xl md:text-7xl lg:text-8xl"
              style={{ animation: "scaleIn 1s ease 0.2s forwards", opacity: 0 }}
            >
              <span
                className="bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-400 bg-[length:200%_auto] bg-clip-text text-transparent"
                style={{ animation: "gradientShift 3s linear infinite", display: "inline-block" }}
              >
                clyrawebweb
              </span>
            </h1>
            <p
              className={`text-base font-medium sm:text-lg ${isDark ? "text-gray-400" : "text-gray-600"}`}
              style={{ animation: "fadeIn 0.8s ease 0.5s forwards", opacity: 0, minHeight: "1.5rem" }}
            >
              {typedText}
              <span
                className={`ml-1 font-bold ${isDark ? "text-yellow-400" : "text-yellow-600"}`}
                style={{ opacity: cursorVisible ? 1 : 0, transition: "opacity 0.1s" }}
              >
                |
              </span>
            </p>
            <div
              className="flex flex-wrap justify-center gap-2"
              style={{ animation: "fadeInUp 0.6s ease 0.8s forwards", opacity: 0 }}
            >
              {[
                { icon: Layers, text: "Templates", color: "from-yellow-400 to-amber-500" },
                { icon: Palette, text: "Styles", color: "from-emerald-400 to-teal-500" },
                { icon: Code, text: "Components", color: "from-blue-400 to-cyan-500" },
              ].map((feature, i) => (
                <div
                  key={i}
                  className={`group flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${isDark ? "bg-white/5 border border-white/10 hover:bg-white/10" : "bg-black/5 border border-black/10 hover:bg-black/10"
                    }`}
                  style={{ animation: "fadeInUp 0.6s ease forwards", animationDelay: `${1 + i * 0.1}s`, opacity: 0 }}
                >
                  <feature.icon
                    className={`h-3.5 w-3.5 bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}
                    style={{ animation: "rotate 4s linear infinite", display: "inline-block" }}
                  />
                  <span>{feature.text}</span>
                </div>
              ))}
            </div>
            <div
              className={`mt-4 max-w-md rounded-xl border p-4 text-left transition-all hover:scale-105 ${isDark ? "border-white/10 bg-white/5 hover:bg-white/10" : "border-black/10 bg-black/5 hover:bg-black/10"
                }`}
              style={{ animation: "fadeInUp 0.8s ease 1.4s forwards", opacity: 0 }}
            >
              <div className="flex items-start gap-2.5">
                <div className={`mt-0.5 rounded-full p-1 ${isDark ? "bg-yellow-500/20" : "bg-yellow-100"}`}>
                  <Sparkles className={`h-3.5 w-3.5 ${isDark ? "text-yellow-400" : "text-yellow-600"}`} />
                </div>
                <div>
                  <p className={`text-xs font-medium ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                    Describe your template and watch AI build it instantly
                  </p>
                  <p className={`mt-0.5 text-[10px] ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                    Try: "A luxury e-commerce store with gold accents and dark mode"
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* 🎨 Template Preview */
          <div className="flex min-h-full w-full items-start justify-center">
            <div
              className={`relative transition-all duration-500 ease-out ${deviceWidths[deviceView]} ${deviceView !== "desktop" ? `border-b transition-all ${isDark ? "border-white/10 bg-[#0a0a0a]" : "border-black/10 bg-white"}` : ""
                }`}
            >
              {/* Browser Chrome */}
              {deviceView !== "desktop" && (
                <div className={`flex items-center justify-between border-b px-3 py-2 ${isDark ? "border-white/10 bg-black/30" : "border-black/10 bg-white/30"}`}>
                  <div className="flex items-center gap-1">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                    <div className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
                    <div className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
                  </div>
                  <div className={`text-[10px] font-medium ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                    clyrawebweb.app
                  </div>
                  <div className="w-8" />
                </div>
              )}

              {/* Website Renderer */}
              <div
                className="overflow-hidden"
                data-deploy-preview="true"
              >
                <Suspense fallback={
                  <div className="flex h-96 w-full items-center justify-center">
                    <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${isDark ? "bg-white/5" : "bg-black/5"}`}>
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-yellow-500" />
                      <span className="text-xs">Loading template...</span>
                    </div>
                  </div>
                }>
                  <WebsiteRenderer
                    schema={memoizedSchema}
                    isPublished={true} // 🔒 LOCK EDITING
                    key={`${deviceView}-${liveSchema?.category}-${liveSchema?.templateId}`}
                  />
                </Suspense>
              </div>

              {/* Device Label */}
              {deviceView !== "desktop" && (
                <div className={`absolute -top-2 right-3 rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${isDark ? "bg-black/80 text-gray-300 border border-white/10" : "bg-white/80 text-gray-600 border border-black/10"
                  }`}>
                  {deviceView}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 🎨 CSS Animations */}
      <style>{`
        @keyframes orbPulse {
          0%, 100% { opacity: ${isDark ? "0.2" : "0.1"}; transform: scale(1) translate(0, 0); }
          33% { opacity: ${isDark ? "0.3" : "0.15"}; transform: scale(1.05) translate(-20px, 20px); }
          66% { opacity: ${isDark ? "0.25" : "0.12"}; transform: scale(0.95) translate(20px, -20px); }
        }
        @keyframes gradientShift {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        @keyframes slideDown { 0% { opacity: 0; transform: translateY(-20px); } 100% { opacity: 1; transform: translateY(0); } }
        @keyframes scaleIn { 0% { opacity: 0; transform: scale(0.9); } 100% { opacity: 1; transform: scale(1); } }
        @keyframes fadeIn { to { opacity: 1; } }
        @keyframes fadeInUp { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
        @keyframes rotate { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default memo(LivePreviewComponent);