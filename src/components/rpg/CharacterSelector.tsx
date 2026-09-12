"use client";

import { useState } from "react";
import { CHARACTERS } from "@/lib/characters";
import { CharacterCard } from "./CharacterCard";
import { ChevronRight, Loader2 } from "lucide-react";

interface CharacterSelectorProps {
  initialCharacterId?: string;
  onConfirm: (characterId: string) => Promise<void>;
  existingCharacter?: any; // Pass this from profile page
}

export function CharacterSelector({ initialCharacterId, onConfirm, existingCharacter }: CharacterSelectorProps) {
  const [selectedId, setSelectedId] = useState<string | null>(initialCharacterId || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const unlockedAvatars = existingCharacter?.unlockedAvatars?.split(",") || ["new_4"];
  const currentGold = existingCharacter?.gold || 0;
  
  const selectedDef = CHARACTERS.find(c => c.id === selectedId);
  const isLocked = selectedDef ? !unlockedAvatars.includes(selectedDef.id) : false;
  const canAfford = selectedDef ? currentGold >= selectedDef.price : false;

  const handleConfirm = async () => {
    if (!selectedId) return;
    
    if (isLocked && !canAfford) {
      setError("Not enough gold to unlock this character.");
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    try {
      await onConfirm(selectedId);
    } catch (error: any) {
      console.error(error);
      setError(error.message || "Something went wrong.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-4xl md:text-5xl font-serif font-black text-[#4D3935] mb-4">
          CHOOSE YOUR CHARACTER
        </h2>
        <p className="text-lg text-[#8B7B74] font-medium max-w-2xl mx-auto">
          This is your avatar. Your real-world progress shapes your journey.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
        {CHARACTERS.map((character) => (
          <CharacterCard
            key={character.id}
            character={character}
            selected={selectedId === character.id}
            onSelect={(id) => {
              setSelectedId(id);
              setError(null);
            }}
            isLocked={!unlockedAvatars.includes(character.id)}
          />
        ))}
      </div>

      <div className="flex flex-col items-center sticky bottom-6 z-20">
        {error && (
          <div className="mb-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-bold shadow-md animate-bounce">
            {error}
          </div>
        )}
        <button
          onClick={handleConfirm}
          disabled={!selectedId || isSubmitting || (isLocked && !canAfford)}
          className="group flex items-center justify-center gap-3 bg-[#765B57] hover:bg-[#4D3935] disabled:bg-[#D3AA9B] disabled:cursor-not-allowed text-[#E2E4E6] px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-[#765B57]/20 transition-all hover:-translate-y-1 w-full max-w-md"
        >
          {isSubmitting ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : isLocked ? (
            <>
              UNLOCK FOR {selectedDef?.price} GOLD
              <ChevronRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
            </>
          ) : (
            <>
              CONTINUE WITH THIS CHARACTER
              <ChevronRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
