import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BoardState, Move, Player, Position } from '../types';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BoardProps {
  board: BoardState;
  currentPlayer: Player;
  selectedPos: Position | null;
  validMoves: Position[];
  lastMove: Move | null;
  onCellClick: (pos: Position) => void;
  isAiThinking: boolean;
}

const Board: React.FC<BoardProps> = ({
  board,
  currentPlayer,
  selectedPos,
  validMoves,
  lastMove,
  onCellClick,
  isAiThinking
}) => {
  // Grid lines positioned at the center of the 4x4 grid cells
  // 100% / 4 = 25%. Centers at 12.5%, 37.5%, 62.5%, 87.5%
  const positions = ['12.5%', '37.5%', '62.5%', '87.5%'];

  return (
    <div className="relative p-8 bg-[#EBC383] rounded shadow-2xl border-4 border-[#8B4513] select-none w-full max-w-[450px] aspect-square">
      
      {/* Wood Texture */}
      <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] pointer-events-none mix-blend-multiply"></div>

      {/* Main Container for Grid and Pieces */}
      <div className="relative w-full h-full">
        
        {/* Grid Lines (SVG) - "Go" Style */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          
          {/* The Outer Frame (Border of the play area) */}
          <rect 
            x="12.5%" y="12.5%" 
            width="75%" height="75%" 
            fill="none" 
            stroke="#1a1a1a" 
            strokeWidth="2.5"
          />

          {/* Horizontal Lines */}
          {positions.map((pos, i) => (
            <line 
              key={`h-${i}`} 
              x1="12.5%" y1={pos} 
              x2="87.5%" y2={pos} 
              stroke="#1a1a1a" 
              strokeWidth="2" 
            />
          ))}

          {/* Vertical Lines */}
          {positions.map((pos, i) => (
            <line 
              key={`v-${i}`} 
              x1={pos} y1="12.5%" 
              x2={pos} y2="87.5%" 
              stroke="#1a1a1a" 
              strokeWidth="2" 
            />
          ))}

          {/* Optional: Small dots at 4 corners (star points equivalent) purely for aesthetics */}
          {/* Top Left */}
          <circle cx="12.5%" cy="12.5%" r="3" fill="#1a1a1a" />
          {/* Top Right */}
          <circle cx="87.5%" cy="12.5%" r="3" fill="#1a1a1a" />
          {/* Bottom Left */}
          <circle cx="12.5%" cy="87.5%" r="3" fill="#1a1a1a" />
          {/* Bottom Right */}
          <circle cx="87.5%" cy="87.5%" r="3" fill="#1a1a1a" />
        </svg>

        {/* Interactive Layer: 4x4 Grid of Cells centered on the lines */}
        <div className="absolute inset-0 w-full h-full grid grid-cols-4 z-10">
          {board.map((row, rIndex) => (
            row.map((cell, cIndex) => {
              const isSelected = selectedPos?.row === rIndex && selectedPos?.col === cIndex;
              const isValidMove = validMoves.some(m => m.row === rIndex && m.col === cIndex);
              const isLastFrom = lastMove?.from.row === rIndex && lastMove?.from.col === cIndex;
              const isLastTo = lastMove?.to.row === rIndex && lastMove?.to.col === cIndex;
              
              return (
                <div
                  key={`${rIndex}-${cIndex}`}
                  onClick={() => onCellClick({ row: rIndex, col: cIndex })}
                  className="relative flex items-center justify-center cursor-pointer group"
                >
                  {/* Interactive/Hover Highlights */}
                  {/* Valid Move Highlight (Ghost Piece) */}
                  {isValidMove && (
                    <div className="absolute w-8 h-8 rounded-full bg-emerald-500/50 animate-pulse" />
                  )}

                  {/* Selected Highlight (Ring) */}
                  {isSelected && (
                    <div className="absolute w-12 h-12 rounded-full border-4 border-indigo-600 animate-pulse" />
                  )}

                  {/* Last Move Trace (From) */}
                  {isLastFrom && !cell && (
                    <div className="absolute w-3 h-3 rounded-full bg-indigo-900/30" />
                  )}

                  {/* Invisible Hover Target (makes clicking intersection easier) */}
                  <div className="absolute w-12 h-12 rounded-full z-0 group-hover:bg-black/5 transition-colors" />

                  {/* Pieces */}
                  <AnimatePresence mode='popLayout'>
                    {cell && (
                      <motion.div
                        layoutId={`piece-${rIndex}-${cIndex}`}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className={clsx(
                          "absolute w-[65%] h-[65%] rounded-full shadow-lg z-20 flex items-center justify-center",
                          // Realistic piece styling (Go Stone style)
                          cell === 'A' 
                            ? "bg-gradient-to-br from-neutral-800 to-black ring-1 ring-white/10 shadow-black/50" // Black Stone (Player)
                            : "bg-gradient-to-br from-slate-100 to-slate-300 ring-1 ring-black/10 shadow-black/30", // White Stone (AI)
                          isAiThinking && cell === 'B' && "animate-pulse brightness-90"
                        )}
                      >
                        {/* Specular Highlight for 3D effect */}
                        <div className="absolute top-[15%] left-[20%] w-[30%] h-[15%] bg-white/30 rounded-full blur-[1px]" />
                        
                        {/* Optional: Add a subtle colored ring to distinguish player vs AI clearly if stones are too similar */}
                        <div className={clsx(
                          "absolute inset-0 rounded-full border-2 opacity-50",
                          cell === 'A' ? "border-rose-500/0" : "border-sky-500/0" // Kept subtle/invisible for now, can enable if needed
                        )}></div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* Last Move Indicator (Ring around piece) */}
                  {isLastTo && cell && (
                     <motion.div 
                       initial={{ scale: 1.5, opacity: 0 }}
                       animate={{ scale: 1, opacity: 1 }}
                       className="absolute w-[80%] h-[80%] border-2 border-indigo-500/70 rounded-full pointer-events-none" 
                     />
                  )}
                </div>
              );
            })
          ))}
        </div>
      </div>
    </div>
  );
};

export default Board;