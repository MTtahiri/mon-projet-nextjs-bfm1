import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Ici vous irez chercher les données dans Google Sheets
    // Pour l'instant, simulation avec des données mock
    const consultants = [
      {
        id: 1,
        name: "Sarah M.",
        experience: "8 ans",
        competences: ["Recrutement IT", "Management", "Formation RH"],
        secteurs: ["FinTech", "Consulting", "Tech"],
        email: "contact@rh-prospects.fr",
        phone: "+33619257588"
      },
      // ... autres consultants
    ];

    return NextResponse.json({ consultants });
  } catch (error) {
    console.error('Erreur API consultants:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des consultants' },
      { status: 500 }
    );
  }
}