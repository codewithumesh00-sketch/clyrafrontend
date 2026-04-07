"use client";

import React from "react";
import { useEditor } from "@craftjs/core";

export default function SettingsPanel() {
  const { selectedNodeId, query, actions } = useEditor((state) => {
    const selected = state.events.selected;

    let nodeId: string | null = null;

    if (typeof selected === "string") {
      nodeId = selected;
    } else if (selected instanceof Set && selected.size > 0) {
      nodeId = Array.from(selected)[0] as string;
    }

    return {
      selectedNodeId: nodeId,
    };
  });

  if (!selectedNodeId) {
    return <p className="text-sm text-gray-500">Select a block</p>;
  }

  const node = query.node(selectedNodeId).get();
  const props = node.data.props as {
    title?: string;
    subtitle?: string;
  };

  const updateProp = (key: "title" | "subtitle", value: string) => {
    actions.setProp(selectedNodeId, (prop: any) => {
      prop[key] = value;
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">{node.data.displayName}</h3>

      <div>
        <label className="text-sm font-medium">Title</label>
        <input
          value={props.title || ""}
          onChange={(e) => updateProp("title", e.target.value)}
          className="w-full mt-1 border rounded-lg px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Subtitle</label>
        <textarea
          value={props.subtitle || ""}
          onChange={(e) => updateProp("subtitle", e.target.value)}
          className="w-full mt-1 border rounded-lg px-3 py-2 text-sm"
          rows={4}
        />
      </div>
    </div>
  );
}