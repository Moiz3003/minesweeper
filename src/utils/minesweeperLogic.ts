import { Board, Cell, CellState, CellValue, GameConfig } from "../types/gameTypes";

/**
 * Creates a new game board with mines placed randomly
 */
export const createBoard = (config: GameConfig, firstClickCoords?: [number, number]): Board => {
  const { rows, cols, mines } = config;
  
  // Initialize empty board
  const board: Board = Array(rows).fill(null).map(() => 
    Array(cols).fill(null).map(() => ({
      value: 0,
      state: 'hidden'
    }))
  );
  
  // Place mines randomly, but avoid first click position
  let minesPlaced = 0;
  while (minesPlaced < mines) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * cols);
    
    // Skip if there's already a mine here or if it's the first click position
    if (board[row][col].value === 'mine' || 
        (firstClickCoords && row === firstClickCoords[0] && col === firstClickCoords[1]) ||
        (firstClickCoords && isAdjacent(row, col, firstClickCoords[0], firstClickCoords[1]))) {
      continue;
    }
    
    board[row][col].value = 'mine';
    minesPlaced++;
    
    // Update adjacent cell values
    for (let r = Math.max(0, row - 1); r <= Math.min(rows - 1, row + 1); r++) {
      for (let c = Math.max(0, col - 1); c <= Math.min(cols - 1, col + 1); c++) {
        // Skip the mine cell itself
        if (r === row && c === col) continue;
        
        // Increment the number for adjacent cells that aren't mines
        if (board[r][c].value !== 'mine') {
          board[r][c].value = (board[r][c].value as number) + 1 as CellValue;
        }
      }
    }
  }
  
  return board;
};

/**
 * Check if two cells are adjacent
 */
export const isAdjacent = (row1: number, col1: number, row2: number, col2: number): boolean => {
  return Math.abs(row1 - row2) <= 1 && Math.abs(col1 - col2) <= 1;
};

/**
 * Reveals a cell on the board
 */
export const revealCell = (board: Board, row: number, col: number): Board => {
  // Clone the board to avoid direct mutation
  let newBoard = JSON.parse(JSON.stringify(board)) as Board;
  
  // If cell is already revealed or flagged, do nothing
  if (newBoard[row][col].state !== 'hidden') {
    return newBoard;
  }
  
  // Reveal the cell
  newBoard[row][col].state = 'revealed';
  
  // If it's a mine, just return the updated board
  if (newBoard[row][col].value === 'mine') {
    return newBoard;
  }
  
  // If it's an empty cell (value 0), reveal adjacent cells
  if (newBoard[row][col].value === 0) {
    const { rows, cols } = { rows: newBoard.length, cols: newBoard[0].length };
    
    // Check all adjacent cells
    for (let r = Math.max(0, row - 1); r <= Math.min(rows - 1, row + 1); r++) {
      for (let c = Math.max(0, col - 1); c <= Math.min(cols - 1, col + 1); c++) {
        // Skip the current cell
        if (r === row && c === col) continue;
        
        // Recursively reveal adjacent cells
        if (newBoard[r][c].state === 'hidden') {
          newBoard = revealCell(newBoard, r, c);
        }
      }
    }
  }
  
  return newBoard;
};

/**
 * Toggle flag on a cell
 */
export const toggleFlag = (board: Board, row: number, col: number): Board => {
  // Clone the board to avoid direct mutation
  const newBoard = JSON.parse(JSON.stringify(board)) as Board;
  
  // If cell is already revealed, do nothing
  if (newBoard[row][col].state === 'revealed') {
    return newBoard;
  }
  
  // Toggle flag state
  newBoard[row][col].state = newBoard[row][col].state === 'flagged' ? 'hidden' : 'flagged';
  
  return newBoard;
};

/**
 * Check if the game is won
 */
export const checkWin = (board: Board, totalMines: number): boolean => {
  const { rows, cols } = { rows: board.length, cols: board[0].length };
  let hiddenCount = 0;
  let flaggedMines = 0;
  
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c].state === 'hidden') {
        hiddenCount++;
      }
      if (board[r][c].state === 'flagged' && board[r][c].value === 'mine') {
        flaggedMines++;
      }
    }
  }
  
  // Win if all non-mine cells are revealed
  return hiddenCount === 0 || (hiddenCount + flaggedMines === totalMines && flaggedMines === totalMines);
};

/**
 * Reveal all mines on the board
 */
export const revealAllMines = (board: Board, explodedMineCoords?: [number, number]): Board => {
  const newBoard = JSON.parse(JSON.stringify(board)) as Board;
  const { rows, cols } = { rows: newBoard.length, cols: newBoard[0].length };
  
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // Reveal all mines and mark incorrectly flagged cells
      if (newBoard[r][c].value === 'mine') {
        // Don't change flagged mines
        if (newBoard[r][c].state !== 'flagged') {
          newBoard[r][c].state = 'revealed';
        }
      } else if (newBoard[r][c].state === 'flagged') {
        // Mark incorrectly flagged cells
        newBoard[r][c].state = 'revealed';
        // We could add a special state for incorrect flags if needed
      }
    }
  }
  
  return newBoard;
};

/**
 * Count revealed cells
 */
export const countRevealed = (board: Board): number => {
  return board.flat().filter(cell => cell.state === 'revealed').length;
};

/**
 * Count remaining flags
 */
export const countRemainingFlags = (board: Board, totalMines: number): number => {
  const flaggedCount = board.flat().filter(cell => cell.state === 'flagged').length;
  return totalMines - flaggedCount;
};