module.exports = {
  extends: "next/core-web-vitals",
  rules: {
    "react/no-unescaped-entities": "off",
    "@next/next/no-img-element": "off",

    // Désactiver la règle ESLint native no-unused-vars
    "no-unused-vars": "off",

    // Activer la règle TypeScript avec options personnalisées
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        "argsIgnorePattern": "^_",              // Ignorer les arguments qui commencent par _
        "varsIgnorePattern": "^_",              // Ignorer les variables qui commencent par _
        "caughtErrorsIgnorePattern": "^_",      // Ignorer les erreurs catch qui commencent par _
        "ignoreRestSiblings": true              // Ignorer les rest siblings dans la déstructuration
      }
    ]
  }
};
