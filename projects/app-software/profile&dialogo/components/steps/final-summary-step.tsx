"use client";

import { SectionCard } from "@/components/layout/section-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useProfileStore } from "@/store/profile-store";
import { getAssetsTotal, getEconomicTotals, getOverallCompletion, getFamilyNeedWarnings } from "@/lib/calculations";
import { formatCurrency } from "@/lib/format";

export function FinalSummaryStep() {
  const profile = useProfileStore((state) => state.profile);
  const patchSection = useProfileStore((state) => state.patchSection);
  const totals = getEconomicTotals(profile);
  const completion = getOverallCompletion(profile);
  const warnings = getFamilyNeedWarnings(profile);
  const activeNeeds = [
    profile.familyNeeds.protection,
    profile.familyNeeds.saving,
    profile.familyNeeds.investment,
    profile.familyNeeds.retirement,
  ].filter((area) => area.status === "si").length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[28px] border border-[rgba(88,153,195,0.35)] bg-[linear-gradient(180deg,_#FFFFFF_0%,_rgba(88,153,195,0.08)_100%)] p-5 shadow-panel"><p className="text-sm text-[rgba(12,39,82,0.68)]">Completezza dossier</p><p className="mt-2 text-3xl font-semibold text-[#0C2752]">{completion}%</p></div>
        <div className="rounded-[28px] border border-[rgba(88,153,195,0.35)] bg-[linear-gradient(180deg,_#FFFFFF_0%,_rgba(88,153,195,0.08)_100%)] p-5 shadow-panel"><p className="text-sm text-[rgba(12,39,82,0.68)]">Disponibilità annua</p><p className="mt-2 text-3xl font-semibold text-[#0C2752]">{formatCurrency(totals.annualAvailability)}</p></div>
        <div className="rounded-[28px] border border-[rgba(220,110,45,0.35)] bg-[linear-gradient(180deg,_#FFFFFF_0%,_rgba(237,130,50,0.12)_100%)] p-5 shadow-panel"><p className="text-sm text-[#DC6E2D]">Patrimonio totale</p><p className="mt-2 text-3xl font-semibold text-[#DC6E2D]">{formatCurrency(getAssetsTotal(profile))}</p></div>
        <div className="rounded-[28px] border border-[rgba(88,153,195,0.35)] bg-[linear-gradient(180deg,_#FFFFFF_0%,_rgba(88,153,195,0.08)_100%)] p-5 shadow-panel"><p className="text-sm text-[rgba(12,39,82,0.68)]">Aree attivate</p><p className="mt-2 text-3xl font-semibold text-[#0C2752]">{activeNeeds}/4</p></div>
      </div>

      {warnings.length ? (
        <div className="grid gap-3 md:grid-cols-3">
          {warnings.map((warning) => (
            <div key={warning} className="rounded-2xl border border-[rgba(220,110,45,0.35)] bg-[rgba(237,130,50,0.12)] p-4 text-sm text-[#0C2752]">
              {warning}
            </div>
          ))}
        </div>
      ) : null}

      <SectionCard title="Sintesi consulenziale finale" description="Una lettura immediata e presentabile al cliente.">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-[rgba(88,153,195,0.35)] p-4">
            <p className="font-semibold text-[#0C2752]">Cliente</p>
            <p className="mt-2 text-sm text-[rgba(12,39,82,0.82)]">{profile.clientFamily.firstName} {profile.clientFamily.lastName} • {profile.clientFamily.profession}</p>
            <p className="text-sm text-[rgba(12,39,82,0.82)]">{profile.clientFamily.householdComposition}</p>
          </div>
          <div className="rounded-2xl border border-[rgba(88,153,195,0.35)] p-4">
            <p className="font-semibold text-[#0C2752]">Profilo finanziario</p>
            <p className="mt-2 text-sm text-[rgba(12,39,82,0.82)]">{profile.financialProfile.riskTolerance} • {profile.financialProfile.timeHorizon}</p>
            <p className="text-sm text-[rgba(12,39,82,0.82)]">{profile.financialProfile.lossCapacity}</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {[
            ["Protezione", profile.familyNeeds.protection.status],
            ["Risparmio", profile.familyNeeds.saving.status],
            ["Investimento", profile.familyNeeds.investment.status],
            ["Previdenza", profile.familyNeeds.retirement.status],
          ].map(([label, status]) => (
            <div key={label} className="rounded-2xl border border-[rgba(88,153,195,0.35)] bg-[rgba(88,153,195,0.08)] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#5899C3]">{label}</p>
              <p className="mt-2 text-lg font-semibold text-[#0C2752]">{status}</p>
            </div>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label>Priorità assegnate dal cliente</Label>
            <Input
              value={profile.finalSummary.clientPriorities.join(", ")}
              onChange={(e) => patchSection("finalSummary", { clientPriorities: e.target.value.split(",").map((item) => item.trim()).filter(Boolean) })}
            />
            <div className="mt-3 flex flex-wrap gap-2">
              {profile.finalSummary.clientPriorities.map((priority) => <Badge key={priority} tone="blue">{priority}</Badge>)}
            </div>
          </div>
          <div>
            <Label>Note finali del consulente</Label>
            <Textarea value={profile.finalSummary.consultantNotes} onChange={(e) => patchSection("finalSummary", { consultantNotes: e.target.value })} />
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
