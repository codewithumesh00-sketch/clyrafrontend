import { resolveTemplate } from "./templateResolver";
import { buildTemplateConfig } from "./configBuilder";

export function generateTemplate(aiResponse: any) {
  return {
    templateId: resolveTemplate(aiResponse.niche),
    config: buildTemplateConfig(aiResponse),
  };
}