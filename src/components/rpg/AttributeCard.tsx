"use client";

import { motion } from "framer-motion";
import { Brain, Dumbbell, HeartPulse, Sparkles, ShieldCheck } from "lucide-react";

type AttributeType = "Strength" | "Intellect" | "Vitality" | "Creativity" | "Discipline";

interface AttributeCardProps {
  name: AttributeType;
  level: number;
}

const ATTRIBUTE_CONFIG = {
  Strength: { icon: Dumbbell, color: "text-rose-600", bg: "bg-rose-100", bar: "bg-rose-500" },
  Intellect: { icon: Brain, color: "text-blue-600", bg: "bg-blue-100", bar: "bg-blue-500" },
  Vitality: { icon: HeartPulse, color: "text-emerald-600", bg: "bg-emerald-100", bar: "bg-emerald-500" },
  Creativity: { icon: Sparkles, color: "text-purple-600", bg: "bg-purple-100", bar: "bg-purple-500" },
  Discipline: { icon: ShieldCheck, color: "text-amber-600", bg: "bg-amber-100", bar: "bg-amber-500" },
};

export function AttributeCard({ name, level }: AttributeCardProps) {
  const config = ATTRIBUTE_CONFIG[name] || ATTRIBUTE_CONFIG.Strength;
  const Icon = config.icon;

  // Assuming max practical level for bar display is 100
  const maxLevel = 100;
  const fillPercentage = Math.min(100, Math.max(0, (level / maxLevel) * 100));
  
  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex justify-between items-center px-1">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-md ${config.bg} ${config.color}`}>
            <Icon className="w-4 h-4" />
          </div>
          <span className="font-bold text-[#4D3935] text-sm uppercase tracking-wide">{name}</span>
        </div>
        <span className="font-black text-[#765B57] font-serif text-lg">{level}</span>
      </div>
      
      <div className="h-2 w-full bg-[#EAB62D]/10 rounded-full overflow-hidden border border-[#EAB62D]/20">
        <motion.div 
          className={`h-full ${config.bar}`}
          initial={{ width: 0 }}
          animate={{ width: `${fillPercentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
