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

export default function FaqV4({
  heading = "Still have questions?",
  subheading = "Everything about the platform, workflows, and generation pipeline explained clearly.",
  faqs = [
    {
      question: "Is this suitable for SaaS and AI startups?",
      answer:
        "Yes, the layouts, feature blocks, FAQs, and CTA sections are optimized for modern product websites.",
    },
    {
      question: "Can it generate websites from one-line prompts?",
      answer:
        "Absolutely. Even a simple prompt like 'travel agency website' can generate a complete structure.",
    },
    {
      question: "Does it support reusable section libraries?",
      answer:
        "Yes, every TSX section becomes part of a reusable block registry.",
    },
    {
      question: "Can I connect backend AI later?",
      answer:
        "Yes, Gemini or any LLM can dynamically inject FAQs, answers, and page-specific content.",
    },
  ],
}: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-20 px-6 md:px-16 bg-black text-white">
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-14">
          <p className="text-sm uppercase tracking-[0.25em] text-gray-400 mb-3">
            FAQ
          </p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            {heading}
          </h2>
          <p className="text-gray-400 mt-4 text-lg max-w-2xl mx-auto">
            {subheading}
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-2xl border border-gray-800 bg-gray-950 overflow-hidden"
            >
              <button
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
                className="w-full flex items-center justify-between px-6 py-5 text-left"
              >
                <span className="text-lg font-semibold">
                  {faq.question}
                </span>
                <span className="text-2xl text-gray-400">
                  {openIndex === index ? "−" : "+"}
                </span>
              </button>

              {openIndex === index && (
                <div className="px-6 pb-5 text-gray-400 leading-7">
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