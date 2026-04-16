export function exportNextApp(
  componentSource: string,
  projectName: string
) {
  return {
    "app/page.tsx": componentSource,

    "app/layout.tsx": `
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
`,

    "package.json": JSON.stringify(
      {
        name: projectName,
        private: true,
        scripts: {
          dev: "next dev",
          build: "next build",
          start: "next start"
        },
        dependencies: {
          next: "16.2.2",
          react: "19.0.0",
          "react-dom": "19.0.0"
        }
      },
      null,
      2
    ),

    "next.config.js": `
/** @type {import('next').NextConfig} */
const nextConfig = {};
module.exports = nextConfig;
`,
  };
}
