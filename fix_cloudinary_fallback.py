import os
import glob
import re

templates_dir = r"d:\clyraui\frontend\src\templates"
files = glob.glob(os.path.join(templates_dir, "*.tsx"))

for f in files:
    with open(f, "r", encoding="utf-8") as file:
        content = file.read()
    
    # We want to find:
    # cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "demo",
    # uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "docs_upload_example_us_preset",
    
    new_logic = """cloudName: (process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME && process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET) ? process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME : "demo",
            uploadPreset: (process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME && process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET) ? process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET : "docs_upload_example_us_preset","""
            
    # Regex to replace the old logic
    pattern = r'cloudName:\s*process\.env\.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME\s*\|\|\s*"demo",\s*uploadPreset:\s*process\.env\.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET\s*\|\|\s*"docs_upload_example_us_preset",'
    
    new_content, count = re.subn(pattern, new_logic, content)
    
    if count > 0:
        with open(f, "w", encoding="utf-8") as file:
            file.write(new_content)
        print("Fixed " + f)
