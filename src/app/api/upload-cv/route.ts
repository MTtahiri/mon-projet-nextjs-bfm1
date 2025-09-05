import { NextRequest, NextResponse } from 'next/server';
import { addCandidateToSheet, CandidateData } from '@/lib/google-sheets';

export async function POST(request: NextRequest) {
  try {
    const candidateData: CandidateData = await request.json();
    console.log('📋 Données reçues:', candidateData);

    const success = await addCandidateToSheet(candidateData);
    if (!success) {
      return NextResponse.json({ error: 'Erreur lors de la sauvegarde Google Sheets' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Données sauvegardées avec succès' }, { status: 200 });
  } catch (error) {
    console.error('❌ Erreur critique:', error);
    return NextResponse.json({ error: 'Erreur interne serveur' }, { status: 500 });
  }
}
