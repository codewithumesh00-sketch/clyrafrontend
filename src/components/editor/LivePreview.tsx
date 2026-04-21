"use client";

import React, { memo, useMemo, useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Monitor, Tablet, Smartphone, ExternalLink } from "lucide-react";
import { useWebsiteBuilderStore } from "@/store/useWebsiteBuilderStore";
import WebsiteRenderer from "@/components/renderer/WebsiteRenderer";
import type { TemplateSchema } from "@/store/useWebsiteBuilderStore";

type Props = {
  schema?: TemplateSchema | null;
  isEditor?: boolean;
  viewportWidth?: number;
};

/**
 * LivePreview renders the template inside an <iframe> so that CSS media queries
 * (Tailwind's sm:/md:/lg:/xl:) respond to the iframe's width — NOT the browser
 * viewport. This gives a true responsive preview at any device size.
 */
function LivePreview({ schema, isEditor = false, viewportWidth = 1440 }: Props) {
  const storeSchema = useWebsiteBuilderStore((state) => state.schema);
  const currentSchema = schema ?? storeSchema ?? null;

  const memoizedSchema = useMemo(() => {
    if (!currentSchema) return null;
    return JSON.parse(JSON.stringify(currentSchema));
  }, [currentSchema]);

  const handleOpenPreview = () => {
    if (!memoizedSchema) return;
    localStorage.setItem("clyraweb-preview-schema", JSON.stringify(memoizedSchema));
    const params = new URLSearchParams({
      t: Date.now().toString(),
      template: memoizedSchema.templateId || "template1",
      category: memoizedSchema.category || "business",
    });
    window.open(`/preview?${params.toString()}`, "_blank");
  };

  const isMobile = viewportWidth <= 375;
  const isTablet = viewportWidth === 768;

  return (
    <div className="w-full h-full flex flex-col overflow-hidden" style={{ background: "#0d1117" }}>

      {/* ── Toolbar ── */}
      <div className="flex-shrink-0 flex items-center justify-between border-b border-white/10 bg-black/60 px-4 py-2.5 backdrop-blur-xl">
        <div className="flex items-center gap-2.5">
          <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-400">
            {currentSchema?.category ?? "business"} • {currentSchema?.templateId ?? "template1"}
          </div>
          <div className="flex items-center gap-1.5 rounded-lg bg-white/10 px-2.5 py-1">
            {isMobile ? <Smartphone className="h-3 w-3 text-white/50" /> :
             isTablet ? <Tablet className="h-3 w-3 text-white/50" /> :
                        <Monitor className="h-3 w-3 text-white/50" />}
            <span className="text-[11px] text-white/50 font-medium">
              {isMobile ? "Mobile • 375px" : isTablet ? "Tablet • 768px" : "Desktop"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-white/30">
            {isEditor ? "Editor Mode" : "Preview"}
          </span>
          <button
            onClick={handleOpenPreview}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/10 px-2.5 py-1 text-[11px] font-medium text-white transition hover:bg-white/20"
          >
            <ExternalLink className="h-3 w-3" />
            Full Preview
          </button>
        </div>
      </div>

      {/* ── macOS dots bar (mobile/tablet only) ── */}
      {(isMobile || isTablet) && (
        <div className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 bg-black/40 border-b border-white/5">
          <div className="h-2 w-2 rounded-full bg-red-400/80" />
          <div className="h-2 w-2 rounded-full bg-yellow-400/80" />
          <div className="h-2 w-2 rounded-full bg-green-400/80" />
          <span className="ml-1 text-[10px] font-mono text-white/25">{viewportWidth}px</span>
        </div>
      )}

      {/* ── Template rendered inside iframe for true responsive preview ── */}
      <div className="flex-1 overflow-hidden flex justify-center" style={{ background: "#0d1117" }}>
        <IframePreview
          schema={memoizedSchema}
          isEditor={isEditor}
          viewportWidth={viewportWidth}
        />
      </div>
    </div>
  );
}

/**
 * IframePreview renders a same-origin blank iframe, then uses React portal
 * to mount WebsiteRenderer inside it. The iframe's width is set to viewportWidth,
 * giving Tailwind breakpoints the correct viewport to respond to.
 */
function IframePreview({
  schema,
  isEditor,
  viewportWidth,
}: {
  schema: any;
  isEditor: boolean;
  viewportWidth: number;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeBody, setIframeBody] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const onLoad = () => {
      const doc = iframe.contentDocument;
      if (!doc) return;

      // Inject Tailwind CDN into iframe head so all utility classes work
      const head = doc.head;
      if (!head.querySelector("[data-clyraweb-tw]")) {
        const tw = doc.createElement("script");
        tw.src = "https://cdn.tailwindcss.com";
        tw.setAttribute("data-clyraweb-tw", "true");
        head.appendChild(tw);
      }

      // Base styles
      if (!head.querySelector("[data-clyraweb-base]")) {
        const style = doc.createElement("style");
        style.setAttribute("data-clyraweb-base", "true");
        style.textContent = `
          *, *::before, *::after { box-sizing: border-box; }
          html, body { margin: 0; padding: 0; font-family: Inter, system-ui, sans-serif; overflow-x: hidden; }
          body { background: #fff; }
          img { max-width: 100%; height: auto; }
        `;
        head.appendChild(style);
      }

      // Google Font
      if (!head.querySelector("[data-clyraweb-font]")) {
        const link = doc.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap";
        link.setAttribute("data-clyraweb-font", "true");
        head.appendChild(link);
      }

      // Set the body as portal target
      setIframeBody(doc.body);
    };

    iframe.addEventListener("load", onLoad);

    // For same-origin about:blank, load fires immediately in some browsers
    // so also try to set up right away
    if (iframe.contentDocument?.body) {
      onLoad();
    }

    return () => iframe.removeEventListener("load", onLoad);
  }, []);

  const isDesktop = viewportWidth >= 1440;

  return (
    <iframe
      ref={iframeRef}
      title="Preview"
      src="about:blank"
      className="border-0 bg-white"
      style={{
        width: isDesktop ? "100%" : `${viewportWidth}px`,
        height: "100%",
        maxWidth: "100%",
        flexShrink: 0,
      }}
    >
      {/* Portal React content into the iframe body */}
      {iframeBody &&
        createPortal(
          <WebsiteRenderer schema={schema} isPublished={!isEditor} />,
          iframeBody
        )}
    </iframe>
  );
}

export default memo(LivePreview);