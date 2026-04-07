import { useMemo } from 'react';
import { sanitizeHTML } from '@/utils/security';
import BlogSkeleton from './LoaderSkeleton';

interface BlogRendererProps {
  blogContent: string;
  isLoading?: boolean;
}

export const SecureBlogRenderer: React.FC<BlogRendererProps> = ({
  blogContent,
  isLoading = false
}) => {
  const sanitizedContent = useMemo(() => {
    if (!blogContent) return '';
    // ✅ ALWAYS sanitize before rendering
    return sanitizeHTML(blogContent);
  }, [blogContent]);

  if (isLoading) {
    return <BlogSkeleton />;
  }

  return (
    <div 
      className="prose max-w-none"
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
};