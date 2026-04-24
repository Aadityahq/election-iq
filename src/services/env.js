const requiredVars = [
  'VITE_GEMINI_API_KEY',
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
  'VITE_FIREBASE_MEASUREMENT_ID',
  'VITE_GOOGLE_MAPS_API_KEY',
];

export function getEnv(name) {
  const value = import.meta.env[name];
  if (!value || value.includes('your_')) {
    console.warn(`Missing or placeholder environment variable: ${name}`);
  }
  return value;
}

export function getMissingEnvKeys() {
  return requiredVars.filter((name) => {
    const value = import.meta.env[name];
    return !value || value.includes('your_');
  });
}
