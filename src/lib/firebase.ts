import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';

// Configuration Firebase menggunakan Environment Variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Fungsi untuk mengetes koneksi ke Firestore
export async function checkFirebaseConnection() {
  if (!import.meta.env.VITE_FIREBASE_API_KEY) {
    return { connected: false, message: "API Key missing" };
  }

  try {
    // Mencoba mengambil dokumen dummy untuk verifikasi koneksi
    await getDocFromServer(doc(db, 'connection_test', 'verify'));
    return { connected: true, message: "Connected" };
  } catch (error: any) {
    if (error?.message?.includes('offline') || error?.message?.includes('permission-denied')) {
       // permission-denied actually means we reached the server but don't have access to this specific doc, 
       // which still means the connection itself is working.
       return { connected: true, message: "Connected (Auth limited)" };
    }
    return { connected: false, message: error?.message || "Unknown error" };
  }
}

export default app;
