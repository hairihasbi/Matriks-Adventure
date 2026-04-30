import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || '' 
});

export async function explainMatrixConcept(concept: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Jelaskan konsep matriks "${concept}" dengan bahasa yang mudah dimengerti oleh siswa sekolah menengah. Berikan contoh jika memungkinkan. Gunakan format yang ramah (friendly) dan panggil dirimu "Sensei Matriks".`,
      config: {
        systemInstruction: "Kamu adalah 'Sensei Matriks', seorang guru matematika yang ramah, bijaksana, dan ahli dalam menjelaskan konsep matriks dengan cara yang sederhana dan menyenangkan.",
      },
    });

    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Gomen ne! Sensei sedang sedikit sibuk. Coba lagi nanti ya!";
  }
}

export async function chatWithSensei(message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) {
  try {
    const lastMessage = { role: 'user', parts: [{ text: message }] };
    const fullContents = [...history, lastMessage];

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: fullContents,
      config: {
        systemInstruction: "Kamu adalah 'Sensei Matriks', seorang guru matematika yang ramah, bijaksana, dan ahli dalam menjelaskan konsep matriks dengan cara yang sederhana dan menyenangkan. Jawablah pertanyaan siswa seputar matriks.",
      },
    });

    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Gomen ne! Sensei sedang sedikit sibuk. Coba lagi nanti ya!";
  }
}

export async function explainLabOperation(operation: string, matrixA: number[][], matrixB: number[][]) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Sensei, saya sedang di Matrix Lab. Saya sedang melakukan operasi "${operation}" pada Matriks A (${JSON.stringify(matrixA)}) dan Matriks B (${JSON.stringify(matrixB)}). Bisa jelaskan konsepnya secara singkat dan kenapa hasilnya seperti itu?`,
      config: {
        systemInstruction: "Kamu adalah 'Sensei Matriks', guru yang ramah. Jelaskan secara singkat dan padat konsep operasi yang ditanyakan siswa berdasarkan data matriks yang diberikan.",
      },
    });

    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Sensei sedang memikirkan rumus yang rumit. Tanya lagi nanti ya!";
  }
}
