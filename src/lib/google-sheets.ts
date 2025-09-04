import { google } from 'googleapis';

// Solution pour Node.js 18+ - Polyfills globaux
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

// Fonction pour extraire le nom et prénom - SÉCURISÉE
function extractNames(fullName: string): { nom: string; prenom: string } {
  if (!fullName) return { nom: '', prenom: '' };
  
  const parts = (fullName || '').split(' ');
  const nom = parts.pop() || '';
  const prenom = parts.join(' ') || fullName;
  return { nom, prenom };
}

// Fonction pour générer un hash anti-doublon - SÉCURISÉE
function generateHash(name: string, email: string, phone: string, experience: string): string {
  // Protection contre les valeurs undefined
  const safeName = name || '';
  const safeEmail = email || '';
  const safePhone = phone || '';
  const safeExperience = experience || '';
  
  const str = `${safeName}${safeEmail}${safePhone}${safeExperience}`.toLowerCase().replace(/\s+/g, '');
  return Buffer.from(str).toString('base64').slice(0, 20);
}

// Fonction pour ajouter un candidat à Google Sheets
export async function addCandidateToSheet(candidateData: CandidateData): Promise<boolean> {
  if (!sheets || !SPREADSHEET_ID) {
    console.log('📋 Mode simulation Google Sheets');
    console.log('Données:', candidateData);
    return true;
  }

  try {
    // Protection contre les données manquantes
    const safeData = {
      name: candidateData.name || '',
      email: candidateData.email || '',
      phone: candidateData.phone || '',
      experience: candidateData.experience || '',
      position: candidateData.position || '',
      location: candidateData.location || '',
      education: candidateData.education || '',
      skills: candidateData.skills || '',
      sector: candidateData.sector || '',
      level: candidateData.level || '',
      dailyRate: candidateData.dailyRate || 0,
      cvUrl: candidateData.cvUrl || ''
    };

    const { nom, prenom } = extractNames(safeData.name);
    const hashAntiDoublon = generateHash(safeData.name, safeData.email, safeData.phone, safeData.experience);
    
    const rowData = [
      `CAND-${Date.now().toString().slice(-6)}`,
      safeData.cvUrl,
      nom,
      prenom,
      safeData.email,
      safeData.phone,
      safeData.position,
      safeData.experience,
      safeData.location,
      safeData.education,
      safeData.skills, // On garde la chaîne originale, pas de split ici
      safeData.sector,
      safeData.level,
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