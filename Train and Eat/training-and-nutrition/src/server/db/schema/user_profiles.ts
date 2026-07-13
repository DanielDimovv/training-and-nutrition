import {
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
  pgEnum,
  jsonb,
} from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const experienceLevelEnum = pgEnum("experience_level", [
  "beginner",
  "intermediate",
  "advanced",
]);

export const activityLevelEnum = pgEnum("activity_level", [
  "sedentary",
  "light",
  "moderate",
  "active",
  "very_active",
]);

export const sexEnum = pgEnum("sex", ["male", "female"]);

export const DIET_VALUES = [
  "balanced",
  "high_protein",
  "low_carb",
  "keto",
  "paleo",
  "mediterranean",
  "vegetarian",
  "vegan",
  "pescatarian",
  "plant_based",
  "carnivore",
  "none",
  "other",
] as const;

export const dietEnum = pgEnum("diet_type", [...DIET_VALUES]);


export const WORKOUT_TYPES = [
  "strength_training",
  "hypertrophy",
  "bodybuilding",
  "crossfit",
  "hiit",
  "cardio",
  "bodyweight",
  "calisthenics",
  "powerlifting",
  "functional_training",
  "mobility",
  "yoga",
  "pilates",
  "running",
  "cycling",
  "swimming",
  "home_workouts",
] as const;

export const GOALS = [
  "fat_loss",
  "muscle_gain",
  "strength",
  "endurance",
  "general_fitness",
  "athletic_performance",
  "mobility",
  "rehabilitation",
  "maintenance",
  "posture",
  "tone",
  "weight_gain"
] as const;



export const userProfilesTable = pgTable("user_profiles", {
  user_id: integer()
    .primaryKey()
    .references(() => usersTable.id, { onDelete: "cascade" }),

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
export type WorkoutType = (typeof WORKOUT_TYPES)[number];
export type Goal = (typeof GOALS)[number];

