
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useAnimation, useMotionValue, useTransform } from "framer-motion";

// ============================================================================
// 🎨 CONFIGURATION & CONSTANTS
// ============================================================================

const GENERATION_PHASES = [
  { id: "neural", label: "Neural Network Analysis", code: "NEURAL_INIT", duration: 2800 },
  { id: "architecture", label: "Architecture Synthesis", code: "ARCH_BUILD", duration: 2400 },
  { id: "design", label: "Design System Generation", code: "DESIGN_SYS", duration: 2200 },
  { id: "components", label: "Component Fabrication", code: "COMP_GEN", duration: 2600 },
  { id: "styling", label: "Style Matrix Application", code: "STYLE_APPLY", duration: 2000 },
  { id: "responsive", label: "Responsive Calibration", code: "RESP_CONFIG", duration: 1800 },
  { id: "optimization", label: "Performance Optimization", code: "OPTIMIZE", duration: 2400 },
  { id: "finalization", label: "System Finalization", code: "FINALIZE", duration: 1600 },
];

const SYSTEM_LOGS = [
  "Initializing quantum processors...",
  "Loading neural networks...",
  "Calibrating design matrices...",
  "Synthesizing component tree...",
  "Applying style transformations...",
  "Optimizing render pipeline...",
  "Compiling asset bundles...",
  "Finalizing deployment package...",
];

const HEX_CODES = ["#FFD700", "#FFA500", "#FF6B35", "#F7931E", "#C9A227"];

// ============================================================================
// 🎭 SUB-COMPONENTS
// ============================================================================

// Matrix Rain Effect
const MatrixRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const chars = "01 アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
    const fontSize = 12;
    const columns = canvas.width / fontSize;
    const drops: number[] = [];

    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
    }

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "rgba(255, 215, 0, 0.3)";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 40);
    return () => clearInterval(interval);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
    />
  );
};

// Glitch Text Effect
const GlitchText = ({ text, className = "" }: { text: string; className?: string }) => {
  const [displayText, setDisplayText] = useState(text);
  const chars = "!@#$%^&*()_+-=[]{}|;:,.<>?";

  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (index < iteration) return text[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      if (iteration >= text.length) clearInterval(interval);
      iteration += 1 / 2;
    }, 40);

    return () => clearInterval(interval);
  }, [text]);

  return (
    <span className={`relative ${className}`}>
      {displayText}
      <motion.span
        className="absolute inset-0 opacity-50"
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.1, repeat: Infinity }}
        style={{ clipPath: "inset(0 0 50% 0)" }}
      >
        {displayText}
      </motion.span>
    </span>
  );
};

// Holographic Card
const HolographicCard = ({
  phase,
  isActive,
  isComplete,
  progress
}: {
  phase: typeof GENERATION_PHASES[0];
  isActive: boolean;
  isComplete: boolean;
  progress: number;
}) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  return (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        mouseX.set(0);
        mouseY.set(0);
      }}
      className={`relative p-6 rounded-lg border backdrop-blur-sm transition-all duration-500 ${isComplete
          ? "bg-emerald-950/30 border-emerald-500/40 shadow-lg shadow-emerald-500/10"
          : isActive
            ? "bg-amber-950/30 border-amber-500/60 shadow-xl shadow-amber-500/20"
            : "bg-zinc-950/50 border-zinc-800/50"
        }`}
    >
      {/* Holographic sheen */}
      <motion.div
        className="absolute inset-0 rounded-lg opacity-0 pointer-events-none"
        style={{
          background: "linear-gradient(105deg, transparent 40%, rgba(255,215,0,0.1) 45%, rgba(255,255,255,0.2) 50%, rgba(255,215,0,0.1) 55%, transparent 60%)",
          backgroundSize: "200% 100%",
        }}
        animate={{
          backgroundPosition: isActive ? ["200% 0", "-200% 0"] : "0 0",
          opacity: isActive ? [0, 0.5, 0] : 0,
        }}
        transition={{ duration: 2, repeat: isActive ? Infinity : 0 }}
      />

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${isComplete ? "bg-emerald-400" : isActive ? "bg-amber-400 animate-pulse" : "bg-zinc-600"
            }`} />
          <span className="text-xs font-mono text-zinc-500">{phase.code}</span>
        </div>
        {isActive && (
          <span className="text-xs font-mono text-amber-400">{Math.round(progress)}%</span>
        )}
        {isComplete && (
          <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>

      <h3 className={`text-sm font-semibold mb-2 ${isComplete ? "text-emerald-200" : isActive ? "text-amber-100" : "text-zinc-400"
        }`}>
        {phase.label}
      </h3>

      <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${isComplete ? "bg-emerald-500" : isActive ? "bg-gradient-to-r from-amber-400 to-amber-600" : "bg-zinc-700"
            }`}
          initial={{ width: 0 }}
          animate={{ width: isComplete ? "100%" : isActive ? `${progress}%` : "0%" }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Corner accents */}
      <div className={`absolute top-0 left-0 w-4 h-4 border-t border-l rounded-tl ${isActive ? "border-amber-500/50" : isComplete ? "border-emerald-500/50" : "border-zinc-700"
        }`} />
      <div className={`absolute bottom-0 right-0 w-4 h-4 border-b border-r rounded-br ${isActive ? "border-amber-500/50" : isComplete ? "border-emerald-500/50" : "border-zinc-700"
        }`} />
    </motion.div>
  );
};

