"use client";

type Plan = {
  name: string;
  price: string;
  description: string;
  features: string[];
  cta?: string;
  highlighted?: boolean;
};

type Props = {
  heading?: string;
  subheading?: string;
  plans?: Plan[];
};

export default function PricingV4({
  heading = "Choose the plan that scales with you",
  subheading = "Premium plans designed for startups, teams, and enterprise-grade growth.",
  plans = [
    {
      name: "Starter",
      price: "$29",
      description: "Best for creators and small AI projects.",
      features: [
        "3 projects",
        "AI section generation",
        "Basic analytics",
        "Community support",
      ],
      cta: "Start Starter",
    },
    {
      name: "Pro",
      price: "$79",
      description: "Best for scaling teams and agencies.",
      features: [
        "Unlimited projects",
        "Multi-page AI planner",
        "Advanced analytics",
        "Priority support",
      ],
      cta: "Go Pro",
      highlighted: true,
    },
    {
      name: "Enterprise",
      price: "$149",
      description: "Custom workflows for enterprise teams.",
      features: [
        "Unlimited everything",
        "Custom AI models",
        "Team workspace",
        "Dedicated success manager",
      ],
      cta: "Talk to Sales",
    },
  ],
}: Props) {
  return (
    <section className="py-20 px-6 md:px-16 bg-black text-white">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-[0.25em] text-gray-400 mb-3">
            Pricing
          </p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            {heading}
          </h2>
          <p className="text-gray-400 mt-4 text-lg max-w-2xl mx-auto">
            {subheading}
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`rounded-3xl border p-8 transition-all duration-300 hover:scale-105 ${
                plan.highlighted
                  ? "border-white bg-white text-black shadow-2xl"
                  : "border-gray-800 bg-gray-950"
              }`}
            >
              {plan.highlighted && (
                <span className="inline-block mb-4 px-3 py-1 text-sm font-semibold rounded-full bg-black text-white">
                  Most Popular
                </span>
              )}

              <h3 className="text-2xl font-bold">{plan.name}</h3>
              <p
                className={`mt-2 ${
                  plan.highlighted ? "text-gray-600" : "text-gray-400"
                }`}
              >
                {plan.description}
              </p>

              <div className="mt-6 mb-6">
                <span className="text-5xl font-bold">{plan.price}</span>
                <span
                  className={`ml-2 ${
                    plan.highlighted ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  /month
                </span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex gap-2">
                    <span>✔</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 rounded-xl font-semibold transition ${
                  plan.highlighted
                    ? "bg-black text-white hover:opacity-90"
                    : "bg-white text-black hover:bg-gray-200"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}