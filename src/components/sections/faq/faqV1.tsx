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

export default function FaqV1({
  heading = "Frequently Asked Questions",
  subheading = "Everything you need to know before getting started.",
  faqs = [
    {
      question: "How does the AI generate my website?",
      answer:
        "The AI analyzes your prompt, detects the business type, and automatically generates the best matching sections, layouts, and content.",
    },
    {
      question: "Can I edit the generated content later?",
      answer:
        "Yes, every section is fully editable, reusable, and customizable after generation.",
    },
    {
      question: "Does it support multiple pages?",
      answer:
        "Yes, it can generate home, about, services, contact, pricing, and many other pages automatically.",
    },
    {
      question: "Will content change according to industry?",
      answer:
        "Absolutely. Travel, SaaS, furniture, healthcare, agencies, and portfolios all get unique AI-generated content.",
    },
  ],
}: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 px-6 md:px-16 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            {heading}
          </h2>
          <p className="text-gray-600 mt-4 text-lg max-w-2xl mx-auto">
            {subheading}
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-2xl overflow-hidden bg-gray-50"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between px-6 py-5 text-left"
              >
                <span className="text-lg font-semibold">
                  {faq.question}
                </span>
                <span className="text-2xl font-light">
                  {openIndex === index ? "−" : "+"}
                </span>
              </button>

              {openIndex === index && (
                <div className="px-6 pb-5 text-gray-600 leading-7">
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