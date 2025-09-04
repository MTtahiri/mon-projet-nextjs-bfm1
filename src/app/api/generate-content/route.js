import { NextResponse } from 'next/server';

export async function POST(_request) {
  try {
    const { prompt, type } = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Paramètre "prompt" manquant ou invalide' },
        { status: 400 }
      );
    }

    if (!type || typeof type !== 'string') {
      return NextResponse.json(
        { error: 'Paramètre "type" manquant ou invalide' },
        { status: 400 }
      );
    }

    // TODO: Implémenter l'appel réel à l'API IA selon le 'type'
    // Exemple fictif de réponse simulée
    const mockResponse = {
      content: `Contenu généré pour: ${prompt} (type: ${type})`,
      success: true
    };

    return NextResponse.json(mockResponse);

  } catch (_error) {
    console.error('Erreur API:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
