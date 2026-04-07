"use client";

interface ToolboxProps {
  addBlock: (block: string) => void;
}

const blocks = [
  "Hero",
  "CTA",
  "FeatureGrid",
  "Pricing",
  "Testimonials",
  "FAQ",
  "Contact",
];

export default function Toolbox({ addBlock }: ToolboxProps) {
  return (
    <aside className="w-72 h-screen bg-gray-900 border-r border-white/10 p-5">
      <h2 className="text-white text-xl font-bold mb-6">
        🧩 Blocks
      </h2>

      <div className="space-y-3">
        {blocks.map((block) => (
          <button
            key={block}
            onClick={() => addBlock(block)}
            className="w-full text-left px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-all"
          >
            + {block}
          </button>
        ))}
      </div>
    </aside>
  );
}