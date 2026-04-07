import { aiToConfigMapper } from "./aiToConfigMapper";

export function buildTemplateConfig(data: any) {
  return aiToConfigMapper(data);
}