'use client';
import { useState, useEffect } from 'react';

export default function MonComposant() {
  const [estMonte, setEstMonte] = useState(false);

  useEffect(() => {
    setEstMonte(true);
  }, []);

  if (!estMonte) {
    return <div>Chargement...</div>;
  }

  return <div>Contenu affiché après montage : {new Date().toLocaleString()}</div>;
}
