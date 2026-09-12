"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Circle, Coins, Star, Swords } from "lucide-react";
import { cn } from "@/lib/utils";

interface Quest {
  id: string;
  title: string;
  description?: string | null;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard" | "Epic" | string;
  attribute: string;
  xpReward: number;
  goldReward: number;
  isCompleted: boolean;
}

interface QuestCardProps {
  quest: Quest;
  onComplete: (id: string) => Promise<void>;
}

export function QuestCard({ quest, onComplete }: QuestCardProps) {
  const [isCompleting, setIsCompleting] = useState(false);
  const isCompleted = quest.isCompleted || isCompleting;

  const handleComplete = async () => {
    if (isCompleted) return;
    setIsCompleting(true);
    await onComplete(quest.id);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        "rpg-card-interactive p-5 relative overflow-hidden group flex flex-col md:flex-row md:items-center justify-between gap-4",
        isCompleted && "opacity-90 pointer-events-none border-[#16804D]/30 shadow-none bg-[#E8F1E9]"
      )}
    >
      <div className="flex gap-4 items-start md:items-center flex-1">
        <div className="flex-1 z-10">
          <div className="flex items-center gap-3 mb-1">
            <h3 className={cn("font-serif font-bold text-xl", isCompleted ? "line-through text-[#16804D]/70" : "text-[#5E4A47]")}>
              {quest.title}
            </h3>
          </div>
          
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-bold tracking-widest uppercase bg-[#755A56]/10 text-[#755A56] px-2 py-0.5 rounded-sm">
              {quest.category}
            </span>
            <span className="text-xs text-[#8F7B77]/60 font-semibold">
              Difficulty: {quest.difficulty}
            </span>
          </div>

          {quest.description && (
            <p className="text-[#8F7B77]/70 text-sm mb-4 line-clamp-2">{quest.description}</p>
          )}
        </div>
      </div>
      
      <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-4 md:gap-2 shrink-0 border-t md:border-t-0 md:border-l border-[#E8B83A]/20 pt-4 md:pt-0 md:pl-6">
        <div className="flex items-center gap-4 text-sm font-bold">
          <div className="flex items-center gap-1 text-[#5E4A47]">
            <span className="text-[#E8B83A]">⭐</span> +{quest.xpReward} XP
          </div>
          <div className="flex items-center gap-1 text-[#C49B2E]">
            <Coins className="w-4 h-4" /> +{quest.goldReward}
          </div>
        </div>
        
        <button
          onClick={handleComplete}
          disabled={isCompleted}
          className={cn(
            "flex items-center gap-2 px-5 py-2 rounded-xl font-bold transition-all shadow-sm",
            isCompleted 
              ? "bg-[#16804D] text-[#F8F3E7]" 
              : "bg-[#F8F3E7] text-[#755A56] border border-[#755A56] hover:bg-[#755A56] hover:text-[#F8F3E7]"
          )}
        >
          {isCompleted ? (
            <>
              <CheckCircle2 className="w-4 h-4" /> Completed
            </>
          ) : (
            "Complete Quest"
          )}
        </button>
      </div>
    </motion.div>
  );
}
