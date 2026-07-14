import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

type Board = (string | null)[];

// Unbeatable Minimax Tic Tac Toe Engine
function checkWin(board: Board): string | null {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6]             // diagonals
  ];
  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  if (board.every(cell => cell !== null)) return 'draw';
  return null;
}

function evaluateBoard(board: Board): number {
  const win = checkWin(board);
  if (win === 'X') return 10;
  if (win === 'O') return -10;
  return 0;
}

function minimax(board: Board, depth: number, isMax: boolean): number {
  const score = evaluateBoard(board);
  if (score === 10) return score - depth;
  if (score === -10) return score + depth;
  if (board.every(cell => cell !== null)) return 0;

  if (isMax) {
    let best = -1000;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = 'X'; // AI
        best = Math.max(best, minimax(board, depth + 1, false));
        board[i] = null;
      }
    }
    return best;
  } else {
    let best = 1000;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = 'O'; // Player
        best = Math.min(best, minimax(board, depth + 1, true));
        board[i] = null;
      }
    }
    return best;
  }
}

function findBestMove(board: Board): number {
  let bestVal = -1000;
  let bestMove = -1;
  for (let i = 0; i < 9; i++) {
    if (board[i] === null) {
      board[i] = 'X';
      const moveVal = minimax(board, 0, false);
      board[i] = null;
      if (moveVal > bestVal) {
        bestMove = i;
        bestVal = moveVal;
      }
    }
  }
  return bestMove;
}

const aiPhrases = {
  idle: 'AWAITING PLAYER CELL INPUT...',
  thinking: 'COMPUTING BEST VECTORS...',
  win: 'SYS: PLAYER DEFEATED. ALWAYS 10 STEPS AHEAD. 😉',
  draw: 'SYS: MATCH DRAWN. WORTHY OPPONENT. 🤝',
  playerTurn: 'PLAYER TURN [O]. ANALYZING MOVES...'
};

