'use client';

import { signIn } from 'next-auth/react';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Connexion à Saveurs Maghrébines
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Connectez-vous avec Google pour gérer les CVs
          </p>
        </div>
        <div>
          <button
            onClick={() => signIn('google')}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Se connecter avec Google
          </button>
        </div>
      </div>
    </div>
  );
}