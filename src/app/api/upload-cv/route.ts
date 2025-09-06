// src/app/api/upload-cv/route.ts
import { NextRequest, NextResponse } from 'next/server';
import formidable from 'formidable';
import fs from 'fs';
import { google } from 'googleapis';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    // Create tmp directory if it doesn't exist
    if (!fs.existsSync('./tmp')) {
      fs.mkdirSync('./tmp');
    }

    const formData = await request.formData();
    const name = formData.get('name');
    const email = formData.get('email');
    const dailyRate = formData.get('dailyRate');
    const cvFile = formData.get('cv') as File;

    if (!name || !email || !dailyRate || !cvFile) {
      return NextResponse.json(
        { error: 'Fichier, nom, email et TJM sont requis' },
        { status: 400 }
      );
    }

    console.log('Données reçues:', { name, email, dailyRate, filename: cvFile.name });

    // Save file temporarily
    const bytes = await cvFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const tempFilePath = `./tmp/${Date.now()}-${cvFile.name}`;
    fs.writeFileSync(tempFilePath, buffer);

    // === CODE GOOGLE SHEETS ===
    const auth = new google.auth.GoogleAuth({
      keyFile: path.join(process.cwd(), 'google-service-account.json'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'A1',
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [[name, email, dailyRate, cvFile.name, new Date().toISOString()]],
      },
    });

    // Clean up temporary file
    if (fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }

    return NextResponse.json(
      { success: true, message: 'CV uploadé avec succès' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json(
      { error: 'Erreur lors du traitement: ' + error.message },
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
