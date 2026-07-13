import "server-only";
import { eq } from "drizzle-orm";
import { db } from "@/server/db/client";
import { usersTable, SelectUser, InsertUser } from "@/server/db/schema/users";
import bcrypt from "bcrypt";
import { omitUndefined } from "./utils";

type ReturnUser = {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
};

type UpdateUserInput = {
  id: number;
  name?: string;
  email?: string;
  password?: string;
};

export async function getUserByEmail(email: string) {
  const rows = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .limit(1);
  return rows[0] ?? null;
}

export async function getUserById(id: number) {
  const rows = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, id))
    .limit(1);

  return rows[0] ?? null;
}

export async function createUser(data: InsertUser): Promise<ReturnUser> {
  const existing = await getUserByEmail(data.email);
  if (existing) {
    throw new Error("EMAIL_ALREADY_EXISTS");
  }

  const normalizedEmail = data.email.trim().toLowerCase();
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const [user] = await db
    .insert(usersTable)
    .values({ ...data, email: normalizedEmail, password: hashedPassword })
    .returning({
      id: usersTable.id,
      name: usersTable.name,
      email: usersTable.email,
      createdAt: usersTable.created_at,
    });
  if (!user) {
    throw new Error("USER_CREATE_FAILED");
  }
  return user;
}

type UpdateUser = {
  id: number;
  name?: string;
  email?: string;
};

export async function updateUserProfile(data: UpdateUser) {
  const { id, ...patch } = data;

  const dataToUpdate = omitUndefined({
    name: patch.name,
    email: patch.email,
  });

  if (Object.keys(dataToUpdate).length === 0) {
    throw new Error("No fields provided for update");
  }

  if (dataToUpdate.email !== undefined) {
    const normalized = dataToUpdate.email.trim().toLowerCase();
    if (normalized.length === 0) {
      throw new Error("EMAIL_EMPTY");
    }
    dataToUpdate.email = normalized;
    const owner = await getUserByEmail(dataToUpdate.email);
    if (owner && owner.id !== id) {
      throw new Error("EMAIL_ALREADY_EXISTS");
    }
  }

  const [updatedUser] = await db
    .update(usersTable)
    .set(dataToUpdate)
    .where(eq(usersTable.id, id))
    .returning({
      id: usersTable.id,
      name: usersTable.name,
      email: usersTable.email,
    });

  return updatedUser;
}

type UpdateUserPassword = {
  id: number;
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};
export async function updateUserPassword(data: UpdateUserPassword) {
  if (data.newPassword !== data.confirmNewPassword) {
    throw new Error("PASSWORD_MISMATCH");
  }
  const user = await getUserById(data.id);
  if (!user) throw new Error("USER_NOT_FOUND");

  const ok = await bcrypt.compare(data.currentPassword, user.password);
  if (!ok) throw new Error("INVALID_CURRENT_PASSWORD");

  const updatedPasswordHash = await bcrypt.hash(data.newPassword, 10);

  const [updatedUser] = await db
    .update(usersTable)
    .set({ password: updatedPasswordHash })
    .where(eq(usersTable.id, data.id))
    .returning({
      id: usersTable.id,
      name: usersTable.name,
      email: usersTable.email,
    });

  if (!updatedUser) throw new Error("USER_UPDATE_FAILED");
  return updatedUser;
}


export async function deleteUser(id:number) {
  const [deletedUser] = await db.delete(usersTable).where(eq(usersTable.id,id)).returning()

  return deletedUser !== undefined
}

