"use client";

type FeatureRow = {
  feature: string;
  starter: string;
  growth: string;
  enterprise: string;
};

type Props = {
  heading?: string;
  subheading?: string;
  rows?: FeatureRow[];
};

export default function PricingV3({
  heading = "Compare plans at a glance",
  subheading = "See exactly what each plan includes before choosing the best fit.",
  rows = [
    {
      feature: "Projects",
      starter: "1",
      growth: "10",
      enterprise: "Unlimited",
    },
    {
      feature: "AI Content",
      starter: "Basic",
      growth: "Advanced",
      enterprise: "Custom",
    },
    {
      feature: "Multi-page Generation",
      starter: "—",
      growth: "✔",
      enterprise: "✔",
    },
    {
      feature: "Team Collaboration",
      starter: "—",
      growth: "✔",
      enterprise: "✔",
    },
    {
      feature: "Dedicated Support",
      starter: "—",
      growth: "Priority",
      enterprise: "24/7 Dedicated",
    },
  ],
}: Props) {
  return (
    <section className="py-20 px-6 md:px-16 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            {heading}
          </h2>
          <p className="text-gray-600 mt-4 text-lg max-w-2xl mx-auto">
            {subheading}
          </p>
        </div>

        {/* Pricing Comparison Table */}
        <div className="overflow-x-auto rounded-3xl border border-gray-200 shadow-sm">
          <table className="w-full min-w-[700px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-4 text-lg font-semibold">
                  Features
                </th>
                <th className="px-6 py-4 text-lg font-semibold">Starter</th>
                <th className="px-6 py-4 text-lg font-semibold">Growth</th>
                <th className="px-6 py-4 text-lg font-semibold">
                  Enterprise
                </th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row, index) => (
                <tr
                  key={index}
                  className="border-t border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4 font-medium">{row.feature}</td>
                  <td className="px-6 py-4 text-center">{row.starter}</td>
                  <td className="px-6 py-4 text-center">{row.growth}</td>
                  <td className="px-6 py-4 text-center">{row.enterprise}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}