import { templateRegistry } from "./templateRegistry";

export function resolveTemplate(niche: string): string {
  return templateRegistry[niche.toLowerCase()] || "template6";
}