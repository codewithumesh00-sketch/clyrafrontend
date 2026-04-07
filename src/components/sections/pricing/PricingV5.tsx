"use client";

type Tier = {
  title: string;
  price: string;
  description: string;
  features: string[];
  cta?: string;
};

type Props = {
  heading?: string;
  subheading?: string;
  tiers?: Tier[];
};

export default function PricingV5({
  heading = "Grow with the right plan at every stage",
  subheading = "Move from idea to scale with progressive plans built for every growth milestone.",
  tiers = [
    {
      title: "Launch",
      price: "$19",
      description: "Perfect for getting your first AI-powered website live.",
      features: [
        "1 project",
        "Basic AI sections",
        "Landing page generation",
        "Email support",
      ],
      cta: "Start Launch",
    },
    {
      title: "Scale",
      price: "$59",
      description: "Best for startups growing traffic and customers.",
      features: [
        "10 projects",
        "Multi-page websites",
        "Premium templates",
        "Priority support",
      ],
      cta: "Choose Scale",
    },
    {
      title: "Dominate",
      price: "$129",
      description: "Enterprise-level growth for teams and agencies.",
      features: [
        "Unlimited projects",
        "Custom AI workflows",
        "Team collaboration",
        "Dedicated manager",
      ],
      cta: "Go Enterprise",
    },
  ],
}: Props) {
  return (
    <section className="py-20 px-6 md:px-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            {heading}
          </h2>
          <p className="text-gray-600 mt-4 text-lg max-w-2xl mx-auto">
            {subheading}
          </p>
        </div>

        {/* Growth Journey */}
        <div className="relative">
          {/* Desktop progress line */}
          <div className="hidden lg:block absolute top-10 left-0 right-0 h-[2px] bg-gray-200" />

          <div className="grid lg:grid-cols-3 gap-8 relative">
            {tiers.map((tier, index) => (
              <div
                key={index}
                className="relative bg-white rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 p-8"
              >
                {/* Step indicator */}
                <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-bold text-lg mb-6">
                  {index + 1}
                </div>

                <h3 className="text-2xl font-bold">{tier.title}</h3>
                <p className="text-gray-600 mt-2">{tier.description}</p>

                <div className="mt-6 mb-6">
                  <span className="text-5xl font-bold">{tier.price}</span>
                  <span className="text-gray-500 ml-2">/month</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex gap-2 text-gray-700">
                      <span>✔</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button className="w-full py-3 rounded-xl font-semibold bg-black text-white hover:opacity-90 transition">
                  {tier.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}