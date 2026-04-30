import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Timer, Trophy, ArrowRight, X } from 'lucide-react';
import QuizContainer from './QuizContainer';
import { MATRIX_ADVENTURE_DATA } from '../constants';
import { Question } from '../types';
import { shuffle } from 'lodash';

interface ChallengeModeProps {
  onClose: () => void;
  onFinish: (score: number) => void;
}

const ChallengeMode: React.FC<ChallengeModeProps> = ({ onClose, onFinish }) => {
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [currentQuiz, setCurrentQuiz] = useState<Question | null>(null);
  const [isActive, setIsActive] = useState(false);

  // Generate random quiz from all stages
  const getNewQuiz = () => {
    const allQuizzes = MATRIX_ADVENTURE_DATA.flatMap(s => s.quizzes);
    const random = allQuizzes[Math.floor(Math.random() * allQuizzes.length)];
    return {
      ...random,
      options: random.options ? shuffle([...random.options]) : undefined
    };
  };

  useEffect(() => {
    setCurrentQuiz(getNewQuiz());
  }, []);

  useEffect(() => {
    let timer: any;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) {
      onFinish(score);
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft]);

  const handleNext = (isCorrect: boolean) => {
    if (isCorrect) setScore(prev => prev + 25);
    setCurrentQuiz(getNewQuiz());
  };

  if (!isActive) {
    return (
      <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-6 backdrop-blur-xl">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-br from-indigo-900 to-purple-900 p-12 rounded-[3.5rem] border border-white/20 text-center max-w-xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]"
        >
          <div className="w-24 h-24 bg-red-500 rounded-3xl flex items-center justify-center mx-auto mb-8 rotate-12 shadow-2xl shadow-red-500/20">
            <Timer className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-5xl font-black text-white mb-4 italic">60 DETIK TURBO!</h2>
          <p className="text-indigo-200 mb-10 text-lg">Jawab soal matriks sebanyak mungkin. Setiap jawaban benar bernilai +25 XP!</p>
          <div className="flex gap-4">
            <button 
              onClick={onClose}
              className="flex-1 py-5 bg-white/10 text-white rounded-2xl font-black text-xl hover:bg-white/20 transition-all border border-white/10"
            >
              Nanti Saja
            </button>
            <button 
              onClick={() => setIsActive(true)}
              className="flex-1 py-5 bg-white text-indigo-900 rounded-2xl font-black text-xl hover:scale-105 transition-all shadow-xl"
            >
              MULAI SEKARANG!
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-indigo-950 flex flex-col p-4 md:p-8">
      <div className="flex items-center justify-between mb-8 max-w-4xl mx-auto w-full">
        <div className="flex items-center gap-4 bg-white/10 px-6 py-3 rounded-2xl border border-white/20">
           <Timer className={`w-8 h-8 ${timeLeft < 10 ? 'text-red-500 animate-bounce' : 'text-yellow-400'}`} />
           <span className="text-3xl font-black text-white tabular-nums">{timeLeft}s</span>
        </div>
        <div className="flex items-center gap-4 bg-indigo-500 px-6 py-3 rounded-2xl shadow-xl">
           <Trophy className="w-8 h-8 text-white" />
           <span className="text-3xl font-black text-white tabular-nums">{score} XP</span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center overflow-y-auto w-full">
        <div className="w-full max-w-4xl">
          <QuizContainer 
            question={currentQuiz}
            onNext={handleNext}
          />
        </div>
      </div>
    </div>
  );
};

export default ChallengeMode;
