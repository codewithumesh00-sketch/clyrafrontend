"use client";

import React, { useState } from "react";
import ReactDOMServer from "react-dom/server";
import { validateApiResponse } from "@/utils/security";
import DeploySkeleton from "@/components/LoaderSkeleton";
import { useAuth } from "@/hooks/useAuth";
import { useWebsiteBuilderStore } from "@/store/useWebsiteBuilderStore";
import { resolveTemplate } from "@/templates/templateRegistry";

interface DeployFormProps {
  assets?: File[];
}

export default function DeployForm({ assets = [] }: DeployFormProps) {
  const { user, loading: authLoading } = useAuth();
  const currentWebsite = useWebsiteBuilderStore(
    (state: any) => state.currentWebsite
  );

  const [projectName, setProjectName] = useState("");
  const [isDeploying, setIsDeploying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleDeploy = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!user) return setError("Please log in to deploy");
    if (!projectName.trim()) return setError("Project name is required");
    if (!currentWebsite) return setError("No website selected");

    setIsDeploying(true);

    try {
      const token = await user.getIdToken();
      const templateId = currentWebsite.templateId || "template1";
      const templateEntry = resolveTemplate(templateId);

      if (!templateEntry?.component) {
        throw new Error(`Template not found: ${templateId}`);
      }

      const schemaRaw = localStorage.getItem("clyra-template-schema");
      if (!schemaRaw) {
        throw new Error("Website schema not found");
      }

      const parsedSchema = JSON.parse(schemaRaw);

      const staticHtml = ReactDOMServer.renderToStaticMarkup(
        React.createElement(templateEntry.component, {
          editableData: parsedSchema.editableData || {},
        })
      );

      const websiteHtmlOnly = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<script src="https://cdn.tailwindcss.com"></script>
<style>body{margin:0;padding:0;background:white}</style>
</head>
<body>${staticHtml}</body>
</html>`;

      const generatedFiles = {
        "index.html": websiteHtmlOnly,
      };

      const response = await fetch("/api/netlify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          siteId: process.env.NEXT_PUBLIC_NETLIFY_SITE_ID,
          files: generatedFiles,
        }),
      });

      await validateApiResponse(response);

      const result = await response.json();
      console.log("FULL DEPLOY RESULT:", result);

      setSuccess(true);
      setProjectName("");

      if (result?.url) {
        window.open(result.url, "_blank");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Deploy failed");
    } finally {
      setIsDeploying(false);
    }
  };

  if (authLoading) return <DeploySkeleton />;

  return (
    <form onSubmit={handleDeploy} className="space-y-4 rounded-2xl border p-6 shadow-sm bg-white">
      <input
        type="text"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
        className="w-full p-3 border rounded-xl"
        placeholder="my-awesome-project"
      />
      {error && <div className="p-3 bg-red-100 text-red-700 rounded-xl">{error}</div>}
      {success && <div className="p-3 bg-green-100 text-green-700 rounded-xl">Deployed successfully</div>}
      <button type="submit" className="w-full p-3 rounded-xl bg-blue-600 text-white">
        {isDeploying ? "Deploying..." : "Publish to Netlify"}
      </button>
    </form>
  );
}
