import { sectionSelector } from "./sectionSelector";
import { generateSectionContent } from "./contentGenerator";

function sanitizeProps(type, props) {
  if (!props || typeof props !== "object") {
    return {};
  }

  // ✅ Features safety fix
  if (type === "features") {
    return {
      title:
        typeof props.title === "string"
          ? props.title
          : "Powerful Features",

      subtitle:
        typeof props.subtitle === "string"
          ? props.subtitle
          : "Everything needed to build premium websites.",

      items: Array.isArray(props.items)
        ? props.items
        : [
            {
              title: "Dynamic Sections",
              description: "Reusable blocks powered by prompts.",
            },
            {
              title: "Live Editing",
              description: "Visual editor synced with preview.",
            },
          ],
    };
  }

  // ✅ Hero safety fix
  if (type === "hero") {
    return {
      title:
        typeof props.title === "string"
          ? props.title
          : "Build stunning websites with AI",

      subtitle:
        typeof props.subtitle === "string"
          ? props.subtitle
          : "Generate beautiful multi-page websites instantly.",

      buttonText:
        typeof props.buttonText === "string"
          ? props.buttonText
          : "Start Building",
    };
  }

  return props;
}

export function generateWebsiteSchema(prompt = "") {
  const text = prompt.toLowerCase();

  const selectedSections = sectionSelector(prompt);

  const sections = selectedSections.map((section) => {
    const rawProps = generateSectionContent(
      prompt,
      section.type,
      section.variant
    );

    return {
      ...section,
      props: sanitizeProps(section.type, rawProps),
    };
  });

  const theme =
    text.includes("dark") ||
    text.includes("fintech") ||
    text.includes("cyber") ||
    text.includes("premium")
      ? "dark"
      : "light";

  return {
    page: "home",
    theme,
    layout: {
      navbar: true,
      footer: true,
    },
    sections,
  };
}