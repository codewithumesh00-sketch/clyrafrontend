"use client";

import React, { memo, useMemo, useState } from "react";
import { Monitor, Tablet, Smartphone, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import { useWebsiteBuilderStore } from "@/store/useWebsiteBuilderStore";
import WebsiteRenderer from "@/components/renderer/WebsiteRenderer";
import type { TemplateSchema } from "@/store/useWebsiteBuilderStore";

type Props = {
  schema?: TemplateSchema | null;
};

type DeviceView = "desktop" | "tablet" | "mobile";

function LivePreview({ schema }: Props) {
  const router = useRouter();
  const [deviceView, setDeviceView] =
    useState<DeviceView>("desktop");

  const storeSchema = useWebsiteBuilderStore(
    (state) => state.schema
  );

  const currentSchema =
    schema ?? storeSchema ?? null;

  const memoizedSchema = useMemo(() => {
    if (!currentSchema) return null;
    return JSON.parse(JSON.stringify(currentSchema));
  }, [currentSchema]);

  const handleOpenPreview = () => {
    if (!memoizedSchema) return;

    localStorage.setItem(
      "clyra-preview-schema",
      JSON.stringify(memoizedSchema)
    );

    const params = new URLSearchParams({
      t: Date.now().toString(),
      template:
        memoizedSchema.templateId || "template1",
      category:
        memoizedSchema.category || "business",
    });

    window.open(`/preview?${params.toString()}`, "_blank");
  };

  const deviceWidths = {
    desktop: "w-full",
    tablet: "max-w-4xl w-[1024px]",
    mobile: "max-w-sm w-[375px]",
  };

  return (
    <div className="relative h-[800px] w-full overflow-hidden rounded-3xl bg-[#0a0a0a] text-white shadow-2xl">
      {/* Premium background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-1/2 -left-1/2 h-[700px] w-[700px] rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute top-1/4 right-0 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      {/* Top toolbar */}
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-white/10 bg-black/40 px-4 py-3 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
            {currentSchema?.category || "business"} •{" "}
            {currentSchema?.templateId || "template1"}
          </div>

          <div className="flex items-center rounded-md bg-white/10 p-0.5">
            {(["desktop", "tablet", "mobile"] as DeviceView[]).map(
              (device) => {
                const Icon = {
                  desktop: Monitor,
                  tablet: Tablet,
                  mobile: Smartphone,
                }[device];

                return (
                  <button
                    key={device}
                    onClick={() =>
                      setDeviceView(device)
                    }
                    className={`rounded-sm p-1 ${
                      deviceView === device
                        ? "bg-white/20 text-white"
                        : "text-gray-400"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </button>
                );
              }
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">
            Editable Live Preview
          </span>

          <button
            onClick={handleOpenPreview}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-white/20"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Full Preview
          </button>
        </div>
      </div>

      {/* Real preview */}
      <div className="relative h-[calc(100%-56px)] overflow-auto p-4">
        <div className="flex min-h-full w-full justify-center">
          <div
            className={`transition-all duration-500 ${deviceWidths[deviceView]}`}
          >
            {deviceView !== "desktop" && (
              <div className="flex items-center gap-2 border-b border-white/10 bg-black/30 px-3 py-2">
                <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
              </div>
            )}

            <div className="overflow-hidden rounded-b-2xl bg-white">
              <WebsiteRenderer schema={memoizedSchema} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(LivePreview);