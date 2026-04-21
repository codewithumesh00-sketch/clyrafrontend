const fs = require('fs');
const f = 'src/templates/template1.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');

// Find where the commented-out old code block starts
// It starts with: // "use client";
const startIdx = lines.findIndex((line, i) => 
  line.trim() === '// "use client";' && i > 1100
);

if (startIdx === -1) {
  console.log('Could not find commented block start');
  process.exit(1);
}

console.log(`Found commented block at line ${startIdx + 1}`);
console.log('Lines before:', lines[startIdx - 1]);
console.log('Lines at:', lines[startIdx]);

// Keep everything before the comment block
const clean = lines.slice(0, startIdx).join('\n');

// Trim trailing blank lines
const trimmed = clean.trimEnd() + '\n';

fs.writeFileSync(f, trimmed, 'utf8');
console.log(`Done! Removed ${lines.length - trimmed.split('\n').length} lines`);
console.log(`Final line count: ${trimmed.split('\n').length}`);
