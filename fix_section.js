const fs = require('fs');

[5, 6, 8, 34].forEach(n => {
  const f = `src/templates/template${n}.tsx`;
  let c = fs.readFileSync(f, 'utf8');

  // Find the ContactView function
  const cvStart = c.indexOf('const ContactView = () => {');
  if (cvStart === -1) { console.log(`template${n}: no ContactView found`); return; }
  const cvEnd = c.indexOf('  };', cvStart) + 4;
  let cv = c.substring(cvStart, cvEnd);

  // Replace Section tags with plain divs
  cv = cv.replaceAll('<Section id="contact-header">', '<div className="w-full max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">');
  cv = cv.replaceAll('<Section id="contact-form">', '<div className="w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">');
  cv = cv.replaceAll('</Section>', '</div>');

  c = c.substring(0, cvStart) + cv + c.substring(cvEnd);
  fs.writeFileSync(f, c, 'utf8');
  console.log(`Fixed template${n}`);
});
