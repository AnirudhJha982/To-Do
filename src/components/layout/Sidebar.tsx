"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Sword, User, TrendingUp, Trophy, ShoppingCart, Archive, History, Settings, LogOut, X, Menu } from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Quests", href: "/calendar", icon: Sword },
    { name: "Character", href: "/profile", icon: User },
    // { name: "Progress", href: "/progress", icon: TrendingUp },
    { name: "Achievements", href: "/achievements", icon: Trophy },
    { name: "Rewards", href: "/shop", icon: ShoppingCart },
    // { name: "Inventory", href: "/inventory", icon: Archive },
    // { name: "History", href: "/history", icon: History },
  ];

  const bottomItems = [
    // { name: "Settings", href: "/settings", icon: Settings },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Hamburger */}
      <button 
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-[#755A56] text-[#F8F3E7] rounded-lg shadow-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed md:sticky top-0 left-0 h-screen w-64 bg-[#755A56] flex flex-col z-40 transition-transform duration-300 ease-in-out border-r border-[#5E4A47]",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        
        {/* Brand Area */}
        <div className="p-6 border-b border-[#755A56]/50 flex items-center justify-center">
          <Link href="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-full bg-[#E8B83A] flex items-center justify-center text-[#5E4A47] font-black text-xl shadow-md group-hover:scale-105 transition-transform border-2 border-[#E3D5A7]/30">
              LR
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-serif font-bold text-[#F8F3E7] tracking-widest leading-tight">LIFE RPG</h1>
              <p className="text-[10px] text-[#E8B83A] uppercase tracking-widest font-bold">Your Journey</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-1 custom-scrollbar">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative",
                  isActive 
                    ? "bg-[#F8F3E7] text-[#5E4A47] shadow-sm shadow-[#000000]/5" 
                    : "text-[#F8F3E7]/80 hover:bg-[#5E4A47]/50 hover:text-[#F8F3E7]"
                )}
              >
                {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#E8B83A] rounded-r-md"></div>}
                <Icon className={cn("w-5 h-5 z-10", isActive ? "text-[#E8B83A]" : "text-[#E8B83A]/70 group-hover:text-[#E8B83A]")} />
                <span className={cn("font-medium z-10", isActive ? "font-bold" : "")}>{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-[#755A56] space-y-1">
          {bottomItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#F8F3E7]/70 hover:bg-[#755A56] hover:text-[#F8F3E7] transition-all"
              >
                <Icon className="w-5 h-5 text-[#E8B83A]/70" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
          
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[#F8F3E7]/70 hover:bg-rose-900/50 hover:text-rose-200 transition-all"
          >
            <LogOut className="w-5 h-5 text-rose-400" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
