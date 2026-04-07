"use client";

type FeatureCard = {
  title?: string;
  description?: string;
};

type FeaturesV3Props = {
  badge?: string;
  title?: string;
  subtitle?: string;
  cards?: FeatureCard[];
};

export default function FeaturesV3({
  badge,
  title,
  subtitle,
  cards = [],
}: FeaturesV3Props) {
  return (
    <section className="bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-24">
        {/* Heading */}
        <div className="max-w-3xl">
          {badge && (
            <p className="text-sm font-semibold text-slate-400 mb-4">
              {badge}
            </p>
          )}

          {title && (
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">
              {title}
            </h2>
          )}

          {subtitle && (
            <p className="mt-5 text-lg text-slate-300 leading-8">
              {subtitle}
            </p>
          )}
        </div>

        {/* Cards */}
        {cards.length > 0 && (
          <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card, index) => (
              <div
                key={index}
                className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-8 hover:bg-white/10 transition"
              >
                {card.title && (
                  <h3 className="text-xl font-semibold">{card.title}</h3>
                )}

                {card.description && (
                  <p className="mt-4 text-slate-300 leading-7">
                    {card.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}