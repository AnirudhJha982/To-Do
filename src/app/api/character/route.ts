import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { z } from "zod";
import { CHARACTERS } from "@/lib/characters";

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

    const characterDef = CHARACTERS.find(c => c.id === avatar);
    if (!characterDef || characterDef.price > 0) {
      return NextResponse.json({ message: "Invalid or non-free avatar selected" }, { status: 400 });
    }

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
        { message: "Validation error", errors: (error as any).errors },
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

export async function PATCH(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    
    // Allow updating either name or avatar
    const updateSchema = z.object({
      name: z.string().min(2).optional(),
      avatar: z.string().min(1).optional(),
    }).refine(data => data.name !== undefined || data.avatar !== undefined, {
      message: "At least one field to update must be provided",
    });

    const data = updateSchema.parse(body);
    
    const currentCharacter = await db.character.findUnique({
      where: { userId: user.id }
    });
    
    if (!currentCharacter) {
       return NextResponse.json({ message: "Character not found" }, { status: 404 });
    }

    let updateData: any = { ...data };

    if (data.avatar && data.avatar !== currentCharacter.avatar) {
      const unlockedList = currentCharacter.unlockedAvatars.split(",");
      if (!unlockedList.includes(data.avatar)) {
        // Needs to buy
        const charDef = CHARACTERS.find(c => c.id === data.avatar);
        if (!charDef) {
           return NextResponse.json({ message: "Avatar not found" }, { status: 400 });
        }
        
        if (currentCharacter.gold < charDef.price) {
           return NextResponse.json({ message: "Not enough gold" }, { status: 400 });
        }
        
        // Deduct gold and add to unlocked
        updateData.gold = currentCharacter.gold - charDef.price;
        unlockedList.push(data.avatar);
        updateData.unlockedAvatars = unlockedList.join(",");
      }
    }

    const character = await db.character.update({
      where: { userId: user.id },
      data: updateData,
    });

    return NextResponse.json({ message: "Character updated successfully", character }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation error", errors: (error as any).errors },
        { status: 400 }
      );
    }
    
    console.error("Update character error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
