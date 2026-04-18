import os
import glob
import re

templates_dir = r"d:\clyraui\frontend\src\templates"

old_body_regex = re.compile(
    r'if\s*\(\s*typeof window !== "undefined" && \(window as any\)\.cloudinary\s*\)\s*\{\s*(?:if\s*\(!process\.env\..*?\)\s*\{\s*console\.(?:error|warn).*?;?\s*return;?\s*\}\s*)?(?:.*?)createUploadWidget\s*\([\s\S]*?\}\s*\);?\s*\}?\s*\(window as any\)(?:\.__cloudinaryWidget)?\.open\(\);\s*\}',
    re.DOTALL
)

new_body = """if (typeof window !== "undefined" && (window as any).cloudinary) {
      const activeRegionKey = typeof regionKey !== "undefined" ? regionKey : (typeof path !== "undefined" ? path : "");
      (window as any).__clyraweb_active_upload_region = activeRegionKey;
      (window as any).__clyraweb_update_region = updateRegion;

      if (!(window as any).__cloudinaryWidget) {
        (window as any).__cloudinaryWidget = (window as any).cloudinary.createUploadWidget(
          {
            cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "demo",
            uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "docs_upload_example_us_preset",
            multiple: false,
            clientAllowedFormats: ["jpg", "jpeg", "png", "webp", "gif", "svg"],
            maxImageFileSize: 5000000,
          },
          (error: any, result: any) => {
            if (!error && result && result.event === "success") {
              const activeRegion = (window as any).__clyraweb_active_upload_region;
              const updateFn = (window as any).__clyraweb_update_region;
              if (activeRegion && updateFn) {
                updateFn(activeRegion, result.info.secure_url);
              }
            }
          }
        );
      }
      (window as any).__cloudinaryWidget.open();
    }"""

files = glob.glob(os.path.join(templates_dir, "*.tsx"))
for f in files:
    with open(f, "r", encoding="utf-8") as file:
        content = file.read()
    
    # Simple replacement string search to find the body of the function
    # Wait, regex is safer. Let's just do a string replacement of the function
    
    # We will find the function `const handleImageUpload = (args) => { ... }`
    func_regex = re.compile(r'const handleImageUpload = \((.*?)\) => \{([\s\S]*?)\n  \};')
    
    def replacement(match):
        args = match.group(1)
        body = match.group(2)
        if "cloudinary.createUploadWidget" in body:
            return f'const handleImageUpload = ({args}) => {{\n    {new_body}\n  }};'
        return match.group(0)

    new_content, count = func_regex.subn(replacement, content)
    
    if count > 0 and content != new_content:
        with open(f, "w", encoding="utf-8") as file:
            file.write(new_content)
        print(f"Updated {f}")
    else:
        print(f"Skipped {f}")
