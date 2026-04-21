const fs = require('fs');
const code = fs.readFileSync('src/app/editor/page.tsx', 'utf8');

// Replace header background
let out = code
  // Header background
  .replace(
    'bg-white/80 backdrop-blur-md border-b border-gray-200/60 shadow-sm flex-shrink-0 z-30',
    'bg-[#0a0a0a] border-b border-white/8 shadow-lg flex-shrink-0 z-30'
  )
  // Wrapper div — add gap
  .replace(
    'flex items-center justify-between px-4 md:px-6 py-3"',
    'flex items-center justify-between px-4 md:px-6 py-3 gap-3"'
  )
  // Logo section outer div
  .replace(
    'flex items-center gap-3">\n            <button\n              onClick={() => setIsSidebarOpen(!isSidebarOpen)}\n              className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors"',
    'flex items-center gap-2 flex-shrink-0 min-w-0">\n            <button\n              onClick={() => setIsSidebarOpen(!isSidebarOpen)}\n              className="lg:hidden p-1.5 hover:bg-white/10 rounded-lg transition-colors"'
  )
  // Hamburger icons — add text-white
  .replace(
    '{isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}',
    '{isSidebarOpen\n                ? <X className="h-5 w-5 text-white" />\n                : <Menu className="h-5 w-5 text-white" />}'
  )
  // Logo image — always visible, fixed height
  .replace(
    'className="h-8 md:h-10 w-auto object-contain"',
    'className="h-7 w-auto object-contain flex-shrink-0"'
  )
  // Editor text span — add brand name + white
  .replace(
    '<span className="hidden sm:inline font-semibold text-gray-800">Editor</span>',
    '<span className="hidden sm:inline font-bold text-white text-sm tracking-wide">ClyraWeb</span>\n              <span className="hidden sm:inline text-white/20 text-sm">\u00b7</span>\n              <span className="hidden sm:inline text-white/40 text-xs font-medium">Editor</span>'
  )
  // Device tabs container
  .replace(
    'bg-gray-100/80 rounded-xl p-1.5 shadow-inner',
    'bg-white/10 rounded-xl p-1.5'
  )
  // Active device tab
  .replace(
    '"bg-white shadow-sm text-gray-900 ring-1 ring-gray-200"',
    '"bg-white shadow-sm text-gray-900"'
  )
  // Inactive device tab
  .replace(
    '"text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"',
    '"text-white/50 hover:text-white hover:bg-white/10"'
  )
  // Save status badge
  .replace(
    '"hidden sm:flex items-center gap-2 text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg"',
    '"hidden sm:flex items-center gap-2 text-xs text-white/40 bg-white/10 px-3 py-1.5 rounded-lg"'
  )
  // Preview button active
  .replace(
    '"bg-blue-50 text-blue-700 border border-blue-200"',
    '"bg-blue-500/20 text-blue-300 border border-blue-500/30"'
  )
  // Preview button inactive
  .replace(
    '"text-gray-600 hover:bg-gray-100 border border-transparent"',
    '"text-white/60 hover:text-white hover:bg-white/10 border border-transparent"'
  )
  // History button
  .replace(
    '"p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"',
    '"p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-xl transition-colors"'
  )
  // Fix broken h-4.5
  .replace('"h-4.5 w-4.5"', '"h-4 w-4"')
  // Fix broken deploying state gradient
  .replace(
    '"from-gray-400 to-gray-500 bg-gradient-to-r text-white cursor-not-allowed"',
    '"bg-gray-700 text-white/60 cursor-not-allowed"'
  );

fs.writeFileSync('src/app/editor/page.tsx', out);
console.log('Header updated successfully!');
