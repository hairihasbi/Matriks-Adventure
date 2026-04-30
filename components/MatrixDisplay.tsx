import React, { memo } from 'react';
import { motion } from 'motion/react';

interface MatrixDisplayProps {
  data: (number | string)[][] | (number | string)[];
  title?: string;
}

const MatrixDisplay = memo(({ data, title }: MatrixDisplayProps) => {
  // Normalize to 2D array
  const matrix = Array.isArray(data[0]) ? (data as (number | string)[][]) : [(data as (number | string)[])];
  const isDiagonalType = title?.toLowerCase().includes('diagonal') || title?.toLowerCase().includes('identitas');
  const rows = matrix.length;
  const cols = matrix[0].length;
  const isSquare = rows === cols;

  return (
    <div className="flex flex-col items-center my-4 relative">
      {title && <span className="text-xs font-black mb-3 text-white/40 uppercase tracking-widest">{title}</span>}
      <div className="relative inline-flex items-center p-6">
        {/* Decorative glass brackets */}
        <div className="absolute left-0 top-0 bottom-0 w-4 border-l-[6px] border-t-[6px] border-b-[6px] border-white/20 rounded-l-[1rem]" />
        
        <div className="grid gap-4 px-6 relative" style={{ 
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` 
        }}>
          {isDiagonalType && isSquare && (
            <motion.div 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: '100%', opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              style={{ 
                backgroundColor: 'rgba(250, 204, 21, 0.4)',
                transform: `rotate(${Math.atan2(rows, cols) * (180 / Math.PI)}deg)` 
              }}
              className="absolute top-1/2 left-0 h-1 blur-sm rounded-full origin-center scale-[1.2] -z-10"
            />
          )}
          {matrix.flat().map((item, idx) => {
            const r = Math.floor(idx / cols);
            const c = idx % cols;
            const isDiagonalElement = r === c;

            return (
              <motion.div
                key={idx}
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: idx * 0.05, type: 'spring' }}
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.4)' }}
                className={`flex items-center justify-center w-14 h-14 backdrop-blur-md border rounded-2xl shadow-xl font-mono font-black text-xl transition-all ${
                  isDiagonalType && isDiagonalElement
                    ? 'bg-yellow-400/30 border-yellow-400/50 text-white shadow-yellow-500/20'
                    : 'bg-white/10 border-white/20 text-white/90'
                }`}
              >
                {item}
              </motion.div>
            );
          })}
        </div>

        <div className="absolute right-0 top-0 bottom-0 w-4 border-r-[6px] border-t-[6px] border-b-[6px] border-white/20 rounded-r-[1rem]" />
      </div>
      
      {/* Background glow for matrix */}
      <div className="absolute inset-0 bg-indigo-500/10 blur-3xl -z-10 rounded-full" />
    </div>
  );
});

export default MatrixDisplay;
