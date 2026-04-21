/**
 * fix_multipage_v2.js
 * 
 * FIXES the broken "Full Preview" and deployed navbar.
 * 
 * The problem with v1: isPublished=true rendered all pages but used
 * static display:none — so clicking navbar (which calls setActivePage)
 * had no visual effect in live React (full preview).
 *
 * The fix: use reactive styles so BOTH environments work:
 *   - Live React (full preview): activePage state drives display
 *   - Static HTML (deployed): SSR outputs home=block, rest=none;
 *     NAV_SCRIPT then takes over show/hide via direct style
 *
 * BEFORE (broken v1):
 *   <div id="clyra-page-home"><HomeView /></div>
 *   <div id="clyra-page-about" style={{display:'none'}}><AboutView /></div>
 *
 * AFTER (correct v2):
 *   <div id="clyra-page-home" style={{display: activePage==='home'?'block':'none'}}><HomeView /></div>
 *   <div id="clyra-page-about" style={{display: activePage==='about'?'block':'none'}}><AboutView /></div>
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

  // Check if this file has the v1 broken patch (static display:none)
  if (!src.includes("clyra-page-home")) {
    console.log(`⏭  No clyra-page pattern found, skipping: ${file}`);
    skippedCount++;
    continue;
  }

  if (src.includes("activePage==='home'") || src.includes("activePage === 'home'")) {
    console.log(`✅ Already v2: ${file}`);
    skippedCount++;
    continue;
  }

  // Find all clyra-page div lines with static display:none and replace
  // Pattern: <div id="clyra-page-PAGENAME" style={{display:'none'}}><ViewName /></div>
  // or:      <div id="clyra-page-home"><HomeView /></div>  (no style)
  
  // Replace each line:
  // 1) The home page (no display:none in v1)
  // 2) Other pages (display:'none' in v1)
  
  let patched = src.replace(
    /<div id="clyra-page-([a-z]+)"(?: style=\{\{display:'none'\}\})?>(<[A-Za-z]+ \/>)<\/div>/g,
    (_, pageName, viewTag) => {
      return `<div id="clyra-page-${pageName}" style={{display: activePage === '${pageName}' ? 'block' : 'none'}}>${viewTag}</div>`;
    }
  );

  if (patched === src) {
    console.log(`⚠️  Pattern not matched in ${file}`);
    skippedCount++;
    continue;
  }

  fs.writeFileSync(filePath, patched, "utf8");
  console.log(`✅ Patched v2: ${file}`);
  patchedCount++;
}

console.log(`\n✅ Done! Upgraded ${patchedCount} files to v2, skipped ${skippedCount}`);
