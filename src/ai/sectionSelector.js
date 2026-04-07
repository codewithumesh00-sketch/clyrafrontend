import { generateSectionContent } from "./contentGenerator";

export function sectionSelector(prompt = "") {
  const text = prompt.toLowerCase();
  const sections = [];

  // ✅ HERO
  const heroBase = {
    type: "hero",
    variant: "v1",
  };

  sections.push({
    ...heroBase,
    ...generateSectionContent(prompt, "hero", "v1"),
  });

  // ✅ FEATURES
  const featureVariant =
    text.includes("saas") ||
    text.includes("software") ||
    text.includes("fintech") ||
    text.includes("agency") ||
    text.includes("landing")
      ? "v2"
      : "v1";

  sections.push({
    type: "features",
    variant: featureVariant,
    ...generateSectionContent(prompt, "features", featureVariant),
  });

  return sections;
}