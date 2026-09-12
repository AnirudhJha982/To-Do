import { auth } from "@/app/api/auth/[...nextauth]/route";

export async function getSession() {
  return await auth();
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user;
}
