import { requireAuth } from "@/server/services/require-auth";

export async function GET() {
  try {
    const user = await requireAuth();
    return Response.json({ user }, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return Response.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }
    return Response.json({ error: "INTERNAL_SERVER_ERROR" }, { status: 500 });
  }
}
