import { google } from 'googleapis';

// Configuration de l'authentification
function getAuth() {
  try {
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;
    
    if (!privateKey) {
      throw new Error('GOOGLE_PRIVATE_KEY manquante');
    }
    
    if (!process.env.GOOGLE_CLIENT_EMAIL) {
      throw new Error('GOOGLE_CLIENT_EMAIL manquante');
    }

    // Nettoyage de la clé privée
    const cleanedPrivateKey = privateKey
      .replace(/\\n/g, '\n')
      .replace(/"/g, '')
      .trim();

    return new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: cleanedPrivateKey,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
  } catch (error) {
    console.error('Erreur configuration auth:', error);
    throw error;
  }
}

// Initialisation
let auth: any;
let sheets: any;

try {
  auth = getAuth();
  sheets = google.sheets({ version: 'v4', auth });
  console.log('Google Sheets API initialisée');
} catch (error) {
  console.error('Erreur initialisation Google Sheets:', error);
  sheets = null;
}

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_ID;
const SHEET_NAME = "Master_KPI_Candidats";

// Fonction pour extraire le nom et prénom
function extractNames(fullName: string): { nom: string; prenom: string } {
  const parts = fullName.split(' ');
  const nom = parts.pop() || ''; // Dernier élément = nom
  const prenom = parts.join(' '); // Le reste = prénom
  return { nom, prenom };
}

// Fonction pour générer un hash anti-doublon
function generateHash(name: string, email: string, phone: string, experience: string): string {
  const str = `${name}${email}${phone}${experience}`.toLowerCase().replace(/\s+/g, '');
  return Buffer.from(str).toString('base64').slice(0, 20);
}

// Fonction pour ajouter un candidat à Google Sheets
export async function addCandidateToSheet(candidateData: {
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
}): Promise<boolean> {
  if (!sheets || !SPREADSHEET_ID) {
    console.log('Google Sheets non configuré, simulation');
    console.log('Données simulées:', candidateData);
    return true;
  }

  try {
    const { nom, prenom } = extractNames(candidateData.name);
    const hashAntiDoublon = generateHash(candidateData.name, candidateData.email, candidateData.phone, candidateData.experience);
    
    // Préparation des données pour la ligne
    const rowData = [
      `CAND-${Date.now().toString().slice(-6)}`, // Candidat (ID)
      candidateData.cvUrl, // Url
      nom, // Nom
      prenom, // Prenom
      candidateData.email, // Courriel
      candidateData.phone, // Telephone
      candidateData.position, // Poste
      candidateData.experience, // Experience
      candidateData.location, // Localisation
      candidateData.education, // Formation
      candidateData.skills, // Competences
      candidateData.sector, // Secteur
      candidateData.level, // Niveau
      "Nouveau", // Statut
      new Date().toLocaleDateString('fr-FR'), // Date_Ajout
      hashAntiDoublon, // Hash_Anti_Doublon
      "Non vérifié" // Detection_Doublons
    ];

    // Ajout à Google Sheets
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:Q`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [rowData],
      },
    });

    console.log('✅ Candidat ajouté à Google Sheets');
    return true;

  } catch (error: any) {
    console.error('❌ Erreur Google Sheets:', error.message);
    return false;
  }
}