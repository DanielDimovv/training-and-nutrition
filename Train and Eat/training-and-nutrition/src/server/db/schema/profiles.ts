import {
  integer,
  uuid,
  pgTable,
  text,
  timestamp,
  pgEnum,
  jsonb,
} from "drizzle-orm/pg-core";
import { authUsers } from "./supabase-auth";
import {
  EXPERIENCE_LEVELS,
  ACTIVITY_LEVELS,
  SEX_VALUES,
  DIET_VALUES,
  type Goal,
  type WorkoutType,
} from "@/lib/profile-constants";

// Стойностите идват от profile-constants, за да не се разминават
// enum-ите в базата с zod валидацията на клиента.
export const experienceLevelEnum = pgEnum("experience_level", [
  ...EXPERIENCE_LEVELS,
]);

export const activityLevelEnum = pgEnum("activity_level", [...ACTIVITY_LEVELS]);

export const sexEnum = pgEnum("sex", [...SEX_VALUES]);

export const dietEnum = pgEnum("diet_type", [...DIET_VALUES]);

export const userProfilesTable = pgTable("profiles", {
  id: uuid()
    .primaryKey()
    .references(() => authUsers.id, { onDelete: "cascade" }),

  full_name: text(),

  experience_level: experienceLevelEnum(),
  age: integer(),

  height_cm: integer(),
  weight_kg: integer(),

  sex: sexEnum(),

  activity_level: activityLevelEnum(),

  goals: jsonb().$type<Goal[]>(),
  workout_types: jsonb().$type<WorkoutType[]>(),

  weekly_training_days: integer(),

  diet_preference: dietEnum(),

  notes: text(),

  updated_at: timestamp({ withTimezone: true }).defaultNow().notNull(),
});

export type SelectUserProfile = typeof userProfilesTable.$inferSelect;
export type InsertUserProfile = typeof userProfilesTable.$inferInsert;
