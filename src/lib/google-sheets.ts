import { google } from 'googleapis';
import { safeSplit } from '@/utils/stringUtils';

// Polyfills pour Node.js 18+
if (typeof process !== 'undefined' && typeof process.env !== 'undefined') {
  if (typeof process.env.OPENSSL_CONF === 'undefined') {
    process.env.OPENSSL_CONF = '/dev/null';
  }
}

// Interface pour les données candidat
interface CandidateData {
  name: string;
  email: string;
  phone: string;
  experience: string;
  position: string;
  location: string;
  education: string;
  skills: string;
  sector: string;
  level: string;
  dailyRate: number;
  cvUrl: string;
}

// Configuration d'authentification Google
function getAuth() {
  try {
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;

    if (!privateKey || !clientEmail) {
      console.error('❌ Variables Google manquantes');
      return null;
    }

    const cleanedPrivateKey = privateKey.replace(/\\n/g, '\n').replace(/"/g, '').trim();

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

const auth = getAuth();
const sheets = auth ? google.sheets({ version: 'v4', auth }) : null;

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_ID;
const SHEET_NAME = "Master_KPI_Candidats";

// Extraction nom et prénom
function extractNames(fullName: string): { nom: string; prenom: string } {
  const parts = fullName.split(' ');
  const nom = parts.pop() || '';
  const prenom = parts.join(' ') || fullName;
  return { nom, prenom };
}

// Génération hash anti-doublon
function generateHash(name: string, email: string, phone: string, experience: string): string {
  const str = `${name}${email}${phone}${experience}`.toLowerCase().replace(/\s+/g, '');
  return Buffer.from(str).toString('base64').slice(0, 20);
}

// Ajout candidat dans Google Sheets
export async function addCandidateToSheet(candidateData: CandidateData): Promise<boolean> {
  if (!sheets || !SPREADSHEET_ID) {
    console.log('📋 Mode simulation Google Sheets');
    console.log('Données:', candidateData);
    return true;
  }

  try {
    const { nom, prenom } = extractNames(candidateData.name);
    const hashAntiDoublon = generateHash(
      candidateData.name,
      candidateData.email,
      candidateData.phone,
      candidateData.experience
    );

    // Utilisation sécurisée de safeSplit pour skills
    const skillsArray = safeSplit(candidateData.skills);

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
      skillsArray.join(', '),
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

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('❌ Erreur Google Sheets:', error.message);
    } else {
      console.error('❌ Erreur Google Sheets inconnue:', error);
    }
    return false;
  }
}
