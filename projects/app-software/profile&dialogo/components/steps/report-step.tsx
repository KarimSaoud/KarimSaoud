"use client";

import { SectionCard } from "@/components/layout/section-card";
import { Button } from "@/components/ui/button";
import { useProfileStore } from "@/store/profile-store";
import { formatCurrency, formatDate } from "@/lib/format";
import { getAssetsTotal, getEconomicTotals, getOverallCompletion } from "@/lib/calculations";

export function ReportStep() {
  const profile = useProfileStore((state) => state.profile);
  const totals = getEconomicTotals(profile);
  const completion = getOverallCompletion(profile);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[28px] border border-[rgba(88,153,195,0.35)] bg-[#FFFFFF] p-5 shadow-panel print:hidden">
        <div>
          <h3 className="text-xl font-semibold text-[#0C2752]">Report finale consulenziale</h3>
          <p className="text-sm text-[rgba(12,39,82,0.68)]">Pagina pronta per stampa o esportazione PDF tramite browser.</p>
        </div>
        <Button onClick={() => window.print()}>Esporta PDF</Button>
      </div>

      <div className="space-y-6 rounded-[32px] bg-[#FFFFFF] p-6 shadow-panel print:rounded-none print:shadow-none">
        <div className="border-b border-[rgba(88,153,195,0.35)] pb-5">
          <p className="text-xs uppercase tracking-[0.24em] text-[rgba(12,39,82,0.68)]">Profilo cliente</p>
          <h1 className="mt-2 text-3xl font-semibold text-[#0C2752]">{profile.clientFamily.firstName} {profile.clientFamily.lastName}</h1>
          <p className="mt-1 text-sm text-[rgba(12,39,82,0.68)]">{profile.clientFamily.profession} • {profile.clientFamily.workSector}</p>
          <div className="mt-4 grid gap-3 md:grid-cols-4">
            <div className="rounded-2xl bg-[rgba(88,153,195,0.08)] p-3">
              <p className="text-xs text-[rgba(12,39,82,0.68)]">Completezza</p>
              <p className="text-lg font-semibold text-[#0C2752]">{completion}%</p>
            </div>
            <div className="rounded-2xl bg-[rgba(88,153,195,0.08)] p-3">
              <p className="text-xs text-[rgba(12,39,82,0.68)]">Disponibilità</p>
              <p className="text-lg font-semibold text-[#0C2752]">{formatCurrency(totals.annualAvailability)}</p>
            </div>
            <div className="rounded-2xl bg-[rgba(88,153,195,0.08)] p-3">
              <p className="text-xs text-[rgba(12,39,82,0.68)]">Patrimonio</p>
              <p className="text-lg font-semibold text-[#0C2752]">{formatCurrency(getAssetsTotal(profile))}</p>
            </div>
            <div className="rounded-2xl bg-[rgba(237,130,50,0.12)] p-3">
              <p className="text-xs text-[#DC6E2D]">Priorità</p>
              <p className="text-lg font-semibold text-[#DC6E2D]">{profile.finalSummary.clientPriorities.length}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <SectionCard title="Cliente e nucleo familiare">
            <p className="text-sm text-[rgba(12,39,82,0.82)]">{profile.clientFamily.householdComposition}</p>
            <p className="text-sm text-[rgba(12,39,82,0.82)]">Partner: {profile.clientFamily.hasPartner ? profile.clientFamily.partner.fullName : "No"}</p>
            <p className="text-sm text-[rgba(12,39,82,0.82)]">Figli: {profile.clientFamily.children.map((child) => child.name).join(", ") || "Nessuno"}</p>
            <p className="text-sm text-[rgba(12,39,82,0.82)]">Hobby e passioni: {profile.clientFamily.hobbies}</p>
            <p className="text-sm text-[rgba(12,39,82,0.82)]">Preoccupazioni: {profile.clientFamily.concerns}</p>
          </SectionCard>
          <SectionCard title="Profilo finanziario">
            <p className="text-sm text-[rgba(12,39,82,0.82)]">Rischio: {profile.financialProfile.riskTolerance}</p>
            <p className="text-sm text-[rgba(12,39,82,0.82)]">Orizzonte: {profile.financialProfile.timeHorizon}</p>
            <p className="text-sm text-[rgba(12,39,82,0.82)]">ESG: {profile.financialProfile.esgPreference}</p>
          </SectionCard>
        </div>

        <SectionCard title="Progetti e priorità">
          <div className="space-y-3">
            {profile.lifeProjects.projects.map((project) => (
              <div key={project.id} className="rounded-2xl border border-[rgba(88,153,195,0.35)] p-4">
                <p className="font-semibold text-[#0C2752]">{project.title}</p>
                <p className="text-sm text-[rgba(12,39,82,0.68)]">{project.projectType} • {formatDate(project.targetDate)} • {formatCurrency(project.estimatedCost)}</p>
                <p className="text-sm text-[rgba(12,39,82,0.82)]">Priorità: {project.priority}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <div className="grid gap-4 md:grid-cols-2">
          <SectionCard title="Risorse economiche">
            <p className="text-sm text-[rgba(12,39,82,0.82)]">Entrate totali: {formatCurrency(totals.totalIncome)}</p>
            <p className="text-sm text-[rgba(12,39,82,0.82)]">Uscite totali: {formatCurrency(totals.totalExpenses)}</p>
            <p className="text-sm text-[rgba(12,39,82,0.82)]">Disponibilità annua: {formatCurrency(totals.annualAvailability)}</p>
          </SectionCard>
          <SectionCard title="Patrimonio">
            <p className="text-sm text-[rgba(12,39,82,0.82)]">Liquidità: {formatCurrency(profile.assets.liquidity)}</p>
            <p className="text-sm text-[rgba(12,39,82,0.82)]">Attività finanziarie: {formatCurrency(profile.assets.financialAssets)}</p>
            <p className="text-sm text-[rgba(12,39,82,0.82)]">Totale patrimonio: {formatCurrency(getAssetsTotal(profile))}</p>
          </SectionCard>
        </div>

        <SectionCard title="Bisogni emersi e priorità">
          <div className="grid gap-3 md:grid-cols-4">
            {[
              ["Protezione", profile.familyNeeds.protection.status, profile.familyNeeds.protection.indicators.join(", ")],
              ["Risparmio", profile.familyNeeds.saving.status, profile.familyNeeds.saving.details.goal],
              ["Investimento", profile.familyNeeds.investment.status, profile.familyNeeds.investment.details.goal],
              ["Previdenza", profile.familyNeeds.retirement.status, profile.familyNeeds.retirement.details.perceivedGap],
            ].map(([label, status, detail]) => (
              <div key={label} className="rounded-2xl border border-[rgba(88,153,195,0.35)] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#5899C3]">{label}</p>
                <p className="mt-2 font-semibold text-[#0C2752]">{status}</p>
                <p className="mt-1 text-sm text-[rgba(12,39,82,0.82)]">{detail || "Da approfondire"}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm text-[rgba(12,39,82,0.82)]">Priorità cliente: {profile.finalSummary.clientPriorities.join(", ")}</p>
        </SectionCard>

        <SectionCard title="Note e referenze">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="font-semibold text-[#0C2752]">Note operative</p>
              <div className="mt-2 space-y-2">
                {profile.notesReferences.notes.map((note) => (
                  <p key={note.id} className="text-sm text-[rgba(12,39,82,0.82)]">{note.section}: {note.note}</p>
                ))}
              </div>
            </div>
            <div>
              <p className="font-semibold text-[#0C2752]">Referenze collegate</p>
              <div className="mt-2 space-y-2">
                {profile.notesReferences.references.map((reference) => (
                  <p key={reference.id} className="text-sm text-[rgba(12,39,82,0.82)]">{reference.name} • {reference.relationship} • {reference.tag}</p>
                ))}
              </div>
            </div>
          </div>
        </SectionCard>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-dashed border-[rgba(88,153,195,0.55)] p-6">
            <p className="text-sm text-[rgba(12,39,82,0.68)]">Firma / conferma consulente</p>
            <div className="mt-12 border-b border-[rgba(88,153,195,0.55)]" />
          </div>
          <div className="rounded-2xl border border-dashed border-[rgba(88,153,195,0.55)] p-6">
            <p className="text-sm text-[rgba(12,39,82,0.68)]">Note finali</p>
            <p className="mt-3 text-sm text-[rgba(12,39,82,0.82)]">{profile.finalSummary.consultantNotes}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
