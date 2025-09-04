import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { addCandidateToSheet } from '@/lib/google-sheets';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('cv') as File;
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const experience = formData.get('experience') as string;
    const position = formData.get('position') as string;
    const location = formData.get('location') as string;
    const education = formData.get('education') as string;
    const skills = formData.get('skills') as string;
    const sector = formData.get('sector') as string;
    const level = formData.get('level') as string;
    const dailyRate = formData.get('dailyRate') as string;

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

    // Upload du CV vers Vercel Blob
    const fileName = `cv-${name.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.pdf`;
    const blob = await put(fileName, file, {
      access: 'public',
      contentType: 'application/pdf',
    });

    console.log('✅ CV uploadé vers Vercel Blob:', blob.url);

    // Ajout à Google Sheets
    const success = await addCandidateToSheet({
      name,
      email,
      phone: phone || '',
      experience: experience || '',
      position: position || '',
      location: location || '',
      education: education || '',
      skills: skills || '',
      sector: sector || '',
      level: level || '',
      dailyRate: parseInt(dailyRate),
      cvUrl: blob.url
    });

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
      message: 'CV et données enregistrés avec succès dans Google Sheets!',
      candidateId: candidateId,
      cvUrl: blob.url,
      dailyRate: parseInt(dailyRate)
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