"use client";

import React, { useEffect, useRef, useState } from "react";
import { useWebsiteBuilderStore } from "@/store/useWebsiteBuilderStore";
import {
  CheckCircle2, XCircle, Clock, ExternalLink, X,
  History, Copy, Check, Rocket, Globe, RefreshCw,
  LayoutDashboard,
} from "lucide-react";
import Link from "next/link";

interface DeployPanelProps {
  isOpen: boolean;
  onClose: () => void;
  isDeploying: boolean;
}

const STEPS = [
  { key: "START",   label: "Preparing",    icon: "⚙️",  progress: 5  },
  { key: "INSTALL", label: "Installing",   icon: "📦",  progress: 20 },
  { key: "BUILD",   label: "Building",     icon: "🏗️", progress: 45 },
  { key: "DEPLOY",  label: "Deploying",    icon: "🚀",  progress: 85 },
  { key: "DONE",    label: "Live!",        icon: "✅",  progress: 100 },
];

function getStepIndex(key: string) {
  return STEPS.findIndex((s) => s.key === key);
}

function getLogColor(log: string) {
  if (log.includes("ERROR") || log.includes("❌")) return "text-red-400";
  if (log.startsWith("URL:")) return "text-cyan-300 font-bold";
  if (log.includes("✅") || log.includes("DONE")) return "text-emerald-400";
  if (log.startsWith("STEP:") || log.startsWith("PROGRESS:")) return "hidden";
  if (log.startsWith("  ")) return "text-gray-400 text-xs";
  return "text-green-400";
}

