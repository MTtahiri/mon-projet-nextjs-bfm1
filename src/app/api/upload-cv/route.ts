// src/app/api/upload-cv/route.ts - Version avec parsing natif
import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    console.log('=== DÉBUT REQUÊTE UPLOAD-CV ===');
    
    // Next.js 15+ peut parser form-data nativement
    const formData = await request.formData();
    const name = formData.get('name');
    const email = formData.get('email');
    const dailyRate = formData.get('dailyRate');
    const cvFile = formData.get('cv') as File;

    console.log('Données reçues:', { 
      name, 
      email, 
      dailyRate, 
      hasFile: !!cvFile,
      filename: cvFile?.name 
    });

    if (!name || !email || !dailyRate || !cvFile) {
      return NextResponse.json(
        { error: 'Fichier, nom, email et TJM sont requis' },
        { status: 400 }
      );
    }

    // === CODE GOOGLE SHEETS ===
    console.log('Connexion à Google Sheets...');
    const auth = new google.auth.GoogleAuth({
      keyFile: path.join(process.cwd(), 'google-service-account.json'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    if (!spreadsheetId) {
      throw new Error('GOOGLE_SHEET_ID environment variable is missing');
    }

    // Ajout des données à Google Sheets
    console.log('Ajout à Google Sheets...');
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Master_KPI_Candidats!A:R',
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [[
          `Candidat-${Date.now()}`,      // A: Candidat
          '',                           // B: Url
          name,                         // C: Nom
          '',                           // D: Prenom
          email,                        // E: Courriel
          '',                           // F: Telephone
          '',                           // G: Poste
          '',                           // H: Experience
          '',                           // I: Localisation
          '',                           // J: Formation
          '',                           // K: Competences
          '',                           // L: Secteur
          '',                           // M: Niveau
          'Nouveau',                    // N: Statut
          new Date().toISOString(),     // O: Date_Ajout
          '',                           // P: Hash_Anti_Doublon
          '',                           // Q: Detection_Doublons
          dailyRate                     // R: TJM_Souhaite
        ]],
      },
    });

    console.log('✅ Données enregistrées dans Google Sheets');

    return NextResponse.json(
      { 
        success: true, 
        message: 'CV et données enregistrés avec succès',
        data: { name, email, dailyRate, filename: cvFile.name }
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('❌ ERREUR:', error);
    console.error('Stack:', error.stack);
    return NextResponse.json(
      { error: 'Erreur: ' + error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Endpoint upload-cv actif', method: 'GET' },
    { status: 200 }
  );
}
