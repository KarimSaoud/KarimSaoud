"use client";

import { SectionCard } from "@/components/layout/section-card";
import { Input } from "@/components/ui/input";
import { CurrencyInput } from "@/components/ui/currency-input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useProfileStore } from "@/store/profile-store";
import { uid } from "@/lib/utils";

export function ClientFamilyStep() {
  const profile = useProfileStore((state) => state.profile);
  const patchSection = useProfileStore((state) => state.patchSection);
  const section = profile.clientFamily;

  const update = (field: string, value: string | boolean) =>
    patchSection("clientFamily", { [field]: value } as Partial<typeof section>);

  return (
    <div className="space-y-6">
      <SectionCard title="Identità cliente" description="Acquisiamo il contesto personale che orienta tutta la consulenza.">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div><Label>Nome</Label><Input value={section.firstName} onChange={(e) => update("firstName", e.target.value)} /></div>
          <div><Label>Cognome</Label><Input value={section.lastName} onChange={(e) => update("lastName", e.target.value)} /></div>
          <div><Label>Data di nascita</Label><Input type="date" value={section.birthDate} onChange={(e) => update("birthDate", e.target.value)} /></div>
          <div><Label>Email</Label><Input value={section.email} onChange={(e) => update("email", e.target.value)} /></div>
          <div><Label>Telefono</Label><Input value={section.phone} onChange={(e) => update("phone", e.target.value)} /></div>
          <div>
            <Label>Stato civile</Label>
            <Select value={section.civilStatus} onChange={(e) => update("civilStatus", e.target.value)}>
              <option value="single">Single</option>
              <option value="married">Sposato/a</option>
              <option value="cohabiting">Convivente</option>
              <option value="separated">Separato/a</option>
              <option value="widowed">Vedovo/a</option>
            </Select>
          </div>
          <div><Label>Professione</Label><Input value={section.profession} onChange={(e) => update("profession", e.target.value)} /></div>
          <div><Label>Settore lavorativo</Label><Input value={section.workSector} onChange={(e) => update("workSector", e.target.value)} /></div>
          <div><Label>Composizione nucleo</Label><Input value={section.householdComposition} onChange={(e) => update("householdComposition", e.target.value)} /></div>
        </div>
      </SectionCard>

      <SectionCard title="Famiglia e contesto" description="Mostriamo solo le informazioni utili al consulente in base alla situazione familiare.">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex items-center justify-between rounded-2xl border border-[rgba(88,153,195,0.35)] bg-[rgba(88,153,195,0.08)] px-4 py-3">
            <span className="text-sm font-medium text-[#0C2752]">Partner o coniuge presente</span>
            <input type="checkbox" checked={section.hasPartner} onChange={(e) => update("hasPartner", e.target.checked)} />
          </label>
          <label className="flex items-center justify-between rounded-2xl border border-[rgba(88,153,195,0.35)] bg-[rgba(88,153,195,0.08)] px-4 py-3">
            <span className="text-sm font-medium text-[#0C2752]">Figli presenti</span>
            <input type="checkbox" checked={section.hasChildren} onChange={(e) => update("hasChildren", e.target.checked)} />
          </label>
        </div>

        {section.hasPartner ? (
          <div className="grid gap-4 md:grid-cols-3">
            <div><Label>Partner / coniuge</Label><Input value={section.partner.fullName} onChange={(e) => patchSection("clientFamily", { partner: { ...section.partner, fullName: e.target.value } })} /></div>
            <div><Label>Professione partner</Label><Input value={section.partner.profession} onChange={(e) => patchSection("clientFamily", { partner: { ...section.partner, profession: e.target.value } })} /></div>
            <div><Label>Reddito annuo partner</Label><CurrencyInput value={section.partner.annualIncome} onChange={(value) => patchSection("clientFamily", { partner: { ...section.partner, annualIncome: value } })} /></div>
          </div>
        ) : null}

        {section.hasChildren ? (
          <div className="space-y-4">
            {section.children.map((child, index) => (
              <div key={child.id} className="grid gap-4 rounded-2xl border border-[rgba(88,153,195,0.35)] p-4 md:grid-cols-4">
                <div><Label>Figlio {index + 1}</Label><Input value={child.name} onChange={(e) => patchSection("clientFamily", { children: section.children.map((item) => item.id === child.id ? { ...item, name: e.target.value } : item) })} /></div>
                <div><Label>Anno di nascita</Label><Input value={child.birthYear} onChange={(e) => patchSection("clientFamily", { children: section.children.map((item) => item.id === child.id ? { ...item, birthYear: e.target.value } : item) })} /></div>
                <div className="md:col-span-2"><Label>Nota consulenziale</Label><Input value={child.note} onChange={(e) => patchSection("clientFamily", { children: section.children.map((item) => item.id === child.id ? { ...item, note: e.target.value } : item) })} /></div>
              </div>
            ))}
            <Button variant="secondary" onClick={() => patchSection("clientFamily", { children: [...section.children, { id: uid("child"), name: "", birthYear: "", note: "" }] })}>
              Aggiungi figlio
            </Button>
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          <div><Label>Altri familiari rilevanti</Label><Textarea value={section.otherFamilyMembers} onChange={(e) => update("otherFamilyMembers", e.target.value)} /></div>
          <div><Label>Animali</Label><Textarea value={section.pets} onChange={(e) => update("pets", e.target.value)} /></div>
          <div><Label>Hobby, sport, passioni</Label><Textarea value={section.hobbies} onChange={(e) => update("hobbies", e.target.value)} /></div>
          <div><Label>Preoccupazioni dichiarate</Label><Textarea value={section.concerns} onChange={(e) => update("concerns", e.target.value)} /></div>
        </div>
      </SectionCard>
    </div>
  );
}
