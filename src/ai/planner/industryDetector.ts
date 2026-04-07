export function detectIndustry(prompt: string) {
  const text = prompt.toLowerCase();

  if (text.includes("travel") || text.includes("tour")) return "travel";
  if (text.includes("restaurant") || text.includes("food")) return "restaurant";
  if (text.includes("saas") || text.includes("software")) return "saas";
  if (text.includes("agency") || text.includes("marketing")) return "agency";
  if (text.includes("furniture") || text.includes("chair")) return "furniture";

  return "business";
}