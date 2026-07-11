"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Image as ImageIcon, FileText, Code2, Mic, Palette, LayoutGrid, Heart, Trophy, Medal, 
  Crown, Star, Activity, Zap, ShieldAlert, Sparkles, BrainCircuit, Target, CheckCircle2 
} from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
  const [stats, setStats] = useState({ xp: 0, games: 0, accuracy: 0, correctAnswers: 0, totalAnswers: 0 });
  const [username, setUsername] = useState("Guest Player");
  
  useEffect(() => {
    try {
      const savedStats = JSON.parse(localStorage.getItem('truthlens_stats') || '{"xp":0,"games":0,"accuracy":0,"totalAnswers":0,"correctAnswers":0}');
      setStats(savedStats);
      const name = localStorage.getItem('truthlens_username');
      if (name) setUsername(name);
    } catch(e) {}
  }, []);

  const level = Math.max(1, Math.floor(stats.xp / 1000) + 1);
  const xpForNextLevel = level * 1000;
  const progressToNextLevel = ((stats.xp % 1000) / 1000) * 100;

  const categories = [
    { id: "image", title: "Images", icon: <ImageIcon className="w-8 h-8" />, desc: "Photographs, nature, architecture", color: "blue", link: "/play?mode=image" },
    { id: "artwork", title: "Artwork", icon: <Palette className="w-8 h-8" />, desc: "Oil paintings, anime, pixel art", color: "purple", link: "/play?mode=artwork" },
    { id: "text", title: "Text", icon: <FileText className="w-8 h-8" />, desc: "Essays, emails, news, blogs", color: "green", link: "/play?mode=text" },
    { id: "code", title: "Code", icon: <Code2 className="w-8 h-8" />, desc: "Python, JS, Java, React", color: "orange", link: "/play?mode=code" },
    { id: "voice", title: "Voice", icon: <Mic className="w-8 h-8" />, desc: "Speech, intonation, pauses", color: "pink", link: "/play?mode=voice" },
    { id: "mixed", title: "Mixed Challenge", icon: <LayoutGrid className="w-8 h-8" />, desc: "Randomly selected from all", color: "primary", link: "/play?mode=mixed" },
    { id: "lightning", title: "Lightning Mode", icon: <Zap className="w-8 h-8" />, desc: "30s timer. Combo multipliers.", color: "yellow", link: "/play?mode=lightning" },
    { id: "survival", title: "Survival Mode", icon: <Heart className="w-8 h-8" />, desc: "One life. Longest streak.", color: "red", link: "/play?mode=survival" },
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue': return 'text-blue-400 bg-blue-500/10 border-blue-500/20 hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]';
      case 'purple': return 'text-purple-400 bg-purple-500/10 border-purple-500/20 hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]';
      case 'green': return 'text-green-400 bg-green-500/10 border-green-500/20 hover:border-green-500/50 hover:shadow-[0_0_30px_rgba(34,197,94,0.2)]';
      case 'orange': return 'text-orange-400 bg-orange-500/10 border-orange-500/20 hover:border-orange-500/50 hover:shadow-[0_0_30px_rgba(249,115,22,0.2)]';
      case 'pink': return 'text-pink-400 bg-pink-500/10 border-pink-500/20 hover:border-pink-500/50 hover:shadow-[0_0_30px_rgba(236,72,153,0.2)]';
      case 'yellow': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20 hover:border-yellow-500/50 hover:shadow-[0_0_30px_rgba(234,179,8,0.2)]';
      case 'red': return 'text-red-400 bg-red-500/10 border-red-500/20 hover:border-red-500/50 hover:shadow-[0_0_30px_rgba(239,68,68,0.2)]';
      case 'primary': default: return 'text-primary bg-primary/10 border-primary/20 hover:border-primary/50 hover:shadow-[0_0_30px_rgba(139,92,246,0.2)]';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col items-center justify-center py-12 relative z-10 space-y-16">
      
      {/* Hero Section */}
      <div className="text-center space-y-6 mt-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/30 mb-6 backdrop-blur-md shadow-[0_0_20px_rgba(139,92,246,0.2)]">
            <Sparkles className="w-5 h-5 animate-pulse" />
            <span className="text-sm font-bold tracking-wider uppercase">AI Detection Academy</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4 leading-tight">
            Master the art of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-primary to-blue-500 animate-pulse-glow text-glow">
              Digital Truth
            </span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed">
            The premium gamified platform engineered to sharpen your intuition against deepfakes, synthetic text, and AI generation.
          </p>
        </motion.div>
      </div>

      {/* Dashboard Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-full glass-panel rounded-[2rem] p-8 border border-white/10 shadow-2xl overflow-hidden relative bg-[#0a0a0f]"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-blue-500/10 opacity-30"></div>
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center justify-between">
          
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center p-1 shadow-[0_0_30px_rgba(139,92,246,0.4)]">
                <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                  <span className="text-3xl font-black text-white">{level}</span>
                </div>
              </div>
              <Crown className="w-8 h-8 text-yellow-400 absolute -top-3 -right-3 drop-shadow-lg rotate-12" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white mb-1">{username}</h2>
              <p className="text-sm font-bold text-primary uppercase tracking-widest mb-3">Level {level} Investigator</p>
              <div className="w-48 h-2.5 bg-white/10 rounded-full overflow-hidden shadow-inner">
                <motion.div 
                  className="h-full bg-gradient-to-r from-primary to-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressToNextLevel}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2 font-bold">{stats.xp} / {xpForNextLevel} XP</p>
            </div>
          </div>

          <div className="flex gap-4 sm:gap-8 flex-wrap justify-center">
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center min-w-[100px]">
              <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
              <p className="text-2xl font-black text-white">{stats.xp}</p>
              <p className="text-xs text-gray-400 font-bold uppercase">Total XP</p>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center min-w-[100px]">
              <Target className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <p className="text-2xl font-black text-white">{stats.accuracy}%</p>
              <p className="text-xs text-gray-400 font-bold uppercase">Accuracy</p>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center min-w-[100px]">
              <Activity className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <p className="text-2xl font-black text-white">{stats.games}</p>
              <p className="text-xs text-gray-400 font-bold uppercase">Games Played</p>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center min-w-[100px]">
              <CheckCircle2 className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <p className="text-2xl font-black text-white">{stats.correctAnswers}</p>
              <p className="text-xs text-gray-400 font-bold uppercase">Correct</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Game Categories */}
      <div className="w-full space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-white uppercase tracking-wider flex items-center gap-3">
            <LayoutGrid className="w-6 h-6 text-primary" /> Training Curriculum
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, i) => (
            <Link href={cat.link} key={cat.id}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + i * 0.1 }}
                className={`group glass-panel p-6 rounded-3xl flex flex-col items-start h-full transition-all border ${getColorClasses(cat.color)}`}
              >
                <div className="mb-4 p-3 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 group-hover:scale-110 transition-transform shadow-lg relative z-10">
                  {cat.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all">{cat.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed font-medium">{cat.desc}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
