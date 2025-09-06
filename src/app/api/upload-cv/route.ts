// src/app/api/upload-cv/route.ts - Version corrigée
import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function POST(request: Request) {
  try {
    console.log('=== DÉBUT REQUÊTE UPLOAD-CV ===');
    
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const dailyRate = formData.get('dailyRate') as string;
    const cvFile = formData.get('cv') as File;

    console.log('Données reçues:', { name, email, dailyRate, filename: cvFile?.name });

    if (!name || !email || !dailyRate || !cvFile) {
      return NextResponse.json(
        { error: 'Fichier, nom, email et TJM sont requis' },
        { status: 400 }
      );
    }

    // === CODE GOOGLE SHEETS ===
    console.log('Connexion à Google Sheets...');
    const auth = new google.auth.GoogleAuth({
      credentials: {
        type: "service_account",
        project_id: "vercel-469623",
        private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        client_id: process.env.GOOGLE_CLIENT_ID,
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
        client_x509_cert_url: process.env.GOOGLE_CLIENT_X509_CERT_URL
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    if (!spreadsheetId) {
      throw new Error('GOOGLE_SHEET_ID environment variable is missing');
    }

    // Structure pour vos 18 colonnes
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

    console.log('Ajout à Google Sheets...');
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Master_KPI_Candidats!A:R',
      valueInputOption: 'USER_ENTERED',
      requestBody: {  // ← Correction ici: requestBody au lieu de resource
        values: [values],
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
    console.error('❌ ERREUR COMPLÈTE:', error);
    console.error('Stack:', error.stack);
    return NextResponse.json(
      { error: 'Erreur serveur: ' + error.message },
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
