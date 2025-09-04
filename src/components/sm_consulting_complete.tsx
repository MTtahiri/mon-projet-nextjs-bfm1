"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';

// Interface pour typer les consultants
interface Consultant {
  id: number;
  name: string;
  experience: string;
  competences: string[];
  secteurs: string[];
  fileId: string | null;
  cvUrl: string | null;
}

export default function SMConsulting() {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedConsultant, setSelectedConsultant] = useState<Consultant | null>(null);
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [loading, setLoading] = useState(false);

  // Données par défaut si l'API ne répond pas (mémoïsée pour éviter les re-renders)
  const defaultConsultants = useMemo((): Consultant[] => [
    {
      id: 1,
      name: "Sarah M.",
      experience: "8 ans",
      competences: ["Recrutement IT", "Management", "Formation RH"],
      secteurs: ["FinTech", "Consulting", "Tech"],
      fileId: null,
      cvUrl: null
    },
    {
      id: 2,
      name: "Pierre D.", 
      experience: "12 ans",
      competences: ["Digital", "Change Management", "Innovation"],
      secteurs: ["Banking", "Insurance", "Retail"],
      fileId: null,
      cvUrl: null
    },
    {
      id: 3,
      name: "Fatima K.",
      experience: "6 ans", 
      competences: ["SEO/SEA", "Social Media", "Analytics"],
      secteurs: ["E-commerce", "Media", "Startup"],
      fileId: null,
      cvUrl: null
    }
  ], []);

  // Charger consultants depuis l'API
  const loadConsultants = useCallback(async () => {
    try {
      const response = await fetch('/api/upload-cv');
      if (response.ok) {
        const data = await response.json();
        setConsultants(data.consultants?.length > 0 ? data.consultants : defaultConsultants);
      } else {
        setConsultants(defaultConsultants);
      }
    } catch (_error) {
      console.log('Utilisation des données par défaut');
      setConsultants(defaultConsultants);
    }
  }, [defaultConsultants]);

  useEffect(() => {
    loadConsultants();
  }, [loadConsultants]);

  // Gestion contact consultant
  const handleContactConsultant = (consultant: Consultant) => {
    setSelectedConsultant(consultant);
    setShowContactModal(true);
  };

  // Envoi email contact
  const handleSendContact = async (formData: FormData) => {
    if (!selectedConsultant) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('clientName'),
          email: formData.get('clientEmail'),
          message: `Demande de contact pour le consultant ${selectedConsultant.name}\n\n${formData.get('message')}`,
          type: 'Contact Consultant',
          company: formData.get('company') || ''
        })
      });

      const result = await response.json();
      if (result.success) {
        alert('Message envoyé avec succès ! Nous vous recontacterons rapidement.');
        setShowContactModal(false);
      } else {
        alert('Erreur lors de l\'envoi du message');
      }
    } catch (_error) {
      alert('Erreur réseau');
    } finally {
      setLoading(false);
    }
  };

  // Upload consultant CV
  const handleUploadCV = async (formData: FormData) => {
    setLoading(true);
    try {
      const response = await fetch('/api/upload-cv', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      if (result.success) {
        alert('CV uploadé avec succès ! Nous examinerons votre candidature.');
        setShowUploadModal(false);
        loadConsultants(); // Recharger la liste
      } else {
        alert('Erreur lors de l\'upload : ' + (result.details || result.error));
      }
    } catch (_error) {
      alert('Erreur réseau lors de l\'upload');
    } finally {
      setLoading(false);
    }
  };

  // Générer CV anonyme
  const handleAnonymizeCV = async (consultant: Consultant) => {
    if (!consultant.fileId) {
      alert('Aucun CV disponible pour ce consultant');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/anonymize-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          consultantId: consultant.id,
          fileId: consultant.fileId
        })
      });

      const result = await response.json();
      if (result.success) {
        window.open(result.anonymizedUrl, '_blank');
      } else {
        alert('Erreur lors de la génération du CV anonyme');
      }
    } catch (_error) {
      alert('Erreur réseau');
    } finally {
      setLoading(false);
    }
  };

  // Générer initiales
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-teal-600">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center text-white mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            🌟 S.M. Consulting
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto">
            Mettons en relation les talents internationaux d&apos;exception avec les entreprises en recherche d&apos;expertise pointue.
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
            <div key={consultant.id} className="bg-white rounded-2xl shadow-2xl overflow-hidden transform hover:scale-105 transition-all duration-300">
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
                      {consultant.competences?.slice(0, 3).map((comp, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                          {comp}
                        </span>
                      ))}
                      {consultant.competences?.length > 3 && (
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                          +{consultant.competences.length - 3} autres
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Secteurs */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">🏢 Secteurs :</h4>
                    <p className="text-sm text-gray-600">{consultant.secteurs?.join(' • ')}</p>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2 pt-4 border-t">
                    <button 
                      onClick={() => handleContactConsultant(consultant)}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
                    >
                      📞 Contacter {consultant.name.split(' ')[0]}
                    </button>
                    
                    {consultant.fileId && (
                      <button 
                        onClick={() => handleAnonymizeCV(consultant)}
                        disabled={loading}
                        className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-gray-400"
                      >
                        {loading ? 'Génération...' : '📄 CV Anonyme'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button 
            onClick={() => setShowUploadModal(true)}
            className="bg-white text-purple-600 px-12 py-4 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
          >
            💼 Rejoindre notre réseau de consultants
          </button>
        </div>
      </div>

      {/* Modal Upload CV */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Rejoignez S.M. Consulting</h2>
                <button 
                  onClick={() => setShowUploadModal(false)}
                  className="text-2xl text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                handleUploadCV(formData);
              }}>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nom complet *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Années d&apos;expérience
                      </label>
                      <input
                        type="text"
                        name="experience"
                        placeholder="Ex: 5 ans"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Compétences clés
                    </label>
                    <input
                      type="text"
                      name="competences"
                      placeholder="Ex: React, Node.js, MongoDB (séparées par des virgules)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Secteurs d&apos;intervention
                    </label>
                    <input
                      type="text"
                      name="secteurs"
                      placeholder="Ex: FinTech, E-commerce, SaaS (séparés par des virgules)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CV (PDF uniquement) *
                    </label>
                    <input
                      type="file"
                      name="cv"
                      accept=".pdf"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400"
                  >
                    {loading ? 'Upload en cours...' : 'Envoyer mon CV'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Contact Consultant */}
      {showContactModal && selectedConsultant && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Contacter {selectedConsultant.name}</h3>
                <button 
                  onClick={() => setShowContactModal(false)}
                  className="text-2xl text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                handleSendContact(new FormData(e.target as HTMLFormElement));
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Votre nom *
                    </label>
                    <input
                      type="text"
                      name="clientName"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="clientEmail"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Entreprise
                    </label>
                    <input
                      type="text"
                      name="company"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <textarea
                      name="message"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Décrivez votre besoin en consulting..."
                    />
                  </div>
                </div>
                
                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowContactModal(false)}
                    className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    {loading ? 'Envoi...' : 'Envoyer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}