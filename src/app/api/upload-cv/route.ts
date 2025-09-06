// src/app/api/upload-cv/route.ts - Avec formidable
import { NextRequest, NextResponse } from 'next/server';
import formidable from 'formidable';
import fs from 'fs';
import { google } from 'googleapis';
import path from 'path';

export const config = {
  api: {
    bodyParser: false, // Désactive le bodyParser par défaut
  },
};

async function parseForm(req: NextRequest): Promise<{ fields: formidable.Fields; files: formidable.Files }> {
  const form = formidable({
    maxFiles: 1,
    maxFileSize: 10 * 1024 * 1024, // 10MB
  });

  return new Promise((resolve, reject) => {
    form.parse(req as any, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
}

export async function POST(request: NextRequest) {
  try {
    console.log('=== DÉBUT REQUÊTE UPLOAD-CV ===');
    
    // Parse le form-data avec formidable
    const { fields, files } = await parseForm(request);
    
    const name = Array.isArray(fields.name) ? fields.name[0] : fields.name;
    const email = Array.isArray(fields.email) ? fields.email[0] : fields.email;
    const dailyRate = Array.isArray(fields.dailyRate) ? fields.dailyRate[0] : fields.dailyRate;
    const cvFile = files.cv?.[0];

    console.log('Données parsées:', { name, email, dailyRate, file: cvFile?.originalFilename });

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
        data: { name, email, dailyRate, filename: cvFile.originalFilename }
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('❌ ERREUR:', error);
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
