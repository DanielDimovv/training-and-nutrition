"use client";

import { useRouter } from "next/navigation";
import { useLogin } from "@/hooks/user";
import { getAuthErrorMessage } from "@/lib/utils";

import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useState } from "react";
import { Button } from "../ui/button";


export default function LoginForm() {
  const router = useRouter();

 

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const {
    mutate: login,
    isError: isLoginError,
    error: loginError,
    isPending: isLoginPending,
  } = useLogin();

  const isFormValid =
    loginData.email.trim().length > 0 && loginData.password.length >= 8;

  return (
    <Card className="w-full max-w-md mx-auto p-4 sm:p-6 mt-8 sm:mt-16">
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!isFormValid) return;
          login(loginData, {
            onSuccess: () => {
              router.push("/dashboard");
              setLoginData({
                email: "",
                password: "",
              });
            },
          });
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={loginData.email}
            onChange={(e) => {
              setLoginData({ ...loginData, email: e.target.value });
            }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={loginData.password}
            onChange={(e) => {
              setLoginData({ ...loginData, password: e.target.value });
            }}
          />
        </div>

        {isLoginError && (
          <p className="text-red-500">
            {getAuthErrorMessage(loginError?.message)}
          </p>
        )}

        <div>
          <Button type="submit" disabled={!isFormValid || isLoginPending}>
            {isLoginPending ? "Logging in..." : "Login"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
