import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { prompt } = await req.json();
  const text = prompt.toLowerCase();

  let sections = [];

  if (text.includes("travel")) {
    sections = [
      { type: "hero", variant: "v2" },
      { type: "features", variant: "v2" },
      { type: "testimonials", variant: "v1" },
      { type: "cta", variant: "v1" },
    ];
  } else if (text.includes("saas") || text.includes("ai")) {
    sections = [
      { type: "hero", variant: "v4" },
      { type: "features", variant: "v4" },
      { type: "pricing", variant: "v2" },
      { type: "faq", variant: "v3" },
      { type: "cta", variant: "v2" },
    ];
  } else if (text.includes("furniture")) {
    sections = [
      { type: "hero", variant: "v3" },
      { type: "features", variant: "v5" },
      { type: "pricing", variant: "v1" },
      { type: "faq", variant: "v2" },
    ];
  } else {
    sections = [
      { type: "hero", variant: "v1" },
      { type: "features", variant: "v1" },
    ];
  }

  return NextResponse.json({
    theme: "light",
    layout: {
      navbar: true,
      footer: true,
    },
    sections,
  });
}