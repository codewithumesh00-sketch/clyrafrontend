
# ============================================================
# Batch-update ContactView in template3 to template40
# Adds: phone field, stateful form, formspree, isPublished safety
# ============================================================

$templatesDir = "d:\clyraui\frontend\src\templates"
$templateNumbers = 3..40

# This is the standardized ContactView block to inject.
# We reference $formspreeEndpoint and $isPublished and $theme which are
# already in scope inside each template component.
$newContactView = @'
  // ========== CONTACT VIEW ==========
  const ContactView = () => {
    const [formData, setFormData] = React.useState({ name: "", email: "", phone: "", message: "" });
    const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!formspreeEndpoint) {
        alert("⚠️ Form is not connected. Please add your Formspree endpoint in the editor.");
        return;
      }
      setStatus("loading");
      try {
        const res = await fetch(formspreeEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          setStatus("success");
          setFormData({ name: "", email: "", phone: "", message: "" });
          setTimeout(() => setStatus("idle"), 5000);
        } else throw new Error();
      } catch {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 5000);
      }
    };

    return (
      <div>
        <Section id="contact-header">
          <div className="text-center max-w-3xl mx-auto">
            <EditableText as="h1" regionKey="contact.title" fallback="Let's Connect" className="text-5xl md:text-6xl font-black tracking-tighter block mb-6" />
            <EditableText as="p" regionKey="contact.subtitle" fallback="Ready to work together? Reach out and let's start the conversation." className="text-xl opacity-70 block" />
          </div>
        </Section>

        <Section id="contact-form">
          <div className="grid md:grid-cols-2 gap-16">
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold mb-4">Visit Us</h3>
                <EditableText regionKey="contact.address" fallback="123 Business Avenue, Suite 100, New York, NY 10001" className="opacity-70 block" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-4">Contact Info</h3>
                <EditableText regionKey="contact.email" fallback="hello@example.com" className="opacity-70 block mb-2" />
                <EditableText regionKey="contact.phone" fallback="+1 (555) 123-4567" className="opacity-70 block" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-4">Follow Us</h3>
                <div className="flex gap-4">
                  {["LinkedIn", "Twitter", "Instagram"].map((social) => (
                    <span key={social} className="cursor-pointer hover:underline" style={{ color: theme.primaryColor }}>{social}</span>
                  ))}
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                className="w-full p-4 bg-transparent border-b outline-none focus:border-blue-500 transition-colors"
                style={{ borderColor: `${theme.textColor}20` }}
                required
                disabled={status === "loading"}
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Email"
                className="w-full p-4 bg-transparent border-b outline-none focus:border-blue-500 transition-colors"
                style={{ borderColor: `${theme.textColor}20` }}
                required
                disabled={status === "loading"}
              />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Your Phone"
                className="w-full p-4 bg-transparent border-b outline-none focus:border-blue-500 transition-colors"
                style={{ borderColor: `${theme.textColor}20` }}
                required
                disabled={status === "loading"}
              />
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your Message"
                rows={5}
                className="w-full p-4 bg-transparent border-b outline-none focus:border-blue-500 transition-colors resize-none"
                style={{ borderColor: `${theme.textColor}20` }}
                required
                disabled={status === "loading"}
              />
              <button
                type="submit"
                disabled={status === "loading" || !formspreeEndpoint}
                className={`w-full py-4 font-bold uppercase tracking-widest text-sm transition-all ${status === "loading" || !formspreeEndpoint ? "opacity-60 cursor-not-allowed" : "hover:opacity-90 active:scale-[0.98]"}`}
                style={{ backgroundColor: theme.primaryColor, color: "#fff", borderRadius: `${theme.borderRadius}px` }}
              >
                {status === "loading" ? "Sending..." : "Send Message"}
              </button>
              {status === "success" && <p className="text-green-500 text-sm font-medium animate-in fade-in">✓ Message sent successfully!</p>}
              {status === "error" && <p className="text-red-500 text-sm font-medium animate-in fade-in">❌ Something went wrong. Please try again.</p>}
              {!formspreeEndpoint && !isPublished && <p className="text-amber-500 text-xs">⚠️ Connect your Formspree endpoint in the editor</p>}
            </form>
          </div>
        </Section>
      </div>
    );
  };
'@

