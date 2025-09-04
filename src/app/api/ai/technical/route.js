// src/app/api/ai/technical/route.js

import { generateTechnicalContent } from '@/lib/ai-providers';
import { NextResponse } from 'next/server';

export async function POST(_request) {
  try {
    const { prompt, techStack, difficulty = 'intermediate', options = {} } = await request.json();

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

    // Validation du niveau de difficulté
    const validDifficulties = ['beginner', 'intermediate', 'advanced', 'expert'];
    if (!validDifficulties.includes(difficulty)) {
      return NextResponse.json(
        { error: 'Niveau de difficulté invalide. Utilisez: beginner, intermediate, advanced, ou expert' },
        { status: 400 }
      );
    }

    // Construction du prompt technique
    let technicalPrompt = prompt;
    
    // Ajout du contexte technologique
    if (techStack && Array.isArray(techStack) && techStack.length > 0) {
      technicalPrompt += ` Contexte technique : ${techStack.join(', ')}.`;
    }

    // Ajout du niveau de difficulté
    const difficultyContext = {
      beginner: 'Expliquez de manière simple pour un débutant avec des exemples concrets.',
      intermediate: 'Fournissez une explication détaillée avec des bonnes pratiques.',
      advanced: 'Incluez des concepts avancés et des optimisations.',
      expert: 'Couvrez les aspects les plus techniques et les edge cases.'
    };

    technicalPrompt += ` ${difficultyContext[difficulty]}`;

    // Génération du contenu technique
    const content = await generateTechnicalContent(technicalPrompt, options);

    // Analyse du contenu technique
    const codeBlocks = (content.match(/```[\s\S]*?```/g) || []).length;
    const hasCodeExamples = codeBlocks > 0;
    const complexity = difficulty;

    return NextResponse.json({
      success: true,
      content,
      type: 'technical',
      metadata: {
        difficulty,
        techStack: techStack || [],
        codeBlocks,
        hasCodeExamples,
        complexity,
        wordCount: content.split(/\s+/).length
      },
      suggestions: {
        nextSteps: difficulty !== 'expert' ? 
          `Vous pouvez approfondir avec le niveau "${validDifficulties[validDifficulties.indexOf(difficulty) + 1]}"` : 
          'Vous maîtrisez le niveau expert !',
        relatedTopics: techStack || []
      },
      timestamp: new Date().toISOString()
    });

  } catch (_error) {
    console.error('Erreur dans /api/ai/technical:', error);

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
        error: 'Erreur lors de la génération du contenu technique',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// Gestion de la méthode GET pour les tests
export async function GET() {
  return NextResponse.json({
    message: 'API de génération de contenu technique',
    endpoint: '/api/ai/technical',
    method: 'POST',
    parameters: {
      prompt: 'string (requis) - Le prompt pour la génération de contenu',
      techStack: 'array (optionnel) - Technologies utilisées (React, Node.js, etc.)',
      difficulty: 'string (optionnel) - Niveau: beginner, intermediate, advanced, expert',
      options: 'object (optionnel) - Options supplémentaires (provider, maxTokens, etc.)'
    },
    example: {
      prompt: 'Expliquez comment optimiser les performances d\'une application React',
      techStack: ['React', 'JavaScript', 'Webpack'],
      difficulty: 'advanced',
      options: {
        provider: 'openai',
        maxTokens: 1500
      }
    }
  });
}