import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function POST(_request) {
  try {
    const { consultantId, fileId } = await request.json();
    
    if (!consultantId || !fileId) {
      return NextResponse.json({ error: 'ID consultant et fichier requis' }, { status: 400 });
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/drive'],
    });

    const drive = google.drive({ version: 'v3', auth });

    // Créer une copie du CV original
    const copyResponse = await drive.files.copy({
      fileId: fileId,
      requestBody: {
        name: `CV_ANONYME_CONSULTANT_${consultantId}_${Date.now()}.pdf`,
        parents: [process.env.GOOGLE_DRIVE_FOLDER_ID],
      },
    });

    // Rendre la copie publique
    await drive.permissions.create({
      fileId: copyResponse.data.id,
      requestBody: {
        role: 'reader',
        type: 'anyone'
      }
    });

    const anonymizedUrl = `https://drive.google.com/file/d/${copyResponse.data.id}/view`;

    return NextResponse.json({
      success: true,
      anonymizedFileId: copyResponse.data.id,
      anonymizedUrl: anonymizedUrl,
      message: 'CV anonymisé créé avec succès'
    });

  } catch (_error) {
    console.error('❌ Erreur anonymisation CV:', error);
    return NextResponse.json({ 
      error: 'Erreur lors de l\'anonymisation',
      details: error.message 
    }, { status: 500 });
  }
}