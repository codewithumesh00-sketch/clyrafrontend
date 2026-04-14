import fs from "fs";
import path from "path";

type ExportSitePayload = {
  title: string;
  description: string;
  buttonText: string;
  heroImage: string;
};

export async function exportSite(data: ExportSitePayload) {
  const exportDir = path.join(process.cwd(), "exports");

  // create exports folder
  if (!fs.existsSync(exportDir)) {
    fs.mkdirSync(exportDir, { recursive: true });
  }

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${data.title}</title>
  <link rel="stylesheet" href="./styles.css" />
</head>
<body>
  <section class="hero">
    <img src="${data.heroImage}" alt="Hero" />
    <h1>${data.title}</h1>
    <p>${data.description}</p>
    <button>${data.buttonText}</button>
  </section>
</body>
</html>
`;

  const css = `
body {
  margin: 0;
  font-family: Arial, sans-serif;
}

.hero {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 40px;
  text-align: center;
}

.hero img {
  width: 100%;
  max-width: 600px;
  border-radius: 16px;
}

.hero button {
  padding: 12px 24px;
  border: none;
  cursor: pointer;
}
`;

  fs.writeFileSync(path.join(exportDir, "index.html"), html);
  fs.writeFileSync(path.join(exportDir, "styles.css"), css);

  return exportDir;
}