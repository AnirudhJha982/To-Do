# Life RPG

"Turn your real life into a game."

Life RPG transforms boring real-world productivity tasks into RPG quests. Complete quests to earn XP, collect Gold, level up your character, and build your real-life attributes!

## Features

- **Gamified To-Do List**: Create quests with difficulty levels, categories, and attribute targets.
- **Character Progression**: Earn XP and level up. The XP requirement scales exponentially.
- **Attribute System**: Build Strength, Intellect, Vitality, Creativity, and Discipline by completing specific quests.
- **Streak Tracking**: Maintain a daily streak for logging activities.
- **Reward Economy**: Earn gold and spend it in the Item Shop.
- **Security & Anti-Cheating**: All XP, levels, and attributes are calculated server-side.

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React, Tailwind CSS v4, Framer Motion, Lucide React
- **Backend**: Next.js API Routes (Serverless)
- **Database**: SQLite (Local Dev) / PostgreSQL (Production) via Prisma ORM
- **Authentication**: NextAuth (Auth.js) Credentials Provider + bcrypt
- **Validation**: Zod

## Architecture

The application is built with a server-first mindset for state management to prevent client-side cheating. The frontend provides optimistic UI updates where appropriate but relies on the backend for true state.

- `src/lib/rpg.ts` - Core leveling algorithm and streak calculations
- `src/app/api/quests/[id]/complete/route.ts` - Transactional endpoint for safely rewarding players
- `src/components/rpg/` - Reusable RPG-themed UI components (XP bars, attribute cards)

## Database Setup (Prisma)

1. Set your `DATABASE_URL` in `.env` (defaults to local SQLite `file:./dev.db`).
2. Run migrations:
```bash
npx prisma db push
```

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

## Production Build

```bash
npm run build
npm start
```

## Screenshots
*(Add screenshots here)*

## Demo Video
*(Add demo video link here)*
