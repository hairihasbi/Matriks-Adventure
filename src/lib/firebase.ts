import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';

// Configuration Firebase menggunakan Environment Variables
const sanitize = (val: any) => typeof val === 'string' ? val.trim().replace(/^["']|["']$/g, '') : val;

const firebaseConfig = {
  apiKey: sanitize(import.meta.env.VITE_FIREBASE_API_KEY),
  authDomain: sanitize(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN),
  projectId: sanitize(import.meta.env.VITE_FIREBASE_PROJECT_ID),
  storageBucket: sanitize(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: sanitize(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID),
  appId: sanitize(import.meta.env.VITE_FIREBASE_APP_ID),
  measurementId: sanitize(import.meta.env.VITE_FIREBASE_MEASUREMENT_ID)
};

// Validasi dasar konfigurasi
const isConfigValid = !!firebaseConfig.apiKey && firebaseConfig.apiKey.startsWith('AIza');

if (!isConfigValid) {
  console.error("❌ [Firebase] Konfigurasi tidak valid. Periksa VITE_FIREBASE_API_KEY di environment variables.");
}

// Inisialisasi Firebase (hanya jika config ada untuk menghindari crash fatal)
let app = null;
let authInstance = null;
let dbInstance = null;

if (isConfigValid) {
  try {
    app = initializeApp(firebaseConfig);
    authInstance = getAuth(app);
    dbInstance = getFirestore(app);
  } catch (error) {
    console.error("❌ [Firebase] Gagal inisialisasi SDK:", error);
  }
}

export const auth = authInstance;
export const db = dbInstance;

// Fungsi untuk mengetes koneksi ke Firestore
export async function checkFirebaseConnection() {
  if (!isConfigValid || !db) {
    return { connected: false, message: "Konfigurasi Firebase tidak valid atau belum di-set." };
  }

  try {
    // Mencoba mengambil dokumen dummy untuk verifikasi koneksi
    // snapshot tetap valid meskipun dokumen tidak ada (does not exist)
    await getDocFromServer(doc(db, 'connection_test', 'verify'));
    console.log("✅ [Firebase] Berhasil terhubung ke Firestore.");
    return { connected: true, message: "Connected" };
  } catch (error: any) {
    const errMsg = (error?.message || "").toLowerCase();
    const errCode = (error?.code || "").toLowerCase();

    // Jika error adalah permission-denied, artinya KONEKSI BERHASIL 
    // karena server Firebase merespons (hanya saja akses ditolak).
    if (errMsg.includes('permission-denied') || errCode.includes('permission-denied')) {
       console.info("✅ [Firebase] Terhubung! Status: Terkoneksi (Akses ditolak oleh Security Rules).");
       return { connected: true, message: "Connected (Permission Refused)" };
    }

    console.error("❌ [Firebase] Gagal terhubung ke Firestore:", error);
    return { connected: false, message: errMsg || "Unknown error" };
  }
}

export default app;
