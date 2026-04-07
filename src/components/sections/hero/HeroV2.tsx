"use client";

type HeroV2Props = {
  badge?: string;
  title?: string;
  subtitle?: string;
  primaryButton?: string;
  secondaryButton?: string;
  backgroundImage?: string;
};

export default function HeroV2({
  badge,
  title,
  subtitle,
  primaryButton,
  secondaryButton,
  backgroundImage,
}: HeroV2Props) {
  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        {backgroundImage ? (
          <img
            src={backgroundImage}
            alt={title || "Hero background"}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800" />
        )}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative max-w-5xl mx-auto px-6 lg:px-12 py-32 text-center text-white">
        {badge && (
          <p className="inline-block px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm font-medium mb-6">
            {badge}
          </p>
        )}

        {title && (
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
            {title}
          </h1>
        )}

        {subtitle && (
          <p className="mt-6 text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-8">
            {subtitle}
          </p>
        )}

        {(primaryButton || secondaryButton) && (
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            {primaryButton && (
              <button className="px-7 py-3 rounded-xl bg-white text-black font-semibold hover:opacity-90 transition">
                {primaryButton}
              </button>
            )}

            {secondaryButton && (
              <button className="px-7 py-3 rounded-xl border border-white/30 text-white font-semibold hover:bg-white/10 transition">
                {secondaryButton}
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}