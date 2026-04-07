"use client";

type Props = {
  badge?: string;
  heading?: string;
  subheading?: string;
  primaryText?: string;
  secondaryText?: string;
  panelTitle?: string;
  panelDescription?: string;
};

export default function CtaV2({
  badge = "Start Today",
  heading = "Take the next step with confidence",
  subheading = "Move from idea to execution with AI-powered sections, production-ready layouts, and fast deployment.",
  primaryText = "Get Started",
  secondaryText = "Talk to Sales",
  panelTitle = "Launch in minutes",
  panelDescription = "Generate complete pages, pricing, FAQs, and CTAs instantly with intelligent prompts.",
}: Props) {
  return (
    <section className="py-20 px-6 md:px-16 bg-gray-50">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
        {/* Left content */}
        <div>
          <span className="inline-block px-4 py-2 rounded-full bg-black text-white text-sm font-medium mb-5">
            {badge}
          </span>

          <h2 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
            {heading}
          </h2>

          <p className="text-gray-600 mt-5 text-lg leading-8 max-w-xl">
            {subheading}
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <button className="px-8 py-4 rounded-2xl bg-black text-white font-semibold hover:opacity-90 transition">
              {primaryText}
            </button>
            <button className="px-8 py-4 rounded-2xl border border-gray-300 hover:border-black transition">
              {secondaryText}
            </button>
          </div>
        </div>

        {/* Right panel */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8 md:p-10">
          <p className="text-sm uppercase tracking-[0.25em] text-gray-500 mb-3">
            Why now
          </p>
          <h3 className="text-3xl font-bold leading-tight">
            {panelTitle}
          </h3>
          <p className="text-gray-600 mt-4 leading-8">
            {panelDescription}
          </p>

          <div className="mt-8 space-y-4">
            <div className="rounded-2xl bg-gray-50 p-4 border border-gray-100">
              ⚡ AI generated content
            </div>
            <div className="rounded-2xl bg-gray-50 p-4 border border-gray-100">
              🚀 Multi-page rendering
            </div>
            <div className="rounded-2xl bg-gray-50 p-4 border border-gray-100">
              🎯 Conversion-first layouts
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}