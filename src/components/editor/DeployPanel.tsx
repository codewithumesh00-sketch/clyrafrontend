import React, { useEffect, useRef } from "react";
import { useWebsiteBuilderStore } from "@/store/useWebsiteBuilderStore";
import { CheckCircle2, XCircle, Clock, ExternalLink, X, History } from "lucide-react";

interface DeployPanelProps {
  isOpen: boolean;
  onClose: () => void;
  isDeploying: boolean;
}

export default function DeployPanel({ isOpen, onClose }: DeployPanelProps) {
  const { deployProgress, deployLogs, deployHistory, isPublishing, currentStep } = useWebsiteBuilderStore();
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [deployLogs]);

  if (!isOpen && !isPublishing) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <History className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Deployment Center</h2>
          </div>
          {!isPublishing && (
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          )}
        </div>

        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          
          {/* Main Area: Progress & Logs */}
          <div className="flex-1 flex flex-col border-r border-gray-100 bg-gray-50/50">
            {isPublishing || deployLogs.length > 0 ? (
              <div className="flex flex-col h-full">
                
                {/* Progress Section */}
                <div className="p-6 bg-white border-b">
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {deployProgress === 100 
                          ? (deployLogs[deployLogs.length - 1]?.includes("ERROR") ? "Deployment Failed" : "✅ Live Site Ready") 
                          : "Deploying..."}
                      </h3>
                      <p className="text-sm font-medium text-blue-600 mt-1">
                        {isPublishing ? (
                          currentStep === "START" ? "🚀 Preparing files..." :
                          currentStep === "INSTALL" ? "📦 Installing dependencies..." :
                          currentStep === "BUILD" ? "🏗️ Building project..." :
                          currentStep === "DEPLOY" ? "📤 Uploading..." :
                          currentStep === "DONE" ? "✅ Going live..." : "Processing..."
                        ) : "Process finished."}
                      </p>
                    </div>
                    <span className="text-2xl font-black text-blue-600">{deployProgress}%</span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden relative">
                    <div 
                      className={`h-full absolute left-0 top-0 transition-all duration-500 ease-out ${
                        deployProgress === 100 && deployLogs[deployLogs.length - 1]?.includes("ERROR") 
                          ? "bg-red-500" 
                          : "bg-blue-600"
                      }`}
                      style={{ width: `${deployProgress}%` }}
                    />
                    {isPublishing && (
                      <div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden rounded-full">
                        <div className="w-full h-full bg-white/20 animate-[shimmer_1.5s_infinite] -translate-x-full" style={{ transform: "skewX(-20deg)" }} />
                      </div>
                    )}
                  </div>
                </div>

                {/* Terminal Logs */}
                <div className="flex-1 p-6 overflow-hidden flex flex-col">
                  <div className="flex-1 bg-black rounded-xl p-4 font-mono text-sm overflow-y-auto shadow-inner custom-scrollbar">
                    {deployLogs.map((log, idx) => (
                      <div 
                        key={idx} 
                        className={`mb-1.5 ${
                          log.includes("ERROR") || log.includes("❌") ? "text-red-400" :
                          log.includes("URL:") ? "text-cyan-400 font-bold" :
                          "text-green-400"
                        }`}
                      >
                        {log.replace("URL:", "✅ Live Site Ready: ")}
                      </div>
                    ))}
                    {isPublishing && (
                      <div className="flex gap-1 mt-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-bounce" />
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-bounce" style={{ animationDelay: "0.2s" }} />
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-bounce" style={{ animationDelay: "0.4s" }} />
                      </div>
                    )}
                    <div ref={logsEndRef} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                  <Clock className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Ready to Deploy</h3>
                <p className="text-sm text-gray-500 mt-2 max-w-sm">
                  Click publish to start building your site. Progress and logs will appear here.
                </p>
              </div>
            )}
          </div>

          {/* Sidebar Area: Deploy History */}
          <div className="w-full md:w-80 bg-white flex flex-col">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-semibold text-gray-900 text-sm">Deployment History</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
              {deployHistory.length === 0 ? (
                <div className="text-center py-8 px-4">
                  <p className="text-sm text-gray-400">No deployments yet.</p>
                </div>
              ) : (
                deployHistory.map((item) => (
                  <div key={item.id} className="p-4 rounded-xl border border-gray-100 bg-white hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className={`absolute top-0 left-0 w-1 h-full ${item.status === "success" ? "bg-green-500" : "bg-red-500"}`} />
                    
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {item.status === "success" 
                          ? <CheckCircle2 className="w-4 h-4 text-green-500" />
                          : <XCircle className="w-4 h-4 text-red-500" />
                        }
                        <span className="font-medium text-sm text-gray-900">
                          {item.status === "success" ? "Published" : "Failed"}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(item.date).toLocaleDateString()} {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {item.url && (
                      <a 
                        href={item.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors w-full justify-center"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Open Live Site
                      </a>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% { transform: translateX(100%) skewX(-20deg); }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 4px; }
        .bg-black.custom-scrollbar::-webkit-scrollbar-thumb { background: #22c55e; }
      `}} />
    </div>
  );
}
