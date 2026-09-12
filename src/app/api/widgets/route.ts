import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { z } from "zod";

const widgetPrefSchema = z.object({
  widgetId: z.string(),
  order: z.number(),
  isVisible: z.boolean(),
  config: z.string().nullable().optional(),
});

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const preferences = await db.widgetPreference.findMany({
      where: { userId: user.id },
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ preferences }, { status: 200 });
  } catch (error) {
    console.error("Fetch widgets error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const preferences = z.array(widgetPrefSchema).parse(body);

    // Replace all preferences (delete and recreate for simplicity)
    await db.widgetPreference.deleteMany({
      where: { userId: user.id },
    });

    await db.widgetPreference.createMany({
      data: preferences.map((p) => ({
        ...p,
        userId: user.id,
      })),
    });

    return NextResponse.json({ message: "Preferences saved" }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ errors: (error as any).errors }, { status: 400 });
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
