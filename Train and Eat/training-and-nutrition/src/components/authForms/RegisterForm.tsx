"use client";
import { useRegister } from "@/hooks/user";
import { useRouter } from "next/navigation";
import { getAuthErrorMessage } from "@/lib/utils";

import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useState } from "react";
import { Button } from "../ui/button";


type RegisterData = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  };


export default function RegisterForm() {
  const router = useRouter();

  const [registerData, setRegisterData] = useState<RegisterData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const passwordsMatch = 
    registerData.password === registerData.confirmPassword;

  const isFormValid =
    registerData.name.trim().length >= 2 &&
    registerData.email.trim().length > 0 &&
    registerData.password.length >= 8 &&
    registerData.confirmPassword.length > 0 &&
    passwordsMatch;

  const {
    mutate: register,
    isError: isRegisterError,
    error: registerError,
    isPending: isRegisterPending,
  } = useRegister();

  return (
    <Card className="w-full max-w-md mx-auto p-4 sm:p-6 mt-8 sm:mt-16">
      <form className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!isFormValid) return;
          register({name:registerData.name, email:registerData.email,password:registerData.password}, {
            onSuccess: () => {
                router.push("/onboarding")
                setRegisterData({
                    name: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                  });
            },
          });
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="name" >Name</Label>
          <Input
            id="name"
            type="text"
            value={registerData.name}
            onChange={(e) => {
              setRegisterData({ ...registerData, name: e.target.value });
            }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" >Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={registerData.email}
            onChange={(e) => {
              setRegisterData({ ...registerData, email: e.target.value });
            }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={registerData.password}
            onChange={(e) => {
              setRegisterData({ ...registerData, password: e.target.value });
            }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm">Confirm your password</Label>
          <Input
            id="confirm"
            type="password"
            value={registerData.confirmPassword}
            onChange={(e) => {
              setRegisterData({
                ...registerData,
                confirmPassword: e.target.value,
              });
            }}
          />

          {registerData.confirmPassword.length > 0 && !passwordsMatch && (
            <p className=" text-sm text-red-500">Passwords do not match</p>
          )}

          {isRegisterError && (
            <p className="text-red-500">
            {getAuthErrorMessage(registerError?.message)}
          </p>
          )}
        </div>

        <div >
          <Button type="submit" disabled={!isFormValid || isRegisterPending}>
            {" "}
            {isRegisterPending ? "Registering..." : "Create account"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
