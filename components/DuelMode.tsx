import React, { useState, useEffect, useRef, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sword, Trophy, User, ArrowLeft, Gamepad2, Sparkles, CheckCircle2, XCircle, Clock, Award } from 'lucide-react';
import { MATRIX_ADVENTURE_DATA } from '../constants.ts';
import { Question, QuestionType, Difficulty } from '../types.ts';
import { shuffle } from 'lodash';
import MatrixDisplay from './MatrixDisplay.tsx';

interface DuelModeProps {
  onClose: () => void;
  onFinish?: (winner: 1 | 2) => void;
  onClaimCertificate?: () => void;
}

const QUESTION_TIME = 45;

// Memoized Question Component to prevent jitter on timer ticks
const QuestionArea = memo(({ 
  player, 
  question, 
  feedback, 
  onAnswer 
}: { 
  player: 1 | 2; 
  question: Question | null; 
  feedback: 'correct' | 'wrong' | null; 
  onAnswer: (p: 1 | 2, a: string) => void;
}) => (
  <>
    <div className="flex-1 flex flex-col items-center justify-center p-8">
        <AnimatePresence mode="wait">
          {question && (
            <motion.div 
              key={question.id}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="w-full max-w-lg"
            >
              <div className="bg-white/5 p-8 rounded-3xl border border-white/10 mb-8 min-h-[160px] flex flex-col items-center justify-center text-center gap-6">
                 <p className="text-xl md:text-2xl font-bold text-white leading-tight underline decoration-indigo-500/30 decoration-4 underline-offset-8">
                   {question.question}
                 </p>
                 
                 {/* Visual Matrix Support */}
                 {question.matrixData && (
                   <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                     <MatrixDisplay data={question.matrixData} />
                   </div>
                 )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {question.options?.map((opt: string) => (
                  <button 
                    key={opt}
                    onClick={() => onAnswer(player, opt)}
                    className="py-6 px-4 bg-white/10 hover:bg-white/20 border-2 border-white/10 hover:border-white/30 rounded-2xl text-white font-black text-lg transition-all active:scale-95 shadow-lg flex items-center justify-center text-center"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {feedback && (
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.5, opacity: 1 }}
            exit={{ scale: 2, opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            {feedback === 'correct' ? (
                <CheckCircle2 className="w-32 h-32 text-emerald-400 drop-shadow-[0_0_20px_rgba(52,211,153,0.5)]" />
            ) : (
                <XCircle className="w-32 h-32 text-red-400 drop-shadow-[0_0_20px_rgba(248,113,113,0.5)]" />
            )}
          </motion.div>
        )}
      </AnimatePresence>
  </>
));

const PlayerPane = memo(({ player, question, score, timer, winScore, feedback, onAnswer }: { 
  player: 1 | 2; 
  question: Question | null; 
  score: number; 
  timer: number;
  winScore: number;
  feedback: 'correct' | 'wrong' | null; 
  onAnswer: (p: 1 | 2, a: string) => void;
}) => (
  <div className={`flex-1 flex flex-col relative ${feedback === 'wrong' ? 'bg-red-500/20' : feedback === 'correct' ? 'bg-emerald-500/20' : 'bg-transparent'}`}>
    <div className={`p-8 border-b border-white/10 bg-black/20 flex flex-col gap-4`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
           <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl text-white shadow-xl ${player === 1 ? 'bg-indigo-500' : 'bg-purple-500'}`}>
              {player === 1 ? 'P1' : 'P2'}
           </div>
           <div className="h-4 w-48 bg-white/5 rounded-full overflow-hidden border border-white/10">
              <motion.div 
                animate={{ width: `${(score / winScore) * 100}%` }}
                className={`h-full ${player === 1 ? 'bg-indigo-400' : 'bg-purple-400'} shadow-[0_0_15px_rgba(255,255,255,0.4)]`}
              />
           </div>
        </div>
        <div className="text-4xl font-black text-white tabular-nums">{score} / {winScore}</div>
      </div>
      
      {/* Timer Bar */}
      <div className="flex items-center gap-3">
         <Clock className="w-4 h-4 text-white/50" />
         <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
           <motion.div 
             animate={{ 
               width: `${(timer / QUESTION_TIME) * 100}%`,
               backgroundColor: timer < 10 ? '#f87171' : '#fbbf24'
             }}
             className="h-full rounded-full"
           />
         </div>
         <span className={`text-[10px] font-black tabular-nums ${timer < 10 ? 'text-red-400' : 'text-white/50'}`}>{timer}S</span>
      </div>
    </div>

    <QuestionArea 
      player={player}
      question={question}
      feedback={feedback}
      onAnswer={onAnswer}
    />
  </div>
));

// Winner Particles Component
const WinnerParticles = ({ winner }: { winner: 1 | 2 }) => {
  const particles = Array.from({ length: 20 });
  const color = winner === 1 ? 'bg-indigo-400' : 'bg-purple-400';
  
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            opacity: 0, 
            scale: 0,
            x: '50%',
            y: '50%'
          }}
          animate={{ 
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
            x: `${Math.random() * 100}%`,
            y: `${Math.random() * 100}%`,
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 2 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 2
          }}
          className={`absolute w-3 h-3 rounded-full ${color} shadow-[0_0_15px_rgba(255,255,255,0.5)]`}
        />
      ))}
      {/* Floating Icons */}
      {['🏆', '⭐', '✨', '🔥'].map((icon, i) => (
        <motion.div
          key={`icon-${i}`}
          initial={{ opacity: 0, y: 100 }}
          animate={{ 
            opacity: [0, 1, 0],
            y: [-100, -800],
            x: [-50, 50, -50]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            delay: i * 1.5,
            ease: "easeOut"
          }}
          className="absolute bottom-0 left-[20%] right-[20%] flex justify-center text-4xl"
          style={{ left: `${20 + (i * 20)}%` }}
        >
          {icon}
        </motion.div>
      ))}
    </div>
  );
};

const DuelMode: React.FC<DuelModeProps> = ({ onClose, onFinish, onClaimCertificate }) => {
  const [gameState, setGameState] = useState<'lobby' | 'playing' | 'result'>('lobby');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(Difficulty.EASY);
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [currentQuestion1, setCurrentQuestion1] = useState<Question | null>(null);
  const [currentQuestion2, setCurrentQuestion2] = useState<Question | null>(null);
  const [timer1, setTimer1] = useState(QUESTION_TIME);
  const [timer2, setTimer2] = useState(QUESTION_TIME);
  const [winner, setWinner] = useState<1 | 2 | null>(null);
  const [feedback1, setFeedback1] = useState<'correct' | 'wrong' | null>(null);
  const [feedback2, setFeedback2] = useState<'correct' | 'wrong' | null>(null);

  const WIN_SCORE = 15;

  // Timers Effect
  useEffect(() => {
    if (gameState !== 'playing') return;

    const interval = setInterval(() => {
      setTimer1(t => {
        if (t <= 1) {
          handleAnswer(1, 'TIMEOUT');
          return QUESTION_TIME;
        }
        return t - 1;
      });
      setTimer2(t => {
        if (t <= 1) {
          handleAnswer(2, 'TIMEOUT');
          return QUESTION_TIME;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState, currentQuestion1, currentQuestion2]);

  const getRandomQuestion = (diff: Difficulty) => {
    const allQuizzes = MATRIX_ADVENTURE_DATA.flatMap(stage => stage.quizzes)
      .filter(q => q.type === QuestionType.MULTIPLE_CHOICE)
      .filter(q => !q.difficulty || q.difficulty === diff);
    
    const source = allQuizzes.length > 0 
      ? allQuizzes 
      : MATRIX_ADVENTURE_DATA.flatMap(stage => stage.quizzes).filter(q => q.type === QuestionType.MULTIPLE_CHOICE);

    const q = source[Math.floor(Math.random() * source.length)];
    return {
      ...q,
      options: q.options ? shuffle([...q.options]) : []
    };
  };

  const startDuel = () => {
    setPlayer1Score(0);
    setPlayer2Score(0);
    setCurrentQuestion1(getRandomQuestion(selectedDifficulty));
    setCurrentQuestion2(getRandomQuestion(selectedDifficulty));
    setTimer1(QUESTION_TIME);
    setTimer2(QUESTION_TIME);
    setGameState('playing');
    setWinner(null);
  };

  const handleAnswer = useCallback((player: 1 | 2, answer: string) => {
    if (gameState !== 'playing') return;

    if (player === 1) {
      if (answer === currentQuestion1?.correctAnswer) {
        setFeedback1('correct');
        const newScore = player1Score + 1;
        setPlayer1Score(newScore);
        if (newScore >= WIN_SCORE) {
          setWinner(1);
          setGameState('result');
          if (onFinish) onFinish(1);
        } else {
          setTimeout(() => {
            setCurrentQuestion1(getRandomQuestion(selectedDifficulty));
            setTimer1(QUESTION_TIME);
            setFeedback1(null);
          }, 300);
        }
      } else {
        setFeedback1('wrong');
        setTimeout(() => {
          setCurrentQuestion1(getRandomQuestion(selectedDifficulty));
          setTimer1(QUESTION_TIME);
          setFeedback1(null);
        }, 300);
      }
    } else {
      if (answer === currentQuestion2?.correctAnswer) {
        setFeedback2('correct');
        const newScore = player2Score + 1;
        setPlayer2Score(newScore);
        if (newScore >= WIN_SCORE) {
          setWinner(2);
          setGameState('result');
          if (onFinish) onFinish(2);
        } else {
          setTimeout(() => {
            setCurrentQuestion2(getRandomQuestion(selectedDifficulty));
            setTimer2(QUESTION_TIME);
            setFeedback2(null);
          }, 300);
        }
      } else {
        setFeedback2('wrong');
        setTimeout(() => {
          setCurrentQuestion2(getRandomQuestion(selectedDifficulty));
          setTimer2(QUESTION_TIME);
          setFeedback2(null);
        }, 300);
      }
    }
  }, [gameState, player1Score, player2Score, currentQuestion1, currentQuestion2, selectedDifficulty, onFinish]);

  if (gameState === 'lobby') {
    return (
      <div className="fixed inset-0 z-50 bg-indigo-950 flex flex-col items-center justify-center p-8 overflow-hidden">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-8 mb-12">
            <motion.div 
               animate={{ rotate: [0, -10, 10, 0] }}
               transition={{ repeat: Infinity, duration: 2 }}
               className="w-32 h-32 bg-indigo-500 rounded-3xl flex items-center justify-center shadow-2xl relative"
            >
               <User className="w-16 h-16 text-white" />
               <div className="absolute -top-4 -left-4 bg-red-400 text-white font-black px-4 py-2 rounded-xl text-sm italic">P1</div>
            </motion.div>
            <Sword className="w-16 h-16 text-white opacity-20" />
            <motion.div 
               animate={{ rotate: [0, 10, -10, 0] }}
               transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
               className="w-32 h-32 bg-purple-500 rounded-3xl flex items-center justify-center shadow-2xl relative"
            >
               <User className="w-16 h-16 text-white" />
               <div className="absolute -top-4 -right-4 bg-blue-400 text-white font-black px-4 py-2 rounded-xl text-sm italic">P2</div>
            </motion.div>
          </div>
          <h1 className="text-6xl font-black text-white italic mb-6 tracking-tight">DUEL MATRIKS!</h1>
          <p className="text-indigo-200 text-xl mb-8 max-w-md mx-auto opacity-80 uppercase font-black tracking-widest">Siapa tercepat menjawab 15 soal benar?</p>
          
          <div className="flex flex-col gap-6 items-center">
            <div className="flex bg-white/5 p-2 rounded-2xl border border-white/10 gap-2">
              {[Difficulty.EASY, Difficulty.MEDIUM, Difficulty.HARD].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-6 py-2 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${selectedDifficulty === diff ? 'bg-white text-indigo-900 shadow-lg scale-105' : 'text-white/40 hover:text-white'}`}
                >
                  {diff}
                </button>
              ))}
            </div>

            <button 
              onClick={startDuel}
              className="px-16 py-6 bg-white text-indigo-900 rounded-[2rem] font-black text-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center gap-4 justify-center"
            >
              <Gamepad2 className="w-8 h-8" /> MULAI PERTEMPURAN!
            </button>
            <button 
              onClick={onClose}
              className="px-8 py-4 bg-white/10 text-white/50 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/20 transition-all"
            >
              Kembali
            </button>
          </div>
        </motion.div>

        <div className="absolute inset-0 pointer-events-none opacity-20">
            {Array(10).fill(0).map((_, i) => (
                <motion.div 
                  key={i}
                  animate={{ 
                    y: [-100, 1000],
                    x: Math.random() * 1000,
                    opacity: [0, 1, 0]
                  }}
                  transition={{ repeat: Infinity, duration: 5 + Math.random() * 5 }}
                  className="w-1 h-20 bg-white absolute"
                />
            ))}
        </div>
      </div>
    );
  }

  if (gameState === 'result') {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center p-8">
        <WinnerParticles winner={winner || 1} />
        
        <motion.div 
           initial={{ scale: 0, rotate: -20 }}
           animate={{ scale: 1, rotate: 0 }}
           transition={{ type: "spring", damping: 10 }}
           className="relative z-10 bg-white/10 backdrop-blur-3xl p-10 md:p-16 rounded-[3rem] md:rounded-[4.5rem] border-4 border-white/20 text-center max-w-2xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50 pointer-events-none" />
          
          <motion.div 
             animate={{ 
               y: [0, -10, 0],
               boxShadow: winner === 1 ? ['0 0 20px rgba(99,102,241,0.5)', '0 0 50px rgba(99,102,241,0.8)', '0 0 20px rgba(99,102,241,0.5)'] : ['0 0 20px rgba(168,85,247,0.5)', '0 0 50px rgba(168,85,247,0.8)', '0 0 20px rgba(168,85,247,0.5)']
             }}
             transition={{ repeat: Infinity, duration: 2 }}
             className={`w-24 h-24 md:w-36 md:h-36 ${winner === 1 ? 'bg-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.6)]' : 'bg-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.6)]'} rounded-[3rem] flex items-center justify-center mx-auto mb-8 shadow-2xl relative z-10 border-4 border-white/30`}
          >
             <Trophy className="w-12 h-12 md:w-20 md:h-20 text-white" />
          </motion.div>
          
          <div className="relative z-10">
            <h2 className="text-2xl md:text-4xl text-indigo-200 font-black uppercase tracking-[0.4em] mb-2 italic">Victory</h2>
            <h3 className="text-5xl md:text-8xl font-black text-white italic mb-12 drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]">PLAYER {winner}</h3>
            
            <div className="flex flex-col md:flex-row gap-4 mb-4">
               <button 
                 onClick={onClose}
                 className="flex-1 py-5 md:py-6 bg-white/10 text-white rounded-3xl font-black text-lg md:text-xl hover:bg-white/20 border border-white/20 transition-all hover:scale-105"
               >
                 Tinggalkan Arena
               </button>
               <button 
                 onClick={startDuel}
                 className="flex-1 py-5 md:py-6 bg-white text-indigo-900 rounded-3xl font-black text-lg md:text-xl hover:scale-110 active:scale-95 transition-all shadow-2xl"
               >
                 Balas Dendam!
               </button>
            </div>

            {winner && (
              <button 
                onClick={() => {
                  if (onClaimCertificate) onClaimCertificate();
                }}
                className="w-full py-5 bg-yellow-400 text-slate-900 rounded-[2rem] font-black text-xl md:text-2xl hover:scale-105 active:scale-95 transition-all shadow-[0_20px_40px_-10px_rgba(250,204,21,0.3)] flex items-center justify-center gap-3"
              >
                <Award className="w-8 h-8" /> KLAIM SERTIFIKAT JUARA
              </button>
            )}
          </div>

          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 15, -15, 0]
            }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute -top-10 -right-10 opacity-30"
          >
             <Sparkles className="w-32 h-32 text-yellow-400" />
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col md:flex-row overflow-hidden">
      <button 
        onClick={onClose}
        className="absolute top-4 left-1/2 -translate-x-1/2 z-[60] p-3 bg-white/20 hover:bg-white/30 backdrop-blur-xl rounded-full text-white border border-white/20 shadow-xl transition-all hover:scale-110 active:scale-90"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      <PlayerPane 
        player={1} 
        question={currentQuestion1} 
        score={player1Score} 
        timer={timer1}
        winScore={WIN_SCORE}
        feedback={feedback1} 
        onAnswer={handleAnswer} 
      />
      
      <div className="hidden md:block w-1 bg-white/5 relative z-10">
         <div className="absolute top-0 bottom-0 left-0 right-0 bg-gradient-to-b from-indigo-500/50 via-transparent to-purple-500/50" />
      </div>

      <PlayerPane 
        player={2} 
        question={currentQuestion2} 
        score={player2Score} 
        timer={timer2}
        winScore={WIN_SCORE}
        feedback={feedback2} 
        onAnswer={handleAnswer} 
      />
    </div>
  );
};

export default DuelMode;