export default function DeployPanel({ isOpen, onClose }: DeployPanelProps) {
  const { deployProgress, deployLogs, deployHistory, isPublishing, currentStep } =
    useWebsiteBuilderStore();
  const logsEndRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  // Auto-scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [deployLogs]);

  // Get the latest deployed URL
  const latestSuccess = [...deployHistory].reverse().find((h) => h.status === "success" && h.url);
  const liveUrl = latestSuccess?.url;
  const isSuccess = !isPublishing && deployProgress === 100 && liveUrl;
  const isFailed = !isPublishing && deployProgress === 100 && !liveUrl && deployLogs.some(l => l.includes("ERROR") || l.includes("❌"));
  const currentStepIdx = getStepIndex(currentStep || "START");
  const hasError = deployLogs.some(l => l.includes("ERROR") || l.includes("❌"));

  const handleCopy = () => {
    if (liveUrl) {
      navigator.clipboard.writeText(liveUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen && !isPublishing) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <div
        className="relative w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl flex flex-col"
        style={{ maxHeight: "90vh", background: "#0d1117" }}
      >
        {/* ── Header ─────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/20">
              <Rocket className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg leading-tight">Publish to Netlify</h2>
              <p className="text-white/40 text-xs">Real-time deployment pipeline</p>
            </div>
          </div>
          {!isPublishing && (
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 text-white/50" />
            </button>
          )}
        </div>

        <div className="flex flex-1 overflow-hidden min-h-0">
          {/* ── Left: Logs + Progress ───────────────────────────── */}
          <div className="flex-1 flex flex-col min-w-0 border-r border-white/10">

            {/* Step Pipeline */}
            <div className="px-6 py-5 border-b border-white/10 bg-white/[0.03]">
              <div className="flex items-center gap-1">
                {STEPS.map((step, idx) => {
                  const done   = !isPublishing && deployProgress >= step.progress && !hasError;
                  const active = isPublishing && currentStepIdx === idx;
                  const error  = hasError && currentStepIdx === idx;
                  return (
                    <React.Fragment key={step.key}>
                      <div className="flex flex-col items-center gap-1 flex-1">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all duration-500
                            ${error   ? "bg-red-500/20 ring-2 ring-red-500 text-red-400" :
                              done    ? "bg-emerald-500/20 ring-2 ring-emerald-500 text-emerald-400" :
                              active  ? "bg-blue-500/20 ring-2 ring-blue-400 text-blue-400 animate-pulse" :
                                        "bg-white/5 text-white/20"}`}
                        >
                          {done ? "✓" : step.icon}
                        </div>
                        <span className={`text-[10px] font-medium whitespace-nowrap
                          ${done ? "text-emerald-400" : active ? "text-blue-400" : "text-white/25"}`}>
                          {step.label}
                        </span>
                      </div>
                      {idx < STEPS.length - 1 && (
                        <div className={`flex-1 h-px mb-5 transition-all duration-700
                          ${currentStepIdx > idx || done ? "bg-emerald-500/50" : "bg-white/10"}`} />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Progress bar */}
              <div className="mt-4 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden
                    ${hasError ? "bg-red-500" : "bg-gradient-to-r from-blue-500 to-blue-400"}`}
                  style={{ width: `${deployProgress}%` }}
                >
                  {isPublishing && (
                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-white/40 text-xs">
                  {isPublishing ? (
                    currentStep === "INSTALL" ? "Installing npm packages..." :
                    currentStep === "BUILD"   ? "Compiling your website..." :
                    currentStep === "DEPLOY"  ? "Uploading to Netlify..." :
                    currentStep === "DONE"    ? "Going live..." :
                                               "Preparing environment..."
                  ) : isSuccess ? "Deployed successfully!" : isFailed ? "Deployment failed" : "Idle"}
                </span>
                <span className={`text-sm font-black tabular-nums
                  ${hasError ? "text-red-400" : isSuccess ? "text-emerald-400" : "text-blue-400"}`}>
                  {deployProgress}%
                </span>
              </div>
            </div>

            {/* Terminal logs */}
            <div className="flex-1 overflow-hidden flex flex-col min-h-0 p-4">
              <div className="flex-1 bg-black/40 rounded-xl p-4 font-mono text-xs overflow-y-auto space-y-0.5 deploy-scrollbar border border-white/5">
                {deployLogs.length === 0 && !isPublishing && (
                  <div className="text-white/20 flex items-center gap-2 h-full justify-center">
                    <Clock className="w-4 h-4" />
                    <span>Waiting for deployment to start...</span>
                  </div>
                )}
                {deployLogs.map((log, idx) => {
                  const color = getLogColor(log);
                  if (color === "hidden") return null;
                  return (
                    <div key={idx} className={`leading-5 ${color} break-all`}>
                      {log.startsWith("URL:") ? (
                        <span>
                          <span className="text-white/40">$</span>{" "}
                          <span className="text-cyan-300">✅ Live: </span>
                          <a
                            href={log.substring(4).trim()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline underline-offset-2 hover:text-cyan-200"
                          >
                            {log.substring(4).trim()}
                          </a>
                        </span>
                      ) : (
                        <span>
                          <span className="text-white/20 mr-2 select-none">›</span>
                          {log}
                        </span>
                      )}
                    </div>
                  );
                })}
                {isPublishing && (
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "0.15s" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "0.3s" }} />
                  </div>
                )}
                <div ref={logsEndRef} />
              </div>
            </div>
          </div>

          {/* ── Right: Status + History ──────────────────────────── */}
          <div className="w-72 flex flex-col bg-black/20">

            {/* Success Card */}
            {isSuccess && liveUrl ? (
              <div className="p-4 border-b border-white/10">
                <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto">
                    <Globe className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-emerald-400 font-bold text-sm">🎉 Site is Live!</p>
                    <p className="text-white/40 text-xs mt-0.5 break-all leading-relaxed">{liveUrl}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCopy}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-white/10 hover:bg-white/15 text-white/70 text-xs font-medium transition-colors"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? "Copied!" : "Copy URL"}
                    </button>
                    <a
                      href={liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-xs font-medium transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Open Site
                    </a>
                  </div>
                  <Link
                    href="/dashboard"
                    className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-xs font-medium transition-colors"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    View in Dashboard
                  </Link>
                </div>
              </div>
            ) : isFailed ? (
              <div className="p-4 border-b border-white/10">
                <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mx-auto">
                    <XCircle className="w-6 h-6 text-red-400" />
                  </div>
                  <p className="text-red-400 font-bold text-sm">Deployment Failed</p>
                  <p className="text-white/40 text-xs">Check the logs for details.</p>
                </div>
              </div>
            ) : isPublishing ? (
              <div className="p-4 border-b border-white/10">
                <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-5 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto relative">
                    <RefreshCw className="w-6 h-6 text-blue-400 animate-spin" />
                  </div>
                  <p className="text-blue-400 font-bold text-sm">Building...</p>
                  <p className="text-white/40 text-xs">This usually takes 1–2 minutes.</p>
                </div>
              </div>
            ) : null}

            {/* Deploy History */}
            <div className="px-4 py-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <History className="w-3.5 h-3.5 text-white/40" />
                <span className="text-white/40 text-xs font-semibold uppercase tracking-widest">History</span>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2 deploy-scrollbar">
              {deployHistory.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-white/20 text-xs">No deployments yet</p>
                </div>
              ) : (
                [...deployHistory].reverse().map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-white/10 bg-white/[0.03] p-3 relative overflow-hidden"
                  >
                    <div className={`absolute top-0 left-0 w-0.5 h-full ${item.status === "success" ? "bg-emerald-500" : "bg-red-500"}`} />
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        {item.status === "success"
                          ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          : <XCircle className="w-3.5 h-3.5 text-red-400" />}
                        <span className={`text-xs font-semibold ${item.status === "success" ? "text-emerald-400" : "text-red-400"}`}>
                          {item.status === "success" ? "Published" : "Failed"}
                        </span>
                      </div>
                      <span className="text-white/25 text-[10px]">
                        {new Date(item.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[10px] text-blue-400 hover:text-blue-300 mt-1 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span className="truncate">{item.url.replace("https://", "")}</span>
                      </a>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .deploy-scrollbar::-webkit-scrollbar { width: 4px; }
        .deploy-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .deploy-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
        .deploy-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
        @keyframes deploy-pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
      `}} />
    </div>
  );
}
