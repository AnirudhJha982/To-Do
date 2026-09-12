"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Bell, CheckCircle2, AlertTriangle, Trophy, Zap, Trash2, Check } from "lucide-react";

type Notification = {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/notifications")
      .then(res => res.json())
      .then(data => {
        setNotifications(data.notifications || []);
        setIsLoading(false);
      });
  }, []);

  const markAllAsRead = async () => {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "markAllRead" }),
    });
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "REMINDER": return <Bell className="w-5 h-5 text-blue-500" />;
      case "MISSED_QUEST": return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case "ACHIEVEMENT": return <Trophy className="w-5 h-5 text-yellow-500" />;
      case "LEVEL_UP": return <Zap className="w-5 h-5 text-purple-500" />;
      default: return <Bell className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="container max-w-3xl mx-auto px-4 py-8 pb-32">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2 flex items-center gap-3">
            <Bell className="w-8 h-8 text-blue-500" />
            Notifications
          </h1>
          <p className="text-slate-400">Updates, reminders, and achievements.</p>
        </div>
        
        <button 
          onClick={markAllAsRead}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-white/5 text-sm font-medium"
        >
          <Check className="w-4 h-4" />
          Mark all read
        </button>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-slate-900/50 rounded-2xl border border-white/5"></div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/50 rounded-2xl border border-white/5">
            <CheckCircle2 className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-300">You're all caught up!</h3>
            <p className="text-slate-500 mt-2">No new notifications.</p>
          </div>
        ) : (
          notifications.map(n => (
            <div 
              key={n.id} 
              className={`p-4 rounded-2xl border transition-all ${
                n.isRead 
                  ? "bg-slate-900/50 border-white/5 opacity-70" 
                  : "bg-slate-800/80 border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.1)]"
              } flex gap-4`}
            >
              <div className="mt-1">
                {getIcon(n.type)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className={`font-medium ${n.isRead ? "text-slate-300" : "text-white"}`}>
                    {n.title}
                  </h3>
                  <span className="text-xs text-slate-500 whitespace-nowrap ml-4">
                    {format(new Date(n.createdAt), "MMM d, h:mm a")}
                  </span>
                </div>
                <p className="text-sm text-slate-400 mt-1">{n.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
