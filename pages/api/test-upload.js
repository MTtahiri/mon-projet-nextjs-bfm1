// pages/api/test-upload.js
import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

async function parseForm(req) {
  return new Promise((resolve, reject) => {
    const form = formidable({
      uploadDir: './tmp',
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
  console.log('Méthode:', req.method);
  
  if (req.method === 'GET') {
    return res.status(200).json({ message: 'Endpoint test actif', method: 'GET' });
  }
  
  if (req.method === 'POST') {
    try {
      const contentType = req.headers['content-type'] || '';
      
      if (contentType.includes('application/x-www-form-urlencoded')) {
        const { name, email, dailyRate } = req.body;
        console.log('Form-urlencoded data:', { name, email, dailyRate });
        
        return res.status(200).json({ 
          success: true, 
          message: 'POST reçu (form-urlencoded)',
          data: { name, email, dailyRate }
        });
      }
      
      if (contentType.includes('multipart/form-data')) {
        const { fields, files } = await parseForm(req);
        
        console.log('Form-data fields:', fields);
        console.log('Form-data files:', files);
        
        // Nettoyer les fichiers temporaires
        if (files.cv) {
          const cvFile = Array.isArray(files.cv) ? files.cv[0] : files.cv;
          if (fs.existsSync(cvFile.filepath)) {
            fs.unlinkSync(cvFile.filepath);
          }
        }
        
        return res.status(200).json({ 
          success: true, 
          message: 'POST reçu (form-data)',
          fields,
          files: files ? Object.keys(files) : null
        });
      }
      
      return res.status(400).json({ error: 'Content-Type non supporté: ' + contentType });
      
    } catch (error) {
      console.error('Erreur:', error);
      return res.status(500).json({ error: error.message });
    }
  }
  
  return res.status(405).json({ error: 'Méthode non autorisée' });
}