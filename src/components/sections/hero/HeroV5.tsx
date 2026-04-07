"use client";

type HeroV5Props = {
  badge?: string;
  title?: string;
  subtitle?: string;
  primaryButton?: string;
  secondaryButton?: string;
  trustItems?: string[];
};

export default function HeroV5({
  badge,
  title,
  subtitle,
  primaryButton,
  secondaryButton,
  trustItems = [],
}: HeroV5Props) {
  return (
    <section className="bg-white">
      <div className="max-w-5xl mx-auto px-6 lg:px-12 py-28 text-center">
        {/* Badge */}
        {badge && (
          <p className="inline-flex items-center rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600">
            {badge}
          </p>
        )}

        {/* Title */}
        {title && (
          <h1 className="mt-6 text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight text-slate-900">
            {title}
          </h1>
        )}

        {/* Subtitle */}
        {subtitle && (
          <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl leading-8 text-slate-600">
            {subtitle}
          </p>
        )}

        {/* CTA */}
        {(primaryButton || secondaryButton) && (
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            {primaryButton && (
              <button className="px-7 py-3 rounded-xl bg-black text-white font-medium hover:opacity-90 transition">
                {primaryButton}
              </button>
            )}

            {secondaryButton && (
              <button className="px-7 py-3 rounded-xl border border-slate-300 font-medium hover:bg-slate-50 transition">
                {secondaryButton}
              </button>
            )}
          </div>
        )}

        {/* Trust Chips */}
        {trustItems.length > 0 && (
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            {trustItems.map((item, index) => (
              <span
                key={index}
                className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-600"
              >
                {item}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}