"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface HeaderStats {
  level: number;
  gold: number;
  streak: number;
}

export function Header() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState<HeaderStats | null>(null);

  useEffect(() => {
    if (session?.user) {
      // In a real app we'd want to fetch this via React Query to keep it in sync,
      // but for now we'll fetch it once on load
      fetch("/api/character")
        .then(res => res.json())
        .then(data => {
          if (data && data.character) {
            setStats({
              level: data.character.level || 1,
              gold: data.character.gold || 0,
              streak: data.character.currentStreak || 0
            });
          }
        })
        .catch(console.error);
    }
  }, [session]);

  if (status === "loading" || !session) return null;

  return (
    <header className="sticky top-0 z-30 bg-[#F8F3E7] border-b border-[#E3D5A7] px-6 py-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 ml-12 md:ml-0">
        
        {/* Left Side: Greeting */}
        <div>
          <h2 className="text-sm md:text-base font-bold text-[#5E4A47] tracking-wide uppercase">
            GOOD MORNING, {session.user?.name?.split(" ")[0] || "PLAYER"} 👋
          </h2>
        </div>

        {/* Right Side: Stats Badges */}
        <div className="flex flex-wrap items-center gap-3">
          {stats && (
            <>
              <div className="flex items-center gap-2 bg-[#F8F3E7] border border-[#E3D5A7] px-3 py-1.5 rounded-full shadow-sm text-sm font-semibold text-[#16804D]">
                <span className="text-[#E8B83A]">🔥</span>
                <span>{stats.streak} Day Streak</span>
              </div>
              <div className="flex items-center gap-2 bg-[#F8F3E7] border border-[#E3D5A7] px-3 py-1.5 rounded-full shadow-sm text-sm font-semibold text-[#5E4A47]">
                <span className="text-[#E8B83A]">💰</span>
                <span>{stats.gold} Gold</span>
              </div>
              <div className="flex items-center gap-2 bg-[#755A56] border border-[#5E4A47] px-3 py-1.5 rounded-full shadow-sm text-sm font-bold text-[#F8F3E7]">
                <span className="text-[#E8B83A]">⭐</span>
                <span>Level {stats.level}</span>
              </div>
            </>
          )}
        </div>
        
      </div>
    </header>
  );
}
