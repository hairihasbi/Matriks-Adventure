import { motion } from 'motion/react';
import { MapPin, Lock, CheckCircle2, Play } from 'lucide-react';
import { SubTopic, Stage } from '../types.ts';

interface MapViewProps {
  stage: Stage;
  currentSubTopicIndex: number;
  completedSubTopics: string[];
  isQuizActive: boolean;
  onNodeClick: (index: number) => void;
  onQuizClick: () => void;
}

export default function MapView({ 
  stage, 
  currentSubTopicIndex, 
  completedSubTopics, 
  isQuizActive,
  onNodeClick,
  onQuizClick 
}: MapViewProps) {
  
  // Define relative positions for nodes to create a winding path
  const nodes = stage.subTopics.map((topic, i) => ({
    ...topic,
    x: 20 + (i % 2 === 0 ? 0 : 50), // Zig-zag pattern
    y: 15 + i * 25,
    type: 'lesson'
  }));

  // Add the quiz node at the end
  const quizNode = {
    id: 'quiz-node',
    title: 'Gerbang Tantangan',
    x: 45,
    y: nodes.length * 25 + 15,
    type: 'quiz'
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto h-[450px] md:h-[600px] bg-white/5 backdrop-blur-md rounded-[2rem] md:rounded-[3rem] border border-white/20 p-4 md:p-8 overflow-y-auto overflow-x-hidden scrollbar-hide shadow-inner">
      {/* The Winding Path (SVG) */}
      <svg className="absolute inset-0 w-full h-[700px] md:h-[800px] pointer-events-none opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path
          d={`M ${nodes[0].x} ${nodes[0].y} ${nodes.map((n, i) => i > 0 ? `L ${n.x} ${n.y}` : '').join(' ')} L ${quizNode.x} ${quizNode.y}`}
          fill="none"
          stroke="white"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray="10 15"
          className="animate-[dash_15s_linear_infinite]"
        />
      </svg>

      <div className="relative z-10 w-full min-h-[600px] md:min-h-[700px]">
        {nodes.map((node, i) => {
          const isCompleted = completedSubTopics.includes(node.id);
          const isActive = currentSubTopicIndex === i && !isQuizActive;
          const isLocked = i > 0 && !completedSubTopics.includes(nodes[i-1].id);

          return (
            <motion.div
              key={node.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
            >
              <button
                disabled={isLocked}
                onClick={() => onNodeClick(i)}
                className={`w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center border-2 transition-all duration-300 relative ${
                  isActive 
                    ? 'bg-white border-white scale-110 md:scale-125 shadow-[0_0_20px_rgba(255,255,255,0.4)] z-20' 
                    : isCompleted
                      ? 'bg-green-400 border-green-200'
                      : isLocked
                        ? 'bg-white/10 border-white/10 opacity-50 grayscale'
                        : 'bg-indigo-500 border-white/30'
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="active-indicator"
                    className="absolute -top-10 md:-top-12 flex flex-col items-center"
                  >
                    <div className="bg-white text-indigo-600 text-[8px] md:text-[10px] font-black px-2 py-0.5 rounded-md mb-1 shadow-lg whitespace-nowrap">
                      AKU DI SINI!
                    </div>
                    <div className="w-2 h-2 bg-white rotate-45" />
                  </motion.div>
                )}
                
                {isLocked ? <Lock className="w-5 h-5 md:w-6 md:h-6 text-white/30" /> : isCompleted ? <CheckCircle2 className="w-6 h-6 md:w-8 md:h-8 text-white" /> : <Play className={`w-6 h-6 md:w-8 md:h-8 ${isActive ? 'text-indigo-600' : 'text-white'}`} />}
              </button>
              
              <div className="absolute top-full mt-2 md:mt-3 left-1/2 transform -translate-x-1/2 text-center whitespace-nowrap px-2">
                <span className={`text-[8px] md:text-[10px] font-black tracking-widest uppercase ${isActive ? 'text-white' : 'text-white/40'}`}>
                  {node.title}
                </span>
              </div>
            </motion.div>
          );
        })}

        {/* Quiz Node */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: nodes.length * 0.1 }}
          style={{ left: `${quizNode.x}%`, top: `${quizNode.y}%` }}
          className="absolute transform -translate-x-1/2 -translate-y-1/2"
        >
          <button
            disabled={completedSubTopics.length < nodes.length}
            onClick={onQuizClick}
            className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-[2rem] flex items-center justify-center border-4 border-dashed transition-all duration-300 ${
              isQuizActive
                ? 'bg-purple-500 border-white scale-110 md:scale-125 shadow-[0_0_30px_rgba(168,85,247,0.5)]'
                : completedSubTopics.length === nodes.length
                  ? 'bg-purple-600 border-purple-300 animate-pulse'
                  : 'bg-white/5 border-white/20'
            }`}
          >
            {isQuizActive && (
               <motion.div 
                 layoutId="active-indicator"
                 className="absolute -top-10 md:-top-12 flex flex-col items-center"
               >
                 <div className="bg-white text-purple-600 text-[8px] md:text-[10px] font-black px-2 py-0.5 rounded-md mb-1 shadow-lg">SIAP?</div>
                 <div className="w-2 h-2 bg-white rotate-45" />
               </motion.div>
            )}
            <MapPin className={`w-8 h-8 md:w-10 md:h-10 ${completedSubTopics.length === nodes.length ? 'text-white' : 'text-white/20'}`} />
          </button>
          <div className="absolute top-full mt-3 md:mt-4 left-1/2 transform -translate-x-1/2 text-center">
            <span className={`text-[9px] md:text-xs font-black tracking-[0.2em] uppercase ${isQuizActive ? 'text-purple-300' : 'text-white/30'}`}>
              GERBANG QUIZ
            </span>
          </div>
        </motion.div>
      </div>
      
      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -100;
          }
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
