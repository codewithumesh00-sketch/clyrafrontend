import { multiPagePlanner } from "../planner/multipagePlanner";

export function generateWebsiteSchema(prompt: string) {
  const schema = multiPagePlanner(prompt);

  return {
    industry: schema.industry,
    theme: schema.theme,
    layout: {
      navbar: true,
      footer: true,
    },
    pages: schema.pages, // ✅ KEEP ARRAY
  };
}