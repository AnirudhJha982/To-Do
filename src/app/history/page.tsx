"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { History, Check, Clock } from "lucide-react";
import { QuestCard } from "@/components/rpg/QuestCard";

export default function HistoryPage() {
  const router = useRouter();
  const [quests, setQuests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"ACTIVE" | "COMPLETED">("ACTIVE");

  useEffect(() => {
    async function fetchData() {
      try {
        const charRes = await fetch("/api/character");
        if (!charRes.ok) {
          router.push("/create-character");
          return;
        }
        
        const res = await fetch("/api/quests");
        if (res.ok) {
          const data = await res.json();
          setQuests(data.quests || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [router]);

  const handleQuestComplete = async (questId: string) => {
    try {
      const res = await fetch(`/api/quests/${questId}/complete`, { method: "POST" });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      
      setQuests(quests.map(q => q.id === questId ? { ...q, isCompleted: true } : q));
      window.dispatchEvent(new CustomEvent('character-updated', { detail: data.character }));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-[#8B7B74]">Loading your history...</div>;
  }

  const activeQuests = quests.filter(q => !q.isCompleted);
  const completedQuests = quests.filter(q => q.isCompleted);

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8 pb-12">
      <div className="flex justify-between items-center border-b-2 border-[#765B57]/20 pb-4">
        <h1 className="text-4xl font-serif font-black flex items-center gap-3 text-[#4D3935]">
          <History className="w-8 h-8 text-[#765B57]" />
          QUEST HISTORY
        </h1>
      </div>

      <div className="flex gap-4 mb-2">
        <button 
          onClick={() => setView("ACTIVE")}
          className={`flex-1 p-4 rounded-2xl border-2 font-bold transition-all ${
            view === "ACTIVE" 
              ? "bg-[#EAE0D6] border-[#A65B33] text-[#A65B33] shadow-sm" 
              : "bg-white border-[#EAE0D6] text-[#8B7B74] hover:border-[#A65B33]/50"
          }`}
        >
          <Clock className="w-6 h-6 mx-auto mb-2" />
          Pending ({activeQuests.length})
        </button>
        <button 
          onClick={() => setView("COMPLETED")}
          className={`flex-1 p-4 rounded-2xl border-2 font-bold transition-all ${
            view === "COMPLETED" 
              ? "bg-[#EAE0D6] border-[#71856A] text-[#71856A] shadow-sm" 
              : "bg-white border-[#EAE0D6] text-[#8B7B74] hover:border-[#71856A]/50"
          }`}
        >
          <Check className="w-6 h-6 mx-auto mb-2" />
          Completed ({completedQuests.length})
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {view === "ACTIVE" ? (
          activeQuests.length === 0 ? (
            <div className="rpg-card p-12 text-center text-[#8B7B74]/60 font-medium">
              No pending quests. You're all caught up!
            </div>
          ) : (
            activeQuests.map(quest => (
              <QuestCard key={quest.id} quest={quest} onComplete={handleQuestComplete} />
            ))
          )
        ) : (
          completedQuests.length === 0 ? (
            <div className="rpg-card p-12 text-center text-[#8B7B74]/60 font-medium">
              No completed quests yet. Start your journey!
            </div>
          ) : (
            completedQuests.map(quest => (
              <QuestCard key={quest.id} quest={quest} onComplete={async () => {}} />
            ))
          )
        )}
      </div>
    </div>
  );
}
