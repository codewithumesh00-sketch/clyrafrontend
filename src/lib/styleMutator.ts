export type StyleMode =
  | "minimal"
  | "luxury"
  | "glass"
  | "bold"
  | "dark"
  | "furniture";

export function mutateStyles(
  baseClass: string,
  mode: StyleMode = "minimal"
) {
  const presets: Record<StyleMode, string> = {
    minimal: "rounded-xl shadow-sm",
    luxury: "rounded-3xl shadow-2xl border border-white/20",
    glass: "backdrop-blur-xl bg-white/10 border border-white/20",
    bold: "rounded-none shadow-none border-4",
    dark: "bg-zinc-950 text-white rounded-2xl shadow-xl",
    furniture:
      "bg-[#2b1d14] text-amber-100 rounded-[32px] shadow-2xl",
  };

  return `${baseClass} ${presets[mode]}`;
}