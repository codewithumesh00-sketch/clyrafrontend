"use client";

type Feature = {
  title: string;
  description: string;
  icon?: string;
};

type Props = {
  heading?: string;
  subheading?: string;
  features?: Feature[];
  highlightTitle?: string;
  highlightDescription?: string;
};

export default function FeatureV4({
  heading = "Why people choose our platform",
  subheading = "Built for speed, trust, and beautiful user experiences powered by AI.",
  highlightTitle = "Built for modern businesses",
  highlightDescription = "Launch faster with smart layouts, AI-generated sections, and high-converting design blocks that adapt to every industry.",
  features = [
    {
      title: "AI Generated Content",
      description:
        "Every section heading, paragraph, and CTA is generated according to user intent.",
      icon: "✨",
    },
    {
      title: "Lightning Fast Rendering",
      description:
        "Schema-based rendering makes pages load instantly with dynamic TSX blocks.",
      icon: "⚡",
    },
    {
      title: "Industry Intelligence",
      description:
        "Blocks automatically adapt for SaaS, travel, furniture, agency, and more.",
      icon: "🧠",
    },
    {
      title: "Multi Page Ready",
      description:
        "Generate homepage, about, services, contact, and landing pages in seconds.",
      icon: "📄",
    },
  ],
}: Props) {
  return (
    <section className="py-20 px-6 md:px-16 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Top Heading */}
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            {heading}
          </h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-lg">
            {subheading}
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Feature Cards */}
          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 bg-gray-50"
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-7">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Right Highlight Card */}
          <div className="bg-black text-white rounded-3xl p-8 shadow-2xl sticky top-10">
            <p className="text-sm uppercase tracking-[0.2em] text-gray-400 mb-3">
              Highlight
            </p>
            <h3 className="text-3xl font-bold leading-tight mb-4">
              {highlightTitle}
            </h3>
            <p className="text-gray-300 leading-7">
              {highlightDescription}
            </p>

            <button className="mt-8 px-6 py-3 bg-white text-black rounded-xl font-semibold hover:scale-105 transition">
              Explore More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}