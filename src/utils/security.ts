import DOMPurify from 'dompurify';

// ✅ XSS Protection - Sanitize ALL HTML content
export const sanitizeHTML = (html: string): string => {
  if (typeof window === 'undefined') return html;
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'img', 'div', 'span'],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'target', 'rel', 'class', 'id'],
    ADD_ATTR: ['target'],
    FORCE_BODY: true
  });
};

// ✅ Firebase Token Validation Helper
type TokenUser = {
  getIdToken: () => Promise<string>;
};

export const getAuthHeaders = async (user: TokenUser | null | undefined) => {
  if (!user) return {};
  
  try {
    const token = await user.getIdToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  } catch (error) {
    console.error('Token error:', error);
    return {};
  }
};

// ✅ API Response Validation
export const validateApiResponse = async (response: Response) => {
  if (!response.ok) {
    try {
      const errorData = await response.json();
      throw new Error(errorData?.error || `HTTP ${response.status}`);
    } catch {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  }
  
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data?.error || 'Operation failed');
  }
  
  return data;
};