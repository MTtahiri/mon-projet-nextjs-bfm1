// src/app/api/upload-cv/route.ts - Version avec Google Drive
import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { Readable } from 'stream';

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

    // === AUTHENTIFICATION GOOGLE ===
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
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive.file'
      ],
    });

    const authClient = await auth.getClient();

    // === UPLOAD DU FICHIER VERS GOOGLE DRIVE ===
    console.log('Upload vers Google Drive...');
    const drive = google.drive({ version: 'v3', auth: authClient });
    
    const fileBuffer = await cvFile.arrayBuffer();
    const buffer = Buffer.from(fileBuffer);

    const driveResponse = await drive.files.create({
      requestBody: {
        name: `${name}_${cvFile.name}`,
        mimeType: cvFile.type,
        parents: [process.env.GOOGLE_DRIVE_FOLDER_ID || 'root'],
      },
      media: {
        mimeType: cvFile.type,
        body: Readable.from([buffer]),
      },
      fields: 'id, name, webViewLink',
    });

    const driveFileId = driveResponse.data.id;
    const driveFileUrl = driveResponse.data.webViewLink;

    console.log('✅ Fichier uploadé vers Google Drive:', driveFileId);

    // === ENREGISTREMENT DES MÉTADONNÉES DANS GOOGLE SHEETS ===
    console.log('Enregistrement des métadonnées dans Google Sheets...');
    const sheets = google.sheets({ version: 'v4', auth: authClient });
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    if (!spreadsheetId) {
      throw new Error('GOOGLE_SHEET_ID environment variable is missing');
    }

    const values = [
      `Candidat-${Date.now()}`,      // A: Candidat
      driveFileUrl,                  // B: Url (lien vers le fichier Drive)
      name,                          // C: Nom
      '',                            // D: Prenom
      email,                         // E: Courriel
      '',                            // F: Telephone
      '',                            // G: Poste
      '',                            // H: Experience
      '',                            // I: Localisation
      '',                            // J: Formation
      '',                            // K: Competences
      '',                            // L: Secteur
      '',                            // M: Niveau
      'Nouveau',                     // N: Statut
      new Date().toISOString(),      // O: Date_Ajout
      '',                            // P: Hash_Anti_Doublon
      '',                            // Q: Detection_Doublons
      dailyRate                      // R: TJM_Souhaite
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Master_KPI_Candidats!A:R',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [values],
      },
    });

    console.log('✅ Métadonnées enregistrées dans Google Sheets');

    return NextResponse.json(
      { 
        success: true, 
        message: 'CV uploadé et données enregistrées avec succès',
        data: { 
          name, 
          email, 
          dailyRate, 
          filename: cvFile.name,
          driveFileId,
          driveFileUrl 
        }
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('❌ ERREUR COMPLÈTE:', error);
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
