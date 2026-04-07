"use client";

type Testimonial = {
  name: string;
  role?: string;
  company?: string;
  content: string;
};

type Props = {
  heading?: string;
  subheading?: string;
  featured?: Testimonial;
  reviews?: Testimonial[];
};

export default function TestimonialsV2({
  heading = "What our customers are saying",
  subheading = "Trusted by startups, agencies, and growing businesses worldwide.",
  featured = {
    name: "Aarav Mehta",
    role: "Founder",
    company: "ScaleFlow",
    content:
      "The AI website builder transformed our launch process. We created a full SaaS site with pricing, FAQs, and testimonials in under 30 minutes. It felt like having a full design team.",
  },
  reviews = [
    {
      name: "Priya",
      role: "CMO",
      company: "TravelNest",
      content:
        "The travel landing page looked production-ready instantly.",
    },
    {
      name: "Rohan",
      role: "Owner",
      company: "ChairLand",
      content:
        "Our furniture package pages converted much better after using these premium blocks.",
    },
    {
      name: "Neha",
      role: "Product Lead",
      company: "AIForge",
      content:
        "Best prompt-to-website experience we’ve tested so far.",
    },
  ],
}: Props) {
  return (
    <section className="py-20 px-6 md:px-16 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="mb-14">
          <p className="text-sm uppercase tracking-[0.25em] text-gray-500 mb-3">
            Testimonials
          </p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            {heading}
          </h2>
          <p className="text-gray-600 mt-4 text-lg max-w-2xl">
            {subheading}
          </p>
        </div>

        {/* Split layout */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Featured quote */}
          <div className="rounded-3xl bg-black text-white p-10 shadow-2xl">
            <div className="text-3xl mb-6">★★★★★</div>
            <p className="text-2xl leading-10 font-medium">
              “{featured.content}”
            </p>

            <div className="mt-10 pt-6 border-t border-gray-800">
              <h3 className="text-xl font-semibold">{featured.name}</h3>
              <p className="text-gray-400">
                {featured.role}
                {featured.company ? ` • ${featured.company}` : ""}
              </p>
            </div>
          </div>

          {/* Small stacked reviews */}
          <div className="space-y-6">
            {reviews.map((review, index) => (
              <div
                key={index}
                className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-lg transition"
              >
                <div className="mb-3">★★★★★</div>
                <p className="text-gray-700 leading-8">
                  “{review.content}”
                </p>

                <div className="mt-5 pt-4 border-t border-gray-100">
                  <h3 className="font-semibold">{review.name}</h3>
                  <p className="text-sm text-gray-500">
                    {review.role}
                    {review.company ? ` • ${review.company}` : ""}
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