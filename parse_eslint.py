import codecs
with codecs.open(r"d:\clyrawebui\frontend\eslint.txt", "r", "utf-16le") as f:
    lines = f.readlines()

for line in lines:
    if "error" in line.lower() and "warning" not in line.lower():
        print(line.strip())
