import { useState } from 'react';

export default function ConsultantCard({ consultant, onContact }) {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAnonymizeCV = async () => {
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

      const data = await response.json();
      
      if (data.success) {
        // Ouvrir le CV anonymisé dans un nouvel onglet
        window.open(data.anonymizedUrl, '_blank');
      } else {
        alert('Erreur lors de la génération du CV anonyme');
      }
    } catch (_error) {
      alert('Erreur réseau');
    } finally {
      setLoading(false);
    }
  };

  // Générer initiales depuis le nom
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
        {/* Header avec avatar initiales */}
        <div className="flex items-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
            {getInitials(consultant.name)}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800">{consultant.name}</h3>
            <p className="text-blue-600 font-medium">Consultant Expert</p>
            <p className="text-gray-500">{consultant.experience} • Disponible</p>
          </div>
        </div>

        {/* Compétences */}
        <div className="space-y-3">
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Expertises clés</h4>
            <div className="flex flex-wrap gap-1">
              {consultant.competences.slice(0, 4).map((comp, i) => (
                <span key={i} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
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
            <h4 className="font-semibold text-gray-700 mb-1">Secteurs d'intervention</h4>
            <p className="text-gray-600 text-sm">{consultant.secteurs.join(' • ')}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            <button
              onClick={() => setIsContactModalOpen(true)}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Contacter
            </button>
            <button
              onClick={handleAnonymizeCV}
              disabled={loading || !consultant.fileId}
              className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
            >
              {loading ? 'Génération...' : 'CV Anonyme'}
            </button>
          </div>
        </div>
      </div>

      {/* Modal Contact */}
      {isContactModalOpen && (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Contacter {consultant.name}</h3>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              onContact({
                consultant: consultant,
                clientName: formData.get('clientName'),
                clientEmail: formData.get('clientEmail'),
                message: formData.get('message')
              });
              setIsContactModalOpen(false);
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
                    Message
                  </label>
                  <textarea
                    name="message"
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Décrivez votre besoin..."
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsContactModalOpen(false)}
                  className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Envoyer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}