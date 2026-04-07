"use client";

import { useState } from "react";

type FAQ = {
  question: string;
  answer: string;
};

type Props = {
  heading?: string;
  subheading?: string;
  faqs?: FAQ[];
};

export default function FaqV3({
  heading = "Frequently asked questions",
  subheading = "Get quick clarity on how everything works before you launch.",
  faqs = [
    {
      question: "Can the AI generate industry-specific sections?",
      answer:
        "Yes, the intelligence layer detects the business type and generates matching sections automatically.",
    },
    {
      question: "Does it support multi-page generation?",
      answer:
        "Yes, it can create home, about, services, contact, pricing, and blog pages.",
    },
    {
      question: "Can I export generated websites?",
      answer:
        "Absolutely. The generated TSX blocks can be exported as reusable project files.",
    },
    {
      question: "Will it work for local businesses?",
      answer:
        "Yes, it works perfectly for furniture stores, bakeries, agencies, salons, and more.",
    },
  ],
}: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-20 px-6 md:px-16 bg-white">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-start">
        {/* Left Content */}
        <div className="sticky top-10">
          <p className="text-sm uppercase tracking-[0.2em] text-gray-500 mb-3">
            FAQ
          </p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
            {heading}
          </h2>
          <p className="text-gray-600 mt-5 text-lg max-w-lg leading-8">
            {subheading}
          </p>
        </div>

        {/* Right Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-2xl overflow-hidden"
            >
              <button
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
                className="w-full px-6 py-5 flex items-center justify-between text-left bg-gray-50"
              >
                <span className="text-lg font-semibold">
                  {faq.question}
                </span>
                <span className="text-2xl">
                  {openIndex === index ? "−" : "+"}
                </span>
              </button>

              {openIndex === index && (
                <div className="px-6 pb-5 pt-2 text-gray-600 leading-7 bg-white">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}