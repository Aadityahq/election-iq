import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported as analyticsSupported } from 'firebase/analytics';
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { getEnv } from './env';

const firebaseConfig = {
  apiKey: getEnv('VITE_FIREBASE_API_KEY'),
  authDomain: getEnv('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: getEnv('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: getEnv('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnv('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnv('VITE_FIREBASE_APP_ID'),
  measurementId: getEnv('VITE_FIREBASE_MEASUREMENT_ID'),
};

const hasFirebaseConfig = Object.values(firebaseConfig).every(Boolean);

let db = null;
let app = null;
if (hasFirebaseConfig) {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} else {
  console.warn('Firebase is not configured yet. Firestore writes will be skipped until .env.local is completed.');
}

export { db };

export async function initFirebaseAnalytics() {
  if (!app) return null;

  const supported = await analyticsSupported();
  if (!supported) return null;

  try {
    return getAnalytics(app);
   } catch (err) {
     console.log('Caught error in initFirebaseAnalytics:', err);
     console.error('Error initializing analytics:', err);
     return null;
   }
}

export async function saveMessage(sessionId, message, sender) {
  if (!db) return;
  try {
    await addDoc(collection(db, 'messages'), {
      sessionId,
      message,
      sender,
      timestamp: new Date(),
    });
  } catch (err) {
    console.error('Error saving message:', err);
  }
}

export async function getMessages(sessionId) {
  if (!db) return [];
  try {
    const q = query(
      collection(db, 'messages'),
      where('sessionId', '==', sessionId),
      orderBy('timestamp', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data());
  } catch (err) {
    console.error('Error fetching messages:', err);
    return [];
  }
}

export async function saveQuizScore(sessionId, topicId, score, totalQuestions) {
  if (!db) return;
  try {
    await addDoc(collection(db, 'quizScores'), {
      sessionId,
      topicId,
      score,
      totalQuestions,
      percentage: Math.round((score / totalQuestions) * 100),
      timestamp: new Date(),
    });
  } catch (err) {
    console.error('Error saving quiz score:', err);
  }
}

export async function getQuizScores(sessionId) {
  if (!db) return [];
  try {
    const q = query(
      collection(db, 'quizScores'),
      where('sessionId', '==', sessionId),
      orderBy('timestamp', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data());
  } catch (err) {
    console.error('Error fetching quiz scores:', err);
    return [];
  }
}