$updated = 0
$skipped = 0
$errors = 0

foreach ($n in $templateNumbers) {
    $filePath = Join-Path $templatesDir "template$n.tsx"
    
    if (-not (Test-Path $filePath)) {
        Write-Host "⚠️  template$n.tsx not found, skipping." -ForegroundColor Yellow
        $skipped++
        continue
    }

    $content = Get-Content $filePath -Raw -Encoding UTF8

    # ── Check 1: isPublished prop ──────────────────────────────────────────────
    # Many old templates don't have isPublished. We need to add it.
    # Pattern: "export default function TemplateN({ editableData }: TemplateProps)"
    #      or: "export default function TemplateN({ editableData, isPublished = false }: TemplateProps)"
    if ($content -notmatch 'isPublished') {
        # Add isPublished to TemplateProps type
        $content = $content -replace '(type TemplateProps = \{[^}]*editableData\?: any;)', '$1' + "`n  isPublished?: boolean;"

        # Add isPublished parameter to function signature
        $content = $content -replace `
            "export default function Template$n\(\{ editableData \}: TemplateProps\)", `
            "export default function Template$n({ editableData, isPublished = false }: TemplateProps)"
        
        Write-Host "  ✅ Added isPublished to Template$n" -ForegroundColor Cyan
    }

    # ── Check 2: storeEndpoint + formspreeEndpoint ────────────────────────────
    if ($content -notmatch 'formspreeEndpoint') {
        # Find updateRegion line and add after it
        $formspreeBlock = @'

  const storeEndpoint = useWebsiteBuilderStore(
    (state: any) => state.schema?.editableData?.formspreeEndpoint
  );
  const formspreeEndpoint = isPublished
    ? editableData?.formspreeEndpoint
    : storeEndpoint || editableData?.formspreeEndpoint;
'@
        # Insert after the updateRegion line
        $content = $content -replace `
            '(const updateRegion = useWebsiteBuilderStore\([^;]+;\r?\n)', `
            '$1' + $formspreeBlock + "`r`n"
        
        Write-Host "  ✅ Added formspreeEndpoint to Template$n" -ForegroundColor Cyan
    }

    # ── Check 3: safe updateRegion (proxy for isPublished) ────────────────────
    # Replace direct hook call with safe proxy pattern
    $content = $content -replace `
        'const updateRegion = useWebsiteBuilderStore\(\(state: any\) => state\.updateRegion\);', `
        "const storeUpdateRegion = useWebsiteBuilderStore((state: any) => state.updateRegion);`r`n  const updateRegion = isPublished ? () => { } : storeUpdateRegion;"

    # ── Check 4: Replace the entire ContactView ───────────────────────────────
    # We use a regex that matches from "const ContactView" through its closing ";" or "};"
    # The pattern covers both arrow-function-JSX and stateful forms.
    # Strategy: match from the ContactView declaration to the line that is just "  };" or "  );"
    # followed by a blank line or another const/return.

    # We'll use a greedy match from ContactView start to the next top-level component or return
    $contactViewPattern = '(?s)(  // =+\s*CONTACT VIEW =+\s*\r?\n)?  const ContactView = \(\) =>.*?(?=\r?\n\r?\n  (?:const |//|return ))'
    
    if ($content -match $contactViewPattern) {
        $content = [regex]::Replace($content, $contactViewPattern, $newContactView)
        Write-Host "✅ Updated ContactView in template$n.tsx" -ForegroundColor Green
        $updated++
    } else {
        Write-Host "⚠️  Could not find ContactView pattern in template$n.tsx" -ForegroundColor Yellow
        $skipped++
        continue
    }

    # ── Write back ────────────────────────────────────────────────────────────
    try {
        [System.IO.File]::WriteAllText($filePath, $content, [System.Text.Encoding]::UTF8)
    } catch {
        Write-Host "❌ Failed to write template$n.tsx: $_" -ForegroundColor Red
        $errors++
    }
}

Write-Host ""
Write-Host "=======================================" -ForegroundColor White
Write-Host "✅ Updated : $updated templates" -ForegroundColor Green
Write-Host "⚠️  Skipped : $skipped templates" -ForegroundColor Yellow
Write-Host "❌ Errors  : $errors templates" -ForegroundColor Red
Write-Host "=======================================" -ForegroundColor White
