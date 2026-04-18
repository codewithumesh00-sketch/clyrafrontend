"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeSettings = {
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  backgroundColor: string;
  fontFamily: string;
  borderRadius: number;
  sectionSpacing: number;
  buttonVariant: "solid" | "outline" | "ghost";
};

type ThemeStore = {
  theme: ThemeSettings;
  updateTheme: (updates: Partial<ThemeSettings>) => void;
  resetTheme: () => void;
};

const defaultTheme: ThemeSettings = {
  primaryColor: "#2563eb",
  secondaryColor: "#7c3aed",
  textColor: "#111827",
  backgroundColor: "#ffffff",
  fontFamily: "Inter",
  borderRadius: 16,
  sectionSpacing: 48,
  buttonVariant: "solid",
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: defaultTheme,

      updateTheme: (updates) =>
        set((state) => ({
          theme: {
            ...state.theme,
            ...updates,
          },
        })),

      resetTheme: () =>
        set({
          theme: defaultTheme,
        }),
    }),
    {
      name: "clyraweb-theme-store",
    }
  )
);