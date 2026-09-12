import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { z } from "zod";

const alarmSchema = z.object({
  label: z.string().min(1, "Label is required"),
  time: z.string().min(1, "Time is required"),
  days: z.string(), // "0,1,2,3,4,5,6"
  isEnabled: z.boolean().default(true),
  sound: z.string().default("default"),
  snoozeDur: z.number().default(5),
});

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const alarms = await db.alarm.findMany({
      where: { userId: user.id },
      orderBy: { time: "asc" },
    });

    return NextResponse.json({ alarms }, { status: 200 });
  } catch (error) {
    console.error("Fetch alarms error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parsed = alarmSchema.parse(body);

    const alarm = await db.alarm.create({
      data: {
        userId: user.id,
        ...parsed,
      },
    });

    return NextResponse.json({ alarm }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ errors: (error as any).errors }, { status: 400 });
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
