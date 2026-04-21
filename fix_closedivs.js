const fs = require('fs');

[5, 6].forEach(n => {
  const f = `src/templates/template${n}.tsx`;
  let c = fs.readFileSync(f, 'utf8');

  // Find the pattern near end of ContactView and add the missing </div>
  // Current: </form>\n          </div>\n        </div>\n      </div>\n    );
  // Need:   </form>\n          </div>\n        </div>\n        </div>\n      </div>\n    );
  const wrong = '            </form>\n          </div>\n        </div>\n      </div>\n    );\n  }';
  const right = '            </form>\n          </div>\n        </div>\n        </div>\n      </div>\n    );\n  }';
  
  if (c.includes(wrong)) {
    c = c.replace(wrong, right);
    fs.writeFileSync(f, c, 'utf8');
    console.log(`Fixed closing divs: template${n}`);
  } else {
    // Try alternate indentation
    const w2 = '          </div>\n        </div>\n      </div>\n    );\n  };';
    const r2 = '          </div>\n        </div>\n        </div>\n      </div>\n    );\n  };';
    if (c.includes(w2)) {
      c = c.replace(w2, r2);
      fs.writeFileSync(f, c, 'utf8');
      console.log(`Fixed closing divs (v2): template${n}`);
    } else {
      console.log(`PATTERN NOT FOUND template${n}. Showing end of ContactView:`);
      const idx = c.indexOf('const ContactView');
      const endIdx = c.indexOf('};\n', c.indexOf('return (', idx));
      console.log(c.substring(endIdx - 200, endIdx + 5));
    }
  }
});
