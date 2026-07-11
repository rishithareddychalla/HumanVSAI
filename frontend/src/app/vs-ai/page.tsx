"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, User, Target, Zap, Trophy, Gamepad2, ArrowLeft, Circle, X, Flame } from "lucide-react";
import Link from "next/link";
import confetti from "canvas-confetti";

type Move = "rock" | "paper" | "scissors";
const moves: Move[] = ["rock", "paper", "scissors"];

export default function VsAI() {
  const [selectedGame, setSelectedGame] = useState<"rps" | "ttt" | "reaction" | "nim" | null>(null);

  if (selectedGame === "rps") {
    return (
      <div className="w-full relative mt-4">
        <button onClick={() => setSelectedGame(null)} className="absolute -top-12 left-0 flex items-center gap-2 text-gray-400 hover:text-white transition-colors z-50">
          <ArrowLeft className="w-4 h-4" /> Back to Arcade
        </button>
        <RockPaperScissors />
      </div>
    );
  }

  if (selectedGame === "ttt") {
    return (
      <div className="w-full relative mt-4">
        <button onClick={() => setSelectedGame(null)} className="absolute -top-12 left-0 flex items-center gap-2 text-gray-400 hover:text-white transition-colors z-50">
          <ArrowLeft className="w-4 h-4" /> Back to Arcade
        </button>
        <TicTacToe />
      </div>
    );
  }

  if (selectedGame === "reaction") {
    return (
      <div className="w-full relative mt-4">
        <button onClick={() => setSelectedGame(null)} className="absolute -top-12 left-0 flex items-center gap-2 text-gray-400 hover:text-white transition-colors z-50">
          <ArrowLeft className="w-4 h-4" /> Back to Arcade
        </button>
        <ReactionGame />
      </div>
    );
  }

  if (selectedGame === "nim") {
    return (
      <div className="w-full relative mt-4">
        <button onClick={() => setSelectedGame(null)} className="absolute -top-12 left-0 flex items-center gap-2 text-gray-400 hover:text-white transition-colors z-50">
          <ArrowLeft className="w-4 h-4" /> Back to Arcade
        </button>
        <NimGame />
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col space-y-12 mt-12 relative z-10">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/30 mb-2">
          <Gamepad2 className="w-4 h-4" />
          <span className="text-xs font-bold tracking-wider uppercase">AI Arcade</span>
        </div>
        <h1 className="text-5xl sm:text-6xl font-black tracking-tighter">
          Man vs Machine
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">
          Test your wits against our predictive and tactical AI agents. Choose your battlefield.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <button onClick={() => setSelectedGame('rps')} className="glass-panel p-8 rounded-3xl text-left hover:scale-105 transition-all shadow-[0_0_30px_rgba(59,130,246,0.1)] border border-white/10 hover:border-blue-500/50 group flex flex-col h-full">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">🪨</div>
          <h2 className="text-3xl font-bold text-white mb-4">Mind Reader</h2>
          <p className="text-muted-foreground text-base leading-relaxed flex-grow">Rock, Paper, Scissors against a learning AI that analyzes your patterns and tries to predict your next move.</p>
        </button>

        <button onClick={() => setSelectedGame('ttt')} className="glass-panel p-8 rounded-3xl text-left hover:scale-105 transition-all shadow-[0_0_30px_rgba(236,72,153,0.1)] border border-white/10 hover:border-pink-500/50 group flex flex-col h-full">
           <div className="w-16 h-16 rounded-2xl bg-pink-500/20 text-pink-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
             <div className="flex -space-x-2"><X className="w-8 h-8" /><Circle className="w-8 h-8" /></div>
           </div>
          <h2 className="text-3xl font-bold text-white mb-4">Tactical Grid</h2>
          <p className="text-muted-foreground text-base leading-relaxed flex-grow">Classic Tic-Tac-Toe. Can you outsmart the tactical AI, or will every match end in a stalemate?</p>
        </button>

        <button onClick={() => setSelectedGame('reaction')} className="glass-panel p-8 rounded-3xl text-left hover:scale-105 transition-all shadow-[0_0_30px_rgba(234,179,8,0.1)] border border-white/10 hover:border-yellow-500/50 group flex flex-col h-full">
          <div className="w-16 h-16 rounded-2xl bg-yellow-500/20 text-yellow-400 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">⚡</div>
          <h2 className="text-3xl font-bold text-white mb-4">Quick Draw</h2>
          <p className="text-muted-foreground text-base leading-relaxed flex-grow">Test your reflexes against an AI. Wait for the green light and click as fast as you can. Are human reflexes faster than machine processing?</p>
        </button>

        <button onClick={() => setSelectedGame('nim')} className="glass-panel p-8 rounded-3xl text-left hover:scale-105 transition-all shadow-[0_0_30px_rgba(239,68,68,0.1)] border border-white/10 hover:border-red-500/50 group flex flex-col h-full">
          <div className="w-16 h-16 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Flame className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Matchstick Math</h2>
          <p className="text-muted-foreground text-base leading-relaxed flex-grow">A game of pure logic. Take 1 to 3 matchsticks. The one who takes the last matchstick loses. Can you beat an AI that plays perfectly?</p>
        </button>
      </div>
    </div>
  );
}

function RockPaperScissors() {
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [playerMove, setPlayerMove] = useState<Move | null>(null);
  const [aiMove, setAiMove] = useState<Move | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [history, setHistory] = useState<Move[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  
  const WIN_SCORE = 5;

  const playRound = (move: Move) => {
    if (gameOver || isThinking) return;
    
    setPlayerMove(move);
    setIsThinking(true);
    
    setTimeout(() => {
      let nextAiMove: Move;
      if (history.length > 2) {
        const counts = { rock: 0, paper: 0, scissors: 0 };
        history.forEach(m => counts[m]++);
        const mostFrequent = (Object.keys(counts) as Move[]).reduce((a, b) => counts[a] > counts[b] ? a : b);
        
        if (mostFrequent === "rock") nextAiMove = "paper";
        else if (mostFrequent === "paper") nextAiMove = "scissors";
        else nextAiMove = "rock";
        
        if (Math.random() > 0.6) {
          nextAiMove = moves[Math.floor(Math.random() * moves.length)];
        }
      } else {
        nextAiMove = moves[Math.floor(Math.random() * moves.length)];
      }

      setAiMove(nextAiMove);
      setHistory(prev => [...prev.slice(-9), move]);
      
      if (move === nextAiMove) {
        setResult("Draw!");
      } else if (
        (move === "rock" && nextAiMove === "scissors") ||
        (move === "paper" && nextAiMove === "rock") ||
        (move === "scissors" && nextAiMove === "paper")
      ) {
        setResult("You Win!");
        setPlayerScore(s => s + 1);
      } else {
        setResult("AI Wins!");
        setAiScore(s => s + 1);
      }
      
      setIsThinking(false);
    }, 1000);
  };

  useEffect(() => {
    if (playerScore >= WIN_SCORE || aiScore >= WIN_SCORE) {
      setGameOver(true);
      if (playerScore >= WIN_SCORE) {
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: ['#8b5cf6', '#3b82f6', '#ffffff'] });
      }
    }
  }, [playerScore, aiScore]);

  const resetGame = () => {
    setPlayerScore(0); setAiScore(0); setPlayerMove(null); setAiMove(null); setResult(null); setHistory([]); setGameOver(false);
  };

  const MoveIcon = ({ move, className }: { move: Move | null, className?: string }) => {
    if (!move) return <div className={`w-16 h-16 rounded-full bg-white/5 border border-white/10 ${className}`} />;
    return (
      <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-3xl shadow-xl border ${
        move === 'rock' ? 'bg-orange-500/20 border-orange-500/50 text-orange-400' :
        move === 'paper' ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' :
        'bg-green-500/20 border-green-500/50 text-green-400'
      } ${className}`}>
        {move === 'rock' ? '🪨' : move === 'paper' ? '📄' : '✂️'}
      </div>
    );
  };

  if (gameOver) {
    const isPlayerWin = playerScore >= WIN_SCORE;
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-2xl mx-auto glass-panel p-10 rounded-3xl text-center space-y-8 mt-12 relative overflow-hidden">
        <div className={`absolute inset-0 opacity-20 ${isPlayerWin ? 'bg-primary' : 'bg-destructive'}`}></div>
        <div className="relative z-10">
          {isPlayerWin ? <Trophy className="w-24 h-24 mx-auto text-yellow-400 mb-6" /> : <Bot className="w-24 h-24 mx-auto text-red-500 mb-6" />}
          <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            {isPlayerWin ? "You Defeated the AI!" : "The AI Outsmarted You"}
          </h1>
          <p className="text-xl text-gray-400 mb-8 font-medium">Final Score: {playerScore} - {aiScore}</p>
          <div className="flex gap-4 justify-center">
            <button onClick={resetGame} className="px-8 py-4 bg-white/10 hover:bg-white/20 rounded-full font-bold transition-all">Play Again</button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col space-y-8 relative z-10">
      <div className="text-center space-y-4 mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 mb-2">
          <Zap className="w-4 h-4" />
          <span className="text-xs font-bold tracking-wider uppercase">Mind Reader Match</span>
        </div>
        <h1 className="text-4xl font-black tracking-tighter">First to 5 Wins</h1>
      </div>

      <div className="flex items-center justify-between glass-panel p-6 rounded-3xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-purple-500/10"></div>
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center"><User className="w-6 h-6 text-blue-400" /></div>
          <div><p className="text-sm text-blue-400 font-bold uppercase tracking-wider">Human</p><p className="text-4xl font-black">{playerScore}</p></div>
        </div>
        <div className="text-2xl font-black text-gray-500 relative z-10">VS</div>
        <div className="flex items-center gap-4 text-right relative z-10">
          <div><p className="text-sm text-purple-400 font-bold uppercase tracking-wider">AI</p><p className="text-4xl font-black">{aiScore}</p></div>
          <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center"><Bot className="w-6 h-6 text-purple-400" /></div>
        </div>
      </div>

      <div className="glass-panel min-h-[300px] rounded-3xl p-8 flex flex-col items-center justify-center relative shadow-2xl border border-white/10">
        <div className="absolute top-1/2 left-0 w-full h-px bg-white/5 -translate-y-1/2"></div>
        <div className="absolute top-0 left-1/2 w-px h-full bg-white/5 -translate-x-1/2"></div>
        <div className="flex w-full items-center justify-between px-10 relative z-10">
          <div className="flex flex-col items-center gap-6 w-1/3">
            <p className="font-bold text-gray-400 tracking-widest text-sm uppercase">Your Move</p>
            <AnimatePresence mode="popLayout">
              {playerMove ? (<motion.div key={playerMove} initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, opacity: 0 }}><MoveIcon move={playerMove} /></motion.div>) : (<MoveIcon move={null} />)}
            </AnimatePresence>
          </div>
          <div className="flex flex-col items-center justify-center w-1/3">
            <AnimatePresence mode="wait">
              {isThinking ? (
                <motion.div key="thinking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs font-bold text-primary animate-pulse">AI thinking...</span>
                </motion.div>
              ) : result ? (
                <motion.div key={result} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`text-2xl font-black px-6 py-2 rounded-full ${result.includes("You") ? "bg-green-500/20 text-green-400 border border-green-500/30" : result.includes("AI") ? "bg-red-500/20 text-red-400 border border-red-500/30" : "bg-gray-500/20 text-gray-400 border border-gray-500/30"}`}>
                  {result}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
          <div className="flex flex-col items-center gap-6 w-1/3">
            <p className="font-bold text-gray-400 tracking-widest text-sm uppercase">AI Move</p>
            <AnimatePresence mode="popLayout">
              {aiMove && !isThinking ? (<motion.div key={aiMove} initial={{ scale: 0, rotate: 45 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, opacity: 0 }}><MoveIcon move={aiMove} /></motion.div>) : (<MoveIcon move={null} />)}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {moves.map((move) => (
          <button key={move} onClick={() => playRound(move)} disabled={isThinking} className="glass-panel p-6 rounded-2xl flex flex-col items-center gap-3 hover:bg-white/10 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none group border border-white/5 hover:border-primary/30 shadow-lg">
            <span className="text-4xl group-hover:-translate-y-2 transition-transform duration-300">{move === 'rock' ? '🪨' : move === 'paper' ? '📄' : '✂️'}</span>
            <span className="font-bold text-sm uppercase tracking-wider text-gray-300 group-hover:text-white transition-colors">{move}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

type Player = "X" | "O" | null;

function TicTacToe() {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState<Player | "Draw">(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [isThinking, setIsThinking] = useState(false);

  const checkWinner = (squares: Player[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    if (!squares.includes(null)) return "Draw";
    return null;
  };

  const handleClick = (i: number) => {
    if (board[i] || winner || !isXNext || isThinking) return;
    
    const newBoard = [...board];
    newBoard[i] = "X";
    setBoard(newBoard);
    setIsXNext(false);
    
    const newWinner = checkWinner(newBoard);
    if (newWinner) {
      handleGameOver(newWinner);
      return;
    }

    // AI Turn
    setIsThinking(true);
    setTimeout(() => {
      let nextMove = -1;
      
      // Simple AI logic: 1. Try to win
      const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]
      ];
      
      // Check if AI can win
      for (const [a, b, c] of lines) {
        if (newBoard[a] === "O" && newBoard[b] === "O" && !newBoard[c]) nextMove = c;
        else if (newBoard[a] === "O" && !newBoard[b] && newBoard[c] === "O") nextMove = b;
        else if (!newBoard[a] && newBoard[b] === "O" && newBoard[c] === "O") nextMove = a;
      }
      
      // 2. Block player
      if (nextMove === -1) {
        for (const [a, b, c] of lines) {
          if (newBoard[a] === "X" && newBoard[b] === "X" && !newBoard[c]) nextMove = c;
          else if (newBoard[a] === "X" && !newBoard[b] && newBoard[c] === "X") nextMove = b;
          else if (!newBoard[a] && newBoard[b] === "X" && newBoard[c] === "X") nextMove = a;
        }
      }

      // 3. Take center
      if (nextMove === -1 && !newBoard[4]) nextMove = 4;

      // 4. Random available
      if (nextMove === -1) {
        const available = newBoard.map((val, idx) => val === null ? idx : null).filter(val => val !== null) as number[];
        if (available.length > 0) {
          nextMove = available[Math.floor(Math.random() * available.length)];
        }
      }

      if (nextMove !== -1) {
        const aiBoard = [...newBoard];
        aiBoard[nextMove] = "O";
        setBoard(aiBoard);
        setIsXNext(true);
        
        const aiWinner = checkWinner(aiBoard);
        if (aiWinner) {
          handleGameOver(aiWinner);
        }
      }
      setIsThinking(false);
    }, 600);
  };

  const handleGameOver = (winState: Player | "Draw") => {
    setWinner(winState);
    if (winState === "X") {
      setPlayerScore(s => s + 1);
      confetti({ particleCount: 100, spread: 60, origin: { y: 0.6 } });
    } else if (winState === "O") {
      setAiScore(s => s + 1);
    }
  };

  const resetBoard = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col space-y-8 relative z-10">
      <div className="text-center space-y-4 mb-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/30 mb-2">
          <Target className="w-4 h-4" />
          <span className="text-xs font-bold tracking-wider uppercase">Tactical Match</span>
        </div>
        <h1 className="text-4xl font-black tracking-tighter">Tic-Tac-Toe</h1>
      </div>

      <div className="flex items-center justify-between glass-panel p-6 rounded-3xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-pink-500/10"></div>
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center"><User className="w-6 h-6 text-blue-400" /></div>
          <div><p className="text-sm text-blue-400 font-bold uppercase tracking-wider">You (X)</p><p className="text-4xl font-black">{playerScore}</p></div>
        </div>
        <div className="text-2xl font-black text-gray-500 relative z-10">VS</div>
        <div className="flex items-center gap-4 text-right relative z-10">
          <div><p className="text-sm text-pink-400 font-bold uppercase tracking-wider">AI (O)</p><p className="text-4xl font-black">{aiScore}</p></div>
          <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center"><Bot className="w-6 h-6 text-pink-400" /></div>
        </div>
      </div>

      <div className="glass-panel p-8 rounded-3xl relative shadow-2xl border border-white/10 flex flex-col items-center">
        {isThinking && !winner && <div className="absolute top-4 right-4 animate-spin w-5 h-5 border-2 border-primary border-t-transparent rounded-full"></div>}
        
        <div className="grid grid-cols-3 gap-3 w-full max-w-sm mx-auto">
          {board.map((cell, i) => (
            <button
              key={i}
              onClick={() => handleClick(i)}
              disabled={!!cell || !!winner || isThinking}
              className={`aspect-square rounded-2xl flex items-center justify-center text-5xl transition-all ${
                !cell && !winner && !isThinking ? 'bg-white/5 hover:bg-white/10 cursor-pointer' : 'bg-white/5 cursor-default'
              } ${cell === 'X' ? 'text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]' : cell === 'O' ? 'text-pink-400 drop-shadow-[0_0_10px_rgba(236,72,153,0.5)]' : ''}`}
            >
              <AnimatePresence>
                {cell && (
                  <motion.div initial={{ scale: 0, rotate: cell === 'X' ? -45 : 45 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", bounce: 0.5 }}>
                    {cell === 'X' ? <X className="w-16 h-16" /> : <Circle className="w-16 h-16" />}
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          ))}
        </div>

        <AnimatePresence>
          {winner && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8 text-center w-full">
              <div className={`text-2xl font-black mb-6 ${winner === 'X' ? 'text-blue-400' : winner === 'O' ? 'text-pink-400' : 'text-gray-400'}`}>
                {winner === 'X' ? 'You Win!' : winner === 'O' ? 'AI Wins!' : 'Draw!'}
              </div>
              <button onClick={resetBoard} className="px-8 py-3 bg-white/10 hover:bg-white/20 rounded-full font-bold transition-all w-full max-w-xs mx-auto block">Play Again</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ReactionGame() {
  const [state, setState] = useState<"idle" | "waiting" | "ready" | "done">("idle");
  const [playerTime, setPlayerTime] = useState<number | null>(null);
  const [aiTime, setAiTime] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const aiTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startGame = () => {
    setState("waiting");
    setPlayerTime(null);
    setAiTime(null);
    
    const delay = Math.random() * 3000 + 2000;
    timeoutRef.current = setTimeout(() => {
      setState("ready");
      setStartTime(Date.now());
      
      const aiReaction = Math.floor(Math.random() * 150) + 200; // AI reacts in 200-350ms
      aiTimeoutRef.current = setTimeout(() => {
        setAiTime(aiReaction);
        setState("done");
      }, aiReaction);
    }, delay);
  };

  const handleClick = () => {
    if (state === "idle" || state === "done") {
      startGame();
    } else if (state === "waiting") {
      // Early click
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (aiTimeoutRef.current) clearTimeout(aiTimeoutRef.current);
      setState("done");
      setPlayerTime(-1); // Indicator for early click
      setAiTime(250);
    } else if (state === "ready") {
      // Valid click
      const reaction = Date.now() - startTime;
      if (aiTimeoutRef.current) clearTimeout(aiTimeoutRef.current);
      setPlayerTime(reaction);
      
      const generatedAiTime = Math.floor(Math.random() * 150) + 200;
      setAiTime(generatedAiTime);
      setState("done");
      
      if (reaction < generatedAiTime) {
        confetti({ particleCount: 100, spread: 60, origin: { y: 0.6 } });
      }
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (aiTimeoutRef.current) clearTimeout(aiTimeoutRef.current);
    };
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col space-y-8 relative z-10 text-center">
      <div className="space-y-4 mb-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 mb-2">
          <Zap className="w-4 h-4" />
          <span className="text-xs font-bold tracking-wider uppercase">Quick Draw</span>
        </div>
        <h1 className="text-4xl font-black tracking-tighter">Are you faster than AI?</h1>
      </div>
      
      <div 
        onClick={handleClick}
        className={`glass-panel rounded-3xl h-[400px] flex flex-col items-center justify-center cursor-pointer transition-all active:scale-[0.98] border-2 shadow-2xl ${
          state === "idle" ? "border-white/10 hover:bg-white/5" :
          state === "waiting" ? "border-red-500/50 bg-red-500/10" :
          state === "ready" ? "border-green-500/50 bg-green-500/20 shadow-[0_0_50px_rgba(34,197,94,0.3)]" :
          state === "done" && playerTime === -1 ? "border-red-500/50 bg-red-500/10" :
          state === "done" && playerTime !== null && aiTime !== null && playerTime < aiTime ? "border-green-500/50 bg-green-500/10" :
          "border-red-500/50 bg-red-500/10"
        }`}
      >
        <AnimatePresence mode="wait">
          {state === "idle" && (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-2xl font-bold text-gray-400">
              Click anywhere to start
            </motion.div>
          )}
          {state === "waiting" && (
            <motion.div key="waiting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-4xl font-black text-red-400 tracking-widest">
              WAIT...
            </motion.div>
          )}
          {state === "ready" && (
            <motion.div key="ready" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-6xl font-black text-green-400 tracking-widest drop-shadow-[0_0_20px_rgba(34,197,94,0.5)]">
              CLICK!
            </motion.div>
          )}
          {state === "done" && (
            <motion.div key="done" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-6">
              {playerTime === -1 ? (
                <div className="text-3xl font-black text-red-400 mb-2">Too Early!</div>
              ) : (
                <div className="text-3xl font-black text-white mb-2">
                  {playerTime !== null && aiTime !== null && playerTime < aiTime ? "You won!" : "AI won!"}
                </div>
              )}
              
              <div className="flex items-center gap-12">
                <div className="text-center">
                  <p className="text-sm text-gray-400 font-bold uppercase mb-2">Your Time</p>
                  <p className={`text-4xl font-black ${playerTime === -1 ? 'text-red-400' : 'text-blue-400'}`}>
                    {playerTime === -1 ? 'FAIL' : `${playerTime}ms`}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-400 font-bold uppercase mb-2">AI Time</p>
                  <p className="text-4xl font-black text-purple-400">{aiTime}ms</p>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-500 font-bold uppercase tracking-widest">Click to play again</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function NimGame() {
  const [matches, setMatches] = useState(21);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState<"Human" | "AI" | null>(null);

  const takeMatches = (count: number) => {
    if (winner || !isPlayerTurn || matches < count) return;
    
    const newMatches = matches - count;
    setMatches(newMatches);
    
    if (newMatches === 0) {
      setWinner("AI");
      return;
    }

    setIsPlayerTurn(false);
    
    setTimeout(() => {
      let aiTake = 1;
      const remainder = newMatches % 4;
      if (remainder === 0) aiTake = 3;
      else if (remainder === 2) aiTake = 1;
      else if (remainder === 3) aiTake = 2;
      else aiTake = Math.floor(Math.random() * 3) + 1; // AI makes a random move if forced into losing state
      
      aiTake = Math.min(aiTake, newMatches);
      const afterAi = newMatches - aiTake;
      
      setMatches(afterAi);
      if (afterAi === 0) {
        setWinner("Human");
        confetti({ particleCount: 100, spread: 60, origin: { y: 0.6 } });
      } else {
        setIsPlayerTurn(true);
      }
    }, 1000);
  };

  const resetGame = () => {
    setMatches(21);
    setIsPlayerTurn(true);
    setWinner(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col space-y-8 relative z-10 text-center">
      <div className="space-y-4 mb-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 text-red-400 border border-red-500/30 mb-2">
          <Flame className="w-4 h-4" />
          <span className="text-xs font-bold tracking-wider uppercase">Matchstick Math</span>
        </div>
        <h1 className="text-4xl font-black tracking-tighter">Don't take the last one!</h1>
        <p className="text-gray-400">Take 1, 2, or 3 matchsticks. The player who is forced to take the very last matchstick loses.</p>
      </div>

      <div className="glass-panel p-8 rounded-3xl relative shadow-2xl border border-white/10 min-h-[300px] flex flex-col items-center justify-between">
        {!isPlayerTurn && !winner && <div className="absolute top-4 right-4 animate-spin w-5 h-5 border-2 border-primary border-t-transparent rounded-full"></div>}
        
        <div className="flex flex-wrap justify-center gap-4 my-8">
          <AnimatePresence>
            {Array.from({ length: matches }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0 }}
                className="w-3 h-16 bg-gradient-to-b from-red-500 to-orange-700 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.3)] relative overflow-hidden"
              >
                <div className="absolute top-0 w-full h-3 bg-yellow-300 rounded-full"></div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="text-2xl font-bold mb-6">
          {matches} Matchstick{matches !== 1 && 's'} Remaining
        </div>

        <AnimatePresence mode="wait">
          {winner ? (
            <motion.div key="winner" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-4">
              <div className={`text-3xl font-black ${winner === 'Human' ? 'text-blue-400' : 'text-red-400'}`}>
                {winner === 'Human' ? 'You beat the AI!' : 'The AI crushed your logic.'}
              </div>
              <button onClick={resetGame} className="px-8 py-3 bg-white/10 hover:bg-white/20 rounded-full font-bold transition-all">Play Again</button>
            </motion.div>
          ) : (
            <motion.div key="actions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex gap-4">
              {[1, 2, 3].map((num) => (
                <button
                  key={num}
                  onClick={() => takeMatches(num)}
                  disabled={!isPlayerTurn || matches < num}
                  className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/30 disabled:opacity-30 disabled:pointer-events-none transition-all font-black text-2xl flex items-center justify-center hover:-translate-y-1 shadow-lg"
                >
                  -{num}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="mt-8 text-sm font-bold tracking-widest uppercase">
          {winner ? "Game Over" : isPlayerTurn ? <span className="text-blue-400">Your Turn</span> : <span className="text-red-400">AI's Turn...</span>}
        </div>
      </div>
    </div>
  );
}
