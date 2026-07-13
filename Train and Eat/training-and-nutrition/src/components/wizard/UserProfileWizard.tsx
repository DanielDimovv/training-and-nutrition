import { UserProfileInput } from "@/lib/utils";
import { useState } from "react";
import StepBasics from "./steps/StepBasics";
import StepBody from "./steps/StepBody";
import StepGoals from "./steps/StepGoals";
import { Progress } from "@/components/ui/progress";
import { useSaveProfileDraft, useSubmitProfile } from "@/hooks/user";
import { useRouter } from "next/navigation";



type WizardStep = "basics" | "body" | "goals";
const steps: WizardStep[] = ["basics", "body", "goals"];

export default function UserProfileWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<UserProfileInput>>({
    experience_level: "beginner",
    goals: [],
    workout_types: [],
    notes: "",
  });

  const { mutateAsync: saveDraft, isPending: isSaving } = useSaveProfileDraft();

  const { mutateAsync: submitProfile, isPending: pendingSave } = useSubmitProfile();
  const [serverError, setServerError] = useState<string | null>(null);

  async function handleNext(partialData: Partial<UserProfileInput>) {
    const merged = { ...formData, ...partialData };
    setServerError(null);
    try {
      await saveDraft(merged); 
      setFormData(merged);          
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    } catch (error) {
      if (error instanceof Error) setServerError(error.message);
      else setServerError("INTERNAL_SERVER_ERROR");
    }
  }

  async function handleSubmit(partialData: Partial<UserProfileInput>) {
    setServerError(null);
    const merged = { ...formData, ...partialData };
    try {
      await submitProfile(merged as UserProfileInput); 
      setFormData(merged);
      router.push("/dashboard") 
    } catch (error) {
      if (error instanceof Error) setServerError(error.message);
      else setServerError("INTERNAL_SERVER_ERROR");
    }
  }



  function handleBack() {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }

  const currentStepKey = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  let stepContent: React.ReactNode = null;

  switch (currentStepKey) {
    case "basics":
      stepContent = (
        <StepBasics
          defaultValues={formData}
          onNext={handleNext}
          isSaving={isSaving}
          error={serverError}
        />
      );
      break;
    case "body":
      stepContent = (
        <StepBody
          defaultValues={formData}
          onNext={handleNext}
          onBack={handleBack}
          isSaving={isSaving}
          error={serverError}
        />
      );
      break;
    case "goals":
      stepContent = (
        <StepGoals
          defaultValues={formData}
          onNext={handleSubmit} 
          onBack={handleBack}
          isSaving={pendingSave}
          error={serverError}
        />
      );
      break;
    default:
      stepContent = null;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs sm:text-sm font-medium text-muted-foreground">
            Step {currentStep + 1} of {steps.length}
          </p>
          <span className="text-[11px] sm:text-xs text-muted-foreground">
            {Math.round(progress)}%
          </span>
        </div>
        <Progress value={Math.round(progress)} className="h-2 sm:h-2.5" />
      </div>
      {stepContent}
    </div>
  );
}
