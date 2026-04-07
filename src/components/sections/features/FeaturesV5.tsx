"use client";

type Step = {
  title: string;
  description: string;
};

type Props = {
  heading?: string;
  subheading?: string;
  steps?: Step[];
};

export default function FeatureV5({
  heading = "How it works",
  subheading = "A simple step-by-step process designed to help users move from idea to launch faster.",
  steps = [
    {
      title: "Enter your prompt",
      description:
        "Describe your business, idea, or website goal in simple natural language.",
    },
    {
      title: "AI plans your sections",
      description:
        "The intelligence layer selects the best pages, layouts, and blocks automatically.",
    },
    {
      title: "Content gets generated",
      description:
        "Gemini writes headings, descriptions, CTAs, and supporting section content.",
    },
    {
      title: "Website renders instantly",
      description:
        "The schema engine converts AI output into beautiful live TSX pages in real time.",
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
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-lg">
            {subheading}
          </p>
        </div>

        {/* Timeline Steps */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-[2px] bg-gray-200 hidden md:block" />

          <div className="space-y-10">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative flex gap-6 items-start"
              >
                {/* Step Number */}
                <div className="shrink-0 w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-bold text-lg z-10">
                  {index + 1}
                </div>

                {/* Content */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex-1 hover:shadow-lg transition-all duration-300">
                  <h3 className="text-xl font-semibold mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-7">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}