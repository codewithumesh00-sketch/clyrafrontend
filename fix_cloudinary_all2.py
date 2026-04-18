import os
import glob
import re

templates_dir = r"d:\clyraui\frontend\src\templates"

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
    
    # We will find the function `const handleImageUpload = ...`
    func_regex = re.compile(r'const handleImageUpload = (?:useCallback\(\s*)?\((.*?)\) => \{([\s\S]*?)\n  \}(?:,\s*\[.*?\]\s*\))?;')
    
    def replacement(match):
        args = match.group(1)
        body = match.group(2)
        full_match = match.group(0)
        
        # If it already has "demo", skip it
        if "cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || \"demo\"" in body:
            return full_match
            
        if "cloudinary.createUploadWidget" in body:
            if "useCallback" in full_match:
                return f'const handleImageUpload = useCallback(({args}) => {{\n    {new_body}\n  }}, [updateRegion]);'
            else:
                return f'const handleImageUpload = ({args}) => {{\n    {new_body}\n  }};'
        return full_match

    new_content, count = func_regex.subn(replacement, content)
    
    if count > 0 and content != new_content:
        with open(f, "w", encoding="utf-8") as file:
            file.write(new_content)
        print(f"Updated {f}")
    else:
        print(f"Skipped {f}")
