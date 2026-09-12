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
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#EAB62D]/20 blur-[150px] rounded-full" />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] bg-[#765B57]/10 blur-[150px] rounded-full" />
      </div>
      
      {/* Navbar */}
      <header className="w-full p-6 flex justify-between items-center z-40 max-w-7xl mx-auto backdrop-blur-sm border-b border-[#4D3935]/10">
        <div className="flex items-center gap-3 group cursor-pointer">
          <img src="/logo.jpg" alt="Journix Logo" className="w-12 h-12 rounded-full object-cover shadow-lg" />
          <span className="text-2xl font-black font-serif tracking-widest text-[#4D3935]">
            JOURNIX
          </span>
        </div>
        <nav className="flex gap-4 items-center">
          <Link href="/login" className="px-5 py-2.5 rounded-lg font-bold text-[#8B7B74] hover:text-[#4D3935] transition-all">
            LOG IN
          </Link>
          <Link href="/signup" className="px-6 py-2.5 rounded-lg font-bold bg-[#765B57] text-[#E2E4E6] hover:bg-[#4D3935] transition-all shadow-md">
            START YOUR QUEST →
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 md:px-8 py-12 md:py-24 z-10 max-w-7xl mx-auto w-full relative">
        <div className="flex flex-col items-center justify-center text-center w-full max-w-4xl mx-auto">
          
          {/* LEFT SIDE: Copy & CTA */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center text-center"
          >
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black font-serif text-[#4D3935] mb-6 leading-[1.1]">
              YOUR<br />
              JOURNEY,<br />
              <span className="text-[#765B57]">GAMIFIED.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-[#8B7B74]/80 mb-10 leading-relaxed max-w-xl font-medium">
              Complete real-world quests. <br/>
              Earn XP. <br/>
              Build your character. <br/>
              Level up your life.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link href="/signup" className="px-8 py-4 rounded-xl font-bold bg-[#EAB62D] hover:bg-[#DDA51C] text-[#4D3935] transition-all shadow-md hover:shadow-lg hover:-translate-y-1 flex items-center justify-center gap-3 text-lg">
                START YOUR QUEST <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="#features" className="px-8 py-4 rounded-xl font-bold bg-white border border-[#EAB62D]/50 hover:bg-[#E2E4E6] text-[#4D3935] transition-all flex items-center justify-center gap-2 text-lg">
                SEE HOW IT WORKS
              </Link>
            </div>
          </motion.div>
          

          
        </div>

        {/* Info Section */}
        <div id="features" className="w-full mt-24 md:mt-32 pt-16 border-t border-[#EAB62D]/30">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif font-black text-[#4D3935] mb-6">THE SOLUTION</h2>
            <p className="text-xl text-[#8B7B74]/80 max-w-2xl mx-auto font-medium">
              Real-life task → Quest → XP → Attribute → Reward → Level Up
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rpg-card p-8 text-center">
              <div className="w-16 h-16 bg-[#E2E4E6] rounded-full mx-auto flex items-center justify-center mb-6">
                <Sword className="w-8 h-8 text-[#EAB62D]" />
              </div>
              <h3 className="text-xl font-bold font-serif text-[#4D3935] mb-3">QUESTS</h3>
              <p className="text-[#8B7B74]/70 font-medium">Turn everyday tasks into missions.</p>
            </div>
            
            <div className="rpg-card p-8 text-center">
              <div className="w-16 h-16 bg-[#E2E4E6] rounded-full mx-auto flex items-center justify-center mb-6">
                <Brain className="w-8 h-8 text-[#EAB62D]" />
              </div>
              <h3 className="text-xl font-bold font-serif text-[#4D3935] mb-3">PROGRESSION</h3>
              <p className="text-[#8B7B74]/70 font-medium">Build your character through real actions.</p>
            </div>

            <div className="rpg-card p-8 text-center">
              <div className="w-16 h-16 bg-[#E2E4E6] rounded-full mx-auto flex items-center justify-center mb-6">
                <Coins className="w-8 h-8 text-[#EAB62D]" />
              </div>
              <h3 className="text-xl font-bold font-serif text-[#4D3935] mb-3">REWARDS</h3>
              <p className="text-[#8B7B74]/70 font-medium">Earn currency, achievements and unlockables.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
