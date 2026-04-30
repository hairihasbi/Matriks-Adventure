import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Award, Shield, Star, Download, Bot, X } from 'lucide-react';
import html2canvas from 'html2canvas';

interface CertificateProps {
  score: number;
  difficulty: string;
  date: string;
  onClose: () => void;
}

const Certificate: React.FC<CertificateProps> = ({ score, difficulty, date, onClose }) => {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [fullName, setFullName] = useState('');
  const [isFinalized, setIsFinalized] = useState(false);

  const downloadCertificate = async () => {
    if (!certificateRef.current) return;
    
    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        backgroundColor: '#0f172a',
        logging: false,
      });
      
      const image = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement('a');
      link.download = `Sertifikat_Matriks_${fullName.replace(/\s+/g, '_')}.png`;
      link.href = image;
      link.click();
    } catch (err) {
      console.error("Gagal mengunduh sertifikat:", err);
    }
  };

  if (!isFinalized) {
    return (
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/10 border border-white/20 p-8 md:p-12 rounded-[3rem] max-w-md w-full text-center shadow-2xl backdrop-blur-3xl"
        >
          <div className="w-20 h-20 bg-yellow-400 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl rotate-12">
            <Award className="w-12 h-12 text-slate-900" />
          </div>
          <h2 className="text-3xl font-black text-white mb-4 uppercase italic">Siapa Namamu, Master?</h2>
          <p className="text-white/60 mb-8 text-sm">Nama ini akan dicetak secara permanen dalam Sertifikat Kelulusanmu.</p>
          
          <input 
            autoFocus
            type="text"
            placeholder="Masukkan Nama Lengkap"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full bg-white/5 border-2 border-white/10 rounded-2xl px-6 py-4 text-white text-xl font-bold focus:border-yellow-400 focus:ring-0 transition-all text-center mb-6"
          />

          <div className="flex flex-col gap-3">
            <button 
              disabled={!fullName.trim()}
              onClick={() => setIsFinalized(true)}
              className="w-full py-5 bg-yellow-400 text-slate-900 rounded-2xl font-black text-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:hover:scale-100"
            >
              Terbitkan Sertifikat
            </button>
            <button 
              onClick={onClose}
              className="w-full py-4 bg-transparent text-white/50 rounded-2xl font-bold hover:text-white transition-colors"
            >
              Batal
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
      <div className="max-w-4xl w-full flex flex-col gap-6 my-8">
        
        {/* Actions Top */}
        <div className="flex justify-between items-center px-4">
             <div className="flex items-center gap-2 text-white/60">
                <Bot className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-widest italic">Review Sertifikat</span>
             </div>
             <button onClick={() => setIsFinalized(false)} className="text-yellow-400 text-xs font-black uppercase hover:underline">Ubah Nama</button>
        </div>

        {/* Certificate Preview (The part that will be captured) */}
        <div 
          ref={certificateRef}
          className="relative aspect-[1.414/1] w-full bg-slate-900 border-[12px] border-double border-yellow-500/50 p-1 md:p-2 shadow-2xl overflow-hidden"
        >
          {/* Inner Border */}
          <div className="h-full w-full border-4 border-yellow-500/30 p-8 md:p-14 flex flex-col items-center justify-between relative">
            
            {/* Corner Ornaments */}
            <div className="absolute top-0 left-0 w-24 h-24 border-t-8 border-l-8 border-yellow-500/80 rounded-tl-xl" />
            <div className="absolute top-0 right-0 w-24 h-24 border-t-8 border-r-8 border-yellow-500/80 rounded-tr-xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 border-b-8 border-l-8 border-yellow-500/80 rounded-bl-xl" />
            <div className="absolute bottom-0 right-0 w-24 h-24 border-b-8 border-r-8 border-yellow-500/80 rounded-br-xl" />

            {/* Background Symbols */}
            <div className="absolute inset-0 opacity-5 pointer-events-none flex flex-wrap justify-around items-center p-20 select-none">
                {Array.from({length: 20}).map((_, i) => (
                    <span key={i} className="text-4xl font-serif">Σ [A] θ π √ ∫</span>
                ))}
            </div>

            {/* Header */}
            <div className="text-center relative z-10">
              <div className="flex justify-center mb-4">
                <Award className="w-16 h-16 text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
              </div>
              <h1 className="text-2xl md:text-5xl font-serif text-yellow-500 font-bold uppercase tracking-[0.2em] mb-2">SERTIFIKAT KELULUSAN</h1>
              <p className="text-white/60 font-medium tracking-[0.3em] uppercase text-xs md:text-sm italic">Diberikan sebagai pengakuan atas pencapaian akademis</p>
            </div>

            {/* Content */}
            <div className="text-center relative z-10 w-full">
              <p className="text-white/80 md:text-lg mb-4">Dengan ini menyatakan bahwa:</p>
              <h2 className="text-3xl md:text-6xl font-serif text-white font-black mb-6 underline decoration-yellow-500/30 underline-offset-8">
                {fullName.toUpperCase()}
              </h2>
              <p className="text-white/80 md:text-lg max-w-2xl mx-auto leading-relaxed">
                Telah berhasil menaklukkan seluruh tantangan dalam kurikulum <span className="text-yellow-400 font-bold italic">"Petualangan Matriks: Quest of the Matrix Master"</span> dengan tingkat kesulitan <span className="text-indigo-400 font-bold">{difficulty.toUpperCase()}</span>.
              </p>
            </div>

            {/* Footer */}
            <div className="w-full flex justify-between items-end relative z-10 mt-8">
              <div className="text-center">
                <div className="w-32 md:w-48 h-px bg-white/30 mb-2" />
                <p className="text-[10px] md:text-xs text-white/50 uppercase tracking-widest">{date}</p>
                <p className="text-[8px] md:text-[10px] text-white/30 uppercase">Tanggal Kelulusan</p>
              </div>

              <div className="flex flex-col items-center gap-1">
                 <div className="text-3xl font-black text-yellow-500/80 mb-2 italic flex items-center gap-2">
                    <Shield className="w-8 h-8" />
                    <span>{score} XP</span>
                 </div>
                 <div className="bg-yellow-500 text-slate-900 px-4 py-1 rounded-full text-[10px] font-black uppercase">
                    Master Approved
                 </div>
              </div>

              <div className="text-center">
                <div className="mb-2 italic font-serif text-white text-lg md:text-2xl flex items-center justify-center gap-2">
                    <Bot className="w-6 h-6 text-indigo-400" />
                    <span>Sensei Matriks</span>
                </div>
                <div className="w-32 md:w-48 h-px bg-white/30 mb-2" />
                <p className="text-[8px] md:text-[10px] text-white/30 uppercase font-black">Guru Besar Matriks Digital</p>
              </div>
            </div>
            
            {/* Verification ID */}
            <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[8px] font-mono text-white/20">
              VERIFIKASI ID: SM-{Math.random().toString(36).substring(2, 10).toUpperCase()}
            </p>
          </div>
        </div>

        {/* Actions Outside Capture Area */}
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <button 
                onClick={downloadCertificate}
                className="w-full md:w-auto px-10 py-5 bg-yellow-500 hover:bg-yellow-400 text-slate-950 rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-xl transition-all hover:scale-105 active:scale-95"
            >
                <Download className="w-6 h-6" /> Simpan Sertifikat (PNG)
            </button>
            <button 
                onClick={onClose}
                className="w-full md:w-auto px-8 py-5 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all border border-white/20"
            >
                Keluar
            </button>
        </div>
      </div>
    </div>
  );
};

export default Certificate;
