export function exportNextApp(schema: any) {
  const files: Record<string, string> = {};

  const pages = schema?.pages || [];

  pages.forEach((page: any) => {
    const route =
      page.page === "home"
        ? "src/app/page.tsx"
        : `src/app/${page.page}/page.tsx`;

    files[route] = `
import WebsiteRenderer from "@/components/renderer/WebsiteRenderer";

export default function ${capitalize(page.page)}Page() {
  return (
    <WebsiteRenderer
      schema={{
        theme: "${schema.theme || "light"}",
        layout: ${JSON.stringify(schema.layout || {})},
        pages: ${JSON.stringify([page], null, 2)}
      }}
    />
  );
}
`;
  });

  return files;
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}