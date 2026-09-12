export type CharacterArchetype = {
  id: string;
  name: string;
  avatarStages: Record<number, string>;
  description: string;
  personality: {
    questComplete: string[];
    streakMaintained: string[];
    questMissed: string[];
    levelUp: string[];
  };
};

export const CHARACTERS: Record<string, CharacterArchetype> = {
  robo_cat: {
    id: "robo_cat",
    name: "Robo Cat",
    description: "A friendly, futuristic robotic companion.",
    avatarStages: {
      1: "🐱",
      5: "🐈",
      10: "🤖",
      20: "🚀",
      30: "🌠",
    },
    personality: {
      questComplete: ["Meow-velous job! 🐾", "Beep boop! Quest cleared! 🤖"],
      streakMaintained: ["Your energy core is fully charged! Keep it up!", "Purr-fect streak! 🐈"],
      questMissed: ["System error... Just kidding! Let's reboot and try again tomorrow.", "A minor glitch. You've got this!"],
      levelUp: ["Upgrade complete! You're stronger than ever. 🚀", "Level up! My sensors indicate massive power growth!"],
    },
  },
  shadow_ninja: {
    id: "shadow_ninja",
    name: "Shadow Ninja",
    description: "A stealthy and disciplined warrior of the night.",
    avatarStages: {
      1: "🥷",
      5: "🗡️",
      10: "⚔️",
      20: "🐉",
      30: "🌑",
    },
    personality: {
      questComplete: ["Swift and precise. Well done. 🥷", "Another target eliminated. ⚔️"],
      streakMaintained: ["Your discipline is legendary.", "The shadows watch your relentless progress."],
      questMissed: ["Even a master stumbles. Regain your focus.", "Rest now. Tomorrow, we strike again."],
      levelUp: ["Your skills have sharpened. 🗡️", "A new technique mastered. You are evolving!"],
    },
  },
  mystic_mage: {
    id: "mystic_mage",
    name: "Mystic Mage",
    description: "A scholar of ancient magic and arcane arts.",
    avatarStages: {
      1: "🧙",
      5: "📜",
      10: "🔮",
      20: "⚡",
      30: "🌌",
    },
    personality: {
      questComplete: ["A brilliant display of magic! 🔮", "Your knowledge expands. 📜"],
      streakMaintained: ["Your mana is overflowing! ⚡", "Such consistent spellcasting!"],
      questMissed: ["The stars were not aligned today. Rest your mind.", "A fizzled spell. We shall study more tomorrow."],
      levelUp: ["Cosmic power courses through you! 🌌", "Your arcane mastery reaches new heights!"],
    },
  },
  hero_kid: {
    id: "hero_kid",
    name: "Hero Kid",
    description: "A brave, optimistic young superhero.",
    avatarStages: {
      1: "🦸",
      5: "🛡️",
      10: "🔥",
      20: "💥",
      30: "⭐",
    },
    personality: {
      questComplete: ["Awesome job, hero! 💥", "You saved the day again! 🦸"],
      streakMaintained: ["You're on fire! 🔥", "Nothing can stop you now!"],
      questMissed: ["Even heroes need a day off. Get some rest!", "We'll get 'em next time!"],
      levelUp: ["SUPER LEVEL UP! ⭐", "Your powers are getting stronger! 🛡️"],
    },
  },
  knight: {
    id: "knight",
    name: "Knight",
    description: "A noble warrior bound by honor and courage.",
    avatarStages: {
      1: "🏇",
      5: "🗡️",
      10: "🛡️",
      20: "🏰",
      30: "👑",
    },
    personality: {
      questComplete: ["A glorious victory! 🗡️", "Honor is yours this day."],
      streakMaintained: ["Your valor shines bright! 🛡️", "A true champion never yields."],
      questMissed: ["Do not despair. Retreat and recover.", "Even the bravest fall sometimes. Rise again."],
      levelUp: ["You have proven your worth! 👑", "Your legend grows!"],
    },
  }
};
