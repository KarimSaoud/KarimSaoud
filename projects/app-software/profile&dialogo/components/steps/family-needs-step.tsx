"use client";

import type { ReactNode } from "react";
import { SectionCard } from "@/components/layout/section-card";
import { Input } from "@/components/ui/input";
import { CurrencyInput } from "@/components/ui/currency-input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useProfileStore } from "@/store/profile-store";
import { getEconomicTotals, getFamilyNeedWarnings } from "@/lib/calculations";

function NeedShell({
  title,
  children,
  state,
  interested,
  onStatusChange,
  onInterestChange,
}: {
  title: string;
  children: ReactNode;
  state: string;
  interested: boolean | null;
  onStatusChange: (value: string) => void;
  onInterestChange: (value: boolean) => void;
}) {
  return (
    <div className="rounded-[28px] border border-[rgba(88,153,195,0.35)] p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h4 className="text-lg font-semibold text-[#0C2752]">{title}</h4>
          <p className="text-sm text-[rgba(12,39,82,0.68)]">Domanda iniziale, stato, approfondimento e indicatori sintetici.</p>
        </div>
        <div className="flex gap-2">
          <button className={`rounded-full px-3 py-1 text-xs font-semibold ${interested ? "bg-[#0C2752] text-[#FFFFFF]" : "bg-[rgba(88,153,195,0.18)] text-[#0C2752]"}`} onClick={() => onInterestChange(true)}>Interesse sì</button>
          <button className={`rounded-full px-3 py-1 text-xs font-semibold ${interested === false ? "bg-[#DC6E2D] text-[#FFFFFF]" : "bg-[rgba(88,153,195,0.18)] text-[#0C2752]"}`} onClick={() => onInterestChange(false)}>Interesse no</button>
        </div>
      </div>
      <div className="mb-4">
        <Label>Stato area</Label>
        <Select value={state} onChange={(e) => onStatusChange(e.target.value)}>
          <option value="non-analizzato">Non analizzato</option>
          <option value="si">Sì</option>
          <option value="no">No</option>
        </Select>
      </div>
      {children}
    </div>
  );
}

export function FamilyNeedsStep() {
  const profile = useProfileStore((state) => state.profile);
  const patchSection = useProfileStore((state) => state.patchSection);
  const needs = profile.familyNeeds;
  const totals = getEconomicTotals(profile);
  const warnings = getFamilyNeedWarnings(profile);

  return (
    <div className="space-y-6">
      {warnings.length ? (
        <div className="grid gap-3 md:grid-cols-2">
          {warnings.map((warning) => (
            <div key={warning} className="rounded-2xl border border-[rgba(220,110,45,0.35)] bg-[rgba(237,130,50,0.14)] p-4 text-sm text-[#0C2752]">{warning}</div>
          ))}
        </div>
      ) : null}

      <SectionCard title="Bisogni della famiglia" description="Le macro-aree sono pensate per far emergere esigenze e leve di consulenza.">
        <div className="space-y-5">
          <NeedShell
            title="Protezione"
            state={needs.protection.status}
            interested={needs.protection.interested}
            onStatusChange={(value) => patchSection("familyNeeds", { protection: { ...needs.protection, status: value as "non-analizzato" | "si" | "no" } })}
            onInterestChange={(value) => patchSection("familyNeeds", { protection: { ...needs.protection, interested: value } })}
          >
            <div className="grid gap-3 md:grid-cols-3">
              {Object.entries(needs.protection.details).map(([key, value]) => (
                <label key={key} className="flex items-center justify-between rounded-2xl border border-[rgba(88,153,195,0.35)] px-4 py-3 text-sm capitalize text-[#0C2752]">
                  <span>{key.replace(/([A-Z])/g, " $1")}</span>
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) =>
                      patchSection("familyNeeds", {
                        protection: { ...needs.protection, details: { ...needs.protection.details, [key]: e.target.checked } },
                      })
                    }
                  />
                </label>
              ))}
            </div>
            <div className="mt-4">
              <Label>Indicatori sintetici</Label>
              <Textarea
                value={needs.protection.indicators.join("\n")}
                onChange={(e) => patchSection("familyNeeds", { protection: { ...needs.protection, indicators: e.target.value.split("\n").filter(Boolean) } })}
              />
            </div>
          </NeedShell>

          <NeedShell
            title="Risparmio"
            state={needs.saving.status}
            interested={needs.saving.interested}
            onStatusChange={(value) => patchSection("familyNeeds", { saving: { ...needs.saving, status: value as "non-analizzato" | "si" | "no" } })}
            onInterestChange={(value) => patchSection("familyNeeds", { saving: { ...needs.saving, interested: value } })}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div><Label>Importo annuo ipotizzato</Label><CurrencyInput value={needs.saving.details.annualAmount} onChange={(value) => patchSection("familyNeeds", { saving: { ...needs.saving, details: { ...needs.saving.details, annualAmount: value } } })} /></div>
              <div><Label>Obiettivo del risparmio</Label><Input value={needs.saving.details.goal} onChange={(e) => patchSection("familyNeeds", { saving: { ...needs.saving, details: { ...needs.saving.details, goal: e.target.value } } })} /></div>
            </div>
            {totals.annualAvailability <= 0 ? <Badge tone="rose" className="mt-4">Disponibilità insufficiente: suggerire soluzione graduale o rimandata.</Badge> : null}
          </NeedShell>

          <NeedShell
            title="Investimento"
            state={needs.investment.status}
            interested={needs.investment.interested}
            onStatusChange={(value) => patchSection("familyNeeds", { investment: { ...needs.investment, status: value as "non-analizzato" | "si" | "no" } })}
            onInterestChange={(value) => patchSection("familyNeeds", { investment: { ...needs.investment, interested: value } })}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div><Label>Liquidità investibile</Label><CurrencyInput value={needs.investment.details.investableLiquidity} onChange={(value) => patchSection("familyNeeds", { investment: { ...needs.investment, details: { ...needs.investment.details, investableLiquidity: value } } })} /></div>
              <div><Label>Attività riallocabili</Label><CurrencyInput value={needs.investment.details.reallocableAssets} onChange={(value) => patchSection("familyNeeds", { investment: { ...needs.investment, details: { ...needs.investment.details, reallocableAssets: value } } })} /></div>
              <div><Label>Importo ipotizzato</Label><CurrencyInput value={needs.investment.details.proposedAmount} onChange={(value) => patchSection("familyNeeds", { investment: { ...needs.investment, details: { ...needs.investment.details, proposedAmount: value } } })} /></div>
              <div><Label>Finalità investimento</Label><Input value={needs.investment.details.goal} onChange={(e) => patchSection("familyNeeds", { investment: { ...needs.investment, details: { ...needs.investment.details, goal: e.target.value } } })} /></div>
            </div>
            {(profile.assets.liquidity + totals.annualAvailability) <= 0 ? <Badge tone="rose" className="mt-4">Risorse non disponibili: area da presidiare con warning.</Badge> : null}
          </NeedShell>

          <NeedShell
            title="Previdenza"
            state={needs.retirement.status}
            interested={needs.retirement.interested}
            onStatusChange={(value) => patchSection("familyNeeds", { retirement: { ...needs.retirement, status: value as "non-analizzato" | "si" | "no" } })}
            onInterestChange={(value) => patchSection("familyNeeds", { retirement: { ...needs.retirement, interested: value } })}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div><Label>Situazione pensionistica</Label><Textarea value={needs.retirement.details.pensionSituation} onChange={(e) => patchSection("familyNeeds", { retirement: { ...needs.retirement, details: { ...needs.retirement.details, pensionSituation: e.target.value } } })} /></div>
              <div><Label>Previdenza complementare esistente</Label><Textarea value={needs.retirement.details.existingPlan} onChange={(e) => patchSection("familyNeeds", { retirement: { ...needs.retirement, details: { ...needs.retirement.details, existingPlan: e.target.value } } })} /></div>
              <div><Label>Gap previdenziale percepito</Label><Input value={needs.retirement.details.perceivedGap} onChange={(e) => patchSection("familyNeeds", { retirement: { ...needs.retirement, details: { ...needs.retirement.details, perceivedGap: e.target.value } } })} /></div>
              <div>
                <Label>Interesse integrazione previdenziale</Label>
                <Select value={String(needs.retirement.details.interestedInIntegration)} onChange={(e) => patchSection("familyNeeds", { retirement: { ...needs.retirement, details: { ...needs.retirement.details, interestedInIntegration: e.target.value === "true" } } })}>
                  <option value="true">Sì</option>
                  <option value="false">No</option>
                </Select>
              </div>
            </div>
          </NeedShell>
        </div>
      </SectionCard>
    </div>
  );
}
