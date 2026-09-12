"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const avatars = ["👤", "🧙‍♂️", "🧝‍♀️", "🧛‍♂️", "🧟", "🧞‍♂️", "🧜‍♀️", "🧚‍♂️", "🥷", "🤖"];

export default function CreateCharacter() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(avatars[0]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/character", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, avatar }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to create character");
      }

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-panel p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-6 text-glow">Create Character</h1>
        
        {error && <div className="bg-red-500/20 text-red-400 p-3 rounded mb-4 text-sm">{error}</div>}
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-300">Character Name</label>
            <input 
              type="text" 
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              placeholder="e.g. Hero of Time"
              required
              minLength={2}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-300">Choose Avatar</label>
            <div className="grid grid-cols-5 gap-3">
              {avatars.map(a => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setAvatar(a)}
                  className={`text-3xl p-2 rounded-lg border transition-all ${
                    avatar === a 
                      ? "bg-sky-900/50 border-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.5)]" 
                      : "bg-slate-800/50 border-slate-700 hover:border-slate-500 hover:bg-slate-700/50"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 mt-4 bg-gradient-to-r from-sky-600 to-purple-600 hover:from-sky-500 hover:to-purple-500 rounded-xl font-bold text-white shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all disabled:opacity-50"
          >
            {loading ? "Forging Character..." : "Begin Journey"}
          </button>
        </form>
      </div>
    </div>
  );
}
