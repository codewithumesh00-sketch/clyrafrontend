"use client";

type FAQ = {
  question: string;
  answer: string;
};

type Props = {
  heading?: string;
  subheading?: string;
  faqs?: FAQ[];
};

export default function FaqV2({
  heading = "Questions? We’ve got answers",
  subheading = "Quick answers to help users understand your service, product, or workflow.",
  faqs = [
    {
      question: "How fast can I launch my website?",
      answer:
        "Most AI-generated websites can be rendered in seconds with all sections already structured.",
    },
    {
      question: "Can I generate multiple pages?",
      answer:
        "Yes, the multi-page planner can automatically generate home, about, services, contact, and more.",
    },
    {
      question: "Will the design adapt to my industry?",
      answer:
        "Absolutely. Layouts, content, and section types change based on the business prompt.",
    },
    {
      question: "Can I reuse blocks later?",
      answer:
        "Yes, every TSX block is reusable and works across all generated pages.",
    },
  ],
}: Props) {
  return (
    <section className="py-20 px-6 md:px-16 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            {heading}
          </h2>
          <p className="text-gray-600 mt-4 text-lg max-w-2xl mx-auto">
            {subheading}
          </p>
        </div>

        {/* FAQ Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <h3 className="text-xl font-semibold mb-3">
                {faq.question}
              </h3>
              <p className="text-gray-600 leading-7">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}