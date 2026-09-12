"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { History, Star, Coins } from "lucide-react";
import { format } from "date-fns";

export default function HistoryPage() {
  const router = useRouter();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const charRes = await fetch("/api/character");
        if (!charRes.ok) {
          router.push("/create-character");
          return;
        }
        
        // Normally we would fetch from /api/history
        // Since we don't have that endpoint yet, we just render an empty list or UI shell
        const res = await fetch("/api/history").catch(() => null);
        if (res && res.ok) {
          const data = await res.json();
          setHistory(data.history || []);
        }
      } catch {
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [router]);

  if (loading) return null;

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-4xl mx-auto flex flex-col gap-6">
      <div className="flex justify-between items-center bg-slate-900/50 p-6 rounded-xl border border-slate-800">
        <h1 className="text-3xl font-black flex items-center gap-3 text-glow">
          <History className="w-8 h-8 text-sky-400" />
          Quest History
        </h1>
      </div>

      <div className="glass-panel p-6">
        {history.length === 0 ? (
          <div className="text-center p-12 text-slate-400">
            No completed quests yet. Start your journey!
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {history.map(record => (
              <div key={record.id} className="flex justify-between items-center p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                <div>
                  <div className="font-bold text-slate-200">{record.quest.title}</div>
                  <div className="text-sm text-slate-400">{new Date(record.completedAt).toLocaleDateString()}</div>
                </div>
                <div className="flex gap-4">
                  <span className="text-purple-400 font-bold text-sm bg-purple-500/10 px-2 py-1 rounded flex items-center gap-1">
                    <Star className="w-3 h-3" /> +{record.xpEarned}
                  </span>
                  <span className="text-yellow-400 font-bold text-sm bg-yellow-500/10 px-2 py-1 rounded flex items-center gap-1">
                    <Coins className="w-3 h-3" /> +{record.goldEarned}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
