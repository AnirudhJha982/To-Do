"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Sparkles, AlertCircle } from "lucide-react";
import { getQuestRewards } from "@/lib/rpg";

export default function NewQuestPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Productivity",
    difficulty: "Medium",
    attribute: "Discipline",
  });

  const rewards = getQuestRewards(formData.difficulty);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/quests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to create quest");
      }

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const attributes = ["Strength", "Intellect", "Vitality", "Creativity", "Discipline"];
  const categories = ["Productivity", "Fitness", "Study", "Coding", "Health", "Reading", "Custom"];
  const difficulties = ["Easy", "Medium", "Hard", "Epic"];

  return (
    <div className="min-h-screen p-4 md:p-8 flex items-center justify-center">
      <div className="glass-panel p-8 max-w-2xl w-full">
        <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
          <Sparkles className="w-8 h-8 text-sky-400" />
          <h1 className="text-3xl font-bold text-glow">Draft New Quest</h1>
        </div>
        
        {error && (
          <div className="bg-red-500/20 text-red-400 p-4 rounded-lg mb-6 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-300">Quest Title</label>
            <input 
              type="text" 
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              placeholder="e.g. 45 Minute Gym Session"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-slate-300">Description (Optional)</label>
            <textarea 
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 h-24 resize-none"
              placeholder="Any details about the quest..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">Category</label>
              <select 
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-sky-500"
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">Target Attribute</label>
              <select 
                value={formData.attribute}
                onChange={e => setFormData({ ...formData, attribute: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-sky-500"
              >
                {attributes.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-slate-300">Difficulty Level</label>
            <div className="grid grid-cols-4 gap-2">
              {difficulties.map(d => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setFormData({ ...formData, difficulty: d })}
                  className={`py-3 rounded-lg border text-sm font-bold transition-all ${
                    formData.difficulty === d 
                      ? "bg-sky-900/50 border-sky-400 text-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.3)]" 
                      : "bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-500 hover:bg-slate-700/50"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 bg-slate-900/80 rounded-lg border border-slate-700 mt-2 flex justify-between items-center">
            <div className="text-slate-400 text-sm">Estimated Rewards:</div>
            <div className="flex gap-4 font-bold">
              <span className="text-purple-400">+{rewards.xp} XP</span>
              <span className="text-yellow-400">+{rewards.gold} Gold</span>
            </div>
          </div>

          <div className="flex gap-4 mt-4">
            <button 
              type="button"
              onClick={() => router.back()}
              className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 py-4 bg-sky-600 hover:bg-sky-500 rounded-xl font-bold shadow-[0_0_15px_rgba(2,132,199,0.5)] transition-all disabled:opacity-50"
            >
              {loading ? "Creating..." : "Confirm Quest"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
