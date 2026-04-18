export async function generateWebsite(prompt, currentContent = {}) {
  const API_URL = (
    process.env.NEXT_PUBLIC_API_URL ||
    "http://127.0.0.1:7240"
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

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data?.error || "Generation failed");
    }

    return data;
  } catch (error) {
    console.error("❌ generateWebsite failed:", error);
    throw error;
  }
}