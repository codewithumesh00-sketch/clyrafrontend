import codecs
with codecs.open(r"d:\clyrawebui\frontend\eslint.txt", "r", "utf-16le") as f:
    lines = f.readlines()

current_file = ""
for line in lines:
    if line.startswith("D:\\"):
        current_file = line.strip()
    elif "error" in line.lower() and "warning" not in line.lower() and "✖" not in line.lower():
        print(current_file)
        print(line.strip())
