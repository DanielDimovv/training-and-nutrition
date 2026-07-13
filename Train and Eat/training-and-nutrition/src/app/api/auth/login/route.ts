import { z } from "zod";
import { cookies } from "next/headers";
import { login } from "@/server/services/auth";

const loginSchema = z.object({
  email: z.email().transform((v) => v.trim().toLowerCase()),
  password: z.string().min(8).max(128),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        { error: "INVALID_INPUT", details: z.flattenError(parsed.error) },
        { status: 400 },
      );
    }
    const { email, password } = parsed.data;
    const result = await login(email, password);
    const cookieStore = await cookies();
    const maxAge = Math.max(
      0,
      Math.floor((result.expires_at.getTime() - Date.now()) / 1000),
    );
    cookieStore.set("session_id", result.sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge,
      expires: result.expires_at,
    });
    return Response.json({ user: result.user }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "INVALID_CREDENTIALS") {
        return Response.json({ error: "INVALID_CREDENTIALS" }, { status: 401 });
      }
      if (error.message === "ACCOUNT_LOCKED") {
        return Response.json({ error: "ACCOUNT_LOCKED" }, { status: 423 });
      }
      if (error.message === "SESSION_CREATE_FAILED") {
        return Response.json(
          { error: "SESSION_CREATE_FAILED" },
          { status: 500 },
        );
      }
      if (error.message === "LOGIN_UPDATE_FAILED") {
        return Response.json(
          { error: "LOGIN_UPDATE_FAILED" },
          { status: 500 },
        );
      }
    }
    return Response.json({ error: "INTERNAL_SERVER_ERROR" }, { status: 500 });
  }
}
