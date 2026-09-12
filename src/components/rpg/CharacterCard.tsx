import { Character } from "@/lib/characters";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { CheckCircle2, Lock } from "lucide-react";

interface CharacterCardProps {
  character: Character;
  selected: boolean;
  onSelect: (id: string) => void;
  isLocked?: boolean;
}

export function CharacterCard({ character, selected, onSelect, isLocked }: CharacterCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(character.id)}
      aria-pressed={selected}
      className={cn(
        "relative text-left p-4 rounded-2xl border transition-all duration-300 w-full flex flex-col items-center gap-4 group",
        "bg-[#E2E4E6] shadow-sm",
        selected 
          ? "border-[#EAB62D] shadow-[0_0_15px_rgba(184,120,104,0.3)] scale-[1.03] outline outline-1 outline-[#EAB62D]/50" 
          : "border-[#E8D9A8] hover:border-[#D3AA9B] hover:-translate-y-1 hover:shadow-md",
        isLocked && !selected && "opacity-80 grayscale-[30%]"
      )}
    >
      <div className="relative w-full aspect-square rounded-xl overflow-hidden border-2 border-[#D3AA9B]/40 bg-[#E2E4E6]">
        <Image
          src={character.image}
          alt={character.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
        {selected && (
          <div className="absolute inset-0 bg-[#EAB62D]/10 flex items-start justify-end p-2 pointer-events-none">
            <span className="bg-[#EAB62D] text-[#E2E4E6] text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
              <CheckCircle2 className="w-3 h-3" /> SELECTED
            </span>
          </div>
        )}
        {isLocked && !selected && (
          <div className="absolute inset-0 bg-[#4D3935]/40 flex items-center justify-center p-2 pointer-events-none transition-colors group-hover:bg-[#4D3935]/20">
            <Lock className="w-8 h-8 text-[#E2E4E6] drop-shadow-md" />
          </div>
        )}
      </div>

      <div className="text-center w-full">
        <h3 className="font-serif font-black text-lg text-[#4D3935] uppercase tracking-wide mb-1 flex items-center justify-center gap-2">
          {character.name}
        </h3>
        <p className="text-sm text-[#8B7B74] line-clamp-2 mb-2">
          {character.description}
        </p>
        
        {isLocked ? (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#4D3935]/10 text-[#4D3935] rounded-full text-xs font-bold">
            <span className="text-[#EAB62D]">💰</span> {character.price} Gold
          </div>
        ) : (
          <div className="inline-flex px-3 py-1 bg-[#71856A]/10 text-[#71856A] rounded-full text-xs font-bold">
            Owned
          </div>
        )}
      </div>
    </button>
  );
}
