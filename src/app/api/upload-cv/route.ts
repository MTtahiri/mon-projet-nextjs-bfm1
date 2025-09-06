// src/app/api/upload-cv/route.ts - Version finale avec le bon range
import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    console.log('Début de la requête upload-cv');
    
    const formData = await request.formData();
    const name = formData.get('name');
    const email = formData.get('email');
    const dailyRate = formData.get('dailyRate');
    const cvFile = formData.get('cv') as File;

    console.log('Données reçues:', { name, email, dailyRate, filename: cvFile?.name });

    if (!name || !email || !dailyRate || !cvFile) {
      return NextResponse.json(
        { error: 'Fichier, nom, email et TJM sont requis' },
        { status: 400 }
      );
    }

    // === CODE GOOGLE SHEETS ===
    console.log('Initialisation Google Sheets...');
    const auth = new google.auth.GoogleAuth({
      keyFile: path.join(process.cwd(), 'google-service-account.json'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    console.log('Spreadsheet ID:', spreadsheetId);

    if (!spreadsheetId) {
      throw new Error('GOOGLE_SHEET_ID environment variable is missing');
    }

    // Utilisez le bon range basé sur votre structure de Sheet
    console.log('Ajout des données à Google Sheets...');
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Master_KPI_Candidats!A:E', // Utilisez le nom de votre feuille
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [[
          `Candidat-${Date.now()}`, // Candidat ID
          '', // Url (vide pour l'instant)
          name, // Nom
          '', // Prenom (vide si vous n'avez pas ce champ)
          email, // Courriel
          dailyRate, // TJM
          cvFile.name, // Fichier CV
          new Date().toISOString() // Date
        ]],
      },
    });

    console.log('Données ajoutées avec succès:', response.data);

    return NextResponse.json(
      { 
        success: true, 
        message: 'CV et données enregistrés avec succès dans Google Sheets',
        data: { name, email, dailyRate, filename: cvFile.name }
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('ERREUR COMPLÈTE:', error);
    console.error('Code erreur:', error.code);
    console.error('Message erreur:', error.message);
    
    return NextResponse.json(
      { error: 'Erreur Google Sheets: ' + error.message },
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
