"use client";

import React from "react";
import { useEditor } from "@craftjs/core";
import { Layers, Plus, Trash2, Copy } from "lucide-react";

export default function LeftSidebar() {
  const { actions, query, enabled } = useEditor((state) => ({
    enabled: state.options.enabled,
  }));

  const addHeroBlock = () => {
    // Later this will connect with your block registry
    console.log("Add Hero block");
  };

  return (
    <aside className="h-screen border-r bg-white p-4 flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Layers size={18} />
          Blocks
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          Drag, add and manage website sections
        </p>
      </div>

      <button
        onClick={addHeroBlock}
        className="w-full rounded-lg border px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
      >
        <Plus size={16} />
        Add Hero Section
      </button>

      <div className="space-y-2">
        <button className="w-full rounded-lg border px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2">
          <Copy size={16} />
          Duplicate Selected
        </button>

        <button className="w-full rounded-lg border px-4 py-2 text-sm hover:bg-red-50 text-red-600 flex items-center gap-2">
          <Trash2 size={16} />
          Delete Selected
        </button>
      </div>

      <div className="mt-auto text-xs text-gray-400">
        Clyra Visual Editor • Phase 1
      </div>
    </aside>
  );
}