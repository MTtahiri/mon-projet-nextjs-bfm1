import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      <div className="flex-grow flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Bienvenue sur la Plateforme SMConsulting
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Plateforme de recrutement de consultants experts - Rejoignez notre réseau d'élite
          </p>
          
          <div className="space-y-4">
            <Link
              href="/join-cv"
              className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-md"
            >
              🚀 Déposer mon CV
            </Link>
            
            <div className="text-sm text-gray-500">
              Processus de recrutement simplifié et sécurisé
            </div>
          </div>

          <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-2xl mb-4">📋</div>
              <h3 className="font-semibold mb-2">CV Dématérialisé</h3>
              <p className="text-gray-600">Upload sécurisé de votre CV</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-2xl mb-4">⚡</div>
              <h3 className="font-semibold mb-2">Traitement Rapide</h3>
              <p className="text-gray-600">Réponse sous 48h</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-2xl mb-4">🔒</div>
              <h3 className="font-semibold mb-2">Données Sécurisées</h3>
              <p className="text-gray-600">Vos données sont protégées</p>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER POUR LA PAGE D'ACCUEIL */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <p className="text-gray-300 text-sm">
              © 2024 S.M. Consulting - Tous droits réservés. | 
              📞 +33 6 19 25 75 88 | 
              ✉️ contact@rh-prospects.fr
            </p>
            <p className="text-gray-400 text-xs mt-2">
              <a href="#" className="hover:text-blue-300 underline">Mentions légales</a> | 
              <a href="#" className="hover:text-blue-300 underline ml-2">Politique de confidentialité</a> | 
              <a href="#" className="hover:text-blue-300 underline ml-2">RGPD</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}