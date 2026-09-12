export interface Character {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
}

export const CHARACTERS: Character[] = [
  {
    id: "scholar",
    name: "The Scholar",
    description: "A curious adventurer who loves learning.",
    image: "/characters/scholar.jpg",
    price: 250
  },
  {
    id: "warrior",
    name: "The Warrior",
    description: "Strong, disciplined and always ready for a challenge.",
    image: "/characters/warrior.jpg",
    price: 600
  },
  {
    id: "explorer",
    name: "The Explorer",
    description: "Always discovering something new.",
    image: "/characters/explorer.jpg",
    price: 300
  },
  {
    id: "creator",
    name: "The Creator",
    description: "Turns ideas into reality.",
    image: "/characters/creator.jpg",
    price: 1200
  },
  {
    id: "strategist",
    name: "The Strategist",
    description: "Master of planning and tactics.",
    image: "/characters/strategist.jpg",
    price: 800
  },
  {
    id: "guardian",
    name: "The Guardian",
    description: "Protector of the realm.",
    image: "/characters/guardian.jpg",
    price: 750
  },
  {
    id: "challenger",
    name: "The Challenger",
    description: "Loves to overcome difficult obstacles.",
    image: "/characters/challenger.jpg",
    price: 1000
  },
  {
    id: "adventurer",
    name: "The Adventurer",
    description: "Embraces the unknown journey ahead.",
    image: "/characters/adventurer.jpg",
    price: 150
  },
  {
    id: "new_1",
    name: "The Wanderer",
    description: "Ready to explore new horizons.",
    image: "/characters/new_avatar_1.png",
    price: 400
  },
  {
    id: "new_2",
    name: "The Companion",
    description: "Always there when you need a friend.",
    image: "/characters/new_avatar_2.png",
    price: 350
  },
  {
    id: "new_3",
    name: "The Prodigy",
    description: "Confident and full of potential.",
    image: "/characters/new_avatar_3.jpg",
    price: 1500
  },
  {
    id: "new_4",
    name: "The Troublemaker",
    description: "Mischievous but means well.",
    image: "/characters/new_avatar_4.jpg",
    price: 0
  }
];

export const VALID_CHARACTERS = CHARACTERS.map(c => c.id);
