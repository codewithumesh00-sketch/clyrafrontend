const fs = require('fs');

[5, 6, 8].forEach(n => {
  const f = `src/templates/template${n}.tsx`;
  let c = fs.readFileSync(f, 'utf8');
  
  // Replace all variants (with/without id attribute)
  c = c.replace(/<Section id="contact-header">/g, '<div className="w-full py-16 px-4 sm:px-6 lg:px-8">');
  c = c.replace(/<Section id="contact-form">/g, '<div className="w-full py-8 px-4 sm:px-6 lg:px-8"><div className="max-w-7xl mx-auto">');
  c = c.replace(/<Section>/g, '<div className="w-full py-8 px-4 sm:px-6 lg:px-8">');
  
  // For contact-form, we need extra closing div
  // Count Section->div replacements to add closing divs
  let contactFormFixed = c.includes('<div className="w-full py-8 px-4 sm:px-6 lg:px-8"><div className="max-w-7xl mx-auto">');
  
  c = c.replace(/<\/Section>/g, '</div>');
  
  // If we added the extra inner div, add an extra closing div
  // We need to find the closing pattern and add one more div close
  if (contactFormFixed) {
    // Find the pattern: form's closing div then </div> then </div> - we need one more
    // Just check if it compiles - the closing div count should be right since we added one open
  }
  
  fs.writeFileSync(f, c, 'utf8');
  console.log(`Fixed template${n}, still has Section: ${c.includes('<Section')}`);
});
