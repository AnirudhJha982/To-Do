import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { getQuestRewards, Difficulty } from "@/lib/rpg";
import { z } from "zod";

const questSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  difficulty: z.enum(["Easy", "Medium", "Hard", "Epic"]),
  attribute: z.enum(["Strength", "Intellect", "Vitality", "Creativity", "Discipline"]),
  recurrenceRule: z.string().optional(),
  reminderTime: z.string().optional(),
  duration: z.number().optional(),
});

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const quests = await db.quest.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ quests }, { status: 200 });
  } catch (error) {
    console.error("Fetch quests error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, category, difficulty, attribute, recurrenceRule, reminderTime, duration } = questSchema.parse(body);

    const rewards = getQuestRewards(difficulty as Difficulty);

    const quest = await db.quest.create({
      data: {
        userId: user.id,
        title,
        description,
        category,
        difficulty,
        attribute,
        xpReward: rewards.xp,
        goldReward: rewards.gold,
        isCompleted: false,
        dueDate: new Date(),
        recurrenceRule,
        reminderTime,
        duration,
        isActive: true,
      },
    });

    return NextResponse.json(
      { message: "Quest created successfully", quest },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation error", errors: (error as any).errors },
        { status: 400 }
      );
    }
    
    console.error("Create quest error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
