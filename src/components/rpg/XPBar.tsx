"use client";

import { motion } from "framer-motion";

interface XPBarProps {
  currentXP: number;
  xpRequired: number;
  level: number;
}

export function XPBar({ currentXP, xpRequired, level }: XPBarProps) {
  const percentage = Math.min(100, Math.max(0, (currentXP / xpRequired) * 100));

  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-2">
        <div className="font-bold text-lg text-sky-400 text-glow">Level {level}</div>
        <div className="text-xs font-mono text-slate-400">
          {Math.floor(currentXP)} / {Math.floor(xpRequired)} XP
        </div>
      </div>
      
      <div className="h-4 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800 shadow-inner">
        <motion.div
          className="h-full bg-gradient-to-r from-sky-500 to-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.7)]"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
