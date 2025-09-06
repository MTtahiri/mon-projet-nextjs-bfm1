// src/app/api/upload-cv/route.ts - Version avec logging
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

    console.log('Ajout des données à Google Sheets...');
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'A:E',
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [[name, email, dailyRate, cvFile.name, new Date().toISOString()]],
      },
    });

    console.log('Données ajoutées avec succès:', response.data);

    return NextResponse.json(
      { 
        success: true, 
        message: 'CV et données enregistrés avec succès',
        data: { name, email, dailyRate, filename: cvFile.name }
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('ERREUR COMPLÈTE:', error);
    console.error('Code erreur:', error.code);
    console.error('Message erreur:', error.message);
    
    return NextResponse.json(
      { error: 'Erreur: ' + error.message },
      { status: 500 }
    );
  }
}
