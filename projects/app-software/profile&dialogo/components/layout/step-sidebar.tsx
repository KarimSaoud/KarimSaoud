"use client";

import { getCompletenessBadge, getMissingFieldsForStep, getStepCompletion } from "@/lib/calculations";
import { stepDefinitions, stepIcons } from "@/lib/steps";
import { useProfileStore } from "@/store/profile-store";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export function StepSidebar() {
  const profile = useProfileStore((state) => state.profile);
  const currentStep = useProfileStore((state) => state.currentStep);
  const setCurrentStep = useProfileStore((state) => state.setCurrentStep);

  return (
    <aside className="sticky top-6 h-fit rounded-[32px] border border-[rgba(255,255,255,0.2)] bg-[linear-gradient(180deg,_#0C2752_0%,_#5899C3_100%)] p-5 text-[#FFFFFF] shadow-panel">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.24em] text-[rgba(255,255,255,0.72)]">Percorso consulenziale</p>
        <h2 className="mt-2 text-2xl font-semibold">Profilazione guidata</h2>
        <p className="mt-2 text-sm text-[rgba(255,255,255,0.82)]">Ogni step trasforma i dati raccolti in una lettura utile per la consulenza.</p>
      </div>
      <div className="space-y-3">
        {stepDefinitions.map((step) => {
          const Icon = stepIcons[step.id];
          const completion = getStepCompletion(profile, step.id);
          const missing = getMissingFieldsForStep(profile, step.id);
          const badge = getCompletenessBadge(completion);
          return (
            <button
              key={step.id}
              onClick={() => setCurrentStep(step.id)}
              className={cn(
                "w-full rounded-2xl border p-4 text-left transition",
                currentStep === step.id
                  ? "border-[#ED8232] bg-[linear-gradient(90deg,_rgba(237,130,50,0.24)_0%,_rgba(255,255,255,0.12)_100%)]"
                  : "border-[rgba(255,255,255,0.16)] bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)]",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                    <div className={cn("rounded-2xl p-2", currentStep === step.id ? "bg-[rgba(237,130,50,0.22)]" : "bg-[rgba(255,255,255,0.12)]")}>
                      <Icon className="h-4 w-4" />
                    </div>
                  <div>
                    <p className="text-sm font-semibold">{step.title}</p>
                    <p className="mt-1 text-xs text-[rgba(255,255,255,0.76)]">{step.description}</p>
                  </div>
                </div>
                <Badge tone={badge.tone as "emerald" | "amber" | "rose"}>{completion}%</Badge>
              </div>
              {missing.length ? (
                <div className="mt-3 flex items-center gap-2 text-xs text-[#FFFFFF]">
                  <span className="h-2 w-2 rounded-full bg-[#ED8232]" />
                  <span>{missing.length} dati da completare</span>
                </div>
              ) : null}
              <div className="mt-3">
                <Progress value={completion} />
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
