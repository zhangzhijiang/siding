import { BOARD_SIZE, BoardState, CellContent, Move, Player, Position } from '../types';

// Initialize board: Player A (User) at bottom, Player B (AI) at top
export const createInitialBoard = (): BoardState => {
  const board: BoardState = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));
  
  // Setup standard arrangement
  // Player B (AI) on top row
  for(let i=0; i<4; i++) board[0][i] = 'B';
  
  // Player A (User) on bottom row
  for(let i=0; i<4; i++) board[3][i] = 'A';
  
  return board;
};

export const isValidPos = (pos: Position): boolean => {
  return pos.row >= 0 && pos.row < BOARD_SIZE && pos.col >= 0 && pos.col < BOARD_SIZE;
};

// Check if a move is valid (orthogonal, 1 step, to empty cell)
export const getValidMoves = (board: BoardState, pos: Position): Position[] => {
  const moves: Position[] = [];
  const piece = board[pos.row][pos.col];
  if (!piece) return [];

  const directions = [
    { r: -1, c: 0 }, // Up
    { r: 1, c: 0 },  // Down
    { r: 0, c: -1 }, // Left
    { r: 0, c: 1 },  // Right
  ];

  for (const dir of directions) {
    const newPos = { row: pos.row + dir.r, col: pos.col + dir.c };
    if (isValidPos(newPos) && board[newPos.row][newPos.col] === null) {
      moves.push(newPos);
    }
  }
  return moves;
};

// Check for captures based on the "SiDing" rule
// Returns the new board and a list of captured positions
export const processMoveAndCaptures = (
  board: BoardState, 
  move: Move, 
  player: Player
): { newBoard: BoardState, captured: Position[] } => {
  // 1. Execute the move
  const newBoard = board.map(row => [...row]);
  newBoard[move.to.row][move.to.col] = player;
  newBoard[move.from.row][move.from.col] = null;

  const capturedPositions: Position[] = [];
  const opponent = player === 'A' ? 'B' : 'A';

  // Helper to check a line (row or column)
  const checkLine = (cells: CellContent[], indices: Position[]) => {
    const piecesCount = cells.filter(c => c !== null).length;
    // Rule: If a row or column contains 4 pieces (full line), no capture occurs.
    if (piecesCount === BOARD_SIZE) return;

    // We scan for pattern: [Player, Player, Opponent] or [Opponent, Player, Player]
    // The "Player" pair must be adjacent. 
    // The "Opponent" must be immediately adjacent to the pair.
    
    // Indices for length 4: 0, 1, 2, 3
    // Possible triplets: (0,1,2) and (1,2,3)
    
    // Check triplet starting at 0: cells[0], cells[1], cells[2]
    if (cells[0] === player && cells[1] === player && cells[2] === opponent) {
      // Capture 2
      newBoard[indices[2].row][indices[2].col] = null;
      capturedPositions.push(indices[2]);
    } else if (cells[0] === opponent && cells[1] === player && cells[2] === player) {
      // Capture 0
      newBoard[indices[0].row][indices[0].col] = null;
      capturedPositions.push(indices[0]);
    }

    // Check triplet starting at 1: cells[1], cells[2], cells[3]
    if (cells[1] === player && cells[2] === player && cells[3] === opponent) {
      // Capture 3
      newBoard[indices[3].row][indices[3].col] = null;
      capturedPositions.push(indices[3]);
    } else if (cells[1] === opponent && cells[2] === player && cells[3] === player) {
      // Capture 1
      newBoard[indices[1].row][indices[1].col] = null;
      capturedPositions.push(indices[1]);
    }
  };

  // Check the ROW of the moved piece
  const rowIndices = Array.from({ length: 4 }, (_, c) => ({ row: move.to.row, col: c }));
  const rowCells = rowIndices.map(p => newBoard[p.row][p.col]);
  checkLine(rowCells, rowIndices);

  // Check the COL of the moved piece
  const colIndices = Array.from({ length: 4 }, (_, r) => ({ row: r, col: move.to.col }));
  const colCells = colIndices.map(p => newBoard[p.row][p.col]);
  checkLine(colCells, colIndices);

  return { newBoard, captured: capturedPositions };
};

export const checkWinCondition = (board: BoardState): Player | null => {
  let countA = 0;
  let countB = 0;

  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c] === 'A') countA++;
      if (board[r][c] === 'B') countB++;
    }
  }

  if (countA < 2) return 'B';
  if (countB < 2) return 'A';
  return null;
};

