import { useEffect, useState } from "react";
import { UserProfileStep1Input } from "@/lib/utils";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type Props = {
  defaultValues: Partial<UserProfileStep1Input>;
  onNext: (data: Partial<UserProfileStep1Input>) => void;
  isSaving: boolean;
  error: string | null;
};

export default function StepBasics(props: Props) {
  const [localError, setLocalError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<UserProfileStep1Input>>({
    experience_level: props.defaultValues.experience_level ?? undefined,
    age: props.defaultValues.age ?? undefined,
    sex: props.defaultValues.sex ?? undefined,
  });

  useEffect(() => {
    setFormData({
      experience_level: props.defaultValues.experience_level ?? undefined,
      age: props.defaultValues.age ?? undefined,
      sex: props.defaultValues.sex ?? undefined,
    });
  }, [
    props.defaultValues.experience_level,
    props.defaultValues.age,
    props.defaultValues.sex,
  ]);

  const levels = [
    { label: "Beginner", value: "beginner" },
    { label: "Intermediate", value: "intermediate" },
    { label: "Advanced", value: "advanced" },
  ];

  const gender = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
  ];

  return (
    <Card className="w-full overflow-visible p-4 sm:p-6">
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          setLocalError(null);
          e.preventDefault();
  
          if (!formData.experience_level) {
            setLocalError("Please select your experience level.");
            return;
          }
          if (
            formData.age === undefined ||
            Number.isNaN(formData.age) ||
            formData.age < 13 ||
            formData.age > 100
          ) {
            setLocalError("Age must be between 13 and 100.");
            return;
          }
          if (!formData.sex) {
            setLocalError("Please select your sex.");
            return;
          }
  
          props.onNext(formData);
        }}
      >
        <div className="mb-6">
          <Label htmlFor="experience_level" className="mb-2 block leading-normal">
            What is your experience level?
          </Label>
          <select
            id="experience_level"
            value={formData.experience_level ?? ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                experience_level: e.target.value as UserProfileStep1Input["experience_level"],
              }))
            }
            className="h-9 w-full rounded-lg border border-border bg-background px-3 text-sm shadow-sm"
          >
            {levels.map((level) => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
        </div>
  
        <div className="mb-6">
          <Label htmlFor="age" className="mb-2 block leading-normal">
            What is your age?
          </Label>
          <Input
            id="age"
            value={formData.age ?? ""}
            type="number"
            min={13}
            max={100}
            onChange={(e) => {
              const raw = e.target.value;
              if (raw === "") {
                setFormData((prev) => ({ ...prev, age: undefined }));
                return;
              }
              const value = Number(raw);
              setFormData((prev) => ({
                ...prev,
                age: Number.isNaN(value) ? undefined : value,
              }));
            }}
          />
        </div>
  
        <div className="mb-6">
          <Label htmlFor="sex" className="mb-2 block leading-normal">
            What is your gender?
          </Label>
          <select
            id="sex"
            value={formData.sex ?? ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                sex: e.target.value as UserProfileStep1Input["sex"],
              }))
            }
            className="h-9 w-full rounded-lg border border-border bg-background px-3 text-sm shadow-sm"
          >
            <option value="" disabled>
              Select your gender
            </option>
            {gender.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
  
        <div className="mt-2 text-right">
          <Button size="sm" type="submit" disabled={props.isSaving}>
            Next
          </Button>
        </div>
  
        {props.error ? <p className="mt-3 text-sm text-red-500">{props.error}</p> : null}
        {localError ? <p className="mt-2 text-sm text-red-500">{localError}</p> : null}
      </form>
    </Card>
  );}
