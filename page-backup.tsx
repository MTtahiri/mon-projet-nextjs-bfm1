'use client';

import { useState, FormEvent, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function JoinCVPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const formData = new FormData(event.currentTarget);

      // Validation
      const file = formData.get('cv') as File;
      const name = formData.get('name') as string;
      const email = formData.get('email') as string;
      const dailyRate = formData.get('dailyRate') as string;

      if (!file || !name || !email || !dailyRate) {
        throw new Error('Tous les champs obligatoires doivent être remplis');
      }

      if (file.type !== 'application/pdf') {
        throw new Error('Seuls les fichiers PDF sont acceptés');
      }

      if (file.size > 10 * 1024 * 1024) {
        throw new Error('Le fichier ne doit pas dépasser 10MB');
      }

      const response = await fetch('/api/upload-cv', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'envoi');
      }

      setMessage({
        type: 'success',
        text: '✅ CV envoyé avec succès ! Nous vous contacterons rapidement.'
      });

      if (formRef.current) {
        formRef.current.reset();
      }

      setTimeout(() => {
        router.push('/');
      }, 3000);

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Une erreur inconnue est survenue';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-grow py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Rejoignez l'Équipe S.M. Consulting
            </h1>
            <p className="text-gray-600">
              Déposez votre CV et venez chez S.M. Consulting
            </p>
          </div>

          <form ref={formRef} onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg space-y-6">
            
            {/* Section Informations Personnelles */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold mb-4">Informations Personnelles</h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                    Localisation
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Section Professionnelle */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold mb-4">Informations Professionnelles</h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="position" className="block text-sm font-medium text-gray-700">
                    Poste recherché *
                  </label>
                  <input
                    type="text"
                    id="position"
                    name="position"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                    Années d'expérience *
                  </label>
                  <input
                    type="text"
                    id="experience"
                    name="experience"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="education" className="block text-sm font-medium text-gray-700">
                    Formation *
                  </label>
                  <input
                    type="text"
                    id="education"
                    name="education"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="level" className="block text-sm font-medium text-gray-700">
                    Niveau hiérarchique *
                  </label>
                  <select
                    id="level"
                    name="level"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Sélectionnez</option>
                    <option value="Junior">Junior</option>
                    <option value="Confirmé">Confirmé</option>
                    <option value="Senior">Senior</option>
                    <option value="Manager">Manager</option>
                    <option value="Directeur">Directeur</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="sector" className="block text-sm font-medium text-gray-700">
                    Secteur d'activité *
                  </label>
                  <input
                    type="text"
                    id="sector"
                    name="sector"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
                    Compétences (séparées par des virgules) *
                  </label>
                  <input
                    type="text"
                    id="skills"
                    name="skills"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="dailyRate" className="block text-sm font-medium text-gray-700">
                    TJM souhaité (€) *
                  </label>
                  <input
                    type="number"
                    id="dailyRate"
                    name="dailyRate"
                    required
                    min="100"
                    max="2000"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Section CV */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Curriculum Vitae</h2>
              
              <div>
                <label htmlFor="cv" className="block text-sm font-medium text-gray-700">
                  CV (PDF uniquement, max 10MB) *
                </label>
                <input
                  type="file"
                  id="cv"
                  name="cv"
                  accept=".pdf"
                  required
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            </div>

            {/* Consentement RGPD */}
            <div className="bg-blue-50 p-4 rounded-md">
              <div className="flex items-start">
                <input
                  id="rgpd-consent"
                  name="rgpd-consent"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded mt-1"
                />
                <label htmlFor="rgpd-consent" className="ml-2 block text-sm text-gray-900">
                  J'autorise S.M. Consulting à traiter mes données personnelles dans le cadre 
                  du processus de recrutement. Mes données seront conservées pendant 
                  2 ans et ne seront pas transmises à des tiers sans mon consentement.
                </label>
              </div>
            </div>

            {/* Bouton Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg"
            >
              {isSubmitting ? '⏳ Envoi en cours...' : '📤 Envoyer ma candidature'}
            </button>

            {/* Messages */}
            {message && (
              <div className={`p-4 rounded-md ${
                message.type === 'success' 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                <p className="font-medium">{message.text}</p>
              </div>
            )}
          </form>

          <div className="text-center mt-8">
            <button
              onClick={() => router.back()}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
      
      {/* SUPPRIMÉ : Le footer a été retiré pour éviter le doublon */}
      {/* Le footer global dans layout.tsx suffit */}
    </div>
  );
}