// src/app/api/ai/seo/route.js

import { generateSEOContent } from '@/lib/ai-providers';
import { NextResponse } from 'next/server';

export async function POST(_request) {
  try {
    const { prompt, keywords, options = {} } = await request.json();

    // Validation des données d'entrée
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Le prompt est requis et doit être une chaîne de caractères' },
        { status: 400 }
      );
    }

    if (prompt.length > 5000) {
      return NextResponse.json(
        { error: 'Le prompt est trop long (maximum 5000 caractères)' },
        { status: 400 }
      );
    }

    // Construction du prompt SEO avec mots-clés
    let seoPrompt = prompt;
    if (keywords && Array.isArray(keywords) && keywords.length > 0) {
      seoPrompt += ` Intégrez naturellement ces mots-clés : ${keywords.join(', ')}.`;
    }

    // Génération du contenu SEO
    const content = await generateSEOContent(seoPrompt, options);

    // Analyse basique du contenu généré
    const wordCount = content.split(/\s+/).length;
    const keywordDensity = keywords 
      ? keywords.map(keyword => ({
          keyword,
          count: (content.toLowerCase().match(new RegExp(keyword.toLowerCase(), 'g')) || []).length,
          density: ((content.toLowerCase().match(new RegExp(keyword.toLowerCase(), 'g')) || []).length / wordCount * 100).toFixed(2)
        }))
      : [];

    return NextResponse.json({
      success: true,
      content,
      type: 'seo',
      metadata: {
        wordCount,
        keywordDensity,
        suggestedKeywords: keywords || [],
        readingTime: Math.ceil(wordCount / 200) // Estimation du temps de lecture
      },
      timestamp: new Date().toISOString()
    });

  } catch (_error) {
    console.error('Erreur dans /api/ai/seo:', error);

    // Gestion des erreurs spécifiques
    if (error.message.includes('API key')) {
      return NextResponse.json(
        { error: 'Configuration API manquante ou incorrecte' },
        { status: 500 }
      );
    }

    if (error.message.includes('quota') || error.message.includes('rate')) {
      return NextResponse.json(
        { error: 'Limite de quota API atteinte. Veuillez réessayer plus tard.' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Erreur lors de la génération du contenu SEO',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// Gestion de la méthode GET pour les tests
export async function GET() {
  return NextResponse.json({
    message: 'API de génération de contenu SEO',
    endpoint: '/api/ai/seo',
    method: 'POST',
    parameters: {
      prompt: 'string (requis) - Le prompt pour la génération de contenu',
      keywords: 'array (optionnel) - Liste de mots-clés à intégrer',
      options: 'object (optionnel) - Options supplémentaires (provider, maxTokens, etc.)'
    },
    example: {
      prompt: 'Rédigez un article sur les bonnes pratiques SEO',
      keywords: ['référencement', 'SEO', 'optimisation', 'moteurs de recherche'],
      options: {
        provider: 'openai',
        maxTokens: 1200
      }
    }
  });
}