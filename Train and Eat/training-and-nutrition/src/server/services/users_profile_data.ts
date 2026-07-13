import "server-only";
import { eq } from "drizzle-orm";
import { db } from "@/server/db/client";
import {
  userProfilesTable,
  SelectUserProfile,
  InsertUserProfile,
} from "../db/schema";
import { omitUndefined } from "./utils";
import { getUserById } from "./users";
import { use } from "react";

export async function getUserProfileData(
  userId: number,
): Promise<SelectUserProfile> {
  const [userData] = await db
    .select()
    .from(userProfilesTable)
    .where(eq(userProfilesTable.user_id, userId));

  if (!userData) {
    throw new Error("PROFILE_NOT_FOUND");
  }

  return userData;
}

export async function upsertProfileData(
  data: InsertUserProfile,
): Promise<SelectUserProfile> {
  const user = await getUserById(data.user_id);
  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  const { user_id, ...rest } = data;
  const patch = omitUndefined(rest as Record<string, unknown>);

  const insertValues = { user_id, ...patch };

  const [userData] = await db
    .insert(userProfilesTable)
    .values(insertValues)
    .onConflictDoUpdate({
      target: userProfilesTable.user_id,
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
    data: { user_id: number } & Partial<Omit<SelectUserProfile, "user_id" | "updated_at">>,
  ): Promise<SelectUserProfile> {
    const { user_id, ...rest } = data;
    const user = await getUserById(user_id);
    if (!user) throw new Error("USER_NOT_FOUND");
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
      .where(eq(userProfilesTable.user_id, user_id))
      .returning();
    if (!updated) {
      throw new Error("PROFILE_NOT_FOUND");
    }
    return updated;
  }