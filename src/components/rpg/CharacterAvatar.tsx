import { CHARACTERS } from "@/lib/characters";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface CharacterAvatarProps {
  characterId: string;
  size?: "small" | "medium" | "large" | "xl";
  className?: string;
}

export function CharacterAvatar({ characterId, size = "medium", className }: CharacterAvatarProps) {
  const character = CHARACTERS.find((c) => c.id === characterId) || CHARACTERS[0];

  const sizeClasses = {
    small: "w-10 h-10",
    medium: "w-20 h-20",
    large: "w-32 h-32",
    xl: "w-48 h-48 md:w-56 md:h-56",
  };

  return (
    <div className={cn("relative rounded-full overflow-hidden border-2 border-[#D3AA9B] bg-[#E2E4E6]", sizeClasses[size], className)}>
      <Image
        src={character.image}
        alt={character.name}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 33vw"
      />
    </div>
  );
}
