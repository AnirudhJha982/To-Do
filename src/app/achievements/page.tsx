import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Trophy, Star, Shield, Flame, Sword, Sparkles, Target, Zap } from "lucide-react";

const ACHIEVEMENTS = [
  {
    id: "1",
    name: "First Steps",
    description: "Complete your very first quest.",
    icon: Star,
    xpReward: 50,
    goldReward: 100,
    unlocked: false,
  },
  {
    id: "2",
    name: "Warrior's Path",
    description: "Reach level 5 with your character.",
    icon: Sword,
    xpReward: 200,
    goldReward: 300,
    unlocked: false,
  },
  {
    id: "3",
    name: "Unstoppable",
    description: "Maintain a 7-day quest streak.",
    icon: Flame,
    xpReward: 500,
    goldReward: 500,
    unlocked: false,
  },
  {
    id: "4",
    name: "The Collector",
    description: "Unlock 3 premium avatars.",
    icon: Shield,
    xpReward: 300,
    goldReward: 1000,
    unlocked: false,
  },
  {
    id: "5",
    name: "Master of Intellect",
    description: "Complete 10 intellect-based quests.",
    icon: Sparkles,
    xpReward: 400,
    goldReward: 200,
    unlocked: false,
  },
  {
    id: "6",
    name: "Sharpshooter",
    description: "Complete all daily quests 3 days in a row.",
    icon: Target,
    xpReward: 250,
    goldReward: 150,
    unlocked: false,
  },
  {
    id: "7",
    name: "Overachiever",
    description: "Complete an Epic difficulty quest.",
    icon: Zap,
    xpReward: 600,
    goldReward: 400,
    unlocked: false,
  },
];

export default async function AchievementsPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const unlockedCount = ACHIEVEMENTS.filter((a) => a.unlocked).length;
  const progress = Math.round((unlockedCount / ACHIEVEMENTS.length) * 100);

  return (
    <>
      <div className="max-w-5xl mx-auto p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <header className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#1E1511] mb-4">Hall of Trophies</h1>
          <p className="text-[#493B36] text-lg max-w-2xl mx-auto">
            Your legendary accomplishments are recorded here. Complete quests to unlock achievements and earn massive rewards.
          </p>
        </header>

        {/* Progress Overview */}
        <div className="rpg-card p-6 mb-12 flex flex-col md:flex-row items-center justify-between gap-6 border-l-4 border-l-[#B87868]">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#B87868]/20 flex items-center justify-center">
              <Trophy className="w-8 h-8 text-[#B87868]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#1E1511]">Completion Rate</h2>
              <p className="text-[#493B36]">{unlockedCount} of {ACHIEVEMENTS.length} Unlocked</p>
            </div>
          </div>
          
          <div className="w-full md:w-1/2">
            <div className="flex justify-between text-sm font-bold text-[#493B36] mb-2">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="h-3 w-full bg-[#E1E7DD] rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#B87868] to-[#9A624E] rounded-full transition-all duration-1000"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ACHIEVEMENTS.map((achievement) => {
            const Icon = achievement.icon;
            return (
              <div 
                key={achievement.id}
                className={`relative overflow-hidden rounded-2xl border-2 transition-all duration-300 ${
                  achievement.unlocked 
                    ? "bg-[#F8F1E8] border-[#B87868] shadow-[0_4px_20px_-4px_rgba(184,120,104,0.3)] hover:-translate-y-1" 
                    : "bg-[#E1E7DD]/30 border-white grayscale-[0.8] opacity-70"
                }`}
              >
                <div className="p-6 flex flex-col items-center text-center h-full">
                  <div className={`w-16 h-16 rounded-full mb-4 flex items-center justify-center ${
                    achievement.unlocked ? "bg-[#B87868]/20" : "bg-[#94A3B8]/20"
                  }`}>
                    <Icon className={`w-8 h-8 ${achievement.unlocked ? "text-[#B87868]" : "text-[#786A63]"}`} />
                  </div>
                  
                  <h3 className={`text-xl font-bold mb-2 ${achievement.unlocked ? "text-[#1E1511]" : "text-[#493B36]"}`}>
                    {achievement.name}
                  </h3>
                  
                  <p className="text-sm text-[#786A63] mb-6 flex-grow">
                    {achievement.description}
                  </p>
                  
                  <div className="flex items-center gap-4 mt-auto">
                    <div className="flex items-center gap-1 bg-[#493B36]/10 px-3 py-1 rounded-full text-xs font-bold text-[#493B36]">
                      <span>XP</span>
                      <span>+{achievement.xpReward}</span>
                    </div>
                    <div className="flex items-center gap-1 bg-[#D8B28E]/20 px-3 py-1 rounded-full text-xs font-bold text-[#B87868]">
                      <span>Gold</span>
                      <span>+{achievement.goldReward}</span>
                    </div>
                  </div>
                </div>
                
                {achievement.unlocked && (
                  <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                    <div className="absolute top-4 -right-6 bg-[#B87868] text-white text-[10px] font-bold uppercase tracking-wider py-1 px-8 rotate-45">
                      Unlocked
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
