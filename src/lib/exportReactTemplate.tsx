import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

export function exportReactTemplate(
  Component: React.ComponentType<any>,
  editableData: any = {}
) {
  const html = renderToStaticMarkup(
    <Component editableData={editableData} />
  );

  return {
    "index.html": `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Clyra Website</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  ${html}
</body>
</html>
`,
  };
}