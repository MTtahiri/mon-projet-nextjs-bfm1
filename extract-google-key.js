// Script pour extraire la clé du fichier JSON Google
// Placez votre fichier JSON téléchargé dans le même dossier

const fs = require('fs');

try {
  // Remplacez 'google-service-account.json' par le nom de votre fichier JSON téléchargé
  const serviceAccount = JSON.parse(fs.readFileSync('google-service-account.json', 'utf8'));
  
  console.log('✅ Fichier JSON lu avec succès');
  console.log('📧 Client Email:', serviceAccount.client_email);
  console.log('🔑 Private Key trouvée');
  
  // Extraire les variables pour .env.local
  console.log('\n--- COPIEZ CES LIGNES DANS VOTRE .env.local ---\n');
  
  console.log(`GOOGLE_CLIENT_EMAIL=${serviceAccount.client_email}`);
  console.log(`GOOGLE_PRIVATE_KEY="${serviceAccount.private_key}"`);
  
  // Vérifier le format de la clé
  if (serviceAccount.private_key.includes('BEGIN PRIVATE KEY')) {
    console.log('\n✅ Format de clé correct détecté');
  } else {
    console.log('\n❌ Format de clé incorrect');
  }
  
} catch (error) {
  console.error('❌ Erreur:', error.message);
  console.log('\n📝 Instructions:');
  console.log('1. Téléchargez un nouveau fichier JSON depuis Google Cloud Console');
  console.log('2. Placez-le dans ce dossier');
  console.log('3. Renommez-le "google-service-account.json"');
  console.log('4. Relancez ce script');
}