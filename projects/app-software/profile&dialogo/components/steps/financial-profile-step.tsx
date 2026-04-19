"use client";

import { SectionCard } from "@/components/layout/section-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useProfileStore } from "@/store/profile-store";

export function FinancialProfileStep() {
  const section = useProfileStore((state) => state.profile.financialProfile);
  const patchSection = useProfileStore((state) => state.patchSection);

  return (
    <SectionCard title="Profilo finanziario" description="Misuriamo come il cliente vive il rischio, il tempo e la sostenibilità delle scelte.">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label>Propensione al rischio</Label>
          <Select value={section.riskTolerance} onChange={(e) => patchSection("financialProfile", { riskTolerance: e.target.value as "prudente" | "equilibrato" | "dinamico" })}>
            <option value="prudente">Prudente</option>
            <option value="equilibrato">Equilibrato</option>
            <option value="dinamico">Dinamico</option>
          </Select>
        </div>
        <div><Label>Orizzonte temporale</Label><Input value={section.timeHorizon} onChange={(e) => patchSection("financialProfile", { timeHorizon: e.target.value })} /></div>
        <div><Label>Capacità di sostenere perdite</Label><Input value={section.lossCapacity} onChange={(e) => patchSection("financialProfile", { lossCapacity: e.target.value })} /></div>
        <div><Label>Preferenze ESG</Label><Input value={section.esgPreference} onChange={(e) => patchSection("financialProfile", { esgPreference: e.target.value })} /></div>
        <div className="md:col-span-2"><Label>Conoscenza ed esperienza finanziaria</Label><Textarea value={section.knowledgeExperience} onChange={(e) => patchSection("financialProfile", { knowledgeExperience: e.target.value })} /></div>
      </div>
    </SectionCard>
  );
}
