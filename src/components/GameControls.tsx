import React from 'react';
import { RefreshCw, Timer, Flag, AlertTriangle } from 'lucide-react';
import { Difficulty, GameStatus } from '../types/gameTypes';

interface GameControlsProps {
  time: number;
  flagsRemaining: number;
  difficulty: Difficulty;
  gameStatus: GameStatus;
  onReset: () => void;
  onChangeDifficulty: (difficulty: Difficulty) => void;
}

const GameControls: React.FC<GameControlsProps> = ({
  time,
  flagsRemaining,
  difficulty,
  gameStatus,
  onReset,
  onChangeDifficulty
}) => {
  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col space-y-4 w-full max-w-md mx-auto">
      {/* Status display */}
      <div className="grid grid-cols-3 gap-2 bg-slate-200 p-3 rounded-lg shadow-sm">
        <div className="flex items-center justify-center space-x-1 bg-slate-100 p-2 rounded">
          <Flag size={16} className="text-red-600" />
          <span className="font-mono font-bold">{flagsRemaining}</span>
        </div>
        
        <button 
          onClick={onReset}
          className="flex items-center justify-center space-x-1 bg-slate-700 text-white py-2 px-4 rounded hover:bg-slate-600 transition-colors"
        >
          <RefreshCw size={16} />
          <span className="font-medium">Reset</span>
        </button>
        
        <div className="flex items-center justify-center space-x-1 bg-slate-100 p-2 rounded">
          <Timer size={16} className="text-blue-600" />
          <span className="font-mono font-bold">{formatTime(time)}</span>
        </div>
      </div>
      
      {/* Game status indicator */}
      {gameStatus === 'won' && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded flex items-center justify-center animate-pulse">
          <span className="font-bold">You Win! 🎉</span>
        </div>
      )}
      
      {gameStatus === 'lost' && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center justify-center">
          <AlertTriangle size={16} className="mr-2" />
          <span className="font-bold">Game Over!</span>
        </div>
      )}
      
      {/* Difficulty settings */}
      <div className="flex flex-wrap justify-center gap-2">
        <button
          onClick={() => onChangeDifficulty('beginner')}
          className={`py-1 px-3 rounded transition-colors ${
            difficulty === 'beginner' 
              ? 'bg-blue-600 text-white'
              : 'bg-slate-200 hover:bg-slate-300'
          }`}
        >
          Beginner
        </button>
        <button
          onClick={() => onChangeDifficulty('intermediate')}
          className={`py-1 px-3 rounded transition-colors ${
            difficulty === 'intermediate' 
              ? 'bg-blue-600 text-white'
              : 'bg-slate-200 hover:bg-slate-300'
          }`}
        >
          Intermediate
        </button>
        <button
          onClick={() => onChangeDifficulty('expert')}
          className={`py-1 px-3 rounded transition-colors ${
            difficulty === 'expert' 
              ? 'bg-blue-600 text-white'
              : 'bg-slate-200 hover:bg-slate-300'
          }`}
        >
          Expert
        </button>
      </div>
    </div>
  );
};

export default GameControls;