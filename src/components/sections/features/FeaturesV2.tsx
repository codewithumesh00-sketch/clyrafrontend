"use client";

type FeatureItem = {
  title: string;
  description: string;
};

type Props = {
  title?: string;
  subtitle?: string;
  items?: FeatureItem[];
};

export default function FeaturesV2({
  title = "Modern Features",
  subtitle = "Everything needed to scale beautifully.",
  items = [],
}: Props) {
  return (
    <section className="py-24 px-6 bg-zinc-950 text-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold">
          {typeof title === "string" ? title : "Modern Features"}
        </h2>

        <p className="mt-4 text-lg text-zinc-400">
          {typeof subtitle === "string"
            ? subtitle
            : "Everything needed to scale beautifully."}
        </p>

        <div className="grid md:grid-cols-2 gap-6 mt-12">
          {Array.isArray(items) &&
            items.map((item, index) => (
              <div
                key={index}
                className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6"
              >
                <h3 className="text-xl font-semibold">
                  {typeof item?.title === "string"
                    ? item.title
                    : "Feature"}
                </h3>

                <p className="mt-2 text-zinc-400">
                  {typeof item?.description === "string"
                    ? item.description
                    : "Description"}
                </p>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}