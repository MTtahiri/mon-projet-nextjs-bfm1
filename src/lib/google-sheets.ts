import { google } from 'googleapis';

// Solution pour Node.js 18+ - Polyfills globaux
if (typeof process !== 'undefined' && typeof process.env !== 'undefined') {
  if (typeof process.env.OPENSSL_CONF === 'undefined') {
    process.env.OPENSSL_CONF = '/dev/null';
  }
}

// Configuration simplifiée et robuste
function getAuth() {
  try {
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    
    if (!privateKey || !clientEmail) {
      console.error('❌ Variables Google manquantes');
      return null;
    }

    // Nettoyage de la clé privée
    const cleanedPrivateKey = privateKey
      .replace(/\\n/g, '\n')
      .replace(/"/g, '')
      .trim();

    return new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: cleanedPrivateKey,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
  } catch (error) {
    console.error('❌ Erreur configuration auth:', error);
    return null;
  }
}

// Initialisation
const auth = getAuth();
const sheets = auth ? google.sheets({ version: 'v4', auth }) : null;

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_ID;
const SHEET_NAME = "Master_KPI_Candidats";

// Fonction pour ajouter un candidat
export async function addCandidateToSheet(candidateData: any): Promise<boolean> {
  if (!sheets || !SPREADSHEET_ID) {
    console.log('📋 Mode simulation Google Sheets');
    console.log('Données:', candidateData);
    return true;
  }

  try {
    const { nom, prenom } = extractNames(candidateData.name);
    const hashAntiDoublon = generateHash(candidateData.name, candidateData.email, candidateData.phone, candidateData.experience);
    
    const rowData = [
      `CAND-${Date.now().toString().slice(-6)}`,
      candidateData.cvUrl,
      nom,
      prenom,
      candidateData.email,
      candidateData.phone,
      candidateData.position,
      candidateData.experience,
      candidateData.location,
      candidateData.education,
      candidateData.skills,
      candidateData.sector,
      candidateData.level,
      "Nouveau",
      new Date().toLocaleDateString('fr-FR'),
      hashAntiDoublon,
      "Non vérifié"
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:Q`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [rowData] },
    });

    console.log('✅ Candidat ajouté à Google Sheets');
    return true;

  } catch (error: any) {
    console.error('❌ Erreur Google Sheets:', error.message);
    return false;
  }
}

// Fonctions utilitaires
function extractNames(fullName: string) {
  const parts = fullName.split(' ');
  return {
    nom: parts.pop() || '',
    prenom: parts.join(' ') || fullName
  };
}

function generateHash(name: string, email: string, phone: string, experience: string) {
  const str = `${name}${email}${phone}${experience}`.toLowerCase().replace(/\s+/g, '');
  return Buffer.from(str).toString('base64').slice(0, 20);
}