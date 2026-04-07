export type ServiceCard = {
  icon: string;
  title: string;
  description: string;
};

/**
 * Flatten API / backend content (snake_case, nested contact) into the shape
 * expected by template sections (camelCase + URLs for images).
 */
export function normalizeSiteContent(
  raw: Record<string, unknown> | undefined
): Record<string, unknown> {
  if (!raw || typeof raw !== "object") return {};

  const c = { ...raw } as Record<string, unknown>;
  const contact = c.contact;

  let email = c.email ?? c.contactEmail;
  if (email === undefined && contact && typeof contact === "object") {
    const co = contact as Record<string, unknown>;
    email = co.email;
  }

  const heroImage =
    c.heroImage ??
    c.hero_image ??
    c.image_1 ??
    (c.images && typeof c.images === "object"
      ? (c.images as Record<string, unknown>).hero_image
      : undefined);

  const aboutImage =
    c.aboutImage ?? c.about_image ?? c.image_2 ?? c.galleryImage;

  const galleryImage = c.galleryImage ?? c.gallery_image ?? c.image_3;

  const logoUrl =
    c.logoUrl ?? c.logoSvg ?? c.logo ?? c.logoImage ?? c.logo_image;

  return {
    ...c,
    siteName: c.siteName ?? c.businessName ?? c.site_name ?? c.business_name,
    heroTitle:
      c.heroTitle ??
      c.hero_title ??
      c.heading ??
      c.title,
    heroSubtitle:
      c.heroSubtitle ?? c.hero_subtitle ?? c.description,
    heroBadge: c.heroBadge ?? c.hero_badge,
    heroImage,
    hero_image: heroImage,
    aboutText: c.aboutText ?? c.about_text,
    aboutTitle: c.aboutTitle ?? c.about_title,
    aboutImage,
    galleryImage,
    logoUrl,
    email: email ?? "hello@example.com",
    phone: c.phone ?? c.contactPhone ?? c.contact_phone,
    contactTitle: c.contactTitle ?? c.contact_title,
    contactText: c.contactText ?? c.contact_text,
    footerText: c.footerText ?? c.footer_text,
    services: Array.isArray(c.services) ? c.services : [],
  };
}

export function pickAiServices(
  data: Record<string, unknown> | undefined,
  fallback: ServiceCard[]
): ServiceCard[] {
  const raw = data?.services;
  if (!Array.isArray(raw) || raw.length === 0) return fallback;

  const icons = ["⚡", "🎨", "📱", "🚀", "🏠", "✨", "💼", "🌟"];
  const mapped: ServiceCard[] = [];

  for (let i = 0; i < raw.length; i++) {
    const item = raw[i];
    if (typeof item === "string" && item.trim()) {
      mapped.push({
        icon: icons[mapped.length % icons.length],
        title: item.trim(),
        description: `${item.trim()} — professional delivery aligned with your goals.`,
      });
      continue;
    }
    if (item && typeof item === "object" && "title" in (item as object)) {
      const o = item as Record<string, unknown>;
      mapped.push({
        icon: String(o.icon || icons[mapped.length % icons.length]),
        title: String(o.title || "Service"),
        description: String(o.description || ""),
      });
    }
  }

  return mapped.length > 0 ? mapped : fallback;
}
