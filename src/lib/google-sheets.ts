export async function addCandidateToSheet(candidateData: CandidateData): Promise<boolean> {
  console.log('📊 Tentative d\'enregistrement Google Sheets:', candidateData);
  
  if (!sheets || !SPREADSHEET_ID) {
    console.log('❌ Configuration Google Sheets manquante');
    console.log('SPREADSHEET_ID:', SPREADSHEET_ID);
    console.log('sheets:', sheets ? 'Disponible' : 'Indisponible');
    return false;
  }

  try {
    // ... [votre code existant]

    console.log('✅ Données préparées pour Google Sheets:', rowData);

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:R`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [rowData] },
    });

    console.log('🎉 Données enregistrées avec succès dans Google Sheets');
    return true;

  } catch (error: unknown) {
    console.error('❌ Erreur Google Sheets détaillée:');
    if (error instanceof Error) {
      console.error('Message:', error.message);
      console.error('Stack:', error.stack);
    } else {
      console.error('Erreur inconnue:', error);
    }
    return false;
  }
}