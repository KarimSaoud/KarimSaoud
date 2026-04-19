"use client";

import { SectionCard } from "@/components/layout/section-card";
import { Input } from "@/components/ui/input";
import { CurrencyInput } from "@/components/ui/currency-input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useProfileStore } from "@/store/profile-store";
import { getAssetsTotal } from "@/lib/calculations";
import { formatCurrency } from "@/lib/format";
import { uid } from "@/lib/utils";

export function AssetsStep() {
  const profile = useProfileStore((state) => state.profile);
  const patchSection = useProfileStore((state) => state.patchSection);
  const section = profile.assets;

  return (
    <div className="space-y-6">
      <SectionCard title="Patrimonio" description="Liquidità, attività finanziarie e immobili in una vista unica.">
        <div className="grid gap-4 md:grid-cols-2">
          <div><Label>Liquidità</Label><CurrencyInput value={section.liquidity} onChange={(value) => patchSection("assets", { liquidity: value })} /></div>
          <div><Label>Attività finanziarie</Label><CurrencyInput value={section.financialAssets} onChange={(value) => patchSection("assets", { financialAssets: value })} /></div>
        </div>
        <div className="space-y-4">
          {section.properties.map((item) => (
            <div key={item.id} className="grid gap-4 rounded-2xl border border-[rgba(88,153,195,0.35)] p-4 md:grid-cols-2">
              <div><Label>Voce patrimoniale</Label><Input value={item.label} onChange={(e) => patchSection("assets", { properties: section.properties.map((prop) => prop.id === item.id ? { ...prop, label: e.target.value } : prop) })} /></div>
              <div><Label>Valore stimato</Label><CurrencyInput value={item.value} onChange={(value) => patchSection("assets", { properties: section.properties.map((prop) => prop.id === item.id ? { ...prop, value } : prop) })} /></div>
            </div>
          ))}
          <Button variant="secondary" onClick={() => patchSection("assets", { properties: [...section.properties, { id: uid("asset"), label: "", value: 0 }] })}>
            Aggiungi immobile / bene
          </Button>
        </div>
      </SectionCard>
      <div className="rounded-[28px] border border-[rgba(255,255,255,0.24)] bg-[linear-gradient(90deg,_#0C2752_0%,_#5899C3_100%)] p-6 text-[#FFFFFF] shadow-panel">
        <p className="text-sm text-[rgba(255,255,255,0.82)]">Totale patrimonio stimato</p>
        <p className="mt-2 text-3xl font-semibold">{formatCurrency(getAssetsTotal(profile))}</p>
      </div>
    </div>
  );
}
