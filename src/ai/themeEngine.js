const INDUSTRY_KEYWORDS = {
  luxury: [
    "luxury",
    "premium",
    "villa",
    "real estate",
    "hotel",
    "resort",
    "jewelry",
    "watch",
    "fashion brand",
  ],
  fintech: [
    "fintech",
    "finance",
    "bank",
    "investment",
    "crypto",
    "trading",
    "insurance",
    "loan",
  ],
  healthcare: [
    "doctor",
    "hospital",
    "clinic",
    "medical",
    "health",
    "dental",
    "pharmacy",
    "wellness",
  ],
  ecommerce: [
    "shop",
    "store",
    "ecommerce",
    "fashion",
    "product",
    "dropshipping",
    "marketplace",
  ],
  restaurant: [
    "restaurant",
    "food",
    "cafe",
    "bakery",
    "pizza",
    "coffee",
    "kitchen",
  ],
  furniture: [
    "furniture",
    "chair",
    "table",
    "sofa",
    "interior",
    "wood",
    "decor",
  ],
  education: [
    "school",
    "college",
    "course",
    "education",
    "learning",
    "training",
    "academy",
  ],
  tech: [
    "saas",
    "software",
    "startup",
    "ai",
    "tech",
    "developer",
    "automation",
    "website builder",
  ],
  agency: [
    "agency",
    "marketing",
    "creative",
    "branding",
    "seo",
    "digital",
  ],
};

const BASE_THEMES = {
  luxury: {
    palettes: [
      ["#0b0b0b", "#d4af37", "#f5e6a9"],
      ["#111111", "#c9a227", "#f8e7b0"],
      ["#0f0f0f", "#e0b84f", "#fff2c7"],
    ],
    fonts: ["'Playfair Display', serif", "'Cormorant Garamond', serif"],
  },

  fintech: {
    palettes: [
      ["#07111f", "#2563eb", "#60a5fa"],
      ["#0f172a", "#0ea5e9", "#38bdf8"],
      ["#111827", "#3b82f6", "#93c5fd"],
    ],
    fonts: ["'Inter', sans-serif", "'Manrope', sans-serif"],
  },

  healthcare: {
    palettes: [
      ["#f8fafc", "#14b8a6", "#5eead4"],
      ["#ffffff", "#10b981", "#6ee7b7"],
      ["#f0fdfa", "#06b6d4", "#67e8f9"],
    ],
    fonts: ["'Inter', sans-serif", "'Nunito', sans-serif"],
  },

  ecommerce: {
    palettes: [
      ["#ffffff", "#ef4444", "#fca5a5"],
      ["#fff7ed", "#f97316", "#fdba74"],
      ["#fdf2f8", "#ec4899", "#f9a8d4"],
    ],
    fonts: ["'Inter', sans-serif", "'Poppins', sans-serif"],
  },

  restaurant: {
    palettes: [
      ["#fff7ed", "#ea580c", "#fdba74"],
      ["#451a03", "#f97316", "#ffedd5"],
      ["#7c2d12", "#fb923c", "#fed7aa"],
    ],
    fonts: ["'Poppins', sans-serif", "'Merriweather', serif"],
  },

  furniture: {
    palettes: [
      ["#f8f5ef", "#8b5e3c", "#d2b48c"],
      ["#faf7f2", "#a16207", "#fde68a"],
      ["#fffaf0", "#92400e", "#fcd34d"],
    ],
    fonts: ["'Inter', sans-serif", "'Lora', serif"],
  },

  education: {
    palettes: [
      ["#eff6ff", "#2563eb", "#93c5fd"],
      ["#f5f3ff", "#7c3aed", "#c4b5fd"],
      ["#ecfeff", "#0891b2", "#67e8f9"],
    ],
    fonts: ["'Inter', sans-serif", "'Nunito', sans-serif"],
  },

  tech: {
    palettes: [
      ["#0b1020", "#6366f1", "#8b5cf6"],
      ["#111827", "#06b6d4", "#67e8f9"],
      ["#0f172a", "#3b82f6", "#a78bfa"],
    ],
    fonts: ["'Inter', sans-serif", "'Space Grotesk', sans-serif"],
  },

  agency: {
    palettes: [
      ["#0a0014", "#a855f7", "#d946ef"],
      ["#1e1b4b", "#8b5cf6", "#c084fc"],
      ["#3b0764", "#d946ef", "#f0abfc"],
    ],
    fonts: ["'Poppins', sans-serif", "'Syne', sans-serif"],
  },
};

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function detectIndustry(prompt) {
  const text = prompt.toLowerCase();

  for (const [industry, keywords] of Object.entries(INDUSTRY_KEYWORDS)) {
    if (keywords.some((word) => text.includes(word))) {
      return industry;
    }
  }

  return "tech";
}

export function themeEngine(prompt = "") {
  const industry = detectIndustry(prompt);
  const themeSet = BASE_THEMES[industry];

  const palette = randomItem(themeSet.palettes);
  const fontFamily = randomItem(themeSet.fonts);

  const [background, primary, secondary] = palette;

  const isDark =
    background.startsWith("#0") ||
    background.startsWith("#1") ||
    background.startsWith("#4");

  return {
    name: industry,
    background,
    surface: isDark ? "#111827" : "#ffffff",
    primary,
    secondary,
    text: isDark ? "#ffffff" : "#111827",
    muted: isDark ? "#94a3b8" : "#6b7280",
    fontFamily,
    buttonRadius: `${Math.floor(Math.random() * 10 + 10)}px`,
    shadow: `0 10px 30px ${primary}30`,
    heroGradient: `linear-gradient(135deg, ${primary}22, ${background})`,
    spacing: randomItem(["compact", "balanced", "spacious"]),
    cardStyle: randomItem(["glass", "solid", "outline"]),
    buttonStyle: randomItem(["rounded", "pill", "sharp"]),
    animation: randomItem(["fade", "slide", "scale"]),
  };
}