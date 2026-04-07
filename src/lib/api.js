export async function generateWebsite(prompt, currentContent = {}) {
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://clyrawebbackend-666777548.europe-west1.run.app";

  const res = await fetch(`${API_URL}/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
      content: currentContent,
    }),
  });

  if (!res.ok) {
    throw new Error(`Backend error: ${res.status}`);
  }

  const data = await res.json();

  if (!data.success) {
    throw new Error(data.error || "Generation failed");
  }

  return data;
}