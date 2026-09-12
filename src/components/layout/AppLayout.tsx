"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Don't show the app header/sidebar on public marketing/auth pages
  const isPublicPage = pathname === "/" || pathname === "/login" || pathname === "/signup";
  
  if (isPublicPage) {
    return <>{children}</>;
  }
  
  return (
    <div className="flex h-screen overflow-hidden bg-transparent">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-y-auto custom-scrollbar relative">
        <Header />
        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
