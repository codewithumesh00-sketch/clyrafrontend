import os
import glob
import re

templates_dir = r"d:\clyraui\frontend\src\templates"

# We want to replace the bad activeRegionKey line.
bad_line = 'const activeRegionKey = typeof regionKey !== "undefined" ? regionKey : (typeof path !== "undefined" ? path : "");'

files = glob.glob(os.path.join(templates_dir, "*.tsx"))

for f in files:
    with open(f, "r", encoding="utf-8") as file:
        content = file.read()
    
    if bad_line in content:
        # We need to find the function signature to know if it's regionKey or path
        # It looks like: const handleImageUpload = (regionKey: string) => {
        # or const handleImageUpload = (path: string) => {
        
        match_region = re.search(r'const handleImageUpload = (?:\(.*?\))?\s*\(\s*regionKey\s*(?:.*?)?\)\s*=>', content)
        match_path = re.search(r'const handleImageUpload = (?:\(.*?\))?\s*\(\s*path\s*(?:.*?)?\)\s*=>', content)
        
        arg_name = "regionKey"
        if match_path and not match_region:
            arg_name = "path"
            
        new_line = f'const activeRegionKey = {arg_name};'
        
        new_content = content.replace(bad_line, new_line)
        
        with open(f, "w", encoding="utf-8") as file:
            file.write(new_content)
        print("Fixed " + f)
