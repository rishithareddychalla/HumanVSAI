"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ScanEye, Trophy, Settings, PlayCircle, Bot } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="w-full glass-panel border-b border-white/10 sticky top-0 z-50 backdrop-blur-2xl bg-black/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 180, scale: 1.1 }}
              transition={{ duration: 0.4, type: "spring" }}
              className="relative"
            >
              <div className="absolute inset-0 bg-primary/40 rounded-full blur-md group-hover:bg-primary/60 transition-colors"></div>
              <ScanEye className="w-9 h-9 text-white relative z-10 drop-shadow-[0_0_10px_rgba(139,92,246,0.8)]" />
            </motion.div>
            <span className="font-black text-2xl tracking-tighter bg-gradient-to-r from-white via-gray-200 to-gray-500 bg-clip-text text-transparent group-hover:text-white transition-all drop-shadow-sm">
              TruthLens
            </span>
          </Link>
          
          <div className="flex items-center gap-8">
            <Link 
              href="/leaderboard" 
              className={`flex items-center gap-2 text-sm font-bold transition-all hover:-translate-y-0.5 ${pathname === '/leaderboard' ? 'text-primary drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]' : 'text-gray-400 hover:text-white'}`}
            >
              <Trophy className="w-4 h-4" />
              Leaderboard
            </Link>
            <Link 
              href="/settings" 
              className={`flex items-center gap-2 text-sm font-bold transition-all hover:-translate-y-0.5 ${pathname === '/settings' ? 'text-primary drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]' : 'text-gray-400 hover:text-white'}`}
            >
              <Settings className="w-4 h-4" />
              Settings
            </Link>
            <Link 
              href="/vs-ai" 
              className={`flex items-center gap-2 text-sm font-bold transition-all hover:-translate-y-0.5 ${pathname === '/vs-ai' ? 'text-primary drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]' : 'text-gray-400 hover:text-white'}`}
            >
              <Bot className="w-4 h-4" />
              VS AI
            </Link>
            
            {pathname !== '/' && (
              <div className="hidden sm:block w-px h-8 bg-white/10 mx-2"></div>
            )}
            
            {pathname !== '/' && (
              <Link 
                href="/"
                className="group relative inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/10 px-5 py-2.5 rounded-full text-sm font-bold text-white transition-all hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1s_infinite] z-0" />
                <PlayCircle className="w-4 h-4 text-primary group-hover:text-purple-300 relative z-10 transition-colors" />
                <span className="relative z-10">Academy</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
