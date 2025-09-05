import { google } from 'googleapis';

export interface CandidateData {
  name: string;
  email: string;
  phone?: string;
  experience?: string;
  position?: string;
  location?: string;
  education?: string;
  skills?: string;
  sector?: string;
  level?: string;
  dailyRate?: number;
  cvUrl?: string;
}

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL!,
    private_key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

export const sheets = google.sheets({ version: 'v4', auth });

export const SPREADSHEET_ID = process.env.SPREADSHEET_ID!;
export const SHEET_NAME = 'Sheet1';

export async function addCandidateToSheet(candidateData: CandidateData): Promise<boolean> {
  console.log('📊 Tentative d\'enregistrement Google Sheets:', JSON.stringify(candidateData, null, 2));
  console.log('🔧 GOOGLE_CLIENT_EMAIL:', process.env.GOOGLE_CLIENT_EMAIL ? 'Défini' : 'Non défini');
  console.log('🔧 GOOGLE_PRIVATE_KEY:', process.env.GOOGLE_PRIVATE_KEY ? 'Clé présente (longueur: ' + process.env.GOOGLE_PRIVATE_KEY.length + ')' : 'Non défini');
  console.log('🔧 SPREADSHEET_ID:', process.env.SPREADSHEET_ID || 'Non défini');
  console.log('🔧 SHEET_NAME:', SHEET_NAME);

  if (!sheets || !SPREADSHEET_ID) {
    console.error('❌ Configuration Google Sheets manquante');
    console.error('SPREADSHEET_ID:', SPREADSHEET_ID);
    console.error('sheets:', sheets ? 'Disponible' : 'Indisponible');
    return false;
  }

  try {
    const rowData = [
      new Date().toISOString(),
      candidateData.name,
      candidateData.email,
      candidateData.phone ?? '',
      candidateData.experience ?? '',
      candidateData.position ?? '',
      candidateData.location ?? '',
      candidateData.education ?? '',
      candidateData.skills ?? '',
      candidateData.sector ?? '',
      candidateData.level ?? '',
      candidateData.dailyRate ?? '',
      candidateData.cvUrl ?? '',
    ];

    console.log('✅ Données préparées pour Google Sheets:', JSON.stringify(rowData, null, 2));

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:R`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [rowData] },
    });

    console.log('🎉 Réponse Google Sheets:', JSON.stringify(response.data, null, 2));
    return true;
  } catch (error: any) {
    console.error('❌ Erreur Google Sheets détaillée:');
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    if (error.response) {
      console.error('Détails API:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Aucune réponse API disponible');
    }
    return false;
  }
}