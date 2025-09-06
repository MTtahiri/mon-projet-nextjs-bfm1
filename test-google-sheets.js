// test-google-sheets.js
const { google } = require('googleapis');
const path = require('path');

async function testGoogleSheets() {
  try {
    console.log('Test Google Sheets...');
    
    const auth = new google.auth.GoogleAuth({
      keyFile: path.join(process.cwd(), 'google-service-account.json'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = '1H4bSpOvOEMQ8ftg3aZyf8XJmtDFi9JIN8WaRTuwtUzQ';

    // Test simple de lecture
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'A1:E10',
    });

    console.log('Google Sheets test réussi:', response.data);
    
  } catch (error) {
    console.error('Erreur Google Sheets test:', error);
  }
}

testGoogleSheets();
