"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Coins, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ShopPage() {
  const router = useRouter();
  const [character, setCharacter] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const shopItems = [
    { id: "frame-warrior", name: "🌿 Forest Theme", type: "theme", price: 250, icon: "🌿" },
    { id: "badge-warrior", name: "⚔️ Warrior Badge", type: "badge", price: 400, icon: "⚔️" },
    { id: "title-elite", name: "👑 Elite Title", type: "title", price: 750, icon: "👑" },
    { id: "effect-gold", name: "✨ Golden XP Effect", type: "effect", price: 1000, icon: "✨" },
  ];

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

  const handlePurchase = async (item: any) => {
    if (character.gold < item.price) {
      alert("Not enough gold!");
      return;
    }
    alert(`Purchased ${item.name}! Backend validation would deduct ${item.price} gold.`);
  };

  if (loading) return <div className="min-h-screen p-8 text-[#8F7B77]">Loading shop...</div>;

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8 pb-12">
      <div className="flex items-center justify-between border-b-2 border-[#755A56]/20 pb-4">
        <div>
          <h1 className="text-4xl font-serif font-black text-[#5E4A47] flex items-center gap-3">
            <ShoppingCart className="w-8 h-8 text-[#755A56]" />
            REWARD SHOP
          </h1>
          <p className="text-[#8F7B77]/70 font-medium mt-1">Spend your hard-earned Gold.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-white px-5 py-2 rounded-xl border border-[#E8B83A]/40 shadow-sm">
          <Coins className="w-5 h-5 text-[#C49B2E]" />
          <span className="font-bold text-[#5E4A47] text-lg">{character?.gold || 0} Gold</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {shopItems.map(item => (
          <div key={item.id} className="rpg-card p-6 flex flex-col items-center text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#E8B83A]/5 blur-2xl rounded-full -mr-16 -mt-16 group-hover:bg-[#E8B83A]/10 transition-all" />
            
            <div className="text-6xl mb-6 mt-4 drop-shadow-sm">
              {item.icon}
            </div>
            
            <h3 className="text-xl font-bold mb-1 text-[#5E4A47] font-serif">{item.name.replace(/.*? /, '')}</h3>
            <div className="text-[10px] font-bold text-[#755A56] uppercase tracking-widest mb-6 bg-[#755A56]/10 px-2 py-0.5 rounded-sm">
              {item.type}
            </div>
            
            <button 
              onClick={() => handlePurchase(item)}
              className={cn(
                "w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all",
                character.gold >= item.price
                  ? "bg-[#E8B83A] hover:bg-[#C49B2E] text-[#5E4A47] shadow-md shadow-[#E8B83A]/20 hover:-translate-y-0.5"
                  : "bg-[#F8F3E7] border border-[#5E4A47]/10 text-[#5E4A47]/40 cursor-not-allowed"
              )}
            >
              BUY — {item.price} GOLD
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
