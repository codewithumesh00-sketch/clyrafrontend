"use client";

import React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import Editor from "@monaco-editor/react";
import { useRouter } from "next/navigation";
import LivePreview from "@/components/LivePreview";
import LoaderSkeleton from "@/components/LoaderSkeleton";
import TemplateStudioPreview, {
  buildStudioExportSource,
  resolveStudioTemplateId,
} from "@/components/TemplateStudioPreview";
import { normalizeSiteContent } from "@/lib/siteContent";
import JSZip from "jszip";
import { useAuth } from "@/hooks/useAuth";
import { generateWebsite } from "@/lib/api";
import { useWebsiteBuilderStore } from "@/store/useWebsiteBuilderStore";
import {
  Cpu, Loader2, Code2, Trash2, Sparkles, ArrowUp, Play, Copy, Check,
  Monitor, Eye, RefreshCw, Zap, Terminal, ChevronRight, X, Maximize2,
  Minimize2, FileText, PenLine, BookOpen, Palette, Rocket, ExternalLink,
  Globe, Download, Plus, Layers, AlertTriangle, Home as HomeIcon, Search, FolderOpen,
  Star, Users, Clock, Gift, Zap as ZapIcon, Menu, LogOut, ChevronDown,
  Command, Layout, Settings, HelpCircle, Sun, Moon, MessageSquare, MessageSquareOff,
  Send, Smartphone, Tablet, Circle, CheckCircle2, XCircle, Edit2
} from "lucide-react";

type GeneratorMode = "ui" | "blog";
type ActiveView = "editor" | "preview";
type ThemeMode = "dark" | "light";

// ==================== ⚙️ CONFIGURATION ====================
const CONFIG = {
  AUTO_GENERATE_ON_LOAD: false,
  ENABLE_PROMPT_VARIATIONS: false,
  CLEAR_CACHE_ON_ROTATE: true,
  API_COOLDOWN_MS: 2000,
} as const;

// ✅ Animated words for chat header
const ANIMATED_WORDS = ["Building...", "Creating...", "Designing...", "Crafting...", "Generating..."];

// Debounce utility
const debounce = <TArgs extends unknown[]>(
  func: (...args: TArgs) => void,
  wait: number
): ((...args: TArgs) => void) & { cancel: () => void } => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const debouncedFunc = (...args: TArgs) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };

  debouncedFunc.cancel = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  return debouncedFunc;
};

