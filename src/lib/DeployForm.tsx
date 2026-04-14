"use client";

import React, { useState } from "react";
import { validateApiResponse } from "@/utils/security";
import DeploySkeleton from "@/components/LoaderSkeleton";
import { useAuth } from "@/hooks/useAuth";
import { useWebsiteBuilderStore } from "@/store/useWebsiteBuilderStore";
import { resolveTemplate } from "@/templates/templateRegistry";
import { exportReactTemplate } from "@/lib/exportReactTemplate";

interface DeployFormProps {
  assets?: File[];
}

export default function DeployForm({
  assets = [],
}: DeployFormProps) {
  const { user, loading: authLoading } = useAuth();

  const currentWebsite = useWebsiteBuilderStore(
    (state: any) => state.currentWebsite
  );

  const [projectName, setProjectName] = useState("");
  const [isDeploying, setIsDeploying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleDeploy = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!user) {
      setError("Please log in to deploy");
      return;
    }

    if (!projectName.trim()) {
      setError("Project name is required");
      return;
    }

    if (!currentWebsite) {
      setError("No website selected");
      return;
    }

    // ✅ IMPORTANT loading state
    setIsDeploying(true);

    try {
      const token = await user.getIdToken();

      const templateId =
        currentWebsite.templateId || "template1";

      const templateEntry = resolveTemplate(templateId);

      if (!templateEntry?.component) {
        throw new Error(
          `Template not found: ${templateId}`
        );
      }

      const generatedFiles = exportReactTemplate(
        
        templateEntry.component,
        currentWebsite.editableData || {}
      );

      const formData = new FormData();
      formData.append("projectName", projectName);
      formData.append(
        "files",
        JSON.stringify(generatedFiles)
      );

      assets.forEach((asset) => {
        formData.append("assets", asset);
      });

      const API_URL =
        process.env.NEXT_PUBLIC_API_URL ||
        "https://clyrawebbackend-666777548.europe-west1.run.app/";

      const response = await fetch(
        `${API_URL}/api/deploy`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      await validateApiResponse(response);

      const result = await response.json();
      console.log("FULL DEPLOY RESULT:", JSON.stringify(result, null, 2));

      setSuccess(true);
      setProjectName("");

  const liveUrl =
  result?.url ||
  result?.website?.deployUrl ||
  result?.website?.url;

if (liveUrl) {
  window.open(liveUrl, "_blank");
}
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Deploy failed"
      );
    } finally {
      setIsDeploying(false);
    }
  };

  if (authLoading) {
    return <DeploySkeleton />;
  }

  return (
    <form
      onSubmit={handleDeploy}
      className="space-y-4 rounded-2xl border p-6 shadow-sm bg-white"
    >
      <div>
        <label className="block text-sm font-medium mb-1">
          Project Name
        </label>
        <input
          type="text"
          value={projectName}
          onChange={(e) =>
            setProjectName(e.target.value)
          }
          className="w-full p-3 border rounded-xl"
          placeholder="my-awesome-project"
          required
        />
      </div>

      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-xl">
          ⚠️ {error}
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-100 text-green-700 rounded-xl">
          ✅ Deployed successfully!
        </div>
      )}

      <button
        type="submit"
        disabled={isDeploying || !user}
        className={`w-full p-3 rounded-xl font-medium transition ${
          isDeploying || !user
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        {isDeploying
          ? "🔄 Deploying..."
          : "🚀 Publish to Netlify"}
      </button>
    </form>
  );
}