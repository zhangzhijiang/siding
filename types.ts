export type Player = 'A' | 'B'; // A = Player, B = AI/Opponent
export type CellContent = Player | null;
export type BoardState = CellContent[][];

export interface Position {
  row: number;
  col: number;
}

export interface Move {
  from: Position;
  to: Position;
}

export interface GameState {
  board: BoardState;
  currentPlayer: Player;
  selectedPos: Position | null;
  validMoves: Position[]; // Valid destinations for the selected piece
  winner: Player | 'Draw' | null;
  history: BoardState[];
  turnCount: number;
  lastMove: Move | null; // For highlighting
  capturedPositions: Position[]; // For animation effects
}

export const BOARD_SIZE = 4;
export const INITIAL_PIECES_COUNT = 4;
