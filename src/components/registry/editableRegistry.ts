export const editableRegistry: Record<string, any[]> = {
  Hero: [
    { key: "title", type: "text", label: "Title" },
    { key: "subtitle", type: "text", label: "Subtitle" },
    { key: "buttonText", type: "text", label: "Button Text" },
    { key: "bgColor", type: "color", label: "Background" },
    { key: "textAlign", type: "select", label: "Alignment", options: ["left", "center", "right"] },
    { key: "padding", type: "range", label: "Spacing", min: 0, max: 120 },
  ],

  Features: [
    { key: "title", type: "text", label: "Section Title" },
    { key: "columns", type: "range", label: "Columns", min: 1, max: 6 },
    { key: "bgColor", type: "color", label: "Background" },
  ],
};