import os
import glob
import re

templates_dir = r"d:\clyrawebui\frontend\src\templates"

old_body_regex = re.compile(
    r'if\s*\(\s*typeof window !== "undefined" && \(window as any\)\.cloudinary\s*\)\s*\{\s*(?:if\s*\(!process\.env\..*?\)\s*\{\s*console\.warn.*?;?\s*return;?\s*\}\s*)?\(window as any\)\.cloudinary\s*\.createUploadWidget\s*\(\s*\{\s*cloudName.*?\}\s*\)\s*\.open\(\);\s*\}',
    re.DOTALL
)

new_body = """if (typeof window !== "undefined" && (window as any).cloudinary) {
        (window as any).__clyraweb_active_upload_region = typeof regionKey !== "undefined" ? regionKey : (typeof path !== "undefined" ? path : "");
        (window as any).__clyraweb_update_region = updateRegion;
        if (!(window as any).__cloudinaryWidget) {
          (window as any).__cloudinaryWidget = (window as any).cloudinary.createUploadWidget(
            {
              cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
              uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
              multiple: false,
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
    
    if "__clyraweb_active_upload_region" not in content:
        new_content, count = old_body_regex.subn(new_body, content)
        if count > 0:
            with open(f, "w", encoding="utf-8") as file:
                file.write(new_content)
            print(f"Updated {f}")
        else:
            print(f"Not found in {f}")
