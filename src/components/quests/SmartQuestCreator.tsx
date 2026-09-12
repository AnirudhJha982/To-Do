"use client";

import { useState } from "react";
import { LIFE_CATEGORIES } from "@/lib/categories";
import { parseQuestIntent } from "@/lib/smart-parse";
import { ChevronRight, ArrowRight, Wand2, Calendar, Clock, RotateCw, Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Step = "INTENT" | "CATEGORY" | "TIME" | "RECURRENCE" | "CONFIRM";

export function SmartQuestCreator({ onComplete, onCancel }: { onComplete: () => void; onCancel: () => void }) {
  const [step, setStep] = useState<Step>("INTENT");
  const [intent, setIntent] = useState("");
  
  const [parsedTitle, setParsedTitle] = useState("");
  const [category, setCategory] = useState("custom");
  const [time, setTime] = useState("");
  const [recurrence, setRecurrence] = useState("once");
  const [duration, setDuration] = useState(30);
  
  const [isSaving, setIsSaving] = useState(false);

  const handleIntentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!intent.trim()) return;
    
    // Auto-parse the intent using heuristic
    const parsed = parseQuestIntent(intent);
    setParsedTitle(parsed.title);
    if (parsed.categoryId) setCategory(parsed.categoryId);
    if (parsed.time) setTime(parsed.time);
    if (parsed.recurrence) setRecurrence(parsed.recurrence);
    if (parsed.duration) setDuration(parsed.duration);
    
    setStep("CATEGORY");
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    // Map category to a default RPG attribute
    const catConfig = LIFE_CATEGORIES.find(c => c.id === category);
    const attribute = catConfig?.defaultAttribute || "discipline";
    
    // Guess difficulty based on duration
    let difficulty = "Medium";
    if (duration <= 15) difficulty = "Easy";
    else if (duration >= 60) difficulty = "Hard";
    else if (duration > 120) difficulty = "Epic";

    const payload = {
      title: parsedTitle,
      category,
      attribute: attribute.charAt(0).toUpperCase() + attribute.slice(1),
      difficulty,
      recurrenceRule: recurrence !== "once" ? recurrence : undefined,
      reminderTime: time || undefined,
      duration,
    };

    try {
      await fetch("/api/quests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      onComplete();
    } catch (e) {
      console.error(e);
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#5E4A47]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white border border-[#E8B83A]/30 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-8 border-b border-[#E8B83A]/30 pb-4">
            <h2 className="text-xl font-serif font-bold flex items-center gap-2 text-[#5E4A47]">
              <Sparkles className="w-5 h-5 text-[#E8B83A]" />
              Create New Quest
            </h2>
            <button onClick={onCancel} className="text-[#8F7B77]/50 hover:text-[#5E4A47]">✕</button>
          </div>

          <AnimatePresence mode="wait">
            {step === "INTENT" && (
              <motion.form 
                key="intent"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleIntentSubmit}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-bold text-[#755A56] mb-2 uppercase tracking-wide">
                    What do you want to accomplish?
                  </label>
                  <input
                    autoFocus
                    type="text"
                    value={intent}
                    onChange={e => setIntent(e.target.value)}
                    placeholder="e.g., Study DSA every day at 8 PM"
                    className="w-full bg-[#F8F3E7] border border-[#E8B83A]/50 rounded-xl px-4 py-4 text-[#5E4A47] placeholder-[#8F7B77]/40 focus:outline-none focus:ring-2 focus:ring-[#E8B83A] text-lg font-medium shadow-inner"
                  />
                  <p className="text-xs text-[#8F7B77]/60 mt-2 font-medium">
                    Type naturally. Life RPG will parse the time and category automatically.
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={!intent.trim()}
                  className="w-full flex items-center justify-center gap-2 bg-[#755A56] hover:bg-[#5E4A47] disabled:opacity-50 text-[#F8F3E7] font-bold py-3 px-4 rounded-xl transition-colors shadow-md"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </motion.form>
            )}

            {step === "CATEGORY" && (
              <motion.div
                key="category"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-[#755A56] uppercase tracking-wide">
                    Which area of your life is this?
                  </label>
                  <p className="text-xl font-serif font-bold text-[#5E4A47] mb-2 border-b border-[#F8F3E7] pb-2">"{parsedTitle}"</p>
                  
                  <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                    {LIFE_CATEGORIES.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setCategory(cat.id)}
                        className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all shadow-sm ${
                          category === cat.id 
                            ? `bg-[#755A56] border-[#5E4A47] text-[#F8F3E7]` 
                            : "bg-[#F8F3E7] border-[#E8B83A]/30 text-[#8F7B77] hover:bg-[#E8B83A]/20"
                        }`}
                      >
                        <span className="text-xl">{cat.icon}</span>
                        <span className="text-sm font-bold">{cat.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => setStep("TIME")}
                  className="w-full flex items-center justify-center gap-2 bg-[#755A56] hover:bg-[#5E4A47] text-[#F8F3E7] font-bold py-3 px-4 rounded-xl transition-colors shadow-md"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {step === "TIME" && (
              <motion.div
                key="time"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-bold text-[#755A56] mb-4 uppercase tracking-wide">
                    When do you want to do it?
                  </label>
                  <div className="flex items-center gap-4 bg-[#F8F3E7] border border-[#E8B83A]/50 p-4 rounded-xl shadow-inner">
                    <Clock className="w-6 h-6 text-[#755A56]" />
                    <input
                      type="time"
                      value={time}
                      onChange={e => setTime(e.target.value)}
                      className="bg-transparent text-[#5E4A47] text-xl font-bold focus:outline-none w-full"
                    />
                  </div>
                  <p className="text-xs text-[#8F7B77]/60 mt-2 font-medium">Leave blank if no specific time is required.</p>
                </div>
                <button
                  onClick={() => setStep("RECURRENCE")}
                  className="w-full flex items-center justify-center gap-2 bg-[#755A56] hover:bg-[#5E4A47] text-[#F8F3E7] font-bold py-3 px-4 rounded-xl transition-colors shadow-md"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {step === "RECURRENCE" && (
              <motion.div
                key="recurrence"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-bold text-[#755A56] mb-4 uppercase tracking-wide">
                    How often should this happen?
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: "once", label: "Just Once" },
                      { id: "daily", label: "Every Day" },
                      { id: "weekdays", label: "Weekdays" },
                      { id: "weekly", label: "Weekly" },
                    ].map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => setRecurrence(opt.id)}
                        className={`p-4 rounded-xl border transition-all text-center shadow-sm ${
                          recurrence === opt.id 
                            ? "bg-[#755A56] border-[#5E4A47] text-[#F8F3E7]" 
                            : "bg-[#F8F3E7] border-[#E8B83A]/30 text-[#8F7B77] hover:bg-[#E8B83A]/20"
                        }`}
                      >
                        <div className="font-bold">{opt.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => setStep("CONFIRM")}
                  className="w-full flex items-center justify-center gap-2 bg-[#755A56] hover:bg-[#5E4A47] text-[#F8F3E7] font-bold py-3 px-4 rounded-xl transition-colors shadow-md"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {step === "CONFIRM" && (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-bold text-[#755A56] mb-4 uppercase tracking-wide">
                    Confirm your quest
                  </label>
                  
                  <div className="bg-[#F8F3E7] border border-[#E8B83A]/50 rounded-xl p-5 space-y-4 shadow-inner">
                    <div className="flex items-center gap-3 border-b border-[#E8B83A]/30 pb-4">
                      <div className="text-3xl">
                        {LIFE_CATEGORIES.find(c => c.id === category)?.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-serif font-black text-[#5E4A47]">{parsedTitle}</h3>
                        <p className="text-sm font-bold text-[#8F7B77]/60 uppercase tracking-widest">
                          {LIFE_CATEGORIES.find(c => c.id === category)?.label}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-[#755A56]" />
                        <span className="text-[#5E4A47] font-bold">{time ? time : "Any time"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <RotateCw className="w-4 h-4 text-[#755A56]" />
                        <span className="text-[#5E4A47] font-bold capitalize">{recurrence}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-full flex items-center justify-center gap-2 bg-[#E8B83A] hover:bg-[#C49B2E] disabled:opacity-50 text-[#5E4A47] font-black py-4 px-4 rounded-xl transition-all shadow-md shadow-[#E8B83A]/30 hover:-translate-y-0.5"
                >
                  {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
                  {isSaving ? "CREATING..." : "CREATE QUEST"}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
