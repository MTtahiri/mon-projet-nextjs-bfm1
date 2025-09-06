// pages/api/upload-cv.js
import formidable from "formidable";
import fs from "fs";
import { google } from "googleapis";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

async function parseForm(req) {
  return new Promise((resolve, reject) => {
    const form = formidable({
      uploadDir: "./tmp",
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024,
    });

    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    const { fields, files } = await parseForm(req);
    
    const name = fields.name?.[0];
    const email = fields.email?.[0];
    const dailyRate = fields.dailyRate?.[0];
    const cvFile = files.cv?.[0];

    if (!name || !email || !dailyRate || !cvFile) {
      return res.status(400).json({ error: "Fichier, nom, email et TJM sont requis" });
    }

    console.log("Données reçues:", { name, email, dailyRate });

    // === CODE GOOGLE SHEETS ===
    const auth = new google.auth.GoogleAuth({
      keyFile: path.join(process.cwd(), "google-service-account.json"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "A1",
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [[name, email, dailyRate, cvFile.originalFilename, new Date().toISOString()]],
      },
    });

    // Nettoyer le fichier temporaire
    if (fs.existsSync(cvFile.filepath)) {
      fs.unlinkSync(cvFile.filepath);
    }

    res.status(200).json({ success: true, message: "CV uploadé avec succès" });

  } catch (error) {
    console.error("Erreur:", error);
    res.status(500).json({ error: "Erreur lors du traitement: " + error.message });
  }
}
