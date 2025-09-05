import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { addCandidateToSheet } from '@/lib/google-sheets';

// SOLUTION DÉFINITIVE : Token en dur temporairement
const BLOB_TOKEN = "vercel_blob_rw_sfWrrZEyAKYGh8XB_mKJqDbQRD5PjMhE5X2wMZ3ET1Yss5t";

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 Debug: API upload-cv appelée');
    
    const formData = await request.formData();

    const file = formData.get('cv') as File | null;
    const name = formData.get('name') as string || '';
    const email = formData.get('email') as string || '';
    const phone = formData.get('phone') as string || '';
    const experience = formData.get('experience') as string || '';
    const position = formData.get('position') as string || '';
    const location = formData.get('location') as string || '';
    const education = formData.get('education') as string || '';
    const skills = formData.get('skills') as string || '';
    const sector = formData.get('sector') as string || '';
    const level = formData.get('level') as string || '';
    const dailyRateStr = formData.get('dailyRate') as string || '';

    console.log('📋 Données reçues:', { name, email, dailyRateStr });

    // Validation
    if (!file || !name || !email || !dailyRateStr) {
      return NextResponse.json(
        { error: 'Fichier, nom, email et TJM sont requis' }, 
        { status: 400 }
      );
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Seuls les fichiers PDF sont acceptés' }, 
        { status: 400 }
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Le fichier ne doit pas dépasser 10MB' }, 
        { status: 400 }
      );
    }

    const dailyRate = parseInt(dailyRateStr, 10);
    if (isNaN(dailyRate) || dailyRate < 100 || dailyRate > 2000) {
      return NextResponse.json(
        { error: 'Le TJM doit être un nombre entre 100 et 2000 €' }, 
        { status: 400 }
      );
    }

    const fileName = `cv-${name.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.pdf`;

    // UPLOAD AVEC TOKEN EN DUR (solution temporaire)
    console.log('📤 Upload vers Vercel Blob...');
    const blob = await put(fileName, file, {
      access: 'public',
      contentType: 'application/pdf',
      token: BLOB_TOKEN, // ← TOKEN EN DUR
    });

    console.log('✅ Fichier uploadé:', blob.url);

    // Préparation des données pour Google Sheets
    const candidateData = {
      name,
      email,
      phone,
      experience,
      position,
      location,
      education,
      skills,
      sector,
      level,
      dailyRate,
      cvUrl: blob.url,
    };

    // Enregistrement dans Google Sheets
    console.log('📊 Enregistrement dans Google Sheets...');
    const success = await addCandidateToSheet(candidateData);

    if (!success) {
      return NextResponse.json(
        { error: "Erreur lors de l'enregistrement dans Google Sheets" }, 
        { status: 500 }
      );
    }

    console.log('🎉 Candidat enregistré avec succès!');

    return NextResponse.json({
      success: true,
      message: 'CV et données enregistrés avec succès!',
      candidateId: `CAND-${Date.now().toString().slice(-6)}`,
      cvUrl: blob.url,
      dailyRate,
    });

  } catch (error: unknown) {
    console.error('❌ Erreur critique:', error);
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Erreur inconnue lors du traitement';
    
    return NextResponse.json(
      { error: errorMessage }, 
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};// Force redeploy - 09/05/2025 20:16:04
