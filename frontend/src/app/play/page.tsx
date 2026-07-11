"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, ArrowRight, AlertCircle, Sparkles, Flame, Clock, Trophy, Heart, Zap, LayoutGrid, Volume2, VolumeX, BarChart3, Medal, BrainCircuit, Activity, User, Bot } from "lucide-react";
import confetti from "canvas-confetti";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

interface Question {
  id: number;
  type: string;
  content_url: string | null;
  text_content: string | null;
  is_ai: number | null;
  options: string | null;
  correct_option: number | null;
  explanation: string;
  difficulty: string;
  category: string;
}

const DEFAULT_ROUND_TIME = 15;
const LIGHTNING_TOTAL_TIME = 30;

function PlayAreaContent() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [gameMode, setGameMode] = useState<string | null>(null);
  
  const [timeLeft, setTimeLeft] = useState(DEFAULT_ROUND_TIME);
  const [gameOver, setGameOver] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [username, setUsername] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [lives, setLives] = useState<number | null>(null);
  const [audioMuted, setAudioMuted] = useState(false);

  // Stats for result screen
  const [categoryStats, setCategoryStats] = useState<Record<string, { total: number, correct: number }>>({});
  const [totalTimeTaken, setTotalTimeTaken] = useState(0);
  const startTimeRef = useRef<number>(Date.now());

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("truthlens_username");
    if (saved) setUsername(saved);
    const muted = localStorage.getItem("truthlens_muted");
    if (muted === 'true') setAudioMuted(true);
  }, []);

  const playSound = (type: 'correct' | 'wrong' | 'victory') => {
    if (audioMuted) return;
    const url = 
      type === 'correct' ? 'https://actions.google.com/sounds/v1/ui/coins_drop.ogg' :
      type === 'wrong' ? 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg' :
      'https://actions.google.com/sounds/v1/crowds/crowd_cheer_and_applause.ogg';
    const audio = new Audio(url);
    audio.volume = 0.5;
    audio.play().catch(()=>{});
  }

  const toggleMute = () => {
    setAudioMuted(!audioMuted);
    localStorage.setItem("truthlens_muted", (!audioMuted).toString());
  }

  useEffect(() => {
    if (!gameMode) return;
    setLoading(true);
    fetch("http://localhost:8000/questions/")
      .then((res) => res.json())
      .then((data) => {
        let filtered = data;
        
        if (gameMode === 'image') {
           filtered = data.filter((q: Question) => q.type === 'image' || q.type === 'video');
        } else if (gameMode === 'artwork') {
           filtered = data.filter((q: Question) => q.type === 'artwork');
        } else if (gameMode === 'text') {
           filtered = data.filter((q: Question) => q.type === 'text');
        } else if (gameMode === 'voice') {
           filtered = data.filter((q: Question) => q.type === 'voice');
        } else if (gameMode === 'code') {
           filtered = data.filter((q: Question) => q.type === 'code');
        } else if (gameMode === 'social') {
           filtered = data.filter((q: Question) => q.type === 'social');
        }
        
        let shuffled = [...filtered].sort(() => 0.5 - Math.random());
        
        if (gameMode === 'mixed' || gameMode === 'survival' || gameMode === 'lightning') {
          // Shuffle with no two consecutive categories
          const categoriesObj: Record<string, Question[]> = {};
          shuffled.forEach(q => {
            if(!categoriesObj[q.category]) categoriesObj[q.category] = [];
            categoriesObj[q.category].push(q);
          });
          const newShuffled: Question[] = [];
          let lastCat = "";
          let attempts = 0;
          while(newShuffled.length < shuffled.length && attempts < 1000) {
            attempts++;
            const availableCats = Object.keys(categoriesObj).filter(c => c !== lastCat && categoriesObj[c].length > 0);
            if (availableCats.length === 0) {
              // fallback if only one category left
              const remaining = Object.keys(categoriesObj).find(c => categoriesObj[c].length > 0);
              if (remaining) {
                newShuffled.push(categoriesObj[remaining].pop()!);
                lastCat = remaining;
              }
            } else {
              const pickCat = availableCats[Math.floor(Math.random() * availableCats.length)];
              newShuffled.push(categoriesObj[pickCat].pop()!);
              lastCat = pickCat;
            }
          }
          shuffled = newShuffled.length > 0 ? newShuffled : shuffled;
        }

        setQuestions(shuffled);
        
        // Mode Specific setups
        if (gameMode === 'lightning') {
          setTimeLeft(LIGHTNING_TOTAL_TIME);
        } else {
          setTimeLeft(DEFAULT_ROUND_TIME);
        }
        
        if (gameMode === 'survival') {
          setLives(1);
        } else {
          setLives(null);
        }
        
        setLoading(false);
        startTimeRef.current = Date.now();
      })
      .catch((err) => {
        console.error("Failed to fetch questions", err);
        setLoading(false);
      });
  }, [gameMode]);

  useEffect(() => {
    if (!loading && !hasAnswered && !gameOver && questions.length > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [loading, hasAnswered, gameOver, currentIndex, questions.length]);

  const handleTimeUp = () => {
    if (gameMode === 'lightning') {
      endGame();
      return;
    }
    setIsCorrect(false);
    setHasAnswered(true);
    setStreak(0);
    playSound('wrong');
    if (lives !== null) {
      setLives(0);
      setTimeout(() => endGame(), 2000);
    }
  };

  const handleAnswer = (guessedAI: boolean | null, guessedOptionIndex: number | null = null) => {
    if (hasAnswered) return;
    if (timerRef.current) clearInterval(timerRef.current);
    
    const timeSpent = (gameMode === 'lightning' ? 1 : DEFAULT_ROUND_TIME - timeLeft);
    setTotalTimeTaken(prev => prev + timeSpent);

    const currentQ = questions[currentIndex];
    
    let correct = false;
    if (currentQ.type === 'multiple_choice' && guessedOptionIndex !== null) {
      correct = guessedOptionIndex === currentQ.correct_option;
    } else if (guessedAI !== null) {
      const actuallyAI = currentQ.is_ai === 1;
      correct = guessedAI === actuallyAI;
    }
    
    setIsCorrect(correct);
    setHasAnswered(true);
    
    setCategoryStats(prev => {
      const cat = currentQ.category || 'General';
      const stats = prev[cat] || { total: 0, correct: 0 };
      return {
        ...prev,
        [cat]: { total: stats.total + 1, correct: stats.correct + (correct ? 1 : 0) }
      };
    });

    if (correct) {
      playSound('correct');
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);
      setCorrectAnswers(c => c + 1);

      const multiplier = 1 + (newStreak * 0.2);
      const timeBonus = gameMode === 'lightning' ? 10 : Math.max(0, timeLeft * 2);
      const points = Math.round(100 * multiplier + timeBonus);
      setScore(s => s + points);
      
      confetti({
        particleCount: 100 + (newStreak * 20),
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#8b5cf6', '#a855f7', '#ffffff', '#fbbf24']
      });

      if (gameMode === 'lightning') {
        setTimeout(nextQuestion, 800); // auto-advance in lightning mode for speed
      }

    } else {
      playSound('wrong');
      setStreak(0);
      if (lives !== null) {
        setLives(l => l! - 1);
        setTimeout(() => endGame(), 3000); // end game after showing explanation
      }
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(c => c + 1);
      setHasAnswered(false);
      setIsCorrect(null);
      if (gameMode !== 'lightning') {
        setTimeLeft(DEFAULT_ROUND_TIME);
      }
    } else {
      endGame();
    }
  };

  const endGame = () => {
    setGameOver(true);
    playSound('victory');
    
    // Update local profile stats
    try {
      const existing = JSON.parse(localStorage.getItem('truthlens_stats') || '{"xp":0,"games":0,"accuracy":0,"totalAnswers":0,"correctAnswers":0}');
      existing.games += 1;
      existing.xp += score;
      existing.totalAnswers += (currentIndex + 1);
      existing.correctAnswers += correctAnswers;
      existing.accuracy = Math.round((existing.correctAnswers / existing.totalAnswers) * 100);
      localStorage.setItem('truthlens_stats', JSON.stringify(existing));
    } catch(e) {}
  };

  const searchParams = useSearchParams();
  
  useEffect(() => {
    const mode = searchParams.get('mode');
    if (mode) {
      setGameMode(mode);
    }
  }, [searchParams]);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>;
  
  if (!gameMode) {
    return (
      <div className="text-center p-8 glass-panel rounded-2xl max-w-md mx-auto mt-20">
        <AlertCircle className="w-12 h-12 mx-auto text-destructive mb-4" />
        <h2 className="text-xl font-bold text-white mb-4">No Curriculum Selected</h2>
        <p className="text-gray-400 mb-6 text-sm">Please select a training module from the academy dashboard.</p>
        <Link href="/" className="px-6 py-3 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary/80 transition-colors">
          Return to Academy
        </Link>
      </div>
    );
  }
  
  if (!questions.length) return <div className="text-center p-8 glass-panel rounded-2xl max-w-md mx-auto mt-20"><AlertCircle className="w-12 h-12 mx-auto text-destructive mb-4" />No questions available for this category. The academy is empty!</div>;

  if (gameOver) {
    const accuracy = Math.round((correctAnswers / (currentIndex + 1)) * 100) || 0;
    const avgResponseTime = Math.round((totalTimeTaken / (currentIndex + 1)) * 10) / 10 || 0;
    
    // Find best and weakest category
    let bestCat = "None";
    let bestAcc = -1;
    let weakCat = "None";
    let weakAcc = 101;
    Object.keys(categoryStats).forEach(cat => {
      const stats = categoryStats[cat];
      const acc = (stats.correct / stats.total) * 100;
      if (acc > bestAcc) { bestAcc = acc; bestCat = cat; }
      if (acc < weakAcc) { weakAcc = acc; weakCat = cat; }
    });

    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-3xl mx-auto glass-panel p-10 rounded-3xl text-center space-y-8 mt-8 border border-white/10 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent"></div>
        <div className="relative z-10">
          <Trophy className="w-24 h-24 mx-auto text-yellow-400 mb-6 drop-shadow-[0_0_20px_rgba(250,204,21,0.5)]" />
          <div>
            <h1 className="text-5xl font-extrabold mb-2 bg-gradient-to-r from-primary via-purple-400 to-primary bg-clip-text text-transparent animate-[shimmer_3s_infinite]">Mission Complete</h1>
            <p className="text-xl text-muted-foreground">Here is your academic performance report.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-2">Final Score</p>
              <p className="text-3xl font-black text-white">{score}</p>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-2">Accuracy</p>
              <p className={`text-3xl font-black ${accuracy >= 80 ? 'text-green-400' : accuracy >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>{accuracy}%</p>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-2">XP Earned</p>
              <p className="text-3xl font-black text-purple-400">+{Math.round(score * 1.5)}</p>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-2">Avg Speed</p>
              <p className="text-3xl font-black text-blue-400">{avgResponseTime}s</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
             <div className="bg-green-500/10 p-4 rounded-2xl border border-green-500/20 text-left">
                <p className="text-xs text-green-400 font-bold uppercase tracking-wider mb-1">Strongest Domain</p>
                <p className="text-lg font-bold text-white">{bestCat} <span className="text-green-400 text-sm">({Math.round(bestAcc)}%)</span></p>
             </div>
             {weakAcc === 100 ? (
               <div className="bg-green-500/10 p-4 rounded-2xl border border-green-500/20 text-left">
                  <p className="text-xs text-green-400 font-bold uppercase tracking-wider mb-1">Mastery Achieved</p>
                  <p className="text-lg font-bold text-white">Flawless Performance</p>
               </div>
             ) : (
               <div className="bg-red-500/10 p-4 rounded-2xl border border-red-500/20 text-left">
                  <p className="text-xs text-red-400 font-bold uppercase tracking-wider mb-1">Needs Improvement</p>
                  <p className="text-lg font-bold text-white">{weakCat} <span className="text-red-400 text-sm">({Math.round(weakAcc)}%)</span></p>
               </div>
             )}
          </div>

          <div className="pt-8 flex flex-col items-center gap-4 border-t border-white/10 mt-8">
            <h3 className="text-lg font-bold text-white mb-2">Submit to Global Leaderboard</h3>
            <div className="flex w-full max-w-md items-center space-x-2">
              <input 
                type="text" 
                placeholder="Enter Academy ID (Username)" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="flex h-12 w-full rounded-xl border border-white/20 bg-black/50 px-4 py-2 text-base text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-inner"
              />
              <button
                disabled={isSubmitting || !username.trim()}
                onClick={async () => {
                  setIsSubmitting(true);
                  localStorage.setItem("truthlens_username", username);
                  try {
                    await fetch("http://localhost:8000/leaderboard/", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ username, score })
                    });
                    router.push("/leaderboard");
                  } catch (e) {
                    console.error(e);
                    setIsSubmitting(false);
                  }
                }}
                className="inline-flex items-center justify-center rounded-xl text-base font-bold transition-all focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-white hover:bg-primary/80 h-12 px-6 hover:scale-105 shadow-[0_0_20px_rgba(139,92,246,0.5)]"
              >
                {isSubmitting ? "Syncing..." : "Submit"}
              </button>
            </div>
            <div className="flex gap-4 mt-4">
              <button onClick={() => window.location.reload()} className="px-6 py-2 rounded-full border border-white/20 text-sm font-bold hover:bg-white/10 transition-colors">Play Again</button>
              <Link href="/leaderboard" className="px-6 py-2 rounded-full border border-white/20 text-sm font-bold hover:bg-white/10 transition-colors">
                View Rankings
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  const q = questions[currentIndex];

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col space-y-6 relative mt-4">
      
      {/* Top HUD (Heads Up Display) */}
      <div className="flex items-center justify-between glass-panel px-6 py-4 rounded-2xl shadow-xl border border-white/10 sticky top-20 z-40 bg-[#0a0a0f]/80 backdrop-blur-xl">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
             <div className="bg-primary/20 p-2 rounded-lg border border-primary/30">
               <Activity className="w-5 h-5 text-primary" />
             </div>
             <div>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider hidden sm:block">Progress</p>
                <div className="flex gap-1 mt-1">
                  {gameMode === 'lightning' ? (
                     <span className="text-sm font-bold text-white">Q: {currentIndex + 1}</span>
                  ) : (
                    [...Array(questions.length)].map((_, i) => (
                      <div 
                        key={i} 
                        className={`h-1.5 w-3 sm:w-6 rounded-full transition-all duration-300 ${
                          i < currentIndex ? "bg-primary shadow-[0_0_8px_rgba(139,92,246,0.8)]" : i === currentIndex ? "bg-white animate-pulse" : "bg-white/10"
                        }`} 
                      />
                    ))
                  )}
                </div>
             </div>
          </div>
          
          {lives !== null && (
            <div className="flex items-center gap-2 bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-500/20">
              <Heart className={`w-5 h-5 ${lives > 0 ? 'text-red-500 animate-pulse' : 'text-gray-600'}`} fill={lives > 0 ? "currentColor" : "none"} />
              <span className="font-bold text-red-100 hidden sm:inline">Survival</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-6">
          <div className={`flex flex-col items-end sm:flex-row sm:items-center gap-1 sm:gap-2 font-bold transition-colors ${streak >= 3 ? 'text-orange-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.8)]' : 'text-gray-400'}`}>
            <span className="text-xs uppercase tracking-wider text-muted-foreground hidden sm:block">Streak</span>
            <div className="flex items-center gap-1">
               <Flame className={`w-5 h-5 ${streak >= 3 ? 'animate-pulse' : ''}`} /> x{streak}
            </div>
          </div>
          <div className="w-px h-8 bg-white/10 hidden sm:block"></div>
          <div className="flex flex-col items-end sm:flex-row sm:items-center gap-1 sm:gap-2 font-black text-xl text-white">
            <span className="text-xs uppercase tracking-wider text-muted-foreground hidden sm:block font-bold">XP</span>
            <div className="flex items-center gap-1">
              <Sparkles className="w-5 h-5 text-yellow-400" /> {score}
            </div>
          </div>
          <button onClick={toggleMute} className="text-gray-400 hover:text-white transition-colors ml-2 hidden sm:block">
            {audioMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Timer Bar */}
      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden shadow-inner relative">
        <motion.div 
          className={`h-full absolute left-0 top-0 ${timeLeft <= 5 ? 'bg-destructive shadow-[0_0_10px_rgba(239,68,68,0.8)]' : gameMode === 'lightning' ? 'bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.8)]' : 'bg-primary shadow-[0_0_10px_rgba(139,92,246,0.8)]'}`}
          initial={{ width: "100%" }}
          animate={{ width: `${(timeLeft / (gameMode === 'lightning' ? LIGHTNING_TOTAL_TIME : DEFAULT_ROUND_TIME)) * 100}%` }}
          transition={{ duration: 1, ease: "linear" }}
        />
      </div>

      {/* Main Content Area */}
      <div className="glass-panel p-6 sm:p-10 rounded-[2.5rem] min-h-[450px] flex flex-col items-center justify-center relative shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 bg-[#0d0d14]">
        <div className="absolute top-6 left-8 flex items-center gap-3 z-10">
          <span className="text-xs font-black uppercase tracking-widest text-white bg-white/10 px-4 py-1.5 rounded-full border border-white/20 backdrop-blur-md">
            {q.category}
          </span>
          <span className={`text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full border backdrop-blur-md ${
             q.difficulty === 'easy' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
             q.difficulty === 'medium' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
             'bg-red-500/20 text-red-300 border-red-500/30'
          }`}>
            {q.difficulty}
          </span>
        </div>
        
        <div className="absolute top-6 right-8 flex items-center gap-2 z-10 bg-black/50 px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
          <Clock className={`w-4 h-4 ${timeLeft <= 5 ? 'text-destructive animate-pulse' : 'text-gray-300'}`} />
          <span className={`font-mono font-bold ${timeLeft <= 5 ? 'text-destructive' : 'text-white'}`}>{timeLeft}s</span>
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={q.id}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.05, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="w-full flex flex-col items-center mt-12 mb-8 z-0"
          >
            {(q.type === 'image' || q.type === 'artwork') && q.content_url && (
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black p-2 group">
                <img src={q.content_url} alt="Content" className="max-h-[500px] w-auto object-contain rounded-xl transition-transform duration-700 group-hover:scale-[1.02]" />
              </div>
            )}

            {q.type === 'video' && q.content_url && (
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black p-2">
                <video controls className="max-h-[500px] w-auto rounded-xl">
                  <source src={q.content_url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
            
            {(q.type === 'text' || q.type === 'code' || q.type === 'multiple_choice') && q.text_content && (
              <div className="w-full max-w-4xl bg-[#09090b] p-8 rounded-2xl border border-white/20 font-sans text-lg overflow-x-auto shadow-inner">
                {q.type === 'code' && <div className="mb-4 text-sm font-bold text-gray-400 uppercase tracking-widest">Code Snippet</div>}
                <pre className={`whitespace-pre-wrap text-gray-100 leading-relaxed ${q.type === 'code' ? 'font-mono text-base' : 'text-xl font-medium'}`}>{q.text_content}</pre>
              </div>
            )}

            {q.type === 'social' && q.text_content && (
              <div className="w-full max-w-2xl bg-[#15202b] p-8 rounded-3xl border border-gray-800 shadow-2xl hover:border-gray-700 transition-colors">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 shadow-lg"></div>
                  <div>
                    <p className="font-bold text-white text-lg leading-tight hover:underline cursor-pointer">Anonymous User</p>
                    <p className="text-gray-500 text-base">@anonymous_123</p>
                  </div>
                </div>
                <p className="text-white text-2xl leading-snug whitespace-pre-wrap font-medium">{q.text_content}</p>
                <div className="mt-6 text-gray-500 text-base flex gap-8 border-t border-gray-800 pt-4">
                  <span className="hover:text-blue-400 cursor-pointer transition-colors flex items-center gap-2">💬 12</span>
                  <span className="hover:text-green-400 cursor-pointer transition-colors flex items-center gap-2">🔄 45</span>
                  <span className="hover:text-pink-400 cursor-pointer transition-colors flex items-center gap-2">❤️ 892</span>
                </div>
              </div>
            )}

            {q.type === 'voice' && (
              <div className="w-full max-w-2xl bg-[#0d0d12] p-12 rounded-3xl border border-white/10 flex flex-col items-center justify-center space-y-8 shadow-inner">
                <div className="relative">
                  <div className="absolute inset-0 bg-pink-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                  <div className="w-28 h-28 rounded-full bg-pink-500/20 flex items-center justify-center border border-pink-500/30 relative z-10 shadow-2xl">
                    <Flame className="w-14 h-14 text-pink-400" />
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-bold text-white tracking-widest uppercase">Audio Intercepted</h3>
                  <p className="text-gray-400 text-base max-w-sm">Analyze the waveform. Listen for unnatural robotic pacing or breathing artifacts.</p>
                </div>
                {q.content_url ? (
                  <div className="w-full max-w-lg p-6 rounded-2xl bg-white/5 border border-white/10 shadow-lg backdrop-blur-sm">
                    <audio controls className="w-full custom-audio" autoPlay={false}>
                      <source src={q.content_url} type="audio/mpeg" />
                      <source src={q.content_url} type="audio/ogg" />
                    </audio>
                  </div>
                ) : (
                   <pre className="whitespace-pre-wrap text-gray-300 text-sm leading-relaxed mt-4 p-6 bg-white/5 border border-white/10 rounded-xl w-full text-center">{q.text_content}</pre>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
          {/* Action Buttons */}
      <div className={`grid gap-6 relative z-20 ${q.type === 'multiple_choice' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 md:grid-cols-2'}`}>
        
        {q.type === 'multiple_choice' && q.options ? (
          JSON.parse(q.options).map((option: string, index: number) => {
            const isCorrectOption = index === q.correct_option;
            const isSelected = hasAnswered; // Disable all if answered
            
            let btnClass = 'bg-[#111827] hover:bg-[#1f2937] text-white border-2 border-white/10 hover:border-primary/50 shadow-xl';
            
            if (hasAnswered) {
              if (isCorrectOption) {
                 btnClass = 'bg-primary/20 text-primary border-primary/50 border-2 shadow-[0_0_30px_rgba(139,92,246,0.4)]';
              } else {
                 btnClass = 'bg-white/5 text-muted-foreground opacity-50 border-2 border-transparent grayscale';
              }
            }
            
            return (
              <button
                key={index}
                onClick={() => handleAnswer(null, index)}
                disabled={hasAnswered}
                className={`relative overflow-hidden group p-6 rounded-2xl font-bold text-lg md:text-xl tracking-wide transition-all duration-300 ${btnClass} hover:scale-[1.02]`}
              >
                {hasAnswered && isCorrectOption && <Check className="absolute top-1/2 right-4 -translate-y-1/2 w-6 h-6 text-primary" />}
                <span className="flex items-center text-left">
                   {option}
                </span>
              </button>
            )
          })
        ) : (
          <>
            <button
              onClick={() => handleAnswer(false)}
              disabled={hasAnswered}
              className={`relative overflow-hidden group p-8 rounded-3xl font-black text-2xl tracking-wide transition-all duration-300 ${
                hasAnswered 
                  ? q.is_ai === 0 
                    ? 'bg-green-500/20 text-green-400 border-green-500/50 border-2 shadow-[0_0_30px_rgba(34,197,94,0.3)]' 
                    : 'bg-white/5 text-muted-foreground opacity-50 border-2 border-transparent grayscale'
                  : 'bg-[#111827] hover:bg-[#1f2937] text-white border-2 border-white/10 hover:border-green-500/50 hover:scale-[1.02] shadow-xl'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
              {hasAnswered && q.is_ai === 0 && <Check className="absolute top-1/2 right-8 -translate-y-1/2 w-10 h-10 text-green-400" />}
              <span className="flex items-center justify-center gap-3">
                 <User className="w-8 h-8 opacity-70 group-hover:opacity-100 transition-opacity" />
                 HUMAN
              </span>
            </button>
            
            <button
              onClick={() => handleAnswer(true)}
              disabled={hasAnswered}
              className={`relative overflow-hidden group p-8 rounded-3xl font-black text-2xl tracking-wide transition-all duration-300 ${
                hasAnswered 
                  ? q.is_ai === 1 
                    ? 'bg-primary/20 text-primary border-primary/50 border-2 shadow-[0_0_30px_rgba(139,92,246,0.4)]' 
                    : 'bg-white/5 text-muted-foreground opacity-50 border-2 border-transparent grayscale'
                  : 'bg-[#111827] hover:bg-[#1f2937] text-white border-2 border-white/10 hover:border-primary/50 hover:scale-[1.02] shadow-xl'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
              {hasAnswered && q.is_ai === 1 && <Check className="absolute top-1/2 right-8 -translate-y-1/2 w-10 h-10 text-primary" />}
              <span className="flex items-center justify-center gap-3">
                <Bot className="w-8 h-8 opacity-70 group-hover:opacity-100 transition-opacity" />
                AI GENERATED
              </span>
            </button>
          </>
        )}
      </div>    </div>

      {/* Educational Explanation Card */}
      <AnimatePresence>
        {hasAnswered && gameMode !== 'lightning' && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={`w-full glass-panel p-8 rounded-3xl border-l-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 shadow-2xl relative overflow-hidden ${
              isCorrect ? 'border-l-green-500 bg-green-950/20' : 'border-l-destructive bg-red-950/20'
            }`}
          >
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>
            
            <div className="flex-1 space-y-4 z-10">
              <div className="flex flex-wrap items-center gap-4">
                {isCorrect ? (
                  <div className="flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-1.5 rounded-full font-black text-sm uppercase tracking-widest shadow-inner border border-green-500/30">
                    <Check className="w-5 h-5"/> Correct
                  </div>
                ) : (
                  <div className="flex items-center gap-2 bg-destructive/20 text-destructive px-4 py-1.5 rounded-full font-black text-sm uppercase tracking-widest shadow-inner border border-destructive/30">
                    <X className="w-5 h-5"/> {timeLeft <= 1 ? "Time Up" : "Incorrect"}
                  </div>
                )}
                <h4 className="text-xl font-bold text-white">
                  {q.type === 'multiple_choice' ? (
                     <>Truth: The correct answer is <span className="text-primary">{JSON.parse(q.options || "[]")[q.correct_option || 0]}</span></>
                  ) : (
                     <>Truth: This content is <span className={q.is_ai ? 'text-primary' : 'text-green-400'}>{q.is_ai === 1 ? 'AI Generated' : 'Human Created'}</span></>
                  )}
                </h4>
              </div>
              
              <div className="bg-black/40 p-6 rounded-2xl border border-white/5">
                <h5 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-3 flex items-center gap-2">
                   <BrainCircuit className="w-4 h-4" /> Educational Analysis
                </h5>
                <p className="text-gray-100 leading-relaxed text-lg md:text-xl font-medium">
                  {q.explanation}
                </p>
              </div>
            </div>
            
            <button
              onClick={nextQuestion}
              className="shrink-0 z-10 group flex items-center justify-center gap-3 bg-white text-black px-10 py-5 rounded-2xl font-black text-lg hover:bg-gray-200 transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] w-full md:w-auto"
            >
              Next Challenge <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function PlayArea() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>}>
      <PlayAreaContent />
    </Suspense>
  );
}
