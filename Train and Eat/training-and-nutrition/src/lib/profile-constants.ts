/**
 * Единственият източник на истината за стойностите в профила.
 *
 * Файлът НЯМА зависимости — това е нарочно. Внася се и от схемата на базата
 * (за pgEnum), и от клиентски код (за zod валидация), без нито една страна
 * да влачи другата в своя бъндъл.
 *
 * `as const` е задължително навсякъде: без него TypeScript вижда само
 * `string[]` и се губят литералните типове, от които зависят z.enum()
 * и изведените типове отдолу.
 */

export const EXPERIENCE_LEVELS = [
  "beginner",
  "intermediate",
  "advanced",
] as const;

export const SEX_VALUES = ["male", "female"] as const;

export const ACTIVITY_LEVELS = [
  "sedentary",
  "light",
  "moderate",
  "active",
  "very_active",
] as const;

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
  "weight_gain",
] as const;

export type ExperienceLevel = (typeof EXPERIENCE_LEVELS)[number];
export type Sex = (typeof SEX_VALUES)[number];
export type ActivityLevel = (typeof ACTIVITY_LEVELS)[number];
export type DietType = (typeof DIET_VALUES)[number];
export type WorkoutType = (typeof WORKOUT_TYPES)[number];
export type Goal = (typeof GOALS)[number];