const capitalize = (str: string): string => {
  if (!str) return "Page";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Error Boundary
class SandpackErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Sandpack Preview Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-10 text-red-400 flex flex-col items-center justify-center h-full">
          <AlertTriangle size={48} className="mb-4" />
          <p className="font-semibold">Preview Error ⚠️</p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="mt-4 px-4 py-2 bg-violet-500/20 text-violet-300 rounded-lg hover:bg-violet-500/30 transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function Home() {
  // UI States
  const [inputValue, setInputValue] = useState("");
  const [prompt, setPrompt] = useState("");
  const [siteData, setSiteData] = useState<any>(null);

  // ✅ STEP 1: ADD GLOBAL SCHEMA STATE
  const [liveSchema, setLiveSchema] = useState<any>(null);

  const [loading, setLoading] = useState(false);

  const filesRef = useRef<{ [key: string]: string }>({});
  const [filesState, setFilesState] = useState<{ [key: string]: string }>({});

  const [studioTemplateId, setStudioTemplateId] = useState<string | null>(null);
  const [studioContent, setStudioContent] = useState<Record<string, unknown>>({
    navigation: {
      logo: "https://cdn-icons-png.flaticon.com/512/5968/5968705.png",
      links: ["Home", "About", "Services", "Pricing", "Contact"],
    },
    hero: {
      heading: "Template 6 Working Successfully 🚀",
      subheading: "This is direct Template 6 test mode",
      buttonText: "Get Started",
    },
    about: {
      title: "About Our Platform",
      description: "This confirms template6 is rendering correctly.",
    },
    services: [
      {
        title: "AI Website Builder",
        description: "Create websites instantly with AI.",
      },
    ],
    contact: {
      email: "hello@clyrawebweb.com",
      phone: "+91 9876543210",
    },
    footer: {
      company: "Your AI Builder",
      copyright: "© 2026",
    },
  });
  const [currentFile, setCurrentFile] = useState("src/app/page.tsx");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState("Ready");
  const [isLoading, setIsLoading] = useState(false);
  const [activeView, setActiveView] = useState<ActiveView>("preview");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [generationHistory, setGenerationHistory] = useState<string[]>([]);
  const [generatedPages, setGeneratedPages] = useState<string[]>(["home"]);
  const savedProjects = useWebsiteBuilderStore((s) => s.savedProjects);
  const [globalCss, setGlobalCss] = useState(`/* Global Styles */
:root {
  --primary: #8b5cf6;
  --background: #000000;
  --foreground: #ffffff;
}
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  font-family: system-ui, -apple-system, sans-serif;
  background: var(--background);
  color: var(--foreground);
}
`);
  const [assets, setAssets] = useState<{ [key: string]: string }>({});

  // Blog States
  const [blogInputValue, setBlogInputValue] = useState("");
  const [blogPrompt, setBlogPrompt] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [blogTitle, setBlogTitle] = useState("");
  const [blogStatus, setBlogStatus] = useState("Ready");


  // Shared States
  const [activeMode, setActiveMode] = useState<GeneratorMode>("ui");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [currentPath, setCurrentPath] = useState("/");
  const [isTyping, setIsTyping] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);
  const [showSidebar, setShowSidebar] = useState(true);
  const [theme, setTheme] = useState<ThemeMode>("dark");

  // ✅ Chatbox toggle state + animated word index
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [animatedWordIndex, setAnimatedWordIndex] = useState(0);

  // Search State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const lastGenerateRef = useRef<number>(0);
  const editorRef = useRef<unknown>(null);
  const promptDebounceRef = useRef<((val: string) => void) & { cancel: () => void } | null>(null);
  const blogPromptDebounceRef = useRef<((val: string) => void) & { cancel: () => void } | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSchemaRef = useRef("");

  const router = useRouter();
  const { user: firebaseUser, loading: authLoading, logout } = useAuth();

  const API_ORIGIN =
    process.env.NEXT_PUBLIC_API_URL || "https://clyrawebbackend-666777548.europe-west1.run.app";
  const UI_WEBHOOK =
    process.env.NEXT_PUBLIC_UI_WEBHOOK || `${API_ORIGIN.replace(/\/$/, "")}/generate`;
  const BLOG_WEBHOOK =
    process.env.NEXT_PUBLIC_BLOG_WEBHOOK ||
    `${API_ORIGIN.replace(/\/$/, "")}/generate-blog`;

  // 🎨 THEME MANAGEMENT - PURE BLACK/WHITE
  useEffect(() => {
    useWebsiteBuilderStore.getState().loadProjects();
    const savedTheme = localStorage.getItem("clyrawebweb-theme") as ThemeMode;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("clyrawebweb-theme", theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.style.backgroundColor = "#000000";
      document.documentElement.style.color = "#ffffff";
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.style.backgroundColor = "#ffffff";
      document.documentElement.style.color = "#000000";
    }
    document.body.style.backgroundColor = theme === "dark" ? "#000000" : "#ffffff";
    document.body.style.color = theme === "dark" ? "#ffffff" : "#000000";
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === "dark" ? "light" : "dark");
  };

  const isDark = theme === "dark";

  // ✅ Animated word rotation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedWordIndex(prev => (prev + 1) % ANIMATED_WORDS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // ✅ STEP 2: ADD SYNC EFFECT
  useEffect(() => {
    const syncLiveSchema = () => {
      try {
        const raw = localStorage.getItem("clyraweb-live-schema");
        if (!raw) return;
        const parsed = JSON.parse(raw);

        setLiveSchema((prev: any) => {
          const oldSchema = JSON.stringify(prev);
          const newSchema = JSON.stringify(parsed);
          if (oldSchema === newSchema) return prev;
          return parsed;
        });
      } catch (error) {
        console.error("AI Studio sync failed:", error);
      }
    };

    syncLiveSchema();
    window.addEventListener("storage", syncLiveSchema);
    window.addEventListener("focus", syncLiveSchema);
    window.addEventListener("clyraweb-schema-updated", syncLiveSchema);

    return () => {
      window.removeEventListener("storage", syncLiveSchema);
      window.removeEventListener("focus", syncLiveSchema);
      window.removeEventListener("clyraweb-schema-updated", syncLiveSchema);
    };
  }, []);

  // Responsive detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 768) setShowSidebar(false);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentPath(window.location.pathname);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;

    const timeout = setTimeout(() => {
      if (!firebaseUser) {
        router.push("/login");
      }
    }, 1000); // 🔥 increase delay

    return () => clearTimeout(timeout);
  }, [authLoading, firebaseUser]);

  // Timer
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    const start = () => { timer = setInterval(() => setCurrentTime(new Date()), 1000); };
    const stop = () => { if (timer) clearInterval(timer); };
    const handleVisibilityChange = () => { document.hidden ? stop() : start(); };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    start();
    return () => {
      stop();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Debounce setup
  useEffect(() => {
    promptDebounceRef.current = debounce((val: string) => setPrompt(val), 400);
    blogPromptDebounceRef.current = debounce((val: string) => setBlogPrompt(val), 400);
    return () => {
      promptDebounceRef.current?.cancel();
      blogPromptDebounceRef.current?.cancel();
    };
  }, []);

  // Ctrl+K to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
        setTimeout(() => searchInputRef.current?.focus(), 50);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  // ✅ FIX #1: Sync currentFile + code when file changes
  useEffect(() => {
    if (currentFile === "assets/style.css") {
      setCode(globalCss);
    } else {
      setCode(filesState[currentFile] || "");
    }
  }, [currentFile, filesState, globalCss]);

  // ✅ Generate UI Handler
  const handleGenerateUI = useCallback(async () => {
    if (!prompt.trim()) return;
    const now = Date.now();
    if (now - lastGenerateRef.current < CONFIG.API_COOLDOWN_MS) {
      setStatus("Please wait before generating again");
      return;
    }
    lastGenerateRef.current = now;

    setIsLoading(true);
    setStatus("Initializing AI Pipeline...");

    try {
      const result = await generateWebsite(prompt.trim());
      const aiSchema = result.website || result.schema || result.content || result.data || result;

      console.log("🔥 Backend result:", result);
      console.log("🔥 Parsed schema:", aiSchema);

      if (!aiSchema) throw new Error("Invalid AI schema");

      localStorage.setItem("clyraweb-live-schema", JSON.stringify(aiSchema));
      localStorage.setItem("generated-schema", JSON.stringify(aiSchema));

      // ✅ Sync with the global editor store
      useWebsiteBuilderStore.getState().setSchema(aiSchema);
      useWebsiteBuilderStore.getState().addProject({
        id: `proj_${Date.now()}`,
        title: prompt.trim() || "Generated Website",
        template: aiSchema.templateId || "template1",
        status: "draft",
        createdAt: new Date().toISOString(),
        schema: aiSchema,
      });

      setLiveSchema(aiSchema);
      setSiteData(aiSchema);
      setPreviewKey((prev) => prev + 1);
      setActiveView("preview");
      setStatus("AI website generated successfully 🚀");

      setStudioTemplateId(null);
      setStudioContent(aiSchema);

      const pagesToGenerate = aiSchema.pages?.map((p: any) => p.page) || ["home"];
      setGeneratedPages(pagesToGenerate);

      const generatePageCode = (pageName: string, pageSchema: any) => `
"use client";

import WebsiteRenderer from "@/components/renderer/WebsiteRenderer";

export default function ${capitalize(pageName || "Home")}Page() {
  const schema = ${JSON.stringify(pageSchema, null, 2)}
  return (
    <div className="min-h-screen bg-black">
      <WebsiteRenderer schema={schema} isPublished={true} />
    </div>
  );
}
`;

      const generatePageSchema = (pageName: string) => {
        const currentPage = aiSchema.pages?.find((p: any) => p.page === pageName);
        return {
          theme: aiSchema.theme,
          layout: aiSchema.layout,
          pages: currentPage ? [currentPage] : [],
        };
      };

      const generatedFiles: Record<string, string> = {};
      pagesToGenerate.forEach((pageName: string) => {
        const pageSchema = generatePageSchema(pageName);
        const filePath = pageName === "home" ? "src/app/page.tsx" : `src/app/${pageName}/page.tsx`;
        generatedFiles[filePath] = generatePageCode(pageName, pageSchema);
      });

      filesRef.current = generatedFiles;
      setFilesState(generatedFiles);

      await saveProject(firebaseUser?.uid, generatedFiles, { schema: JSON.stringify(aiSchema) });

      setCurrentFile(pagesToGenerate.includes("home") ? "src/app/page.tsx" : `src/app/${pagesToGenerate[0]}/page.tsx`);
      setCode(generatedFiles["src/app/page.tsx"] || "");
      setActiveView("preview");

      if (!assets?.['style.css']) {
        setAssets(prev => ({ ...prev, 'style.css': globalCss }));
      }

      setGenerationHistory((prev) => [...prev.slice(-4), prompt]);
      setStatus(`Generated ${pagesToGenerate.length} AI pages 🚀`);

    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      setStatus(message === "Failed to fetch" ? "Backend not reachable" : `Error: ${message}`);
      console.error("Generation error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [prompt, siteData, globalCss, firebaseUser?.uid, assets]);

  // Rotate Template
  const handleRotateTemplate = useCallback(() => {
    if (CONFIG.CLEAR_CACHE_ON_ROTATE) {
      filesRef.current = {};
      setFilesState({});
      setPreviewKey(prev => prev + 1);
    }
    setStudioTemplateId(null);
    setStatus("Generating new variation...");
    handleGenerateUI();
  }, [handleGenerateUI]);

  const handlePromptChange = (val: string) => {
    setInputValue(val);
    promptDebounceRef.current?.(val);
  };

  const handleBlogPromptChange = (val: string) => {
    setBlogInputValue(val);
    blogPromptDebounceRef.current?.(val);
  };

  // ✅ saveProject function
  const saveProject = async (
    uid: string | undefined,
    projectFiles: { [key: string]: string },
    projectAssets: { [key: string]: string }
  ) => {
    if (!uid) return;
    try {
      await fetch(`${API_ORIGIN}/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          files: {
            ...projectFiles,
            "package.json": JSON.stringify({
              name: "clyraweb-project",
              private: true,
              scripts: { dev: "next dev", build: "next build", start: "next start" },
              dependencies: { next: "14.1.0", react: "18.2.0", "react-dom": "18.2.0" }
            }, null, 2),
            "next.config.js": `/** @type {import('next').NextConfig} */\nconst nextConfig = {};\nmodule.exports = nextConfig;`,
            "src/components/renderer/WebsiteRenderer.tsx": `export default function WebsiteRenderer({ schema }: any) { return <div style={{ padding: "40px", color: "white", background: "black", minHeight: "100vh" }}><pre>{JSON.stringify(schema, null, 2)}</pre></div>; }`
          },
          projectName: "clyraweb-project",
          platform: "auto",
        }),
      });
    } catch (error) {
      console.error("Failed to save project:", error);
    }
  };

  // Generate Blog Handler
  const handleGenerateBlog = useCallback(async () => {
    if (!blogPrompt.trim()) return;
    setIsLoading(true);
    setBlogStatus("Crafting Your Blog Post...");
    try {
      const response = await fetch(BLOG_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        mode: "cors",
        body: JSON.stringify({ prompt: blogPrompt }),
      });
      if (!response.ok) throw new Error(`Server responded with ${response.status}`);
      const data = await response.json();
      if (!data.blog || data.blog.trim() === "") throw new Error("Empty blog content received");
      setBlogTitle(data.title || blogPrompt.charAt(0).toUpperCase() + blogPrompt.slice(1));
      setBlogContent(cleanAIResponse(data.blog));
      setBlogStatus("Blog Post Generated Successfully");
      setActiveView("preview");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      setBlogStatus(message === "Failed to fetch" ? "Connection Error: Check Blog Server" : `Error: ${message}`);
    } finally {
      setIsLoading(false);
    }
  }, [blogPrompt, BLOG_WEBHOOK]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        if (activeMode === "ui") handleGenerateUI();
        else handleGenerateBlog();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
      }
      if (e.key === "Escape") {
        setIsFullscreen(false);
        setShowMobileMenu(false);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "`") {
        e.preventDefault();
        setIsChatOpen(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeMode, handleGenerateUI, handleGenerateBlog]);

  const cleanAIResponse = (text: string) => {
    return text
      .replace(/```[a-z]*\n?/gi, "")
      .replace(/```/g, "")
      .replace(/^(sure|here is|okay|certainly|of course|i will|understood).{0,120}\n/gi, "")
      .trim();
  };




  const resetWorkspace = () => {
    if (activeMode === "ui") {
      setInputValue("");
      setPrompt("");
      setSiteData(null);
      setLiveSchema(null);
      setStudioContent(null as any);
      localStorage.removeItem("clyraweb-live-schema");
      filesRef.current = {};
      setFilesState({});
      setStudioTemplateId(null);
      setCurrentFile("src/app/page.tsx");
      setCode("");
      setStatus("Ready");
      setActiveView("editor");
      setPreviewKey(0);
      setGenerationHistory([]);
      setGeneratedPages(["home"]);
      useWebsiteBuilderStore.getState().resetToDefault();
    } else {
      setBlogInputValue("");
      setBlogPrompt("");
      setBlogContent("");
      setBlogTitle("");
      setBlogStatus("Ready");
    }
  };

  // ✅ FIX #2: Update filesRef and trigger preview refresh on editor change
  const handleEditorChange = useCallback((value: string | undefined) => {
    const newValue = value || "";
    setCode(newValue);

    if (currentFile === "assets/style.css") {
      setGlobalCss(newValue);
    } else {
      filesRef.current[currentFile] = newValue;
      setFilesState({ ...filesRef.current });
      setPreviewKey((prev) => prev + 1);
    }

    setIsTyping(true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 400);
  }, [currentFile]);

  const handleSaveFile = useCallback(() => {
    filesRef.current[currentFile] = code;
    setFilesState({ ...filesRef.current });
    setStatus("File saved");
    setTimeout(() => setStatus("Ready"), 2000);
  }, [currentFile, code]);

  const handleShare = async () => {
    const shareData = {
      title: "Your AI Builder - AI Website Builder",
      text: "Build stunning, production-ready websites with AI. Check out Your AI Builder!",
      url: window.location.origin,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
      alert("Link copied to clipboard!");
    }
  };

  const renderBlogPreview = () => {
    if (!blogContent) {
      return (
        <div className={`relative w-full h-full overflow-hidden flex items-center justify-center p-8 transition-colors duration-300 ${isDark ? 'bg-black' : 'bg-white'}`}>
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className={`absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full blur-[100px] animate-pulse ${isDark ? 'bg-violet-900/20' : 'bg-purple-200/30'}`} />
            <div className={`absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full blur-[100px] animate-pulse delay-700 ${isDark ? 'bg-emerald-900/20' : 'bg-emerald-200/30'}`} />
            <div className={`absolute -bottom-[10%] left-[20%] w-[60%] h-[40%] rounded-full blur-[100px] animate-pulse delay-1000 ${isDark ? 'bg-blue-900/20' : 'bg-blue-200/30'}`} />
          </div>
          <div className={`absolute inset-0 ${isDark ? 'opacity-10' : 'opacity-20'} mix-blend-overlay`} style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }}></div>
          <div className={`absolute inset-0 ${isDark ? 'bg-[linear-gradient(to_right,#3f3f4612_1px,transparent_1px),linear-gradient(to_bottom,#3f3f4612_1px,transparent_1px)]' : 'bg-[linear-gradient(to_right,#d4d4d812_1px,transparent_1px),linear-gradient(to_bottom,#d4d4d812_1px,transparent_1px)]'} bg-[size:24px_24px]`}></div>
          <div className={`relative z-10 text-center max-w-lg mx-auto p-8 rounded-3xl border backdrop-blur-xl shadow-2xl ${isDark ? 'border-white/5 bg-black/40' : 'border-black/5 bg-white/40'}`}>
            <div className="relative w-24 h-24 mx-auto mb-8 group">
              <div className={`absolute inset-0 rounded-2xl blur opacity-40 group-hover:opacity-60 transition-opacity duration-500 animate-pulse ${isDark ? 'bg-gradient-to-br from-violet-500 to-purple-600' : 'bg-gradient-to-br from-purple-400 to-violet-500'}`}></div>
              <div className={`relative w-full h-full rounded-2xl flex items-center justify-center shadow-xl transform group-hover:scale-105 transition-transform duration-300 ${isDark ? 'bg-gradient-to-br from-violet-600 to-purple-700' : 'bg-gradient-to-br from-purple-500 to-violet-600'}`}>
                <PenLine size={40} className="text-white drop-shadow-md" />
              </div>
              <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full blur-[2px] animate-ping opacity-75 ${isDark ? 'bg-violet-400' : 'bg-purple-400'}`}></div>
            </div>
            <h3 className={`text-3xl font-bold mb-3 ${isDark ? 'text-white' : 'text-zinc-900'}`}>Ready to Create</h3>
            <p className={`mb-8 leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>Enter a topic below to generate a professional, SEO-optimized blog post instantly with AI.</p>
            <div className={`w-full max-w-xs mx-auto h-12 rounded-full border flex items-center px-4 shadow-sm opacity-50 ${isDark ? 'bg-black border-zinc-700' : 'bg-white border-zinc-300'}`}>
              <div className={`w-4 h-4 rounded-full mr-3 animate-pulse ${isDark ? 'bg-zinc-700' : 'bg-zinc-300'}`}></div>
              <div className={`h-2 w-32 rounded-full animate-pulse ${isDark ? 'bg-zinc-800' : 'bg-zinc-200'}`}></div>
            </div>
            <div className={`mt-4 text-xs font-medium uppercase tracking-widest ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>AI Engine Ready</div>
          </div>
        </div>
      );
    }
    return (
      <div className={`w-full h-full overflow-y-auto ${isDark ? 'bg-black' : 'bg-white'}`}>
        <article className={`max-w-3xl mx-auto px-8 py-12 prose prose-lg ${isDark ? 'prose-invert' : ''}`}>
          {blogTitle && (
            <header className={`mb-8 pb-6 border-b ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
              <h1 className={`text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-zinc-900'}`}>{blogTitle}</h1>
              <div className={`flex items-center gap-4 text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                <span className="flex items-center gap-1"><Sparkles size={12} className={isDark ? 'text-violet-400' : 'text-purple-500'} /> AI Generated</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
            </header>
          )}
          <div dangerouslySetInnerHTML={{ __html: blogContent }} />
        </article>
      </div>
    );
  };

  const renderEditorContent = () => {
    if (activeMode === "ui") {
      return (
        <Editor
          height="100%"
          theme={isDark ? "vs-dark" : "light"}
          language="typescript"
          value={code}
          onChange={handleEditorChange}
          onMount={(editor) => (editorRef.current = editor)}
          options={{
            fontSize: isMobile ? 12 : 14,
            minimap: { enabled: !isMobile },
            wordWrap: "on",
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            cursorBlinking: "smooth",
            fontFamily: "'JetBrains Mono', monospace",
            padding: { top: 16 },
            lineNumbers: isMobile ? "off" : "on",
            automaticLayout: true,
            readOnly: isLoading,
          }}
        />
      );
    }
    return (
      <Editor
        height="100%"
        theme={isDark ? "vs-dark" : "light"}
        language="markdown"
        value={blogContent}
        onChange={(value) => {
          setBlogContent(value || "");
          setIsTyping(true);
          if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
          typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 400);
        }}
        options={{
          fontSize: isMobile ? 12 : 14,
          minimap: { enabled: !isMobile },
          wordWrap: "on",
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          cursorBlinking: "smooth",
          fontFamily: "'JetBrains Mono', monospace",
          padding: { top: 16 },
          lineNumbers: isMobile ? "off" : "on",
          automaticLayout: true,
          readOnly: isLoading,
        }}
      />
    );
  };

  if (authLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-black text-white' : 'bg-white text-zinc-900'}`}>
        <div className="flex items-center gap-2 text-sm">
          <Loader2 size={18} className="animate-spin" />
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className={`h-screen flex overflow-hidden font-sans ${isDark ? 'bg-black text-white' : 'bg-white text-zinc-900'}`}>
      {/* Sidebar */}
      <aside className={`${showSidebar ? 'w-64' : 'w-0'} flex-shrink-0 border-r transition-all duration-300 overflow-hidden flex flex-col ${isDark ? 'bg-black border-zinc-800' : 'bg-white border-zinc-200'}`}>
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={isDark ? "https://res.cloudinary.com/dzwxmiu47/image/upload/q_auto/f_auto/v1776653092/Gemini_Generated_Image_qoawvdqoawvdqoaw_wk3t7j.png" : "https://res.cloudinary.com/dzwxmiu47/image/upload/q_auto/f_auto/v1776653092/Gemini_Generated_Image_t3eylit3eylit3ey_cdkk4p.png"} alt="Logo" className="h-8 md:h-10 w-auto object-contain" />
          </div>
          <button onClick={() => setShowSidebar(false)} className={`p-1 rounded transition-colors ${isDark ? 'hover:bg-zinc-800' : 'hover:bg-zinc-100'}`}>
            <X size={16} className="text-red-500" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          <button className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${isDark ? 'text-zinc-400 hover:text-white hover:bg-zinc-900' : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'}`}>
            <HomeIcon size={18} />
            Home
          </button>
          {isSearchOpen ? (
            <div className={`flex items-center px-3 py-1.5 rounded-lg border ${isDark ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-white border-zinc-300 text-zinc-900'}`}>
              <Search size={16} className={isDark ? 'text-zinc-500' : 'text-zinc-400'} />
              <input
                ref={searchInputRef as any}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects..."
                className="w-full bg-transparent border-none outline-none text-sm px-2"
                onBlur={() => { if (!searchQuery) setIsSearchOpen(false); }}
              />
              <button onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }}>
                <X size={14} className={isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-zinc-400 hover:text-zinc-600'} />
              </button>
            </div>
          ) : (
            <button onClick={() => { setIsSearchOpen(true); setTimeout(() => searchInputRef.current?.focus(), 50); }} className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${isDark ? 'text-zinc-400 hover:text-white hover:bg-zinc-900' : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'}`}>
              <div className="flex items-center gap-3">
                <Search size={18} />
                Search
              </div>
              <span className={`text-xs px-2 py-0.5 rounded ${isDark ? 'text-zinc-600 bg-zinc-900' : 'text-zinc-500 bg-zinc-100'}`}>Ctrl K</span>
            </button>
          )}
          <button className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${isDark ? 'text-zinc-400 hover:text-white hover:bg-zinc-900' : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'}`}>
            <HelpCircle size={18} />
            Resources
          </button>

          <div className="pt-4 pb-2">
            <span className={`text-xs font-medium px-3 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Generated Pages</span>
          </div>

          {generatedPages.map((page) => (
            <button
              key={page}
              onClick={() => {
                const filePath = page === "home" ? "src/app/page.tsx" : `src/app/${page}/page.tsx`;
                setCurrentFile(filePath);
                setCode(filesState[filePath] || "");
                setActiveView("preview");
                setPreviewKey((prev) => prev + 1);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${isDark ? "text-zinc-400 hover:text-white hover:bg-zinc-900" : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"}`}
            >
              <FileText size={18} />
              {capitalize(page)}
            </button>
          ))}

          <div className="pt-4 pb-2">
            <span className={`text-xs font-medium px-3 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Recents</span>
          </div>

          <div className="px-3 py-1 space-y-1">
            {savedProjects.length === 0 ? (
              <div className={`py-2 text-xs ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>No recent projects</div>
            ) : (
              savedProjects
                .filter(proj => proj.title?.toLowerCase().includes(searchQuery.toLowerCase()))
                .slice(0, 5)
                .map(proj => (
                  <div key={proj.id} className={`w-full text-left p-2 rounded-lg border flex flex-col gap-1.5 transition-colors ${isDark ? 'bg-zinc-900/50 border-zinc-800 hover:bg-zinc-900' : 'bg-zinc-50 border-zinc-200 hover:bg-zinc-100'}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold truncate max-w-[120px]">{proj.title}</span>
                      <span className="text-[10px] flex items-center gap-1 font-medium">
                        {proj.status === "deployed" ? <><CheckCircle2 size={10} className="text-green-500" /> Live</> :
                          proj.status === "failed" ? <><XCircle size={10} className="text-red-500" /> Failed</> :
                            <><Circle size={10} className="text-amber-500 fill-amber-500" /> Draft</>}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className={`text-[10px] ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>{new Date(proj.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <div className="flex items-center gap-1">
                        {proj.deployUrl && (
                          <a href={proj.deployUrl} target="_blank" rel="noopener noreferrer" className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 text-blue-500" title="Open Live">
                            <ExternalLink size={12} />
                          </a>
                        )}
                        <button onClick={() => {
                          useWebsiteBuilderStore.getState().setSchema(proj.schema);
                          useWebsiteBuilderStore.getState().setCurrentProjectId(proj.id);
                          router.push("/editor");
                        }} className={`px-2 py-0.5 rounded text-[10px] font-medium ${isDark ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' : 'bg-zinc-200 text-zinc-700 hover:bg-zinc-300'}`}>
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        </nav>

        <div className="pt-4 pb-2 space-y-2">
          <button onClick={handleShare} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${isDark ? 'bg-zinc-900 hover:bg-zinc-800' : 'bg-zinc-100 hover:bg-zinc-200'}`}>
            <div className={`p-1.5 rounded-md ${isDark ? 'bg-zinc-800 group-hover:bg-zinc-700' : 'bg-zinc-200 group-hover:bg-zinc-300'}`}>
              <Gift size={16} className={isDark ? 'text-zinc-400' : 'text-zinc-600'} />
            </div>
            <div className="text-left">
              <div className={`text-sm font-medium ${isDark ? 'text-zinc-200' : 'text-zinc-800'}`}>Share Your AI Builder</div>
              <div className={`text-xs ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>100 credits per paid referral</div>
            </div>
          </button>

          <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${isDark ? 'bg-zinc-900 hover:bg-zinc-800' : 'bg-zinc-100 hover:bg-zinc-200'}`}>
            <div className="p-1.5 bg-gradient-to-r from-violet-600 to-purple-600 rounded-md shadow-lg shadow-violet-500/20">
              <ZapIcon size={16} className="text-white" />
            </div>
            <div className="text-left flex-1">
              <div className={`text-sm font-medium ${isDark ? 'text-zinc-200' : 'text-zinc-800'}`}>Upgrade to Pro</div>
              <div className={`text-xs ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>Unlock more features</div>
            </div>
          </button>
        </div>

        <div className={`p-3 border-t ${isDark ? 'border-zinc-800' : 'border-zinc-200'} flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            <img src={firebaseUser?.photoURL || "https://api.dicebear.com/7.x/avataaars/svg?seed=fallback"} alt="user" className="w-7 h-7 rounded-full ring-2 ring-offset-2 ring-offset-black dark:ring-offset-black ring-violet-500/30" />
            <span className="text-xs font-medium truncate max-w-[100px]">{firebaseUser?.displayName || "User"}</span>
          </div>
          <button onClick={async () => {
            await logout();
            useWebsiteBuilderStore.getState().resetToDefault();
            router.push("/login");
          }} className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-zinc-800' : 'hover:bg-zinc-100'}`}>
            <LogOut size={16} className={isDark ? 'text-zinc-400' : 'text-zinc-600'} />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative">
        {/* Top Bar */}
        <header className={`h-14 border-b flex items-center justify-between px-4 ${isDark ? 'border-zinc-800 bg-black' : 'border-zinc-200 bg-white'}`}>
          <div className="flex items-center gap-3">
            {!showSidebar && (
              <button onClick={() => setShowSidebar(true)} className={`p-2 rounded-lg ${isDark ? 'hover:bg-zinc-800' : 'hover:bg-zinc-100'}`}>
                <Menu size={20} />
              </button>
            )}
            <div className="flex items-center gap-1">
              <button onClick={() => setActiveMode("ui")} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeMode === "ui" ? (isDark ? 'bg-zinc-800 text-white shadow-sm' : 'bg-zinc-200 text-zinc-900 shadow-sm') : (isDark ? 'text-zinc-400 hover:text-white hover:bg-zinc-900/50' : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/50')}`}>UI</button>
              <button onClick={() => setActiveMode("blog")} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeMode === "blog" ? (isDark ? 'bg-zinc-800 text-white shadow-sm' : 'bg-zinc-200 text-zinc-900 shadow-sm') : (isDark ? 'text-zinc-400 hover:text-white hover:bg-zinc-900/50' : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/50')}`}>Blog</button>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button onClick={toggleTheme} className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-zinc-800 text-zinc-400 hover:text-white' : 'hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900'}`} title="Toggle theme">{isDark ? <Sun size={18} /> : <Moon size={18} />}</button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 flex flex-col relative overflow-hidden">
          <div className={`absolute inset-0 ${isDark ? 'bg-black' : 'bg-white'}`} />
          <div className={`absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-700 pointer-events-none ${isDark ? 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/10 via-transparent to-transparent' : 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-200/20 via-transparent to-transparent'}`} />
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className={`absolute -top-1/2 -left-1/2 w-[800px] h-[800px] rounded-full blur-3xl animate-pulse opacity-5 ${isDark ? 'bg-gradient-to-br from-violet-600 to-pink-600' : 'bg-gradient-to-br from-purple-400 to-pink-400'}`} style={{ animationDuration: '12s' }} />
            <div className={`absolute top-1/2 -right-1/4 w-[600px] h-[600px] rounded-full blur-3xl animate-pulse opacity-5 ${isDark ? 'bg-gradient-to-br from-blue-600 to-cyan-600' : 'bg-gradient-to-br from-blue-400 to-cyan-400'}`} style={{ animationDuration: '15s', animationDelay: '3s' }} />
          </div>

          {isFullscreen && (
            <div className={`absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg border text-sm backdrop-blur-md ${isDark ? 'bg-black/80 border-zinc-700' : 'bg-white/80 border-zinc-200'}`}>
              Press <kbd className={`px-2 py-0.5 rounded border mx-1 ${isDark ? 'bg-zinc-800 border-zinc-600' : 'bg-zinc-100 border-zinc-300'}`}>Esc</kbd> to exit fullscreen
            </div>
          )}

          <div className={`relative z-10 flex-1 flex flex-col ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
            {/* Preview Area */}
            <div className={`${isFullscreen ? "flex-1" : "h-[calc(100vh-270px)]"} border-b overflow-hidden pt-4 px-4 transition-all duration-300`} style={{ height: isChatOpen ? 'calc(100vh - 200px)' : 'calc(100vh - 80px)' }}>
              {isLoading ? (
                <LoaderSkeleton />
              ) : activeMode === "ui" ? (
                <div className={`w-full h-full relative pt-3 backdrop-blur-sm rounded-2xl border transition-colors ${isDark ? "bg-black/50 border-zinc-800" : "bg-white/50 border-zinc-200"}`}>

                  {/* ✅ EDIT IN EDITOR BUTTON OVERLAY */}
                  {liveSchema && (
                    <div className="absolute top-4 right-4 z-50">
                      <button
                        onClick={() => router.push("/editor")}
                        className="flex items-center gap-2 px-6 py-3 font-semibold text-sm rounded-xl shadow-2xl transition-all hover:-translate-y-1 hover:shadow-violet-500/25 bg-gradient-to-r from-violet-600 to-purple-600 text-white"
                      >
                        <Palette size={18} />
                        Edit in Editor
                      </button>
                    </div>
                  )}

                  {studioTemplateId ? (
                    <div className="w-full h-full rounded-2xl overflow-hidden shadow-sm border relative">
                      <SandpackErrorBoundary>
                        <TemplateStudioPreview templateId={studioTemplateId} content={studioContent} />
                      </SandpackErrorBoundary>
                    </div>
                  ) : (
                    <LivePreview key={previewKey} schema={liveSchema} isDark={isDark} />
                  )}
                  {isTyping && (
                    <div className={`absolute inset-0 flex items-center justify-center backdrop-blur-sm z-10 ${isDark ? 'bg-black/60' : 'bg-white/60'}`}>
                      <Loader2 className="animate-spin text-violet-400" size={32} />
                    </div>
                  )}
                </div>
              ) : renderBlogPreview()}
            </div>

            {/* Premium Chat Input */}
            <div className={`flex-shrink-0 backdrop-blur-xl border-t transition-all duration-500 ease-in-out overflow-hidden relative ${isDark ? 'bg-black/80 border-zinc-800' : 'bg-white/80 border-zinc-200'} ${isChatOpen ? 'min-h-[180px] max-h-[300px]' : 'min-h-0 max-h-0'}`}>
              {isChatOpen && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className={`absolute top-0 left-0 right-0 h-[1px] ${isDark ? 'bg-gradient-to-r from-transparent via-violet-500/40 to-transparent animate-gradient-x' : 'bg-gradient-to-r from-transparent via-purple-500/40 to-transparent animate-gradient-x'}`} />
                </div>
              )}

              <div className="relative z-10 flex-1 p-3 flex flex-col gap-2">
                {isChatOpen && generationHistory.length > 0 && activeMode === "ui" && (
                  <div className={`flex items-center justify-between text-xs ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                    <div className="flex items-center gap-2">
                      <Sparkles size={12} className={`${isDark ? 'text-violet-400' : 'text-purple-500'} animate-pulse`} />
                      <span className="font-medium">AI Assistant</span>
                      <span className="text-zinc-600 dark:text-zinc-500">•</span>
                      <span className={`font-semibold bg-clip-text text-transparent bg-gradient-to-r ${isDark ? 'from-violet-400 via-purple-400 to-pink-400' : 'from-purple-600 via-violet-600 to-pink-600'} animate-gradient-x`}>{ANIMATED_WORDS[animatedWordIndex]}</span>
                    </div>
                    <div className="flex gap-1">
                      {generationHistory.slice(-2).map((h, index) => {
                        const label = typeof h === "string" ? h : (h as any)?.prompt || JSON.stringify(h);
                        return (<span key={`${label.slice(0, 30)}-${index}`} className={`px-2 py-0.5 rounded-md truncate max-w-[150px] text-[10px] ${isDark ? "bg-zinc-900/50" : "bg-zinc-100/50"}`} title={label}>{label.length > 35 ? `${label.slice(0, 35)}…` : label}</span>);
                      })}
                    </div>
                  </div>
                )}

                <div className="relative group flex-1">
                  <div className={`absolute -inset-0.5 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 rounded-3xl opacity-10 group-hover:opacity-20 blur-md transition duration-500 animate-gradient-x`} />
                  <div className={`relative rounded-3xl border p-1.5 shadow-lg backdrop-blur-sm transition-all duration-300 ${isDark ? 'bg-zinc-900/60 border-zinc-700 hover:border-zinc-600' : 'bg-zinc-50/60 border-zinc-300 hover:border-zinc-400'}`}>
                    <div className="flex items-end gap-2">
                      <textarea
                        value={activeMode === "ui" ? inputValue : blogInputValue}
                        onChange={(e) => activeMode === "ui" ? handlePromptChange(e.target.value) : handleBlogPromptChange(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            activeMode === "ui" ? handleGenerateUI() : handleGenerateBlog();
                          }
                        }}
                        placeholder={activeMode === "ui" ? "Describe your website idea..." : "Enter blog topic..."}
                        className={`flex-1 bg-transparent outline-none resize-none text-sm min-h-[44px] max-h-[120px] placeholder:transition-colors px-4 py-3 rounded-2xl ${isDark ? 'text-white placeholder:text-zinc-500' : 'text-zinc-900 placeholder:text-zinc-400'}`}
                        rows={1}
                        disabled={isLoading}
                        style={{ lineHeight: '1.5' }}
                      />
                      <button
                        onClick={activeMode === "ui" ? handleGenerateUI : handleGenerateBlog}
                        disabled={isLoading || (activeMode === "ui" ? !inputValue.trim() : !blogInputValue.trim())}
                        className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-200 shadow-md ${isLoading || (activeMode === "ui" ? !inputValue.trim() : !blogInputValue.trim()) ? (isDark ? 'bg-zinc-800 cursor-not-allowed' : 'bg-zinc-200 cursor-not-allowed') : 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 hover:scale-105 active:scale-95 shadow-violet-500/30'}`}
                        title="Generate (Enter)"
                      >
                        {isLoading ? <Loader2 size={18} className="animate-spin text-white" /> : <ArrowUp size={18} className="text-white font-bold" />}
                      </button>
                    </div>
                    <div className={`flex items-center justify-between mt-1 px-4 pb-1 ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>
                      <div className="flex items-center gap-2 text-[10px]">
                        <span className="flex items-center gap-0.5"><Sparkles size={10} className={isDark ? 'text-violet-400' : 'text-purple-500'} /> AI Powered</span>
                        <span className="text-zinc-700 dark:text-zinc-600">•</span>
                        <span>Press Enter to generate</span>
                      </div>
                      <button onClick={() => setIsChatOpen(prev => !prev)} className={`text-[10px] hover:underline ${isDark ? 'text-zinc-600 hover:text-zinc-400' : 'text-zinc-400 hover:text-zinc-600'}`}>{isChatOpen ? 'Hide' : 'Show'} Chat</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Toggle Button */}
            <button
              onClick={() => setIsChatOpen(prev => !prev)}
              className={`absolute bottom-3 right-3 z-40 px-3 py-1.5 rounded-full shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-1.5 text-xs font-medium ${isDark ? 'bg-black/90 hover:bg-zinc-900 text-zinc-300 border border-zinc-700 backdrop-blur-sm' : 'bg-white/90 hover:bg-zinc-50 text-zinc-700 border border-zinc-300 backdrop-blur-sm'}`}
              title={isChatOpen ? "Close Chat (Ctrl+`)" : "Open Chat (Ctrl+`)"}
            >
              <span className={`absolute inset-0 rounded-full ${isDark ? 'bg-gradient-to-br from-violet-500/5 to-pink-500/5' : 'bg-gradient-to-br from-purple-400/5 to-pink-400/5'} blur-sm animate-pulse`} />
              <span className="relative z-10 flex items-center gap-1">
                {isChatOpen ? (<> <MessageSquareOff size={14} /><span className="hidden sm:inline">Close Chat</span><ChevronDown size={12} className="rotate-180 transition-transform" /></>) : (<> <MessageSquare size={14} /><span className="hidden sm:inline">Open Chat</span><ChevronDown size={12} className="transition-transform" /></>)}
              </span>
            </button>
          </div>
        </div>

        {/* Status Bar */}
        <div className={`h-7 border-t backdrop-blur-sm flex items-center justify-between px-4 text-[10px] ${isDark ? 'border-zinc-800 bg-black/50 text-zinc-500' : 'border-zinc-200 bg-white/50 text-zinc-500'}`}>
          <div className="flex items-center gap-3">
            <span className="truncate max-w-[150px]">{status}</span>
            {Object.keys(filesState).length > 0 && <span className="hidden sm:inline">{Object.keys(filesState).length} files</span>}
          </div>
          <div className="flex items-center gap-3"><span>{currentTime.toLocaleTimeString()}</span></div>
        </div>
      </main>

      <style jsx global>{`
        @keyframes gradient-x { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        @keyframes glow-pulse { 0%, 100% { opacity: 0.3; transform: scale(1); } 50% { opacity: 0.6; transform: scale(1.05); } }
        @keyframes float { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-8px) rotate(2deg); } }
        .animate-gradient-x { background-size: 200% 200%; animation: gradient-x 3s ease infinite; }
        .animate-glow { animation: glow-pulse 2.5s ease-in-out infinite; }
        .animate-float { animation: float 4s ease-in-out infinite; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${isDark ? '#27272a' : '#e4e4e7'}; border-radius: 3px; transition: background 0.2s; }
        ::-webkit-scrollbar-thumb:hover { background: ${isDark ? '#3f3f46' : '#d4d4d8'}; }
        html, body, #__next { height: 100%; margin: 0; padding: 0; }
        button:focus-visible, input:focus-visible, textarea:focus-visible { outline: 2px solid ${isDark ? '#8b5cf6' : '#7c3aed'}; outline-offset: 2px; }
        textarea { field-sizing: content; }
      `}</style>
    </div>
  );
}
