import re

with open("src/app/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("setCopied(false);", "")
content = content.replace("setBlogCopied(false);", "")
content = content.replace("deployConfig.projectName", '"clyraweb-project"')
content = content.replace("deployConfig.platform", '"auto"')

with open("src/app/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("TS errors removed!")
