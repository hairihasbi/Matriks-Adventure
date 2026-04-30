import { motion, AnimatePresence } from 'motion/react';
import { Bot, MessageSquare } from 'lucide-react';

interface GuideCharacterProps {
  message: string;
  isVisible: boolean;
}

export default function GuideCharacter({ message, isVisible }: GuideCharacterProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 100, y: 100 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="fixed bottom-24 right-8 z-[60] flex items-end gap-4 pointer-events-none"
        >
          {/* Speech Bubble */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderColor: 'rgba(255, 255, 255, 0.4)'
            }}
            className="backdrop-blur-md p-4 rounded-2xl rounded-br-none shadow-2xl border max-w-xs relative mb-8"
          >
            <p className="text-slate-800 font-bold text-sm leading-relaxed">
              {message}
            </p>
            <div className="absolute -bottom-2 right-0 w-4 h-4 bg-white transform rotate-45 border-r border-b border-white/40" />
          </motion.div>

          {/* Character Icon */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl border-2 border-white/50 relative overflow-hidden group"
          >
            <Bot className="w-10 h-10 text-white" />
            <motion.div 
              className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"
            />
            <div className="absolute -top-1 -left-1 w-4 h-4 bg-yellow-400 rounded-full animate-pulse" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
