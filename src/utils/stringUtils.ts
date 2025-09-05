// Fonction de split sécurisée
export function safeSplit(input: string | undefined | null, separator: string = ','): string[] {
  if (!input) return [];
  
  try {
    return input
      .split(separator)
      .map(item => item.trim())
      .filter(item => item.length > 0);
  } catch (error) {
    console.error('Erreur dans safeSplit:', error);
    return [];
  }
}

// Fonction de validation d'email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Fonction de formatage de numéro de téléphone
export function formatPhoneNumber(phone: string): string {
  return phone.replace(/\D/g, '').replace(/(\d{2})(?=\d)/g, '$1 ');
}