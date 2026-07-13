import LoginForm from "@/components/authForms/LoginForm";
import Link from "next/link";
export default function LoginPage() {
  return (
    <div className="w-full max-w-md mx-auto p-4 sm:p-6 mt-8 sm:mt-16">
      <LoginForm />
      <p className="mt-4 text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/auth/register" className="underline">
          Register
        </Link>
      </p>
    </div>
  );
}