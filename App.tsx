import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Map, 
  BookOpen, 
  ChevronRight, 
  Sparkles, 
  Gamepad2, 
  RotateCcw,
  Star,
  Lightbulb,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  Award,
  User,
  Volume2,
  VolumeX,
  Home,
  FlaskConical,
  Zap,
  Crown,
  Plus,
  Minus,
  X,
  RefreshCw,
  Layers,
  Timer,
  Sword,
  Database
} from 'lucide-react';
import { Stage, QuestionType, Difficulty, GameState } from './types.ts';
import { ACHIEVEMENTS, STORY_DATA, REWARDS, MATRIX_ADVENTURE_DATA } from './constants.ts';
import MatrixDisplay from './components/MatrixDisplay.tsx';
import QuizContainer from './components/QuizContainer.tsx';
import GuideCharacter from './components/GuideCharacter.tsx';
import MapView from './components/MapView.tsx';
import MatrixLab from './components/MatrixLab.tsx';
import ChallengeMode from './components/ChallengeMode.tsx';
import DuelMode from './components/DuelMode.tsx';
import SenseiMatriks from './components/SenseiMatriks.tsx';
import Certificate from './components/Certificate.tsx';
import LearningObjectives from './components/LearningObjectives.tsx';
import { TeacherProfile } from './components/TeacherProfile.tsx';
import { checkFirebaseConnection, checkStorageConnection } from './src/lib/firebase.ts';
import confetti from 'canvas-confetti';

interface CertificateProps {
  score: number;
  difficulty: string;
  date: string;
  onClose: () => void;
}

// Premium Confetti Helpers
const celebrateLevelUp = () => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
};

const celebrateBigWin = () => {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 }
  };

  function fire(particleRatio: number, opts: any) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio)
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });
  fire(0.2, {
    spread: 60,
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
};

// Level Up Particles Component
const LevelUpParticles = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {[...Array(15)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, scale: 0, x: '50%', y: '100%' }}
        animate={{ 
          opacity: [0, 1, 0],
          scale: [0, 1.2, 0],
          x: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
          y: ['100%', '-20%'],
          rotate: [0, 360]
        }}
        transition={{ 
          duration: 3 + Math.random() * 4,
          repeat: Infinity,
          delay: Math.random() * 5,
          ease: "easeOut"
        }}
        className="absolute w-2 h-2 text-white/40 font-mono font-black"
      >
        {['0', '1', 'Σ', 'A', 'x'][i % 5]}
      </motion.div>
    ))}
  </div>
);

