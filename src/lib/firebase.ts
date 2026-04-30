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
async function testFirebaseConnection() {
  if (!import.meta.env.VITE_FIREBASE_API_KEY) {
    console.warn("⚠️ Firebase API Key belum di-set di Environment Variables.");
    return;
  }

  try {
    // Mencoba mengambil dokumen dummy untuk verifikasi koneksi
    await getDocFromServer(doc(db, 'connection_test', 'verify'));
    console.log("✅ Firebase Connected: Koneksi ke Firestore berhasil!");
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('offline')) {
        console.error("❌ Firebase Error: Client offline atau domain tidak diizinkan.");
      } else {
        console.error("❌ Firebase Connection Failed:", error.message);
      }
    }
  }
}

// Jalankan tes koneksi
testFirebaseConnection();

export default app;
