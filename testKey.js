import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config({ path: '.env.local' });

const key = process.env.GOOGLE_PRIVATE_KEY;

try {
  crypto.createPrivateKey({ key, format: 'pem', type: 'pkcs8' });
  console.log('✅ Clé PKCS#8 valide');
} catch (e) {
  console.error('❌ Clé invalide', e.message);
}
