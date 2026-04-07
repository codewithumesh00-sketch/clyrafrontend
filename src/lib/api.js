export async function generateWebsite(prompt, currentContent = {}) {
  const res = await fetch("http://127.0.0.1:8000/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
      content: currentContent,
    }),
  });

  const data = await res.json();

  if (!data.success) {
    throw new Error(data.error || "Generation failed");
  }

  return data;
}