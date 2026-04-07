"use client";

type Testimonial = {
  name: string;
  role?: string;
  company?: string;
  content: string;
  rating?: number;
};

type Props = {
  heading?: string;
  subheading?: string;
  testimonials?: Testimonial[];
};

export default function TestimonialsV1({
  heading = "Loved by teams worldwide",
  subheading = "Real feedback from businesses using our AI-powered website builder.",
  testimonials = [
    {
      name: "Aarav Sharma",
      role: "Founder",
      company: "LaunchStack",
      content:
        "This builder helped us go from idea to live SaaS landing page in less than 20 minutes. The AI-generated sections felt premium and conversion-focused.",
      rating: 5,
    },
    {
      name: "Priya Mehta",
      role: "Marketing Lead",
      company: "TravelNest",
      content:
        "We generated our travel booking site with FAQs, pricing, CTA, and testimonial blocks instantly. It saved our team weeks of design work.",
      rating: 5,
    },
    {
      name: "Rohan Verma",
      role: "Owner",
      company: "ChairLand Seating",
      content:
        "For our furniture business, the AI understood products, packages, and customer trust sections beautifully. Highly recommended.",
      rating: 5,
    },
  ],
}: Props) {
  return (
    <section className="py-20 px-6 md:px-16 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-[0.25em] text-gray-500 mb-3">
            Testimonials
          </p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            {heading}
          </h2>
          <p className="text-gray-600 mt-4 text-lg max-w-2xl mx-auto">
            {subheading}
          </p>
        </div>

        {/* Cards */}
        <div className="grid lg:grid-cols-3 gap-8">
          {testimonials.map((item, index) => (
            <div
              key={index}
              className="rounded-3xl border border-gray-200 bg-gray-50 p-8 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              {/* Rating */}
              <div className="mb-5 text-xl">
                {"★".repeat(item.rating || 5)}
              </div>

              {/* Content */}
              <p className="text-gray-700 leading-8 text-lg">
                “{item.content}”
              </p>

              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-lg">{item.name}</h3>
                <p className="text-gray-500 text-sm">
                  {item.role}
                  {item.company ? ` • ${item.company}` : ""}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}