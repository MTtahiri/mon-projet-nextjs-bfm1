// src/app/api/ai/marketing/route.js

import { generateMarketingContent } from '@/lib/ai-providers';
import { NextResponse } from 'next/server';

export async function POST(_request) {
  try {
    const { prompt, options = {} } = await request.json();

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

    // Génération du contenu marketing
    const content = await generateMarketingContent(prompt, options);

    return NextResponse.json({
      success: true,
      content,
      type: 'marketing',
      timestamp: new Date().toISOString()
    });

  } catch (_error) {
    console.error('Erreur dans /api/ai/marketing:', error);

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
        error: 'Erreur lors de la génération du contenu marketing',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// Gestion de la méthode GET pour les tests
export async function GET() {
  return NextResponse.json({
    message: 'API de génération de contenu marketing',
    endpoint: '/api/ai/marketing',
    method: 'POST',
    parameters: {
      prompt: 'string (requis) - Le prompt pour la génération de contenu',
      options: 'object (optionnel) - Options supplémentaires (provider, maxTokens, etc.)'
    },
    example: {
      prompt: 'Créez une campagne publicitaire pour un produit eco-friendly',
      options: {
        provider: 'openai',
        maxTokens: 800
      }
    }
  });
}