import React from 'react';
import { motion } from 'motion/react';
import { X, Mail, GraduationCap, Award, BookOpen, ExternalLink, Github, Instagram } from 'lucide-react';

interface TeacherProfileProps {
  onClose: () => void;
}

export const TeacherProfile: React.FC<TeacherProfileProps> = ({ onClose }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-slate-100 hover:bg-rose-100 text-slate-400 hover:text-rose-600 rounded-full transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex flex-col md:flex-row">
          {/* Sidebar / Photo Section */}
          <div className="md:w-1/3 bg-indigo-600 p-8 flex flex-col items-center text-center text-white">
            <div className="w-28 h-28 bg-white rounded-3xl mb-4 overflow-hidden border-4 border-indigo-400 shadow-xl rotate-3">
              <img 
                src="/teacher_profile.jpg" 
                alt="Hairi Hasbi"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hairi';
                }}
              />
            </div>
            <h3 className="text-lg font-black mb-1">Hairi Hasbi</h3>
            <p className="text-indigo-200 text-[10px] font-bold uppercase tracking-widest mb-6">SMAN 5 Banjarbaru</p>
            
            <div className="space-y-3 w-full">
               <a href="mailto:hasbyhairi@gmail.com" className="flex items-center gap-3 p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all text-[11px] group">
                  <Mail className="w-4 h-4 text-indigo-300 group-hover:text-white" />
                  <span className="truncate">hasbyhairi@gmail.com</span>
               </a>
               <div className="flex justify-center gap-3 mt-4">
                  <a href="https://instagram.com/hairihasbi" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-all cursor-pointer">
                    <Instagram className="w-5 h-5" />
                  </a>
                  <div className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-all cursor-pointer">
                    <Github className="w-5 h-5" />
                  </div>
               </div>
            </div>
          </div>

          {/* Main Content Section */}
          <div className="md:w-2/2 p-8 md:p-10 max-h-[70vh] overflow-y-auto">
            <div className="mb-8">
              <div className="flex items-center gap-2 text-indigo-600 mb-2">
                <GraduationCap className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Bio Singkat</span>
              </div>
              <p className="text-slate-600 text-[13px] leading-relaxed">
                Halo! Saya adalah seorang pendidik dan pengembang media pembelajaran yang berdedikasi untuk menciptakan pengalaman belajar yang menyenangkan dan interaktif. **Matriks Adventure** ini dibuat untuk membantu siswa memahami konsep matriks melalui pendekatan gamifikasi.
              </p>
            </div>

            <div className="grid gap-6">
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <div className="flex items-center gap-3 mb-4 text-purple-600">
                  <Award className="w-5 h-5" />
                  <h4 className="font-black uppercase text-xs tracking-widest">Keahlian</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['Matematika SMA', 'Kurikulum Merdeka', 'Gamifikasi', 'React Development', 'UI/UX Design'].map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-white text-slate-600 text-[9px] font-bold rounded-lg border border-slate-200 shadow-sm lowercase">
                      #{skill.replace(/\s+/g, '')}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
                <div className="flex items-center gap-3 mb-3 text-emerald-600">
                  <BookOpen className="w-5 h-5" />
                  <h4 className="font-black uppercase text-xs tracking-widest">Misi Media</h4>
                </div>
                <p className="text-[11px] text-emerald-800 font-medium leading-relaxed">
                  Menghilangkan stigma bahwa "Matematika itu Membosankan" dengan menghadirkan visualisasi yang menarik, tantangan yang menantang, dan umpan balik realtime bagi pembelajar.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-100 flex justify-between items-center text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              <span>Versi 1.0.0</span>
              <div className="flex items-center gap-2 hover:text-indigo-600 cursor-pointer transition-colors">
                Portofolio Lainnya <ExternalLink className="w-3 h-3" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
