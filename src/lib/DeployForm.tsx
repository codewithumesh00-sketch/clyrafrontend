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
  const [progress, setProgress] = useState(0);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const handleDeploy = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!user) return setError("Please log in to deploy");
    if (!projectName.trim()) return setError("Project name is required");
    if (!currentWebsite) return setError("No website selected");

    setIsDeploying(true);
    setProgress(0);
    setResultUrl(null);
    
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 97) {
          clearInterval(progressInterval);
          return 97;
        }
        return prev + Math.floor(Math.random() * 3) + 1;
      });
    }, 200);

    try {
      const token = await user.getIdToken();
      const templateId = currentWebsite.templateId || "template1";
      const templateEntry = resolveTemplate(templateId);

      if (!templateEntry?.component) {
        throw new Error(`Template not found: ${templateId}`);
      }

      const schemaRaw = localStorage.getItem("clyraweb-template-schema");
      if (!schemaRaw) {
        throw new Error("Website schema not found");
      }

      const parsedSchema = JSON.parse(schemaRaw);

      const staticHtml = ReactDOMServer.renderToStaticMarkup(
        React.createElement(templateEntry.component, {
          editableData: parsedSchema.editableData || {},
          isPublished: true,
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

      clearInterval(progressInterval);
      setProgress(100);
      setSuccess(true);
      setProjectName("");

      if (result?.url) {
        setResultUrl(result.url);
        window.open(result.url, "_blank");
      }
    } catch (err) {
      clearInterval(progressInterval);
      setProgress(0);
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
        disabled={isDeploying}
      />
      {error && <div className="p-3 bg-red-100 text-red-700 rounded-xl">{error}</div>}
      
      {(isDeploying || success) && (
        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-blue-600 h-3 transition-all duration-300 ease-out" 
            style={{ width: `${progress}%` }} 
          />
        </div>
      )}
      {isDeploying && <div className="text-center text-xs text-gray-500 font-medium">Deploying... {progress}%</div>}
      
      {success && resultUrl && (
        <div className="p-3 bg-green-50 text-green-700 rounded-xl border border-green-200">
          <div className="font-semibold mb-1">Deployed successfully!</div>
          <a href={resultUrl} target="_blank" rel="noopener noreferrer" className="underline text-sm truncate block break-all">
            {resultUrl}
          </a>
        </div>
      )}
      
      <button type="submit" disabled={isDeploying} className="w-full p-3 rounded-xl bg-blue-600 text-white disabled:opacity-50">
        {isDeploying ? "Publishing..." : "Publish to Netlify"}
      </button>
    </form>
  );
}
