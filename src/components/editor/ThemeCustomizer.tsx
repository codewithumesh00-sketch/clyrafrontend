"use client";

import React from "react";
import { useThemeStore } from "@/store/useThemeStore";

export default function ThemeCustomizer() {
  const { theme, updateTheme, resetTheme } = useThemeStore();

  return (
    <div className="space-y-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Theme Customizer</h2>
        <button
          onClick={resetTheme}
          className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50"
        >
          Reset
        </button>
      </div>

      {/* Colors */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-600">Colors</h3>

        <label className="block">
          <span className="mb-1 block text-sm">Primary Color</span>
          <input
            type="color"
            value={theme.primaryColor}
            onChange={(e) =>
              updateTheme({ primaryColor: e.target.value })
            }
            className="h-10 w-full cursor-pointer rounded"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm">Text Color</span>
          <input
            type="color"
            value={theme.textColor}
            onChange={(e) =>
              updateTheme({ textColor: e.target.value })
            }
            className="h-10 w-full cursor-pointer rounded"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm">Background Color</span>
          <input
            type="color"
            value={theme.backgroundColor}
            onChange={(e) =>
              updateTheme({ backgroundColor: e.target.value })
            }
            className="h-10 w-full cursor-pointer rounded"
          />
        </label>
      </div>

      {/* Typography */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-600">Typography</h3>

        <select
          value={theme.fontFamily}
          onChange={(e) =>
            updateTheme({ fontFamily: e.target.value })
          }
          className="w-full rounded-lg border p-2"
        >
          <option value="Inter">Inter</option>
          <option value="Poppins">Poppins</option>
          <option value="Roboto">Roboto</option>
          <option value="Montserrat">Montserrat</option>
        </select>
      </div>

      {/* Layout */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-600">Layout</h3>

        <label className="block">
          <span className="mb-1 block text-sm">
            Border Radius ({theme.borderRadius}px)
          </span>
          <input
            type="range"
            min={0}
            max={40}
            value={theme.borderRadius}
            onChange={(e) =>
              updateTheme({ borderRadius: Number(e.target.value) })
            }
            className="w-full"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm">
            Section Spacing ({theme.sectionSpacing}px)
          </span>
          <input
            type="range"
            min={16}
            max={120}
            step={4}
            value={theme.sectionSpacing}
            onChange={(e) =>
              updateTheme({ sectionSpacing: Number(e.target.value) })
            }
            className="w-full"
          />
        </label>
      </div>
    </div>
  );
}