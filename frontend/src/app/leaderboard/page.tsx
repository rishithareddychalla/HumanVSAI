"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Medal, User } from "lucide-react";

interface LeaderboardUser {
  id: number;
  username: string;
  score: number;
  level: number;
  xp: number;
}

export default function Leaderboard() {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/leaderboard/")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch leaderboard", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>;

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col space-y-8">
      <div className="text-center space-y-4 mb-8">
        <Trophy className="w-16 h-16 mx-auto text-yellow-400" />
        <h1 className="text-4xl font-extrabold tracking-tight">Global Leaderboard</h1>
        <p className="text-muted-foreground">The top detectors in the TruthLens network.</p>
      </div>

      <div className="glass-panel rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/10 bg-white/5 font-semibold text-sm text-muted-foreground">
          <div className="col-span-2 text-center">Rank</div>
          <div className="col-span-6">Detector</div>
          <div className="col-span-2 text-center">Level</div>
          <div className="col-span-2 text-right pr-4">Score</div>
        </div>
        
        <div className="flex flex-col">
          {users.map((user, index) => (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              key={user.id}
              className={`grid grid-cols-12 gap-4 p-4 items-center border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors ${
                index === 0 ? 'bg-primary/5' : ''
              }`}
            >
              <div className="col-span-2 flex justify-center">
                {index === 0 ? <Medal className="w-6 h-6 text-yellow-400" /> : 
                 index === 1 ? <Medal className="w-6 h-6 text-gray-300" /> : 
                 index === 2 ? <Medal className="w-6 h-6 text-amber-600" /> : 
                 <span className="font-bold text-muted-foreground">#{index + 1}</span>}
              </div>
              <div className="col-span-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/40 to-purple-600/40 flex items-center justify-center">
                  <User className="w-5 h-5 text-white/70" />
                </div>
                <span className="font-bold text-lg">{user.username}</span>
              </div>
              <div className="col-span-2 text-center">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-xs font-bold">
                  {user.level}
                </span>
              </div>
              <div className="col-span-2 text-right pr-4 font-mono font-bold text-primary">
                {user.score.toLocaleString()}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
