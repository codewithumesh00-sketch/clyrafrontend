// 🚀 force fresh production build 2026-04-13-v1
export async function generateWebsite(prompt, currentContent = {}) {
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://127.0.0.1:8000";

  try {
    const res = await fetch(`${API_URL}/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        content: currentContent,
      }),
      cache: "no-store",
    });

    const text = await res.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(`Invalid backend JSON: ${text}`);
    }

    if (!res.ok) {
      throw new Error(
        data?.error || `Backend error: ${res.status}`
      );
    }

    if (!data.success) {
      throw new Error(
        data?.error || "Generation failed"
      );
    }

    return data;
  } catch (error) {
    console.error("❌ generateWebsite failed:", error);
    throw error;
  }
}