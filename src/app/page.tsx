"use client";

import Link from "next/link";
import { ArrowRight, Sword, Brain, Dumbbell, ShieldCheck, Coins, Flame } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function LandingPage() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden font-sans">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-20">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#E8B83A]/20 blur-[150px] rounded-full" />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] bg-[#755A56]/10 blur-[150px] rounded-full" />
      </div>
      
      {/* Navbar */}
      <header className="w-full p-6 flex justify-between items-center z-40 max-w-7xl mx-auto backdrop-blur-sm border-b border-[#5E4A47]/10">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-[#E8B83A] flex items-center justify-center text-[#755A56] font-black text-xl shadow-lg">
            LR
          </div>
          <span className="text-2xl font-black font-serif tracking-widest text-[#5E4A47]">
            LIFE RPG
          </span>
        </div>
        <nav className="flex gap-4 items-center">
          <Link href="/login" className="px-5 py-2.5 rounded-lg font-bold text-[#8F7B77] hover:text-[#5E4A47] transition-all">
            LOG IN
          </Link>
          <Link href="/signup" className="px-6 py-2.5 rounded-lg font-bold bg-[#755A56] text-[#F8F3E7] hover:bg-[#5E4A47] transition-all shadow-md">
            START YOUR QUEST →
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 md:px-8 py-12 md:py-20 z-10 max-w-7xl mx-auto w-full relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center w-full">
          
          {/* LEFT SIDE: Copy & CTA */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-start text-left max-w-2xl"
          >
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black font-serif text-[#5E4A47] mb-6 leading-[1.1]">
              TURN YOUR<br />
              LIFE INTO<br />
              <span className="text-[#755A56]">A GAME.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-[#8F7B77]/80 mb-10 leading-relaxed max-w-xl font-medium">
              Complete real-world quests. <br/>
              Earn XP. <br/>
              Build your character. <br/>
              Level up your life.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link href="/signup" className="px-8 py-4 rounded-xl font-bold bg-[#E8B83A] hover:bg-[#C49B2E] text-[#5E4A47] transition-all shadow-md hover:shadow-lg hover:-translate-y-1 flex items-center justify-center gap-3 text-lg">
                START YOUR QUEST <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="#features" className="px-8 py-4 rounded-xl font-bold bg-white border border-[#E8B83A]/50 hover:bg-[#F8F3E7] text-[#5E4A47] transition-all flex items-center justify-center gap-2 text-lg">
                SEE HOW IT WORKS
              </Link>
            </div>
          </motion.div>
          
          {/* RIGHT SIDE: Interactive RPG HUD */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative w-full max-w-md mx-auto lg:ml-auto"
          >
            <div className="relative rpg-card p-6 md:p-8 overflow-hidden rounded-3xl shadow-xl border-[#E8B83A]/50 bg-white">
              
              {/* Header */}
              <div className="flex justify-between items-start mb-8 border-b border-[#E8B83A]/30 pb-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-[#F8F3E7] rounded-full border-2 border-[#E8B83A] flex items-center justify-center text-3xl shadow-sm relative">
                    👨‍💻
                    <div className="absolute -bottom-2 -right-2 bg-[#755A56] text-[#F8F3E7] text-xs font-black px-2 py-0.5 rounded border border-[#E8B83A] shadow-sm">
                      LVL 12
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-[#5E4A47] tracking-wide font-serif">RAMESH SINGH</h2>
                    <p className="text-[#755A56] font-bold text-sm tracking-widest uppercase">Technomancer</p>
                  </div>
                </div>
              </div>
              
              {/* Animated XP Bar */}
              <div className="mb-8">
                <div className="flex justify-between items-end mb-2">
                  <div className="flex items-center gap-1 text-[#755A56] font-bold text-sm uppercase tracking-wider">
                    Experience
                  </div>
                  <div className="text-xs font-bold text-[#8F7B77]/70">
                    1,240 / 1,500 XP
                  </div>
                </div>
                
                <div className="h-3 w-full bg-[#F8F3E7] rounded-full overflow-hidden border border-[#E8B83A]/30 relative">
                  <motion.div
                    className="absolute top-0 left-0 h-full bg-[#E8B83A]"
                    initial={{ width: 0 }}
                    animate={{ width: "82%" }}
                    transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                  />
                </div>
              </div>
              
              {/* Attributes */}
              <div className="space-y-4">
                <div className="text-xs text-[#8F7B77]/50 font-bold tracking-widest uppercase border-b border-[#E8B83A]/20 pb-2">
                  Core Attributes
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  {/* Intellect */}
                  <div className="flex items-center justify-between bg-[#F8F3E7] p-3 rounded-lg border border-[#E8B83A]/20">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded text-blue-600">
                        <Brain className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-[#5E4A47] tracking-wide uppercase text-sm">Intellect</span>
                    </div>
                    <span className="font-black text-[#755A56] font-serif text-xl">72</span>
                  </div>
                  
                  {/* Discipline */}
                  <div className="flex items-center justify-between bg-[#F8F3E7] p-3 rounded-lg border border-[#E8B83A]/20">
                    <div className="flex items-center gap-3">
                      <div className="bg-amber-100 p-2 rounded text-amber-600">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-[#5E4A47] tracking-wide uppercase text-sm">Discipline</span>
                    </div>
                    <span className="font-black text-[#755A56] font-serif text-xl">81</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
        </div>

        {/* Info Section */}
        <div id="features" className="w-full mt-24 md:mt-32 pt-16 border-t border-[#E8B83A]/30">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif font-black text-[#5E4A47] mb-6">THE SOLUTION</h2>
            <p className="text-xl text-[#8F7B77]/80 max-w-2xl mx-auto font-medium">
              Real-life task → Quest → XP → Attribute → Reward → Level Up
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rpg-card p-8 text-center">
              <div className="w-16 h-16 bg-[#F8F3E7] rounded-full mx-auto flex items-center justify-center mb-6">
                <Sword className="w-8 h-8 text-[#E8B83A]" />
              </div>
              <h3 className="text-xl font-bold font-serif text-[#5E4A47] mb-3">QUESTS</h3>
              <p className="text-[#8F7B77]/70 font-medium">Turn everyday tasks into missions.</p>
            </div>
            
            <div className="rpg-card p-8 text-center">
              <div className="w-16 h-16 bg-[#F8F3E7] rounded-full mx-auto flex items-center justify-center mb-6">
                <Brain className="w-8 h-8 text-[#E8B83A]" />
              </div>
              <h3 className="text-xl font-bold font-serif text-[#5E4A47] mb-3">PROGRESSION</h3>
              <p className="text-[#8F7B77]/70 font-medium">Build your character through real actions.</p>
            </div>

            <div className="rpg-card p-8 text-center">
              <div className="w-16 h-16 bg-[#F8F3E7] rounded-full mx-auto flex items-center justify-center mb-6">
                <Coins className="w-8 h-8 text-[#E8B83A]" />
              </div>
              <h3 className="text-xl font-bold font-serif text-[#5E4A47] mb-3">REWARDS</h3>
              <p className="text-[#8F7B77]/70 font-medium">Earn currency, achievements and unlockables.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
