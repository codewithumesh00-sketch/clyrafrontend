"use client";

type Plan = {
  name: string;
  price: string;
  description: string;
  features: string[];
  buttonText?: string;
  popular?: boolean;
};

type Props = {
  heading?: string;
  subheading?: string;
  plans?: Plan[];
};

export default function PricingV1({
  heading = "Simple, transparent pricing",
  subheading = "Choose the perfect plan that matches your business growth.",
  plans = [
    {
      name: "Starter",
      price: "$19",
      description: "Perfect for small businesses and personal projects.",
      features: [
        "1 website project",
        "AI content generation",
        "Basic templates",
        "Email support",
      ],
      buttonText: "Get Started",
    },
    {
      name: "Professional",
      price: "$49",
      description: "Best for startups and fast-growing businesses.",
      features: [
        "10 website projects",
        "Premium AI layouts",
        "Multi-page generation",
        "Priority support",
      ],
      buttonText: "Start Free Trial",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "$99",
      description: "Advanced tools for teams and enterprise workflows.",
      features: [
        "Unlimited projects",
        "Custom AI blocks",
        "Team collaboration",
        "Dedicated support",
      ],
      buttonText: "Contact Sales",
    },
  ],
}: Props) {
  return (
    <section className="py-20 px-6 md:px-16 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            {heading}
          </h2>
          <p className="text-gray-600 mt-4 text-lg max-w-2xl mx-auto">
            {subheading}
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`rounded-3xl border p-8 shadow-sm transition-all duration-300 hover:shadow-xl ${
                plan.popular
                  ? "border-black scale-105 bg-gray-50"
                  : "border-gray-200 bg-white"
              }`}
            >
              {plan.popular && (
                <span className="inline-block mb-4 px-3 py-1 text-sm font-semibold bg-black text-white rounded-full">
                  Most Popular
                </span>
              )}

              <h3 className="text-2xl font-bold">{plan.name}</h3>
              <p className="text-gray-600 mt-2">{plan.description}</p>

              <div className="mt-6 mb-6">
                <span className="text-5xl font-bold">{plan.price}</span>
                <span className="text-gray-500 ml-2">/month</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-700">
                    <span>✔</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 rounded-xl font-semibold transition ${
                  plan.popular
                    ? "bg-black text-white hover:opacity-90"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {plan.buttonText || "Choose Plan"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}