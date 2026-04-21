const fs = require('fs');
const path = require('path');
const dir = 'd:/clyraui/frontend/src/templates';

let fixed = 0, alreadyOk = 0, needsManual = [];

for (let n = 3; n <= 40; n++) {
  const file = path.join(dir, `template${n}.tsx`);
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');

  const hasIsPublished = content.includes('isPublished');
  // Check if function signature already has isPublished
  const fnRegex = new RegExp(`Template${n}\\(\\{[^}]*isPublished`);
  const hasInSignature = fnRegex.test(content);

  if (!hasIsPublished) { alreadyOk++; continue; }
  if (hasInSignature) { alreadyOk++; continue; }

  // --- Try to fix the function signature ---
  let newContent = content;

  // Pattern A: Template{n}({ editableData }: TemplateProps)
  newContent = newContent.replace(
    new RegExp(`Template${n}\\(\\{ editableData \\}: TemplateProps\\)`),
    `Template${n}({ editableData, isPublished = false }: TemplateProps)`
  );

  // Pattern B: Template{n}({ editableData, isPublished?... 
  // (multi-line) Template{n}({\n  editableData,\n}: TemplateProps)
  newContent = newContent.replace(
    new RegExp(`Template${n}\\(\\{\\s*\\n\\s*editableData,\\s*\\n\\}: TemplateProps\\)`),
    `Template${n}({\n  editableData,\n  isPublished = false,\n}: TemplateProps)`
  );

  // Pattern C: already has TemplateProps type but inline: Template{n}({ editableData }: TemplateProps)
  // (Try with possible trailing spaces)
  newContent = newContent.replace(
    new RegExp(`Template${n}\\(\\{\\s*editableData\\s*\\}\\s*:\\s*TemplateProps\\)`),
    `Template${n}({ editableData, isPublished = false }: TemplateProps)`
  );

  const fnRegexAfter = new RegExp(`Template${n}\\(\\{[^}]*isPublished`);
  if (fnRegexAfter.test(newContent)) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log(`FIXED: template${n}`);
    fixed++;
  } else {
    // Show what the signature looks like for manual fix
    const sigMatch = content.match(new RegExp(`export default function Template${n}[^{]+`));
    console.log(`NEEDS MANUAL (template${n}): ${sigMatch ? sigMatch[0].trim() : 'signature not found'}`);
    needsManual.push(n);
  }
}

console.log(`\nFixed: ${fixed} | Already OK: ${alreadyOk} | Needs manual: ${needsManual.join(', ')}`);
