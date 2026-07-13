import { useEffect, useState } from "react";
import { UserProfileStep2Input } from "@/lib/utils";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type Props = {
  defaultValues: Partial<UserProfileStep2Input>;
  onNext: (data: Partial<UserProfileStep2Input>) => void;
  onBack: () => void;
  isSaving: boolean;
  error: string | null;
};

export default function StepBody(props: Props) {
  const [localError, setLocalError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<UserProfileStep2Input>>({
    height_cm: props.defaultValues.height_cm ?? undefined,
    weight_kg: props.defaultValues.weight_kg ?? undefined,
    activity_level: props.defaultValues.activity_level ?? undefined,
  });

  useEffect(() => {
    setFormData({
      height_cm: props.defaultValues.height_cm ?? undefined,
      weight_kg: props.defaultValues.weight_kg ?? undefined,
      activity_level: props.defaultValues.activity_level ?? undefined,
    });
  },
  [
    props.defaultValues.height_cm,
    props.defaultValues.weight_kg,
    props.defaultValues.activity_level,
  ]);

  const levels = [
    { label: "Sedentary", value: "sedentary" },
    { label: "Light", value: "light" },
    { label: "Moderate", value: "moderate" },
    { label: "Active", value: "active" },
    { label: "Very active", value: "very_active" },
  ];

  return (
    <>
      <Card className="w-full overflow-visible p-4 sm:p-6">
        <form
         className="flex flex-col gap-4"
          onSubmit={(e) => {
            setLocalError(null);
            e.preventDefault();

            if (
              formData.height_cm === undefined ||
              Number.isNaN(formData.height_cm) ||
              !Number.isInteger(formData.height_cm) ||
              formData.height_cm < 120 ||
              formData.height_cm > 250
            ) {
              setLocalError(
                "Height must be a whole number between 120 and 250 cm.",
              );
              return;
            }
            if (
              formData.weight_kg === undefined ||
              Number.isNaN(formData.weight_kg) ||
              formData.weight_kg < 30 ||
              formData.weight_kg > 300
            ) {
              setLocalError("Weight must be between 30 and 300 kg.");
              return;
            }
            if (!formData.activity_level) {
              setLocalError("Please select your activity level.");
              return;
            }

            setLocalError(null);

            props.onNext(formData);
          }}
        >
          <div className="mb-6 space-y-2">
            <Label>What is your height in cm?</Label>
            <Input
              value={formData.height_cm ?? ''}
              type="number"
              onChange={(e) => {
                setLocalError(null);
                const raw = e.target.value;
                if (raw === "") {
                  setFormData((prev) => ({ ...prev, height_cm: undefined }));
                  return;
                }
                const value = Number(raw);
                setFormData((prev) => ({
                  ...prev,
                  height_cm: Number.isNaN(value) ? undefined : value,
                }));
              }}
            />
          </div>

          <div className="mb-6 space-y-2">
            <Label>What is your weight in kg?</Label>
            <Input
              value={formData.weight_kg ?? ""}
              type="number"
              onChange={(e) => {
                setLocalError(null);
                const raw = e.target.value;
                if (raw === "") {
                  setFormData((prev) => ({ ...prev, weight_kg: undefined }));
                  return;
                }
                const value = Number(raw);
                setFormData((prev) => ({
                  ...prev,
                  weight_kg: Number.isNaN(value) ? undefined : value,
                }));
              }}
            />
          </div>

          <div className="mb-6 space-y-2">
          <Label>What is your activity level?</Label>
            <select
              id="activity_level"
              className="h-9 w-full rounded-lg border border-border bg-background px-3 text-sm shadow-sm"
              value={formData.activity_level}
              onChange={(e) => {
                setLocalError(null);
                setFormData((prev) => ({
                  ...prev,
                  activity_level:
                    e.target.value as UserProfileStep2Input["activity_level"],
              }))
              }}
            >
             
             {levels.map((level) => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
            </select>
          </div>

          <div className="mt-2 text-right">
            <Button type="button" onClick={props.onBack}>Back</Button>
            <Button type="submit">Next</Button>
            
          </div>

          {props.error ? (
            <p className="text-sm text-red-500">{props.error}</p>
          ) : null}

          {localError && <p className="text-sm text-red-500">{localError}</p>}
        </form>
      </Card>
    </>
  );
}
