import React, { useState } from "react";

export default function UploadModalExample() {
  const [showModal, setShowModal] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      setMessage("Veuillez choisir un fichier");
      return;
    }
    setLoading(true);
    setMessage("");
    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/upload-cv", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        setMessage("Upload réussi ! " + (data.message || ""));
        setShowModal(false);
      } else {
        setMessage("Erreur : " + (data.error || "Une erreur est survenue"));
      }
    } catch (err: any) {
      setMessage("Erreur réseau : " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (<>
      <button
        onClick={() => setShowModal(true)}
        className="px-6 py-3 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition"
      >
        💼 Rejoindre notre réseau de consultants
      </button>

      {showModal && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 relative shadow-lg">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-3xl leading-none"
              aria-label="Fermer la modal"
              type="button"
            >
              ×
            </button>

            <h2 className="text-2xl font-bold mb-6">Rejoignez S.M. Consulting</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-medium text-gray-700">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium text-gray-700">Email *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium text-gray-700">Téléphone</label>
                  <input
                    type="tel"
                    name="phone"
                    className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium text-gray-700">
                    Années d&apos;expérience
                  </label>
                  <input
                    type="text"
                    name="experience"
                    placeholder="Ex: 5 ans"
                    className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium text-gray-700">TJM souhaité (€)</label>
                  <input
                    type="number"
                    name="tjm"
                    placeholder="Ex: 500"
                    className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium text-gray-700">Disponibilité</label>
                  <select
                    name="disponibilite"
                    className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Sélectionnez...</option>
                    <option value="Immédiate">Immédiate</option>
                    <option value="1 mois">Dans 1 mois</option>
                    <option value="2-3 mois">2-3 mois</option>
                    <option value="Négociable">Négociable</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block mb-1 font-medium text-gray-700">Préférences de travail *</label>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        name="modalites"
                        value="Présentiel"
                        className="text-purple-600 focus:ring-purple-500"
                      />
                      <span>Présentiel</span>
                    </label>
                    <label className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        name="modalites"
                        value="Télétravail"
                        className="text-purple-600 focus:ring-purple-500"
                      />
                      <span>Télétravail</span>
                    </label>
                    <label className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        name="modalites"
                        value="Hybride"
                        className="text-purple-600 focus:ring-purple-500"
                      />
                      <span>Hybride</span>
                    </label>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block mb-1 font-medium text-gray-700">Compétences clés</label>
                  <input
                    type="text"
                    name="competences"
                    placeholder="Ex: React, Node.js, MongoDB (séparées par des virgules)"
                    className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block mb-1 font-medium text-gray-700">Secteurs d&apos;intervention</label>
                  <input
                    type="text"
                    name="secteurs"
                    placeholder="Ex: FinTech, E-commerce, SaaS (séparés par des virgules)"
                    className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block mb-1 font-medium text-gray-700">CV (PDF uniquement) *</label>
                  <input
                    type="file"
                    name="cv"
                    accept=".pdf"
                    required
                    className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-purple-500"
                    onChange={handleChange}
                  />
                </div>
              </div>

              {message && (
                <p className="text-center text-sm text-red-600 mt-2">{message}</p>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  disabled={loading}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400"
                >
                  {loading ? "Upload en cours..." : "Envoyer mon CV"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
