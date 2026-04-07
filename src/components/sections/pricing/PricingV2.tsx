"use client";

import { useState } from "react";

type Plan = {
  name: string;
  monthlyPrice: string;
  yearlyPrice: string;
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

export default function PricingV2({
  heading = "Flexible pricing for every stage",
  subheading = "Switch between monthly and yearly billing to find the best value.",
  plans = [
    {
      name: "Starter",
      monthlyPrice: "$19",
      yearlyPrice: "$190",
      description: "Perfect for solo creators and small business sites.",
      features: [
        "1 project",
        "AI content generation",
        "Basic blocks",
        "Email support",
      ],
      buttonText: "Choose Starter",
    },
    {
      name: "Growth",
      monthlyPrice: "$49",
      yearlyPrice: "$490",
      description: "Ideal for agencies and fast-growing startups.",
      features: [
        "10 projects",
        "Multi-page AI planner",
        "Premium sections",
        "Priority support",
      ],
      buttonText: "Choose Growth",
      popular: true,
    },
    {
      name: "Scale",
      monthlyPrice: "$99",
      yearlyPrice: "$990",
      description: "Best for teams, enterprises, and large workflows.",
      features: [
        "Unlimited projects",
        "Custom AI blocks",
        "Team collaboration",
        "Dedicated manager",
      ],
      buttonText: "Choose Scale",
    },
  ],
}: Props) {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  return (
    <section className="py-20 px-6 md:px-16 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            {heading}
          </h2>
          <p className="text-gray-600 mt-4 text-lg max-w-2xl mx-auto">
            {subheading}
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-14">
          <div className="bg-white border border-gray-200 rounded-full p-1 flex">
            <button
              onClick={() => setBilling("monthly")}
              className={`px-6 py-2 rounded-full font-medium transition ${
                billing === "monthly"
                  ? "bg-black text-white"
                  : "text-gray-600"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling("yearly")}
              className={`px-6 py-2 rounded-full font-medium transition ${
                billing === "yearly"
                  ? "bg-black text-white"
                  : "text-gray-600"
              }`}
            >
              Yearly
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8">
          {plans.map((plan, index) => {
            const price =
              billing === "monthly"
                ? plan.monthlyPrice
                : plan.yearlyPrice;

            return (
              <div
                key={index}
                className={`rounded-3xl border p-8 transition-all duration-300 hover:shadow-xl ${
                  plan.popular
                    ? "border-black bg-white scale-105"
                    : "border-gray-200 bg-white"
                }`}
              >
                {plan.popular && (
                  <span className="inline-block mb-4 px-3 py-1 text-sm font-semibold bg-black text-white rounded-full">
                    Best Value
                  </span>
                )}

                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <p className="text-gray-600 mt-2">{plan.description}</p>

                <div className="mt-6 mb-6">
                  <span className="text-5xl font-bold">{price}</span>
                  <span className="text-gray-500 ml-2">
                    /{billing === "monthly" ? "month" : "year"}
                  </span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex gap-2 text-gray-700">
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
                  {plan.buttonText}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}