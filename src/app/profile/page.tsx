"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Flame, Coins, Shield, Star, Sword, Map } from "lucide-react";
import { XPBar } from "@/components/rpg/XPBar";
import { AttributeCard } from "@/components/rpg/AttributeCard";
import { getXPProgress } from "@/lib/rpg";
import { CHARACTERS } from "@/lib/characters";

export default function ProfilePage() {
  const router = useRouter();
  const [character, setCharacter] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const charRes = await fetch("/api/character");
        if (!charRes.ok) throw new Error();
        const charData = await charRes.json();
        setCharacter(charData.character);
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
      <div className="flex justify-between items-center border-b-2 border-[#755A56]/20 pb-4">
        <h1 className="text-4xl font-serif font-black flex items-center gap-3 text-[#5E4A47]">
          <User className="w-8 h-8 text-[#755A56]" />
          HERO PROFILE
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Character Card */}
        <div className="md:col-span-1 rpg-card p-8 flex flex-col items-center text-center">
          <div className="w-40 h-40 mx-auto bg-[#F8F3E7] rounded-full border-4 border-[#E8B83A] shadow-lg mb-6 flex items-center justify-center text-7xl relative overflow-hidden">
             {CHARACTERS[character.avatar]?.avatarStages[character.evolutionStage || 1] || character.avatar || "👤"}
          </div>
          <h2 className="text-3xl font-serif font-black text-[#5E4A47] mb-1">{character.name}</h2>
          <div className="text-[#755A56] font-bold mb-8 text-sm uppercase tracking-widest bg-[#755A56]/10 px-3 py-1 rounded-sm">Rank: Novice</div>
          
          <div className="w-full text-left mb-6">
            <XPBar 
              currentXP={character.xp} 
              xpRequired={xpProgress.xpForNextLevel} 
              level={character.level} 
            />
          </div>

          <div className="grid grid-cols-2 gap-4 w-full text-left">
            <div className="bg-[#F8F3E7] p-4 rounded-xl border border-[#E8B83A]/30 shadow-inner">
              <div className="text-[#8F7B77]/60 text-xs uppercase mb-1 font-bold">Total XP</div>
              <div className="font-black text-[#755A56] text-xl flex items-center gap-2">
                <Star className="w-4 h-4 text-[#E8B83A]" />
                {character.xp}
              </div>
            </div>
            <div className="bg-[#F8F3E7] p-4 rounded-xl border border-[#E8B83A]/30 shadow-inner">
              <div className="text-[#8F7B77]/60 text-xs uppercase mb-1 font-bold">Gold</div>
              <div className="font-black text-[#C49B2E] text-xl flex items-center gap-2">
                <Coins className="w-4 h-4" />
                {character.gold}
              </div>
            </div>
          </div>
        </div>

        {/* Stats and Attributes */}
        <div className="md:col-span-2 flex flex-col gap-8">
          <div className="rpg-card p-8">
            <h3 className="text-xl font-bold font-serif text-[#5E4A47] mb-6 flex items-center gap-2 border-b border-[#E8B83A]/30 pb-3">
              <Shield className="w-6 h-6 text-[#755A56]" />
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
            <h3 className="text-xl font-bold font-serif text-[#5E4A47] mb-6 flex items-center gap-2 border-b border-[#E8B83A]/30 pb-3">
              <Map className="w-6 h-6 text-[#755A56]" />
              JOURNEY STATISTICS
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex flex-col items-center justify-center p-4 bg-[#F8F3E7] rounded-xl border border-[#E8B83A]/30 shadow-sm">
                <Flame className="w-8 h-8 text-orange-500 mb-2 drop-shadow-sm" />
                <div className="text-2xl font-black text-[#5E4A47] font-serif">{character.currentStreak}</div>
                <div className="text-[10px] font-bold text-[#8F7B77]/70 uppercase tracking-widest text-center mt-1">Current Streak</div>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-[#F8F3E7] rounded-xl border border-[#E8B83A]/30 shadow-sm">
                <Flame className="w-8 h-8 text-red-500 mb-2 drop-shadow-sm" />
                <div className="text-2xl font-black text-[#5E4A47] font-serif">{character.longestStreak}</div>
                <div className="text-[10px] font-bold text-[#8F7B77]/70 uppercase tracking-widest text-center mt-1">Best Streak</div>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-[#F8F3E7] rounded-xl border border-[#E8B83A]/30 shadow-sm">
                <Sword className="w-8 h-8 text-[#755A56] mb-2 drop-shadow-sm" />
                <div className="text-2xl font-black text-[#5E4A47] font-serif">{character.level * 10}</div>
                <div className="text-[10px] font-bold text-[#8F7B77]/70 uppercase tracking-widest text-center mt-1">Quests Done</div>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-[#F8F3E7] rounded-xl border border-[#E8B83A]/30 shadow-sm">
                <Star className="w-8 h-8 text-[#E8B83A] mb-2 drop-shadow-sm" />
                <div className="text-2xl font-black text-[#5E4A47] font-serif">{Math.floor(character.xp / 100)}</div>
                <div className="text-[10px] font-bold text-[#8F7B77]/70 uppercase tracking-widest text-center mt-1">Achievements</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
