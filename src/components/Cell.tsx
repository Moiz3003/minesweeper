import React, { useCallback } from 'react';
import { Flag, Bomb } from 'lucide-react';
import { Cell as CellType } from '../types/gameTypes';

interface CellProps {
  cell: CellType;
  row: number;
  col: number;
  onLeftClick: (row: number, col: number) => void;
  onRightClick: (row: number, col: number) => void;
}

// Color mapping for number values
const numberColors: Record<number, string> = {
  1: 'text-blue-600',
  2: 'text-green-600',
  3: 'text-red-600',
  4: 'text-indigo-800',
  5: 'text-amber-700',
  6: 'text-teal-600',
  7: 'text-black',
  8: 'text-gray-600',
};

export const Cell: React.FC<CellProps> = ({ cell, row, col, onLeftClick, onRightClick }) => {
  const handleClick = useCallback(() => {
    onLeftClick(row, col);
  }, [row, col, onLeftClick]);

  const handleRightClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    onRightClick(row, col);
  }, [row, col, onRightClick]);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
  }, []);

  // Determine cell style based on state
  let cellClassName = 'flex items-center justify-center w-full h-full min-w-8 min-h-8';
  
  switch (cell.state) {
    case 'hidden':
      cellClassName += ' bg-slate-300 hover:bg-slate-200 active:bg-slate-100 cursor-pointer shadow-sm';
      break;
    case 'flagged':
      cellClassName += ' bg-slate-300 hover:bg-slate-200 cursor-pointer shadow-sm';
      break;
    case 'revealed':
      if (cell.value === 'mine') {
        cellClassName += ' bg-red-500 cursor-default';
      } else {
        cellClassName += ' bg-slate-100 cursor-default';
      }
      break;
  }

  return (
    <div 
      className={`${cellClassName} select-none rounded-sm transition-colors duration-150 ease-in-out border border-slate-400`}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      onMouseDown={(e) => e.button === 2 && handleRightClick(e)}
    >
      {cell.state === 'flagged' && (
        <Flag size={16} className="text-red-600" />
      )}
      
      {cell.state === 'revealed' && cell.value === 'mine' && (
        <Bomb size={16} className="text-black" />
      )}
      
      {cell.state === 'revealed' && cell.value !== 'mine' && cell.value > 0 && (
        <span className={`font-bold ${numberColors[cell.value as number] || 'text-black'}`}>
          {cell.value}
        </span>
      )}
    </div>
  );
};

export default Cell;