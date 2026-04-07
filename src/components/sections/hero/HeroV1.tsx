"use client";

type HeroV1Props = {
  badge?: string;
  title?: string;
  subtitle?: string;
  primaryButton?: string;
  secondaryButton?: string;
  image?: string;
  stats?: {
    value: string;
    label: string;
  }[];
};

export default function HeroV1({
  badge,
  title,
  subtitle,
  primaryButton,
  secondaryButton,
  image,
  stats = [],
}: HeroV1Props) {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-24 grid lg:grid-cols-2 gap-14 items-center">
        {/* Left Content */}
        <div>
          {badge && (
            <p className="text-sm font-semibold text-blue-600 mb-4">
              {badge}
            </p>
          )}

          {title && (
            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight leading-tight text-gray-900">
              {title}
            </h1>
          )}

          {subtitle && (
            <p className="mt-6 text-lg text-gray-600 leading-8 max-w-xl">
              {subtitle}
            </p>
          )}

          {(primaryButton || secondaryButton) && (
            <div className="mt-8 flex flex-wrap gap-4">
              {primaryButton && (
                <button className="px-6 py-3 rounded-xl bg-black text-white font-medium hover:opacity-90 transition">
                  {primaryButton}
                </button>
              )}

              {secondaryButton && (
                <button className="px-6 py-3 rounded-xl border border-gray-300 font-medium hover:bg-gray-50 transition">
                  {secondaryButton}
                </button>
              )}
            </div>
          )}

          {stats.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-8">
              {stats.map((item, index) => (
                <div key={index}>
                  <p className="text-2xl font-bold">{item.value}</p>
                  <p className="text-sm text-gray-500">{item.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Image */}
        {image && (
          <div className="relative">
            <img
              src={image}
              alt={title || "Hero image"}
              className="w-full rounded-3xl shadow-2xl border"
            />
          </div>
        )}
      </div>
    </section>
  );
}