export default function App() {
  const [gameState, setGameState] = useState<GameState>({
    currentStageIndex: 0,
    currentSubTopicIndex: 0,
    isQuizActive: false,
    score: 0,
    streak: 0,
    unlockedRewards: [],
    completedStages: [],
    difficulty: Difficulty.EASY,
    achievements: [],
    labExperiments: 0
  });

  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [stageFinished, setStageFinished] = useState(false);
  const [showChallenge, setShowChallenge] = useState(false);
  const [showDuel, setShowDuel] = useState(false);
  const [currentDialogue, setCurrentDialogue] = useState(STORY_DATA.dialogues.welcome);
  const [showGuide, setShowGuide] = useState(false);
  const [viewMode, setViewMode] = useState<'map' | 'content' | 'quiz' | 'lab'>('map');
  const [completedSubTopics, setCompletedSubTopics] = useState<string[]>([]);
  const [shuffledQuizzes, setShuffledQuizzes] = useState<any[]>([]);
  const [isMuted, setIsMuted] = useState(true);
  const [showCertificate, setShowCertificate] = useState(false);
  const [showObjectives, setShowObjectives] = useState(false);
  const [showTeacherProfile, setShowTeacherProfile] = useState(false);
  const [dbConnected, setDbConnected] = useState<boolean | null>(null);
  const [storageConnected, setStorageConnected] = useState<boolean | null>(null);

  // Check Firebase connection
  useEffect(() => {
    checkFirebaseConnection().then(res => {
      setDbConnected(res.connected);
    });
    checkStorageConnection().then(res => {
      setStorageConnected(res.connected);
    });
  }, []);

  // Audio setup
  useEffect(() => {
    const bgMusic = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3');
    bgMusic.loop = true;
    bgMusic.volume = 0.3;

    if (!isMuted && gameStarted) {
      bgMusic.play().catch(e => console.log("Audio play blocked", e));
    } else {
      bgMusic.pause();
    }

    return () => {
      bgMusic.pause();
      bgMusic.src = "";
    };
  }, [isMuted, gameStarted]);

  const playSfx = (url: string) => {
    if (isMuted) return;
    const sfx = new Audio(url);
    sfx.volume = 0.5;
    sfx.play().catch(e => console.log("SFX blocked", e));
  };

  const currentStage = MATRIX_ADVENTURE_DATA[gameState.currentStageIndex];
  
  // Shuffle helper
  const shuffle = (array: any[]) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  useEffect(() => {
    if (currentStage && currentStage.quizzes) {
      const filteredQuizzes = currentStage.quizzes.filter(q => q.difficulty === gameState.difficulty);
      const shuffled = shuffle(filteredQuizzes.length > 0 ? filteredQuizzes : currentStage.quizzes).map(q => ({
        ...q,
        options: q.options ? shuffle(q.options) : q.options
      }));
      setShuffledQuizzes(shuffled);
    }
  }, [gameState.currentStageIndex, gameState.difficulty]);

  const currentSubTopic = currentStage.subTopics[gameState.currentSubTopicIndex];
  const currentQuiz = shuffledQuizzes[currentQuizIndex];

  const progress = useMemo(() => {
    const total = currentStage.subTopics.length + 1; // +1 for quiz
    const completed = completedSubTopics.length + (gameFinished ? 1 : 0);
    return (completed / total) * 100;
  }, [completedSubTopics.length, gameFinished, currentStage.subTopics.length]);

  const handleNextSubTopic = () => {
    if (!completedSubTopics.includes(currentSubTopic.id)) {
      setCompletedSubTopics(prev => [...prev, currentSubTopic.id]);
    }
    setViewMode('map');
  };

  const handleEnterLesson = (index: number) => {
    setGameState(prev => ({
      ...prev,
      currentSubTopicIndex: index,
      isQuizActive: false
    }));
    setViewMode('content');
  };

  const handleExperimentCount = () => {
    setGameState(prev => {
      const newCount = (prev.labExperiments || 0) + 1;
      const currentAchievements = prev.achievements || [];
      if (newCount === 10 && !currentAchievements.includes('scientist')) {
        confetti({ particleCount: 100, colors: ['#4F46E5', '#818CF8'] });
        setCurrentDialogue(STORY_DATA.dialogues.labIntro); // Re-use lab intro for achievement to trigger guide
        return { ...prev, labExperiments: newCount, achievements: [...currentAchievements, 'scientist'] };
      }
      return { ...prev, labExperiments: newCount };
    });
  };

  const handleEnterQuiz = () => {
    setGameState(prev => ({
      ...prev,
      isQuizActive: true
    }));
    setViewMode('quiz');
  };

    const handleNextQuiz = (isCorrect: boolean) => {
    let bonusXP = 0;
    if (isCorrect) {
      playSfx('https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3');
      
      const newStreakCount = gameState.streak + 1;
      const currentAchievements = gameState.achievements || [];
      
      // Check for Flash achievement (simplified: 5 streak)
      if (newStreakCount === 5 && !currentAchievements.includes('flash')) {
        setGameState(prev => ({ ...prev, achievements: [...(prev.achievements || []), 'flash'] }));
        celebrateBigWin();
      }

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      bonusXP = 10 + (newStreakCount >= 3 ? 5 : 0);
      
      setGameState(prev => {
        const newScore = prev.score + bonusXP;
        const availableRewards = REWARDS.filter(r => r.xp <= newScore && !prev.unlockedRewards.includes(r.id));
        const newUnlocked = availableRewards.map(r => r.id);
        
        if (newUnlocked.length > 0) {
           setCurrentDialogue(STORY_DATA.dialogues.stageComplete);
           setShowGuide(true);
           setTimeout(() => setShowGuide(false), 4000);
        } else if (newStreakCount >= 3) {
           setCurrentDialogue(STORY_DATA.dialogues.streakHigh);
           setShowGuide(true);
           setTimeout(() => setShowGuide(false), 4000);
        } else {
           setCurrentDialogue(STORY_DATA.dialogues.quizCorrect);
           setShowGuide(true);
           setTimeout(() => setShowGuide(false), 3000);
        }

        return {
          ...prev,
          score: newScore,
          streak: newStreakCount,
          unlockedRewards: [...prev.unlockedRewards, ...newUnlocked]
        };
      });
    } else {
      playSfx('https://assets.mixkit.co/active_storage/sfx/2003/2003-preview.mp3');
      setGameState(prev => ({ 
        ...prev, 
        streak: 0,
        score: Math.max(0, prev.score - 5) 
      }));
      setCurrentDialogue(STORY_DATA.dialogues.quizWrong);
      setShowGuide(true);
      setTimeout(() => setShowGuide(false), 3000);
    }

    if (currentQuizIndex < shuffledQuizzes.length - 1) {
      setCurrentQuizIndex(prev => prev + 1);
    } else {
      setStageFinished(true);
      if (gameState.currentStageIndex === MATRIX_ADVENTURE_DATA.length - 1) {
        setGameFinished(true);
      }
      setGameState(prev => ({
        ...prev,
        isQuizActive: false,
        completedStages: [...prev.completedStages, currentStage.id]
      }));
    }
  };

  const handleNextStage = () => {
    if (gameState.currentStageIndex < MATRIX_ADVENTURE_DATA.length - 1) {
      celebrateLevelUp();
      setGameState(prev => ({
        ...prev,
        currentStageIndex: prev.currentStageIndex + 1,
        currentSubTopicIndex: 0,
        isQuizActive: false
      }));
      setCompletedSubTopics([]);
      setCurrentQuizIndex(0);
      setStageFinished(false);
      setViewMode('map');
      setCurrentDialogue(STORY_DATA.dialogues.stageComplete);
      
      // Check for Grandmaster achievement (finish level 4 on HARD)
      const currentAchievements = gameState.achievements || [];
      if (gameState.currentStageIndex === 3 && gameState.difficulty === Difficulty.HARD && !currentAchievements.includes('grandmaster')) {
        setGameState(prev => ({ ...prev, achievements: [...(prev.achievements || []), 'grandmaster'] }));
        celebrateLevelUp();
      }

      setShowGuide(true);
      setTimeout(() => setShowGuide(false), 4000);
    }
  };

  const backToHome = () => {
    setGameStarted(false);
    setGameFinished(false);
    setStageFinished(false);
  };

  const restartGame = () => {
    setGameState({
      currentStageIndex: 0,
      currentSubTopicIndex: 0,
      isQuizActive: false,
      score: 0,
      streak: 0,
      unlockedRewards: [],
      completedStages: [],
      difficulty: gameState.difficulty,
      achievements: gameState.achievements || [],
      labExperiments: 0
    });
    setCompletedSubTopics([]);
    setViewMode('map');
    setCurrentQuizIndex(0);
    setGameFinished(false);
    setGameStarted(false);
  };

  // Background Mesh elements
  const MeshBackground = () => (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#6366f1]">
      <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-[#a855f7] rounded-full blur-[120px] opacity-40"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#ec4899] rounded-full blur-[100px] opacity-40"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-[#06b6d4] rounded-full blur-[130px] opacity-20"></div>
      
      {/* Matrix Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.05]" style={{ 
        backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', 
        backgroundSize: '40px 40px' 
      }}></div>

      {/* Animated Adventure Map Paths */}
      {!gameStarted && (
        <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
          <motion.path
            d="M -100 500 Q 250 200 500 500 T 1100 500"
            fill="none"
            stroke="white"
            strokeWidth="4"
            strokeDasharray="20 20"
            initial={{ strokeDashoffset: 0 }}
            animate={{ strokeDashoffset: -200 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
          <motion.path
            d="M 200 -100 Q 500 250 200 500 T 200 1100"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeDasharray="15 15"
            initial={{ strokeDashoffset: 0 }}
            animate={{ strokeDashoffset: 150 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />
          {[...Array(5)].map((_, i) => (
            <motion.circle
              key={i}
              r="8"
              fill="white"
              initial={{ opacity: 0.1 }}
              animate={{ opacity: [0.1, 0.5, 0.1], scale: [1, 1.5, 1] }}
              transition={{ delay: i * 2, duration: 4, repeat: Infinity }}
              cx={200 + i * 150}
              cy={300 + Math.sin(i) * 200}
            />
          ))}
        </svg>
      )}
    </div>
  );

  const FloatingMascot = () => (
    <motion.div
      animate={{ 
        y: [0, -20, 0],
        rotate: [0, 5, -5, 0]
      }}
      transition={{ 
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="relative w-48 h-48 mx-auto mb-6"
    >
      <div className="absolute inset-0 bg-yellow-400 rounded-[2.5rem] rotate-6 opacity-20 blur-xl animate-pulse"></div>
      <div className="relative z-10 w-full h-full bg-gradient-to-br from-yellow-300 to-orange-400 rounded-[2.5rem] shadow-2xl flex items-center justify-center border-4 border-white/50">
        <div className="flex flex-col items-center">
          <div className="flex gap-4 mb-2">
            <motion.div 
              animate={{ height: [8, 2, 8] }}
              transition={{ repeat: Infinity, duration: 3, times: [0, 0.1, 0.2] }}
              className="w-4 h-8 bg-indigo-900 rounded-full" 
            />
            <motion.div 
              animate={{ height: [8, 2, 8] }}
              transition={{ repeat: Infinity, duration: 3, times: [0, 0.1, 0.2] }}
              className="w-4 h-8 bg-indigo-900 rounded-full" 
            />
          </div>
          <div className="w-12 h-4 border-b-4 border-indigo-900 rounded-full"></div>
        </div>
        
        {/* Floating elements around mascot */}
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute -top-4 -right-10 w-12 h-12 bg-white/30 backdrop-blur-md rounded-xl border border-white/40 flex items-center justify-center font-mono font-black text-white text-lg rotate-12"
        >
          [0]
        </motion.div>
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute -bottom-2 -left-8 w-14 h-14 bg-indigo-500/30 backdrop-blur-md rounded-xl border border-white/20 flex items-center justify-center font-mono font-black text-white text-xl -rotate-12"
        >
          I
        </motion.div>
      </div>
    </motion.div>
  );

  const masteryPercentage = Math.round(
    ((completedSubTopics.length + (gameState.isQuizActive ? currentQuizIndex : stageFinished ? shuffledQuizzes.length : 0)) / 
    (currentStage.subTopics.length + shuffledQuizzes.length)) * 100
  );

  if (!gameStarted) {
    return (
      <div className="min-h-screen relative flex flex-col items-center justify-center p-4 overflow-hidden">
        <MeshBackground />
        
        {/* Random Floating Particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: Math.random() * 1000 - 500, y: Math.random() * 1000 - 500 }}
            animate={{ 
              opacity: [0.1, 0.3, 0.1],
              y: [0, -100, 0],
              x: [0, i % 2 === 0 ? 50 : -50, 0],
              rotate: [0, 180, 360]
            }}
            transition={{ 
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute z-0 pointer-events-none text-white/10 font-mono font-black text-6xl select-none"
          >
            {['[ ]', '0', '1', 'Σ', 'A', 'x'][i]}
          </motion.div>
        ))}

        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative z-10 w-full max-w-2xl text-center"
        >
          <FloatingMascot />
          
          <div className="flex items-center justify-center gap-2 mb-4">
            {dbConnected !== null && (
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black border transition-all ${
                dbConnected 
                  ? 'bg-emerald-400/20 text-emerald-300 border-emerald-400/30' 
                  : 'bg-rose-400/20 text-rose-300 border-rose-400/30'
              }`}>
                <Database className={dbConnected ? "w-3 h-3 animate-pulse" : "w-3 h-3"} />
                {dbConnected ? 'DATABASE READY' : 'DATABASE OFFLINE'}
              </div>
            )}
            {storageConnected !== null && (
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black border transition-all ${
                storageConnected 
                  ? 'bg-sky-400/20 text-sky-300 border-sky-400/30' 
                  : 'bg-rose-400/20 text-rose-300 border-rose-400/30'
              }`}>
                <Layers className={storageConnected ? "w-3 h-3 animate-pulse" : "w-3 h-3"} />
                {storageConnected ? 'STORAGE ACTIVE' : 'STORAGE OFFLINE'}
              </div>
            )}
            <div className="px-3 py-1 bg-white/10 text-white/60 border border-white/20 rounded-full text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-yellow-300" /> BETA VERSION
            </div>
          </div>

          <div 
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              borderColor: 'rgba(255, 255, 255, 0.25)'
            }}
            className="backdrop-blur-3xl p-8 md:p-14 rounded-[4rem] border shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] mb-8 relative group"
          >
             {/* Glow effect on hover container */}
             <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-[4rem] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

             <motion.div
               animate={{ filter: ['drop-shadow(0 0 0px #fff)', 'drop-shadow(0 0 15px rgba(255,255,255,0.5))', 'drop-shadow(0 0 0px #fff)'] }}
               transition={{ duration: 3, repeat: Infinity }}
             >
               <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tighter leading-none italic px-4">
                  MATRIKS <span className="text-yellow-300">ADVENTURE</span>
                </h1>
             </motion.div>
             
             <p className="text-lg md:text-xl text-white/90 mb-8 font-bold leading-tight px-6">
               Kuasai Dunia Matriks Melalui <br className="hidden md:block"/>
               <span className="text-indigo-200">Petualangan Visual yang Memukau!</span>
             </p>
             
             <div className="bg-white/5 p-5 md:p-6 rounded-3xl border border-white/10 mb-8 backdrop-blur-md relative overflow-hidden group/quote mx-4 md:mx-0">
               <div className="absolute left-0 top-0 w-1 h-full bg-yellow-400 group-hover/quote:h-0 transition-all duration-500"></div>
               <p className="text-xs md:text-base text-white/70 italic font-medium">"{STORY_DATA.intro}"</p>
             </div>

             <div className="flex flex-col gap-8 px-6 md:px-0">
               <div className="flex flex-col items-center gap-4">
                 <p className="text-white/60 text-xs font-black uppercase tracking-[0.2em]">Pilih Tingkat Kesulitan</p>
                 <div className="flex gap-2">
                   {(Object.values(Difficulty) as Difficulty[]).map((diff) => (
                     <button
                       key={diff}
                       onClick={() => setGameState(prev => ({ ...prev, difficulty: diff }))}
                       className={`px-4 py-2 rounded-xl font-black text-xs transition-all border ${
                         gameState.difficulty === diff 
                         ? 'bg-yellow-300 text-indigo-900 border-yellow-300 shadow-lg scale-105' 
                         : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                       }`}
                     >
                       {diff}
                     </button>
                   ))}
                 </div>
               </div>

               <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                 <button 
                   onClick={() => {
                     playSfx('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
                     setGameStarted(true);
                     setCurrentDialogue(STORY_DATA.dialogues.welcome);
                     setShowGuide(true);
                     setTimeout(() => setShowGuide(false), 5000);
                   }}
                   className="w-full md:w-auto px-10 py-5 bg-white text-indigo-700 rounded-[2rem] font-black text-xl md:text-2xl hover:scale-105 hover:bg-yellow-300 hover:text-indigo-900 transition-all shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] active:scale-95 flex items-center justify-center gap-3 touch-manipulation"
                 >
                   Ayo Mulai!
                   <ArrowRight className="w-6 h-6 md:w-8 md:h-8 stroke-[4]" />
                 </button>

                 <button 
                   onClick={() => setShowObjectives(true)}
                   className="w-full md:w-auto px-10 py-5 bg-indigo-600/30 text-white border-2 border-white/20 rounded-[2rem] font-black text-lg md:text-xl hover:bg-white/10 transition-all flex items-center justify-center gap-3 active:scale-95 backdrop-blur-sm"
                 >
                   <BookOpen className="w-6 h-6 md:w-8 md:h-8" />
                   Tujuan Belajar
                 </button>

                 <button 
                   onClick={() => setShowTeacherProfile(true)}
                   className="w-full md:w-auto px-10 py-5 bg-purple-600/30 text-white border-2 border-white/20 rounded-[2rem] font-black text-lg md:text-xl hover:bg-white/10 transition-all flex items-center justify-center gap-3 active:scale-95 backdrop-blur-sm"
                 >
                   <User className="w-6 h-6 md:w-8 md:h-8" />
                   Profil Pengajar
                 </button>
               </div>
             </div>
             
             {/* Decorative small matrix */}
             <div className="absolute -bottom-3 -right-3 opacity-20 pointer-events-none scale-150 rotate-12 hidden md:block">
               <div className="grid grid-cols-2 gap-2">
                 {[...Array(4)].map((_, i) => <div key={i} className="w-8 h-8 bg-white rounded-lg"></div>)}
               </div>
             </div>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-white/40 text-[10px] font-black uppercase tracking-[0.4em]">
             <CheckCircle2 className="w-3 h-3" /> Edisi Petualang Dasar
          </div>
        </motion.div>

        <AnimatePresence>
          {showObjectives && (
            <LearningObjectives onClose={() => setShowObjectives(false)} />
          )}
          {showTeacherProfile && (
            <TeacherProfile onClose={() => setShowTeacherProfile(false)} />
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (stageFinished && !gameFinished) {
    return (
      <div className="min-h-screen relative flex flex-col items-center justify-center p-4 overflow-hidden">
        <MeshBackground />
        <LevelUpParticles />
        <motion.div 
           initial={{ scale: 0.8, opacity: 0, y: 20 }}
           animate={{ scale: 1, opacity: 1, y: 0 }}
           style={{ 
             backgroundColor: 'rgba(255, 255, 255, 0.2)',
             borderColor: 'rgba(255, 255, 255, 0.4)'
           }}
           className="relative z-10 backdrop-blur-3xl p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] border shadow-2xl text-center max-w-sm md:max-w-lg mx-4"
        >
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-yellow-400/20 blur-3xl rounded-full" />
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-400/20 blur-3xl rounded-full" />
          
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-6 left-1/2 -translate-x-1/2 bg-yellow-400 p-3 rounded-2xl shadow-xl"
          >
             <Star className="w-8 h-8 text-yellow-900 fill-yellow-900" />
          </motion.div>

          <div className="w-20 h-20 md:w-28 md:h-28 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8 border border-white/50 shadow-inner mt-4">
            <CheckCircle2 className="w-12 h-12 md:w-16 md:h-16 text-green-400 drop-shadow-lg" />
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-2 leading-none uppercase italic tracking-tighter">LEVEL SELESAI!</h2>
          <p className="text-white/70 mb-6 md:mb-8 text-base md:text-lg font-medium px-4">Luar biasa! Kamu telah menguasai <span className="text-yellow-300 font-bold">{currentStage.title}</span>.</p>
          
          <div className="bg-white/10 backdrop-blur-md p-5 md:p-6 rounded-2xl md:rounded-3xl mb-8 md:mb-10 border border-white/20 relative group">
            <div className="absolute inset-0 bg-yellow-400/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
            <span className="text-[10px] text-white/50 uppercase font-black tracking-[0.3em] block mb-1">Skor Saat Ini</span>
            <span className="text-4xl md:text-6xl font-black text-white drop-shadow-sm">{gameState.score} XP</span>
          </div>

          <button 
            onClick={() => {
              playSfx('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
              handleNextStage();
            }}
            className="w-full py-5 md:py-6 bg-white text-indigo-700 rounded-2xl font-black text-xl md:text-2xl hover:scale-105 hover:bg-yellow-300 hover:text-indigo-900 transition-all shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] flex items-center justify-center gap-3 active:scale-95 touch-manipulation group"
          >
            Lanjut Wilayah {gameState.currentStageIndex + 2}
            <ChevronRight className="w-7 h-7 md:w-8 md:h-8 stroke-[4] group-hover:translate-x-2 transition-transform" />
          </button>
          
          <button 
            onClick={backToHome}
            className="w-full mt-4 py-3 bg-white/10 text-white rounded-xl font-bold text-sm hover:bg-white/20 transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" /> Beranda
          </button>
        </motion.div>
      </div>
    );
  }

  if (gameFinished) {
    return (
      <div className="min-h-screen relative flex flex-col items-center justify-center p-4">
        <MeshBackground />
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderColor: 'rgba(255, 255, 255, 0.4)'
          }}
          className="relative z-10 backdrop-blur-3xl p-12 rounded-[3.5rem] border shadow-2xl text-center max-w-lg"
        >
          <div className="w-28 h-28 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/50 shadow-inner">
            <Trophy className="w-16 h-16 text-yellow-300 drop-shadow-lg" />
          </div>
          <h2 className="text-4xl font-black text-white mb-3 leading-none">MASTER MATRIKS!</h2>
          <p className="text-white/70 mb-8 text-lg font-medium">Kamu telah menuntun penjelajah melewati gerbang konsep pertama.</p>
          
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl mb-10 border border-white/20">
            <span className="text-xs text-white/50 uppercase font-black tracking-[0.3em] block mb-2">Total Pengalaman</span>
            <span className="text-6xl font-black text-white drop-shadow-sm">{gameState.score} XP</span>
          </div>

          {gameState.unlockedRewards.length > 0 && (
            <div className="mb-10 text-left">
              <h4 className="text-white font-black text-xs uppercase tracking-widest mb-4 opacity-60">Pencapaian Unlocked</h4>
              <div className="flex flex-wrap gap-3">
                {REWARDS.filter(r => gameState.unlockedRewards.includes(r.id)).map(reward => (
                  <div key={reward.id} className="bg-white/20 px-4 py-2 rounded-xl flex items-center gap-2 border border-white/20">
                    <span className="text-xl">{reward.icon}</span>
                    <span className="text-white text-xs font-bold">{reward.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-4">
             <button 
               onClick={() => setShowCertificate(true)}
               className="w-full py-5 bg-yellow-400 text-slate-900 rounded-2xl font-black text-xl hover:scale-105 transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95 group"
             >
               <Award className="w-8 h-8 group-hover:rotate-12 transition-transform" /> Ambil Sertifikat
             </button>

             <button 
               className="w-full py-4 bg-white/10 text-white rounded-2xl font-black text-lg hover:bg-white/20 transition-all border border-white/20"
               onClick={() => alert('Dunia berikutnya sedang dibangun oleh para penyihir matematika!')}
             >
               Ke Pulau Berikutnya
             </button>
             
             <div className="grid grid-cols-2 gap-4">
               <button 
                 onClick={restartGame}
                 className="py-4 bg-transparent border-2 border-white/30 text-white font-bold rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-2"
               >
                 <RotateCcw className="w-5 h-5" /> Ulang
               </button>
               <button 
                 onClick={backToHome}
                 className="py-4 bg-transparent border-2 border-white/30 text-white font-bold rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-2"
               >
                 <Home className="w-5 h-5" /> Home
               </button>
             </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-x-hidden flex flex-col p-4 md:p-8 gap-6">
      <MeshBackground />

      <AnimatePresence>
        {showChallenge && (
          <ChallengeMode 
            onClose={() => setShowChallenge(false)}
            onFinish={(score) => {
              setGameState(prev => ({ ...prev, score: prev.score + score }));
              setShowChallenge(false);
              confetti({ particleCount: 150, spread: 120 });
            }}
          />
        )}
        {showDuel && (
          <DuelMode 
            onClose={() => setShowDuel(false)}
            onClaimCertificate={() => {
              setShowDuel(false);
              setShowCertificate(true);
            }}
            onFinish={(winner) => {
              // Add some XP for participating in duel
              setGameState(prev => ({ ...prev, score: prev.score + 50 }));
              celebrateBigWin();
            }}
          />
        )}
      </AnimatePresence>

      <SenseiMatriks />

      {/* Header View */}
      <nav className="relative z-10 flex flex-col md:flex-row items-center justify-between bg-white/20 backdrop-blur-xl border border-white/30 rounded-[2rem] px-8 py-5 shadow-2xl gap-4">
        <div className="flex items-center gap-4">
          {dbConnected !== null && (
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border transition-all ${
              dbConnected 
                ? 'bg-emerald-400/20 text-emerald-300 border-emerald-400/30' 
                : 'bg-rose-400/20 text-rose-300 border-rose-400/30'
            }`}>
              <Database className={dbConnected ? "w-3 h-3 animate-pulse" : "w-3 h-3"} />
              {dbConnected ? 'DATABASE READY' : 'DATABASE OFFLINE'}
            </div>
          )}

          <button 
            onClick={backToHome}
            className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl border border-white/20 transition-all active:scale-95 touch-manipulation group"
            title="Kembali ke Beranda"
          >
            <Home className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
          </button>
          
          <div className="w-[1px] h-10 bg-white/10 mx-1 hidden md:block" />

          <button 
            onClick={() => {
              setViewMode('lab');
              setCurrentDialogue(STORY_DATA.dialogues.labIntro);
              setShowGuide(true);
              setTimeout(() => setShowGuide(false), 5000);
              playSfx('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
            }}
            className={`p-3 rounded-2xl border transition-all active:scale-95 touch-manipulation group ${viewMode === 'lab' ? 'bg-indigo-500 border-indigo-400' : 'bg-white/10 hover:bg-white/20 border-white/20'}`}
            title="Matrix Lab (Sandbox)"
          >
            <FlaskConical className={`w-6 h-6 group-hover:scale-110 transition-transform ${viewMode === 'lab' ? 'text-white' : 'text-white/70'}`} />
          </button>

          <div className="w-[1px] h-10 bg-white/10 mx-1 hidden md:block" />
          
          <button 
            onClick={() => {
              setIsMuted(!isMuted);
              playSfx('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
            }}
            className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl border border-white/20 transition-all active:scale-95 touch-manipulation group"
            title={isMuted ? "Bunyikan Musik" : "Matikan Musik"}
          >
            {isMuted ? (
              <VolumeX className="w-6 h-6 text-white/50" />
            ) : (
              <Volume2 className="w-6 h-6 text-white" />
            )}
          </button>

          <div className="w-[1px] h-10 bg-white/10 mx-1 hidden md:block" />
          
          <div className="w-14 h-14 bg-yellow-400 rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-500/20 transform -rotate-3 ml-2">
            <Map className="w-8 h-8 text-yellow-900" />
          </div>
          <div>
            <h1 className="text-white font-black text-2xl tracking-tight leading-none uppercase">Matriks Adventure</h1>
            <p className="text-white/60 text-[10px] font-black tracking-[0.2em] uppercase mt-1">Petualangan Matriks</p>
          </div>
        </div>
        
        <div className="flex items-center gap-8 w-full md:w-auto">
          <div className="flex-1 md:flex-none flex flex-col items-end gap-1">
            <div className="flex gap-2 items-center">
              <div className="h-3 w-32 bg-white/10 rounded-full overflow-hidden border border-white/10">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-green-400" 
                />
              </div>
              <span className="text-white font-black text-[10px] uppercase tracking-wider">Level {gameState.currentStageIndex + 1}</span>
            </div>
          </div>
          <div className="bg-white/10 px-6 py-2 rounded-2xl border border-white/20 backdrop-blur-md flex items-center gap-4">
            <div className="flex gap-2">
              {Object.keys(ACHIEVEMENTS).map(id => {
                const isUnlocked = (gameState.achievements || []).includes(id);
                return (
                  <div 
                    key={id} 
                    className={`p-2 rounded-xl border transition-all cursor-help ${isUnlocked ? 'bg-yellow-400/20 border-yellow-400 text-yellow-300 scale-110' : 'bg-white/5 border-white/10 text-white/20 grayscale'}`}
                    title={`${ACHIEVEMENTS[id].name}: ${ACHIEVEMENTS[id].description}`}
                  >
                    {id === 'flash' && <Zap className="w-4 h-4" />}
                    {id === 'grandmaster' && <Crown className="w-4 h-4" />}
                    {id === 'scientist' && <FlaskConical className="w-4 h-4" />}
                  </div>
                );
              })}
            </div>
            <div className="w-[1px] h-6 bg-white/10" />
            <div className="flex flex-col items-center">
              <span className="text-[8px] text-white/50 font-black uppercase tracking-widest">Kesulitan</span>
              <span className="text-white font-black text-[10px] uppercase">{gameState.difficulty}</span>
            </div>
            <div className="w-[1px] h-6 bg-white/10" />
            <span className="text-yellow-300 font-black tracking-tight flex items-center gap-2">
              <Star className="w-4 h-4 fill-yellow-300" /> {gameState.score} XP
            </span>
          </div>
        </div>
      </nav>

      {/* Main content grid */}
      <main className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        {/* Sidebar: Status Quest */}
        <aside className="col-span-1 lg:col-span-3 flex flex-col gap-4 md:gap-6 order-2 lg:order-1">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2.5rem] p-6 flex flex-col gap-3">
            <h3 className="text-white/50 font-black text-[10px] tracking-[0.2em] uppercase mb-3 ml-2">Status Quest</h3>
            
            <div className="flex items-center gap-4 p-4 bg-white/20 rounded-2xl border border-white/40">
              <div className="text-yellow-300 font-black text-xl">
                 {gameState.streak > 0 ? `🔥 ${gameState.streak}` : '❄️ 0'}
              </div>
              <span className="text-white font-black text-xs uppercase tracking-widest">Streak Jawaban</span>
            </div>

            <div className="p-4 bg-indigo-500/30 rounded-2xl border border-white/10">
               <p className="text-white/70 text-[10px] font-black uppercase mb-1">Misi Aktif</p>
               <p className="text-white font-bold text-sm leading-tight">Pulihkan Gerbang Matriks Pulau</p>
            </div>

            {/* Stage Selector List */}
            <h3 className="text-white/50 font-black text-[10px] tracking-[0.2em] uppercase mt-6 mb-3 ml-2">Progress Wilayah</h3>
            <div className="space-y-2 overflow-y-auto max-h-[300px] pr-2 scrollbar-hide">
              {MATRIX_ADVENTURE_DATA.map((stage, idx) => {
                const isUnlocked = idx <= gameState.completedStages.length;
                const isCompleted = gameState.completedStages.includes(stage.id);
                const isActive = idx === gameState.currentStageIndex;

                return (
                  <button 
                    key={stage.id} 
                    disabled={!isUnlocked}
                    onClick={() => {
                        setGameState(prev => ({ ...prev, currentStageIndex: idx }));
                        setCurrentQuizIndex(0);
                        setCompletedSubTopics([]);
                        setStageFinished(false);
                        setViewMode('map');
                    }}
                    className={`w-full p-4 rounded-[1.5rem] border transition-all text-left group ${isActive ? 'bg-indigo-500 border-white/40 shadow-lg' : isUnlocked ? 'bg-white/5 border-white/10 hover:bg-white/15' : 'bg-black/20 border-white/5 opacity-50 cursor-not-allowed'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${isCompleted ? 'bg-emerald-400 text-indigo-900' : isActive ? 'bg-white text-indigo-600' : 'bg-white/10 text-white/40'}`}>
                        {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-black text-[11px] uppercase tracking-wide truncate ${isActive ? 'text-white' : 'text-white/70'}`}>{stage.title}</h4>
                        <div className="flex items-center gap-1">
                           <div className={`w-1.5 h-1.5 rounded-full ${isCompleted ? 'bg-emerald-400' : isUnlocked ? 'bg-yellow-400' : 'bg-white/10'}`} />
                           <p className="text-[8px] text-white/40 font-black uppercase tracking-widest">{isCompleted ? 'Clear' : isUnlocked ? 'Ready' : 'Locked'}</p>
                        </div>
                      </div>
                      {isUnlocked && !isActive && <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-white transition-colors" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Challenge Mode Button */}
            <div className="flex gap-3 mt-4">
              <button 
                onClick={() => {
                  setShowChallenge(true);
                  playSfx('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
                }}
                className="flex-1 py-4 bg-gradient-to-r from-red-600 to-orange-500 rounded-[1.5rem] font-black text-white text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl hover:scale-[1.02] active:scale-95 transition-all group overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-white/20 translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                <Timer className="w-4 h-4 z-10 animate-pulse" />
                <span className="z-10">Challenge</span>
              </button>
              
              <button 
                onClick={() => {
                  setShowDuel(true);
                  playSfx('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
                }}
                className="flex-1 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-[1.5rem] font-black text-white text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl hover:scale-[1.02] active:scale-95 transition-all group overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-white/20 translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                <Sword className="w-4 h-4 z-10" />
                <span className="z-10">Duel</span>
              </button>
            </div>
          </div>

          <div className="hidden lg:flex p-6 bg-gradient-to-br from-orange-400/80 to-pink-500/80 backdrop-blur-md rounded-[2.5rem] shadow-2xl border border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-white" />
              <p className="text-white text-[10px] font-black uppercase tracking-widest opacity-80">Tip Petualang</p>
            </div>
            <p className="text-white text-sm italic font-medium leading-relaxed">
              {gameState.isQuizActive ? "Hati-hati! Gerbang ini memerlukan ketelitian tinggi." : "Klik titik-titik di peta untuk mempelajari rahasia Matriks!"}
            </p>
          </div>
        </aside>

        {/* Content Module / Map View */}
        <section className="col-span-1 lg:col-span-9 flex flex-col min-h-0 order-1 lg:order-2">
          <AnimatePresence mode="wait">
            {viewMode === 'map' ? (
              <motion.div
                key="adventure-map"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 flex flex-col items-center min-h-[400px]"
              >
                <div className="mb-4 md:mb-6 text-center">
                   <h2 className="text-2xl md:text-3xl font-black text-white drop-shadow-lg uppercase tracking-tight">Peta Pulau Matriks</h2>
                   <p className="text-white/60 font-medium tracking-widest text-[10px] uppercase">Pilih lokasi tujuanmu</p>
                </div>
                <MapView 
                  stage={currentStage}
                  currentSubTopicIndex={gameState.currentSubTopicIndex}
                  completedSubTopics={completedSubTopics}
                  isQuizActive={gameState.isQuizActive}
                  onNodeClick={handleEnterLesson}
                  onQuizClick={handleEnterQuiz}
                />
              </motion.div>
            ) : viewMode === 'lab' ? (
              <motion.div
                key="matrix-lab"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="flex-1"
              >
                <div className="mb-6">
                  <button 
                    onClick={() => setViewMode('map')}
                    className="text-white/60 hover:text-white flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-colors"
                  >
                    <Map className="w-4 h-4" /> Kembali ke Peta
                  </button>
                </div>
                <MatrixLab onExperimentPerformed={handleExperimentCount} />
              </motion.div>
            ) : viewMode === 'content' ? (
              <motion.div 
                key={currentSubTopic.id}
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                className="flex flex-col gap-6 h-full"
              >
                <div className="flex-1 bg-white/20 backdrop-blur-2xl border border-white/30 rounded-[2.5rem] md:rounded-[3.5rem] p-6 md:p-12 shadow-2xl relative overflow-hidden flex flex-col">
                   <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/5 rounded-full border-[30px] border-white/5 hidden md:block"></div>
                   
                   <div className="mb-6 md:mb-10 relative z-10">
                    <button 
                      onClick={() => {
                        playSfx('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
                        setViewMode('map');
                      }}
                      className="mb-4 text-white/60 hover:text-white flex items-center gap-2 text-[10px] md:text-xs font-black uppercase tracking-widest transition-colors py-2 px-3 hover:bg-white/10 rounded-xl"
                    >
                      <Map className="w-4 h-4" /> Kembali ke Peta
                    </button>
                    <h2 className="text-3xl md:text-6xl font-black text-white mt-1 drop-shadow-md tracking-tight leading-none">
                      {currentSubTopic.title}
                    </h2>
                    <div className="mt-6 md:mt-8 bg-white/5 backdrop-blur-md p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-white/10">
                      <p className="text-white/90 text-lg md:text-xl leading-relaxed font-medium">
                        {currentSubTopic.content}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center flex-1">
                    {currentSubTopic.examples.map((ex, exIdx) => (
                      <div key={exIdx} className="bg-white/10 backdrop-blur-md rounded-[2.5rem] p-6 md:p-8 border border-white/20 shadow-xl flex flex-col items-center">
                         <h4 className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] mb-4 md:mb-8 text-center uppercase tracking-widest">Kristal Matriks {exIdx + 1}</h4>
                         <div className="scale-75 md:scale-90 lg:scale-100 origin-center">
                           <MatrixDisplay 
                            data={ex.data} 
                           />
                         </div>
                         <div className="mt-4 md:mt-8 px-6 py-2 bg-black/20 rounded-full border border-white/10">
                           <code className="text-pink-300 font-mono text-xs md:text-sm font-black">{ex.label}</code>
                         </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 md:mt-12 flex justify-end items-center relative z-10">
                    <button 
                      onClick={() => {
                        playSfx('https://assets.mixkit.co/active_storage/sfx/407/407-preview.mp3');
                        handleNextSubTopic();
                      }}
                      className="w-full md:w-auto px-10 md:px-12 py-4 md:py-5 bg-white text-indigo-600 font-black rounded-2xl md:rounded-[1.5rem] shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-4 active:scale-95 text-lg"
                    >
                      Tandai Selesai
                      <ChevronRight className="w-6 h-6 stroke-[3]" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="quiz-mode"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="flex flex-col items-center gap-8 h-full"
              >
                <div className="text-center">
                  <button 
                    onClick={() => {
                      playSfx('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
                      setViewMode('map');
                    }}
                    className="mb-4 text-white/60 hover:text-white flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-colors mx-auto"
                  >
                    <Map className="w-4 h-4" /> Keluar ke Peta
                  </button>
                  <span className="text-white/50 font-black text-[10px] tracking-[0.4em] uppercase">Tantangan Penjaga Gerbang</span>
                  <h3 className="text-4xl font-black text-white mt-2 leading-none">TAHAP {currentQuizIndex + 1} / {shuffledQuizzes.length}</h3>
                </div>
                
                <QuizContainer 
                  question={currentStage.quizzes[currentQuizIndex]}
                  onNext={handleNextQuiz}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>

      {/* Footer Inventory */}
      <footer className="relative z-10 flex flex-col md:flex-row gap-4 mt-6">
         <div className="bg-white/10 backdrop-blur-xl rounded-2xl flex-1 border border-white/20 flex flex-wrap items-center px-6 md:px-8 py-4 gap-4 md:gap-8">
            <span className="text-white/40 font-black text-[10px] uppercase tracking-[0.2em] w-full md:w-auto">Saku Ilmu:</span>
            <div className="flex flex-wrap gap-3">
              <div className="px-4 py-2 bg-blue-500/40 rounded-xl border border-blue-400 text-white text-[10px] font-black shadow-lg">GANDA</div>
              <div className="px-4 py-2 bg-purple-500/40 rounded-xl border border-purple-400 text-white text-[10px] font-black shadow-lg">ESSAY</div>
              <div className="px-4 py-2 bg-pink-500/40 rounded-xl border border-pink-400 text-white text-[10px] font-black shadow-lg">TARIK</div>
              <div className="px-4 py-2 bg-orange-500/40 rounded-xl border border-orange-400 text-white text-[10px] font-black shadow-lg">ISIAN</div>
            </div>
         </div>
         <div className="bg-white/20 backdrop-blur-xl rounded-2xl px-10 py-4 border border-white/30 flex items-center justify-center shadow-xl mb-4 md:mb-0">
            <span className="text-white font-black text-xs md:text-sm tracking-widest uppercase text-center">PENGUASAAN: {masteryPercentage}%</span>
         </div>
      </footer>
      
      <GuideCharacter message={currentDialogue} isVisible={showGuide} />

      <AnimatePresence>
        {showObjectives && (
          <LearningObjectives onClose={() => setShowObjectives(false)} />
        )}
        {showCertificate && (
          <Certificate 
            score={gameState.score}
            difficulty={gameState.difficulty}
            date={new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            onClose={() => setShowCertificate(false)}
          />
        )}
        {showTeacherProfile && (
          <TeacherProfile onClose={() => setShowTeacherProfile(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
