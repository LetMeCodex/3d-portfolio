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
  thinking: 'AI IS SCANNING GRID VECTORS...',
  win: 'DISHA\'S AI DEFEATED YOU. 😉',
  draw: 'MATCH DRAWN. WELL PLAYED! 🤝',
  playerTurn: 'AWAITING YOUR MOVE [O]...'
};

export function TicTacToe() {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [isAiTurn, setIsAiTurn] = useState(false);
  const [log, setLog] = useState(aiPhrases.playerTurn);
  const [scores, setScores] = useState({ player: 0, ai: 0, ties: 0 });
  const [gameOver, setGameOver] = useState(false);

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
    }, 500);

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
        setLog('YOU BEAT THE SYSTEM?!');
      } else if (winner === 'draw') {
        setScores(prev => ({ ...prev, ties: prev.ties + 1 }));
        setLog(aiPhrases.draw);
      }
    } else {
      setIsAiTurn(true);
    }
  };

  const getBorderClasses = (i: number) => {
    const r = Math.floor(i / 3);
    const c = i % 3;
    return `${c < 2 ? 'border-r border-[#1c2135]/10' : ''} ${r < 2 ? 'border-b border-[#1c2135]/10' : ''}`;
  };

  return (
    <div className="w-[228px] h-[228px] bg-[#FAF8F5]/30 hover:bg-[#FAF8F5]/90 backdrop-blur-sm hover:shadow-[0_20px_50px_rgba(229,139,136,0.1)] border-2 border-black/10 hover:border-[#E58B88]/60 transition-all duration-700 rounded-[2.5rem] p-3.5 relative overflow-hidden flex flex-col justify-between select-none">
      {/* Drafting border */}
      <div className="absolute inset-1.5 border border-dashed border-[#1c2135]/5 rounded-[2.2rem] pointer-events-none" />

      {/* Premium Monospace Scoreboard */}
      <div className="w-full flex items-center justify-between text-[8px] font-mono text-[#1c2135]/50 px-1 relative z-10 select-none">
        <span>PLAYER [O]: {scores.player}</span>
        <span>TIES: {scores.ties}</span>
        <span>AI [X]: {scores.ai}</span>
      </div>

      {/* Unbeatable Game Grid */}
      <div className="w-[138px] h-[138px] mx-auto relative z-10 flex items-center justify-center bg-transparent mt-1">
        
        {/* Hashtag Lines Intersections */}
        <span className="absolute left-[43px] top-[39px] font-mono text-[8px] text-[#1c2135]/25 font-bold select-none pointer-events-none leading-none">+</span>
        <span className="absolute left-[89px] top-[39px] font-mono text-[8px] text-[#1c2135]/25 font-bold select-none pointer-events-none leading-none">+</span>
        <span className="absolute left-[43px] top-[85px] font-mono text-[8px] text-[#1c2135]/25 font-bold select-none pointer-events-none leading-none">+</span>
        <span className="absolute left-[89px] top-[85px] font-mono text-[8px] text-[#1c2135]/25 font-bold select-none pointer-events-none leading-none">+</span>

        {/* Grid Cells */}
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
          {board.map((cell, idx) => (
            <div 
              key={idx} 
              onClick={() => handleCellClick(idx)}
              data-cursor="PLAY"
              className={`w-[46px] h-[46px] flex items-center justify-center cursor-pointer hover:bg-black/[0.02] active:bg-[#E58B88]/5 transition-colors relative ${getBorderClasses(idx)}`}
            >
              {/* Coordinates label */}
              <span className="absolute top-[2px] left-[2px] font-mono text-[5px] text-black/10">
                {idx % 3},{Math.floor(idx / 3)}
              </span>

              {/* Sketchy X (AI) */}
              {cell === 'X' && (
                <svg className="w-8 h-8 text-[#E58B88]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                  <motion.path 
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    d="M 5 5 L 19 19" 
                  />
                  <motion.path 
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.35, delay: 0.1, ease: 'easeOut' }}
                    d="M 19 5 L 5 19" 
                  />
                </svg>
              )}

              {/* Sketchy O (Player) */}
              {cell === 'O' && (
                <svg className="w-7 h-7 text-[#B2BEE2]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                  <motion.circle 
                    cx="12" 
                    cy="12" 
                    r="8"
                    initial={{ pathLength: 0, rotate: -90 }}
                    animate={{ pathLength: 1, rotate: 270 }}
                    transition={{ duration: 0.45, ease: 'easeInOut' }}
                  />
                </svg>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Mini Console Output or Reset */}
      <div className="relative z-10 w-full text-center flex justify-center mt-1">
        {gameOver ? (
          <button 
            onClick={resetGame}
            data-cursor="RESET"
            className="w-full bg-[#E58B88] text-white font-mono text-[8px] uppercase tracking-widest py-1.5 rounded-lg shadow-sm hover:bg-[#1c2135] transition-colors duration-300 font-bold cursor-pointer"
          >
            RETRY MATCH
          </button>
        ) : (
          <div className="w-full bg-[#1c2135] text-[#34C759] font-mono text-[7px] px-2 py-1.5 rounded-lg shadow-inner flex items-center justify-center leading-none tracking-widest truncate">
            {log}
          </div>
        )}
      </div>
    </div>
  );
}
