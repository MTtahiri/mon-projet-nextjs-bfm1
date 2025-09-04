export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">🌟 S.M. Consulting</h3>
            <p className="text-gray-300 mb-4 max-w-md">
              Expert en mise en relation entre talents internationaux et entreprises en recherche d'expertise pointue.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://linkedin.com/company/sm-consulting" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <div className="space-y-2 text-gray-300">
              <p>📧 contact@saveursmaghrebines.com</p>
              <p>📱 +33 (0)1 23 45 67 89</p>
              <p>📍 Paris, France</p>
              <p>🕒 Lun-Ven 9h-18h</p>
            </div>
          </div>

          {/* Liens légaux */}
          <div>
            <h4 className="font-semibold mb-4">Informations légales</h4>
            <div className="space-y-2">
              <a href="/mentions-legales" className="text-gray-300 hover:text-white transition-colors block">
                Mentions légales
              </a>
              <a href="/politique-confidentialite" className="text-gray-300 hover:text-white transition-colors block">
                Politique de confidentialité
              </a>
              <a href="/cgv" className="text-gray-300 hover:text-white transition-colors block">
                CGV
              </a>
              <a href="/cookies" className="text-gray-300 hover:text-white transition-colors block">
                Gestion des cookies
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 S.M. Consulting. Tous droits réservés.</p>
          <p className="mt-2 text-sm">Conformité RGPD - Données personnelles protégées</p>
        </div>
      </div>
    </footer>
  );
}