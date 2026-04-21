const fs = require('fs');

[5, 6].forEach(n => {
  const f = `src/templates/template${n}.tsx`;
  let c = fs.readFileSync(f, 'utf8');
  
  // Fix the bad double-open div: <div className="..."><div className="max-w-7xl mx-auto">
  // Split it into two properly formatted lines
  c = c.replace(
    '<div className="w-full py-8 px-4 sm:px-6 lg:px-8"><div className="max-w-7xl mx-auto">',
    '<div className="w-full py-8 px-4 sm:px-6 lg:px-8">\n          <div className="max-w-7xl mx-auto">'
  );
  
  // Now fix the closing - we need to find the ContactView return and ensure we have 3 closing divs
  // before the ); at end of return
  // Pattern that's wrong: ...form </div>\n        </div>\n      </div>\n    );
  // It's missing one </div> for the max-w-7xl wrapper
  // Current (wrong): form's </div>, then outer-form </div>, then inner-div </div>, then outer </div>
  // We need: form's </div>, then grid-cols </div>, then max-7xl </div>, then py-8 </div>, then root </div>
  
  // Check current closing structure around the ContactView end
  const endIdx = c.indexOf("    );\n  };\n", c.indexOf('const ContactView'));
  if (endIdx !== -1) {
    const before = c.substring(endIdx - 200, endIdx + 20);
    console.log(`template${n} closing structure:`, before);
  }
  
  fs.writeFileSync(f, c, 'utf8');
  console.log(`Saved template${n}`);
});
