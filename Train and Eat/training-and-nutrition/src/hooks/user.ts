import { useQuery, useMutation, } from "@tanstack/react-query";
import { authFetch } from "@/lib/authFetch";
import { InsertUser } from "@/server/db/schema";
import { LoginInput } from "@/types/api-types";
import { UserProfileInput } from "@/lib/utils";

export function useGetUserBySessionId() {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const response = await fetch("/api/auth/user");

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return data;
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: async (data: InsertUser) => {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      return await response.json();
    },
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: async (data: LoginInput) => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      return await response.json();
    },
  });
}

export function useSaveProfileDraft() {
  return useMutation({
    mutationFn: async (data: Partial<UserProfileInput>) => {
      const response = await fetch("/api/user/onboarding", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      return await response.json();
    },
  });
}

export function useSubmitProfile() {
  return useMutation({
    mutationFn: async (data: UserProfileInput) => {
      const response = await fetch("/api/user/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      return await response.json();
    },
  });
}
