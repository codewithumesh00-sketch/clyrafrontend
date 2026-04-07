import { sectionPlanner } from "./sectionPlanner";

function detectIndustry(prompt: string) {
  const text = prompt.toLowerCase();

  if (text.includes("travel")) return "travel";
  if (
    text.includes("saas") ||
    text.includes("software") ||
    text.includes("ai")
  ) {
    return "saas";
  }

  if (
    text.includes("furniture") ||
    text.includes("chair")
  ) {
    return "furniture";
  }

  if (
    text.includes("real estate") ||
    text.includes("property")
  ) {
    return "real estate";
  }

  return "general";
}

function detectPages(industry: string) {
  if (industry === "travel") {
    return ["home", "destinations", "packages"];
  }

  if (industry === "saas") {
    return ["home", "features", "pricing"];
  }

  if (industry === "furniture") {
    return ["home", "pricing", "testimonials"];
  }

  if (industry === "real estate") {
    return ["home", "pricing", "testimonials"];
  }

  return ["home"];
}

export function multiPagePlanner(prompt: string) {
  console.log("🔥 RAW PROMPT =", prompt);

  const industry = detectIndustry(prompt);
  console.log("🔥 DETECTED INDUSTRY =", industry);

  const pageList = detectPages(industry);
  console.log("🔥 PAGE LIST =", pageList);

  const pages = pageList.map((page) => {
    const sections = sectionPlanner(page, industry);

    console.log(
      `🔥 PAGE: ${page} → HERO =`,
      sections.find((s) => s.type === "hero")
    );

    return {
      page,
      sections,
    };
  });

  const result = {
    industry,
    theme: industry === "saas" ? "dark" : "light",
    pages,
  };

  console.log(
    "🔥 FINAL MULTIPAGE RESULT =",
    JSON.stringify(result, null, 2)
  );

  return result;
}