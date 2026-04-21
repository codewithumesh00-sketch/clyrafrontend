
# Fix templates where isPublished was added to updateRegion line
# but NOT to the TemplateProps type or function signature

$templatesDir = "d:\clyraui\frontend\src\templates"

# Check all templates for broken state
$broken = @()
foreach ($n in (3..40)) {
    $path = Join-Path $templatesDir "template$n.tsx"
    if (-not (Test-Path $path)) { continue }
    $content = Get-Content $path -Raw -Encoding UTF8
    
    # isPublished used in code but NOT in TemplateProps
    if ($content -match 'isPublished' -and $content -notmatch 'isPublished\?:') {
        $broken += $n
        Write-Host "BROKEN: template$n.tsx (has isPublished usage but missing type/prop)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Broken templates: $($broken -join ', ')" -ForegroundColor Yellow

# Fix each broken template
foreach ($n in $broken) {
    $path = Join-Path $templatesDir "template$n.tsx"
    $content = Get-Content $path -Raw -Encoding UTF8

    # 1. Add isPublished to TemplateProps if missing
    if ($content -notmatch 'isPublished\?:') {
        # Pattern: "type TemplateProps = {" ... "editableData?: any;"
        $content = $content -replace '(editableData\?: any;)', '$1' + "`r`n  isPublished?: boolean;"
        Write-Host "  Fixed TemplateProps for template$n" -ForegroundColor Cyan
    }

    # 2. Fix function signature - multiple patterns
    # Pattern A: { editableData }: TemplateProps
    if ($content -match "Template$n\(\{ editableData \}: TemplateProps\)") {
        $content = $content -replace "Template$n\(\{ editableData \}: TemplateProps\)", "Template$n({ editableData, isPublished = false }: TemplateProps)"
        Write-Host "  Fixed function signature (A) for template$n" -ForegroundColor Cyan
    }
    # Pattern B: { editableData }: { editableData?: any; }
    elseif ($content -match "Template$n\(\{`n\s+editableData,`n\}: \{") {
        # handled below
    }
    # Pattern C: editableData,\n}: TemplateProps)
    elseif ($content -match "editableData,\r?\n\}: TemplateProps\)") {
        $content = $content -replace "(editableData,\r?\n\}: TemplateProps\))", "editableData,`r`n  isPublished = false,`r`n}: TemplateProps)"
        Write-Host "  Fixed function signature (C) for template$n" -ForegroundColor Cyan
    }

    [System.IO.File]::WriteAllText($path, $content, [System.Text.Encoding]::UTF8)
    Write-Host "  Saved template$n" -ForegroundColor Green
}

Write-Host ""
Write-Host "Done fixing broken templates!" -ForegroundColor White
