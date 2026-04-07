"use client";

type HeroV3Props = {
  badge?: string;
  title?: string;
  subtitle?: string;
  primaryButton?: string;
  secondaryButton?: string;
  image?: string;
  floatingCards?: {
    title?: string;
    value?: string;
  }[];
};

export default function HeroV3({
  badge,
  title,
  subtitle,
  primaryButton,
  secondaryButton,
  image,
  floatingCards = [],
}: HeroV3Props) {
  return (
    <section className="bg-slate-950 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-24 grid lg:grid-cols-2 gap-14 items-center">
        {/* Left */}
        <div>
          {badge && (
            <p className="inline-block px-4 py-2 rounded-full bg-white/10 border border-white/10 text-sm mb-6">
              {badge}
            </p>
          )}

          {title && (
            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
              {title}
            </h1>
          )}

          {subtitle && (
            <p className="mt-6 text-lg text-slate-300 leading-8 max-w-xl">
              {subtitle}
            </p>
          )}

          {(primaryButton || secondaryButton) && (
            <div className="mt-8 flex flex-wrap gap-4">
              {primaryButton && (
                <button className="px-6 py-3 rounded-xl bg-white text-black font-semibold hover:opacity-90 transition">
                  {primaryButton}
                </button>
              )}

              {secondaryButton && (
                <button className="px-6 py-3 rounded-xl border border-white/20 hover:bg-white/10 transition">
                  {secondaryButton}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right */}
        <div className="relative">
          {image && (
            <img
              src={image}
              alt={title || "Hero preview"}
              className="w-full rounded-3xl border border-white/10 shadow-2xl"
            />
          )}

          {floatingCards.length > 0 && (
            <div className="grid grid-cols-2 gap-4 mt-6">
              {floatingCards.map((card, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-5"
                >
                  {card.value && (
                    <p className="text-2xl font-bold">{card.value}</p>
                  )}
                  {card.title && (
                    <p className="text-sm text-slate-400 mt-1">
                      {card.title}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}