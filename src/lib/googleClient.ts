import { google } from 'googleapis';
import crypto from 'crypto';

function getPrivateKey(): string {
  const raw = process.env.GOOGLE_PRIVATE_KEY ?? '';
  const key = raw.replace(/\\n/g, '\n');

  try {
    // Essai PKCS#8
    crypto.createPrivateKey({ key, format: 'pem', type: 'pkcs8' });
  } catch {
    // Essai fallback PKCS#1
    crypto.createPrivateKey({ key, format: 'pem' });
  }

  return key;
}

export function getGoogleAuth() {
  return new google.auth.JWT({
    email: process.env.GOOGLE_CLIENT_EMAIL,
    key: getPrivateKey(),
    scopes: [
      'https://www.googleapis.com/auth/drive',
      'https://www.googleapis.com/auth/spreadsheets',
    ],
  });
}

export function getSheetsClient() {
  return google.sheets({ version: 'v4', auth: getGoogleAuth() });
}

export function getDriveClient() {
  return google.drive({ version: 'v3', auth: getGoogleAuth() });
}
