"use client";

import { useState, useEffect } from "react";
import { format, addDays, subDays, startOfWeek, endOfWeek, isSameDay } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, CheckCircle2 } from "lucide-react";

type Quest = {
  id: string;
  title: string;
  category: string;
  reminderTime?: string;
  isCompleted: boolean;
  dueDate: string;
  createdAt: string;
  recurrenceRule?: string;
};

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [quests, setQuests] = useState<Quest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/quests")
      .then(res => res.json())
      .then(data => {
        setQuests(data.quests || []);
        setIsLoading(false);
      });
  }, []);

  const startDate = startOfWeek(currentDate);
  const endDate = endOfWeek(addDays(startDate, 7));

  const days = [];
  let day = startDate;
  while (day <= endDate) {
    days.push(day);
    day = addDays(day, 1);
  }

  const prevWeek = () => setCurrentDate(subDays(currentDate, 14));
  const nextWeek = () => setCurrentDate(addDays(currentDate, 14));

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-8 pb-12">
      <div className="flex flex-col md:flex-row items-center justify-between border-b-2 border-[#765B57]/20 pb-4 gap-4">
        <div>
          <h1 className="text-4xl font-serif font-black text-[#4D3935] flex items-center gap-3">
            <CalendarIcon className="w-8 h-8 text-[#765B57]" />
            SCHEDULE
          </h1>
          <p className="text-[#8B7B74]/70 font-medium mt-1">Plan your quests and daily routines.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-white p-2 rounded-xl border border-[#EAB62D]/40 shadow-sm">
          <button onClick={prevWeek} className="p-2 hover:bg-[#E2E4E6] rounded-lg transition-colors">
            <ChevronLeft className="w-5 h-5 text-[#765B57]" />
          </button>
          <span className="text-[#4D3935] font-bold min-w-[140px] text-center tracking-wide uppercase">
            {format(startDate, "MMM d")} - {format(endDate, "MMM d")}
          </span>
          <button onClick={nextWeek} className="p-2 hover:bg-[#E2E4E6] rounded-lg transition-colors">
            <ChevronRight className="w-5 h-5 text-[#765B57]" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {days.map((d, i) => {
          const isToday = isSameDay(d, new Date());
          
          const dayQuests = quests.filter(q => {
            if (!q.dueDate && !q.recurrenceRule) return false;
            
            // Use dueDate or fallback to a current date for legacy quests
            const questDate = q.dueDate ? new Date(q.dueDate) : new Date();
            questDate.setHours(0, 0, 0, 0);
            
            const currentDay = new Date(d);
            currentDay.setHours(0, 0, 0, 0);

            // Do not show quests on days before they were created/due
            if (currentDay < questDate) return false;

            if (q.recurrenceRule === "daily") {
              return true;
            } else if (q.recurrenceRule === "weekdays") {
              const dayOfWeek = currentDay.getDay(); // 0 = Sunday, 6 = Saturday
              return dayOfWeek !== 0 && dayOfWeek !== 6;
            } else if (q.recurrenceRule === "weekly") {
              return currentDay.getDay() === questDate.getDay();
            }
            
            // Default: just once
            return isSameDay(questDate, currentDay);
          });

          return (
            <div 
              key={i} 
              className={`min-h-[200px] rounded-2xl border p-4 transition-all shadow-sm ${
                isToday 
                  ? "bg-[#EAB62D]/10 border-[#EAB62D]" 
                  : "bg-white border-[#EAB62D]/30 hover:border-[#EAB62D]/50"
              }`}
            >
              <div className="flex items-center justify-between mb-4 border-b border-[#EAB62D]/20 pb-2">
                <span className="text-[#8B7B74]/60 text-xs font-bold tracking-widest uppercase">{format(d, "EEE")}</span>
                <span className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-black ${
                  isToday ? "bg-[#765B57] text-[#E2E4E6] shadow-md shadow-[#765B57]/30" : "text-[#4D3935]"
                }`}>
                  {format(d, "d")}
                </span>
              </div>

              <div className="space-y-2">
                {dayQuests.length === 0 ? (
                  <p className="text-xs font-medium text-[#8B7B74]/40 text-center py-4 italic">No quests scheduled.</p>
                ) : (
                  dayQuests.map(q => (
                    <div 
                      key={q.id}
                      className="p-3 rounded-xl bg-[#E2E4E6] border border-[#EAB62D]/20 flex flex-col gap-1 shadow-sm"
                    >
                      <div className="flex justify-between items-start">
                        <span className={`text-sm font-bold ${q.isCompleted ? "line-through text-[#8B7B74]/50" : "text-[#4D3935]"}`}>
                          {q.title}
                        </span>
                        {q.isCompleted && <CheckCircle2 className="w-4 h-4 text-[#765B57]" />}
                      </div>
                      {q.reminderTime && (
                        <span className="text-[#765B57] font-bold text-[10px] uppercase tracking-widest bg-[#765B57]/10 px-2 py-0.5 rounded-sm inline-block w-fit mt-1">
                          {q.reminderTime}
                        </span>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
