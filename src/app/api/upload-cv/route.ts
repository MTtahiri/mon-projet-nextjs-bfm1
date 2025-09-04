import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { addCandidateToSheet } from '@/lib/google-sheets';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Récupération sécurisée des données avec valeurs par défaut
    const file = formData.get('cv') as File;
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
    const dailyRate = formData.get('dailyRate') as string || '';

    // Validation des champs requis
    if (!file || !name || !email || !dailyRate) {
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

    // Validation du TJM
    const dailyRateNumber = parseInt(dailyRate);
    if (isNaN(dailyRateNumber) || dailyRateNumber < 100 || dailyRateNumber > 2000) {
      return NextResponse.json(
        { error: 'Le TJM doit être un nombre entre 100 et 2000 €' },
        { status: 400 }
      );
    }

    // Upload du CV vers Vercel Blob
    const fileName = `cv-${name.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.pdf`;
    
    const blob = await put(fileName, file, {
      access: 'public',
      contentType: 'application/pdf',
    });

    console.log('✅ CV uploadé vers Vercel Blob:', blob.url);

    // Préparation sécurisée des données pour Google Sheets
    const candidateData = {
      name: name || '',
      email: email || '',
      phone: phone || '',
      experience: experience || '',
      position: position || '',
      location: location || '',
      education: education || '',
      skills: skills || '', // On garde la chaîne originale
      sector: sector || '',
      level: level || '',
      dailyRate: dailyRateNumber,
      cvUrl: blob.url
    };

    // Ajout à Google Sheets
    const success = await addCandidateToSheet(candidateData);

    if (!success) {
      return NextResponse.json(
        { error: 'Erreur lors de l\'enregistrement dans Google Sheets' },
        { status: 500 }
      );
    }

    // Génération de l'ID candidat
    const candidateId = `CAND-${Date.now().toString().slice(-6)}`;

    return NextResponse.json({
      success: true,
      message: 'CV et données enregistrés avec succès!',
      candidateId: candidateId,
      cvUrl: blob.url,
      dailyRate: dailyRateNumber
    });

  } catch (error) {
    console.error('Erreur lors du traitement:', error);
    return NextResponse.json(
      { error: 'Erreur lors du traitement du formulaire' },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};