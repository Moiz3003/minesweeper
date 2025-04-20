import React from 'react';
import { MousePointer, MousePointerClick, Flag } from 'lucide-react';

const Instructions: React.FC = () => {
  return (
    <div className="bg-white bg-opacity-90 rounded-lg shadow-md p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold text-center mb-3 text-slate-800">How to Play</h2>
      
      <div className="space-y-3">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-1">
            <MousePointer size={18} className="text-blue-600" />
          </div>
          <p className="text-sm text-slate-700">
            Left-click on a cell to reveal it. Numbers show how many mines are in the adjacent cells.
          </p>
        </div>
        
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-1">
            <MousePointerClick size={18} className="text-red-600" />
          </div>
          <p className="text-sm text-slate-700">
            Right-click on a cell to place a flag where you think a mine is hidden.
          </p>
        </div>
        
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-1">
            <Flag size={18} className="text-green-600" />
          </div>
          <p className="text-sm text-slate-700">
            Win by revealing all safe cells or by correctly flagging all mines.
          </p>
        </div>
      </div>
      
      <div className="mt-4 pt-3 border-t border-slate-200">
        <p className="text-xs text-center text-slate-500">
          Your first click is always safe and will never be a mine.
        </p>
      </div>
    </div>
  );
};

export default Instructions;