// Central Processing Unit Visualizer
const CPUVisualizer = ({ progress, isActive }: { progress: number; isActive: boolean }) => {
  return (
    <div className="relative w-48 h-48 flex items-center justify-center">
      {/* Outer rings */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-zinc-800"
          style={{
            width: `${100 + i * 40}%`,
            height: `${100 + i * 40}%`,
          }}
          animate={{
            rotate: 360,
            borderColor: isActive ? ["#3f3f46", "#fbbf24", "#3f3f46"] : "#3f3f46",
          }}
          transition={{
            rotate: { duration: 20 + i * 5, repeat: Infinity, ease: "linear" },
            borderColor: { duration: 2, repeat: Infinity },
          }}
        >
          {/* Segments */}
          {[...Array(8)].map((_, j) => (
            <div
              key={j}
              className="absolute w-1 h-3 bg-zinc-700 rounded-full"
              style={{
                top: "-6px",
                left: "50%",
                transform: `rotate(${j * 45}deg) translateY(0)`,
                transformOrigin: "50% 100px",
              }}
            />
          ))}
        </motion.div>
      ))}

      {/* Core */}
      <motion.div
        className="relative w-32 h-32 rounded-full bg-gradient-to-br from-zinc-900 to-black border-2 border-zinc-700 flex items-center justify-center overflow-hidden"
        animate={{
          boxShadow: isActive
            ? ["0 0 20px rgba(251,191,36,0.3)", "0 0 40px rgba(251,191,36,0.6)", "0 0 20px rgba(251,191,36,0.3)"]
            : "none",
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/20 via-transparent to-transparent" />

        {/* Progress ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <motion.circle
            cx="64"
            cy="64"
            r="56"
            fill="none"
            stroke="url(#coreGradient)"
            strokeWidth="4"
            strokeDasharray={351}
            strokeDashoffset={351 - (progress / 100) * 351}
            strokeLinecap="round"
            initial={{ strokeDashoffset: 351 }}
            animate={{ strokeDashoffset: 351 - (progress / 100) * 351 }}
            transition={{ duration: 0.5 }}
          />
          <defs>
            <linearGradient id="coreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>
        </svg>

        <div className="relative z-10 text-center">
          <motion.div
            className="text-3xl font-bold text-amber-400 font-mono"
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {Math.round(progress)}%
          </motion.div>
          <div className="text-xs text-zinc-500 mt-1">PROCESSING</div>
        </div>

        {/* Inner glow */}
        {isActive && (
          <motion.div
            className="absolute inset-0 rounded-full bg-amber-500/20 blur-xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.div>

      {/* Orbiting particles */}
      {isActive && [...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-amber-400"
          style={{
            filter: "drop-shadow(0 0 6px rgba(251,191,36,0.8))",
          }}
          animate={{
            rotate: 360,
            scale: [1, 1.5, 1],
          }}
          transition={{
            rotate: { duration: 3 + i, repeat: Infinity, ease: "linear" },
            scale: { duration: 1, repeat: Infinity },
          }}
        >
          <div className="w-full h-full rounded-full bg-amber-300" />
        </motion.div>
      ))}
    </div>
  );
};

// System Log Terminal
const SystemTerminal = ({ logs }: { logs: string[] }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="relative bg-black/80 rounded-lg border border-zinc-800 p-4 font-mono text-xs h-48 overflow-hidden">
      <MatrixRain />

      <div className="absolute top-2 left-4 flex items-center gap-2 text-zinc-600 text-[10px] uppercase tracking-wider">
        <div className="w-2 h-2 rounded-full bg-red-500/50" />
        <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
        <div className="w-2 h-2 rounded-full bg-green-500/50" />
        <span className="ml-2">system_log.exe</span>
      </div>

      <div ref={scrollRef} className="mt-6 space-y-1 relative z-10 h-full overflow-y-auto custom-scrollbar">
        <AnimatePresence>
          {logs.map((log, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <span className="text-zinc-600">[{new Date().toLocaleTimeString()}]</span>
              <span className={i === logs.length - 1 ? "text-amber-400" : "text-zinc-400"}>
                {i === logs.length - 1 && <span className="mr-2">›</span>}
                {log}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
        <motion.div
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="w-2 h-4 bg-amber-400"
        />
      </div>

      {/* Scan line */}
      <motion.div
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"
        animate={{ top: ["0%", "100%"] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};

// Success Completion
const CompletionSequence = ({ onComplete }: { onComplete: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-12 relative"
    >
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-transparent to-amber-500/10 rounded-2xl blur-2xl" />

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="relative w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-2xl shadow-amber-500/40"
      >
        <svg className="w-12 h-12 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>

        {/* Ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-amber-400"
          animate={{ scale: [1, 1.3], opacity: [1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.div>

      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-3xl font-bold text-white mb-2"
      >
        <GlitchText text="SYSTEM READY" />
      </motion.h2>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-zinc-400 mb-8 max-w-md mx-auto"
      >
        All systems operational. Your digital architecture has been synthesized and is ready for deployment.
      </motion.p>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-3 gap-4 mb-8"
      >
        {[
          { label: "Efficiency", value: "99.9%" },
          { label: "Security", value: "AES-256" },
          { label: "Latency", value: "12ms" },
        ].map((stat, i) => (
          <div key={i} className="p-4 rounded-lg bg-zinc-950/50 border border-zinc-800">
            <div className="text-lg font-bold text-amber-400 font-mono">{stat.value}</div>
            <div className="text-xs text-zinc-500 uppercase tracking-wider">{stat.label}</div>
          </div>
        ))}
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex gap-4 justify-center"
      >
        <button
          onClick={onComplete}
          className="px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-amber-500/30 transition-all duration-300"
        >
          Initialize Preview
        </button>
        <button className="px-8 py-3 border border-zinc-700 text-zinc-300 rounded-lg hover:border-amber-500/50 hover:text-amber-400 transition-all duration-300">
          Export Build
        </button>
      </motion.div>
    </motion.div>
  );
};

// ============================================================================
// 🎯 MAIN COMPONENT
// ============================================================================

export default function LegendaryLoader({
  userPrompt = "Build me a luxury e-commerce hero with dark theme and gold accents"
}: {
  userPrompt?: string;
}) {
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(-1);
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [showCompletion, setShowCompletion] = useState(false);

  // Main generation sequence
  useEffect(() => {
    if (isComplete) return;

    let phaseIdx = 0;

    const processPhase = () => {
      if (phaseIdx >= GENERATION_PHASES.length) {
        setIsComplete(true);
        setOverallProgress(100);
        setShowCompletion(true);
        return;
      }

      const phase = GENERATION_PHASES[phaseIdx];
      setCurrentPhaseIndex(phaseIdx);

      // Add log
      setLogs(prev => [...prev.slice(-5), SYSTEM_LOGS[phaseIdx]]);

      const startTime = Date.now();
      const duration = phase.duration;

      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min((elapsed / duration) * 100, 100);

        setPhaseProgress(progress);
        setOverallProgress(((phaseIdx) + progress / 100) / GENERATION_PHASES.length * 100);

        if (progress >= 100) {
          clearInterval(interval);
          phaseIdx++;
          setTimeout(processPhase, 400);
        }
      }, 30);
    };

    const startTimer = setTimeout(processPhase, 1000);
    return () => clearTimeout(startTimer);
  }, [isComplete]);

  return (
    <div className="min-h-screen bg-black text-zinc-100 p-6 relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(251,191,36,0.05),transparent_50%)]" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl" />
      </div>

      {/* Grid overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(251,191,36,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(251,191,36,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-12 pb-6 border-b border-zinc-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">
                  clyraweb
                </span>
                <span className="text-zinc-600 font-light">.CORE</span>
              </h1>
              <p className="text-xs text-zinc-500 font-mono">v2.0.47 // BUILD_SYSTEM</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-4xl font-bold font-mono text-amber-400">
                {Math.round(overallProgress)}%
              </div>
              <div className="text-xs text-zinc-500 uppercase tracking-wider">System Integrity</div>
            </div>
            <div className="w-32 h-2 bg-zinc-900 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-amber-400 to-amber-600"
                initial={{ width: 0 }}
                animate={{ width: `${overallProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </header>

        {/* Command Display */}
        <div className="mb-8 p-6 rounded-lg bg-zinc-950/50 border border-zinc-800 backdrop-blur-sm">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded bg-zinc-900 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <div>
              <div className="text-xs text-zinc-500 font-mono mb-1 uppercase tracking-wider">User Command</div>
              <p className="text-zinc-300 font-medium">{userPrompt}</p>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Left: Phases */}
          <div className="lg:col-span-2 space-y-3">
            <AnimatePresence>
              {GENERATION_PHASES.map((phase, index) => (
                <HolographicCard
                  key={phase.id}
                  phase={phase}
                  isActive={index === currentPhaseIndex && !isComplete}
                  isComplete={index < currentPhaseIndex || isComplete}
                  progress={index === currentPhaseIndex ? phaseProgress : index < currentPhaseIndex ? 100 : 0}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Right: Visualizers */}
          <div className="space-y-6">
            {/* CPU Visualizer */}
            <div className="p-6 rounded-lg bg-zinc-950/50 border border-zinc-800 backdrop-blur-sm">
              <div className="text-center mb-4">
                <div className="text-xs text-zinc-500 font-mono uppercase tracking-wider mb-1">Processing Unit</div>
                <div className="text-sm text-zinc-400">Quantum Core Alpha</div>
              </div>
              <CPUVisualizer progress={overallProgress} isActive={!isComplete} />
              <div className="mt-4 grid grid-cols-2 gap-3 text-center">
                <div>
                  <div className="text-lg font-bold text-amber-400 font-mono">
                    {Math.round(overallProgress * 2.4)}<span className="text-xs text-zinc-600">TF</span>
                  </div>
                  <div className="text-xs text-zinc-600">Compute</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-amber-400 font-mono">
                    {Math.round(overallProgress * 1.8)}<span className="text-xs text-zinc-600">GB</span>
                  </div>
                  <div className="text-xs text-zinc-600">Memory</div>
                </div>
              </div>
            </div>

            {/* Terminal */}
            <SystemTerminal logs={logs} />

            {/* Completion */}
            <AnimatePresence>
              {showCompletion && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 rounded-lg bg-zinc-950/50 border border-amber-500/30 backdrop-blur-sm"
                >
                  <CompletionSequence onComplete={() => console.log("Launch preview")} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <footer className="flex items-center justify-between pt-6 border-t border-zinc-800 text-xs text-zinc-500 font-mono">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isComplete ? "bg-emerald-400" : "bg-amber-400 animate-pulse"}`} />
              <span>{isComplete ? "SYSTEM NOMINAL" : "PROCESSING..."}</span>
            </div>
            <span className="text-zinc-700">|</span>
            <span>UPTIME: {Math.floor(overallProgress * 0.3)}s</span>
          </div>
          <div className="flex items-center gap-4">
            <span>SECURE CONNECTION</span>
            <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </footer>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(39, 39, 42, 0.5);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(251, 191, 36, 0.3);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(251, 191, 36, 0.5);
        }
      `}</style>
    </div>
  );
}
// "use client";

// import { useEffect, useState } from "react";
// import Skeleton from "react-loading-skeleton";
// import "react-loading-skeleton/dist/skeleton.css";

// const facts = [
//   "⚡ AI is optimizing your page speed",
//   "🎨 Choosing the best color hierarchy",
//   "📱 Making your design mobile responsive",
//   "🚀 Improving SEO metadata",
//   "🧠 Selecting the best conversion layout",
//   "✨ Enhancing typography readability",
// ];

// export default function LoaderSkeleton() {
//   const [progress, setProgress] = useState(12);
//   const [factIndex, setFactIndex] = useState(0);

//   useEffect(() => {
//     const progressInterval = setInterval(() => {
//       setProgress((prev) => (prev < 95 ? prev + 11 : prev));
//     }, 700);

//     const factInterval = setInterval(() => {
//       setFactIndex((prev) => (prev + 1) % facts.length);
//     }, 2000);

//     return () => {
//       clearInterval(progressInterval);
//       clearInterval(factInterval);
//     };
//   }, []);

//   return (
//     <div className="h-full w-full p-6 space-y-6 rounded-2xl bg-white dark:bg-zinc-950">
//       <div className="space-y-2">
//         <div className="flex items-center justify-between text-sm text-zinc-500">
//           <span>AI is building your website...</span>
//           <span>{progress}%</span>
//         </div>

//         <div className="h-3 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
//           <div
//             className="h-full rounded-full bg-gradient-to-r from-violet-600 to-purple-600 transition-all duration-700"
//             style={{ width: `${progress}%` }}
//           />
//         </div>
//       </div>

//       <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
//         {facts[factIndex]}
//       </div>

//       <div className="space-y-4">
//         <Skeleton height={56} borderRadius={16} />
//         <Skeleton height={320} borderRadius={24} />
//         <Skeleton count={5} height={20} />
//       </div>
//     </div>
//   );
// }

