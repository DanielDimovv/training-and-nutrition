import "server-only";
import { eq, and, gt } from "drizzle-orm";
import { db } from "@/server/db/client";
import { usersTable, SelectUser } from "@/server/db/schema/users";
import { sessionsTable } from "@/server/db/schema/auth";
import bcrypt from "bcrypt";
import { getUserByEmail } from "./users";
import { userProfilesTable } from "../db/schema";

const MAX_FAILED_ATTEMPTS = 3;
const LOCKOUT_MS = 60 * 60 * 1000;
const SESSION_MS = 60 * 60 * 1000;

export type SafeUser = Omit<SelectUser, "password">;
export type LoginResult = {
  user: SafeUser;
  sessionId: string;
  expires_at: Date;
};

export async function login(
  email: string,
  password: string,
): Promise<LoginResult> {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await getUserByEmail(normalizedEmail);
  if (!user) {
    throw new Error("INVALID_CREDENTIALS");
  }
  if (user.locked_until && user.locked_until > new Date()) {
    throw new Error("ACCOUNT_LOCKED");
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    const next = (user.failed_login_attempts ?? 0) + 1;
    const lockedUntil =
      next >= MAX_FAILED_ATTEMPTS ? new Date(Date.now() + LOCKOUT_MS) : null;
    await db
      .update(usersTable)
      .set({
        failed_login_attempts: next,
        locked_until: lockedUntil,
      })
      .where(eq(usersTable.id, user.id));
    if (next >= MAX_FAILED_ATTEMPTS) {
      throw new Error("ACCOUNT_LOCKED");
    }
    throw new Error("INVALID_CREDENTIALS");
  }
  const [updated] = await db
    .update(usersTable)
    .set({
      failed_login_attempts: 0,
      locked_until: null,
    })
    .where(eq(usersTable.id, user.id))
    .returning({
      id: usersTable.id,
      name: usersTable.name,
      email: usersTable.email,
      created_at: usersTable.created_at,
      failed_login_attempts: usersTable.failed_login_attempts,
      locked_until: usersTable.locked_until,
    });
  if (!updated) {
    throw new Error("LOGIN_UPDATE_FAILED");
  }
  const expiresAt = new Date(Date.now() + SESSION_MS);
  const [session] = await db
    .insert(sessionsTable)
    .values({
      user_id: user.id,
      expires_at: expiresAt,
    })
    .returning({ id: sessionsTable.id, expires_at: sessionsTable.expires_at });
  if (!session) {
    throw new Error("SESSION_CREATE_FAILED");
  }
  return {
    user: updated,
    sessionId: session.id,
    expires_at: session.expires_at,
  };
}

export async function logout(sessionId: string) {
  const [deletedSession] = await db
    .delete(sessionsTable)
    .where(eq(sessionsTable.id, sessionId))
    .returning();

  return deletedSession !== undefined;
}

type Session = {
  id: string;
  expires_at: Date;
};
export async function createSession(userId: number): Promise<Session> {
  const expiresAt = new Date(Date.now() + SESSION_MS);
  const [session] = await db
    .insert(sessionsTable)
    .values({ user_id: userId, expires_at: expiresAt })
    .returning({
      id: sessionsTable.id,
      expires_at: sessionsTable.expires_at,
    });
  if (!session) {
    throw new Error("SESSION_CREATE_FAILED");
  }
  return session;
}

export async function getUserBySessionId(sessionId: string) {
  const rows = await db
    .select({
      id: usersTable.id,
      name: usersTable.name,
      email: usersTable.email,
      experienceLevel: userProfilesTable.experience_level,
      age: userProfilesTable.age,
      heightCm: userProfilesTable.height_cm,
      weightKg: userProfilesTable.weight_kg,
      activityLevel: userProfilesTable.activity_level,
      goals: userProfilesTable.goals,
      weeklyTrainingDays: userProfilesTable.weekly_training_days,
      dietPreference: userProfilesTable.diet_preference,
    })
    .from(sessionsTable)
    .innerJoin(usersTable, eq(sessionsTable.user_id, usersTable.id))
    .leftJoin(userProfilesTable, eq(userProfilesTable.user_id, usersTable.id))
    .where(
      and(
        eq(sessionsTable.id, sessionId),
        gt(sessionsTable.expires_at, new Date()),
      ),
    );
  return rows[0] ?? null;
}
