"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CharacterSelector } from "@/components/rpg/CharacterSelector";
import { useSession, signOut } from "next-auth/react";

export default function CreateCharacter() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const handleConfirm = async (characterId: string) => {
    setError("");

    const res = await fetch("/api/character", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Adventurer", avatar: characterId }),
    });

    if (!res.ok) {
      if (res.status === 401) {
        // If the session is invalid (e.g., db reset), automatically clear the bad cookie
        await signOut({ redirect: false });
        router.push("/login");
        return;
      }
      
      const data = await res.json();
      throw new Error(data.message || "Failed to create character");
    }

    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#E1C6C8] py-12 px-4 flex flex-col items-center">
      {error && (
        <div className="bg-red-500/20 text-red-900 border border-red-500 p-4 rounded-xl mb-8 font-medium">
          {error}
        </div>
      )}
      
      <CharacterSelector onConfirm={handleConfirm} />
    </div>
  );
}
