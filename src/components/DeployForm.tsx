import { useState } from 'react';
import { validateApiResponse } from '@/utils/security';
import { DeploySkeleton } from './LoaderSkeleton';
import { useAuth } from '@/hooks/useAuth';

interface DeployFormProps {
  files: Record<string, string>;
  assets: File[];
}

export const DeployForm: React.FC<DeployFormProps> = ({ files, assets }) => {
  const { user, loading: authLoading } = useAuth();
  const [projectName, setProjectName] = useState('');
  const [isDeploying, setIsDeploying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleDeploy = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // ✅ Check login
    if (!user) {
      setError('Please log in to deploy');
      return;
    }

    // ✅ Validate project name
    if (!projectName.trim()) {
      setError('Project name is required');
      return;
    }

    setIsDeploying(true);

    try {
      // ✅ Get Firebase token directly (NO TYPE ISSUES)
      const token = await user.getIdToken();

      // ✅ Prepare FormData
      const formData = new FormData();
      formData.append('projectName', projectName);
      formData.append('files', JSON.stringify(files));

      assets.forEach((asset) => {
        formData.append('assets', asset);
      });

      // ✅ Call Flask backend
      const response = await fetch('http://localhost:5000/api/deploy', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`, // ✅ ONLY THIS HEADER
        },
        body: formData,
      });

      // ✅ Validate response
      await validateApiResponse(response);

      setSuccess(true);
      setProjectName('');

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Deploy failed');
    } finally {
      setIsDeploying(false);
    }
  };

  if (authLoading) {
    return <DeploySkeleton />;
  }

  return (
    <form onSubmit={handleDeploy} className="space-y-4">
      {/* Project Name */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Project Name
        </label>
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="my-awesome-project"
          required
        />
      </div>

      {/* Error */}
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded">
          ⚠️ {error}
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="p-3 bg-green-100 text-green-700 rounded">
          ✅ Deployed successfully!
        </div>
      )}

      {/* Button */}
      <button
        type="submit"
        disabled={isDeploying || !user}
        className={`w-full p-3 rounded ${
          isDeploying || !user
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
      >
        {isDeploying ? '🔄 Deploying...' : '🚀 Deploy'}
      </button>
    </form>
  );
};