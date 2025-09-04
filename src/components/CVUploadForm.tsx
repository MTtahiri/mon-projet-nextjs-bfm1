'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function CVUploadForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const formData = new FormData(e.currentTarget);
    
    try {
      console.log('Tentative envoi formulaire...');
      
      const response = await fetch('/api/upload-cv', {
        method: 'POST',
        body: formData,
      });

      console.log('Réponse reçue:', response.status);
      
      const result = await response.json();
      console.log('Résultat JSON:', result);
      
      if (result.success) {
        setMessage('CV envoyé avec succès!');
        (e.target as HTMLFormElement).reset();
      } else {
        setMessage('Erreur: ' + (result.error || 'Erreur inconnue'));
      }
    } catch (error) {
      console.error('Erreur détaillée:', error);
      setMessage('Erreur réseau - Voir console pour détails');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* Bouton de retour */}
      <div className="mb-6">
        <Link 
          href="/"
          className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center transition-colors duration-200"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour à l'accueil
        </Link>
      </div>

      <h2 className="text-2xl font-bold mb-6 text-gray-800">Déposer votre CV</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Nom complet *</label>
            <input
              type="text"
              name="name"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              placeholder="Votre nom complet"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Email *</label>
            <input
              type="email"
              name="email"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              placeholder="votre@email.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Téléphone</label>
            <input
              type="tel"
              name="phone"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              placeholder="06 12 34 56 78"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Années d'expérience</label>
            <input
              type="text"
              name="experience"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              placeholder="Ex: 5 ans"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Poste recherché</label>
            <input
              type="text"
              name="position"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              placeholder="Ex: Développeur web"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">TJM (€) *</label>
            <input
              type="number"
              name="dailyRate"
              min="100"
              max="2000"
              step="50"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              placeholder="Ex: 500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Localisation</label>
          <input
            type="text"
            name="location"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            placeholder="Ex: Paris, Remote, etc."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Formation</label>
          <input
            type="text"
            name="education"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            placeholder="Ex: Master en Informatique"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Compétences (séparées par des virgules)</label>
          <input
            type="text"
            name="skills"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            placeholder="Ex: React, Node.js, Python, Marketing Digital"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Secteur</label>
            <select 
              name="sector" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            >
              <option value="">Sélectionner...</option>
              <option value="IT">IT</option>
              <option value="Finance">Finance</option>
              <option value="Santé">Santé</option>
              <option value="Commerce">Commerce</option>
              <option value="Consulting">Consulting</option>
              <option value="Ingénierie">Ingénierie</option>
              <option value="Digital">Digital</option>
              <option value="Autre">Autre</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Niveau</label>
            <select 
              name="level" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            >
              <option value="">Sélectionner...</option>
              <option value="Junior">Junior (0-2 ans)</option>
              <option value="Intermédiaire">Intermédiaire (3-5 ans)</option>
              <option value="Senior">Senior (6-10 ans)</option>
              <option value="Expert">Expert (10+ ans)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">CV (PDF uniquement) *</label>
          <input
            type="file"
            name="cv"
            accept=".pdf"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-2">💡 Information importante</h3>
          <p className="text-sm text-blue-700">
            Votre TJM (Tarif Journalier Moyen) nous aide à mieux vous positionner auprès des recruteurs.
            Indiquez un montant réaliste en fonction de votre expérience et expertise.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors duration-200 font-semibold shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-transform duration-200"
        >
          {loading ? (
            <span className="inline-flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Envoi en cours...
            </span>
          ) : (
            'Envoyer mon CV'
          )}
        </button>

        {message && (
          <div className={`p-4 rounded-md border ${
            message.includes('succès') 
              ? 'bg-green-50 text-green-800 border-green-200' 
              : 'bg-red-50 text-red-800 border-red-200'
          }`}>
            <div className="flex items-center">
              {message.includes('succès') ? (
                <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              <span>{message}</span>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}