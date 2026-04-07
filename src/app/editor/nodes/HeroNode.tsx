"use client";

import React from "react";
import { useNode } from "@craftjs/core";

type Props = {
  title: string;
  subtitle: string;
};

export default function HeroNode({ title, subtitle }: Props) {
  const {
    connectors: { connect, drag },
    selected,
  } = useNode((state) => ({
    selected: state.events.selected,
  }));

  return (
    <section
      ref={(ref: HTMLElement | null) => {
        if (ref) connect(drag(ref));
      }}
      className={`p-16 rounded-xl bg-white shadow-md cursor-move ${
        selected ? "ring-2 ring-blue-500" : ""
      }`}
    >
      <h1 className="text-4xl font-bold">{title}</h1>
      <p className="mt-4 text-gray-600">{subtitle}</p>
    </section>
  );
}

(HeroNode as any).craft = {
  displayName: "Hero Section",
  props: {
    title: "Build Your Dream Website",
    subtitle: "AI-powered websites in seconds",
  },
};