import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, ArrowRight, HelpCircle } from 'lucide-react';
import { Question, QuestionType } from '../types.ts';

interface QuizProps {
  question: Question;
  onNext: (isCorrect: boolean) => void;
}

export default function QuizContainer({ question, onNext }: QuizProps) {
  const [answer, setAnswer] = useState<any>(() => 
    question.type === QuestionType.COMPLEX_MC 
      ? [] 
      : question.type === QuestionType.DRAG_AND_DROP 
        ? {} 
        : ''
  );
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);
  const [shuffledTargets, setShuffledTargets] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    // Reset state when question changes
    setAnswer(
      question.type === QuestionType.COMPLEX_MC 
        ? [] 
        : question.type === QuestionType.DRAG_AND_DROP 
          ? {} 
          : ''
    );
    setSelectedMatch(null);
    setIsSubmitted(false);
    setIsCorrect(false);

    if (question.type === QuestionType.DRAG_AND_DROP && question.correctAnswer) {
      const targets = Array.from(new Set(Object.values(question.correctAnswer as Record<string, string>)));
      setShuffledTargets([...targets].sort(() => Math.random() - 0.5));
    }
  }, [question.id]); // Use question.id as dependency

  const handleSubmit = () => {
    let correct = false;
    if (question.type === QuestionType.MULTIPLE_CHOICE) {
      correct = answer === question.correctAnswer;
    } else if (question.type === QuestionType.COMPLEX_MC) {
      const sortedAnswer = Array.isArray(answer) ? [...answer].sort() : [];
      const sortedCorrect = Array.isArray(question.correctAnswer) ? [...question.correctAnswer].sort() : [];
      correct = JSON.stringify(sortedAnswer) === JSON.stringify(sortedCorrect);
    } else if (question.type === QuestionType.FILL_IN_BLANKS) {
      correct = String(answer).toLowerCase().replace(/\s/g, '') === String(question.correctAnswer).toLowerCase().replace(/\s/g, '');
    } else if (question.type === QuestionType.ESSAY) {
      const keywords = String(question.correctAnswer).toLowerCase().split(' ');
      correct = keywords.some((kw: string) => String(answer).toLowerCase().includes(kw));
    } else if (question.type === QuestionType.DRAG_AND_DROP) {
      const correctAnswers = question.correctAnswer as Record<string, string>;
      const keys = Object.keys(correctAnswers);
      correct = keys.every(key => answer[key] === correctAnswers[key]);
    }

    setIsCorrect(correct);
    setIsSubmitted(true);
  };

  const handleNext = () => {
    onNext(isCorrect);
  };

  const toggleComplexMC = (opt: string) => {
    if (!Array.isArray(answer)) return;
    if (answer.includes(opt)) {
      setAnswer(answer.filter((a: string) => a !== opt));
    } else {
      setAnswer([...answer, opt]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderColor: 'rgba(255, 255, 255, 0.4)'
      }}
      className="w-full max-w-2xl backdrop-blur-3xl rounded-[2.5rem] shadow-2xl p-8 md:p-10 border overflow-hidden relative"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-white/40 rounded-xl flex items-center justify-center shadow-lg">
          <HelpCircle className="text-white w-6 h-6" />
        </div>
        <h3 className="text-2xl font-black text-white tracking-tight leading-tight">{question.question}</h3>
      </div>

      <div className="space-y-3 mb-10">
        {question.type === QuestionType.MULTIPLE_CHOICE && question.options?.map((opt) => (
          <button
            key={opt}
            disabled={isSubmitted}
            onClick={() => setAnswer(opt)}
            className={`w-full text-left p-5 rounded-2xl border-2 transition-all font-bold ${
              answer === opt 
                ? 'border-white bg-white/40 text-white shadow-xl scale-[1.02]' 
                : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:border-white/20'
            }`}
          >
            {opt}
          </button>
        ))}

        {question.type === QuestionType.COMPLEX_MC && question.options?.map((opt) => (
          <button
            key={opt}
            disabled={isSubmitted}
            onClick={() => toggleComplexMC(opt)}
            className={`w-full text-left p-5 rounded-2xl border-2 transition-all flex justify-between items-center font-bold ${
              Array.isArray(answer) && answer.includes(opt)
                ? 'border-white bg-white/40 text-white shadow-xl scale-[1.02]'
                : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:border-white/20'
            }`}
          >
            {opt}
            <div className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-colors ${Array.isArray(answer) && answer.includes(opt) ? 'bg-white border-white text-indigo-600' : 'border-white/20'}`}>
              {Array.isArray(answer) && answer.includes(opt) && <CheckCircle2 className="w-5 h-5 fill-indigo-600" />}
            </div>
          </button>
        ))}

        {(question.type === QuestionType.FILL_IN_BLANKS || question.type === QuestionType.ESSAY) && (
          <textarea
            disabled={isSubmitted}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder={question.type === QuestionType.FILL_IN_BLANKS ? "Misal: 2,2" : "Tuangkan pengetahuanmu di sini..."}
            className="w-full p-5 rounded-[2rem] border-2 border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-white focus:bg-white/10 min-h-[120px] outline-none transition-all font-bold text-lg"
          />
        )}

        {question.type === QuestionType.DRAG_AND_DROP && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-2">Matriks</p>
              {question.options?.map((opt) => (
                <button
                  key={opt}
                  disabled={isSubmitted}
                  onClick={() => setSelectedMatch(selectedMatch === opt ? null : opt)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all font-mono text-sm group relative ${
                    selectedMatch === opt
                      ? 'border-white bg-white/40 text-white shadow-lg ring-4 ring-white/10'
                      : answer[opt]
                        ? 'border-green-500/50 bg-green-500/20 text-white opacity-80'
                        : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                  }`}
                >
                  {opt}
                  {answer[opt] && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-green-400 text-indigo-900 text-[8px] font-black px-1.5 py-0.5 rounded uppercase">
                      Ok
                    </div>
                  )}
                </button>
              ))}
            </div>
            <div className="space-y-3">
              <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-2">Ordo Target</p>
              {shuffledTargets.map((val) => {
                const isSelectedByCurrent = selectedMatch ? answer[selectedMatch] === val : false;
                
                return (
                  <button
                    key={val}
                    disabled={isSubmitted || !selectedMatch}
                    onClick={() => {
                      if (selectedMatch) {
                        if (answer[selectedMatch] === val) {
                          // Unset if clicking the same one
                          const newAnswer = { ...answer };
                          delete newAnswer[selectedMatch];
                          setAnswer(newAnswer);
                        } else {
                          setAnswer({ ...answer, [selectedMatch]: val });
                          setSelectedMatch(null);
                        }
                      }
                    }}
                    className={`w-full text-center p-4 rounded-xl border-2 transition-all font-black relative ${
                      isSelectedByCurrent
                        ? 'border-yellow-400 bg-white/40 text-white shadow-[0_0_20px_rgba(250,204,21,0.3)] z-10'
                        : Object.values(answer).includes(val)
                          ? 'border-indigo-400/50 bg-indigo-500/20 text-white/50'
                          : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10 active:scale-95'
                    }`}
                  >
                    {val}
                    {selectedMatch && !isSelectedByCurrent && (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[8px] bg-white text-indigo-600 px-2 py-0.5 rounded-full"
                      >
                        HUBUNGKAN
                      </motion.div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isSubmitted && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            style={{ 
              backgroundColor: isCorrect ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
              borderColor: isCorrect ? 'rgba(74, 222, 128, 1)' : 'rgba(248, 113, 113, 1)'
            }}
            className="mb-8 p-6 rounded-3xl border-2 backdrop-blur-md text-white"
          >
            <div className="flex items-center gap-3 mb-2 font-black text-lg">
              {isCorrect ? <CheckCircle2 className="w-6 h-6 text-green-400" /> : <XCircle className="w-6 h-6 text-red-400" />}
              {isCorrect ? 'Luar Biasa!' : 'Terus Berusaha!'}
            </div>
            <p className="text-sm font-medium opacity-90 leading-relaxed">{question.explanation}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-end">
        {!isSubmitted ? (
          <button
            onClick={handleSubmit}
            disabled={
              !answer || 
              (Array.isArray(answer) && answer.length === 0) ||
              (question.type === QuestionType.DRAG_AND_DROP && Object.keys(answer).length < (question.options?.length || 0))
            }
            className="px-10 py-4 bg-white text-indigo-600 font-black text-lg rounded-2xl hover:scale-105 transition-all shadow-2xl disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Evaluasi
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-10 py-4 bg-white text-purple-600 font-black text-lg rounded-2xl hover:scale-105 transition-all flex items-center gap-3 shadow-2xl"
          >
            Melangkah Maju <ArrowRight className="w-6 h-6" />
          </button>
        )}
      </div>
    </motion.div>
  );
}
