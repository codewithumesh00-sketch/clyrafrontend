"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import type { User } from "firebase/auth";
import { auth, googleProvider } from "@/firebase/config";
import {
  Sparkles,
  Zap,
  Globe,
  Code2,
  Rocket,
  ChevronRight,
  Play,
  Layers,
  Palette,
  MousePointer2,
  CheckCircle2,
  X,
  Loader2,
  LogOut,
  Moon,
  Star,
  Wand2,
  Box,
  ArrowRight
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
      if (u) {
        router.push("/dashboard");
      }
    });
    return () => unsub();
  }, [router]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    } finally {
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

  const pipelineSteps = [
    {
      icon: Wand2,
      title: "Analyzing prompt...",
      description: "clyrawebweb helps determine the subject and style of your site.",
      color: "from-orange-500 to-red-600"
    },
    {
      icon: Palette,
      title: "Crafting designs...",
      description: "Next, it helps craft original images and copy within a responsive layout.",
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: Rocket,
      title: "Tweak, iterate, publish!",
      description: "The site's generated — your turn to bring out the design chops.",
      color: "from-violet-500 to-purple-600"
    }
  ];

  const features = [
    {
      icon: Code2,
      title: "AI-Powered Generation",
      description: "Describe your vision and watch as our AI crafts a complete, production-ready website in seconds."
    },
    {
      icon: Globe,
      title: "One-Click Deploy",
      description: "Deploy to global edge network instantly. No configuration, no hassle."
    },
    {
      icon: Layers,
      title: "Visual Editor",
      description: "Fine-tune every detail with our intuitive drag-and-drop interface."
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized performance out of the box. 100/100 Lighthouse scores guaranteed."
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-zinc-200">
        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <Loader2 size={18} className="animate-spin" />
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-zinc-100 overflow-x-hidden relative">
      {/* Animated Background with Moon */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Moon */}
        <div
          className="absolute top-12 right-12 w-16 h-16 rounded-full bg-gradient-to-br from-yellow-100 via-yellow-200 to-orange-200 opacity-90 blur-[2px]"
          style={{
            transform: `translateY(${scrollY * 0.15}px)`,
            boxShadow: "0 0 60px rgba(253, 224, 71, 0.4)"
          }}
        />

        {/* Stars */}
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-0.5 bg-white rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.8 + 0.2,
              animation: `pulse ${2 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}

        {/* Gradient Orbs */}
        <div
          className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-r from-violet-600/10 to-purple-600/10 blur-[120px]"
          style={{
            top: "-10%",
            left: "-10%",
            transform: `translate(${scrollY * 0.05}px, ${scrollY * 0.05}px)`
          }}
        />
        <div
          className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-r from-blue-600/10 to-cyan-600/10 blur-[100px]"
          style={{
            bottom: "10%",
            right: "-5%",
            transform: `translate(${-scrollY * 0.03}px, ${-scrollY * 0.03}px)`
          }}
        />

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:80px_80px]"
          style={{ transform: `translateY(${scrollY * 0.02}px)` }}
        />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 border-b border-white/5 backdrop-blur-xl bg-black/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 via-red-500 to-violet-600 flex items-center justify-center shadow-lg shadow-violet-600/20">
              <Sparkles size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              clyrawebWeb
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-zinc-400 hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-zinc-400 hover:text-white transition-colors">How it Works</a>
            <a href="#pricing" className="text-sm text-zinc-400 hover:text-white transition-colors">Pricing</a>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900/50 border border-white/10">
                  <img src={user.photoURL || ""} alt="" className="w-6 h-6 rounded-full" />
                  <span className="text-sm text-zinc-300 hidden sm:block">{user.displayName}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-white"
                >
                  <LogOut size={18} />
                </button>
                <button
                  onClick={() => router.push("/dashboard")}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-sm font-medium transition-all"
                >
                  Dashboard
                </button>
              </>
            ) : (
              <button
                onClick={handleGetStarted}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-sm font-medium transition-all"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/80 border border-white/10 backdrop-blur-sm mb-8">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm text-zinc-300">AI-Powered Website Builder</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight mb-6">
              <span className="bg-gradient-to-b from-white via-white to-zinc-400 bg-clip-text text-transparent">
                Presented By
              </span>
              <br />
              <span className="bg-gradient-to-r from-orange-400 via-red-400 to-violet-400 bg-clip-text text-transparent">
                Gen Ai
              </span>
            </h1>

            <p className="text-2xl text-zinc-400 leading-relaxed mb-4">
              one prompt away.
            </p>

            <p className="text-lg text-zinc-500 leading-relaxed max-w-2xl mx-auto mb-12">
              Build stunning, production-ready websites with AI. Just describe what you want, and watch it come to life in seconds.
            </p>
          </div>

          {/* Chat Interface */}
          <div className="w-full max-w-3xl mx-auto mb-8">
            <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-2 backdrop-blur-sm shadow-2xl shadow-violet-600/10">
              <div className="relative">
                <textarea
                  placeholder="Describe what you want to build..."
                  className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-6 py-4 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 resize-none min-h-[120px] text-lg cursor-pointer"
                  onClick={handleChatClick}
                  readOnly
                />
                <div className="absolute bottom-4 right-4 flex items-center gap-2">
                  <button
                    onClick={handleChatClick}
                    className="p-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white transition-all"
                  >
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3 mt-6 justify-center">
              <button onClick={handleChatClick} className="px-4 py-2 rounded-full bg-zinc-900/50 border border-white/10 hover:border-violet-500/50 text-sm text-zinc-400 hover:text-white transition-all">
                ✨ Create a portfolio
              </button>
              <button onClick={handleChatClick} className="px-4 py-2 rounded-full bg-zinc-900/50 border border-white/10 hover:border-violet-500/50 text-sm text-zinc-400 hover:text-white transition-all">
                🚀 Build a landing page
              </button>
              <button onClick={handleChatClick} className="px-4 py-2 rounded-full bg-zinc-900/50 border border-white/10 hover:border-violet-500/50 text-sm text-zinc-400 hover:text-white transition-all">
                🎨 Design a dashboard
              </button>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="flex items-center justify-center gap-6 text-sm text-zinc-500">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-500" />
              <span>No credit card</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-500" />
              <span>Free to start</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-500" />
              <span>AI-powered</span>
            </div>
          </div>
        </div>
      </section>

      {/* AI Pipeline Section */}
      <section id="how-it-works" className="relative z-10 py-32 px-6 bg-zinc-950/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 mb-6">
              <span className="text-sm text-orange-400 font-medium">AI Pipeline</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
              Building sites,<br />end-to-end.
            </h2>
          </div>

          <div className="space-y-16">
            {pipelineSteps.map((step, index) => (
              <div
                key={index}
                className="relative flex items-center gap-8"
                style={{
                  transform: `translateX(${index % 2 === 0 ? Math.min(scrollY * 0.03, 20) : -Math.min(scrollY * 0.03, 20)}px)`,
                  opacity: Math.min(1, 0.3 + (scrollY > index * 150 ? 0.7 : 0))
                }}
              >
                {/* Connecting Line */}
                {index < pipelineSteps.length - 1 && (
                  <div className="absolute left-8 top-20 w-0.5 h-24 bg-gradient-to-b from-orange-500/50 to-transparent hidden md:block" />
                )}

                {/* Icon */}
                <div className={`flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-xl`}>
                  <step.icon size={32} className="text-white" />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-3xl font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-zinc-400 text-lg leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="relative z-10 py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
              Everything you need
            </h2>
            <p className="text-zinc-400 text-lg">Powerful features to bring your vision to life</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-8 rounded-2xl bg-zinc-900/30 border border-white/5 hover:border-white/10 transition-all hover:bg-zinc-900/50 backdrop-blur-sm"
                style={{
                  transform: `translateX(${index % 2 === 0 ? Math.min(scrollY * 0.02, 10) : -Math.min(scrollY * 0.02, 10)}px)`
                }}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600/20 to-purple-600/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon size={24} className="text-violet-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative p-12 rounded-3xl bg-gradient-to-b from-violet-600/10 to-purple-600/10 border border-white/10 backdrop-blur-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600/5 to-purple-600/5" />

            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
                Ready to build something amazing?
              </h2>
              <p className="text-zinc-400 text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of creators building the future of the web with clyrawebWeb.
              </p>
              <button
                onClick={handleGetStarted}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold flex items-center gap-2 mx-auto transition-all hover:scale-105 shadow-2xl shadow-violet-600/25"
              >
                Start Building Free
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 via-red-500 to-violet-600 flex items-center justify-center">
              <Sparkles size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold text-white">clyrawebWeb</span>
            <span className="text-sm text-zinc-500 ml-2">Beta</span>
          </div>
          <p className="text-zinc-500 text-sm">
            © 2026 clyrawebWeb. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            onClick={() => setShowLoginModal(false)}
          />
          <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900/95 backdrop-blur-xl p-8 shadow-2xl">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-zinc-800 transition-colors text-zinc-400"
            >
              <X size={20} />
            </button>

            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-orange-500 via-red-500 to-violet-600 flex items-center justify-center">
                <Sparkles size={32} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Welcome to clyrawebWeb</h2>
              <p className="text-zinc-400">Sign in to start building your dream website</p>
            </div>

            <button
              onClick={handleGoogleSignIn}
              disabled={signingIn}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold transition-all"
            >
              {signingIn ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continue with Google
                </>
              )}
            </button>

            {error && (
              <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 text-sm p-3">
                {error}
              </div>
            )}

            <p className="mt-6 text-xs text-center text-zinc-500">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}