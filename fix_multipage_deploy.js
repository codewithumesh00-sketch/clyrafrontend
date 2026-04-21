/**
 * fix_multipage_deploy.js
 * 
 * Patches all template*.tsx files so that when isPublished=true,
 * ALL page views are rendered (hidden via CSS), not just the active one.
 * 
 * BEFORE:
 *   {activePage === "home" && <HomeView />}
 *   {activePage === "about" && <AboutView />}
 *   {activePage === "contact" && <ContactView />}
 *
 * AFTER:
 *   {isPublished ? (
 *     <>
 *       <div id="clyra-page-home"><HomeView /></div>
 *       <div id="clyra-page-about" style={{display:'none'}}><AboutView /></div>
 *       <div id="clyra-page-contact" style={{display:'none'}}><ContactView /></div>
 *     </>
 *   ) : (
 *     <>
 *       {activePage === "home" && <HomeView />}
 *       {activePage === "about" && <AboutView />}
 *       {activePage === "contact" && <ContactView />}
 *     </>
 *   )}
 */

const fs = require("fs");
const path = require("path");

const TEMPLATES_DIR = path.join(__dirname, "src", "templates");

const templateFiles = fs
  .readdirSync(TEMPLATES_DIR)
  .filter((f) => /^template\d+\.tsx$/.test(f));

let patchedCount = 0;
let skippedCount = 0;

for (const file of templateFiles) {
  const filePath = path.join(TEMPLATES_DIR, file);
  let src = fs.readFileSync(filePath, "utf8");

  // Skip if already patched
  if (src.includes("clyra-page-home")) {
    console.log(`⏭  Already patched: ${file}`);
    skippedCount++;
    continue;
  }

  // Find ALL consecutive lines like:
  //   {activePage === "xxx" && <XxxView />}
  // They may use single or double quotes
  const pageLineRegex = /\{activePage === ["']([a-z]+)["'] && <([A-Za-z]+View) \/>\}/g;

  // Collect all page lines as a block
  // We'll find the first line and last line of the block
  const singleLineBlockRegex =
    /(\s*)\{activePage === ["']([a-z]+)["'] && <([A-Za-z]+View) \/>\}(\r?\n(?:\s*\{activePage === ["'][a-z]+"'?["'] && <[A-Za-z]+View \/>\})*)/;

  // Better approach: find all the page-conditional lines as a contiguous block
  // Match a sequence of {activePage === "..." && <...View />} lines
  const blockRegex = /(\s*)(?:\{activePage === ["'][a-z]+"?["'] && <[A-Za-z]+View \/>\}\r?\n)+\s*\{activePage === ["'][a-z]+"?["'] && <[A-Za-z]+View \/>\}/;

  // Find all occurrences of the pattern
  const allPageLines = [];
  const matches = src.matchAll(/\{activePage === ["']([a-z]+)["'] && <([A-Za-z]+View) \/>\}/g);
  for (const m of matches) {
    allPageLines.push({ page: m[1], view: m[2], full: m[0] });
  }

  if (allPageLines.length === 0) {
    console.log(`⚠️  No activePage pattern found in ${file}`);
    skippedCount++;
    continue;
  }

  // Build the replacement block
  const indent = "        "; // 8 spaces
  const innerIndent = "          "; // 10 spaces

  const publishedLines = allPageLines
    .map((p, i) =>
      i === 0
        ? `${innerIndent}<div id="clyra-page-${p.page}"><${p.view} /></div>`
        : `${innerIndent}<div id="clyra-page-${p.page}" style={{display:'none'}}><${p.view} /></div>`
    )
    .join("\n");

  const editorLines = allPageLines
    .map((p) => `${innerIndent}{activePage === "${p.page}" && <${p.view} />}`)
    .join("\n");

  // Build the full replacement string
  const replacement = `{isPublished ? (
${indent}  <>
${publishedLines}
${indent}  </>
${indent}) : (
${indent}  <>
${editorLines}
${indent}  </>
${indent})}`;

  // Replace the block of consecutive activePage === lines in the source
  // Build a regex that matches the whole block
  const escapedLines = allPageLines
    .map((p) => `\\{activePage === ["']${p.page}["'] && <${p.view} /\\>\\}`)
    .join("[\\r\\n\\s]+");

  const blockPattern = new RegExp(escapedLines);

  if (!blockPattern.test(src)) {
    console.log(`⚠️  Could not locate block in ${file}`);
    skippedCount++;
    continue;
  }

  const patched = src.replace(blockPattern, replacement);

  fs.writeFileSync(filePath, patched, "utf8");
  console.log(`✅  Patched ${file} (${allPageLines.map((p) => p.page).join(", ")})`);
  patchedCount++;
}

console.log(`\n✅ Done! Patched ${patchedCount} files, skipped ${skippedCount}`);
