"use client";

import { SectionCard } from "@/components/layout/section-card";
import { Input } from "@/components/ui/input";
import { CurrencyInput } from "@/components/ui/currency-input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useProfileStore } from "@/store/profile-store";
import { formatCurrency } from "@/lib/format";
import { getEconomicTotals } from "@/lib/calculations";

export function EconomicResourcesStep() {
  const profile = useProfileStore((state) => state.profile);
  const patchSection = useProfileStore((state) => state.patchSection);
  const section = profile.economicResources;
  const totals = getEconomicTotals(profile);
  const warning = totals.totalExpenses > totals.totalIncome;

  const metricItems = [
    { label: "Totale entrate", value: totals.totalIncome },
    { label: "Totale uscite", value: totals.totalExpenses },
    { label: "Risparmio annuo", value: totals.annualSavings },
    { label: "Disponibilità annua", value: totals.annualAvailability },
  ];

  return (
    <div className="space-y-6">
      <SectionCard title="Flussi economici" description="Il bilancio familiare viene letto in ottica sostenibilità e spazio d'azione.">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div><Label>Entrate cliente</Label><CurrencyInput value={section.clientIncome} onChange={(value) => patchSection("economicResources", { clientIncome: value })} /></div>
          <div><Label>Entrate partner</Label><CurrencyInput value={section.partnerIncome} onChange={(value) => patchSection("economicResources", { partnerIncome: value })} /></div>
          <div><Label>Altre entrate</Label><CurrencyInput value={section.otherIncome} onChange={(value) => patchSection("economicResources", { otherIncome: value })} /></div>
          <div><Label>Andamento entrate</Label><Input value={section.incomeTrend} onChange={(e) => patchSection("economicResources", { incomeTrend: e.target.value })} /></div>
          <div><Label>Uscite ordinarie</Label><CurrencyInput value={section.ordinaryExpenses} onChange={(value) => patchSection("economicResources", { ordinaryExpenses: value })} /></div>
          <div><Label>Impegni finanziari</Label><CurrencyInput value={section.financialCommitments} onChange={(value) => patchSection("economicResources", { financialCommitments: value })} /></div>
          <div><Label>Mutui / finanziamenti</Label><CurrencyInput value={section.loansMortgages} onChange={(value) => patchSection("economicResources", { loansMortgages: value })} /></div>
          <div><Label>Ripartizione spese</Label><Input value={section.familyExpenseSplit} onChange={(e) => patchSection("economicResources", { familyExpenseSplit: e.target.value })} /></div>
        </div>
        {warning ? (
          <div className="rounded-2xl border border-[rgba(220,110,45,0.35)] bg-[rgba(237,130,50,0.14)] p-4 text-sm text-[#0C2752]">
            Warning: le uscite superano le entrate. Il wizard evidenzia la criticità perché impatta subito su protezione, risparmio e previdenza.
          </div>
        ) : null}
      </SectionCard>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metricItems.map((item) => (
          <div key={item.label} className="rounded-[28px] border border-[rgba(88,153,195,0.35)] bg-[#FFFFFF] p-5 shadow-panel">
            <p className="text-sm text-[rgba(12,39,82,0.68)]">{item.label}</p>
            <p className="mt-2 text-2xl font-semibold text-[#0C2752]">{formatCurrency(item.value)}</p>
            <Badge tone={item.value >= 0 ? "blue" : "rose"} className="mt-3">{item.value >= 0 ? "Aggiornato live" : "Attenzione"}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
