import { useEffect, useState } from 'react';

export default function HeroV2({
  badge = "Now with AI-powered layouts",
  title = "Build websites in seconds",
  subtitle = "Clyra creates beautiful, conversion-optimized landing pages without writing a single line of code.",
  primaryCta = "Start Free",
  secondaryCta = "View Demo",
  className = "",
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className={`relative overflow-hidden py-20 sm:py-28 lg:py-32 ${className}`}>
      {/* Background Depth */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/50 via-white to-white dark:from-indigo-950/40 dark:via-slate-950 dark:to-slate-950" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-gradient-to-r from-purple-400/20 via-blue-400/20 to-cyan-400/20 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-4xl px-6 text-center">
        {/* Badge */}
        {badge && (
          <div className={`mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200/60 bg-indigo-50/80 px-4 py-1.5 text-sm font-medium text-indigo-700 backdrop-blur-sm transition-all duration-700 dark:border-indigo-800/60 dark:bg-indigo-950/60 dark:text-indigo-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500"></span>
            </span>
            {badge}
          </div>
        )}

        {/* Title */}
        <h1 className={`text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl lg:text-7xl transition-all duration-700 delay-100 dark:text-white ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {title}
        </h1>

        {/* Subtitle */}
        <p className={`mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 sm:text-xl transition-all duration-700 delay-200 dark:text-slate-400 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {subtitle}
        </p>

        {/* CTAs */}
        <div className={`mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <button className="group relative inline-flex h-12 items-center justify-center rounded-xl bg-slate-900 px-8 text-base font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:bg-slate-800 hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 dark:focus:ring-offset-slate-900">
            {primaryCta}
            <svg className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>

          {secondaryCta && (
            <button className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-200 bg-white/60 px-8 text-base font-semibold text-slate-700 backdrop-blur-sm transition-all duration-300 hover:bg-slate-100 hover:border-slate-300 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:bg-slate-800 dark:focus:ring-offset-slate-900">
              {secondaryCta}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}