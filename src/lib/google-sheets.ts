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

// Type pour l'authentification Google
type GoogleAuthType = InstanceType<typeof google.auth.GoogleAuth>;

// Configuration simplifiée et robuste
function getAuth(): GoogleAuthType | null {
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

// Interface pour les noms extraits
interface ExtractedNames {
  nom: string;
  prenom: string;
}

// Fonction pour extraire le nom et prénom - ULTRA SÉCURISÉE
function extractNames(fullName: unknown): ExtractedNames {
  if (typeof fullName !== 'string' || !fullName) {
    return { nom: '', prenom: '' };
  }
  
  try {
    const parts = fullName.split(' ');
    const nom = parts.pop() || '';
    const prenom = parts.join(' ') || fullName;
    return { nom, prenom };
  } catch (error) {
    console.error('Erreur dans extractNames:', error);
    return { nom: '', prenom: String(fullName) };
  }
}

// Fonction pour générer un hash anti-doublon - SÉCURISÉE
function generateHash(name: string, email: string, phone: string, experience: string): string {
  // Protection contre les valeurs undefined
  const safeName = (name || '').toString();
  const safeEmail = (email || '').toString();
  const safePhone = (phone || '').toString();
  const safeExperience = (experience || '').toString();
  
  const str = `${safeName}${safeEmail}${safePhone}${safeExperience}`;
  
  // Vérification supplémentaire pour s'assurer que str est une string
  if (typeof str !== 'string') {
    return '';
  }
  
  return Buffer.from(str.toLowerCase().replace(/\s+/g, '')).toString('base64').slice(0, 20);
}

// Fonction pour ajouter un candidat à Google Sheets
export async function addCandidateToSheet(candidateData: CandidateData): Promise<boolean> {
  if (!sheets || !SPREADSHEET_ID) {
    console.log('📋 Mode simulation Google Sheets');
    console.log('Données:', candidateData);
    return true;
  }

  try {
    // Protection contre les données manquantes - conversion explicite en string
    const safeData = {
      name: String(candidateData.name || ''),
      email: String(candidateData.email || ''),
      phone: String(candidateData.phone || ''),
      experience: String(candidateData.experience || ''),
      position: String(candidateData.position || ''),
      location: String(candidateData.location || ''),
      education: String(candidateData.education || ''),
      skills: String(candidateData.skills || ''),
      sector: String(candidateData.sector || ''),
      level: String(candidateData.level || ''),
      dailyRate: Number(candidateData.dailyRate || 0),
      cvUrl: String(candidateData.cvUrl || '')
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
      safeData.skills,
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

  } catch (error: unknown) {
    // Gestion appropriée des erreurs avec vérification de type
    if (error instanceof Error) {
      console.error('❌ Erreur Google Sheets:', error.message);
    } else {
      console.error('❌ Erreur Google Sheets inconnue:', error);
    }
    return false;
  }
}