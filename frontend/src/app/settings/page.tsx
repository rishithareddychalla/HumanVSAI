"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Settings as SettingsIcon, Volume2, Eye, Shield } from "lucide-react";

export default function Settings() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [difficulty, setDifficulty] = useState("adaptive");

  useEffect(() => {
    const muted = localStorage.getItem("truthlens_muted");
    if (muted === 'true') setSoundEnabled(false);
    
    const contrast = localStorage.getItem("truthlens_high_contrast");
    if (contrast === 'true') setHighContrast(true);
    
    const diff = localStorage.getItem("truthlens_difficulty");
    if (diff) setDifficulty(diff);
  }, []);

  const handleSoundToggle = () => {
    const newVal = !soundEnabled;
    setSoundEnabled(newVal);
    localStorage.setItem("truthlens_muted", (!newVal).toString());
  };

  const handleContrastToggle = () => {
    const newVal = !highContrast;
    setHighContrast(newVal);
    localStorage.setItem("truthlens_high_contrast", newVal.toString());
    
    if (newVal) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  };

  const handleDifficultyChange = (level: string) => {
    setDifficulty(level);
    localStorage.setItem("truthlens_difficulty", level);
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col space-y-8">
      <div className="flex items-center gap-4 mb-4">
        <SettingsIcon className="w-10 h-10 text-primary" />
        <h1 className="text-4xl font-extrabold tracking-tight">Settings</h1>
      </div>

      <div className="space-y-6">
        <div className="glass-panel p-6 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/20 text-primary rounded-xl">
              <Volume2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Sound Effects</h3>
              <p className="text-sm text-muted-foreground">Enable or disable game sounds and confetti.</p>
            </div>
          </div>
          <button 
            onClick={handleSoundToggle}
            className={`w-14 h-8 rounded-full relative transition-colors ${soundEnabled ? 'bg-primary' : 'bg-white/20'}`}
          >
            <motion.div 
              className="w-6 h-6 bg-white rounded-full absolute top-1"
              animate={{ left: soundEnabled ? '32px' : '4px' }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </button>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/20 text-purple-400 rounded-xl">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">High Contrast Mode</h3>
              <p className="text-sm text-muted-foreground">Improve visibility of UI elements.</p>
            </div>
          </div>
          <button 
            onClick={handleContrastToggle}
            className={`w-14 h-8 rounded-full relative transition-colors ${highContrast ? 'bg-purple-500' : 'bg-white/20'}`}
          >
            <motion.div 
              className="w-6 h-6 bg-white rounded-full absolute top-1"
              animate={{ left: highContrast ? '32px' : '4px' }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </button>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Difficulty Curve</h3>
              <p className="text-sm text-muted-foreground">How should the game scale in difficulty?</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {['casual', 'adaptive', 'hardcore'].map((level) => (
              <button
                key={level}
                onClick={() => handleDifficultyChange(level)}
                className={`py-2 rounded-xl font-medium capitalize transition-all ${
                  difficulty === level 
                    ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]' 
                    : 'bg-white/5 text-muted-foreground hover:bg-white/10'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
