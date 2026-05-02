import React from 'react';
import { Book, ExternalLink, X, Bookmark } from 'lucide-react';
import { motion } from 'motion/react';

interface ReferencesProps {
  onClose: () => void;
}

export const References: React.FC<ReferencesProps> = ({ onClose }) => {
  const referenceData = [
    {
      stage: "Stage 1 & 2",
      materi: "Konsep Dasar, Penjumlahan & Perkalian Matriks",
      sources: [
        "Kemendikbudristek (2022). Matematika untuk SMA/SMK Kelas XI. Jakarta.",
        "Sartono Wirodikromo (2007). Matematika untuk SMA Kelas XI. Erlangga."
      ]
    },
    {
      stage: "Stage 3 & 4",
      materi: "Transpose & Matriks Khusus",
      sources: [
        "Howard Anton & Chris Rorres (2014). Elementary Linear Algebra. Wiley.",
        "Kanginan, Marthen (2016). Matematika untuk Kelas XI. Yrama Widya."
      ]
    },
    {
      stage: "Stage 5",
      materi: "Determinan Matriks & Metode Cramer",
      sources: [
        "Gilbert Strang (2016). Introduction to Linear Algebra, 5th Edition. Wellesley-Cambridge Press.",
        "Sukino (2017). Matematika untuk SMA/MA Kelas XI. Erlangga."
      ]
    },
    {
      stage: "Stage 6",
      materi: "Invers Matriks & Aplikasi Kriptografi",
      sources: [
        "Seymour Lipschutz (2000). Schaum's Outline of Linear Algebra. McGraw-Hill.",
        "Buku Saku Matematika SMA (2020). Ringkasan Materi Matriks Advanced."
      ]
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="relative w-full max-w-2xl bg-[#0f172a] border border-white/20 rounded-[2.5rem] overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="p-8 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-indigo-500/10 to-transparent">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-500 rounded-2xl shadow-lg shadow-indigo-500/20">
              <Book className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">Referensi Materi</h2>
              <p className="text-indigo-300/60 text-sm font-medium">Sumber belajar Kurikulum Matriks</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors group"
          >
            <X className="w-6 h-6 text-white/50 group-hover:text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
          <div className="space-y-8">
            {referenceData.map((ref, idx) => (
              <div key={idx} className="relative pl-6 border-l-2 border-indigo-500/30">
                <div className="absolute -left-[9px] top-0 w-4 h-4 bg-indigo-500 rounded-full border-4 border-[#0f172a]" />
                <div className="mb-2">
                  <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-2 py-0.5 rounded">
                    {ref.stage}
                  </span>
                  <h3 className="text-white font-bold mt-1">{ref.materi}</h3>
                </div>
                <div className="space-y-3">
                  {ref.sources.map((source, sIdx) => (
                    <div key={sIdx} className="flex gap-3 text-white/60 text-sm leading-relaxed">
                      <Bookmark className="w-4 h-4 shrink-0 text-indigo-500/40 mt-1" />
                      <p>{source}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-white/5 border-t border-white/10 text-center">
          <p className="text-white/30 text-[10px] font-medium uppercase tracking-[0.2em] flex items-center justify-center gap-2">
            <ExternalLink className="w-3 h-3" /> Materi diadaptasi untuk pengalaman interaktif
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};
