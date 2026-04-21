const fs = require('fs');
let code = fs.readFileSync('src/app/editor/page.tsx', 'utf8');

// 1. Remove isPreviewMode state
code = code.replace(
  "  const [isPreviewMode, setIsPreviewMode] = useState(false);\r\n",
  ""
);

// 2. Fix hamburger button hover
code = code.replace(
  'className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors"',
  'className="lg:hidden p-1.5 hover:bg-white/10 rounded-lg transition-colors"'
);

// 3. Remove the leftover old Preview Toggle button block (lines ~305-318)
const oldPreviewBtn = `            {/* Preview Toggle */}
            <button
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className={\`
                  flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all
                  \${isPreviewMode
                  ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                  : "text-white/60 hover:text-white hover:bg-white/10 border border-transparent"
                }
                \`}
            >
              <Eye className="h-4 w-4" />
              <span className="hidden sm:inline">{isPreviewMode ? "Editing" : "Preview"}</span>
            </button>

            {/* Dashboard Button */}
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 border border-transparent transition-all"
              title="Go to Dashboard"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </button>`;

const newDashboardBtn = `            {/* Dashboard Button */}
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 border border-transparent transition-all"
              title="Go to Dashboard"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </button>`;

code = code.replace(oldPreviewBtn, newDashboardBtn);

// 4. Fix sidebar conditional — was {!isPreviewMode && ( → just render it always
code = code.replace(
  '        {!isPreviewMode && (\r\n          <aside',
  '        <aside'
);
// Remove the closing )} for the isPreviewMode conditional wrapper around sidebar
// It's right after </aside>
code = code.replace(
  '          </aside>\r\n        )}\r\n',
  '        </aside>\r\n'
);

// 5. Simplify the main canvas — remove isPreviewMode branches, just show editor view
const oldCanvas = `        <main className={\`flex-1 flex flex-col overflow-hidden transition-colors \${isPreviewMode ? "bg-white" : "bg-gradient-to-br from-slate-100 to-gray-100"
          }\`}>
          {isPreviewMode ? (
            /* ── Full preview mode: render template directly, no dark shell ── */
            <div className="flex-1 overflow-auto relative">
              <button
                onClick={() => setIsPreviewMode(false)}
                className="fixed top-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-black/80 backdrop-blur-sm px-5 py-2.5 text-sm font-medium text-white shadow-2xl hover:bg-black transition-all"
              >
                <X className="h-4 w-4" />
                Exit Preview
              </button>
              <div id="preview-root" data-clyraweb-preview="true">
                <LivePreview
                  schema={schema}
                  isEditor={false}
                  viewportWidth={deviceConfig[device].viewport}
                />
              </div>
            </div>
          ) : (`;

const newCanvas = `        <main className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-slate-100 to-gray-100">
          {(`;

code = code.replace(oldCanvas, newCanvas);

// 6. Sidebar styles cleanup — fix leftover light colors
code = code
  // Sidebar bg
  .replace(
    'w-72 bg-white border-r border-black-200 shadow-xl lg:shadow-none',
    'w-72 bg-[#111111] border-r border-white/8 shadow-2xl lg:shadow-none'
  )
  // Sidebar tab bar
  .replace(
    '"flex items-center gap-1 p-3 border-b border-black-100 bg-gray-50/50"',
    '"flex items-center gap-1 p-3 border-b border-white/8 bg-black/30"'
  )
  // Active tab
  .replace(
    '"bg-white shadow-sm text-gray-900 ring-1 ring-gray-200"',
    '"bg-white/15 shadow-sm text-white ring-1 ring-white/10"'
  )
  // Inactive tab
  .replace(
    '"text-gray-500 hover:text-gray-700 hover:bg-gray-100"',
    '"text-white/40 hover:text-white hover:bg-white/10"'
  )
  // Settings icon
  .replace('"h-4 w-4 text-black-600"', '"h-4 w-4 text-white/50"')
  // Theme/Settings header text
  .replace('"text-sm font-semibold text-gray-800">Visual Customization', '"text-sm font-semibold text-white/80">Visual Customization')
  .replace('"text-sm font-semibold text-gray-800">Form & Integration', '"text-sm font-semibold text-white/80">Form & Integration')
  // Theme tab wrapper
  .replace(
    '"bg-gradient-to-br from-indigo-50/50 to-blue-50/50 rounded-2xl p-4 border border-indigo-100/50"',
    '"rounded-2xl p-0"'
  )
  // Form endpoint card
  .replace('"bg-white border border-gray-200 rounded-2xl p-4 space-y-3 shadow-sm"', '"bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3"')
  .replace('"text-sm font-medium text-gray-700">Contact Form', '"text-sm font-medium text-white/70">Contact Form')
  .replace(
    '"flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full"',
    '"flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full"'
  )
  .replace(
    '"w-full text-sm text-gray-900 placeholder-gray-400 p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"',
    '"w-full text-sm text-white placeholder-white/30 p-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400/50 transition-all"'
  )
  // Formspree note
  .replace('"text-xs text-gray-400 text-center">\n                        Forms', '"text-xs text-white/30 text-center">\n                        Forms')
  // Quick actions card
  .replace('"bg-white border border-gray-200 rounded-2xl p-4 space-y-2 shadow-sm"', '"bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2"')
  .replace('"text-xs font-semibold text-gray-500 uppercase tracking-wide">Quick Actions', '"text-xs font-semibold text-white/30 uppercase tracking-wide">Quick Actions')
  .replace(
    '"w-full flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 p-2.5 rounded-xl transition-all text-left"',
    '"w-full flex items-center gap-2 text-sm text-white/60 hover:text-white hover:bg-white/10 p-2.5 rounded-xl transition-all text-left"'
  )
  .replace(
    '"w-full flex items-center gap-2 text-sm text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 p-2.5 rounded-xl transition-all text-left"',
    '"w-full flex items-center gap-2 text-sm text-white/60 hover:text-white hover:bg-white/10 p-2.5 rounded-xl transition-all text-left"'
  );

// 7. Mobile overlay fix — was conditional on isPreviewMode
code = code.replace(
  '        {isSidebarOpen && !isPreviewMode && (',
  '        {isSidebarOpen && ('
);

// 8. Floating buttons — was conditional on !isPreviewMode
code = code.replace(
  '      {!isPreviewMode && (\r\n        <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-20">',
  '      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-20">'
);
// Remove the closing )} for that block
code = code.replace(
  '        </div>\r\n      )}\r\n\r\n      {/* Deploy Panel',
  '      </div>\r\n\r\n      {/* Deploy Panel'
);

fs.writeFileSync('src/app/editor/page.tsx', code);
console.log('Done! Cleaned up isPreviewMode, fixed sidebar/hamburger styles.');
