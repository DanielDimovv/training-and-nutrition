import { cookies } from "next/headers";
import { logout } from "@/server/services/auth";


export async function POST() {

  try {

    const cookieStore = await cookies();
    const sessionId = cookieStore.get("session_id")?.value;
    
    if (!sessionId) {
      cookieStore.delete("session_id");
      return Response.json({ message: "Logged out" }, { status: 200 });
    }
    
    await logout(sessionId);
    cookieStore.delete("session_id");
    return Response.json({ message: "Logged out" }, { status: 200 });
  } catch {
    return Response.json(
      { error: "INTERNAL_SERVER_ERROR" },
      { status: 500 },
    );
  }
}