import React from 'react';
import Cell from './Cell';
import { Board as BoardType } from '../types/gameTypes';

interface BoardProps {
  board: BoardType;
  onCellLeftClick: (row: number, col: number) => void;
  onCellRightClick: (row: number, col: number) => void;
}

const Board: React.FC<BoardProps> = ({ board, onCellLeftClick, onCellRightClick }) => {
  // Calculate dynamic grid template based on board dimensions
  const gridTemplateColumns = `repeat(${board[0].length}, minmax(0, 1fr))`;
  
  // Determine appropriate board size class based on difficulty
  let boardSizeClass = 'border-2 border-slate-500 bg-slate-400 p-1 rounded-md shadow-md';
  
  if (board[0].length <= 9) {
    boardSizeClass += ' max-w-xs'; // Beginner
  } else if (board[0].length <= 16) {
    boardSizeClass += ' max-w-md'; // Intermediate
  } else {
    boardSizeClass += ' max-w-2xl'; // Expert
  }

  return (
    <div className={boardSizeClass}>
      <div 
        className="grid gap-px"
        style={{ gridTemplateColumns }}
      >
        {board.map((row, rowIndex) => (
          row.map((cell, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              cell={cell}
              row={rowIndex}
              col={colIndex}
              onLeftClick={onCellLeftClick}
              onRightClick={onCellRightClick}
            />
          ))
        ))}
      </div>
    </div>
  );
};

export default Board;