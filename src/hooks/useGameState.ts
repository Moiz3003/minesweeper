import { useState, useEffect, useCallback } from 'react';
import { Board, CellValue, Difficulty, GameConfig, GameStatus } from '../types/gameTypes';
import { 
  createBoard, 
  revealCell, 
  toggleFlag, 
  checkWin, 
  revealAllMines, 
  countRemainingFlags 
} from '../utils/minesweeperLogic';
import { DIFFICULTY_PRESETS } from '../types/gameTypes';

export const useGameState = (initialDifficulty: Difficulty = 'beginner') => {
  const [difficulty, setDifficulty] = useState<Difficulty>(initialDifficulty);
  const [config, setConfig] = useState<GameConfig>(DIFFICULTY_PRESETS[initialDifficulty]);
  const [board, setBoard] = useState<Board>(() => createBoard(config));
  const [gameStatus, setGameStatus] = useState<GameStatus>('idle');
  const [time, setTime] = useState<number>(0);
  const [flagsRemaining, setFlagsRemaining] = useState<number>(config.mines);
  const [firstClick, setFirstClick] = useState<boolean>(true);
  const [timerInterval, setTimerInterval] = useState<number | null>(null);

  // Initialize or reset game
  const initGame = useCallback((newDifficulty?: Difficulty) => {
    // Clear existing timer
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }

    // Update difficulty and config if provided
    const updatedDifficulty = newDifficulty || difficulty;
    const updatedConfig = DIFFICULTY_PRESETS[updatedDifficulty];
    
    setDifficulty(updatedDifficulty);
    setConfig(updatedConfig);
    setBoard(createBoard(updatedConfig));
    setGameStatus('idle');
    setTime(0);
    setFlagsRemaining(updatedConfig.mines);
    setFirstClick(true);
  }, [difficulty, timerInterval]);

  // Start timer
  const startTimer = useCallback(() => {
    if (timerInterval) return;
    
    const interval = setInterval(() => {
      setTime(prevTime => prevTime + 1);
    }, 1000);
    
    setTimerInterval(interval as unknown as number);
  }, [timerInterval]);

  // Stop timer
  const stopTimer = useCallback(() => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
  }, [timerInterval]);

  // Handle cell click
  const handleCellClick = useCallback((row: number, col: number) => {
    if (gameStatus === 'won' || gameStatus === 'lost') return;

    // First click safety - regenerate board if first click is a mine
    if (firstClick) {
      setFirstClick(false);
      setGameStatus('playing');
      startTimer();
      
      // Ensure first click is safe
      const safeBoard = createBoard(config, [row, col]);
      setBoard(safeBoard);
      
      // Reveal the clicked cell on the safe board
      const updatedBoard = revealCell(safeBoard, row, col);
      setBoard(updatedBoard);
      
      return;
    }

    const updatedBoard = revealCell(board, row, col);
    
    // Check if clicked on a mine
    if (updatedBoard[row][col].value === 'mine' && updatedBoard[row][col].state === 'revealed') {
      setGameStatus('lost');
      stopTimer();
      
      // Reveal all mines
      const finalBoard = revealAllMines(updatedBoard, [row, col]);
      setBoard(finalBoard);
      return;
    }
    
    setBoard(updatedBoard);
    
    // Check for win
    if (checkWin(updatedBoard, config.mines)) {
      setGameStatus('won');
      stopTimer();
      
      // Reveal all mines and mark them as flagged
      const finalBoard = revealAllMines(updatedBoard);
      setBoard(finalBoard);
    }
  }, [board, config, firstClick, gameStatus, startTimer, stopTimer]);

  // Handle right-click (flag)
  const handleRightClick = useCallback((row: number, col: number) => {
    if (gameStatus === 'won' || gameStatus === 'lost') return;
    
    // Start game on first interaction
    if (gameStatus === 'idle') {
      setGameStatus('playing');
      startTimer();
    }
    
    const updatedBoard = toggleFlag(board, row, col);
    setBoard(updatedBoard);
    
    // Update flags remaining
    const remaining = countRemainingFlags(updatedBoard, config.mines);
    setFlagsRemaining(remaining);
  }, [board, config.mines, gameStatus, startTimer]);

  // Change difficulty
  const changeDifficulty = useCallback((newDifficulty: Difficulty) => {
    initGame(newDifficulty);
  }, [initGame]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [timerInterval]);

  return {
    board,
    gameStatus,
    time,
    flagsRemaining,
    difficulty,
    config,
    handleCellClick,
    handleRightClick,
    initGame,
    changeDifficulty
  };
};