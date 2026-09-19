import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";
import { WORKOUT_TYPES, DIET_VALUES, GOALS } from "./profile-constants";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAuthErrorMessage(code?: string): string {
  switch (code) {
    case "INVALID_CREDENTIALS":
      return "Invalid email or password.";
    case "ACCOUNT_LOCKED":
      return "Your account is temporarily locked. Please try again later.";
    case "EMAIL_ALREADY_EXISTS":
      return "An account with this email already exists.";
    case "INVALID_INPUT":
      return "Please check the form fields and try again.";
    case "UNAUTHORIZED":
      return "You need to sign in first.";
    case "INTERNAL_SERVER_ERROR":
      return "Something went wrong on our side. Please try again.";
    case "WEAK_PASSWORD":
      return "Password is too weak. Use a longer or more complex password.";
    case "EMAIL_NOT_CONFIRMED":
      return "Please confirm your email address before signing in.";
    case "INVALID_EMAIL":
      return "This email address is not valid or not allowed.";
    case "SIGNUP_DISABLED":
      return "Registration is currently disabled.";
    case "TOO_MANY_REQUESTS":
      return "Too many attempts. Please wait a moment and try again.";
    case "SAME_PASSWORD":
      return "The new password must be different from the current one.";
    case "REAUTH_REQUIRED":
      return "Please sign in again to complete this action.";
    default:
      return "Something went wrong. Please try again.";
  }
}

const goalEnum = z.enum(GOALS);
const workoutTypeEnum = z.enum(WORKOUT_TYPES);
const experienceLevelValues = ["beginner", "intermediate", "advanced"] as const;
const sexValues = ["male", "female"] as const;
const activityLevelValues = [
  "sedentary",
  "light",
  "moderate",
  "active",
  "very_active",
] as const;

// Full schema (source of truth)
export const userProfileSchema = z.object({
  experience_level: z.enum(experienceLevelValues),
  age: z.number().int().min(13).max(100),
  height_cm: z.number().int().min(120).max(250),
  weight_kg: z.number().min(30).max(300),
  sex: z.enum(sexValues),
  activity_level: z.enum(activityLevelValues),
  // според UI-то ти: масив от низове или по-структуриран обект
  goals: z.array(goalEnum).min(1, "Select at least one goal"),
  workout_types: z
    .array(workoutTypeEnum)
    .min(1, "Select at least one workout type"),
  weekly_training_days: z.number().int().min(1).max(7),
  diet_preference: z.enum(DIET_VALUES),
  notes: z.string().max(500).optional(),
});
// Step schemas
export const userProfileStep1Schema = userProfileSchema.pick({
  experience_level: true,
  age: true,
  sex: true,
});
export const userProfileStep2Schema = userProfileSchema.pick({
  height_cm: true,
  weight_kg: true,
  activity_level: true,
});
export const userProfileStep3Schema = userProfileSchema.pick({
  goals: true,
  workout_types: true,
  weekly_training_days: true,
  diet_preference: true,
  notes: true,
});
// Types
export type UserProfileInput = z.infer<typeof userProfileSchema>;
export type UserProfileStep1Input = z.infer<typeof userProfileStep1Schema>;
export type UserProfileStep2Input = z.infer<typeof userProfileStep2Schema>;
export type UserProfileStep3Input = z.infer<typeof userProfileStep3Schema>;
