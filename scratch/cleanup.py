import re

with open("src/app/page.tsx", "r", encoding="utf-8") as f:
    lines = f.readlines()

new_lines = []
skip = False

i = 0
while i < len(lines):
    line = lines[i]
    
    # 1. Remove deploy states
    if "// Deploy States" in line:
        i += 9  # Skip the next 9 lines including this one
        continue
        
    # 2. Remove copied states
    if "const [copied, setCopied]" in line:
        i += 1
        continue
    if "const [blogCopied, setBlogCopied]" in line:
        i += 1
        continue
        
    # 3. Remove handleCopy function
    if "const handleCopy = async () => {" in line:
        while i < len(lines) and not lines[i].startswith("  };"):
            i += 1
        i += 1 # skip "  };\n"
        continue
        
    # 4. Remove handleDownload and isDownloading
    if "const [isDownloading, setIsDownloading] = useState(false);" in line:
        i += 1
        continue
    if "const handleDownload = async () => {" in line:
        while i < len(lines) and not (lines[i].startswith("  };") and "setIsDownloading(false)" in lines[i-2]):
            i += 1
        i += 1 # skip "  };\n"
        continue

    # 5. Remove handleDeploy function
    if "const handleDeploy = async () => {" in line:
        while i < len(lines) and not (lines[i].startswith("  };") and "setIsDeploying(false)" in lines[i-2]):
            i += 1
        i += 1
        continue
        
    # 6. Remove Deploy/Download/Copy buttons from UI (header bar)
    # The header bar has them around line 1230+
    if '<button onClick={() => setShowDeployModal(true)}' in line:
        i += 1
        continue
    if '<button onClick={handleDownload}' in line:
        i += 1
        continue
    if '<button onClick={handleCopy}' in line:
        while i < len(lines) and "</button>" not in lines[i]:
            i += 1
        i += 1
        continue
        
    # 7. Remove showDeployModal JSX block at the bottom
    if "{showDeployModal && (" in line:
        while i < len(lines) and not (lines[i].strip() == ")}"):
            i += 1
        i += 1 # skip ")} \n"
        continue

    # 8. Logo Replacement: "clyrawebWeb" and Sparkles in sidebar
    if "<Sparkles size={18} className=" in line:
        # It's an icon, we'll replace the text
        pass
    
    new_lines.append(line)
    i += 1

content = "".join(new_lines)

# Replace remaining logos and Sparkles
content = content.replace(
    '<div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20">\n              <Layout size={18} className="text-white" />\n            </div>\n            <span className="font-semibold text-sm"> clyrawebWeb</span>',
    '<img src="https://res.cloudinary.com/dpfdfqvst/image/upload/q_auto/f_auto/v1776650829/Gemini_Generated_Image_hzm9u7hzm9u7hzm9-removebg-preview_x9od8p.png" alt="Logo" className="w-8 h-8 object-contain" />'
)

# Footer text / Header text replacements
content = content.replace("clyrawebWeb", "Your AI Builder") # generic fallback for titles

with open("src/app/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("page.tsx cleanup complete.")
