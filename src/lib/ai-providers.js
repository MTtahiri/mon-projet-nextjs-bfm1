// src/lib/ai-providers.js

// Configuration des fournisseurs d'IA
export const aiProviders = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: 'https://api.openai.com/v1',
    model: 'gpt-3.5-turbo'
  },
  claude: {
    apiKey: process.env.ANTHROPIC_API_KEY,
    baseURL: 'https://api.anthropic.com/v1',
    model: 'claude-3-sonnet-20240229'
  }
};

// Fonction pour appeler OpenAI
async function callOpenAI(prompt, options = {}) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: options.model || 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: options.maxTokens || 1000,
      temperature: options.temperature || 0.7
    })
  });

  if (!response.ok) {
    throw new Error(`Erreur OpenAI: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// Fonction pour appeler Claude
async function callClaude(prompt, options = {}) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: options.model || 'claude-3-sonnet-20240229',
      max_tokens: options.maxTokens || 1000,
      messages: [{ role: 'user', content: prompt }]
    })
  });

  if (!response.ok) {
    throw new Error(`Erreur Claude: ${response.status}`);
  }

  const data = await response.json();
  return data.content[0].text;
}

// Fonction principale pour obtenir une réponse IA
export async function getAIResponse(prompt, provider = 'openai', options = {}) {
  try {
    switch (provider) {
      case 'openai':
        return await callOpenAI(prompt, options);
      case 'claude':
        return await callClaude(prompt, options);
      default:
        throw new Error(`Fournisseur IA non supporté: ${provider}`);
    }
  } catch (_error) {
    console.error('Erreur lors de l\'appel à l\'IA:', error);
    throw new Error(`Échec de la génération de contenu: ${error.message}`);
  }
}

// Fonctions spécialisées pour différents types de contenu
export async function generateMarketingContent(prompt, options = {}) {
  const marketingPrompt = `En tant qu'expert en marketing, ${prompt}. Fournissez une réponse créative, engageante et orientée conversion.`;
  return await getAIResponse(marketingPrompt, options.provider || 'openai', {
    ...options,
    temperature: 0.8 // Plus créatif pour le marketing
  });
}

export async function generateSEOContent(prompt, options = {}) {
  const seoPrompt = `En tant qu'expert SEO, ${prompt}. Optimisez le contenu pour les moteurs de recherche tout en gardant une approche naturelle et engageante.`;
  return await getAIResponse(seoPrompt, options.provider || 'openai', {
    ...options,
    temperature: 0.6 // Plus structuré pour le SEO
  });
}

export async function generateTechnicalContent(prompt, options = {}) {
  const technicalPrompt = `En tant qu'expert technique, ${prompt}. Fournissez une réponse précise, détaillée et techniquement correcte.`;
  return await getAIResponse(technicalPrompt, options.provider || 'openai', {
    ...options,
    temperature: 0.4 // Plus précis pour le technique
  });
}