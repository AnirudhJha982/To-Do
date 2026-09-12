import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { z } from "zod";

const characterSchema = z.object({
  name: z.string().min(2, "Character name must be at least 2 characters"),
  avatar: z.string().min(1, "Please select an avatar"),
});

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, avatar } = characterSchema.parse(body);

    const existingCharacter = await db.character.findUnique({
      where: { userId: user.id },
    });

    if (existingCharacter) {
      return NextResponse.json(
        { message: "Character already exists" },
        { status: 409 }
      );
    }

    const character = await db.character.create({
      data: {
        userId: user.id,
        name,
        avatar,
        level: 1,
        xp: 0,
        gold: 0,
        strength: 1,
        intellect: 1,
        vitality: 1,
        creativity: 1,
        discipline: 1,
      },
    });

    return NextResponse.json(
      { message: "Character created successfully", character },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation error", errors: error.errors },
        { status: 400 }
      );
    }
    
    console.error("Character creation error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const character = await db.character.findUnique({
      where: { userId: user.id },
    });

    if (!character) {
      return NextResponse.json(
        { message: "Character not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ character }, { status: 200 });
  } catch (error) {
    console.error("Fetch character error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
