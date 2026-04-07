"use client";

import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const facts = [
  "⚡ AI is optimizing your page speed",
  "🎨 Choosing the best color hierarchy",
  "📱 Making your design mobile responsive",
  "🚀 Improving SEO metadata",
  "🧠 Selecting the best conversion layout",
  "✨ Enhancing typography readability",
];

export default function LoaderSkeleton() {
  const [progress, setProgress] = useState(12);
  const [factIndex, setFactIndex] = useState(0);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev < 95 ? prev + 11 : prev));
    }, 700);

    const factInterval = setInterval(() => {
      setFactIndex((prev) => (prev + 1) % facts.length);
    }, 2000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(factInterval);
    };
  }, []);

  return (
    <div className="h-full w-full p-6 space-y-6 rounded-2xl bg-white dark:bg-zinc-950">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-zinc-500">
          <span>AI is building your website...</span>
          <span>{progress}%</span>
        </div>

        <div className="h-3 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-600 to-purple-600 transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
        {facts[factIndex]}
      </div>

      <div className="space-y-4">
        <Skeleton height={56} borderRadius={16} />
        <Skeleton height={320} borderRadius={24} />
        <Skeleton count={5} height={20} />
      </div>
    </div>
  );
}
