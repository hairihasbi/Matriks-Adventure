import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, X, RefreshCw } from 'lucide-react';
import MatrixDisplay from './MatrixDisplay.tsx';
import { Info, HelpCircle, Bot, Loader2 } from 'lucide-react';
import { explainLabOperation } from '../services/geminiService';

interface MatrixLabProps {
  onExperimentPerformed?: () => void;
}

const MatrixLab: React.FC<MatrixLabProps> = ({ onExperimentPerformed }) => {
  const [matrixA, setMatrixA] = useState<number[][]>([[1, 2], [3, 4]]);
  const [matrixB, setMatrixB] = useState<number[][]>([[5, 6], [7, 8]]);
  const [scalar, setScalar] = useState<number>(2);
  const [operation, setOperation] = useState<'add' | 'sub' | 'mul' | 'scalar' | 'transpose' | 'det' | 'cramer' | 'inverse'>('add');
  const [showSteps, setShowSteps] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const performExperiment = () => {
    if (onExperimentPerformed) onExperimentPerformed();
  };

  const calculateDeterminant = (m: number[][]): number | null => {
    if (m.length === 2 && m[0].length === 2) {
      return (m[0][0] * m[1][1]) - (m[0][1] * m[1][0]);
    }
    if (m.length === 3 && m[0].length === 3) {
      // Aturan Sarrus
      const a = m[0][0], b = m[0][1], c = m[0][2];
      const d = m[1][0], e = m[1][1], f = m[1][2];
      const g = m[2][0], h = m[2][1], i = m[2][2];
      return (a * e * i + b * f * g + c * d * h) - (c * e * g + a * f * h + b * d * i);
    }
    return null;
  };

  const calculateInverse = (m: number[][]): number[][] | null => {
    const det = calculateDeterminant(m);
    if (det === null || det === 0) return null;

    if (m.length === 2) {
      const a = m[0][0], b = m[0][1], c = m[1][0], d = m[1][1];
      return [
        [d / det, -b / det],
        [-c / det, a / det]
      ].map(row => row.map(val => Number(val.toFixed(2))));
    }

    if (m.length === 3) {
      const getMinor = (row: number, col: number) => {
        const sub = m
          .filter((_, i) => i !== row)
          .map(r => r.filter((_, j) => j !== col));
        return calculateDeterminant(sub);
      };

      const adjoint: number[][] = [];
      for (let i = 0; i < 3; i++) {
        adjoint[i] = [];
        for (let j = 0; j < 3; j++) {
          // Kofaktor = (-1)^(i+j) * Minor
          const sign = (i + j) % 2 === 0 ? 1 : -1;
          adjoint[i][j] = sign * getMinor(i, j)!;
        }
      }

      // Transpose Adjoint
      const result: number[][] = [];
      for (let i = 0; i < 3; i++) {
        result[i] = [];
        for (let j = 0; j < 3; j++) {
          result[i][j] = Number((adjoint[j][i] / det).toFixed(2));
        }
      }
      return result;
    }

    return null;
  };

  const updateMatrix = (matrix: 'A' | 'B', row: number, col: number, val: string) => {
    performExperiment();
    const num = val === '' ? 0 : parseInt(val);
    if (isNaN(num)) return;

    if (matrix === 'A') {
      const newMat = [...matrixA.map(r => [...r])];
      newMat[row][col] = num;
      setMatrixA(newMat);
    } else {
      const newMat = [...matrixB.map(r => [...r])];
      newMat[row][col] = num;
      setMatrixB(newMat);
    }
  };

  const setDimensions = (rows: number, cols: number) => {
    const newMat = Array(rows).fill(0).map(() => Array(cols).fill(0));
    setMatrixA(newMat);
    setMatrixB(newMat);
  };

  const handleAskSensei = async () => {
    setIsAiLoading(true);
    const explanation = await explainLabOperation(operation, matrixA, matrixB);
    setAiExplanation(explanation);
    setIsAiLoading(false);
  };

  const calculateResult = () => {
    try {
      switch (operation) {
        case 'add':
          return matrixA.map((row, i) => row.map((val, j) => val + matrixB[i][j]));
        case 'sub':
          return matrixA.map((row, i) => row.map((val, j) => val - matrixB[i][j]));
        case 'transpose':
          const result: number[][] = [];
          for (let j = 0; j < matrixA[0].length; j++) {
            result[j] = [];
            for (let i = 0; i < matrixA.length; i++) {
              result[j][i] = matrixA[i][j];
            }
          }
          return result;
        case 'scalar':
          return matrixA.map(row => row.map(val => val * scalar));
        case 'mul':
          if (matrixA[0].length !== matrixB.length) return null;
          const mulResult = Array(matrixA.length).fill(0).map(() => Array(matrixB[0].length).fill(0));
          for (let i = 0; i < matrixA.length; i++) {
            for (let j = 0; j < matrixB[0].length; j++) {
              for (let k = 0; k < matrixA[0].length; k++) {
                mulResult[i][j] += matrixA[i][k] * matrixB[k][j];
              }
            }
          }
          return mulResult;
        case 'det':
          const d = calculateDeterminant(matrixA);
          return d !== null ? [[d]] : null;
        case 'cramer':
          if (matrixA.length !== matrixA[0].length || matrixA.length !== matrixB.length) return null;
          const D = calculateDeterminant(matrixA);
          if (D === 0 || D === null) return null;
          const solutions: number[] = [];
          for (let col = 0; col < matrixA[0].length; col++) {
            const tempMat = matrixA.map((row, i) => {
              const newRow = [...row];
              newRow[col] = matrixB[i][0];
              return newRow;
            });
            const Di = calculateDeterminant(tempMat);
            if (Di === null) return null;
            solutions.push(Di / D);
          }
          return [solutions];
        case 'inverse':
          return calculateInverse(matrixA);
        default:
          return null;
      }
    } catch (e) {
      return null;
    }
  };

  const getSteps = () => {
    const steps: string[] = [];
    if (operation === 'add') {
      matrixA.forEach((row, i) => row.forEach((val, j) => {
        steps.push(`Elemen [${i+1},${j+1}]: ${val} + ${matrixB[i][j]} = ${val + matrixB[i][j]}`);
      }));
    } else if (operation === 'sub') {
      matrixA.forEach((row, i) => row.forEach((val, j) => {
        steps.push(`Elemen [${i+1},${j+1}]: ${val} - ${matrixB[i][j]} = ${val - matrixB[i][j]}`);
      }));
    } else if (operation === 'scalar') {
      matrixA.forEach((row, i) => row.forEach((val, j) => {
        steps.push(`Elemen [${i+1},${j+1}]: ${scalar} × ${val} = ${scalar * val}`);
      }));
    } else if (operation === 'mul') {
      if (matrixA[0].length !== matrixB.length) return ["Ordo Tidak Cocok: Kolom A harus sama dengan Baris B"];
      for (let i = 0; i < matrixA.length; i++) {
        for (let j = 0; j < matrixB[0].length; j++) {
          let calcStr = `Elemen [${i+1},${j+1}]: `;
          let sum = 0;
          for (let k = 0; k < matrixA[0].length; k++) {
            const part = matrixA[i][k] * matrixB[k][j];
            sum += part;
            calcStr += `(${matrixA[i][k]} × ${matrixB[k][j]}) ${k < matrixA[0].length - 1 ? '+ ' : ''}`;
          }
          steps.push(`${calcStr}= ${sum}`);
        }
      }
    } else if (operation === 'transpose') {
      matrixA.forEach((row, i) => row.forEach((val, j) => {
        steps.push(`Elemen [${i+1},${j+1}] di A menjadi Elemen [${j+1},${i+1}] di Aᵀ`);
      }));
    } else if (operation === 'det') {
      if (matrixA.length === 2 && matrixA[0].length === 2) {
        steps.push(`det(A) = (a*d) - (b*c)`);
        steps.push(`det(A) = (${matrixA[0][0]}*${matrixA[1][1]}) - (${matrixA[0][1]}*${matrixA[1][0]})`);
        steps.push(`Hasil = ${calculateDeterminant(matrixA)}`);
      } else if (matrixA.length === 3 && matrixA[0].length === 3) {
        steps.push(`Metode Sarrus (Diagonal):`);
        const a=matrixA[0][0], b=matrixA[0][1], c=matrixA[0][2];
        const d=matrixA[1][0], e=matrixA[1][1], f=matrixA[1][2];
        const g=matrixA[2][0], h=matrixA[2][1], i=matrixA[2][2];
        steps.push(`(+) (${a}*${e}*${i}) + (${b}*${f}*${g}) + (${c}*${d}*${h}) = ${a*e*i + b*f*g + c*d*h}`);
        steps.push(`(-) (${c}*${e}*${g}) + (${a}*${f}*${h}) + (${b}*${d}*${i}) = ${c*e*g + a*f*h + b*d*i}`);
        steps.push(`Hasil = ${calculateDeterminant(matrixA)}`);
      }
    } else if (operation === 'cramer') {
      const D = calculateDeterminant(matrixA);
      steps.push(`Langkah 1: Determinan Utama (D) = ${D}`);
      if (D === 0) steps.push(`D=0: Tidak ada solusi unik!`);
      else {
        matrixA[0].forEach((_, idx) => {
          const tempMat = matrixA.map((row, i) => {
            const newRow = [...row];
            newRow[idx] = matrixB[i][0];
            return newRow;
          });
          const Di = calculateDeterminant(tempMat);
          steps.push(`Langkah ${idx+2}: D${idx+1} = ${Di} -> Variabel ${idx===0?'x':idx===1?'y':'z'} = ${Di}/${D} = ${Di!/D!}`);
        });
      }
    } else if (operation === 'inverse') {
      const det = calculateDeterminant(matrixA);
      steps.push(`Langkah 1: Cek Determinan det(A) = ${det}`);
      if (det === 0) {
        steps.push(`det(A) = 0: Matriks Singular (Tidak punya invers)`);
      } else {
        if (matrixA.length === 2) {
          steps.push(`Langkah 2: Gunakan Rumus 1/det * Adjoint`);
          steps.push(`A⁻¹ = (1/${det}) * [[${matrixA[1][1]}, ${-matrixA[0][1]}], [${-matrixA[1][0]}, ${matrixA[0][0]}]]`);
        } else if (matrixA.length === 3) {
          steps.push(`Langkah 2: Cari Matriks Kofaktor`);
          steps.push(`Langkah 3: Transpose Kofaktor (Adjoint)`);
          steps.push(`Langkah 4: Kalikan Adjoint dengan 1/det`);
        }
      }
    }
    return steps;
  };

  const steps = getSteps();
  const result = calculateResult();

  const InputMatrix = ({ title, data, onUpdate }: { title: string, data: number[][], onUpdate: (r: number, c: number, v: string) => void }) => (
    <div className="bg-white/5 p-4 md:p-6 rounded-3xl border border-white/10 backdrop-blur-md">
      <h4 className="text-white/60 text-xs font-black uppercase tracking-widest mb-4">{title}</h4>
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${data[0].length}, minmax(0, 1fr))` }}>
        {data.map((row, i) => row.map((val, j) => (
          <input
            key={`${i}-${j}`}
            type="number"
            value={val}
            onChange={(e) => onUpdate(i, j, e.target.value)}
            className="w-full h-12 md:h-16 bg-white/10 border border-white/20 rounded-xl text-white text-center font-black focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-lg"
          />
        )))}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-10 relative">
        <div className="absolute -top-16 right-0 hidden lg:flex flex-col items-center gap-2">
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, type: "spring" }}
                className="relative group"
            >
                {/* Speech Bubble */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="absolute -top-12 -left-32 bg-white text-indigo-900 px-4 py-2 rounded-2xl text-[10px] font-black shadow-xl border border-indigo-100 w-40 leading-tight z-20 pointer-events-none"
                >
                    Selamat datang di Lab! Mau coba eksperimen matriks apa hari ini?
                </motion.div>

                <div className="w-32 h-32 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-[2.5rem] flex items-center justify-center border-2 border-white/20 backdrop-blur-md relative overflow-hidden group-hover:border-indigo-400 transition-colors">
                    <img 
                        src="https://cdn-icons-png.flaticon.com/512/3774/3774299.png" 
                        alt="Lab Doctor" 
                        className="w-[85%] h-[85%] object-contain relative z-10 drop-shadow-lg"
                        referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/10 to-transparent" />
                </div>
                
                <div className="absolute -bottom-2 right-4 bg-emerald-500 px-3 py-1 rounded-full border-2 border-slate-900 shadow-xl z-20 flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    <span className="text-[8px] text-white font-black uppercase tracking-widest">Online</span>
                </div>
            </motion.div>
        </div>

        <h2 className="text-4xl md:text-5xl font-black text-white mb-2 italic tracking-tighter">MATRIX <span className="text-indigo-400">LAB</span></h2>
        <p className="text-white/50 font-bold uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-2">
            <span className="w-8 h-[1px] bg-white/20" />
            Eksperimen Operasi Matriks Real-time
            <span className="w-8 h-[1px] bg-white/20" />
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {[
          { id: '2x2', r: 2, c: 2 },
          { id: '3x3', r: 3, c: 3 },
          { id: '1x2', r: 1, c: 2 },
          { id: '2x1', r: 2, c: 1 },
          { id: '3x1', r: 3, c: 1 }
        ].map(dim => (
          <button
            key={dim.id}
            onClick={() => setDimensions(dim.r, dim.c)}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white font-black text-xs transition-all border border-white/10 active:scale-95"
          >
            {dim.id}
          </button>
        ))}
        <div className="w-[1px] h-8 bg-white/10 mx-2" />
        <button
          onClick={() => { setMatrixA(matrixA.map(r => r.fill(0))); setMatrixB(matrixB.map(r => r.fill(0))); }}
          className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-xl text-red-300 font-black text-xs transition-all border border-red-500/30 flex items-center gap-2"
        >
          <RefreshCw className="w-3 h-3" /> Reset
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="space-y-6">
          <InputMatrix title="Matriks A" data={matrixA} onUpdate={(r, c, v) => updateMatrix('A', r, c, v)} />
          
          <div className="bg-indigo-600/20 p-6 rounded-3xl border border-indigo-500/30">
            <h4 className="text-indigo-300 text-xs font-black uppercase tracking-widest mb-4">Pilih Operasi</h4>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => setOperation('add')}
                className={`py-3 rounded-xl flex items-center justify-center gap-2 font-black text-sm transition-all ${operation === 'add' ? 'bg-indigo-500 text-white shadow-lg' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}
              >
                <Plus className="w-4 h-4" /> Tambah
              </button>
              <button 
                onClick={() => setOperation('sub')}
                className={`py-3 rounded-xl flex items-center justify-center gap-2 font-black text-sm transition-all ${operation === 'sub' ? 'bg-indigo-500 text-white shadow-lg' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}
              >
                <Minus className="w-4 h-4" /> Kurang
              </button>
              <button 
                onClick={() => setOperation('scalar')}
                className={`py-3 rounded-xl flex items-center justify-center gap-2 font-black text-sm transition-all ${operation === 'scalar' ? 'bg-indigo-500 text-white shadow-lg' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}
              >
                <X className="w-4 h-4" /> Skalar
              </button>
              <button 
                onClick={() => setOperation('mul')}
                className={`py-3 rounded-xl flex items-center justify-center gap-2 font-black text-sm transition-all ${operation === 'mul' ? 'bg-indigo-500 text-white shadow-lg' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}
              >
                <X className="w-4 h-4" /> Kali
              </button>
              <button 
                onClick={() => setOperation('transpose')}
                className={`py-3 rounded-xl flex items-center justify-center gap-2 font-black text-sm transition-all ${operation === 'transpose' ? 'bg-indigo-500 text-white shadow-lg' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}
              >
                <RefreshCw className="w-4 h-4" /> Transpose (A)
              </button>
              <button 
                onClick={() => setOperation('det')}
                className={`py-3 rounded-xl flex items-center justify-center gap-2 font-black text-sm transition-all ${operation === 'det' ? 'bg-indigo-500 text-white shadow-lg' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}
              >
                <HelpCircle className="w-4 h-4" /> Det (A)
              </button>
              <button 
                onClick={() => setOperation('cramer')}
                className={`py-3 rounded-xl flex items-center justify-center gap-2 font-black text-sm transition-all ${operation === 'cramer' ? 'bg-indigo-500 text-white shadow-lg' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}
              >
                <Bot className="w-4 h-4" /> Cramer (SPL)
              </button>
              <button 
                onClick={() => setOperation('inverse')}
                className={`py-3 rounded-xl flex items-center justify-center gap-2 font-black text-sm transition-all ${operation === 'inverse' ? 'bg-indigo-500 text-white shadow-lg' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}
              >
                <Plus className="w-4 h-4 rotate-45" /> Inverse (A)
              </button>
            </div>

            {operation === 'scalar' && (
              <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/10">
                <label className="text-[10px] text-white/40 font-black uppercase tracking-widest block mb-2">Nilai Skalar (k)</label>
                <input 
                  type="number"
                  value={scalar}
                  onChange={(e) => setScalar(parseInt(e.target.value) || 0)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg py-2 text-center text-white font-black"
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-center py-10 lg:py-0">
          <div className="flex flex-col items-center gap-4">
            <div className="p-6 bg-white/10 rounded-full border border-white/20 shadow-2xl animate-pulse">
              {operation === 'add' && <Plus className="w-10 h-10 text-white" />}
              {operation === 'sub' && <Minus className="w-10 h-10 text-white" />}
              {operation === 'mul' && <X className="w-10 h-10 text-white" />}
              {operation === 'scalar' && <X className="w-10 h-10 text-white" />}
              {operation === 'transpose' && <RefreshCw className="w-10 h-10 text-white" />}
              {operation === 'det' && <HelpCircle className="w-10 h-10 text-white" />}
              {operation === 'cramer' && <Bot className="w-10 h-10 text-white" />}
              {operation === 'inverse' && <RefreshCw className="w-10 h-10 text-white rotate-180" />}
            </div>
            <div className="w-1 h-20 bg-gradient-to-b from-white/20 to-transparent" />
          </div>
        </div>

        <div className="space-y-6">
          {(['add', 'sub', 'mul'].includes(operation) || (operation === 'cramer')) && (
            <InputMatrix title={operation === 'cramer' ? "Konstanta Hasil (B)" : "Matriks B"} data={matrixB} onUpdate={(r, c, v) => updateMatrix('B', r, c, v)} />
          )}

          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-3xl border border-white/30 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]">
            <h4 className="text-white/60 text-xs font-black uppercase tracking-widest mb-6 text-center">Hasil Kalkulasi</h4>
            {result ? (
              <div className="space-y-6">
                <div className="flex justify-center">
                  <MatrixDisplay data={result} />
                </div>
                
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={() => { setShowSteps(!showSteps); performExperiment(); }}
                    className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 text-white font-black text-xs flex items-center justify-center gap-2 transition-all"
                  >
                    <Info className="w-4 h-4" /> {showSteps ? 'Sembunyikan Cara Kerja' : 'Lihat Cara Kerja'}
                  </button>

                  <button 
                    onClick={handleAskSensei}
                    disabled={isAiLoading}
                    className="w-full py-3 bg-yellow-400 text-indigo-900 rounded-xl font-black text-xs flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                  >
                    {isAiLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                    Tanya Sensei Matriks
                  </button>
                </div>

                <AnimatePresence>
                  {aiExplanation && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white/10 p-4 rounded-2xl border border-white/20 relative"
                    >
                      <button 
                        onClick={() => setAiExplanation(null)}
                        className="absolute top-2 right-2 text-white/50 hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <div className="flex gap-3">
                        <div className="w-8 h-8 bg-indigo-500 rounded-lg flex-shrink-0 flex items-center justify-center">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div className="text-[11px] text-white leading-relaxed font-medium italic">
                          {aiExplanation}
                        </div>
                      </div>
                    </motion.div>
                  )}
                  {showSteps && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-black/20 rounded-xl p-4 space-y-2 border border-white/5">
                        {steps.map((step, idx) => (
                          <p key={idx} className="text-[11px] text-indigo-100 font-mono italic opacity-80 border-b border-white/5 last:border-0 pb-1">
                            {step}
                          </p>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-white/50 text-sm font-medium italic">Matematika Tidak Valid.<br/>Cek ordo matriks Anda!</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default MatrixLab;
