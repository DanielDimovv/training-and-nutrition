import { useState } from "react";
import { UserProfileStep3Input } from "@/lib/utils";
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@/components/ui/multi-select";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DIET_VALUES } from "@/server/db/schema";

type Props = {
  defaultValues: Partial<UserProfileStep3Input>;
  onNext: (data: Partial<UserProfileStep3Input>) => void;
  onBack: () => void;
  isSaving: boolean;
  error: string | null;
};

export default function StepGoals(props: Props) {
  const [localError, setLocalError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<UserProfileStep3Input>>({
    goals: props.defaultValues.goals ?? undefined,
    workout_types: props.defaultValues.workout_types ?? undefined,
    weekly_training_days: props.defaultValues.weekly_training_days ?? undefined,
    diet_preference: props.defaultValues.diet_preference ?? undefined,
    notes: props.defaultValues.notes ?? undefined,
  });

  const dietOptions = DIET_VALUES.map((value) => ({
    value,
    label: value.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase()),
  }));

  return (
    <>
      <Card className="w-full overflow-visible p-4 sm:p-6">
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            setLocalError(null);
            if (!formData.goals || formData.goals.length === 0) {
              setLocalError("Select at least one goal.");
              return;
            }
            if (
              !formData.workout_types ||
              formData.workout_types.length === 0
            ) {
              setLocalError("Select at least one workout type.");
              return;
            }
            if (
              formData.weekly_training_days === undefined ||
              formData.weekly_training_days < 1 ||
              formData.weekly_training_days > 7
            ) {
              setLocalError("Training days must be between 1 and 7.");
              return;
            }
            if (!formData.diet_preference) {
              setLocalError("Select a diet preference.");
              return;
            }
            props.onNext(formData);
          }}
        >
          <div className="mb-6 space-y-2">
            <Label>What are your goals?</Label>
            <MultiSelect
              values={formData.goals ?? []}
              onValuesChange={(values) =>
                setFormData((prev) => ({
                  ...prev,
                  goals: values as UserProfileStep3Input["goals"],
                }))
              }
            >
              <MultiSelectTrigger className="w-full max-w-[400px]">
                <MultiSelectValue placeholder="Select goals" />
              </MultiSelectTrigger>
              <MultiSelectContent>
                <MultiSelectGroup>
                  <MultiSelectItem value="fat_loss">Fat loss</MultiSelectItem>
                  <MultiSelectItem value="muscle_gain">
                    Muscle gain
                  </MultiSelectItem>
                  <MultiSelectItem value="strength">Strength</MultiSelectItem>
                  <MultiSelectItem value="endurance">Endurance</MultiSelectItem>
                  <MultiSelectItem value="mobility">Mobility</MultiSelectItem>
                  <MultiSelectItem value="athletic_performance">
                    Athletic performance
                  </MultiSelectItem>
                  <MultiSelectItem value="rehabilitation">
                    Rehabilitation
                  </MultiSelectItem>
                  <MultiSelectItem value="posture">Posture</MultiSelectItem>
                </MultiSelectGroup>
              </MultiSelectContent>
            </MultiSelect>
          </div>

          <div className="mb-6 space-y-2">
            <Label>Preferred workout types</Label>
            <MultiSelect
              values={formData.workout_types ?? []}
              onValuesChange={(values) =>
                setFormData((prev) => ({
                  ...prev,
                  workout_types:
                    values as UserProfileStep3Input["workout_types"],
                }))
              }
            >
              <MultiSelectTrigger className="w-full max-w-[400px]">
                <MultiSelectValue placeholder="Select workout types" />
              </MultiSelectTrigger>
              <MultiSelectContent>
                <MultiSelectGroup>
                  <MultiSelectItem value="mobility">Mobility</MultiSelectItem>
                  <MultiSelectItem value="strength_training">
                    Strength training
                  </MultiSelectItem>
                  <MultiSelectItem value="hypertrophy">
                    Hypertrophy
                  </MultiSelectItem>
                  <MultiSelectItem value="crossfit">CrossFit</MultiSelectItem>
                  <MultiSelectItem value="cardio">Cardio</MultiSelectItem>
                  <MultiSelectItem value="bodyweight">
                    Bodyweight
                  </MultiSelectItem>
                  <MultiSelectItem value="powerlifting">
                    Powerlifting
                  </MultiSelectItem>
                  <MultiSelectItem value="functional_training">
                    Functional training
                  </MultiSelectItem>
                  <MultiSelectItem value="running">Running</MultiSelectItem>
                  <MultiSelectItem value="cycling">Cycling</MultiSelectItem>
                  <MultiSelectItem value="home_workouts">
                    Home workouts
                  </MultiSelectItem>
                </MultiSelectGroup>
              </MultiSelectContent>
            </MultiSelect>
          </div>

          <div className="mb-6 space-y-2">
            <Label htmlFor="weekly_training_days">Training days per week</Label>
            <Input
              value={formData.weekly_training_days ?? ""}
              type="number"
              onChange={(e) => {
                const raw = e.target.value;
                if (raw === "") {
                  setFormData((prev) => ({
                    ...prev,
                    weekly_training_days: undefined,
                  }));
                  return;
                }
                const value = Number(raw);
                setFormData((prev) => ({
                  ...prev,
                  weekly_training_days: Number.isNaN(value) ? undefined : value,
                }));
              }}
            />
          </div>

          <div className="mb-6 space-y-2">
            <Label htmlFor="diet_preference">Diet preference</Label>
            <select
              className="h-9 w-full rounded-lg border border-border bg-background px-3 text-sm shadow-sm"
              value={formData.diet_preference}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  diet_preference: e.target
                    .value as UserProfileStep3Input["diet_preference"],
                }))
              }
            >
              {dietOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6 space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <textarea
              id="notes"
              value={formData.notes ?? ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, notes: e.target.value }))
              }
            />
          </div>

          <div className="mt-2 text-right">
            <Button type="button" disabled={props.isSaving} onClick={props.onBack}>
              Back
            </Button>
            <Button type="submit" disabled={props.isSaving}>Submit</Button>
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
