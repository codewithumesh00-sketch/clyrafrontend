export function aiToConfigMapper(data: any) {
  return {
    niche: data.niche,
    hero: data.hero || {},
    features: data.features || [],
  };
}