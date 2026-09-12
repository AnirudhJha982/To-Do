"use client";

import { useState, useEffect } from "react";
import { Bell, Plus, Clock, Trash2, CheckCircle2 } from "lucide-react";

type Alarm = {
  id: string;
  label: string;
  time: string;
  days: string;
  isEnabled: boolean;
};

export default function AlarmsPage() {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  // New alarm form state
  const [label, setLabel] = useState("");
  const [time, setTime] = useState("");
  const [days, setDays] = useState("Every day");

  useEffect(() => {
    fetch("/api/alarms")
      .then(res => res.json())
      .then(data => {
        setAlarms(data.alarms || []);
        setIsLoading(false);
      });
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!time || !label) return;

    const res = await fetch("/api/alarms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label, time, days }),
    });
    
    if (res.ok) {
      const data = await res.json();
      setAlarms([...alarms, data.alarm]);
      setIsCreating(false);
      setLabel("");
      setTime("");
    }
  };

  return (
    <div className="container max-w-3xl mx-auto px-4 py-8 pb-32">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2 flex items-center gap-3">
            <Clock className="w-8 h-8 text-rose-500" />
            Alarms
          </h1>
          <p className="text-slate-400">Set daily routines and reminders.</p>
        </div>
        
        <button 
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg transition-colors font-bold shadow-[0_0_15px_rgba(225,29,72,0.4)]"
        >
          <Plus className="w-5 h-5" />
          Add Alarm
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleCreate} className="bg-slate-900 border border-slate-700 p-6 rounded-2xl mb-8 space-y-4">
          <h3 className="text-lg font-bold text-white mb-4">New Alarm</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Time</label>
              <input type="time" required value={time} onChange={e => setTime(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-rose-500" />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Repeat</label>
              <select value={days} onChange={e => setDays(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-rose-500 appearance-none">
                <option>Every day</option>
                <option>Weekdays</option>
                <option>Weekends</option>
                <option>Once</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm text-slate-400 mb-1">Label</label>
            <input type="text" required value={label} onChange={e => setLabel(e.target.value)} placeholder="Wake Up, Gym, etc." className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-rose-500" />
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button type="button" onClick={() => setIsCreating(false)} className="px-4 py-2 text-slate-400 hover:text-white">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-rose-600 hover:bg-rose-500 text-white font-medium rounded-lg">Save</button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2].map(i => <div key={i} className="h-24 bg-slate-900/50 rounded-2xl border border-white/5"></div>)}
          </div>
        ) : alarms.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/50 rounded-2xl border border-white/5">
            <Bell className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-300">No alarms set</h3>
            <p className="text-slate-500 mt-2">Create an alarm to get started.</p>
          </div>
        ) : (
          alarms.map(alarm => (
            <div key={alarm.id} className="flex items-center justify-between bg-slate-900/80 p-5 rounded-2xl border border-white/5 hover:border-slate-700 transition-colors">
              <div>
                <div className="flex items-end gap-3 mb-1">
                  <h2 className="text-4xl font-light text-white">{alarm.time}</h2>
                </div>
                <div className="text-slate-400 text-sm flex items-center gap-2">
                  <span className="font-medium text-slate-300">{alarm.label}</span>
                  <span>•</span>
                  <span>{alarm.days}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <button className={`w-12 h-6 rounded-full transition-colors relative ${alarm.isEnabled ? 'bg-rose-500' : 'bg-slate-700'}`}>
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${alarm.isEnabled ? 'left-6' : 'left-0.5'}`} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
