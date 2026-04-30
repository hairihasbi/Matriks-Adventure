import React from 'react';
import { motion } from 'motion/react';
import { X, BookOpen, Target, CheckCircle2, Award, Lightbulb } from 'lucide-react';

interface LearningObjectivesProps {
  onClose: () => void;
}

const LearningObjectives: React.FC<LearningObjectivesProps> = ({ onClose }) => {
  const objectives = [
    "Mendeskripsikan jenis-jenis matriks",
    "Menganalisis nilai determinan dan sifat operasi matriks",
    "Menerapkan dan menentukan invers matriks dalam memecahkan masalah",
    "Menyajikan model matematika dalam bentuk persamaan matriks dari suatu masalah nyata",
    "Menyelesaikan permasalahan dalam kehidupan sehari-hari yang terkait dengan matriks"
  ];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white rounded-[3rem] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-2xl relative"
      >
        <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-3 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-colors z-20"
        >
            <X className="w-6 h-6 text-slate-600" />
        </button>

        {/* Left Side: Summary */}
        <div className="md:w-1/3 bg-indigo-50 p-8 md:p-12 flex flex-col gap-8">
            <div>
                <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 10, delay: 0.1 }}
                    className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center mb-6 shadow-lg rotate-3"
                >
                    <BookOpen className="w-8 h-8 text-white" />
                </motion.div>
                <h2 className="text-xl md:text-2xl font-black text-indigo-900 leading-tight mb-2 uppercase tracking-tighter">Tujuan <br/><span className="text-purple-600">Pembelajaran</span></h2>
            </div>

            <div className="space-y-4">
                <div className="bg-white p-5 rounded-3xl shadow-sm border border-indigo-100">
                    <div className="flex items-center gap-3 mb-2 text-indigo-600">
                        <Award className="w-5 h-5" />
                        <span className="text-[10px] font-black uppercase tracking-widest italic">Capaian Pembelajaran</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed font-bold">
                        Peserta didik mampu mendeskripsikan jenis-jenis matriks, menganalisis sifat operasi matriks, serta menerapkannya dalam pemecahan masalah kontekstual.
                    </p>
                </div>

                <div className="bg-white/60 p-5 rounded-3xl shadow-sm border border-indigo-50">
                    <div className="flex items-center gap-3 mb-2 text-purple-600">
                        <Target className="w-5 h-5" />
                        <span className="text-[10px] font-black uppercase tracking-widest italic">Kurikulum Merdeka</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                        Materi ini sesuai dengan Capaian Pembelajaran (CP) Matematika untuk jenjang SMA, dengan fokus pada pengembangan kemampuan berpikir kritis dan pemecahan masalah.
                    </p>
                </div>

                <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-500 text-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                        <Lightbulb className="w-4 h-4" />
                    </div>
                    <p className="text-[10px] text-emerald-800 font-black leading-tight">
                        CP: Menerapkan konsep matriks dalam konteks nyata
                    </p>
                </div>
            </div>
        </div>

        {/* Right Side: List */}
        <div className="md:w-2/3 p-8 md:p-12 overflow-y-auto bg-white">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-2 h-10 bg-indigo-500 rounded-full" />
                <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Matriks Mastery Quest</h3>
            </div>

            <div className="grid gap-3">
                {objectives.map((obj, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + i * 0.1 }}
                        className="group flex items-center gap-5 p-5 rounded-3xl hover:bg-slate-50 transition-all duration-300 border border-slate-50 hover:border-slate-200"
                    >
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-white shadow-lg flex-shrink-0 ${
                            i === 0 ? 'bg-indigo-500' : 
                            i === 1 ? 'bg-rose-500' : 
                            i === 2 ? 'bg-emerald-500' : 
                            i === 3 ? 'bg-purple-500' : 'bg-orange-500'
                        }`}>
                            {i + 1}
                        </div>
                        <p className="text-slate-700 font-black text-sm md:text-base leading-relaxed">
                            {obj}
                        </p>
                    </motion.div>
                ))}
            </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LearningObjectives;
