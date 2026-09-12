import { LIFE_CATEGORIES } from "./categories";

export type ParsedQuest = {
  title: string;
  categoryId?: string;
  time?: string; // HH:mm
  recurrence?: string; // "once", "daily", "weekdays", "weekly"
  duration?: number; // minutes
};

/**
 * Basic heuristic parser for "Quick Add" string
 * Examples: 
 * "Study DSA every day at 8 PM"
 * "Gym at 6 PM"
 * "Read 20 pages tonight"
 */
export function parseQuestIntent(input: string): ParsedQuest {
  const lower = input.toLowerCase();
  
  const result: ParsedQuest = {
    title: input,
    recurrence: "once",
  };

  // 1. Recurrence
  if (lower.includes("every day") || lower.includes("daily")) {
    result.recurrence = "daily";
    result.title = result.title.replace(/every day|daily/gi, "").trim();
  } else if (lower.includes("weekdays") || lower.includes("every weekday")) {
    result.recurrence = "weekdays";
    result.title = result.title.replace(/weekdays|every weekday/gi, "").trim();
  } else if (lower.includes("weekly") || lower.includes("every week")) {
    result.recurrence = "weekly";
    result.title = result.title.replace(/weekly|every week/gi, "").trim();
  }

  // 2. Time
  // Match "at 8 pm", "at 8:30am", "8pm", "20:00"
  const timeRegex = /(?:at\s*)?(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i;
  const timeMatch = lower.match(timeRegex);
  
  if (lower.includes("tonight")) {
    result.time = "20:00"; // Default tonight time
    result.title = result.title.replace(/tonight/gi, "").trim();
  } else if (timeMatch) {
    let hours = parseInt(timeMatch[1], 10);
    const minutes = timeMatch[2] || "00";
    const ampm = timeMatch[3];

    if (ampm === "pm" && hours < 12) hours += 12;
    if (ampm === "am" && hours === 12) hours = 0;

    result.time = `${hours.toString().padStart(2, '0')}:${minutes}`;
    
    // Remove the matched time string from the title
    result.title = result.title.replace(timeMatch[0], "").trim();
  }

  // 3. Category inference (very basic keyword matching)
  const categoryKeywords: Record<string, string[]> = {
    "study": ["study", "read", "learn", "homework", "assignment"],
    "fitness": ["gym", "workout", "exercise", "run", "yoga", "lift"],
    "coding": ["code", "program", "dsa", "leetcode", "react", "bug", "feature"],
    "work": ["meeting", "email", "report", "presentation"],
    "finance": ["budget", "pay", "invest", "taxes"],
  };

  let inferredCategory = "custom";
  outer: for (const [catId, keywords] of Object.entries(categoryKeywords)) {
    for (const kw of keywords) {
      if (lower.includes(kw)) {
        inferredCategory = catId;
        break outer;
      }
    }
  }
  
  // Try to map inferred to actual ID
  const cat = LIFE_CATEGORIES.find(c => c.id === inferredCategory || c.id.includes(inferredCategory));
  if (cat) {
    result.categoryId = cat.id;
  }

  // 4. Duration inference
  if (lower.includes("15 min")) result.duration = 15;
  else if (lower.includes("30 min") || lower.includes("half hour")) result.duration = 30;
  else if (lower.includes("1 hour") || lower.includes("an hour")) result.duration = 60;
  else if (lower.includes("2 hour")) result.duration = 120;

  // Cleanup title
  result.title = result.title.replace(/\s+/g, " ").trim();
  if (!result.title) result.title = "New Quest";

  return result;
}
