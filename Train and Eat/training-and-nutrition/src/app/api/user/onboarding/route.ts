import { z } from "zod";
import { userProfileSchema } from "@/lib/utils";
import { requireAuth } from "@/server/services/require-auth";
import { upsertProfileData } from "@/server/services/users_profile_data";


const onboardingDraftSchema = userProfileSchema.partial().strict();

export async function PATCH(reqest: Request) {
  try {
    const user = await requireAuth();
    const body = await reqest.json();
    
    const parsed = onboardingDraftSchema.safeParse(body);
    

    if (!parsed.success) {
      return Response.json(
        { error: "INVALID_INPUT", details: z.flattenError(parsed.error) },
        { status: 400 },
      );
    }

    if (Object.keys(parsed.data).length === 0) {
      return Response.json({ error: "EMPTY_PAYLOAD" }, { status: 400 });
    }

  
    const profile = await upsertProfileData({
      id: user.id,
      ...parsed.data,
    });

    return Response.json({ profile, draftSaved: true }, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return Response.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }
    return Response.json({ error: "INTERNAL_SERVER_ERROR" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const parsed = userProfileSchema.safeParse(body);
   
    if (!parsed.success) {
      return Response.json(
        { error: "INVALID_INPUT", details: z.flattenError(parsed.error) },
        { status: 400 },
      );
    }
    if (Object.keys(parsed.data).length === 0) {
      return Response.json({ error: "EMPTY_PAYLOAD" }, { status: 400 });
    }
   
    const profile = await upsertProfileData({
      id: user.id,
      ...parsed.data,
    });
    return Response.json({ profile, completed: true }, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return Response.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }
    return Response.json({ error: "INTERNAL_SERVER_ERROR" }, { status: 500 });
  }
}
