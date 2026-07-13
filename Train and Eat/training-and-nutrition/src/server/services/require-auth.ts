import "server-only";
import { cookies } from "next/headers";
import { getUserBySessionId } from "@/server/services/auth";

export async function requireAuth() {

  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session_id")?.value;

  if (!sessionId) {
    throw new Error("UNAUTHORIZED");
  }
  
  const user = await getUserBySessionId(sessionId);
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}
