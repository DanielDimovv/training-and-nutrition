import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { mapAuthError } from "@/server/services/auth-errors";

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
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({email, password});

    if (error) {
      const mapped = mapAuthError(error.code);
      return Response.json({ error: mapped.code }, { status: mapped.status });
    }

    return Response.json(
      { user: { id: data.user.id, email: data.user.email } },
      { status: 200 },
    );
  } catch {
    return Response.json({ error: "INTERNAL_SERVER_ERROR" }, { status: 500 });
  }
}