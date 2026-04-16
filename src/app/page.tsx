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
  Command, Layout, Settings, HelpCircle, Sun, Moon, MessageSquare, MessageSquareOff,
  Send
} from "lucide-react";

type GeneratorMode = "ui" | "blog";
type ActiveView = "editor" | "preview";
type ThemeMode = "dark" | "light";

interface DeployConfig {
  platform: string;
  projectName: string;
}

// ==================== âš™ï¸ CONFIGURATION ====================
const CONFIG = {
  AUTO_GENERATE_ON_LOAD: false,
  ENABLE_PROMPT_VARIATIONS: false,
  CLEAR_CACHE_ON_ROTATE: true,
  API_COOLDOWN_MS: 2000,
} as const;

// âœ… Animated words for chat header
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
          <p className="font-semibold">Preview Error âš ï¸</p>
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
  
  // âœ… STEP 1: ADD GLOBAL SCHEMA STATE
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
      heading: "Template 6 Working Successfully ðŸš€",
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
      copyright: "Â© 2026",
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

  // âœ… Chatbox toggle state + animated word index
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [animatedWordIndex, setAnimatedWordIndex] = useState(0);

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

  // ðŸŽ¨ THEME MANAGEMENT - PURE BLACK/WHITE
  useEffect(() => {
    const savedTheme = localStorage.getItem("clyraweb-theme") as ThemeMode;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("clyraweb-theme", theme);
    // Apply theme to document root for full-page coverage
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.style.backgroundColor = "#000000";
      document.documentElement.style.color = "#ffffff";
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.style.backgroundColor = "#ffffff";
      document.documentElement.style.color = "#000000";
    }
    // Also apply to body for Safari compatibility
    document.body.style.backgroundColor = theme === "dark" ? "#000000" : "#ffffff";
    document.body.style.color = theme === "dark" ? "#ffffff" : "#000000";
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === "dark" ? "light" : "dark");
  };

  const isDark = theme === "dark";

  // âœ… Animated word rotation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedWordIndex(prev => (prev + 1) % ANIMATED_WORDS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // âœ… STEP 2: ADD SYNC EFFECT (after theme effects)
  useEffect(() => {
    const syncLiveSchema = () => {
      try {
        const raw = localStorage.getItem("clyra-live-schema");
        if (!raw) return;
        const parsed = JSON.parse(raw);

        setLiveSchema((prev: any) => {
          const oldSchema = JSON.stringify(prev);
          const newSchema = JSON.stringify(parsed);

          if (oldSchema === newSchema) {
            return prev;
          }

          return parsed;
        });
      } catch (error) {
        console.error("AI Studio sync failed:", error);
      }
    };

    syncLiveSchema();

    window.addEventListener("storage", syncLiveSchema);
    window.addEventListener("focus", syncLiveSchema);
    window.addEventListener("clyra-schema-updated", syncLiveSchema);

    return () => {
      window.removeEventListener("storage", syncLiveSchema);
      window.removeEventListener("focus", syncLiveSchema);
      window.removeEventListener("clyra-schema-updated", syncLiveSchema);
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

  // âœ… FIX #1: Sync currentFile + code when file changes
  useEffect(() => {
    if (currentFile === "assets/style.css") {
      setCode(globalCss);
    } else {
      setCode(filesState[currentFile] || "");
    }
  }, [currentFile, filesState, globalCss]);

  // âœ… Generate UI Handler - FINAL PRODUCTION VERSION
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
      // âœ… Call backend directly - backend now controls all schema logic
      const result = await generateWebsite(prompt.trim());

      // âœ… Extract AI schema from response
      const aiSchema =
        result.website ||
        result.schema ||
        result.content ||
        result.data ||
        result;

      console.log("ðŸ”¥ Backend result:", result);
      console.log("ðŸ”¥ Parsed schema:", aiSchema);

      if (!aiSchema) {
        throw new Error("Invalid AI schema");
      }
      // âœ… Persist schema globally for editor + preview sync
      localStorage.setItem(
        "clyra-live-schema",
        JSON.stringify(aiSchema)
      );

      localStorage.setItem(
        "generated-schema",
        JSON.stringify(aiSchema)
      );
      // âœ… Update state with AI-generated schema
      setLiveSchema(aiSchema);
      setSiteData(aiSchema);
      setPreviewKey((prev) => prev + 1);
      setActiveView("preview");
      setStatus("AI website generated successfully ðŸš€");

      // âœ… Reset studio states to force LivePreview mode
      setStudioTemplateId(null);
setStudioContent(aiSchema);

      // âœ… FIX 3: AI Page Planner - Dynamic page generation from backend
      const pagesToGenerate =
        aiSchema.pages?.map((p: any) => p.page) || ["home"];

      // âœ… Update generatedPages state
      setGeneratedPages(pagesToGenerate);

      // âœ… Generate all page codes dynamically
      const generatePageCode = (pageName: string, pageSchema: any) => `
"use client";

import WebsiteRenderer from "@/components/renderer/WebsiteRenderer";

export default function ${capitalize(pageName || "Home")}Page() {
  const schema = ${JSON.stringify(pageSchema, null, 2)}
  return (
    <div className="min-h-screen bg-black">
      <WebsiteRenderer schema={schema} />
    </div>
  );
}
`;

      const generatePageSchema = (pageName: string) => {
        // âœ… get only current page schema
        const currentPage = aiSchema.pages?.find(
          (p: any) => p.page === pageName
        );

        return {
          theme: aiSchema.theme,
          layout: aiSchema.layout,
          pages: currentPage ? [currentPage] : [],
        };
      };

      // âœ… Build generatedFiles object dynamically
      const generatedFiles: Record<string, string> = {};

      pagesToGenerate.forEach((pageName: string) => {
        const pageSchema = generatePageSchema(pageName);
        const filePath = pageName === "home"
          ? "src/app/page.tsx"
          : `src/app/${pageName}/page.tsx`;
        generatedFiles[filePath] = generatePageCode(pageName, pageSchema);
      });

      // âœ… Update file refs and state for editor/zip/deploy
      filesRef.current = generatedFiles;
      setFilesState(generatedFiles);

      // âœ… Save project with schema snapshot
      await saveProject(
        firebaseUser?.uid,
        generatedFiles,
        {
          schema: JSON.stringify(aiSchema),
        }
      );

      // âœ… KEEP EDITOR IN SYNC - Open first generated page
      setCurrentFile(
        pagesToGenerate.includes("home")
          ? "src/app/page.tsx"
          : `src/app/${pagesToGenerate[0]}/page.tsx`
      );

      setCode(generatedFiles["src/app/page.tsx"] || "");

      // âœ… Auto open preview after generate
      setActiveView("preview");

      // âœ… Handle assets
      if (!assets?.['style.css']) {
        setAssets(prev => ({ ...prev, 'style.css': globalCss }));
      }

      // âœ… Update history and status
      setGenerationHistory((prev) => [...prev.slice(-4), prompt]);

      // âœ… Show page count in status
      setStatus(
        `Generated ${pagesToGenerate.length} AI pages ðŸš€`
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

  // âœ… FIX #1: saveProject uses projectFiles instead of filesState
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
    ...projectFiles, // âœ… FIX: Use projectFiles instead of filesState
    "package.json": JSON.stringify({
      name: deployConfig.projectName,
      private: true,
      scripts: {
        dev: "next dev",
        build: "next build",
        start: "next start"
      },
      dependencies: {
        next: "14.1.0",
        react: "18.2.0",
        "react-dom": "18.2.0"
      }
    }, null, 2),

    "next.config.js": `
/** @type {import('next').NextConfig} */
const nextConfig = {};
module.exports = nextConfig;
`,

    "src/components/renderer/WebsiteRenderer.tsx": `
export default function WebsiteRenderer({ schema }: any) {
  return (
    <div style={{ padding: "40px", color: "white", background: "black", minHeight: "100vh" }}>
      <pre>{JSON.stringify(schema, null, 2)}</pre>
    </div>
  );
}
`
  },

  projectName: deployConfig.projectName,
  platform: deployConfig.platform,
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
      // âœ… Toggle chat with Ctrl/Cmd + `
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

        // âœ… FIX #4: DOWNLOAD README PAGE ROUTES - Cleaner path logic
        const pageList = Object.keys(filesState)
          .filter((f) => f.endsWith("page.tsx"))
          .map((f) => {
            let route = f
              .replace("src/app", "")
              .replace("/page.tsx", "");

            if (!route || route === "") route = "/";
            return route;
          })
          .join("\n- ");

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
setLiveSchema(null);
setStudioContent(null as any);
localStorage.removeItem("clyra-live-schema");
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
  setDeployStatus("Preparing premium deploy...");
  setDeployedUrl(null);

  try {
    const latestSchema = (() => {
      try {
        const raw = localStorage.getItem("clyra-live-schema");
        return raw ? JSON.parse(raw) : {};
      } catch {
        return {};
      }
    })();

    console.log("🚀 REAL TEMPLATE DEPLOY:", latestSchema);

    const templateId =
      latestSchema?.templateId ||
      latestSchema?.page ||
      "default";

    const deploySource =
      latestSchema?.editableData ||
      latestSchema;

    const previewRoot =
      document.querySelector("[data-studio-preview-scrollport]") ||
      document.querySelector("[data-studio-preview-frame]") ||
      document.querySelector("main");

    const previewHtml = previewRoot
      ? `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    html,body{margin:0;padding:0;background:#000;color:white;}
  </style>
</head>
<body>${previewRoot.innerHTML}</body>
</html>`
      : "<html><body><h1>Preview not found</h1></body></html>";

    const payload = {
      pages: {
        "index.html": `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${deployConfig.projectName}</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body style="margin:0;background:#000;color:white;">
  <iframe
  srcdoc="${previewHtml.replace(/"/g, '&quot;')}"
  style="width:100%;height:100vh;border:none;display:block;"
></iframe>
</body>
</html>
`,
        "package.json": JSON.stringify({
          name: deployConfig.projectName,
          private: true,
          scripts: {
            build: "next build",
            start: "next start"
          },
          dependencies: {
            next: "14.1.0",
            react: "18.2.0",
            "react-dom": "18.2.0"
          }
        }, null, 2)
      },
      projectName: deployConfig.projectName,
      platform: deployConfig.platform
    };

    const res = await fetch(`${API_ORIGIN}/deploy`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!data.success) {
      throw new Error("Deploy failed");
    }

    setDeployStatus("Deployment Successful 🚀");
    setDeployedUrl(data.url);

    if (data.url) {
      window.open(data.url, "_blank");
    }
  } catch (error: any) {
    setDeployStatus("Deploy Failed: " + error.message);
  } finally {
    setIsDeploying(false);
  }
};

  // âœ… FIX #2: Update filesRef and trigger preview refresh on editor change
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
            <h3 className={`text-3xl font-bold mb-3 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              Ready to Create
            </h3>
            <p className={`mb-8 leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              Enter a topic below to generate a professional, SEO-optimized blog post instantly with AI.
            </p>
            <div className={`w-full max-w-xs mx-auto h-12 rounded-full border flex items-center px-4 shadow-sm opacity-50 ${isDark ? 'bg-black border-zinc-700' : 'bg-white border-zinc-300'}`}>
              <div className={`w-4 h-4 rounded-full mr-3 animate-pulse ${isDark ? 'bg-zinc-700' : 'bg-zinc-300'}`}></div>
              <div className={`h-2 w-32 rounded-full animate-pulse ${isDark ? 'bg-zinc-800' : 'bg-zinc-200'}`}></div>
            </div>
            <div className={`mt-4 text-xs font-medium uppercase tracking-widest ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
              AI Engine Ready
            </div>
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
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
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

          {/* âœ… REPLACE STATIC SIDEBAR PROJECT BUTTONS */}
          <div className="pt-4 pb-2">
            <span className={`text-xs font-medium px-3 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
              Generated Pages
            </span>
          </div>

          {/* âœ… Sidebar buttons switch file AND open preview */}
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
                // âœ… UX UPGRADE: Open preview instead of editor + force refresh
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
            <img
              src={firebaseUser?.photoURL || "/default-avatar.png"}
              alt="user"
              className="w-7 h-7 rounded-full ring-2 ring-offset-2 ring-offset-black dark:ring-offset-black ring-violet-500/30"
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
        <header className={`h-14 border-b flex items-center justify-between px-4 ${isDark ? 'border-zinc-800 bg-black' : 'border-zinc-200 bg-white'}`}>
          <div className="flex items-center gap-3">
            {!showSidebar && (
              <button onClick={() => setShowSidebar(true)} className={`p-2 rounded-lg ${isDark ? 'hover:bg-zinc-800' : 'hover:bg-zinc-100'}`}>
                <Menu size={20} />
              </button>
            )}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveMode("ui")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeMode === "ui" 
                  ? (isDark ? 'bg-zinc-800 text-white shadow-sm' : 'bg-zinc-200 text-zinc-900 shadow-sm') 
                  : (isDark ? 'text-zinc-400 hover:text-white hover:bg-zinc-900/50' : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/50')}`}
              >
                UI
              </button>
              <button
                onClick={() => setActiveMode("blog")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeMode === "blog" 
                  ? (isDark ? 'bg-zinc-800 text-white shadow-sm' : 'bg-zinc-200 text-zinc-900 shadow-sm') 
                  : (isDark ? 'text-zinc-400 hover:text-white hover:bg-zinc-900/50' : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/50')}`}
              >
                Blog
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button onClick={toggleTheme} className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-zinc-800 text-zinc-400 hover:text-white' : 'hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900'}`} title="Toggle theme">
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button onClick={handleCopy} className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-zinc-800 text-zinc-400 hover:text-white' : 'hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900'}`} title="Copy code">
              {copied || blogCopied ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
            </button>
            <button onClick={handleDownload} className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-zinc-800 text-zinc-400 hover:text-white' : 'hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900'}`} title="Download project">
              <Download size={18} />
            </button>
            <button onClick={() => setActiveView(activeView === "editor" ? "preview" : "editor")} className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-zinc-800 text-zinc-400 hover:text-white' : 'hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900'}`} title="Toggle view">
              {activeView === "editor" ? <Eye size={18} /> : <Code2 size={18} />}
            </button>
            <button onClick={() => setShowDeployModal(true)} className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-zinc-800 text-zinc-400 hover:text-white' : 'hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900'}`} title="Deploy">
              <Rocket size={18} />
            </button>
          </div>
        </header>

        {/* Content Area - Preview on Top, Chat at Bottom */}
        <div className="flex-1 flex flex-col relative overflow-hidden">
          {/* âœ… PURE BLACK/WHITE BACKGROUND WITH SUBTLE ACCENTS */}
          <div className={`absolute inset-0 ${isDark ? 'bg-black' : 'bg-white'}`} />
          
          {/* âœ… Subtle gradient accents (only visible on hover/interaction) */}
          <div className={`absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-700 pointer-events-none ${isDark 
            ? 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/10 via-transparent to-transparent' 
            : 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-200/20 via-transparent to-transparent'}`} />

          {/* âœ… Floating animated gradient orbs - ultra subtle */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className={`absolute -top-1/2 -left-1/2 w-[800px] h-[800px] rounded-full blur-3xl animate-pulse opacity-5 ${isDark ? 'bg-gradient-to-br from-violet-600 to-pink-600' : 'bg-gradient-to-br from-purple-400 to-pink-400'}`} style={{ animationDuration: '12s' }} />
            <div className={`absolute top-1/2 -right-1/4 w-[600px] h-[600px] rounded-full blur-3xl animate-pulse opacity-5 ${isDark ? 'bg-gradient-to-br from-blue-600 to-cyan-600' : 'bg-gradient-to-br from-blue-400 to-cyan-400'}`} style={{ animationDuration: '15s', animationDelay: '3s' }} />
          </div>

          {/* Full Screen Exit Hint */}
          {isFullscreen && (
            <div className={`absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg border text-sm backdrop-blur-md ${isDark ? 'bg-black/80 border-zinc-700' : 'bg-white/80 border-zinc-200'}`}>
              Press <kbd className={`px-2 py-0.5 rounded border mx-1 ${isDark ? 'bg-zinc-800 border-zinc-600' : 'bg-zinc-100 border-zinc-300'}`}>Esc</kbd> to exit fullscreen
            </div>
          )}

          {/* Main Content - Preview takes most space */}
          <div className={`relative z-10 flex-1 flex flex-col ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
            {/* Preview Area */}
            <div
              className={`${isFullscreen ? "flex-1" : "h-[calc(100vh-270px)]"
                } border-b overflow-hidden pt-4 px-4 transition-all duration-300`}
              style={{ height: isChatOpen ? 'calc(100vh - 200px)' : 'calc(100vh - 80px)' }}
            >
              {isLoading ? (
                <LoaderSkeleton />
              ) : activeView === "preview" ? (
                activeMode === "ui" ? (
                  <div
                    className={`w-full h-full relative pt-3 backdrop-blur-sm rounded-2xl border transition-colors ${isDark 
                      ? "bg-black/50 border-zinc-800" 
                      : "bg-white/50 border-zinc-200"}`}
                  >
                    {studioTemplateId ? (
                      <div className="w-full h-full rounded-2xl overflow-hidden shadow-sm border relative">
                        <SandpackErrorBoundary>
                          <TemplateStudioPreview
                            templateId={studioTemplateId}
                            content={studioContent}
                          />
                        </SandpackErrorBoundary>
                      </div>
                    ) : (
                      // âœ… STEP 3: SIMPLIFIED schema PROP USING liveSchema
                      <LivePreview
                        key={previewKey}
                        schema={liveSchema}
                        isDark={isDark}
                      />
                    )}
                    {isTyping && (
                      <div className={`absolute inset-0 flex items-center justify-center backdrop-blur-sm z-10 ${isDark ? 'bg-black/60' : 'bg-white/60'}`}>
                        <Loader2 className="animate-spin text-violet-400" size={32} />
                      </div>
                    )}
                  </div>
                ) : renderBlogPreview()
              ) : (
                <div className={`w-full h-full rounded-2xl border transition-colors ${isDark ? 'bg-black border-zinc-800' : 'bg-white border-zinc-200'}`}>
                  {renderEditorContent()}
                  {activeMode === "ui" && (
                    <button
                      onClick={handleSaveFile}
                      className="absolute top-4 right-4 px-3 py-1.5 bg-violet-500/20 text-violet-300 border border-violet-500/30 rounded-lg text-xs hover:bg-violet-500/30 transition-colors"
                    >
                      Save File
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* âœ… PREMIUM GEMINI-STYLE PROMPT BOX WITH UP ARROW BUTTON */}
            <div
              className={`flex-shrink-0 backdrop-blur-xl border-t transition-all duration-500 ease-in-out overflow-hidden relative ${isDark ? 'bg-black/80 border-zinc-800' : 'bg-white/80 border-zinc-200'
                } ${isChatOpen ? 'min-h-[180px] max-h-[300px]' : 'min-h-0 max-h-0'}`}
            >
              {/* âœ… Premium animated gradient border effect */}
              {isChatOpen && (
                <>
                  <div className="absolute inset-0 pointer-events-none">
                    {/* Top animated glow line */}
                    <div className={`absolute top-0 left-0 right-0 h-[1px] ${isDark
                      ? 'bg-gradient-to-r from-transparent via-violet-500/40 to-transparent animate-gradient-x'
                      : 'bg-gradient-to-r from-transparent via-purple-500/40 to-transparent animate-gradient-x'
                      }`} />
                  </div>
                </>
              )}

              <div className="relative z-10 flex-1 p-3 flex flex-col gap-2">
                {/* âœ… Animated header with rotating words */}
                {isChatOpen && generationHistory.length > 0 && activeMode === "ui" && (
                  <div className={`flex items-center justify-between text-xs ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                    <div className="flex items-center gap-2">
                      <Sparkles size={12} className={`${isDark ? 'text-violet-400' : 'text-purple-500'} animate-pulse`} />
                      <span className="font-medium">AI Assistant</span>
                      <span className="text-zinc-600 dark:text-zinc-500">â€¢</span>
                      {/* âœ… Animated word rotation */}
                      <span className={`font-semibold bg-clip-text text-transparent bg-gradient-to-r ${isDark ? 'from-violet-400 via-purple-400 to-pink-400' : 'from-purple-600 via-violet-600 to-pink-600'} animate-gradient-x`}>
                        {ANIMATED_WORDS[animatedWordIndex]}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      {generationHistory.slice(-2).map((h, index) => {
                        const label = typeof h === "string" ? h : (h as any)?.prompt || JSON.stringify(h);
                        return (
                          <span
                            key={`${label.slice(0, 30)}-${index}`}
                            className={`px-2 py-0.5 rounded-md truncate max-w-[150px] text-[10px] ${isDark ? "bg-zinc-900/50" : "bg-zinc-100/50"}`}
                            title={label}
                          >
                            {label.length > 35 ? `${label.slice(0, 35)}â€¦` : label}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* âœ… GEMINI-STYLE POLISHED INPUT WITH UP ARROW BUTTON */}
                <div className="relative group flex-1">
                  {/* Outer animated glow ring */}
                  <div className={`absolute -inset-0.5 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 rounded-3xl opacity-10 group-hover:opacity-20 blur-md transition duration-500 animate-gradient-x`} />
                  
                  <div className={`relative rounded-3xl border p-1.5 shadow-lg backdrop-blur-sm transition-all duration-300 ${isDark 
                    ? 'bg-zinc-900/60 border-zinc-700 hover:border-zinc-600' 
                    : 'bg-zinc-50/60 border-zinc-300 hover:border-zinc-400'
                  }`}>
                    <div className="flex items-end gap-2">
                      {/* Textarea - Gemini style */}
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
                        className={`flex-1 bg-transparent outline-none resize-none text-sm min-h-[44px] max-h-[120px] placeholder:transition-colors px-4 py-3 rounded-2xl ${isDark 
                          ? 'text-white placeholder:text-zinc-500' 
                          : 'text-zinc-900 placeholder:text-zinc-400'
                        }`}
                        rows={1}
                        disabled={isLoading}
                        style={{ lineHeight: '1.5' }}
                      />
                      
                      {/* âœ… UP ARROW SEND BUTTON - Gemini style */}
                      <button
                        onClick={activeMode === "ui" ? handleGenerateUI : handleGenerateBlog}
                        disabled={isLoading || (activeMode === "ui" ? !inputValue.trim() : !blogInputValue.trim())}
                        className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-200 shadow-md ${
                          isLoading || (activeMode === "ui" ? !inputValue.trim() : !blogInputValue.trim())
                            ? (isDark ? 'bg-zinc-800 cursor-not-allowed' : 'bg-zinc-200 cursor-not-allowed')
                            : 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 hover:scale-105 active:scale-95 shadow-violet-500/30'
                        }`}
                        title="Generate (Enter)"
                      >
                        {isLoading ? (
                          <Loader2 size={18} className="animate-spin text-white" />
                        ) : (
                          <ArrowUp size={18} className="text-white font-bold" />
                        )}
                      </button>
                    </div>
                    
                    {/* Helper text */}
                    <div className={`flex items-center justify-between mt-1 px-4 pb-1 ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>
                      <div className="flex items-center gap-2 text-[10px]">
                        <span className="flex items-center gap-0.5">
                          <Sparkles size={10} className={isDark ? 'text-violet-400' : 'text-purple-500'} />
                          AI Powered
                        </span>
                        <span className="text-zinc-700 dark:text-zinc-600">â€¢</span>
                        <span>Press Enter to generate</span>
                      </div>
                      <button
                        onClick={() => setIsChatOpen(prev => !prev)}
                        className={`text-[10px] hover:underline ${isDark ? 'text-zinc-600 hover:text-zinc-400' : 'text-zinc-400 hover:text-zinc-600'}`}
                      >
                        {isChatOpen ? 'Hide' : 'Show'} Chat
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* âœ… TOGGLE BUTTON WITH TEXT LABELS */}
            <button
              onClick={() => setIsChatOpen(prev => !prev)}
              className={`absolute bottom-3 right-3 z-40 px-3 py-1.5 rounded-full shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-1.5 text-xs font-medium ${isDark
                ? 'bg-black/90 hover:bg-zinc-900 text-zinc-300 border border-zinc-700 backdrop-blur-sm'
                : 'bg-white/90 hover:bg-zinc-50 text-zinc-700 border border-zinc-300 backdrop-blur-sm'
                }`}
              title={isChatOpen ? "Close Chat (Ctrl+`)" : "Open Chat (Ctrl+`)"}
            >
              {/* Animated lighting effect on button */}
              <span className={`absolute inset-0 rounded-full ${isDark
                ? 'bg-gradient-to-br from-violet-500/5 to-pink-500/5'
                : 'bg-gradient-to-br from-purple-400/5 to-pink-400/5'
                } blur-sm animate-pulse`} />
              <span className="relative z-10 flex items-center gap-1">
                {isChatOpen ? (
                  <>
                    <MessageSquareOff size={14} />
                    <span className="hidden sm:inline">Close Chat</span>
                    <ChevronDown size={12} className="rotate-180 transition-transform" />
                  </>
                ) : (
                  <>
                    <MessageSquare size={14} />
                    <span className="hidden sm:inline">Open Chat</span>
                    <ChevronDown size={12} className="transition-transform" />
                  </>
                )}
              </span>
            </button>
          </div>
        </div>

        {/* Status Bar */}
        <div className={`h-7 border-t backdrop-blur-sm flex items-center justify-between px-4 text-[10px] ${isDark ? 'border-zinc-800 bg-black/50 text-zinc-500' : 'border-zinc-200 bg-white/50 text-zinc-500'}`}>
          <div className="flex items-center gap-3">
            <span className="truncate max-w-[150px]">{status}</span>
            {Object.keys(filesState).length > 0 && (
              <span className="hidden sm:inline">{Object.keys(filesState).length} files</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span>{currentTime.toLocaleTimeString()}</span>
          </div>
        </div>
      </main>

      {/* Deploy Modal */}
      {showDeployModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className={`w-full max-w-md border rounded-2xl overflow-hidden shadow-2xl ${isDark ? 'bg-black border-zinc-800' : 'bg-white border-zinc-200'}`}>
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
                  className={`w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-violet-500 transition-colors ${isDark ? 'bg-black border-zinc-700 text-white placeholder:text-zinc-600' : 'bg-white border-zinc-300 text-zinc-900 placeholder:text-zinc-400'}`}
                />
              </div>
              {deployStatus && (
                <div className={`p-3 rounded-lg text-sm ${isDark ? 'bg-zinc-900' : 'bg-zinc-100'}`}>{deployStatus}</div>
              )}
            </div>
            <div className={`flex justify-end gap-2 p-4 border-t ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
              <button onClick={() => setShowDeployModal(false)} className={`px-4 py-2 text-sm ${isDark ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'}`}>
                Cancel
              </button>
              <button
                onClick={handleDeploy}
                disabled={isDeploying || !deployConfig.projectName.trim()}
                className="px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-sm font-medium rounded-lg disabled:opacity-50 transition-all shadow-lg shadow-violet-500/20"
              >
                {isDeploying ? "Deploying..." : "Deploy"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* âœ… GLOBAL STYLES FOR PREMIUM ANIMATIONS */}
      <style jsx global>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(2deg); }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
        .animate-glow {
          animation: glow-pulse 2.5s ease-in-out infinite;
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        /* Smooth scrollbar for premium feel */
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: ${isDark ? '#27272a' : '#e4e4e7'};
          border-radius: 3px;
          transition: background 0.2s;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: ${isDark ? '#3f3f46' : '#d4d4d8'};
        }
        /* Ensure full page coverage */
        html, body, #__next {
          height: 100%;
          margin: 0;
          padding: 0;
        }
        /* Remove default focus outline for better UX */
        button:focus-visible, input:focus-visible, textarea:focus-visible {
          outline: 2px solid ${isDark ? '#8b5cf6' : '#7c3aed'};
          outline-offset: 2px;
        }
        /* Gemini-style textarea auto-resize hint */
        textarea {
          field-sizing: content;
        }
      `}</style>
    </div>
  );
}









