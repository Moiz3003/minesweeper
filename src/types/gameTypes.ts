export type CellValue = 
  | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 
  | 'mine';

export type CellState = 
  | 'hidden'
  | 'revealed'
  | 'flagged';

export interface Cell {
  value: CellValue;
  state: CellState;
}

export type Board = Cell[][];

export type Difficulty = 'beginner' | 'intermediate' | 'expert' | 'custom';

export interface GameConfig {
  rows: number;
  cols: number;
  mines: number;
}

export type GameStatus = 'idle' | 'playing' | 'won' | 'lost';

export const DIFFICULTY_PRESETS: Record<Difficulty, GameConfig> = {
  beginner: {
    rows: 9,
    cols: 9,
    mines: 10
  },
  intermediate: {
    rows: 16,
    cols: 16,
    mines: 40
  },
  expert: {
    rows: 16,
    cols: 30,
    mines: 99
  },
  custom: {
    rows: 10,
    cols: 10,
    mines: 15
  }
};