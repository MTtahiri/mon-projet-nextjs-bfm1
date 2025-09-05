import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { addCandidateToSheet } from '@/lib/google-sheets';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const file = formData.get('cv') as File | null;
    const name = (formData.get('name') as string) || '';
    const email = (formData.get('email') as string) || '';
    const phone = (formData.get('phone') as string) || '';
    const experience = (formData.get('experience') as string) || '';
    const position = (formData.get('position') as string) || '';
    const location = (formData.get('location') as string) || '';
    const education = (formData.get('education') as string) || '';
    const skillsRaw = (formData.get('skills') as string) || '';
    const sector = (formData.get('sector') as string) || '';
    const level = (formData.get('level') as string) || '';
    const dailyRateStr = (formData.get('dailyRate') as string) || '';

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

    const blob = await put(fileName, file, {
      access: 'public',
      contentType: 'application/pdf',
    });

    // Nettoyage des compétences
    const skills = skillsRaw
      .split(',')
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0)
      .join(', ');

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

    const success = await addCandidateToSheet(candidateData);

    if (!success) {
      return NextResponse.json(
        { error: "Erreur lors de l'enregistrement dans Google Sheets" }, 
        { status: 500 }
      );
    }

    const candidateId = `CAND-${Date.now().toString().slice(-6)}`;

    return NextResponse.json({
      success: true,
      message: 'CV et données enregistrés avec succès!',
      candidateId,
      cvUrl: blob.url,
      dailyRate,
    });

  } catch (error: unknown) {
    console.error('Erreur lors du traitement:', error);
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Erreur lors du traitement du formulaire';
    
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
};
// Force redeploy for environment variables
