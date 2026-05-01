import { GoogleGenAI } from "@google/genai";

const getAllApiKeys = () => {
  return [
    import.meta.env.VITE_GEMINI_API_KEY,
    import.meta.env.VITE_GEMINI_API_KEY_1,
    import.meta.env.VITE_GEMINI_API_KEY_2,
    import.meta.env.VITE_GEMINI_API_KEY_3
  ].filter(key => !!key);
};

// Fungsi pembungkus untuk memanggil AI dengan rotasi dan retry jika terkena limit
async function callAiWithRetry(fn: (ai: GoogleGenAI) => Promise<any>) {
  const keys = getAllApiKeys();
  if (keys.length === 0) {
    const defaultKey = (typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : '') || '';
    const ai = new GoogleGenAI({ apiKey: defaultKey });
    return await fn(ai);
  }

  const shuffledKeys = [...keys].sort(() => Math.random() - 0.5);
  let lastError: any = null;

  for (const key of shuffledKeys) {
    try {
      const ai = new GoogleGenAI({ apiKey: key });
      return await fn(ai);
    } catch (error: any) {
      lastError = error;
      const errorStr = JSON.stringify(error).toLowerCase();
      const isQuotaExceeded = errorStr.includes('429') || errorStr.includes('quota') || errorStr.includes('limit');
      
      if (isQuotaExceeded) {
        console.warn(`[Gemini] Key limit reached or quota exceeded, trying next key...`);
        continue;
      }
      throw error;
    }
  }
  throw lastError;
}

export async function explainMatrixConcept(concept: string) {
  try {
    return await callAiWithRetry(async (instance) => {
      const response = await instance.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Jelaskan konsep matriks "${concept}" dengan bahasa yang mudah dimengerti oleh siswa sekolah menengah. Berikan contoh jika memungkinkan. Gunakan format yang ramah (friendly) dan panggil dirimu "Sensei Matriks".`,
        config: {
          systemInstruction: "Kamu adalah 'Sensei Matriks', seorang guru matematika yang ramah, bijaksana, dan ahli dalam menjelaskan konsep matriks dengan cara yang sederhana dan menyenangkan.",
        }
      });
      return response.text;
    });
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Gomen ne! Energi Sensei sedang habis (Quota Limit). Istirahat sebentar dan coba lagi nanti ya!";
  }
}

export async function chatWithSensei(message: string, history: any[]) {
  try {
    return await callAiWithRetry(async (instance) => {
      const lastMessage = { role: 'user', parts: [{ text: message }] };
      const fullContents = [...history, lastMessage];

      const response = await instance.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: fullContents,
        config: {
          systemInstruction: "Kamu adalah 'Sensei Matriks', seorang guru matematika yang ramah, bijaksana, dan ahli dalam menjelaskan konsep matriks dengan cara yang sederhana dan menyenangkan. Jawablah pertanyaan siswa seputar matriks.",
        }
      });
      return response.text;
    });
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Gomen ne! Sensei sedang meditasi untuk memulihkan energi API. Coba lagi beberapa saat lagi!";
  }
}

export async function explainLabOperation(operation: string, matrixA: number[][], matrixB: number[][]) {
  try {
    return await callAiWithRetry(async (instance) => {
      const response = await instance.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Sensei, saya sedang di Matrix Lab. Saya sedang melakukan operasi "${operation}" pada Matriks A (${JSON.stringify(matrixA)}) dan Matriks B (${JSON.stringify(matrixB)}). Bisa jelaskan konsepnya secara singkat dan kenapa hasilnya seperti itu?`,
        config: {
          systemInstruction: "Kamu adalah 'Sensei Matriks', guru yang ramah. Jelaskan secara singkat dan padat konsep operasi yang ditanyakan siswa berdasarkan data matriks yang diberikan.",
        }
      });
      return response.text;
    });
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Sensei sedang memikirkan rumus yang rumit. Tanya lagi nanti ya!";
  }
}
