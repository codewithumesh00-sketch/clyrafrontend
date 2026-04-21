const fs = require('fs');
let code = fs.readFileSync('src/app/editor/page.tsx', 'utf8');

code = code
  // Sidebar bg — white → dark
  .replace(
    'w-72 bg-white border-r border-black-200 shadow-xl lg:shadow-none',
    'w-72 bg-[#111111] border-r border-white/8 shadow-2xl lg:shadow-none'
  )
  // Sidebar tab bar bg
  .replace(
    '"flex items-center gap-1 p-3 border-b border-black-100 bg-gray-50/50"',
    '"flex items-center gap-1 p-3 border-b border-white/8 bg-black/30"'
  )
  // Active tab style
  .replace(
    '"bg-white shadow-sm text-gray-900 ring-1 ring-gray-200"',
    '"bg-white/15 shadow-sm text-white ring-1 ring-white/10"'
  )
  // Inactive tab style
  .replace(
    '"text-gray-500 hover:text-gray-700 hover:bg-gray-100"',
    '"text-white/40 hover:text-white hover:bg-white/10"'
  )
  // Theme tab header text
  .replace(
    '"text-sm font-semibold text-gray-800">Visual Customization',
    '"text-sm font-semibold text-white/80">Visual Customization'
  )
  // Theme tab bg wrapper
  .replace(
    '"bg-gradient-to-br from-indigo-50/50 to-blue-50/50 rounded-2xl p-4 border border-indigo-100/50"',
    '"rounded-2xl p-0"'
  )
  // Settings icon colour
  .replace(
    '"h-4 w-4 text-black-600"',
    '"h-4 w-4 text-white/50"'
  )
  // Settings title text
  .replace(
    '"text-sm font-semibold text-gray-800">Form & Integration',
    '"text-sm font-semibold text-white/80">Form & Integration'
  )
  // Form endpoint card bg
  .replace(
    '"bg-white border border-gray-200 rounded-2xl p-4 space-y-3 shadow-sm"',
    '"bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3"'
  )
  // Contact form label
  .replace(
    '"text-sm font-medium text-gray-700">Contact Form',
    '"text-sm font-medium text-white/70">Contact Form'
  )
  // Connected badge
  .replace(
    '"flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full"',
    '"flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full"'
  )
  // Formspree input
  .replace(
    '"w-full text-sm text-gray-900 placeholder-gray-400 p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"',
    '"w-full text-sm text-white placeholder-white/30 p-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400/50 transition-all"'
  )
  // Endpoint note
  .replace(
    '"text-xs text-gray-400 text-center">',
    '"text-xs text-white/30 text-center">'
  )
  // Quick actions card
  .replace(
    '"bg-white border border-gray-200 rounded-2xl p-4 space-y-2 shadow-sm"',
    '"bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2"'
  )
  // Quick actions title
  .replace(
    '"text-xs font-semibold text-gray-500 uppercase tracking-wide">Quick Actions',
    '"text-xs font-semibold text-white/30 uppercase tracking-wide">Quick Actions'
  )
  // Save button in quick actions
  .replace(
    '"w-full flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 p-2.5 rounded-xl transition-all text-left"',
    '"w-full flex items-center gap-2 text-sm text-white/60 hover:text-white hover:bg-white/10 p-2.5 rounded-xl transition-all text-left"'
  )
  // History button in quick actions
  .replace(
    '"w-full flex items-center gap-2 text-sm text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 p-2.5 rounded-xl transition-all text-left"',
    '"w-full flex items-center gap-2 text-sm text-white/60 hover:text-white hover:bg-white/10 p-2.5 rounded-xl transition-all text-left"'
  );

fs.writeFileSync('src/app/editor/page.tsx', code);
console.log('Sidebar darkened successfully!');
