import { auth } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";

export async function getSession() {
  return await auth();
}

export async function getCurrentUser() {
  const session = await getSession();
  
  if (!session?.user?.id) {
    return null;
  }
  
  // Verify user actually exists in the DB (prevents foreign key errors if DB was reset)
  const user = await db.user.findUnique({
    where: { id: session.user.id }
  });
  
  if (!user) {
    return null;
  }
  
  return session.user;
}
