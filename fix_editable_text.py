import os

templates_dir = r"d:\clyraui\frontend\src\templates"
files = ['template11.tsx', 'template12.tsx', 'template19.tsx', 'template35.tsx', 'template36.tsx', 'template40.tsx']

editable_text_code = """
  const EditableText = ({ regionKey, fallback, as: Tag = "span", className = "" }: any) => {
    const hookValue = useRegionValue(regionKey);
    const dataValue = getNestedValue(editableData, regionKey);
    const content = hookValue ?? dataValue ?? fallback;

    return (
      <Tag
        contentEditable
        suppressContentEditableWarning
        onBlur={(e: React.FocusEvent<HTMLElement>) => {
          const val = e.currentTarget.innerText;
          if (val !== content) updateRegion(regionKey, val);
        }}
        onDoubleClick={(e: React.MouseEvent) => {
          e.stopPropagation();
          (e.currentTarget as HTMLElement).focus();
        }}
        className={`focus:outline-none focus:ring-2 focus:ring-blue-400 rounded transition-all ${className}`}
      >
        {content}
      </Tag>
    );
  };

  const EditableImg"""

for f in files:
    path = os.path.join(templates_dir, f)
    with open(path, "r", encoding="utf-8") as file:
        content = file.read()
    
    if "const EditableText" not in content and "const EditableImg" in content:
        new_content = content.replace("  const EditableImg", editable_text_code)
        with open(path, "w", encoding="utf-8") as file:
            file.write(new_content)
        print("Fixed " + f)
