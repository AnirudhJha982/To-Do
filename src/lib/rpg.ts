// lib/rpg.ts

export const XP_BASE = 100;
export const XP_EXPONENT = 1.5;

/**
 * Calculate the total XP required for a given level.
 * Formula: 100 * (level ^ 1.5)
 */
export function getXPRequiredForLevel(level: number): number {
  if (level <= 1) return 0;
  // XP required to reach this level from 0
  return Math.floor(XP_BASE * Math.pow(level - 1, XP_EXPONENT));
}

/**
 * Calculate current level based on total XP.
 */
export function getLevelFromXP(totalXP: number): number {
  let level = 1;
  while (totalXP >= getXPRequiredForLevel(level + 1)) {
    level++;
  }
  return level;
}

/**
 * Get progress data for the current level (XP towards next level)
 */
export function getXPProgress(totalXP: number) {
  const currentLevel = getLevelFromXP(totalXP);
  const xpForCurrentLevel = getXPRequiredForLevel(currentLevel);
  const xpForNextLevel = getXPRequiredForLevel(currentLevel + 1);
  
  const xpInCurrentLevel = totalXP - xpForCurrentLevel;
  const xpRequiredForNext = xpForNextLevel - xpForCurrentLevel;
  const progressPercentage = (xpInCurrentLevel / xpRequiredForNext) * 100;

  return {
    currentLevel,
    xpInCurrentLevel,
    xpRequiredForNext,
    progressPercentage,
    xpForCurrentLevel,
    xpForNextLevel
  };
}

export type Difficulty = "Easy" | "Medium" | "Hard" | "Epic";

export function getQuestRewards(difficulty: Difficulty | string) {
  switch (difficulty) {
    case "Easy": return { xp: 20, gold: 10 };
    case "Medium": return { xp: 40, gold: 20 };
    case "Hard": return { xp: 75, gold: 40 };
    case "Epic": return { xp: 150, gold: 80 };
    default: return { xp: 10, gold: 5 };
  }
}

export function updateStreak(lastActivity: Date | null | undefined, currentStreak: number) {
  if (!lastActivity) {
    return { newStreak: 1, reset: false };
  }
  
  const today = new Date();
  const last = new Date(lastActivity);
  
  // Normalize to start of day
  today.setHours(0, 0, 0, 0);
  last.setHours(0, 0, 0, 0);
  
  const diffTime = Math.abs(today.getTime() - last.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    // Already did an activity today
    return { newStreak: currentStreak, reset: false };
  } else if (diffDays === 1) {
    // Consecutive day
    return { newStreak: currentStreak + 1, reset: false };
  } else {
    // Streak broken
    return { newStreak: 1, reset: true };
  }
}
