// app/page.tsx
"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithPopup,
  onAuthStateChanged,
  signOut
} from "firebase/auth";
import type { User } from "firebase/auth";
import { auth, googleProvider } from "@/firebase/config";
import {
  Sparkles, Zap, Globe, Code2, Rocket, ChevronRight, Play,
  Layers, Palette, MousePointer2, CheckCircle2, X, Loader2,
  LogOut, Star, Wand2, ArrowRight, Shield, TrendingUp, Users,
  Award, MessageCircle, Mail, Phone, ChevronDown, MoveRight,
  Cpu, Database, Cloud
} from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";

interface AppState {
  user: User | null;
  theme: 'dark' | 'light';
  pricingPeriod: 'monthly' | 'yearly';
  activeSection: string;
}

export default function LandingPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pricingPeriod, setPricingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [activeSection, setActiveSection] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [flashIntensity, setFlashIntensity] = useState(0);

  const sectionsRef = useRef<(HTMLElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();
  const scrollYProgress = useSpring(scrollY, { stiffness: 100, damping: 30 });
  const bgOpacity = useTransform(scrollYProgress, [0, 500], [0.3, 0.8]);

  // Check mobile viewport
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Smooth scroll snap observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = sectionsRef.current.findIndex(sec => sec === entry.target);
            if (index !== -1) setActiveSection(index);
          }
        });
      },
      { threshold: 0.5 }
    );

    sectionsRef.current.forEach(sec => sec && observer.observe(sec));
    return () => observer.disconnect();
  }, []);

  // Random lightning flash effect
  useEffect(() => {
    const triggerFlash = () => {
      setFlashIntensity(0.6);
      setTimeout(() => setFlashIntensity(0), 100);
      setTimeout(() => {
        setFlashIntensity(0.3);
        setTimeout(() => setFlashIntensity(0), 50);
      }, 150);
    };

    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        triggerFlash();
      }
    }, 3000 + Math.random() * 5000);

    return () => clearInterval(interval);
  }, []);

  // Auth state listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
      if (u) router.push("/dashboard");
    });
    return () => unsub();
  }, [router]);

  const handleGoogleSignIn = async () => {
    setError(null);
    setSigningIn(true);
    try {
      await signInWithPopup(auth, googleProvider);
      setShowLoginModal(false);
      router.push("/dashboard");
    } catch (e) {
      const message = e instanceof Error ? e.message : "Login failed. Try again.";
      setError(message);
      setSigningIn(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  const handleGetStarted = () => {
    if (user) {
      router.push("/dashboard");
    } else {
      setShowLoginModal(true);
    }
  };

  const handleChatClick = () => {
    if (!user) {
      setShowLoginModal(true);
    } else {
      router.push("/dashboard");
    }
  };

  // Section background configs with storm themes
  const sectionBg = [
    { id: 0, bg: "bg-black", storm: "storm-purple", gradient: "from-violet-950/40" },
    { id: 1, bg: "bg-zinc-950", storm: "storm-blue", gradient: "from-blue-950/40" },
    { id: 2, bg: "bg-black", storm: "storm-emerald", gradient: "from-emerald-950/40" },
    { id: 3, bg: "bg-zinc-950", storm: "storm-orange", gradient: "from-orange-950/40" },
    { id: 4, bg: "bg-black", storm: "storm-pink", gradient: "from-pink-950/40" },
    { id: 5, bg: "bg-zinc-950", storm: "storm-violet", gradient: "from-violet-950/40" },
  ];

  const currentBg = sectionBg[activeSection] || sectionBg[0];

  // Dynamic pricing data
  const pricingPlans = [
    {
      name: "Basic",
      description: "Perfect for startups and personal projects",
      monthlyPrice: 129,
      yearlyPrice: 1290,
      savings: "2 months free",
      features: [
        "AI-Powered Website Generation",
        "5 Projects per month",
        "Basic Analytics Dashboard",
        "Email Support",
        "Standard Templates Library",
        "1-Click Deployment",
        "SSL Certificate Included"
      ],
      cta: "Start Basic Plan",
      popular: false,
      gradient: "from-zinc-700 to-zinc-900",
      accent: "border-zinc-600"
    },
    {
      name: "Pro",
      description: "For growing businesses and agencies",
      monthlyPrice: 299,
      yearlyPrice: 2990,
      savings: "2 months free + Priority Support",
      features: [
        "Everything in Basic, plus:",
        "Unlimited Projects",
        "Advanced AI Customization",
        "Team Collaboration (5 seats)",
        "Priority 24/7 Support",
        "Premium Templates & Components",
        "A/B Testing & Analytics",
        "Custom Domain Integration",
        "API Access & Webhooks",
        "White-label Options"
      ],
      cta: "Go Pro Today",
      popular: true,
      gradient: "from-violet-600/20 to-purple-600/20",
      accent: "border-violet-500/50"
    },
    {
      name: "Advanced",
      description: "Enterprise solutions & custom implementations",
      monthlyPrice: null,
      yearlyPrice: null,
      savings: "Custom pricing based on needs",
      features: [
        "Everything in Pro, plus:",
        "Dedicated Account Manager",
        "Custom AI Model Training",
        "Unlimited Team Seats",
        "SLA Guarantee (99.99% Uptime)",
        "On-premise Deployment Options",
        "Advanced Security & Compliance",
        "Custom Integrations & APIs",
        "Quarterly Strategy Sessions",
        "Priority Feature Requests"
      ],
      cta: "Contact Sales",
      contactEmail: "codewithumesh00@gmail.com",
      popular: false,
      gradient: "from-orange-500/20 to-red-600/20",
      accent: "border-orange-500/50"
    }
  ];

  const features = [
    {
      icon: Code2,
      title: "AI-Powered Generation",
      description: "Describe your vision in natural language. Our advanced AI crafts production-ready, responsive websites with semantic HTML, optimized CSS, and accessible components—in seconds.",
      color: "from-violet-500 to-purple-600"
    },
    {
      icon: Globe,
      title: "Global Edge Deployment",
      description: "One-click deploy to 300+ edge locations worldwide. Automatic CDN optimization, DDoS protection, and instant cache invalidation ensure blazing-fast load times everywhere.",
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: Layers,
      title: "Visual Editor Pro",
      description: "Fine-tune every pixel with our intuitive drag-and-drop interface. Real-time previews, version history, and collaborative editing make refinement effortless.",
      color: "from-emerald-500 to-teal-600"
    },
    {
      icon: Zap,
      title: "Performance Optimized",
      description: "100/100 Lighthouse scores guaranteed. Automatic image optimization, code splitting, lazy loading, and Core Web Vitals monitoring built-in.",
      color: "from-orange-500 to-red-600"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "SOC 2 Type II compliant infrastructure. End-to-end encryption, automated backups, audit logs, and granular permission controls keep your projects secure.",
      color: "from-pink-500 to-rose-600"
    },
    {
      icon: TrendingUp,
      title: "Analytics & Insights",
      description: "Track user behavior, conversion funnels, and performance metrics. AI-powered recommendations help you optimize for better engagement and ROI.",
      color: "from-indigo-500 to-violet-600"
    }
  ];

  const pipelineSteps = [
    {
      icon: Wand2,
      title: "Analyzing prompt...",
      description: "clyrawebweb's NLP engine parses your request, identifies intent, extracts design preferences, and maps requirements to our component library.",
      color: "from-orange-500 to-red-600",
      step: "01"
    },
    {
      icon: Palette,
      title: "Crafting designs...",
      description: "Our generative AI creates original visuals, writes compelling copy, and assembles a responsive layout optimized for your target audience and devices.",
      color: "from-blue-500 to-cyan-600",
      step: "02"
    },
    {
      icon: Rocket,
      title: "Tweak, iterate, publish!",
      description: "Preview your site in real-time. Make adjustments with natural language commands or our visual editor. When ready, deploy globally with one click.",
      color: "from-violet-500 to-purple-600",
      step: "03"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Founder, TechStart",
      avatar: "https://i.pravatar.cc/150?img=5",
      quote: "clyrawebweb transformed our landing page concept into a live, high-converting site in under 10 minutes. The AI understood our brand voice perfectly.",
      rating: 5
    },
    {
      name: "Marcus Johnson",
      role: "Creative Director, Studio Flux",
      avatar: "https://i.pravatar.cc/150?img=12",
      quote: "As a design agency, we needed speed without compromising quality. This platform delivers both. Our clients are blown away by the results.",
      rating: 5
    },
    {
      name: "Elena Rodriguez",
      role: "CTO, GrowthLabs",
      avatar: "https://i.pravatar.cc/150?img=9",
      quote: "The performance optimizations are incredible. Our site loads 3x faster than our previous build, and the analytics helped us increase conversions by 47%.",
      rating: 5
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-zinc-200">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-3 text-sm text-zinc-400"
        >
          <Loader2 size={20} className="animate-spin text-violet-500" />
          <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent font-medium">
            Initializing storm systems...
          </span>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-black text-zinc-100 overflow-x-hidden relative selection:bg-violet-500/30 selection:text-white"
    >
      {/* ===== LIGHTNING STORM BACKGROUND EFFECT ===== */}
      <div className={`fixed inset-0 overflow-hidden pointer-events-none transition-colors duration-1000 ${currentBg.bg}`}>

        {/* Flash Overlay */}
        <motion.div
          className="absolute inset-0 bg-white pointer-events-none z-50"
          style={{ opacity: flashIntensity }}
        />

        {/* Storm Clouds Layer */}
        <div className="absolute inset-0 opacity-40">
          <div className={`absolute inset-0 bg-gradient-to-b ${currentBg.gradient} to-black`} />
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full blur-3xl"
              style={{
                background: `radial-gradient(circle, ${i % 2 === 0 ? 'rgba(139, 92, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)'
                  } 0%, transparent 70%)`,
                width: `${400 + i * 100}px`,
                height: `${400 + i * 100}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [0, Math.random() * 100 - 50, 0],
                y: [0, Math.random() * 100 - 50, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 20 + i * 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        {/* Lightning Bolts Container */}
        <div className="absolute inset-0">
          {/* Main Lightning Strikes */}
          {[...Array(3)].map((_, boltIndex) => (
            <svg
              key={boltIndex}
              className="absolute w-full h-full"
              viewBox="0 0 1920 1080"
              preserveAspectRatio="xMidYMid slice"
            >
              <defs>
                <linearGradient id={`storm-bolt-${boltIndex}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                  <stop offset="50%" stopColor={boltIndex === 0 ? "#a78bfa" : boltIndex === 1 ? "#60a5fa" : "#34d399"} stopOpacity="0.6" />
                  <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                </linearGradient>
                <filter id={`storm-glow-${boltIndex}`}>
                  <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Primary Bolt */}
              <motion.path
                d={`M ${300 + boltIndex * 400} 0 L ${250 + boltIndex * 400} ${150 + Math.random() * 100} L ${350 + boltIndex * 400} ${150 + Math.random() * 100} L ${200 + boltIndex * 400} ${400 + Math.random() * 200} L ${300 + boltIndex * 400} ${400 + Math.random() * 200} L ${150 + boltIndex * 400} ${700 + Math.random() * 200} L ${250 + boltIndex * 400} ${600 + Math.random() * 100} L ${200 + boltIndex * 400} 1080`}
                stroke={`url(#storm-bolt-${boltIndex})`}
                strokeWidth="4"
                fill="none"
                filter={`url(#storm-glow-${boltIndex})`}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{
                  pathLength: [0, 1, 0.9, 1, 0],
                  opacity: [0, 1, 0.4, 1, 0],
                  strokeWidth: [3, 6, 3, 5, 3]
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  repeatDelay: 4 + boltIndex * 2 + Math.random() * 3,
                  ease: "easeInOut"
                }}
              />

              {/* Branch Lightning */}
              {[...Array(4)].map((_, branchIndex) => (
                <motion.path
                  key={branchIndex}
                  d={`M ${280 + boltIndex * 400 + Math.random() * 40} ${200 + branchIndex * 150} L ${250 + Math.random() * 60} ${250 + branchIndex * 150 + Math.random() * 100} L ${300 + Math.random() * 60} ${300 + branchIndex * 150 + Math.random() * 100}`}
                  stroke={`url(#storm-bolt-${boltIndex})`}
                  strokeWidth="2"
                  fill="none"
                  filter={`url(#storm-glow-${boltIndex})`}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{
                    pathLength: [0, 1, 0],
                    opacity: [0, 0.8, 0]
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    repeatDelay: 4.5 + boltIndex * 2 + branchIndex * 0.5,
                    delay: 0.2,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </svg>
          ))}
        </div>

        {/* Rain Effect */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-px bg-gradient-to-b from-transparent via-blue-300/50 to-transparent"
              style={{
                left: `${Math.random() * 100}%`,
                height: `${20 + Math.random() * 40}px`,
              }}
              animate={{
                y: [-100, 1180],
                opacity: [0, 0.5, 0]
              }}
              transition={{
                duration: 0.8 + Math.random() * 0.5,
                repeat: Infinity,
                delay: i * 0.05,
                ease: "linear"
              }}
            />
          ))}
        </div>

        {/* Fog/Mist Layer */}
        <div className="absolute inset-0 opacity-30">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-32 bg-gradient-to-r from-transparent via-white/10 to-transparent blur-xl"
              style={{
                top: `${20 + i * 20}%`,
                width: `${60 + Math.random() * 40}%`,
              }}
              animate={{
                x: [-100, 100, -100],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{
                duration: 15 + i * 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        {/* Crack Lines */}
        <div className="absolute inset-0 opacity-30">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
              style={{
                top: `${15 + i * 14}%`,
                left: `${5 + i * 15}%`,
                width: `${40 + i * 5}%`,
                rotate: `${-15 + i * 6}deg`
              }}
              animate={{
                opacity: [0, 0.5, 0],
                scaleX: [0.9, 1.1, 0.9]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: i * 0.6,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </div>

      {/* ===== SMOOTH SCROLL CONTAINER WITH SNAP ===== */}
      <div className="relative z-10 snap-y snap-mandatory h-screen overflow-y-auto scrollbar-hide">

        {/* ===== NAVIGATION (Fixed) ===== */}
        <motion.nav
          className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 backdrop-blur-xl bg-black/40"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
            {/* Logo - FULL IMAGE ONLY, NO TEXT, NO CROP */}
            <motion.div
              className="flex items-center cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setActiveSection(0);
              }}
            >
              <img
                src="https://res.cloudinary.com/dzwxmiu47/image/upload/v1776662521/Gemini_Generated_Image_qoawvdqoawvdqoaw-removebg-preview_eyghjk.png"
                alt="Logo"
                className="h-12 sm:h-14 w-auto object-contain drop-shadow-2xl"
              />
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {['Features', 'How it Works', 'Pricing', 'Testimonials'].map((item, i) => (
                <motion.a
                  key={item}
                  href={`#section-${i + 1}`}
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById(`section-${i + 1}`);
                    el?.scrollIntoView({ behavior: 'smooth' });
                    setActiveSection(i + 1);
                  }}
                  className={`px-4 py-2 text-sm transition-colors relative group ${activeSection === i + 1 ? 'text-white' : 'text-zinc-400 hover:text-white'
                    }`}
                  whileHover={{ y: -2 }}
                >
                  {item}
                  <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-violet-500 to-purple-500 transition-all duration-300 ${activeSection === i + 1 ? 'w-full' : 'w-0 group-hover:w-full'
                    }`} />
                </motion.a>
              ))}
            </div>

            {/* Auth Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {user ? (
                <>
                  <motion.div
                    className="flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-xl bg-zinc-900/50 border border-white/10"
                    whileHover={{ scale: 1.02 }}
                  >
                    <img src={user.photoURL || ""} alt="" className="w-6 h-6 sm:w-7 sm:h-7 rounded-full ring-2 ring-violet-500/30" />
                    <span className="text-xs sm:text-sm text-zinc-300 hidden sm:block font-medium">{user.displayName}</span>
                  </motion.div>
                  <motion.button
                    onClick={handleLogout}
                    className="p-2 rounded-xl hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-white"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <LogOut size={16} className="sm:w-4 sm:h-4" />
                  </motion.button>
                  <motion.button
                    onClick={() => router.push("/dashboard")}
                    className="px-3 sm:px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-xs sm:text-sm font-semibold transition-all shadow-lg shadow-violet-600/25"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Dashboard
                  </motion.button>
                </>
              ) : (
                <motion.button
                  onClick={handleGetStarted}
                  className="px-3 sm:px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-xs sm:text-sm font-semibold transition-all shadow-lg shadow-violet-600/25"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Sign In
                </motion.button>
              )}
            </div>
          </div>
        </motion.nav>

        {/* ===== SECTION 0: HERO (100vh) ===== */}
        <section
          ref={el => { sectionsRef.current[0] = el; }}
          id="section-0"
          className="snap-start min-h-screen flex items-center justify-center px-4 sm:px-6 pt-20"
        >
          <div className="max-w-6xl mx-auto w-full">
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-zinc-900/80 border border-white/10 backdrop-blur-sm mb-6 sm:mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50" />
              <span className="text-sm text-zinc-300 font-medium">AI-Powered Website Builder</span>
            </motion.div>

            {/* Headline */}
            <motion.div
              className="text-center mb-8 sm:mb-10"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight mb-4 sm:mb-6">
                <span className="bg-gradient-to-b from-white via-white to-zinc-400 bg-clip-text text-transparent block">
                  Presented By
                </span>
                <span className="bg-gradient-to-r from-orange-400 via-red-400 to-violet-400 bg-clip-text text-transparent block">
                  Gen Ai
                </span>
              </h1>

              <p className="text-xl sm:text-2xl md:text-3xl text-zinc-400 leading-relaxed mb-3 sm:mb-4 font-light">
                one prompt away.
              </p>

              <p className="text-base sm:text-lg text-zinc-500 leading-relaxed max-w-2xl mx-auto mb-8 sm:mb-12 px-2">
                Build stunning, production-ready websites with AI. Just describe what you want, and watch it come to life in seconds.
              </p>
            </motion.div>

            {/* Chat Interface */}
            <motion.div
              className="w-full max-w-3xl mx-auto mb-6 sm:mb-10 px-2"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600/30 to-purple-600/30 rounded-2xl sm:rounded-3xl blur-sm opacity-70" />

                <div className="relative bg-zinc-900/60 border border-white/10 rounded-2xl sm:rounded-3xl p-2 sm:p-3 backdrop-blur-xl">
                  <textarea
                    placeholder="Describe what you want to build..."
                    className="w-full bg-zinc-900/40 border border-white/10 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-4 sm:py-5 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500/50 resize-none min-h-[100px] sm:min-h-[140px] text-base sm:text-lg cursor-pointer"
                    onClick={handleChatClick}
                    readOnly
                  />
                  <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4">
                    <motion.button
                      onClick={handleChatClick}
                      className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white transition-all shadow-lg"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ArrowRight size={18} className="sm:w-5 sm:h-5" />
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2 sm:gap-3 mt-4 sm:mt-8 justify-center px-2">
                {['✨ Portfolio', '🚀 Landing Page', '🎨 Dashboard'].map((action, i) => (
                  <motion.button
                    key={action}
                    onClick={handleChatClick}
                    className="px-3 sm:px-4 py-2 rounded-full bg-zinc-900/50 border border-white/10 hover:border-violet-500/50 text-xs sm:text-sm text-zinc-400 hover:text-white transition-all backdrop-blur-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {action}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-zinc-500 px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {[
                { icon: CheckCircle2, text: "No credit card" },
                { icon: CheckCircle2, text: "Free to start" },
                { icon: CheckCircle2, text: "AI-powered" }
              ].map((badge) => (
                <div key={badge.text} className="flex items-center gap-1.5 sm:gap-2">
                  <badge.icon size={14} className="sm:w-4 sm:h-4 text-emerald-500" />
                  <span>{badge.text}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 sm:gap-2 text-zinc-500 cursor-pointer"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            onClick={() => {
              const el = document.getElementById('section-1');
              el?.scrollIntoView({ behavior: 'smooth' });
              setActiveSection(1);
            }}
          >
            <span className="text-[10px] sm:text-xs hidden sm:block">Scroll to explore</span>
            <ChevronDown size={16} className="sm:w-5 sm:h-5" />
          </motion.div>
        </section>

        {/* ===== SECTION 1: AI PIPELINE (100vh) ===== */}
        <section
          ref={el => { sectionsRef.current[1] = el; }}
          id="section-1"
          className="snap-start min-h-screen flex items-center justify-center px-4 sm:px-6 py-16"
        >
          <div className="max-w-6xl mx-auto w-full">
            <motion.div
              className="text-center mb-12 sm:mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 mb-4 sm:mb-6">
                <Cpu size={14} className="sm:w-4 sm:h-4 text-orange-400" />
                <span className="text-xs sm:text-sm text-orange-400 font-medium">AI Pipeline</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
                Building sites,<br className="sm:hidden" />end-to-end.
              </h2>
              <p className="text-zinc-400 text-sm sm:text-lg max-w-2xl mx-auto px-2">
                From concept to deployment in three intelligent steps.
              </p>
            </motion.div>

            <div className="space-y-8 sm:space-y-12">
              {pipelineSteps.map((step, index) => (
                <motion.div
                  key={index}
                  className="relative flex flex-col sm:flex-row items-center gap-4 sm:gap-6 group"
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50, scale: 0.9 }}
                  whileInView={{ opacity: 1, x: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.2,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{
                    scale: 1.02,
                    transition: { duration: 0.2 }
                  }}
                >
                  {/* Step Number */}
                  <div className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-shadow`}>
                    <step.icon size={24} className="sm:w-6 sm:h-6 text-white" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                      <span className="text-xs font-mono text-zinc-500">{step.step}</span>
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white">{step.title}</h3>
                    </div>
                    <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-xl mx-auto sm:mx-0">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== SECTION 2: FEATURES (100vh) ===== */}
        <section
          ref={el => { sectionsRef.current[2] = el; }}
          id="section-2"
          className="snap-start min-h-screen flex items-center justify-center px-4 sm:px-6 py-16"
        >
          <div className="max-w-7xl mx-auto w-full">
            <motion.div
              className="text-center mb-10 sm:mb-14"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
                Everything you need
              </h2>
              <p className="text-zinc-400 text-sm sm:text-lg max-w-2xl mx-auto px-2">
                Powerful features engineered for speed, flexibility, and stunning results.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="group relative p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-zinc-900/40 border border-white/5 hover:border-white/20 transition-all backdrop-blur-sm overflow-hidden"
                  initial={{ opacity: 0, y: 30, rotateX: -15 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{
                    y: -8,
                    rotateX: 5,
                    transition: { duration: 0.3 }
                  }}
                  style={{ perspective: 1000 }}
                >
                  {/* Hover Glow */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                  {/* Animated Border */}
                  <div className="absolute inset-0 rounded-2xl sm:rounded-3xl border border-transparent group-hover:border-violet-500/30 transition-colors duration-500" />

                  <div className="relative z-10">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-violet-600/20 to-purple-600/20 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform`}>
                      <feature.icon size={20} className="sm:w-5 sm:h-5 text-violet-400" />
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-white mb-1.5 sm:mb-2">{feature.title}</h3>
                    <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  {/* Corner Accent */}
                  <div className={`absolute top-3 right-3 w-2 h-2 rounded-full bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== SECTION 3: PRICING (100vh) ===== */}
        <section
          ref={el => { sectionsRef.current[3] = el; }}
          id="section-3"
          className="snap-start min-h-screen flex items-center justify-center px-4 sm:px-6 py-16"
        >
          <div className="max-w-7xl mx-auto w-full">
            <motion.div
              className="text-center mb-8 sm:mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-4 sm:mb-6">
                <TrendingUp size={14} className="sm:w-4 sm:h-4 text-violet-400" />
                <span className="text-xs sm:text-sm text-violet-400 font-medium">Simple, Transparent Pricing</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
                Choose your plan
              </h2>
              <p className="text-zinc-400 text-sm sm:text-lg max-w-2xl mx-auto mb-6 sm:mb-8 px-2">
                Start free, scale as you grow.
              </p>

              {/* Billing Toggle */}
              <div className="inline-flex items-center gap-2 p-1 rounded-xl bg-zinc-900/60 border border-white/10 backdrop-blur-sm">
                <motion.button
                  onClick={() => setPricingPeriod('monthly')}
                  className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${pricingPeriod === 'monthly'
                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white'
                    : 'text-zinc-400 hover:text-white'
                    }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Monthly
                </motion.button>
                <motion.button
                  onClick={() => setPricingPeriod('yearly')}
                  className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1 ${pricingPeriod === 'yearly'
                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white'
                    : 'text-zinc-400 hover:text-white'
                    }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Yearly
                  <span className="px-1.5 py-0.5 text-[10px] bg-emerald-500/20 text-emerald-400 rounded">Save</span>
                </motion.button>
              </div>
            </motion.div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {pricingPlans.map((plan, index) => {
                const price = pricingPeriod === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
                const period = pricingPeriod === 'monthly' ? '/mo' : '/yr';

                return (
                  <motion.div
                    key={plan.name}
                    className={`relative rounded-2xl sm:rounded-3xl p-0.5 ${plan.popular ? 'bg-gradient-to-b from-violet-600/50 to-purple-600/50' : 'bg-zinc-800/50'
                      }`}
                    initial={{ opacity: 0, y: 40, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: index * 0.15,
                      type: "spring",
                      stiffness: 100
                    }}
                    whileHover={{
                      y: -10,
                      scale: 1.02,
                      transition: { duration: 0.3 }
                    }}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 text-white text-[10px] sm:text-xs font-bold z-10 shadow-lg">
                        MOST POPULAR
                      </div>
                    )}

                    <div className={`relative h-full rounded-2xl sm:rounded-3xl p-5 sm:p-6 bg-gradient-to-br ${plan.gradient} border ${plan.accent} backdrop-blur-xl flex flex-col`}>
                      <div className="mb-5 sm:mb-6">
                        <h3 className="text-lg sm:text-xl font-bold text-white mb-1">{plan.name}</h3>
                        <p className="text-zinc-400 text-xs">{plan.description}</p>
                      </div>

                      <div className="mb-5 sm:mb-6">
                        {price !== null ? (
                          <motion.div
                            className="flex items-baseline gap-1"
                            key={pricingPeriod}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            <span className="text-2xl sm:text-4xl font-bold text-white">${price.toLocaleString()}</span>
                            <span className="text-zinc-400 text-xs">{period}</span>
                          </motion.div>
                        ) : (
                          <div className="text-xl sm:text-2xl font-bold text-white">Custom</div>
                        )}
                        {plan.savings && (
                          <p className="text-[10px] sm:text-xs text-emerald-400 mt-1 flex items-center gap-1">
                            <CheckCircle2 size={12} />
                            {plan.savings}
                          </p>
                        )}
                      </div>

                      <ul className="space-y-2 sm:space-y-3 mb-5 sm:mb-6 flex-1">
                        {plan.features.slice(0, 5).map((feature, i) => (
                          <motion.li
                            key={i}
                            className="flex items-start gap-2 text-zinc-300 text-xs"
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                          >
                            <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </motion.li>
                        ))}
                      </ul>

                      <motion.button
                        onClick={() => {
                          if (plan.contactEmail) {
                            window.location.href = `mailto:${plan.contactEmail}?subject=${plan.name} Plan Inquiry`;
                          } else {
                            handleGetStarted();
                          }
                        }}
                        className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-1.5 text-xs sm:text-sm ${plan.popular
                          ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-600/30'
                          : 'bg-zinc-800 hover:bg-zinc-700 text-white border border-white/10'
                          }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {plan.cta}
                        <MoveRight size={14} />
                      </motion.button>

                      {plan.contactEmail && (
                        <p className="text-center text-[10px] text-zinc-500 mt-3">
                          <a href={`mailto:${plan.contactEmail}`} className="text-violet-400 hover:underline">{plan.contactEmail}</a>
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Enterprise Note */}
            <motion.div
              className="text-center mt-8 sm:mt-12 p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-zinc-900/40 border border-white/5 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <p className="text-zinc-400 text-xs sm:text-sm px-2">
                Need custom?{' '}
                <a href="mailto:codewithumesh00@gmail.com" className="text-violet-400 hover:underline font-medium">
                  Contact our team
                </a>{' '}
                for enterprise solutions.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ===== SECTION 4: TESTIMONIALS (100vh) ===== */}
        <section
          ref={el => { sectionsRef.current[4] = el; }}
          id="section-4"
          className="snap-start min-h-screen flex items-center justify-center px-4 sm:px-6 py-16"
        >
          <div className="max-w-7xl mx-auto w-full">
            <motion.div
              className="text-center mb-10 sm:mb-14"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4 sm:mb-6">
                <Users size={14} className="sm:w-4 sm:h-4 text-emerald-400" />
                <span className="text-xs sm:text-sm text-emerald-400 font-medium">Trusted by Creators</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
                Loved by thousands
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  className="group p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-zinc-900/40 border border-white/5 hover:border-white/20 transition-all backdrop-blur-sm"
                  initial={{ opacity: 0, y: 30, rotateY: -10 }}
                  whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: index * 0.15,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{
                    y: -5,
                    rotateY: 5,
                    transition: { duration: 0.3 }
                  }}
                  style={{ perspective: 1000 }}
                >
                  <div className="flex gap-1 mb-3 sm:mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} size={14} className="sm:w-4 sm:h-4 fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>

                  <p className="text-zinc-300 text-sm leading-relaxed mb-4 sm:mb-5 italic px-1">
                    "{testimonial.quote}"
                  </p>

                  <div className="flex items-center gap-3">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-10 h-10 rounded-full ring-2 ring-violet-500/30"
                    />
                    <div>
                      <p className="font-semibold text-white text-sm">{testimonial.name}</p>
                      <p className="text-zinc-500 text-xs">{testimonial.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== SECTION 5: CTA + FOOTER (100vh) ===== */}
        <section
          ref={el => { sectionsRef.current[5] = el; }}
          id="section-5"
          className="snap-start min-h-screen flex flex-col justify-center px-4 sm:px-6 py-16"
        >
          {/* CTA Card */}
          <div className="max-w-5xl mx-auto text-center mb-12 sm:mb-16">
            <motion.div
              className="relative p-8 sm:p-12 rounded-2xl sm:rounded-[2rem] bg-gradient-to-b from-violet-600/15 to-purple-600/15 border border-white/10 backdrop-blur-xl overflow-hidden"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              {/* Animated Background */}
              <div className="absolute inset-0">
                <motion.div
                  className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-violet-600/20 to-purple-600/20 blur-3xl"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.3, 0.5, 0.3]
                  }}
                  transition={{ duration: 8, repeat: Infinity }}
                />
                <motion.div
                  className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-gradient-to-r from-blue-600/20 to-cyan-600/20 blur-3xl"
                  animate={{
                    scale: [1.3, 1, 1.3],
                    opacity: [0.5, 0.3, 0.5]
                  }}
                  transition={{ duration: 10, repeat: Infinity }}
                />
              </div>

              <div className="relative z-10">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-5 bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
                  Ready to build something amazing?
                </h2>
                <p className="text-zinc-400 text-sm sm:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
                  Join thousands of creators building the future of the web.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-2">
                  <motion.button
                    onClick={handleGetStarted}
                    className="px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold flex items-center justify-center gap-2 transition-all text-sm sm:text-base shadow-lg shadow-violet-600/30"
                    whileHover={{ scale: 1.03, boxShadow: "0 0 30px rgba(139, 92, 246, 0.5)" }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Start Building Free
                    <ArrowRight size={16} className="sm:w-5 sm:h-5" />
                  </motion.button>
                  <motion.button
                    onClick={() => window.location.href = "mailto:codewithumesh00@gmail.com"}
                    className="px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold flex items-center justify-center gap-2 transition-all border border-white/10 text-sm sm:text-base"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Mail size={14} className="sm:w-4 sm:h-4" />
                    Contact Sales
                  </motion.button>
                </div>

                {/* Trust Signals */}
                <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-6 sm:mt-8 text-xs text-zinc-500">
                  <div className="flex items-center gap-1.5">
                    <Shield size={14} className="text-emerald-500" />
                    <span>Enterprise Security</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Cloud size={14} className="text-blue-500" />
                    <span>99.99% Uptime</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Database size={14} className="text-violet-500" />
                    <span>GDPR Compliant</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Footer - LOGO ONLY, NO TEXT */}
          <footer className="border-t border-white/5 pt-8 sm:pt-12 px-4">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-12">
                {/* Brand - FULL LOGO ONLY */}
                <div className="col-span-2 md:col-span-2 flex flex-col items-start">
                  <img
                    src="https://res.cloudinary.com/dzwxmiu47/image/upload/v1776662521/Gemini_Generated_Image_qoawvdqoawvdqoaw-removebg-preview_eyghjk.png"
                    alt="Logo"
                    className="h-16 sm:h-20 w-auto object-contain mb-4 drop-shadow-2xl"
                  />
                  <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed max-w-xs">
                    The future of web development, powered by AI.
                  </p>
                  <div className="flex gap-3 mt-4">
                    {[Globe, MessageCircle, Mail].map((Icon, i) => (
                      <motion.button
                        key={i}
                        className="p-2.5 rounded-xl bg-zinc-900/50 border border-white/5 hover:border-violet-500/30 text-zinc-400 hover:text-white transition-all"
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Icon size={16} />
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Links */}
                {[
                  { title: "Product", links: ["Features", "Pricing", "Integrations"] },
                  { title: "Resources", links: ["Docs", "Tutorials", "Blog"] },
                  { title: "Company", links: ["About", "Contact", "Legal"] }
                ].map((section, i) => (
                  <div key={i}>
                    <h4 className="font-semibold text-white text-sm mb-3">{section.title}</h4>
                    <ul className="space-y-2">
                      {section.links.map((link) => (
                        <li key={link}>
                          <a href="#" className="text-zinc-500 hover:text-white text-xs transition-colors">
                            {link}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Bottom Bar */}
              <div className="pt-6 sm:pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-600">
                <p>© 2026 All rights reserved.</p>
                <div className="flex items-center gap-4">
                  <a href="#" className="hover:text-white transition-colors">Privacy</a>
                  <a href="#" className="hover:text-white transition-colors">Terms</a>
                  <a href="#" className="hover:text-white transition-colors">Cookies</a>
                </div>
              </div>
            </div>
          </footer>
        </section>

      </div>

      {/* ===== LOGIN MODAL ===== */}
      <AnimatePresence>
        {showLoginModal && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
              onClick={() => setShowLoginModal(false)}
            />
            <motion.div
              className="relative w-full max-w-md rounded-2xl sm:rounded-3xl border border-white/10 bg-zinc-900/95 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
            >
              <motion.button
                onClick={() => setShowLoginModal(false)}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-zinc-800 transition-colors text-zinc-400"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={18} />
              </motion.button>

              <div className="text-center mb-7 sm:mb-8">
                <img
                  src="https://res.cloudinary.com/dzwxmiu47/image/upload/q_auto/f_auto/v1776653092/Gemini_Generated_Image_t3eylit3eylit3ey_cdkk4p.png"
                  alt="Logo"
                  className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 object-contain drop-shadow-2xl"
                />
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Welcome</h2>
                <p className="text-zinc-400 text-sm">Sign in to start building your dream website</p>
              </div>

              <motion.button
                onClick={handleGoogleSignIn}
                disabled={signingIn}
                className="w-full flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-5 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 disabled:opacity-60 text-white font-semibold transition-all text-sm sm:text-base shadow-lg shadow-violet-600/25"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {signingIn ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                  </>
                )}
              </motion.button>

              {error && (
                <motion.div
                  className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 text-xs sm:text-sm p-3"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {error}
                </motion.div>
              )}

              <p className="mt-6 text-[10px] sm:text-xs text-center text-zinc-500 px-2">
                By signing in, you agree to our{' '}
                <a href="#" className="text-violet-400 hover:underline">Terms</a>{' '}
                and{' '}
                <a href="#" className="text-violet-400 hover:underline">Privacy Policy</a>
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== GLOBAL STYLES ===== */}
      <style jsx global>{`
        /* Hide scrollbar but keep functionality */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        /* Storm effect classes */
        .storm-purple { filter: drop-shadow(0 0 20px #8b5cf6); }
        .storm-blue { filter: drop-shadow(0 0 20px #3b82f6); }
        .storm-emerald { filter: drop-shadow(0 0 20px #10b981); }
        .storm-orange { filter: drop-shadow(0 0 20px #f97316); }
        .storm-pink { filter: drop-shadow(0 0 20px #ec4899); }
        .storm-violet { filter: drop-shadow(0 0 20px #7c3aed); }
        
        /* Smooth scroll behavior */
        html {
          scroll-behavior: smooth;
          scroll-snap-type: y mandatory;
        }
        
        /* Responsive touch adjustments */
        @media (max-width: 640px) {
          * {
            -webkit-tap-highlight-color: transparent;
          }
        }
        
        /* 3D Transform utilities */
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
      `}</style>
    </div>
  );
}