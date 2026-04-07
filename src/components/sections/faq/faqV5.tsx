"use client";

type FAQStep = {
  question: string;
  answer: string;
};

type Props = {
  heading?: string;
  subheading?: string;
  faqs?: FAQStep[];
};

export default function FaqV5({
  heading = "How everything works",
  subheading = "A step-by-step FAQ experience that guides users through your workflow clearly.",
  faqs = [
    {
      question: "How do users start?",
      answer:
        "Users simply enter their prompt, business type, or service requirement to begin.",
    },
    {
      question: "What happens after the prompt?",
      answer:
        "The AI planner selects the best pages, sections, and layouts based on intent.",
    },
    {
      question: "How is content generated?",
      answer:
        "Gemini dynamically writes headings, FAQs, features, CTA, and supporting content.",
    },
    {
      question: "How is the website rendered?",
      answer:
        "The schema renderer maps each section to TSX blocks and displays it instantly.",
    },
  ],
}: Props) {
  return (
    <section className="py-20 px-6 md:px-16 bg-gray-50">
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

        {/* Step FAQ Timeline */}
        <div className="space-y-8">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="flex gap-6 items-start bg-white rounded-3xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-all duration-300"
            >
              {/* Step Number */}
              <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-bold text-lg shrink-0">
                {index + 1}
              </div>

              {/* FAQ Content */}
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-600 leading-7">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}