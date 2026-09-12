"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Flame, Coins, Shield, Star, Sword, Map, Edit2, X } from "lucide-react";
import { XPBar } from "@/components/rpg/XPBar";
import { AttributeCard } from "@/components/rpg/AttributeCard";
import { getXPProgress } from "@/lib/rpg";
import { CharacterAvatar } from "@/components/rpg/CharacterAvatar";
import { CharacterSelector } from "@/components/rpg/CharacterSelector";
import { AnimatePresence, motion } from "framer-motion";

export default function ProfilePage() {
  const router = useRouter();
  const [character, setCharacter] = useState<any>(null);
  const [completedQuestsCount, setCompletedQuestsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const charRes = await fetch("/api/character");
        if (!charRes.ok) throw new Error();
        const charData = await charRes.json();
        setCharacter(charData.character);

        const questsRes = await fetch("/api/quests");
        if (questsRes.ok) {
          const questsData = await questsRes.json();
          const completedCount = questsData.quests?.filter((q: any) => q.isCompleted).length || 0;
          setCompletedQuestsCount(completedCount);
        }
      } catch {
        router.push("/create-character");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [router]);

  if (loading) return null;

  const xpProgress = getXPProgress(character.xp);

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8 pb-12">
      <div className="flex justify-between items-center border-b-2 border-[#765B57]/20 pb-4">
        <h1 className="text-4xl font-serif font-black flex items-center gap-3 text-[#4D3935]">
          <User className="w-8 h-8 text-[#765B57]" />
          HERO PROFILE
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Character Card */}
        <div className="md:col-span-1 rpg-card bg-[#E2E4E6] p-8 flex flex-col items-center text-center relative border-[#EAB62D]/30">
          <div className="w-40 h-40 mx-auto rounded-full shadow-lg mb-6 flex items-center justify-center relative overflow-hidden group">
            <CharacterAvatar characterId={character.avatar} size="large" />
            <button 
              onClick={() => setIsEditingAvatar(true)}
              className="absolute inset-0 bg-black/50 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Edit2 className="w-8 h-8 mb-2" />
              <span className="font-bold text-sm">Change</span>
            </button>
          </div>
          <h2 className="text-3xl font-serif font-black text-[#4D3935] mb-1">{character.name}</h2>
          <div className="text-[#765B57] font-bold mb-8 text-sm uppercase tracking-widest bg-[#765B57]/10 px-3 py-1 rounded-sm">Rank: Novice</div>
          
          <div className="w-full text-left mb-6">
            <XPBar 
              currentXP={character.xp} 
              xpRequired={xpProgress.xpForNextLevel} 
              level={character.level} 
            />
          </div>

          <div className="grid grid-cols-2 gap-4 w-full text-left">
            <div className="bg-[#E2E4E6] p-4 rounded-xl border border-[#EAB62D]/30 shadow-inner">
              <div className="text-[#8B7B74]/60 text-xs uppercase mb-1 font-bold">Total XP</div>
              <div className="font-black text-[#765B57] text-xl flex items-center gap-2">
                <Star className="w-4 h-4 text-[#EAB62D]" />
                {character.xp}
              </div>
            </div>
            <div className="bg-[#E2E4E6] p-4 rounded-xl border border-[#EAB62D]/30 shadow-inner">
              <div className="text-[#8B7B74]/60 text-xs uppercase mb-1 font-bold">Gold</div>
              <div className="font-black text-[#DDA51C] text-xl flex items-center gap-2">
                <Coins className="w-4 h-4" />
                {character.gold}
              </div>
            </div>
          </div>
        </div>

        {/* Stats and Attributes */}
        <div className="md:col-span-2 flex flex-col gap-8">
          <div className="rpg-card p-8">
            <h3 className="text-xl font-bold font-serif text-[#4D3935] mb-6 flex items-center gap-2 border-b border-[#EAB62D]/30 pb-3">
              <Shield className="w-6 h-6 text-[#765B57]" />
              ATTRIBUTES
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <AttributeCard name="Strength" level={character.strength} />
              <AttributeCard name="Intellect" level={character.intellect} />
              <AttributeCard name="Vitality" level={character.vitality} />
              <AttributeCard name="Creativity" level={character.creativity} />
              <AttributeCard name="Discipline" level={character.discipline} />
            </div>
          </div>

          <div className="rpg-card p-8">
            <h3 className="text-xl font-bold font-serif text-[#4D3935] mb-6 flex items-center gap-2 border-b border-[#EAB62D]/30 pb-3">
              <Map className="w-6 h-6 text-[#765B57]" />
              JOURNEY STATISTICS
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex flex-col items-center justify-center p-4 bg-[#E2E4E6] rounded-xl border border-[#EAB62D]/30 shadow-sm">
                <Flame className="w-8 h-8 text-orange-500 mb-2 drop-shadow-sm" />
                <div className="text-2xl font-black text-[#4D3935] font-serif">{character.currentStreak}</div>
                <div className="text-[10px] font-bold text-[#8B7B74]/70 uppercase tracking-widest text-center mt-1">Current Streak</div>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-[#E2E4E6] rounded-xl border border-[#EAB62D]/30 shadow-sm">
                <Flame className="w-8 h-8 text-red-500 mb-2 drop-shadow-sm" />
                <div className="text-2xl font-black text-[#4D3935] font-serif">{character.longestStreak}</div>
                <div className="text-[10px] font-bold text-[#8B7B74]/70 uppercase tracking-widest text-center mt-1">Best Streak</div>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-[#E2E4E6] rounded-xl border border-[#EAB62D]/30 shadow-sm">
                <Sword className="w-8 h-8 text-[#765B57] mb-2 drop-shadow-sm" />
                <div className="text-2xl font-black text-[#4D3935] font-serif">{completedQuestsCount}</div>
                <div className="text-[10px] font-bold text-[#8B7B74]/70 uppercase tracking-widest text-center mt-1">Quests Done</div>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-[#E2E4E6] rounded-xl border border-[#EAB62D]/30 shadow-sm">
                <Star className="w-8 h-8 text-[#EAB62D] mb-2 drop-shadow-sm" />
                <div className="text-2xl font-black text-[#4D3935] font-serif">0</div>
                <div className="text-[10px] font-bold text-[#8B7B74]/70 uppercase tracking-widest text-center mt-1">Achievements</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isEditingAvatar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center bg-[#4D3935]/80 backdrop-blur-sm p-4 overflow-y-auto pt-12 md:pt-20 pb-12"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-[#E1C6C8] w-full max-w-6xl min-h-[80vh] rounded-3xl p-8 relative shadow-2xl"
            >
              <button 
                onClick={() => setIsEditingAvatar(false)}
                className="absolute top-6 right-6 p-2 bg-[#E2E4E6] text-[#4D3935] hover:bg-[#EAB62D] hover:text-white rounded-full transition-colors z-50 shadow-md"
              >
                <X className="w-6 h-6" />
              </button>
              
              <CharacterSelector 
                initialCharacterId={character.avatar}
                existingCharacter={character}
                onConfirm={async (newAvatarId) => {
                  const res = await fetch("/api/character", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ avatar: newAvatarId }),
                  });
                  
                  if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.message || "Failed to unlock avatar.");
                  }

                  const updated = await res.json();
                  setCharacter(updated.character);
                  setIsEditingAvatar(false);
                  // Force a global refresh for Header/Sidebar consistency
                  router.refresh();
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
