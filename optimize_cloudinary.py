import os
import glob
import re

templates_dir = r"d:\clyrawebui\frontend\src\templates"

# Regex for handleImageUpload
regex = re.compile(r"(\s*)const handleImageUpload = \((.*?)\) => \{\s*if \(typeof window !== \"undefined\" && \(window as any\)\.cloudinary\) \{\s*\(window as any\)\.cloudinary\s*\.createUploadWidget\(\s*\{\s*cloudName: process\.env\.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,\s*uploadPreset: process\.env\.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,\s*multiple: false,?\s*\},?\s*\((error: any, result: any|.*?)\) => \{\s*if \(!error && result && result\.event === \"success\"\) \{\s*updateRegion\((.*?), result\.info\.secure_url\);\s*\}\s*\}\s*\)\s*\.open\(\);\s*\}\s*\};", re.DOTALL)

def replacement(match):
    indent = match.group(1)
    arg_name = match.group(2)
    error_result_args = match.group(3)
    update_arg = match.group(4)
    
    return f"""{indent}const handleImageUpload = ({arg_name}) => {{
{indent}  if (typeof window !== "undefined" && (window as any).cloudinary) {{
{indent}    (window as any).__clyraweb_active_upload_region = {update_arg};
{indent}    (window as any).__clyraweb_update_region = updateRegion;
{indent}    if (!(window as any).__cloudinaryWidget) {{
{indent}      (window as any).__cloudinaryWidget = (window as any).cloudinary.createUploadWidget(
{indent}        {{
{indent}          cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
{indent}          uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
{indent}          multiple: false,
{indent}        }},
{indent}        ({error_result_args}) => {{
{indent}          if (!error && result && result.event === "success") {{
{indent}            const activeRegion = (window as any).__clyraweb_active_upload_region;
{indent}            const updateFn = (window as any).__clyraweb_update_region;
{indent}            if (activeRegion && updateFn) {{
{indent}              updateFn(activeRegion, result.info.secure_url);
{indent}            }}
{indent}          }}
{indent}        }}
{indent}      );
{indent}    }}
{indent}    (window as any).__cloudinaryWidget.open();
{indent}  }}
{indent}}};"""

files = glob.glob(os.path.join(templates_dir, "*.tsx"))
for f in files:
    with open(f, "r", encoding="utf-8") as file:
        content = file.read()
    
    new_content, count = regex.subn(replacement, content)
    if count > 0:
        with open(f, "w", encoding="utf-8") as file:
            file.write(new_content)
        print(f"Updated {f}")
    else:
        print(f"Not found in {f}")
