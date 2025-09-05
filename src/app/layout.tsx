import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Plateforme Recrutement S.M. Consulting',
  description: 'Déposez votre CV pour rejoindre notre équipe',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <main className="flex-grow">
            {children}
          </main>
          
          {/* Footer global */}
          <footer className="bg-gray-800 text-white py-8">
            <div className="max-w-6xl mx-auto px-4">
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">S.M. Consulting</h3>
                  <p className="text-gray-300 text-sm">
                    13 rue Gustave Eiffel<br />
                    92110, Clichy France<br />
                    ✉️ contact@rh-prospects.fr<br />
                    📞 +33 6 19 25 75 88
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Horaires</h3>
                  <p className="text-gray-300 text-sm">
                    Lun-Ven: 9h-18h<br />
                    Sam: 10h-16h<br />
                    Dim: Fermé
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Protection des données</h3>
                  <p className="text-gray-300 text-sm">
                    Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès,
                    de rectification et de suppression de vos données.
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-700 mt-8 pt-8 text-center">
                <p className="text-gray-300 text-sm">
                  © 2024 S.M. Consulting - Tous droits réservés. |
                  SIRET: 438 184 707 00083 | APE: 4690Z
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
