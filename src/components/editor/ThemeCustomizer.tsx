"use client";

import React from "react";
import { useThemeStore } from "@/store/useThemeStore";

export default function ThemeCustomizer() {
  const { theme, updateTheme, resetTheme } = useThemeStore();

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-white tracking-wide uppercase">Theme Customizer</h2>
        <button
          onClick={resetTheme}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/60 hover:bg-white/10 hover:text-white transition-all"
        >
          Reset
        </button>
      </div>

      {/* Colors */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider">Colors</h3>

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-white/70">Primary Color</span>
          <input
            type="color"
            value={theme.primaryColor}
            onChange={(e) => updateTheme({ primaryColor: e.target.value })}
            className="h-9 w-full cursor-pointer rounded-lg border border-white/10 bg-transparent"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-white/70">Text Color</span>
          <input
            type="color"
            value={theme.textColor}
            onChange={(e) => updateTheme({ textColor: e.target.value })}
            className="h-9 w-full cursor-pointer rounded-lg border border-white/10 bg-transparent"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-white/70">Background Color</span>
          <input
            type="color"
            value={theme.backgroundColor}
            onChange={(e) => updateTheme({ backgroundColor: e.target.value })}
            className="h-9 w-full cursor-pointer rounded-lg border border-white/10 bg-transparent"
          />
        </label>
      </div>

      {/* Typography */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider">Typography</h3>
        <select
          value={theme.fontFamily}
          onChange={(e) => updateTheme({ fontFamily: e.target.value })}
          className="w-full rounded-lg border border-white/10 bg-white/5 p-2.5 text-sm text-white focus:border-white/30 focus:outline-none focus:ring-0"
        >
          <option value="Inter" className="bg-zinc-900">Inter</option>
          <option value="Poppins" className="bg-zinc-900">Poppins</option>
          <option value="Roboto" className="bg-zinc-900">Roboto</option>
          <option value="Montserrat" className="bg-zinc-900">Montserrat</option>
        </select>
      </div>

      {/* Layout */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider">Layout</h3>

        <label className="block">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-xs font-medium text-white/70">Border Radius</span>
            <span className="text-xs text-white/40 tabular-nums">{theme.borderRadius}px</span>
          </div>
          <input
            type="range"
            min={0}
            max={40}
            value={theme.borderRadius}
            onChange={(e) => updateTheme({ borderRadius: Number(e.target.value) })}
            className="w-full accent-indigo-500"
          />
        </label>

        <label className="block">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-xs font-medium text-white/70">Section Spacing</span>
            <span className="text-xs text-white/40 tabular-nums">{theme.sectionSpacing}px</span>
          </div>
          <input
            type="range"
            min={16}
            max={120}
            step={4}
            value={theme.sectionSpacing}
            onChange={(e) => updateTheme({ sectionSpacing: Number(e.target.value) })}
            className="w-full accent-indigo-500"
          />
        </label>
      </div>
    </div>
  );
}