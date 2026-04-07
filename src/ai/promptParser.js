export function promptParser(prompt = "") {
  const text = prompt.toLowerCase();

  return {
    niche: text.includes("saas")
      ? "saas"
      : text.includes("agency")
      ? "agency"
      : "default",

    wantsLanding:
      text.includes("landing") ||
      text.includes("homepage"),

    wantsPricing:
      text.includes("pricing") ||
      text.includes("plans"),
  };
}