// --- MINIMAX AI IMPLEMENTATION ---

// Evaluate board state from the perspective of 'player'
const evaluateBoard = (board: BoardState, player: Player): number => {
  const opponent = player === 'A' ? 'B' : 'A';
  
  let playerCount = 0;
  let opponentCount = 0;

  for(let r=0; r<BOARD_SIZE; r++) {
    for(let c=0; c<BOARD_SIZE; c++) {
      if (board[r][c] === player) playerCount++;
      else if (board[r][c] === opponent) opponentCount++;
    }
  }

  // Win/Loss conditions
  if (opponentCount < 2) return 10000; // Win
  if (playerCount < 2) return -10000; // Loss

  // Score based primarily on piece count difference
  // (Scale up significantly so other factors are tie-breakers)
  let score = (playerCount - opponentCount) * 100;

  // Secondary factors:
  // Random noise to prevent identical gameplay loops
  score += Math.random() * 2;

  return score;
};

const minimax = (
  board: BoardState, 
  depth: number, 
  isMaximizing: boolean, 
  alpha: number, 
  beta: number,
  aiPlayer: Player
): number => {
  const winner = checkWinCondition(board);
  if (winner === aiPlayer) return 10000 + depth; // Win faster
  if (winner && winner !== aiPlayer) return -10000 - depth; // Lose slower

  if (depth === 0) {
    return evaluateBoard(board, aiPlayer);
  }

  const currentPlayer = isMaximizing ? aiPlayer : (aiPlayer === 'A' ? 'B' : 'A');
  
  // Generate Moves
  const moves: { move: Move, nextBoard: BoardState }[] = [];
  for(let r=0; r<BOARD_SIZE; r++) {
    for(let c=0; c<BOARD_SIZE; c++) {
      if (board[r][c] === currentPlayer) {
        const validNextPos = getValidMoves(board, {row: r, col: c});
        for(const to of validNextPos) {
          const move = { from: {row: r, col: c}, to };
          const { newBoard } = processMoveAndCaptures(board, move, currentPlayer);
          moves.push({ move, nextBoard: newBoard });
        }
      }
    }
  }

  if (moves.length === 0) {
    return evaluateBoard(board, aiPlayer); // No moves available
  }

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const { nextBoard } of moves) {
      const evalScore = minimax(nextBoard, depth - 1, false, alpha, beta, aiPlayer);
      maxEval = Math.max(maxEval, evalScore);
      alpha = Math.max(alpha, evalScore);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const { nextBoard } of moves) {
      const evalScore = minimax(nextBoard, depth - 1, true, alpha, beta, aiPlayer);
      minEval = Math.min(minEval, evalScore);
      beta = Math.min(beta, evalScore);
      if (beta <= alpha) break;
    }
    return minEval;
  }
};

export const getBestAIMove = (board: BoardState, aiPlayer: Player): Move | null => {
  // Search Depth: 4 allows reasonable lookahead (2 moves for AI, 2 for player) without lag
  const SEARCH_DEPTH = 4;
  
  const allMoves: { move: Move, nextBoard: BoardState }[] = [];
  
  // 1. Generate all AI moves
  for(let r=0; r<BOARD_SIZE; r++) {
    for(let c=0; c<BOARD_SIZE; c++) {
      if (board[r][c] === aiPlayer) {
        const validNextPos = getValidMoves(board, {row: r, col: c});
        for(const to of validNextPos) {
          const move = { from: {row: r, col: c}, to };
          const { newBoard } = processMoveAndCaptures(board, move, aiPlayer);
          allMoves.push({ move, nextBoard: newBoard });
        }
      }
    }
  }

  if (allMoves.length === 0) return null;

  let bestMove: Move | null = null;
  let maxEval = -Infinity;

  // 2. Evaluate each move using Minimax
  for (const { move, nextBoard } of allMoves) {
    // Optimization: If move wins immediately, take it.
    if (checkWinCondition(nextBoard) === aiPlayer) return move;

    const evalScore = minimax(nextBoard, SEARCH_DEPTH - 1, false, -Infinity, Infinity, aiPlayer);
    
    if (evalScore > maxEval) {
      maxEval = evalScore;
      bestMove = move;
    }
  }

  return bestMove;
};