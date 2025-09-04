/**
 * Sécurise l'appel à split pour éviter une erreur si la chaîne est undefined ou null
 * @param input - chaîne de caractères ou undefined/null
 * @param sep - séparateur (défaut : ',')
 * @returns un tableau de chaînes vide si input est falsy, sinon split & trim
 */
export function safeSplit(input: string | undefined | null, sep: string | RegExp = ','): string[] {
  if (!input) return [];
  return input.split(sep).map(s => s.trim());
}
