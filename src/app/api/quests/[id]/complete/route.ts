import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { updateStreak, getLevelFromXP } from "@/lib/rpg";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // In Next.js 15, params are promises
) {
  try {
    const { id: questId } = await params;
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const quest = await db.quest.findUnique({
      where: { id: questId },
    });

    if (!quest) {
      return NextResponse.json({ message: "Quest not found" }, { status: 404 });
    }

    if (quest.userId !== user.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    if (quest.isCompleted) {
      return NextResponse.json(
        { message: "Quest already completed" },
        { status: 400 }
      );
    }

    // Get character
    const character = await db.character.findUnique({
      where: { userId: user.id },
    });

    if (!character) {
      return NextResponse.json(
        { message: "Character not found" },
        { status: 404 }
      );
    }

    // Run within a transaction to ensure atomic updates
    const updatedState = await db.$transaction(async (tx) => {
      // 1. Update Quest
      await tx.quest.update({
        where: { id: quest.id },
        data: { isCompleted: true },
      });

      // 2. Create Completion History
      await tx.questCompletion.create({
        data: {
          userId: user.id,
          questId: quest.id,
          xpEarned: quest.xpReward,
          goldEarned: quest.goldReward,
          attributeInc: quest.attribute,
        },
      });

      // 3. Calculate New Character State
      const newXp = character.xp + quest.xpReward;
      const newLevel = getLevelFromXP(newXp);
      const newGold = character.gold + quest.goldReward;
      
      const leveledUp = newLevel > character.level;

      // 4. Update streak
      const { newStreak } = updateStreak(
        character.lastActivity,
        character.currentStreak
      );
      
      const newLongestStreak = Math.max(character.longestStreak, newStreak);

      // 5. Update Attribute
      const attributeUpdates: any = {};
      const attrKey = quest.attribute.toLowerCase() as keyof typeof character;
      if (typeof character[attrKey] === "number") {
        attributeUpdates[attrKey] = (character[attrKey] as number) + 1;
      }

      // 6. Save updated character
      const updatedCharacter = await tx.character.update({
        where: { id: character.id },
        data: {
          xp: newXp,
          level: newLevel,
          gold: newGold,
          currentStreak: newStreak,
          longestStreak: newLongestStreak,
          lastActivity: new Date(),
          ...attributeUpdates,
        },
      });

      return {
        character: updatedCharacter,
        leveledUp,
      };
    });

    return NextResponse.json(
      { 
        message: "Quest completed", 
        character: updatedState.character,
        leveledUp: updatedState.leveledUp
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Complete quest error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
