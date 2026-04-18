import json
import codecs

try:
    with codecs.open(r"d:\clyrawebui\frontend\eslint.json", "r", "utf-16le") as f:
        data = json.load(f)
except:
    with open(r"d:\clyrawebui\frontend\eslint.json", "r", encoding="utf-8") as f:
        data = json.load(f)

for item in data:
    if item.get("errorCount", 0) > 0:
        print(f"File: {item['filePath']}")
        for msg in item["messages"]:
            if msg.get("severity") == 2:
                print(f"  Line {msg['line']}: {msg['message']} ({msg.get('ruleId')})")
