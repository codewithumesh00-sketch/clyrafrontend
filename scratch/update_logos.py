import re

# 1. Update src/app/login/page.tsx
# In login/page.tsx, it's a dark mode page, so we use qoawvdqoawvdqoaw_wk3t7j.png
with open("src/app/login/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Replace Navbar logo
content = re.sub(
    r'<div className="flex items-center gap-2">\s*<div className="[^"]+">\s*<Sparkles size={20} className="text-white" />\s*</div>\s*<span className="font-bold text-xl text-white">\s*clyrawebWeb\s*</span>\s*</div>',
    '<img src="https://res.cloudinary.com/dzwxmiu47/image/upload/q_auto/f_auto/v1776653092/Gemini_Generated_Image_qoawvdqoawvdqoaw_wk3t7j.png" alt="clyrawebWeb" className="h-10 md:h-12 w-auto object-contain" />',
    content
)

# Replace Hero logo
content = re.sub(
    r'<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 mb-8">\s*<Sparkles size={16} className="text-violet-400" />\s*<span className="text-sm text-white font-medium">clyrawebWeb AI Builder</span>\s*</div>',
    '<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 mb-8"><img src="https://res.cloudinary.com/dzwxmiu47/image/upload/q_auto/f_auto/v1776653092/Gemini_Generated_Image_qoawvdqoawvdqoaw_wk3t7j.png" alt="clyrawebWeb" className="h-6 md:h-8 w-auto object-contain" /><span className="text-sm text-white font-medium">AI Builder</span></div>',
    content
)

# Replace Footer logo
content = re.sub(
    r'<div className="flex items-center justify-center gap-2 mb-4">\s*<div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">\s*<Sparkles size={18} className="text-white" />\s*</div>\s*<span className="text-lg font-bold text-white">clyrawebWeb</span>\s*</div>',
    '<img src="https://res.cloudinary.com/dzwxmiu47/image/upload/q_auto/f_auto/v1776653092/Gemini_Generated_Image_qoawvdqoawvdqoaw_wk3t7j.png" alt="clyrawebWeb" className="h-10 md:h-12 w-auto object-contain mx-auto mb-4" />',
    content
)

# Replace Login modal logo
content = re.sub(
    r'<div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl shadow-violet-500/20 mb-6 mx-auto">\s*<Sparkles size={32} className="text-white" />\s*</div>\s*<h2 className="text-2xl font-bold text-white mb-2">Welcome to clyrawebWeb</h2>',
    '<img src="https://res.cloudinary.com/dzwxmiu47/image/upload/q_auto/f_auto/v1776653092/Gemini_Generated_Image_qoawvdqoawvdqoaw_wk3t7j.png" alt="clyrawebWeb" className="h-14 md:h-20 w-auto object-contain mx-auto mb-6 shadow-xl shadow-violet-500/20" />\n              <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>',
    content
)

with open("src/app/login/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)


# 2. Update src/app/page.tsx
with open("src/app/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# The script replaced the sidebar logo with an img tag already.
# We need to change it to conditionally render light/dark logos
new_logo_tag = '<img src={isDark ? "https://res.cloudinary.com/dzwxmiu47/image/upload/q_auto/f_auto/v1776653092/Gemini_Generated_Image_qoawvdqoawvdqoaw_wk3t7j.png" : "https://res.cloudinary.com/dzwxmiu47/image/upload/q_auto/f_auto/v1776653092/Gemini_Generated_Image_t3eylit3eylit3ey_cdkk4p.png"} alt="Logo" className="h-8 md:h-10 w-auto object-contain" />'

# Find the old img tag
content = re.sub(
    r'<img src="https://res.cloudinary.com/dpfdfqvst[^"]+" alt="Logo" className="[^"]+" />',
    new_logo_tag,
    content
)

with open("src/app/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)


# 3. Update src/app/editor/page.tsx
with open("src/app/editor/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Replace logo
content = re.sub(
    r'<div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">\s*<span className="text-white font-bold text-sm">C</span>\s*</div>\s*<h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">\s*clyraweb\s*</h1>',
    '<img src="https://res.cloudinary.com/dzwxmiu47/image/upload/q_auto/f_auto/v1776653092/Gemini_Generated_Image_t3eylit3eylit3ey_cdkk4p.png" alt="clyraweb" className="h-8 md:h-12 w-auto object-contain" />',
    content
)

with open("src/app/editor/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Logos updated successfully!")
