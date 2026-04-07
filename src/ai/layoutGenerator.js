import { sectionSelector } from "./sectionSelector";

export function generateWebsiteSchema(prompt = "") {
  const text = prompt.toLowerCase();

  const sections = sectionSelector(prompt);

  const theme =
    text.includes("dark") ||
    text.includes("fintech") ||
    text.includes("cyber") ||
    text.includes("premium")
      ? "dark"
      : "light";

  return {
    theme,
    layout: {
      navbar: true,
      footer: true,
    },
    sections,
  };
}