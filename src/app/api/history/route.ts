import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const history = await db.questCompletion.findMany({
      where: { userId: user.id },
      orderBy: { completedAt: "desc" },
      include: { quest: true },
      take: 50,
    });

    return NextResponse.json({ history }, { status: 200 });
  } catch (error) {
    console.error("Fetch history error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
