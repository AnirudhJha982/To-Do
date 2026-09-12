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
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-[#765B57] text-[#E2E4E6] rounded-lg shadow-lg"
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
        "fixed md:sticky top-0 left-0 h-screen w-64 bg-[#DBC8B6] flex flex-col z-40 transition-transform duration-300 ease-in-out border-r border-[#DBC8B6]",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        
        {/* Brand Area */}
        <div className="p-8 border-b border-[#DBC8B6] flex items-center">
          <Link href="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-4 group">
            <img src="/logo.jpg" alt="Journix Logo" className="w-10 h-10 rounded-full object-cover shadow-md group-hover:scale-105 transition-transform" />
            <h1 className="text-xl font-serif font-bold text-[#1E1511] tracking-wide leading-tight">JOURNIX</h1>
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
                  "flex items-center gap-4 px-6 py-3.5 mx-2 rounded-2xl transition-all duration-200 group relative",
                  isActive 
                    ? "bg-[#F6F1EA] text-[#1E1511] shadow-sm font-semibold" 
                    : "text-[#1E1511] hover:bg-[#F6F1EA]/50 font-medium"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-[#1E1511]" : "text-[#1E1511]/70 group-hover:text-[#1E1511]")} />
                <span className="text-[15px]">{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-[#DBC8B6] space-y-1">
          {bottomItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-4 px-6 py-3.5 mx-2 rounded-2xl text-[#1E1511] hover:bg-[#F6F1EA]/50 transition-all font-medium"
              >
                <Icon className="w-5 h-5 text-[#1E1511]/70" />
                <span className="text-[15px]">{item.name}</span>
              </Link>
            );
          })}
          
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full flex items-center gap-4 px-6 py-3.5 mx-2 rounded-2xl text-[#1E1511] hover:bg-[#F6F1EA]/50 transition-all font-medium"
          >
            <div className="w-6 h-6 rounded-full bg-[#1E1511] flex items-center justify-center text-[#F6F1EA] text-[10px] font-bold">
              N
            </div>
            <span className="text-[15px]">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
