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
    console.warn("⚠️ [Firebase] VITE_FIREBASE_API_KEY tidak ditemukan. Pastikan sudah diisi di tab Secrets/Settings.");
    return { connected: false, message: "API Key missing" };
  }

  try {
    // Mencoba mengambil dokumen dummy untuk verifikasi koneksi
    // snapshot tetap valid meskipun dokumen tidak ada (does not exist)
    await getDocFromServer(doc(db, 'connection_test', 'verify'));
    console.log("✅ [Firebase] Berhasil terhubung ke Firestore.");
    return { connected: true, message: "Connected" };
  } catch (error: any) {
    console.error("❌ [Firebase] Gagal terhubung:", error);
    
    const errMsg = error?.message || "";
    const errCode = error?.code || "";

    // Jika error karena masalah permission, itu artinya koneksi ke server BERHASIL
    // tapi akses ke dokumen tersebut yang dibatasi.
    if (errMsg.includes('permission-denied') || errCode === 'permission-denied') {
       console.info("ℹ️ [Firebase] Terhubung, namun akses ditolak oleh Security Rules (Ini normal jika belum ada data).");
       return { connected: true, message: "Connected (Auth limited)" };
    }

    return { connected: false, message: errMsg || "Unknown error" };
  }
}

export default app;
