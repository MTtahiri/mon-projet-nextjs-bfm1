@'
// src/app/api/upload-cv/route.ts - Version corrigée
import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import path from 'path';
import fs from 'fs/promises';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    // Récupération des champs spécifiques de votre formulaire
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const dailyRate = formData.get('dailyRate') as string;
    const cvFile = formData.get('cv') as File;

    console.log('Données reçues:', { name, email, dailyRate, filename: cvFile?.name });

    // Validation des champs requis
    if (!name || !email || !dailyRate || !cvFile) {
      return NextResponse.json(
        { error: 'Fichier, nom, email et TJM sont requis' },
        { status: 400 }
      );
    }

    // Préparation des valeurs pour les 18 colonnes
    const values = [
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
    ];

    // Connexion Google Sheets
    const auth = new google.auth.GoogleAuth({
      keyFile: path.join(process.cwd(), 'google-service-account.json'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    const sheets = google.sheets({ version: 'v4', auth });

    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    if (!spreadsheetId) {
      throw new Error('GOOGLE_SHEET_ID env variable missing');
    }

    // Ajout dans Google Sheets
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Master_KPI_Candidats!A:R',
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [values],
      },
    });

    console.log('✅ Données enregistrées dans Google Sheets');

    return NextResponse.json({
      success: true,
      message: 'CV et données enregistrés avec succès dans Google Sheets',
      data: {
        name,
        email, 
        dailyRate,
        filename: cvFile.name
      },
    });

  } catch (error: any) {
    console.error('❌ Erreur dans upload-cv:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur interne serveur' }, 
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
'@ | Set-Content -Path "src/app/api/upload-cv/route.ts" -Encoding utf8