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
  const [greeting, setGreeting] = useState("HELLO");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("GOOD MORNING");
    else if (hour < 18) setGreeting("GOOD AFTERNOON");
    else setGreeting("GOOD EVENING");
  }, []);

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
    <header className="sticky top-0 z-30 bg-[#F6F1EA] px-8 py-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 ml-12 md:ml-0">
        
        {/* Left Side: Greeting */}
        <div>
          <h2 className="text-base font-bold text-[#1E1511] tracking-wide uppercase flex items-center gap-2">
            {greeting}, {session.user?.name?.split(" ")[0].toUpperCase() || "ADVENTURER"} <span className="text-xl">👋</span>
          </h2>
        </div>

        {/* Right Side: Stats Badges */}
        <div className="flex flex-wrap items-center gap-3">
          {stats && (
            <>
              <div className="flex items-center gap-2 bg-[#EAE0D6] px-4 py-1.5 rounded-full text-sm font-semibold text-[#1E1511]">
                <span className="text-[#A65B33]">🔥</span>
                <span>{stats.streak} Day Streak</span>
              </div>
              <div className="flex items-center gap-2 bg-[#EAE0D6] px-4 py-1.5 rounded-full text-sm font-semibold text-[#1E1511]">
                <span className="text-[#A65B33]">💰</span>
                <span>{stats.gold} Gold</span>
              </div>
              <div className="flex items-center gap-2 bg-[#EAE0D6] px-4 py-1.5 rounded-full text-sm font-semibold text-[#1E1511]">
                <span className="text-[#A65B33]">⭐</span>
                <span>Level {stats.level}</span>
              </div>
            </>
          )}
        </div>
        
      </div>
    </header>
  );
}
