"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { XPBar } from "@/components/rpg/XPBar";
import { AttributeCard } from "@/components/rpg/AttributeCard";
import { QuestCard } from "@/components/rpg/QuestCard";
import { Flame, Coins, Trophy, Plus, Check, Clock, ChevronRight, User } from "lucide-react";
import { getXPProgress } from "@/lib/rpg";
import { AnimatePresence, motion } from "framer-motion";
import { SmartQuestCreator } from "@/components/quests/SmartQuestCreator";
import { CharacterAvatar } from "@/components/rpg/CharacterAvatar";

export default function Dashboard() {
  const router = useRouter();
  const [character, setCharacter] = useState<any>(null);
  const [quests, setQuests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [levelUpData, setLevelUpData] = useState<{ oldLevel: number, newLevel: number } | null>(null);
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [verifyingQuest, setVerifyingQuest] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const charRes = await fetch("/api/character");
        if (charRes.status === 404 || charRes.status === 401) {
          router.push("/create-character");
          return;
        }
        const charData = await charRes.json();
        setCharacter(charData.character);

        const questsRes = await fetch("/api/quests");
        const questsData = await questsRes.json();
        setQuests(questsData.quests || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [router]);

  const refreshQuests = async () => {
    const questsRes = await fetch("/api/quests");
    const questsData = await questsRes.json();
    setQuests(questsData.quests || []);
  };

  const handleQuestComplete = async (questId: string) => {
    const quest = quests.find(q => q.id === questId);
    if (quest) setVerifyingQuest(quest);
  };

  const confirmQuestComplete = async () => {
    if (!verifyingQuest) return;
    try {
      const res = await fetch(`/api/quests/${verifyingQuest.id}/complete`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to complete quest");
      
      const data = await res.json();
      
      setQuests(quests.map(q => q.id === verifyingQuest.id ? { ...q, isCompleted: true } : q));
      setVerifyingQuest(null);
      
      if (data.leveledUp) {
        setLevelUpData({ oldLevel: character.level, newLevel: data.character.level });
      }
      
      setTimeout(() => {
        setCharacter(data.character);
      }, 500);

    } catch (error) {
      console.error(error);
    }
  };

  const skipQuest = () => {
    setVerifyingQuest(null);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-[#8B7B74]">Loading your journey...</div>;
  }

  if (!character) return null;

  const xpProgress = getXPProgress(character.xp);
  const totalStats = character.strength + character.intellect + character.vitality + character.creativity + character.discipline;
  const activeQuests = quests.filter(q => !q.isCompleted);
  const completedQuests = quests.filter(q => q.isCompleted);

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8 pb-12">
      
      {/* HERO SECTION */}
      <section className="bg-[#F6F1EA] p-8 md:p-12 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="flex-1 flex flex-col items-start">
          
          {/* Top Badges */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="inline-flex items-center gap-2 bg-[#A65B33] text-white px-4 py-1.5 rounded-full text-xs md:text-sm font-bold tracking-wide uppercase">
              <Trophy className="w-4 h-4" /> Level {character.level} Adventurer
            </div>
            <div className="inline-flex items-center gap-1.5 text-[#A65B33] font-bold text-sm">
              <Flame className="w-4 h-4" /> Gold streak
            </div>
          </div>
          
          {/* Titles */}
          <h1 className="text-5xl md:text-6xl font-serif font-black text-[#1E1511] leading-[1.1] mb-4">
            Welcome back,<br />
            {character.name}! 👋
          </h1>
          
          <p className="text-[#1E1511] font-medium text-lg mb-10">
            Your real-world actions are shaping your character.
          </p>

          {/* XP Progress */}
          <div className="w-full max-w-md bg-white rounded-2xl p-4 shadow-sm mb-6 border border-[#EAE0D6]">
            <div className="flex justify-between text-xs font-bold text-[#1E1511] mb-3 uppercase tracking-wider">
              <span>XP Progress</span>
              <span>{xpProgress.xpInCurrentLevel} / {xpProgress.xpRequiredForNext} XP</span>
            </div>
            <div className="h-2.5 bg-[#EAE0D6] rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-[#A65B33]"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, xpProgress.progressPercentage)}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* CTA */}
          <button 
            onClick={() => setIsCreatorOpen(true)}
            className="inline-flex items-center gap-2 bg-[#A65B33] hover:bg-[#8F4A24] text-white px-8 py-3.5 rounded-full font-semibold transition-all hover:scale-[1.02]"
          >
            Continue Your Quest <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Avatar */}
        <div className="w-48 h-48 md:w-64 md:h-64 shrink-0 relative flex items-center justify-center bg-[#EAE0D6] rounded-full border-[6px] border-[#A65B33] overflow-hidden shadow-lg">
          <CharacterAvatar characterId={character.avatar} size="xl" className="z-10 w-full h-full object-cover" />
        </div>
      </section>

      {/* STATS ROW */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rpg-card bg-[#E2E4E6] p-5 text-center flex flex-col items-center justify-center">
          <div className="text-sm font-bold text-[#8B7B74] uppercase tracking-wider mb-2">Current Level</div>
          <div className="text-3xl font-serif font-black text-[#4D3935]">LVL {character.level}</div>
          <div className="text-xs text-[#765B57] font-semibold mt-2 bg-[#765B57]/10 px-2 py-1 rounded-full">+450 XP this week</div>
        </div>
        
        <div className="rpg-card bg-[#D3AA9B] p-5 text-center flex flex-col items-center justify-center border-none">
          <div className="text-sm font-bold text-[#4D3935]/70 uppercase tracking-wider mb-2">Gold Earned</div>
          <div className="text-3xl font-serif font-black text-[#4D3935]">{character.gold}</div>
          <div className="text-xs text-[#4D3935] font-semibold mt-2 bg-[#4D3935]/10 px-2 py-1 rounded-full">Available Balance</div>
        </div>

        <div className="rpg-card bg-[#DDA51C] p-5 text-center flex flex-col items-center justify-center border-none">
          <div className="text-sm font-bold text-[#4D3935]/70 uppercase tracking-wider mb-2">Current Streak</div>
          <div className="text-3xl font-serif font-black text-[#765B57] flex items-center gap-2">
            <Flame className="w-6 h-6 text-[#EAB62D]" /> {character.currentStreak}
          </div>
          <div className="text-xs text-[#4D3935]/70 font-medium mt-2">Best: {character.longestStreak} days</div>
        </div>

        <div className="rpg-card bg-[#DCD3D0] p-5 text-center flex flex-col items-center justify-center border-none">
          <div className="text-sm font-bold text-[#71856A]/70 uppercase tracking-wider mb-2">Attribute Power</div>
          <div className="text-3xl font-serif font-black text-[#4D3935]">{totalStats}</div>
          <div className="text-xs text-[#71856A] font-semibold mt-2 bg-[#71856A]/10 px-2 py-1 rounded-full">Total Stats</div>
        </div>
      </section>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* MAIN QUESTS AREA */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex items-center justify-between border-b-2 border-[#765B57]/20 pb-4">
            <div>
              <h2 className="text-3xl font-serif font-black text-[#4D3935]">TODAY'S QUESTS</h2>
              <p className="text-[#8B7B74]/70 font-medium">Turn your real-world goals into progress.</p>
            </div>
            <button 
              onClick={() => setIsCreatorOpen(true)}
              className="px-4 py-2 bg-[#765B57] hover:bg-[#765B57] text-[#E2E4E6] rounded-xl font-bold shadow-md transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" /> New Quest
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {activeQuests.length === 0 ? (
              <div className="rpg-card p-12 text-center text-[#8B7B74]/60 font-medium">
                No active quests for today. The world awaits!
              </div>
            ) : (
              activeQuests.map(quest => (
                <QuestCard key={quest.id} quest={quest} onComplete={handleQuestComplete} />
              ))
            )}
          </div>

          {completedQuests.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-serif font-bold text-[#8B7B74]/50 uppercase tracking-widest mb-4">Completed</h3>
              <div className="flex flex-col gap-4 opacity-75">
                {completedQuests.map(quest => (
                  <QuestCard key={quest.id} quest={quest} onComplete={async () => {}} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* SIDEBAR ATTRIBUTES */}
        <div className="w-full lg:w-80 flex flex-col gap-6">
          <div className="rpg-card p-6">
            <h3 className="text-lg font-bold text-[#4D3935] border-b border-[#EAB62D]/30 pb-3 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-[#EAB62D]" /> YOUR CHARACTER
            </h3>
            
            <div className="flex flex-col gap-4">
              <AttributeCard name="Strength" level={character.strength} />
              <AttributeCard name="Intellect" level={character.intellect} />
              <AttributeCard name="Vitality" level={character.vitality} />
              <AttributeCard name="Creativity" level={character.creativity} />
              <AttributeCard name="Discipline" level={character.discipline} />
            </div>
          </div>
          
          <div className="rpg-card p-6 bg-[#765B57] text-white">
            <h3 className="text-lg font-bold text-[#EAB62D] border-b border-[#765B57] pb-3 mb-4 flex items-center gap-2">
              <Flame className="w-5 h-5" /> CONSISTENCY STREAK
            </h3>
            <div className="text-4xl font-serif font-black mb-2">{character.currentStreak} DAYS</div>
            <p className="text-[#E2E4E6]/70 text-sm mb-4">"You're building momentum."</p>
            
            <div className="flex justify-between items-center text-xs font-bold text-[#E2E4E6]/50 mb-2">
              <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
            </div>
            <div className="flex justify-between items-center">
              {[...Array(7)].map((_, i) => (
                <div key={i} className={`w-3 h-3 rounded-full ${i < Math.min(7, character.currentStreak) ? 'bg-[#EAB62D] shadow-[0_0_8px_#EAB62D]' : 'bg-[#765B57]'}`} />
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Level Up Modal */}
      <AnimatePresence>
        {levelUpData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#4D3935]/80 backdrop-blur-sm p-4"
            onClick={() => setLevelUpData(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="rpg-card bg-white p-10 text-center max-w-md w-full relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-[#E2E4E6]/50 z-0"></div>
              
              <div className="relative z-10">
                <div className="text-6xl mb-6 text-center mx-auto w-full flex justify-center drop-shadow-md">
                  ⭐
                </div>
                <h2 className="text-4xl font-serif font-black text-[#765B57] mb-2 tracking-widest">
                  LEVEL UP!
                </h2>
                <div className="h-px w-24 bg-[#EAB62D] mx-auto mb-6"></div>
                
                <p className="text-[#8B7B74]/70 font-medium mb-6">Your character is getting stronger.</p>
                
                <div className="text-2xl font-bold text-[#4D3935] mb-8 bg-[#E2E4E6] py-3 rounded-xl border border-[#EAB62D]/30">
                  Level {levelUpData.oldLevel} <span className="text-[#EAB62D] mx-2">→</span> Level {levelUpData.newLevel}
                </div>
                
                <button 
                  className="w-full py-4 bg-[#765B57] hover:bg-[#4D3935] text-[#E2E4E6] font-bold rounded-xl transition-all shadow-lg"
                  onClick={() => setLevelUpData(null)}
                >
                  Continue Journey
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quest Verification Modal */}
      <AnimatePresence>
        {verifyingQuest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#4D3935]/80 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="rpg-card w-full max-w-sm p-8 text-center relative"
            >
              <h2 className="text-2xl font-serif font-black text-[#765B57] mb-2">QUEST COMPLETE! ✓</h2>
              <p className="text-[#8B7B74]/80 font-bold mb-6 pb-6 border-b border-[#EAB62D]/30">
                "{verifyingQuest.title}"
              </p>
              
              <div className="text-sm font-bold text-[#8B7B74]/50 uppercase tracking-widest mb-4">Rewards</div>
              
              <div className="flex flex-col gap-3 mb-8 text-lg font-bold text-[#4D3935]">
                <div className="flex justify-between px-4">
                  <span className="text-[#765B57]">⭐ XP</span>
                  <span className="text-[#765B57]">+{verifyingQuest.xpReward}</span>
                </div>
                <div className="flex justify-between px-4">
                  <span className="text-[#DDA51C]">💰 Gold</span>
                  <span className="text-[#DDA51C]">+{verifyingQuest.goldReward}</span>
                </div>
                <div className="flex justify-between px-4">
                  <span className="text-emerald-600">🧠 {verifyingQuest.attribute}</span>
                  <span className="text-emerald-600">+1</span>
                </div>
              </div>
              
              <div className="flex flex-col gap-3">
                <button 
                  onClick={confirmQuestComplete}
                  className="w-full flex items-center justify-center gap-2 bg-[#EAB62D] hover:bg-[#DDA51C] text-[#4D3935] font-bold py-3 rounded-xl transition-all shadow-md"
                >
                  <Check className="w-5 h-5" /> CLAIM REWARD
                </button>
                <button 
                  onClick={() => setVerifyingQuest(null)}
                  className="w-full flex items-center justify-center gap-2 hover:bg-[#E2E4E6] text-[#8B7B74]/60 font-medium py-2 rounded-xl transition-colors text-sm"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Smart Creator Modal */}
      <AnimatePresence>
        {isCreatorOpen && (
          <SmartQuestCreator 
            onComplete={() => {
              setIsCreatorOpen(false);
              refreshQuests();
            }}
            onCancel={() => setIsCreatorOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
