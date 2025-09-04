'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Consultant {
  id: number;
  name: string;
  experience: string;
  competences: string[];
  secteurs: string[];
  email?: string;
  phone?: string;
}

export default function Home() {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulation - À remplacer par un appel API réel vers Google Sheets
    const fetchConsultants = async () => {
      try {
        // Ici vous irez chercher les données dans Google Sheets
        const mockConsultants: Consultant[] = [
          {
            id: 1,
            name: "Sarah M.",
            experience: "8 ans",
            competences: ["Recrutement IT", "Management", "Formation RH"],
            secteurs: ["FinTech", "Consulting", "Tech"],
            email: "contact@rh-prospects.fr",
            phone: "+33619257588"
          },
          {
            id: 2,
            name: "Pierre D.", 
            experience: "12 ans",
            competences: ["Digital", "Change Management", "Innovation"],
            secteurs: ["Banking", "Insurance", "Retail"],
            email: "contact@rh-prospects.fr",
            phone: "+33619257588"
          },
          {
            id: 3,
            name: "Fatima K.",
            experience: "6 ans", 
            competences: ["SEO/SEA", "Social Media", "Analytics"],
            secteurs: ["E-commerce", "Media", "Startup"],
            email: "contact@rh-prospects.fr",
            phone: "+33619257588"
          }
        ];
        setConsultants(mockConsultants);
      } catch (error) {
        console.error('Erreur chargement consultants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConsultants();
  }, []);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleContact = (consultantName: string) => {
    const subject = `Prise de rendez-vous - Consultant ${consultantName}`;
    const body = `Bonjour S.M. Consulting,\n\nJe souhaite prendre rendez-vous concernant le consultant ${consultantName}.\n\nCordialement,`;
    
    // Ouverture email
    window.open(
      `mailto:contact@rh-prospects.fr?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, 
      '_blank'
    );
    
    // Alternative téléphone
    // window.open('tel:+33619257588', '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-teal-600 flex items-center justify-center">
        <div className="text-white text-xl">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-teal-600">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center text-white mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            🌟 S.M. Consulting
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto">
            Mettons en relation les talents internationaux d&apos;exception avec
            les entreprises en recherche d&apos;expertise pointue.
          </p>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="flex flex-col items-center">
                <div className="text-3xl mb-2">✨</div>
                <p className="text-lg">Consultants rigoureusement sélectionnés et certifiés</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-3xl mb-2">🌍</div>
                <p className="text-lg">Expertise locale, impact international</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-3xl mb-2">⚡</div>
                <p className="text-lg">Un matching accéléré pour des missions lancées rapidement</p>
              </div>
            </div>
          </div>
        </div>

        {/* Consultants Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {consultants.map((consultant) => (
            <div 
              key={consultant.id} 
              className="bg-white rounded-2xl shadow-2xl overflow-hidden transform hover:scale-105 transition-all duration-300"
            >
              <div className="p-6">
                <div className="text-center mb-6">
                  {/* Avatar avec initiales */}
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 shadow-lg">
                    {getInitials(consultant.name)}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{consultant.name}</h2>
                  <h3 className="text-lg text-purple-600 font-semibold">Consultant Expert</h3>
                  <p className="text-gray-500 mt-1">{consultant.experience} • Disponible</p>
                </div>

                <div className="space-y-4">
                  {/* Compétences */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">🎯 Expertises :</h4>
                    <div className="flex flex-wrap gap-1">
                      {consultant.competences.slice(0, 4).map((comp, index) => (
                        <span 
                          key={index} 
                          className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                        >
                          {comp}
                        </span>
                      ))}
                      {consultant.competences.length > 4 && (
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                          +{consultant.competences.length - 4} autres
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Secteurs */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">🏢 Secteurs :</h4>
                    <p className="text-sm text-gray-600">{consultant.secteurs.join(' • ')}</p>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2 pt-4 border-t">
                    <button 
                      onClick={() => handleContact(consultant.name)}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
                    >
                      📞 Contacter S.M. Consulting
                    </button>
                    
                    <button className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition-colors">
                      📄 CV Anonyme
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bouton pour rejoindre */}
        <div className="text-center">
          <Link 
            href="/join"
            className="bg-white text-purple-600 px-12 py-4 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 inline-block"
          >
            💼 Rejoindre notre réseau de consultants
          </Link>
        </div>
      </div>
    </div>
  );
}
