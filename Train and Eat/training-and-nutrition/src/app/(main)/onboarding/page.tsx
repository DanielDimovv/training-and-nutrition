"use client";

import UserProfileWizard from "@/components/wizard/UserProfileWizard";

export default function OnboardingPage() {
  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 sm:py-10 lg:grid lg:place-items-center">
      <section className="mx-auto w-full max-w-md sm:max-w-lg lg:max-w-xl">
        <UserProfileWizard />
      </section>
    </main>
  );
}
