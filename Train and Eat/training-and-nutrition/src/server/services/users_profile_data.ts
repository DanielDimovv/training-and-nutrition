import "server-only";
import { eq } from "drizzle-orm";
import { db } from "@/server/db/client";
import {
  userProfilesTable,
  SelectUserProfile,
  InsertUserProfile,
} from "../db/schema";
import { omitUndefined } from "./utils";



export async function getUserProfileData(
  userId: string,
): Promise<SelectUserProfile> {
  const [userData] = await db
    .select()
    .from(userProfilesTable)
    .where(eq(userProfilesTable.id, userId));

  if (!userData) {
    throw new Error("PROFILE_NOT_FOUND");
  }

  return userData;
}

export async function upsertProfileData(
  data: InsertUserProfile,
): Promise<SelectUserProfile> {

  const { id, ...rest } = data;
  const patch = omitUndefined(rest as Record<string, unknown>);

  const insertValues = { id, ...patch };

  const [userData] = await db
    .insert(userProfilesTable)
    .values(insertValues)
    .onConflictDoUpdate({
      target: userProfilesTable.id,
      set: {
        ...patch,
        updated_at: new Date(),
      },
    })
    .returning();

  if (!userData) {
    throw new Error("PROFILE_UPSERT_FAILED");
  }

  return userData;
}

export async function updateProfileData(
    data: { id: string } & Partial<Omit<SelectUserProfile, "id" | "updated_at">>,
  ): Promise<SelectUserProfile> {
    const { id, ...rest } = data;
    const patch = omitUndefined(rest as Record<string, unknown>);
    if (Object.keys(patch).length === 0) {
      throw new Error("NO_FIELDS_TO_UPDATE");
    }
    const [updated] = await db
      .update(userProfilesTable)
      .set({
        ...patch,
        updated_at: new Date(),
      })
      .where(eq(userProfilesTable.id, id))
      .returning();
    if (!updated) {
      throw new Error("PROFILE_NOT_FOUND");
    }
    return updated;
  }