const fs = require('fs');

const formspreeBlock = 
`\r\n  const storeEndpoint = useWebsiteBuilderStore(\r\n    (state: any) => state.schema?.editableData?.formspreeEndpoint\r\n  );\r\n  const formspreeEndpoint = isPublished\r\n    ? editableData?.formspreeEndpoint\r\n    : storeEndpoint || editableData?.formspreeEndpoint;\r\n`;

let fixed = 0;

for (let n = 3; n <= 40; n++) {
  const f = `src/templates/template${n}.tsx`;
  if (!fs.existsSync(f)) continue;
  let c = fs.readFileSync(f, 'utf8');

  if (c.includes('formspreeEndpoint')) continue;
  if (!c.includes('isPublished')) continue;

  // Try both space variants in the proxy line
  const anchors = [
    'const updateRegion = isPublished ? () => { } : storeUpdateRegion;\r\n',
    'const updateRegion = isPublished ? () => {} : storeUpdateRegion;\r\n',
    'const updateRegion = isPublished ? () => { } : storeUpdateRegion;\n',
    'const updateRegion = isPublished ? () => {} : storeUpdateRegion;\n',
  ];

  let found = false;
  for (const anchor of anchors) {
    if (c.includes(anchor)) {
      c = c.replace(anchor, anchor + formspreeBlock);
      fs.writeFileSync(f, c, 'utf8');
      console.log('Fixed: template' + n + ' (anchor: ' + JSON.stringify(anchor.substring(0,40)) + ')');
      fixed++;
      found = true;
      break;
    }
  }

  if (!found) {
    // Show what we actually have around updateRegion
    const idx = c.indexOf('updateRegion = isPublished');
    console.log('COULD NOT FIX template' + n + ': ' + JSON.stringify(c.substring(idx, idx + 80)));
  }
}

console.log('Total fixed:', fixed);
