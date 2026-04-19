"use client";

import { SectionCard } from "@/components/layout/section-card";
import { Input } from "@/components/ui/input";
import { CurrencyInput } from "@/components/ui/currency-input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useProfileStore } from "@/store/profile-store";
import { formatCurrency, formatDate } from "@/lib/format";
import { uid } from "@/lib/utils";

export function LifeProjectsStep() {
  const section = useProfileStore((state) => state.profile.lifeProjects);
  const patchSection = useProfileStore((state) => state.patchSection);

  return (
    <div className="space-y-6">
      <SectionCard title="Progetti futuri" description="Trasformiamo desideri e obiettivi in una timeline consultiva concreta.">
        <div className="space-y-4">
          {section.projects.map((project, index) => (
            <div key={project.id} className="grid gap-4 rounded-3xl border border-[rgba(88,153,195,0.35)] bg-[rgba(88,153,195,0.08)] p-5 md:grid-cols-2 xl:grid-cols-3">
              <div><Label>Titolo progetto</Label><Input value={project.title} onChange={(e) => patchSection("lifeProjects", { projects: section.projects.map((item) => item.id === project.id ? { ...item, title: e.target.value } : item) })} /></div>
              <div><Label>Tipo progetto</Label><Input value={project.projectType} onChange={(e) => patchSection("lifeProjects", { projects: section.projects.map((item) => item.id === project.id ? { ...item, projectType: e.target.value } : item) })} /></div>
              <div><Label>Orizzonte temporale</Label><Input type="date" value={project.targetDate} onChange={(e) => patchSection("lifeProjects", { projects: section.projects.map((item) => item.id === project.id ? { ...item, targetDate: e.target.value } : item) })} /></div>
              <div><Label>Costo stimato</Label><CurrencyInput value={project.estimatedCost} onChange={(value) => patchSection("lifeProjects", { projects: section.projects.map((item) => item.id === project.id ? { ...item, estimatedCost: value } : item) })} /></div>
              <div>
                <Label>Priorità</Label>
                <Select value={project.priority} onChange={(e) => patchSection("lifeProjects", { projects: section.projects.map((item) => item.id === project.id ? { ...item, priority: e.target.value as "alta" | "media" | "bassa" } : item) })}>
                  <option value="alta">Alta</option>
                  <option value="media">Media</option>
                  <option value="bassa">Bassa</option>
                </Select>
              </div>
              <div className="xl:col-span-3"><Label>Note</Label><Textarea value={project.note} onChange={(e) => patchSection("lifeProjects", { projects: section.projects.map((item) => item.id === project.id ? { ...item, note: e.target.value } : item) })} /></div>
              <p className="text-xs text-[rgba(12,39,82,0.68)]">Progetto {index + 1}: {formatCurrency(project.estimatedCost)}</p>
            </div>
          ))}
          <Button variant="secondary" onClick={() => patchSection("lifeProjects", { projects: [...section.projects, { id: uid("project"), title: "", projectType: "", targetDate: "", estimatedCost: 0, priority: "media", note: "" }] })}>
            Aggiungi progetto
          </Button>
        </div>
      </SectionCard>

      <SectionCard title="Timeline consulenziale" description="Vista rapida per parlare di priorità e tempo davanti al cliente.">
        <div className="space-y-4">
          {section.projects
            .slice()
            .sort((a, b) => a.targetDate.localeCompare(b.targetDate))
            .map((project) => (
              <div key={project.id} className="flex gap-4 rounded-2xl border border-[rgba(88,153,195,0.35)] p-4">
                <div className="mt-1 h-3 w-3 rounded-full bg-[#ED8232]" />
                <div>
                  <p className="font-semibold text-[#0C2752]">{project.title}</p>
                  <p className="text-sm text-[rgba(12,39,82,0.68)]">{project.projectType} • {formatDate(project.targetDate)} • {formatCurrency(project.estimatedCost)}</p>
                  <p className="mt-1 text-sm text-[rgba(12,39,82,0.82)]">{project.note}</p>
                </div>
              </div>
            ))}
        </div>
      </SectionCard>
    </div>
  );
}
