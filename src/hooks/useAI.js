import { useState } from 'react';

export function useAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateMarketing = async (type, context, target) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/ai/marketing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, context, target })
      });
      
      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      
      return data.content;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const optimizeSEO = async (url, content, keywords) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/ai/seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, content, keywords })
      });
      
      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      
      return data.optimization;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getTechnicalHelp = async (task, code, context) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/ai/technical', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task, code, context })
      });
      
      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      
      return data.analysis;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    generateMarketing,
    optimizeSEO,
    getTechnicalHelp,
    loading,
    error
  };
}

// ============================================
// Variables d'environnement à ajouter
// ============================================

/*
Dans Vercel Dashboard, ajouter:

OPENAI_API_KEY=sk-...
MISTRAL_API_KEY=...
ANTHROPIC_API_KEY=sk-ant-...

GOOGLE_CLIENT_EMAIL=your-service@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
GOOGLE_DRIVE_FOLDER_ID=1KJcl...
GOOGLE_SHEETS_ID=1H4bS...
RESEND_API_KEY=re_3P4D...
NEXT_PUBLIC_SITE_URL=https://saveursmaghrebines.vercel.app
*/