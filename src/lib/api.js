export async function generateWebsite(prompt, currentContent = {}) {
  const API_URL = (
    process.env.NEXT_PUBLIC_API_URL ||
    "https://clyrawebbackend-666777548.europe-west1.run.app"
  ).replace(/\/$/, "");

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

    // 🔥 Important: handle non-JSON safely
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`HTTP ${res.status}: ${text}`);
    }

    const data = await res.json();

    if (!data.success) {
      throw new Error(data?.error || "Generation failed");
    }

    return data;
  } catch (error) {
    console.error("❌ generateWebsite failed:", error);
    throw error;
  }
}