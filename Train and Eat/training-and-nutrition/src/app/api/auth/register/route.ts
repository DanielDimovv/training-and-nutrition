import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { mapAuthError } from "@/server/services/auth-errors";

const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.email().transform((v) => v.trim().toLowerCase()),
  password: z.string().min(8).max(128),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: "INVALID_INPUT", details: z.flattenError(parsed.error) },
        { status: 400 },
      );
    }

    const { name, email, password } = parsed.data;

    const supabase = await createClient();

    // full_name отива в raw_user_meta_data, откъдето handle_new_user
    // trigger-ът го копира в public.profiles.
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });

    if (error) {
      const mapped = mapAuthError(error.code);
      return Response.json({ error: mapped.code }, { status: mapped.status });
    }

    return Response.json(
      {
        message: "User created successfully",
        user: {
          id: data.user?.id,
          email: data.user?.email,
        },
        // Липсва сесия => Supabase изисква потвърждение по имейл.
        needsEmailConfirmation: !data.session,
      },
      { status: 201 },
    );
  } catch {
    // signUp връща грешките като стойност, не ги хвърля — дотук стигат
    // само истински изключения (невалиден JSON, мрежов проблем).
    return Response.json({ error: "INTERNAL_SERVER_ERROR" }, { status: 500 });
  }
}




// import { z } from "zod";
// import { createUser } from "@/server/services/users";
// import { createSession } from "@/server/services/auth";
// import { cookies } from "next/headers";

// const registerSchema = z.object({
//   name: z.string().trim().min(2).max(80),
//   email: z.email().transform((v) => v.trim().toLowerCase()),
//   password: z.string().min(8).max(128),
// });

// export async function POST(request: Request) {
//   try {
//     const body = await request.json();
//     const parsed = registerSchema.safeParse(body);

//     if (!parsed.success) {
//       return Response.json(
//         { error: "INVALID_INPUT", details: z.flattenError(parsed.error) },
//         { status: 400 },
//       );
//     }

//     const { name, email, password } = parsed.data;

//     const newUser = await createUser({ name, email, password });
//     const session = await createSession(newUser.id);

//     const cookieStore = await cookies();

//     const maxAge = Math.max(
//       0,
//       Math.floor((session.expires_at.getTime() - Date.now()) / 1000),
//     );

//     cookieStore.set("session_id", session.id, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "lax",
//       path: "/",
//       maxAge,
//       expires: session.expires_at,
//     });

//     return Response.json(
//       {
//         message: "User created successfully",
//         user: {
//           id: newUser.id,
//           name: newUser.name,
//           email: newUser.email,
//         },
//       },
//       { status: 201 },
//     );
//   } catch (error) {
//     if (error instanceof Error && error.message === "EMAIL_ALREADY_EXISTS") {
//       return Response.json({ error: "EMAIL_ALREADY_EXISTS" }, { status: 409 });
//     }

//     return Response.json({ error: "INTERNAL_SERVER_ERROR" }, { status: 500 });
//   }
// }