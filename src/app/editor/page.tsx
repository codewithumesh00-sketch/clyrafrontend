"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import Script from "next/script";
import {
  Monitor,
  Tablet,
  Smartphone,
  Upload,
  Save,
  Menu,
  X,
  Palette,
  Undo2,
  Redo2,
  History,
  Sparkles,
  Settings,
  Check,
  LayoutDashboard,
  ExternalLink,
  Copy,
  Link2,
  Clock,
  ArrowRight,
  Mail,
  Shield,
  Zap,
} from "lucide-react";

import DeployPanel from "@/components/editor/DeployPanel";
import ThemeCustomizer from "@/components/editor/ThemeCustomizer";
import LivePreview from "@/components/editor/LivePreview";
import { useThemeStore } from "@/store/useThemeStore";
import { useWebsiteBuilderStore } from "@/store/useWebsiteBuilderStore";

import { useRouter } from "next/navigation";

export default function EditorPage() {
  const schema = useWebsiteBuilderStore((state) => state.schema);
  const { theme } = useThemeStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [saveTime, setSaveTime] = useState("Not saved");
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<"theme" | "settings">("theme");
  const [isDeploying, setIsDeploying] = useState(false);
  const [showDeployPanel, setShowDeployPanel] = useState(false);
  const [formEndpoint, setFormEndpoint] = useState("");
  const [showFormGuide, setShowFormGuide] = useState(false);

  const {
    setDeployProgress,
    addDeployLog,
    clearDeployLogs,
    addDeployHistory,
    setIsPublishing,
    setDeployStep,
    currentProjectId,
    updateProject,
  } = useWebsiteBuilderStore();

  useEffect(() => {
    setMounted(true);
    useWebsiteBuilderStore.getState().loadProjects();

    const savedEndpoint = localStorage.getItem("clyraweb-form-endpoint");
    if (savedEndpoint) {
      setFormEndpoint(savedEndpoint);
    }
  }, []);

  // --- 🖼️ IMAGE UPLOAD LISTENER ---
  useEffect(() => {
    const handleOpenUpload = (e: any) => {
      const regionKey = e.detail?.regionKey;
      if (!regionKey || typeof window === "undefined" || !(window as any).cloudinary) return;

      const updateRegion = useWebsiteBuilderStore.getState().updateRegion;

      if (!(window as any).__cloudinaryWidget) {
        (window as any).__cloudinaryWidget = (window as any).cloudinary.createUploadWidget(
          {
            cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "demo",
            uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "docs_upload_example_us_preset",
            multiple: false,
            clientAllowedFormats: ["jpg", "jpeg", "png", "webp", "gif", "svg"],
            maxImageFileSize: 5000000,
          },
          (error: any, result: any) => {
            if (!error && result && result.event === "success") {
              const activeRegion = (window as any).__clyraweb_active_upload_region;
              if (activeRegion) {
                updateRegion(activeRegion, result.info.secure_url);
              }
            }
          }
        );
      }
      (window as any).__clyraweb_active_upload_region = regionKey;
      (window as any).__cloudinaryWidget.open();
    };

    window.addEventListener("clyraweb-open-image-upload", handleOpenUpload);
    return () => window.removeEventListener("clyraweb-open-image-upload", handleOpenUpload);
  }, []);

  const handleSave = useCallback(() => {
    const now = new Date();
    setSaveTime(`Saved ${now.toLocaleTimeString()}`);
    setTimeout(() => {
      setSaveTime(`Last saved ${now.toLocaleTimeString()}`);
    }, 2000);
  }, []);

  const handleSaveFormEndpoint = () => {
    localStorage.setItem("clyraweb-form-endpoint", formEndpoint);
    useWebsiteBuilderStore.setState((state: any) => ({
      schema: {
        ...state.schema,
        editableData: {
          ...state.schema.editableData,
          formspreeEndpoint: formEndpoint,
        },
      },
    }));
    handleSave();
  };

  const handlePublish = async () => {
    setIsDeploying(true);
    setIsPublishing(true);
    setShowDeployPanel(true);
    clearDeployLogs();
    setDeployProgress(0);
    setDeployStep("START");

    try {
      const templateId = schema.templateId || "template1";
      const cleanTemplateName = templateId.split("/").pop();
      const API_URL = (
        process.env.NEXT_PUBLIC_API_URL ||
        "https://clyrawebbackend-666777548.europe-west1.run.app"
      ).replace(/\/$/, "");

      const response = await fetch(`${API_URL}/deploy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectName: "clyraweb-auto-publish",
          // Capture live rendered HTML from preview iframe for exact visual match
          editableData: {
            ...schema.editableData,
            formspreeEndpoint: formEndpoint,
          },
          theme: theme,
          files: (() => {
            try {
              const iframeEl = document.querySelector("#preview-root iframe") as HTMLIFrameElement | null;
              if (iframeEl?.contentDocument) {
                const doc = iframeEl.contentDocument;
                const siteTitle =
                  (schema?.editableData as any)?.hero?.title ||
                  (schema?.editableData as any)?.hero?.heading ||
                  (schema?.editableData as any)?.navbar?.brand ||
                  "My Site";
                const headExtras = Array.from(doc.head.children).map(el => el.outerHTML).join("\n  ");
                return {
                  "index.html": `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>${siteTitle}</title>\n  ${headExtras}\n  <style>*,*::before,*::after{box-sizing:border-box}html,body{margin:0;padding:0;overflow-x:hidden}</style>\n</head>\n<body>\n${doc.body.innerHTML}\n</body>\n</html>`
                };
              }
            } catch(e) { console.warn("iframe capture failed", e); }
            return {};
          })(),
        }),
      });

      if (!response.body) throw new Error("No readable stream");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim()) continue;
          if (line.startsWith("STEP:")) {
            setDeployStep(line.substring(5).trim());
          } else if (line.startsWith("PROGRESS:")) {
            setDeployProgress(parseInt(line.split(":")[1]));
          } else if (line.startsWith("URL:")) {
            const url = line.substring(4).trim();
            addDeployHistory({
              id: Date.now().toString(),
              date: new Date().toISOString(),
              status: "success",
              url: url,
            });
            if (currentProjectId) {
              updateProject(currentProjectId, {
                status: "deployed",
                deployUrl: url,
                deployedAt: new Date().toISOString(),
              });
            }
          } else if (line.startsWith("ERROR:") || line.includes("❌")) {
            addDeployLog(line.startsWith("ERROR:") ? line.substring(6).trim() : line.trim());
            addDeployHistory({
              id: Date.now().toString(),
              date: new Date().toISOString(),
              status: "failed",
            });
            if (currentProjectId) {
              updateProject(currentProjectId, { status: "failed" });
            }
          } else {
            addDeployLog(line.trim());
          }
        }
      }
    } catch (err) {
      addDeployLog("Error deploying: " + (err instanceof Error ? err.message : String(err)));
      addDeployHistory({
        id: Date.now().toString(),
        date: new Date().toISOString(),
        status: "failed",
      });
      if (currentProjectId) {
        updateProject(currentProjectId, { status: "failed" });
      }
    } finally {
      setIsDeploying(false);
      setIsPublishing(false);
    }
  };

  // Device preview configurations with exact viewport widths
  const deviceConfig = {
    desktop: { width: "100%", label: "Desktop", icon: Monitor, viewport: 1440 },
    tablet: { width: "768px", label: "Tablet", icon: Tablet, viewport: 768 },
    mobile: { width: "375px", label: "Mobile", icon: Smartphone, viewport: 375 },
  };

  const getDeviceIcon = (dev: keyof typeof deviceConfig) => {
    const Icon = deviceConfig[dev].icon;
    return <Icon className="h-4 w-4" />;
  };

  // Formspree setup steps
  const formSetupSteps = [
    {
      step: 1,
      title: "Visit Formspree",
      description: "Go to https://formspree.io/ and sign up or sign in to your account",
      icon: ExternalLink,
      action: { label: "Open Formspree", url: "https://formspree.io/" },
    },
    {
      step: 2,
      title: "Create New Form",
      description: "Click '+ Add New' then select 'New Form' from the dropdown",
      icon: Zap,
    },
    {
      step: 3,
      title: "Name Your Form",
      description: "Enter a name for your form (e.g., 'Contact Form') and click Create",
      icon: Mail,
    },
    {
      step: 4,
      title: "Copy Endpoint",
      description: "Go to 'Settings' → 'Integration' and copy your unique form endpoint URL",
      icon: Copy,
    },
    {
      step: 5,
      title: "Paste & Connect",
      description: "Return here, paste the endpoint below, and click 'Connect Form Endpoint'",
      icon: Link2,
    },
  ];

  if (!mounted) {
    return (
      <div className="h-screen w-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg" />
          <div className="text-gray-500 font-medium">Loading workspace...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-slate-50 flex flex-col">
      <Script src="https://upload-widget.cloudinary.com/global/all.js" strategy="lazyOnload" />

      {/* === NAVBAR === */}
      <header className="bg-[#0a0a0a] border-b border-white/8 shadow-lg flex-shrink-0 z-30">
        <div className="flex items-center justify-between px-4 md:px-6 py-3 gap-3">

          {/* Logo + Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-1.5 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Toggle sidebar"
            >
              {isSidebarOpen
                ? <X className="h-5 w-5 text-white" />
                : <Menu className="h-5 w-5 text-white" />}
            </button>
            <div className="flex items-center gap-2">
              <img
                src="https://res.cloudinary.com/dzwxmiu47/image/upload/v1776662521/Gemini_Generated_Image_qoawvdqoawvdqoaw-removebg-preview_eyghjk.png"
                alt="clyraweb"
                className="h-7 w-auto object-contain flex-shrink-0"
              />
              <span className="hidden sm:inline text-white/40 text-xs font-bold">Editor</span>
            </div>
          </div>

          {/* === RESPONSIVE DEVICE TABS === */}
          <div className="flex items-center gap-1 bg-white/10 rounded-xl p-1.5">
            {(["desktop", "tablet", "mobile"] as const).map((dev) => {
              const isActive = device === dev;
              const config = deviceConfig[dev];
              return (
                <button
                  key={dev}
                  onClick={() => setDevice(dev)}
                  className={`
                      flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200
                      ${isActive
                      ? "bg-white shadow-sm text-gray-900"
                      : "text-white/50 hover:text-white hover:bg-white/10"
                    }
                    `}
                  title={`${config.label} • ${config.viewport}px`}
                >
                  {getDeviceIcon(dev)}
                  <span className="hidden xl:inline">{config.label}</span>
                  <span className="hidden lg:inline xl:hidden text-[10px] opacity-70">
                    {config.viewport}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Save Status */}
            <div className="hidden sm:flex items-center gap-2 text-xs text-white/40 bg-white/10 px-3 py-1.5 rounded-lg">
              <Save className="h-3.5 w-3.5" />
              <span>{saveTime}</span>
            </div>

            {/* Dashboard Button */}
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 border border-transparent transition-all"
              title="Go to Dashboard"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </button>

            {/* Deploy History */}
            <button
              onClick={() => setShowDeployPanel(true)}
              className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
              title="Deploy History"
            >
              <History className="h-4 w-4" />
            </button>

            {/* Publish Button */}
            <button
              onClick={handlePublish}
              disabled={isDeploying}
              className={`
                  flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm
                  ${isDeploying
                  ? "bg-gray-600 text-white cursor-not-allowed"
                  : "from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 bg-gradient-to-r text-white hover:shadow-md"
                }
                `}
            >
              <Upload className={`h-4 w-4 ${isDeploying ? "animate-pulse" : ""}`} />
              <span className="hidden sm:inline">
                {isDeploying ? "Publishing..." : "Publish"}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* === MAIN CONTENT AREA === */}
      <div className="flex-1 flex overflow-hidden relative">

        {/* === SIDEBAR === */}
        <aside
          className={`
                fixed lg:relative z-20 lg:z-auto inset-y-0 left-0
                transform transition-transform duration-300 ease-in-out
                w-72 bg-[#111111] border-r border-white/8 shadow-2xl lg:shadow-none
                flex flex-col
                ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
              `}
        >
          {/* Sidebar Tabs */}
          <div className="flex items-center gap-1 p-3 border-b border-white/8 bg-black/30">
            {[
              { id: "theme", icon: Palette, label: "Theme" },
              { id: "settings", icon: Settings, label: "Settings" },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`
                        flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all
                        ${isActive
                      ? "bg-white/15 shadow-sm text-white ring-1 ring-white/10"
                      : "text-white/40 hover:text-white hover:bg-white/10"
                    }
                      `}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5">

            {/* Theme Tab */}
            {activeTab === "theme" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-indigo-500" />
                  <h3 className="text-sm font-semibold text-white/80">Visual Customization</h3>
                </div>
                <div className="rounded-2xl p-0">
                  <ThemeCustomizer />
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Settings className="h-4 w-4 text-white/50" />
                  <h3 className="text-sm font-semibold text-white/80">Form & Integration</h3>
                </div>

                {/* Quick Connect Card */}
                <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-indigo-400" />
                      <span className="text-sm font-medium text-white">⚡ Connect in 2 Minutes</span>
                    </div>
                    <button
                      onClick={() => setShowFormGuide(!showFormGuide)}
                      className="text-xs text-indigo-300 hover:text-indigo-200 underline"
                    >
                      {showFormGuide ? "Hide Guide" : "Show Steps"}
                    </button>
                  </div>

                  {/* Collapsible Step-by-Step Guide */}
                  {showFormGuide && (
                    <div className="space-y-3 pt-2 border-t border-white/10">
                      {formSetupSteps.map((item, index) => {
                        const Icon = item.icon;
                        return (
                          <div key={item.step} className="flex gap-3 items-start">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/30 flex items-center justify-center text-xs font-bold text-indigo-300">
                              {item.step}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-white/90">{item.title}</p>
                              <p className="text-xs text-white/50">{item.description}</p>
                              {item.action && (
                                <a
                                  href={item.action.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 mt-1 text-xs text-indigo-400 hover:text-indigo-300"
                                >
                                  {item.action.label}
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              )}
                            </div>
                            {index < formSetupSteps.length - 1 && (
                              <ArrowRight className="h-4 w-4 text-white/20 flex-shrink-0 mt-1" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Form Endpoint Card */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-white/70">Contact Form Endpoint</label>
                    {formEndpoint ? (
                      <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        <Check className="h-3 w-3" /> Connected
                      </span>
                    ) : (
                      <span className="text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                        Not connected
                      </span>
                    )}
                  </div>

                  <div className="relative">
                    <input
                      type="url"
                      placeholder="https://formspree.io/f/your_form_id"
                      value={formEndpoint}
                      onChange={(e) => setFormEndpoint(e.target.value)}
                      className="w-full text-sm text-white placeholder-white/30 p-2.5 pl-9 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400/50 transition-all"
                    />
                    <Link2 className="h-4 w-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>

                  <button
                    onClick={handleSaveFormEndpoint}
                    disabled={!formEndpoint.trim()}
                    className={`
                        w-full flex items-center justify-center gap-2 text-sm py-2.5 rounded-xl transition-all font-medium shadow-sm
                        ${formEndpoint.trim()
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:shadow"
                        : "bg-white/10 text-white/40 cursor-not-allowed"
                      }
                      `}
                  >
                    <Shield className="h-4 w-4" />
                    Connect Form Endpoint
                  </button>

                  {formEndpoint && (
                    <p className="text-xs text-gray-400 text-center pt-1">
                      ✓ Forms will submit to your configured Formspree endpoint
                    </p>
                  )}
                </div>

                {/* Benefits Info */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <h4 className="text-xs font-semibold text-white/30 uppercase tracking-wide mb-3">Why Formspree?</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { icon: Mail, text: "Receive submissions directly to your email" },
                      { icon: Shield, text: "No backend code required - fully secure" },
                      { icon: Zap, text: "Free tier includes 50 submissions/month" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-white/60">
                        <item.icon className="h-3.5 w-3.5 text-indigo-400" />
                        {item.text}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
                  <h4 className="text-xs font-semibold text-white/30 uppercase tracking-wide">Quick Actions</h4>
                  <button
                    onClick={handleSave}
                    className="w-full flex items-center gap-2 text-sm text-white/60 hover:text-white hover:bg-white/10 p-2.5 rounded-xl transition-all text-left"
                  >
                    <Save className="h-4 w-4" />
                    Save Current State
                  </button>
                  <button
                    onClick={() => setShowDeployPanel(true)}
                    className="w-full flex items-center gap-2 text-sm text-white/60 hover:text-white hover:bg-white/10 p-2.5 rounded-xl transition-all text-left"
                  >
                    <History className="h-4 w-4" />
                    View Deploy History
                  </button>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* === PREVIEW CANVAS === */}
        <main className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-slate-100 to-gray-100">
          {/* Editor mode: card sized to device, template responds naturally */}
          <div className="flex-1 flex items-start justify-center p-4 md:p-6 overflow-auto">
            <div
              className={`
                    flex-shrink-0 overflow-hidden shadow-2xl transition-all duration-300
                    ${device === "mobile"
                  ? "rounded-[2.5rem] ring-[6px] ring-gray-700/80 shadow-[0_0_0_2px_#1a1a1a]"
                  : device === "tablet"
                    ? "rounded-[1.5rem] ring-[4px] ring-gray-600/60"
                    : "rounded-2xl ring-1 ring-black/10"
                }
                  `}
              style={{
                width: device === "desktop" ? "100%" : `${deviceConfig[device].viewport}px`,
                maxWidth: "100%",
                height: device === "mobile"
                  ? "calc(100vh - 160px)"
                  : device === "tablet"
                    ? "calc(100vh - 160px)"
                    : "calc(100vh - 140px)",
              }}
            >
              {/* Phone notch bar for mobile */}
              {device === "mobile" && (
                <div className="bg-black h-8 flex items-center justify-center flex-shrink-0">
                  <div className="w-24 h-5 bg-black rounded-full border border-gray-700 flex items-center justify-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-600" />
                    <div className="w-8 h-1 rounded-full bg-gray-700" />
                  </div>
                </div>
              )}

              <div id="preview-root" data-clyraweb-preview="true"
                style={{ height: device === "mobile" ? "calc(100% - 2rem)" : "100%" }}
              >
                <LivePreview
                  schema={schema}
                  isEditor={true}
                  viewportWidth={deviceConfig[device].viewport}
                />
              </div>

              {/* Home bar for mobile */}
              {device === "mobile" && (
                <div className="bg-black h-6 flex items-end justify-center pb-1.5 flex-shrink-0">
                  <div className="w-24 h-1 rounded-full bg-gray-600" />
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-10 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </div>

      {/* === FLOATING ACTION BUTTONS === */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-20">
        {/* Undo */}
        <button
          className="group bg-white shadow-lg rounded-2xl p-3.5 hover:shadow-xl transition-all border border-gray-100 hover:border-blue-200 hover:-translate-y-0.5"
          onClick={() => {
            handleSave();
          }}
          title="Undo"
        >
          <Undo2 className="h-5 w-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
        </button>

        {/* Redo */}
        <button
          className="group bg-white shadow-lg rounded-2xl p-3.5 hover:shadow-xl transition-all border border-gray-100 hover:border-blue-200 hover:-translate-y-0.5"
          onClick={() => {
            handleSave();
          }}
          title="Redo"
        >
          <Redo2 className="h-5 w-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
        </button>

        {/* Device Quick Toggle */}
        <button
          onClick={() => {
            const devices: Array<"desktop" | "tablet" | "mobile"> = ["desktop", "tablet", "mobile"];
            const currentIndex = devices.indexOf(device);
            const nextIndex = (currentIndex + 1) % devices.length;
            setDevice(devices[nextIndex]);
          }}
          className="group bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg rounded-2xl p-3.5 hover:shadow-xl transition-all hover:-translate-y-0.5"
          title="Cycle Viewport"
        >
          {React.createElement(deviceConfig[device].icon, {
            className: "h-5 w-5 text-white group-hover:scale-110 transition-transform"
          })}
        </button>
      </div>

      {/* Deploy Panel Overlay */}
      <DeployPanel
        isOpen={showDeployPanel}
        onClose={() => setShowDeployPanel(false)}
        isDeploying={isDeploying}
      />
    </div>
  );
}