const fs = require('fs');
const f = 'src/templates/template8.tsx';
let c = fs.readFileSync(f, 'utf8');

// The bad fragment: orphaned code after ContactView
// Lines 333-335 should not be there - they are part of the main return
const bad = '    );\n        color: theme.textColor,\r\n        fontFamily: theme.fontFamily || "inherit",\r\n      }}\r\n    >\r\n';
const good = '    );\n  };\r\n\r\n  return (\r\n    <div\r\n      className="w-full min-h-screen overflow-x-hidden flex flex-col"\r\n      style={{\r\n        backgroundColor: theme.backgroundColor,\r\n        color: theme.textColor,\r\n        fontFamily: theme.fontFamily || "inherit",\r\n      }}\r\n    >\r\n';

if (c.includes(bad)) {
  c = c.replace(bad, good);
  fs.writeFileSync(f, c, 'utf8');
  console.log('Fixed!');
} else {
  // Try finding by anchor
  const idx = c.indexOf('color: theme.textColor,\r\n        fontFamily: theme.fontFamily');
  if (idx > -1) {
    console.log('Found orphan at index:', idx);
    console.log('Context:', JSON.stringify(c.substring(idx - 30, idx + 100)));
  } else {
    console.log('Could not find the orphan fragment');
    // Show what's around line 332-336
    const lines = c.split('\n');
    console.log('Lines 330-340:', lines.slice(329, 340).join('\n'));
  }
}
