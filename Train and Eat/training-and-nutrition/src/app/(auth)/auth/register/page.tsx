import RegisterForm from "@/components/authForms/RegisterForm";
import Link from "next/link";
export default function RegisterPage() {
  return (
    <div className="w-full max-w-md mx-auto p-4 sm:p-6 mt-8 sm:mt-16">
      <RegisterForm />
      <p className="mt-4 text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/auth/login" className="underline">
          Login
        </Link>
      </p>
    </div>
  );
}