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
import {
  Cpu, Loader2, Code2, Trash2, Sparkles, ArrowUp, Play, Copy, Check,
  Monitor, Eye, RefreshCw, Zap, Terminal, ChevronRight, X, Maximize2,
  Minimize2, FileText, PenLine, BookOpen, Palette, Rocket, ExternalLink,
  Globe, Download, Plus, Layers, AlertTriangle, Home as HomeIcon, Search, FolderOpen,
  Star, Users, Clock, Gift, Zap as ZapIcon, Menu, LogOut, ChevronDown,
  Command, Layout, Settings, HelpCircle, Sun, Moon
} from "lucide-react";

type GeneratorMode = "ui" | "blog";
type ActiveView = "editor" | "preview";
type ThemeMode = "dark" | "light";

interface DeployConfig {
  platform: string;
  projectName: string;
}

// ==================== ⚙️ CONFIGURATION ====================
const CONFIG = {
  AUTO_GENERATE_ON_LOAD: false,
  ENABLE_PROMPT_VARIATIONS: false,
  CLEAR_CACHE_ON_ROTATE: true,
  API_COOLDOWN_MS: 2000,
} as const;

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
            className="mt-4 px-4 py-2 bg-violet-500/20 text-violet-300 rounded-lg"
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
      email: "hello@clyraweb.com",
      phone: "+91 9876543210",
    },
    footer: {
      company: "ClyraWeb",
      copyright: "© 2026",
    },
  });
  const [currentFile, setCurrentFile] = useState("src/app/page.tsx");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState("Ready");
  const [isLoading, setIsLoading] = useState(false);
  const [activeView, setActiveView] = useState<ActiveView>("preview");
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [generationHistory, setGenerationHistory] = useState<string[]>([]);
  const [generatedPages, setGeneratedPages] = useState<string[]>(["home"]);
  const [globalCss, setGlobalCss] = useState(`/* Global Styles */
:root {
  --primary: #8b5cf6;
  --background: #09090b;
  --foreground: #fafafa;
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
  const [blogCopied, setBlogCopied] = useState(false);

  // Deploy States
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [deployConfig, setDeployConfig] = useState<DeployConfig>({
    platform: "netlify",
    projectName: "",
  });
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployStatus, setDeployStatus] = useState<string | null>(null);
  const [deployedUrl, setDeployedUrl] = useState<string | null>(null);

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

  const lastGenerateRef = useRef<number>(0);
  const editorRef = useRef<unknown>(null);
  const promptDebounceRef = useRef<((val: string) => void) & { cancel: () => void } | null>(null);
  const blogPromptDebounceRef = useRef<((val: string) => void) & { cancel: () => void } | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const router = useRouter();
  const { user: firebaseUser, loading: authLoading, logout } = useAuth();

  const API_ORIGIN =
    process.env.NEXT_PUBLIC_API_URL || "https://clyrawebbackend-666777548.europe-west1.run.app";
  const UI_WEBHOOK =
    process.env.NEXT_PUBLIC_UI_WEBHOOK || `${API_ORIGIN.replace(/\/$/, "")}/generate`;
  const BLOG_WEBHOOK =
    process.env.NEXT_PUBLIC_BLOG_WEBHOOK ||
    `${API_ORIGIN.replace(/\/$/, "")}/generate-blog`;

  // Theme toggle
  useEffect(() => {
    const savedTheme = localStorage.getItem("clyraweb-theme") as ThemeMode;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("clyraweb-theme", theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === "dark" ? "light" : "dark");
  };

  const isDark = theme === "dark";

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
    if (!authLoading && !firebaseUser) {
      router.push("/login");
    }
  }, [authLoading, firebaseUser, router]);

  // Timer
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    const start = () => {
      timer = setInterval(() => setCurrentTime(new Date()), 1000);
    };
    const stop = () => {
      if (timer) clearInterval(timer);
    };
    const handleVisibilityChange = () => {
      document.hidden ? stop() : start();
    };
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

  // ✅ Generate UI Handler - FINAL PRODUCTION VERSION
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
    setCopied(false);

    try {
      // ✅ Call backend directly - backend now controls all schema logic
      const result = await generateWebsite(prompt.trim());

      // ✅ Extract AI schema from response
     const aiSchema =
  result.website ||
  result.schema ||
  result.content ||
  result.data ||
  result;

console.log("🔥 Backend result:", result);
console.log("🔥 Parsed schema:", aiSchema);

if (!aiSchema) {
  throw new Error("Invalid AI schema");
}
      // ✅ Update state with AI-generated schema
      setSiteData(normalizeSiteContent(aiSchema));
      setPreviewKey((prev) => prev + 1);
      setActiveView("preview");
      setStatus("AI website generated successfully 🚀");

      // ✅ Reset studio states to force LivePreview mode
      setStudioTemplateId(null);
      setStudioContent({});

      // ✅ FIX 3: AI Page Planner - Dynamic page generation from backend
      const pagesToGenerate =
        aiSchema.pages?.map((p: any) => p.page) || ["home"];

      // ✅ Update generatedPages state
      setGeneratedPages(pagesToGenerate);

      // ✅ Generate all page codes dynamically
      const generatePageCode = (pageName: string, pageSchema: any) => `
"use client";

import WebsiteRenderer from "@/components/renderer/WebsiteRenderer";

export default function ${capitalize(pageName)}Page() {
  const schema = ${JSON.stringify(pageSchema, null, 2)};
  return <WebsiteRenderer schema={schema} />;
}
`;

const generatePageSchema = (pageName: string) => {
  // ✅ get only current page schema
  const currentPage = aiSchema.pages?.find(
    (p: any) => p.page === pageName
  );

  return {
    theme: aiSchema.theme,
    layout: aiSchema.layout,
    pages: currentPage ? [currentPage] : [],
  };
};

      // ✅ Build generatedFiles object dynamically
      const generatedFiles: Record<string, string> = {};

      pagesToGenerate.forEach((pageName: string) => {
        const pageSchema = generatePageSchema(pageName);
        const filePath = pageName === "home"
          ? "src/app/page.tsx"
          : `src/app/${pageName}/page.tsx`;
        generatedFiles[filePath] = generatePageCode(pageName, pageSchema);
      });

      // ✅ Update file refs and state for editor/zip/deploy
      filesRef.current = generatedFiles;
      setFilesState(generatedFiles);

      // ✅ Save project with schema snapshot
      await saveProject(
        firebaseUser?.uid,
        generatedFiles,
        {
          schema: JSON.stringify(aiSchema),
        }
      );

      // ✅ KEEP EDITOR IN SYNC - Open first generated page
      setCurrentFile(
        pagesToGenerate.includes("home")
          ? "src/app/page.tsx"
          : `src/app/${pagesToGenerate[0]}/page.tsx`
      );

      setCode(generatedFiles["src/app/page.tsx"] || "");

      // ✅ Auto open preview after generate
      setActiveView("preview");

      // ✅ Handle assets
      if (!assets?.['style.css']) {
        setAssets(prev => ({ ...prev, 'style.css': globalCss }));
      }

      // ✅ Update history and status
      setGenerationHistory((prev) => [...prev.slice(-4), prompt]);

      // ✅ Show page count in status
      setStatus(
        `Generated ${pagesToGenerate.length} AI pages 🚀`
      );

    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      setStatus(message === "Failed to fetch" ? "Backend not reachable" : `Error: ${message}`);
      console.error("Generation error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [
    prompt,
    siteData,
    globalCss,
    firebaseUser?.uid,
    assets,
  ]);

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
          uid,
          pages: projectFiles,
          assets: projectAssets,
          timestamp: new Date().toISOString(),
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
    setBlogCopied(false);
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
        handleDownload();
      }
      if (e.key === "Escape") {
        setIsFullscreen(false);
        setShowDeployModal(false);
        setShowMobileMenu(false);
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

  const handleCopy = async () => {
    const contentToCopy = activeMode === "ui" ? code : blogContent;
    if (!contentToCopy) return;
    await navigator.clipboard.writeText(contentToCopy);
    if (activeMode === "ui") {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      setBlogCopied(true);
      setTimeout(() => setBlogCopied(false), 2000);
    }
  };

  const handleDownload = async () => {
    if (activeMode === "ui" && Object.keys(filesState).length === 0) {
      setStatus("No code to download");
      return;
    }
    if (activeMode === "blog" && !blogContent) {
      setBlogStatus("No content to download");
      return;
    }

    setIsDownloading(true);
    try {
      const zip = new JSZip();
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);

      if (activeMode === "ui") {
        const projectFolder = zip.folder(`clyraweb-Ai${timestamp}`);
        const assetsFolder = projectFolder?.folder("assets");

        Object.entries(filesState).forEach(([fileName, content]) => {
          projectFolder?.file(fileName, content);
        });

        if (globalCss) assetsFolder?.file("style.css", globalCss);
        Object.entries(assets).forEach(([fileName, content]) => {
          if (fileName !== "style.css") assetsFolder?.file(fileName, content);
        });

        // ✅ DOWNLOAD README PAGE ROUTES - Cleaner path logic
        const pageList = Object.keys(filesState)
          .filter(f => f.endsWith('page.tsx'))
          .map((f) => {
            const route = f
              .replace("src/app", "")
              .replace("/page.tsx", "");
            return route || "/";
          })
          .join('\n- ');

        const readmeContent = `# ClyraWeb Project - React/Next.js
Generated with ClyraWeb AI Content Studio
Date: ${new Date().toLocaleDateString()}

## Files Included
${Object.keys(filesState).map(f => `- ${f}`).join('\n')}

## Pages
- ${pageList}



## Navigation
All pages include auto-working navbar routes using Next.js Link component.
`;
        projectFolder?.file("README.md", readmeContent);
        projectFolder?.file("package.json", JSON.stringify({
          "name": `clyraweb-ai-${timestamp}`,
          "version": "1.0.0",
          "scripts": {
            "dev": "next dev",
            "build": "next build",
            "start": "next start"
          },
          "dependencies": {
            "next": "14.1.0",
            "react": "18.2.0",
            "react-dom": "18.2.0"
          }
        }, null, 2));

        const content = await zip.generateAsync({ type: "blob" });
        const url = URL.createObjectURL(content);
        const link = document.createElement("a");
        link.href = url;
        link.download = `clyraweb-ai-${timestamp}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setStatus("React Project ZIP Downloaded Successfully");
      } else {
        const projectFolder = zip.folder(`clyra-blog-${timestamp}`);
        const safeTitle = blogTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 50) || "blog-post";
        projectFolder?.file(`${safeTitle}.md`, `# ${blogTitle}\n\n${blogContent}`);

        const content = await zip.generateAsync({ type: "blob" });
        const url = URL.createObjectURL(content);
        const link = document.createElement("a");
        link.href = url;
        link.download = `clyra-blog-${timestamp}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setBlogStatus("ZIP Downloaded Successfully");
      }
    } catch (error: unknown) {
      console.error("Download error:", error);
      const message = error instanceof Error ? error.message : String(error);
      if (activeMode === "ui") setStatus(`Download Failed: ${message}`);
      else setBlogStatus(`Download Failed: ${message}`);
    } finally {
      setIsDownloading(false);
    }
  };

  const [isDownloading, setIsDownloading] = useState(false);

  const resetWorkspace = () => {
    if (activeMode === "ui") {
      setInputValue("");
      setPrompt("");
      setSiteData(null);
      filesRef.current = {};
      setFilesState({});
      setStudioTemplateId(null);
      setStudioContent({});
      setCurrentFile("src/app/page.tsx");
      setCode("");
      setStatus("Ready");
      setActiveView("editor");
      setPreviewKey(0);
      setGenerationHistory([]);
      setGeneratedPages(["home"]);
    } else {
      setBlogInputValue("");
      setBlogPrompt("");
      setBlogContent("");
      setBlogTitle("");
      setBlogStatus("Ready");
    }
  };

  const handleDeploy = async () => {
    if (!deployConfig.projectName.trim()) {
      setDeployStatus("Please enter a project name");
      return;
    }
    setIsDeploying(true);
    setDeployStatus("Deploying to server...");
    setDeployedUrl(null);
    try {
      const apiUrl = API_ORIGIN;
      const res = await fetch(`${apiUrl}/deploy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pages: filesRef.current,
          assets: { "style.css": globalCss, ...assets },
          projectName: deployConfig.projectName,
          platform: deployConfig.platform,
        }),
      });
      if (!res.ok) throw new Error("Server error");
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Deploy failed");
      setDeployedUrl(data.url);
      setDeployStatus("Deployment Successful!");
      if (data.url) window.open(data.url, "_blank");
    } catch (error: unknown) {
      console.error("Deploy error:", error);
      const message = error instanceof Error ? error.message : String(error);
      setDeployStatus("Deploy Failed: " + message);
    } finally {
      setIsDeploying(false);
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

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 400);
  }, [currentFile]);

  const handleSaveFile = useCallback(() => {
    filesRef.current[currentFile] = code;
    setFilesState({ ...filesRef.current });
    setStatus("File saved");
    setTimeout(() => setStatus("Ready"), 2000);
  }, [currentFile, code]);

  const renderBlogPreview = () => {
    if (!blogContent) {
      return (
        <div className="relative w-full h-full overflow-hidden flex items-center justify-center p-8 bg-zinc-50 dark:bg-zinc-900 transition-colors duration-500">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-purple-200/30 dark:bg-purple-900/20 blur-[100px] animate-pulse" />
            <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-emerald-200/30 dark:bg-emerald-900/20 blur-[100px] animate-pulse delay-700" />
            <div className="absolute -bottom-[10%] left-[20%] w-[60%] h-[40%] rounded-full bg-blue-200/30 dark:bg-blue-900/20 blur-[100px] animate-pulse delay-1000" />
          </div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="relative z-10 text-center max-w-lg mx-auto p-8 rounded-3xl border border-white/20 dark:border-white/5 bg-white/40 dark:bg-black/20 backdrop-blur-xl shadow-2xl">
            <div className="relative w-24 h-24 mx-auto mb-8 group">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-2xl blur opacity-40 group-hover:opacity-60 transition-opacity duration-500 animate-pulse"></div>
              <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-xl transform group-hover:scale-105 transition-transform duration-300">
                <PenLine size={40} className="text-white drop-shadow-md" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full blur-[2px] animate-ping opacity-75"></div>
            </div>
            <h3 className="text-3xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-zinc-800 via-zinc-600 to-zinc-800 dark:from-white dark:via-zinc-300 dark:to-white">
              Ready to Create
            </h3>
            <p className="text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed">
              Enter a topic below to generate a professional, SEO-optimized blog post instantly with AI.
            </p>
            <div className="w-full max-w-xs mx-auto h-12 bg-white dark:bg-zinc-800 rounded-full border border-zinc-200 dark:border-zinc-700 flex items-center px-4 shadow-sm opacity-50">
              <div className="w-4 h-4 rounded-full bg-zinc-300 dark:bg-zinc-600 mr-3 animate-pulse"></div>
              <div className="h-2 w-32 bg-zinc-200 dark:bg-zinc-700 rounded-full animate-pulse"></div>
            </div>
            <div className="mt-4 text-xs font-medium text-zinc-400 uppercase tracking-widest">
              AI Engine Ready
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="w-full h-full bg-white dark:bg-zinc-950 overflow-y-auto">
        <article className="max-w-3xl mx-auto px-8 py-12 prose prose-zinc prose-lg dark:prose-invert">
          {blogTitle && (
            <header className="mb-8 pb-6 border-b border-zinc-200 dark:border-zinc-800">
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">{blogTitle}</h1>
              <div className="flex items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
                <span className="flex items-center gap-1"><Sparkles size={12} className="text-emerald-500" /> AI Generated</span>
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
          automaticLayout: true,
          readOnly: isLoading,
        }}
      />
    );
  };

  if (authLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-zinc-950 text-zinc-200' : 'bg-white text-zinc-800'}`}>
        <div className="flex items-center gap-2 text-sm">
          <Loader2 size={18} className="animate-spin" />
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className={`h-screen flex overflow-hidden font-sans ${isDark ? 'bg-black text-zinc-200' : 'bg-white text-zinc-800'}`}>
      {/* Sidebar */}
      <aside className={`${showSidebar ? 'w-64' : 'w-0'} flex-shrink-0 ${isDark ? 'bg-black border-zinc-800' : 'bg-white border-zinc-200'} border-r transition-all duration-300 overflow-hidden flex flex-col`}>
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center">
              <Layout size={18} className="text-white" />
            </div>
            <span className="font-semibold text-sm">Umesh's ClyraWeb</span>
          </div>
          <button
            onClick={() => setShowSidebar(false)}
            className={`p-1 rounded transition-colors ${isDark ? 'hover:bg-zinc-800' : 'hover:bg-zinc-100'}`}
          >
            <X size={16} className="text-red-500" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          <button className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${isDark ? 'text-zinc-400 hover:text-white hover:bg-zinc-900' : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'}`}>
            <HomeIcon size={18} />
            Home
          </button>
          <button className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors justify-between ${isDark ? 'text-zinc-400 hover:text-white hover:bg-zinc-900' : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'}`}>
            <div className="flex items-center gap-3">
              <Search size={18} />
              Search
            </div>
            <span className={`text-xs px-2 py-0.5 rounded ${isDark ? 'text-zinc-600 bg-zinc-900' : 'text-zinc-500 bg-zinc-100'}`}>Ctrl K</span>
          </button>
          <button className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${isDark ? 'text-zinc-400 hover:text-white hover:bg-zinc-900' : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'}`}>
            <HelpCircle size={18} />
            Resources
          </button>

          {/* ✅ REPLACE STATIC SIDEBAR PROJECT BUTTONS */}
          <div className="pt-4 pb-2">
            <span className={`text-xs font-medium px-3 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
              Generated Pages
            </span>
          </div>

          {/* ✅ Sidebar buttons switch file AND open preview */}
          {generatedPages.map((page) => (
            <button
              key={page}
              onClick={() => {
                const filePath =
                  page === "home"
                    ? "src/app/page.tsx"
                    : `src/app/${page}/page.tsx`;

                setCurrentFile(filePath);
                setCode(filesState[filePath] || "");
                // ✅ UX UPGRADE: Open preview instead of editor + force refresh
                setActiveView("preview");
                setPreviewKey((prev) => prev + 1);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${isDark
                  ? "text-zinc-400 hover:text-white hover:bg-zinc-900"
                  : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
                }`}
            >
              <FileText size={18} />
              {capitalize(page)}
            </button>
          ))}

          <div className="pt-4 pb-2">
            <span className={`text-xs font-medium px-3 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Recents</span>
          </div>

          <div className={`px-3 py-2 text-sm ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
            No recent projects
          </div>
        </nav>

        <div className="pt-4 pb-2 space-y-2">
          <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${isDark ? 'bg-zinc-900 hover:bg-zinc-800' : 'bg-zinc-100 hover:bg-zinc-200'}`}>
            <div className={`p-1.5 rounded-md ${isDark ? 'bg-zinc-800 group-hover:bg-zinc-700' : 'bg-zinc-200 group-hover:bg-zinc-300'}`}>
              <Gift size={16} className={isDark ? 'text-zinc-400' : 'text-zinc-600'} />
            </div>
            <div className="text-left">
              <div className={`text-sm font-medium ${isDark ? 'text-zinc-200' : 'text-zinc-800'}`}>Share ClyraWeb</div>
              <div className={`text-xs ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>100 credits per paid referral</div>
            </div>
          </button>

          <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${isDark ? 'bg-zinc-900 hover:bg-zinc-800' : 'bg-zinc-100 hover:bg-zinc-200'}`}>
            <div className="p-1.5 bg-indigo-600 rounded-md">
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
            <img
              src={firebaseUser?.photoURL || "/default-avatar.png"}
              alt="user"
              className="w-7 h-7 rounded-full"
            />
            <span className="text-xs font-medium truncate max-w-[100px]">{firebaseUser?.displayName || "User"}</span>
          </div>
          <button
            onClick={async () => {
              await logout();
              router.push("/login");
            }}
            className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-zinc-800' : 'hover:bg-zinc-100'}`}
          >
            <LogOut size={16} className={isDark ? 'text-zinc-400' : 'text-zinc-600'} />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative">
        {/* Top Bar */}
        <header className={`h-14 border-b ${isDark ? 'border-zinc-800 bg-black' : 'border-zinc-200 bg-white'} flex items-center justify-between px-4`}>
          <div className="flex items-center gap-3">
            {!showSidebar && (
              <button onClick={() => setShowSidebar(true)} className={`p-2 rounded-lg ${isDark ? 'hover:bg-zinc-800' : 'hover:bg-zinc-100'}`}>
                <Menu size={20} />
              </button>
            )}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveMode("ui")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeMode === "ui" ? (isDark ? 'bg-zinc-800 text-white' : 'bg-zinc-200 text-zinc-900') : (isDark ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-zinc-900')}`}
              >
                UI
              </button>
              <button
                onClick={() => setActiveMode("blog")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeMode === "blog" ? (isDark ? 'bg-zinc-800 text-white' : 'bg-zinc-200 text-zinc-900') : (isDark ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-zinc-900')}`}
              >
                Blog
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-zinc-800 text-zinc-400 hover:text-white' : 'hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900'}`}>
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button onClick={handleCopy} className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-zinc-800 text-zinc-400 hover:text-white' : 'hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900'}`}>
              {copied || blogCopied ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
            </button>
            <button onClick={handleDownload} className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-zinc-800 text-zinc-400 hover:text-white' : 'hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900'}`}>
              <Download size={18} />
            </button>
            <button onClick={() => setActiveView(activeView === "editor" ? "preview" : "editor")} className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-zinc-800 text-zinc-400 hover:text-white' : 'hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900'}`}>
              {activeView === "editor" ? <Eye size={18} /> : <Code2 size={18} />}
            </button>
            <button onClick={() => setShowDeployModal(true)} className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-zinc-800 text-zinc-400 hover:text-white' : 'hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900'}`}>
              <Rocket size={18} />
            </button>
          </div>
        </header>

        {/* Content Area - Preview on Top, Chat at Bottom */}
        <div className="flex-1 flex flex-col relative overflow-hidden">
          {/* Gradient Background */}
          <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-b from-blue-900/20 via-purple-900/20 to-pink-900/20' : 'bg-gradient-to-b from-blue-50 via-purple-50 to-pink-50'}`} />
          <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-tr from-blue-600/10 via-purple-600/10 to-pink-600/10' : 'bg-gradient-to-tr from-blue-400/5 via-purple-400/5 to-pink-400/5'} blur-3xl`} />

          {/* Full Screen Exit Hint */}
          {isFullscreen && (
            <div className={`absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg border text-sm ${isDark ? 'bg-zinc-900/90 backdrop-blur border-zinc-700' : 'bg-white/90 backdrop-blur border-zinc-200'}`}>
              To exit full screen, press and hold <kbd className={`px-2 py-0.5 rounded border ${isDark ? 'bg-zinc-800 border-zinc-600' : 'bg-zinc-100 border-zinc-300'}`}>Esc</kbd>
            </div>
          )}

          {/* Main Content - Preview takes most space */}
          <div className={`relative z-10 flex-1 flex flex-col ${isFullscreen ? 'fixed inset-0 bg-black z-50' : ''}`}>
            {/* Preview Area */}
            <div
              className={`${isFullscreen ? "flex-1" : "h-[calc(100vh-270px)]"
                } border-b overflow-hidden pt-4 px-4`}
            >
              {isLoading ? (
                <LoaderSkeleton />
              ) : activeView === "preview" ? (
                activeMode === "ui" ? (
                  <div
                    className={`w-full h-full relative ${isDark ? "bg-zinc-900" : "bg-zinc-100"
                      } pt-3`}
                  >
                    {studioTemplateId ? (
                      <div className="w-full h-full rounded-2xl overflow-hidden bg-white shadow-sm border relative">
                        <SandpackErrorBoundary>
                          <TemplateStudioPreview
                            templateId={studioTemplateId}
                            content={studioContent}
                          />
                        </SandpackErrorBoundary>
                      </div>
                    ) : (
                      // ✅ FINAL FIX: REAL MULTIPAGE PREVIEW SWITCH
                      <LivePreview
                        key={`${previewKey}-${currentFile}`}
                        schema={(() => {
                          try {
                            if (currentFile === "src/app/page.tsx") {
                              return siteData;
                            }

                            const fileContent = filesState[currentFile];
                            if (!fileContent) return siteData;

                            // Extract schema from generated page: const schema = {...};
                            const schemaMatch = fileContent.match(
                              /const schema = ([\s\S]*?);/
                            );

                            if (!schemaMatch?.[1]) return siteData;

                            return JSON.parse(schemaMatch[1]);
                          } catch (error) {
                            console.error("Preview schema parse failed:", error);
                            return siteData;
                          }
                        })()}
                        isDark={isDark}
                      />
                    )}
                    {isTyping && (
                      <div className={`absolute inset-0 flex items-center justify-center backdrop-blur-sm z-10 ${isDark ? 'bg-zinc-900/60' : 'bg-white/60'}`}>
                        <Loader2 className="animate-spin text-violet-400" size={32} />
                      </div>
                    )}
                  </div>
                ) : renderBlogPreview()
              ) : (
                <div className={`w-full h-full ${isDark ? 'bg-zinc-950' : 'bg-white'}`}>
                  {renderEditorContent()}
                  {activeMode === "ui" && (
                    <button
                      onClick={handleSaveFile}
                      className="absolute top-4 right-4 px-3 py-1.5 bg-violet-500/20 text-violet-300 border border-violet-500/30 rounded-lg text-xs"
                    >
                      Save File
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Chat / prompt — always visible */}
            <div className={`flex-shrink-0 min-h-[200px] backdrop-blur border-t ${isDark ? 'bg-black/90 border-zinc-800' : 'bg-white/90 border-zinc-200'} flex flex-col`}>
              <div className="flex-1 p-4 flex flex-col gap-3">
                {generationHistory.length > 0 && activeMode === "ui" && (
                  <div className={`flex flex-wrap gap-2 text-xs ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>
                    <span className="font-medium uppercase tracking-wide">Recent</span>
                    {generationHistory.slice(-3).map((h, index) => {
                      const label =
                        typeof h === "string"
                          ? h
                          : (h as any)?.prompt ||
                          (h as any)?.title ||
                          JSON.stringify(h);
                      return (
                        <span
                          key={`${label.slice(0, 40)}-${index}`}
                          className={`px-2 py-0.5 rounded-md truncate max-w-[200px] ${isDark ? "bg-zinc-900" : "bg-zinc-100"
                            }`}
                          title={label}
                        >
                          {label.length > 48 ? `${label.slice(0, 48)}…` : label}
                        </span>
                      );
                    })}
                  </div>
                )}
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 rounded-xl opacity-30 group-hover:opacity-50 blur transition duration-500" />
                  <div className={`relative rounded-xl border p-3 ${isDark ? 'bg-zinc-900 border-zinc-700' : 'bg-white border-zinc-300'}`}>
                    <textarea
                      value={activeMode === "ui" ? inputValue : blogInputValue}
                      onChange={(e) => activeMode === "ui" ? handlePromptChange(e.target.value) : handleBlogPromptChange(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          activeMode === "ui" ? handleGenerateUI() : handleGenerateBlog();
                        }
                      }}
                      placeholder={activeMode === "ui" ? "Describe your website (e.g. real estate agency in Miami) — edit and build again anytime..." : "Enter blog topic..."}
                      className={`w-full bg-transparent outline-none resize-none text-sm min-h-[72px] ${isDark ? 'text-white placeholder:text-zinc-500' : 'text-zinc-900 placeholder:text-zinc-400'}`}
                      rows={3}
                      disabled={isLoading}
                    />
                    <div className={`flex items-center justify-between mt-2 pt-2 border-t ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
                      <div className="flex items-center gap-2">
                        <button className={`p-1.5 rounded transition-colors ${isDark ? 'hover:bg-zinc-800 text-zinc-400 hover:text-white' : 'hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900'}`}>
                          <Plus size={14} />
                        </button>
                        <span className={`text-xs ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>Enter to build · prompt stays open</span>
                      </div>
                      <button
                        onClick={activeMode === "ui" ? handleGenerateUI : handleGenerateBlog}
                        disabled={isLoading || (activeMode === "ui" ? !prompt.trim() : !blogPrompt.trim())}
                        className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 text-white text-xs font-medium hover:from-violet-500 hover:to-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                      >
                        {isLoading ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <>
                            <Sparkles size={14} />
                            Build
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div className={`h-8 border-t ${isDark ? 'border-zinc-800 bg-black' : 'border-zinc-200 bg-white'} flex items-center justify-between px-4 text-xs ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>
          <div className="flex items-center gap-4">
            <span>{status}</span>
            {Object.keys(filesState).length > 0 && (
              <span>{Object.keys(filesState).length} files</span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <span>{currentTime.toLocaleTimeString()}</span>
          </div>
        </div>
      </main>

      {/* Deploy Modal */}
      {showDeployModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className={`w-full max-w-md border rounded-2xl overflow-hidden ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
            <div className={`flex items-center justify-between p-4 border-b ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
              <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-zinc-900'}`}>Deploy Project</h3>
              <button onClick={() => setShowDeployModal(false)} className={`p-1 rounded ${isDark ? 'hover:bg-zinc-800' : 'hover:bg-zinc-100'}`}>
                <X size={18} />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className={`block text-sm mb-2 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>Project Name</label>
                <input
                  type="text"
                  value={deployConfig.projectName}
                  onChange={(e) => setDeployConfig({ ...deployConfig, projectName: e.target.value })}
                  placeholder="my-project"
                  className={`w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-violet-500 ${isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-white border-zinc-300 text-zinc-900'}`}
                />
              </div>
              {deployStatus && (
                <div className={`p-3 rounded-lg text-sm ${isDark ? 'bg-zinc-800' : 'bg-zinc-100'}`}>{deployStatus}</div>
              )}
            </div>
            <div className={`flex justify-end gap-2 p-4 border-t ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
              <button onClick={() => setShowDeployModal(false)} className={`px-4 py-2 text-sm ${isDark ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'}`}>
                Cancel
              </button>
              <button
                onClick={handleDeploy}
                disabled={isDeploying || !deployConfig.projectName.trim()}
                className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-lg disabled:opacity-50"
              >
                {isDeploying ? "Deploying..." : "Deploy"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}