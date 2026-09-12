export type LifeCategory = {
  id: string;
  label: string;
  icon: string;
  color: string;
  defaultAttribute: string;
};

export const LIFE_CATEGORIES: LifeCategory[] = [
  { id: "school", label: "School", icon: "🎓", color: "bg-blue-500", defaultAttribute: "intellect" },
  { id: "tuition", label: "Tuition / Coaching", icon: "📚", color: "bg-cyan-500", defaultAttribute: "intellect" },
  { id: "college", label: "College / University", icon: "🎓", color: "bg-indigo-500", defaultAttribute: "intellect" },
  { id: "work", label: "Work", icon: "💼", color: "bg-amber-600", defaultAttribute: "discipline" },
  { id: "internship", label: "Internship", icon: "💻", color: "bg-teal-500", defaultAttribute: "intellect" },
  { id: "job", label: "Job", icon: "👔", color: "bg-slate-700", defaultAttribute: "discipline" },
  { id: "career", label: "Career / Skill Development", icon: "🚀", color: "bg-fuchsia-600", defaultAttribute: "creativity" },
  { id: "fitness", label: "Exercise / Fitness", icon: "💪", color: "bg-rose-600", defaultAttribute: "strength" },
  { id: "reading", label: "Reading", icon: "📖", color: "bg-violet-500", defaultAttribute: "intellect" },
  { id: "wellness", label: "Health / Wellness", icon: "🧘", color: "bg-emerald-500", defaultAttribute: "vitality" },
  { id: "finance", label: "Finance", icon: "💰", color: "bg-yellow-500", defaultAttribute: "discipline" },
  { id: "personal", label: "Personal", icon: "🏠", color: "bg-stone-500", defaultAttribute: "vitality" },
  { id: "family", label: "Family", icon: "👨‍👩‍👧", color: "bg-pink-500", defaultAttribute: "vitality" },
  { id: "hobbies", label: "Hobbies / Creativity", icon: "🎨", color: "bg-purple-500", defaultAttribute: "creativity" },
  { id: "coding", label: "Coding / Technology", icon: "💻", color: "bg-blue-600", defaultAttribute: "intellect" },
  { id: "custom", label: "Custom", icon: "📝", color: "bg-gray-500", defaultAttribute: "discipline" }
];
