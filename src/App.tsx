import React, { useEffect } from 'react';
import Board from './components/Board';
import GameControls from './components/GameControls';
import Instructions from './components/Instructions';
import { useGameState } from './hooks/useGameState';
import { Bomb } from 'lucide-react';

function App() {
  const { 
    board, 
    gameStatus, 
    time, 
    flagsRemaining, 
    difficulty, 
    handleCellClick, 
    handleRightClick, 
    initGame, 
    changeDifficulty 
  } = useGameState('beginner');

  // Update page title
  useEffect(() => {
    document.title = 'Minesweeper';
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-800 to-slate-900 flex flex-col items-center justify-center p-4">
      <header className="mb-4 text-center">
        <h1 className="text-3xl font-bold text-white flex items-center justify-center space-x-2 mb-2">
          <Bomb className="text-yellow-400" />
          <span>Minesweeper</span>
        </h1>
        <p className="text-slate-300 text-sm mb-4">Find all the mines without getting blown up!</p>
      </header>

      <div className="flex flex-col items-center w-full max-w-xl gap-6">
        <GameControls 
          time={time}
          flagsRemaining={flagsRemaining}
          difficulty={difficulty}
          gameStatus={gameStatus}
          onReset={initGame}
          onChangeDifficulty={changeDifficulty}
        />

        <div className="w-full flex justify-center">
          <Board 
            board={board} 
            onCellLeftClick={handleCellClick} 
            onCellRightClick={handleRightClick} 
          />
        </div>

        <Instructions />
      </div>

      <footer className="mt-6 text-center text-slate-400 text-xs">
        <p>&copy; {new Date().getFullYear()} Minesweeper Game</p>
      </footer>
    </div>
  );
}

export default App;