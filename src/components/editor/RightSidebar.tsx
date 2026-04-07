"use client";

import React from "react";
import { useEditor } from "@craftjs/core";
import { editableRegistry } from "../registry/editableRegistry";

type Control = {
  key: string;
  type: "text" | "color" | "range" | "select";
  label: string;
  min?: number;
  max?: number;
  options?: string[];
};

export default function RightSidebar() {
  const { selected, selectedId, actions, query } = useEditor((state) => {
    const selectedIds = Array.from(state.events.selected || []);
    const selectedId = selectedIds[0];

    return {
      selectedId,
      selected: selectedId ? state.nodes[selectedId].data : null,
    };
  });

  if (!selected || !selectedId) {
    return (
      <aside className="h-screen border-l bg-white p-4">
        <p className="text-sm text-gray-500">Select a block to edit</p>
      </aside>
    );
  }

  const componentName = selected.name as string;
  const controls: Control[] = editableRegistry[componentName] || [];
  const node = query.node(selectedId).get();

  const updateProp = (key: string, value: any) => {
    actions.setProp(selectedId, (props: any) => {
      props[key] = value;
    });
  };

  return (
    <aside className="h-screen border-l bg-white p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">{componentName} Settings</h2>

      <div className="space-y-4">
        {controls.map((control) => (
          <div key={control.key}>
            <label className="block text-sm font-medium mb-1">
              {control.label}
            </label>

            {control.type === "text" && (
              <input
                className="w-full rounded-lg border px-3 py-2 text-sm"
                value={node.data.props[control.key] || ""}
                onChange={(e) => updateProp(control.key, e.target.value)}
              />
            )}

            {control.type === "color" && (
              <input
                type="color"
                className="w-full h-10 rounded border"
                value={node.data.props[control.key] || "#ffffff"}
                onChange={(e) => updateProp(control.key, e.target.value)}
              />
            )}

            {control.type === "range" && (
              <input
                type="range"
                min={control.min}
                max={control.max}
                className="w-full"
                value={node.data.props[control.key] || 0}
                onChange={(e) =>
                  updateProp(control.key, Number(e.target.value))
                }
              />
            )}

            {control.type === "select" && (
              <select
                className="w-full rounded-lg border px-3 py-2 text-sm"
                value={node.data.props[control.key] || ""}
                onChange={(e) => updateProp(control.key, e.target.value)}
              >
                {control.options?.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}