export function TicTacToe() {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [isAiTurn, setIsAiTurn] = useState(false);
  const [log, setLog] = useState(aiPhrases.playerTurn);
  const [scores, setScores] = useState({ player: 0, ai: 0, ties: 0 });
  const [gameOver, setGameOver] = useState(false);

  // Play again
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsAiTurn(false);
    setGameOver(false);
    setLog(aiPhrases.playerTurn);
  };

  // AI moves after delay
  useEffect(() => {
    if (!isAiTurn || gameOver) return;

    setLog(aiPhrases.thinking);
    const timer = setTimeout(() => {
      const bestMove = findBestMove(board);
      if (bestMove !== -1) {
        const nextBoard = [...board];
        nextBoard[bestMove] = 'X';
        setBoard(nextBoard);

        const winner = checkWin(nextBoard);
        if (winner) {
          setGameOver(true);
          if (winner === 'X') {
            setLog(aiPhrases.win);
            setScores(prev => ({ ...prev, ai: prev.ai + 1 }));
          } else if (winner === 'draw') {
            setLog(aiPhrases.draw);
            setScores(prev => ({ ...prev, ties: prev.ties + 1 }));
          }
        } else {
          setIsAiTurn(false);
          setLog(aiPhrases.playerTurn);
        }
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [isAiTurn, board, gameOver]);

  const handleCellClick = (index: number) => {
    if (board[index] || isAiTurn || gameOver) return;

    const nextBoard = [...board];
    nextBoard[index] = 'O';
    setBoard(nextBoard);

    const winner = checkWin(nextBoard);
    if (winner) {
      setGameOver(true);
      if (winner === 'O') {
        setScores(prev => ({ ...prev, player: prev.player + 1 }));
        setLog('SYS: HOW DID YOU BEAT THE SYSTEM? IMPOSSIBLE.');
      } else if (winner === 'draw') {
        setScores(prev => ({ ...prev, ties: prev.ties + 1 }));
        setLog(aiPhrases.draw);
      }
    } else {
      setIsAiTurn(true);
    }
  };

  return (
    <div className="w-[280px] p-6 bg-[#FAF8F5]/80 backdrop-blur-md border-2 border-black/10 rounded-[2rem] shadow-sm relative overflow-hidden flex flex-col gap-4 select-none">
      {/* Drafting border */}
      <div className="absolute inset-2 border border-dashed border-[#1c2135]/5 rounded-[1.7rem] pointer-events-none" />

      {/* Header Info */}
      <div className="flex flex-col gap-1 relative z-10">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[8px] uppercase tracking-widest text-black/35">SYS_REF: [DISHA-AI-V2]</span>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E58B88] animate-pulse" />
            <span className="font-mono text-[7px] uppercase tracking-widest text-[#E58B88]">ACTIVE</span>
          </div>
        </div>
        <h4 className="font-mono text-[10px] font-bold text-[#1c2135] uppercase tracking-[0.1em] mt-1">Tic-Tac-Toe Core</h4>
      </div>

      {/* Unbeatable Game Grid */}
      <div className="w-48 h-48 mx-auto relative z-10 flex items-center justify-center bg-transparent mt-2">
        {/* Hashtag Lines with Crosshairs */}
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
          {Array(9).fill(null).map((_, i) => {
            const hasRight = i % 3 !== 2;
            const hasBottom = i < 6;
            return (
              <div 
                key={i} 
                className={`relative flex items-center justify-center ${hasRight ? 'border-r border-[#1c2135]/10' : ''} ${hasBottom ? 'border-b border-[#1c2135]/10' : ''}`}
              >
                {/* Micro CAD plus marks at grid intersections */}
                {i === 0 && (
                  <div className="absolute -bottom-[5px] -right-[5px] font-mono text-[9px] text-[#1c2135]/25 font-bold line-none select-none">+</div>
                )}
                {i === 1 && (
                  <div className="absolute -bottom-[5px] -right-[5px] font-mono text-[9px] text-[#1c2135]/25 font-bold line-none select-none">+</div>
                )}
                {i === 3 && (
                  <div className="absolute -bottom-[5px] -right-[5px] font-mono text-[9px] text-[#1c2135]/25 font-bold line-none select-none">+</div>
                )}
                {i === 4 && (
                  <div className="absolute -bottom-[5px] -right-[5px] font-mono text-[9px] text-[#1c2135]/25 font-bold line-none select-none">+</div>
                )}
              </div>
            );
          })}
        </div>

        {/* Clickable cells */}
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 z-20">
          {board.map((cell, idx) => (
            <div 
              key={idx} 
              onClick={() => handleCellClick(idx)}
              className="w-16 h-16 flex items-center justify-center cursor-pointer hover:bg-black/[0.02] active:bg-[#E58B88]/5 transition-colors relative"
            >
              {/* Coordinates label */}
              <span className="absolute top-1 left-1 font-mono text-[6px] text-black/15">
                {idx % 3},{Math.floor(idx / 3)}
              </span>

              {/* Sketchy X (AI) */}
              {cell === 'X' && (
                <svg className="w-10 h-10 text-[#E58B88]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <motion.path 
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    d="M 4 4 L 20 20" 
                  />
                  <motion.path 
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.4, delay: 0.15, ease: 'easeOut' }}
                    d="M 20 4 L 4 20" 
                  />
                </svg>
              )}

              {/* Sketchy O (Player) */}
              {cell === 'O' && (
                <svg className="w-9 h-9 text-[#B2BEE2]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <motion.circle 
                    cx="12" 
                    cy="12" 
                    r="8.5"
                    initial={{ pathLength: 0, rotate: -90 }}
                    animate={{ pathLength: 1, rotate: 270 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                  />
                </svg>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Scores Monospace Table */}
      <div className="flex items-center justify-between px-2 text-[9px] font-mono text-black/40 border-t border-b border-black/[0.06] py-1.5 mt-1 relative z-10">
        <span>YOU: {scores.player}</span>
        <span>AI: {scores.ai}</span>
        <span>TIES: {scores.ties}</span>
      </div>

      {/* Mini Console Output */}
      <div className="relative z-10 w-full min-h-[32px] bg-[#1c2135] text-[#34C759] font-mono text-[8px] px-3 py-2 rounded-lg flex flex-col justify-center leading-normal select-text shadow-inner">
        <p className="truncate">{log}</p>
      </div>

      {/* Restart Button */}
      {gameOver && (
        <motion.button 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={resetGame}
          className="absolute bottom-[22px] right-[24px] z-30 font-mono text-[9px] uppercase tracking-widest text-[#E58B88] hover:text-[#1c2135] transition-colors border border-[#E58B88]/20 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-md shadow-sm"
        >
          RETRY
        </motion.button>
      )}
    </div>
  );
}
