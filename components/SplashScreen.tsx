import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface SplashScreenProps {
  /** Called once the splash animation has finished and the game should be shown. */
  onFinish: () => void;
  /** How long (ms) the splash stays before auto-dismissing. Default 2600ms. */
  duration?: number;
}

// The four "stones" that dance in around the title — two black (player),
// two white (AI) — echoing the 4x4 board and the game's name (四顶 / "Four Tops").
const STONES: { color: 'black' | 'white'; x: number; y: number }[] = [
  { color: 'black', x: -1, y: -1 },
  { color: 'white', x: 1, y: -1 },
  { color: 'white', x: -1, y: 1 },
  { color: 'black', x: 1, y: 1 },
];

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish, duration = 2600 }) => {
  // Auto-dismiss after the animation has had time to play. Users can also tap to skip.
  useEffect(() => {
    const timer = setTimeout(onFinish, duration);
    return () => clearTimeout(timer);
  }, [onFinish, duration]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-900 overflow-hidden cursor-pointer select-none"
      onClick={onFinish}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5, ease: 'easeInOut' } }}
    >
      {/* Ambient background glow — matches the in-game backdrop */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute -top-40 -left-40 w-96 h-96 bg-purple-900/30 rounded-full blur-3xl"
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-900/30 rounded-full blur-3xl"
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.5, 0.3, 0.5] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Stones arranged in a 2x2, each dropping in with a bounce then gently floating */}
      <div className="relative w-40 h-40 sm:w-48 sm:h-48 mb-6">
        {/* Faint board frame drawn behind the stones */}
        <motion.div
          className="absolute inset-4 border-2 border-amber-200/20 rounded-md"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        />
        {STONES.map((stone, i) => {
          const gap = 44; // px offset from centre for each quadrant
          return (
            <motion.div
              key={i}
              className="absolute top-1/2 left-1/2 w-14 h-14 sm:w-16 sm:h-16 -ml-7 -mt-7 sm:-ml-8 sm:-mt-8"
              initial={{
                x: stone.x * gap,
                y: stone.y * gap - 120,
                scale: 0,
                opacity: 0,
                rotate: -180,
              }}
              animate={{
                x: stone.x * gap,
                y: [stone.y * gap - 120, stone.y * gap, stone.y * gap - 6, stone.y * gap],
                scale: 1,
                opacity: 1,
                rotate: 0,
              }}
              transition={{
                delay: 0.15 + i * 0.15,
                duration: 0.8,
                type: 'spring',
                stiffness: 260,
                damping: 18,
              }}
            >
              <motion.div
                className={
                  stone.color === 'black'
                    ? 'w-full h-full rounded-full bg-gradient-to-br from-neutral-800 to-black ring-1 ring-white/10 shadow-lg shadow-black/50 relative'
                    : 'w-full h-full rounded-full bg-gradient-to-br from-slate-100 to-slate-300 ring-1 ring-black/10 shadow-lg shadow-black/30 relative'
                }
                animate={{ y: [0, -5, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 0.9 + i * 0.15,
                }}
              >
                {/* Specular highlight for the 3D stone look */}
                <div className="absolute top-[15%] left-[20%] w-[30%] h-[15%] bg-white/40 rounded-full blur-[1px]" />
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Title */}
      <motion.h1
        className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300 tracking-tight z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
      >
        SiDing <span className="text-slate-400 text-2xl sm:text-3xl font-normal ml-1">四顶</span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        className="text-slate-400 text-sm sm:text-base mt-2 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        Strategic 4×4 Board Game
      </motion.p>

      {/* Loading dots */}
      <motion.div
        className="flex gap-1.5 mt-8 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-2 h-2 rounded-full bg-indigo-400"
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};

export default SplashScreen;
