"use client";

import { SectionCard } from "@/components/layout/section-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useProfileStore } from "@/store/profile-store";
import { uid } from "@/lib/utils";

export function NotesReferencesStep() {
  const section = useProfileStore((state) => state.profile.notesReferences);
  const patchSection = useProfileStore((state) => state.patchSection);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="space-y-6">
      <SectionCard title="Note consulenziali" description="Ogni sezione può essere arricchita con appunti, tag e data di inserimento.">
        <div className="space-y-4">
          {section.notes.map((note) => (
            <div key={note.id} className="grid gap-4 rounded-2xl border border-[rgba(88,153,195,0.35)] p-4 md:grid-cols-4">
              <div><Label>Sezione</Label><Input value={note.section} onChange={(e) => patchSection("notesReferences", { notes: section.notes.map((item) => item.id === note.id ? { ...item, section: e.target.value } : item) })} /></div>
              <div><Label>Tag</Label><Input value={note.tag} onChange={(e) => patchSection("notesReferences", { notes: section.notes.map((item) => item.id === note.id ? { ...item, tag: e.target.value } : item) })} /></div>
              <div><Label>Data</Label><Input type="date" value={note.createdAt} onChange={(e) => patchSection("notesReferences", { notes: section.notes.map((item) => item.id === note.id ? { ...item, createdAt: e.target.value } : item) })} /></div>
              <div className="md:col-span-4"><Label>Nota</Label><Input value={note.note} onChange={(e) => patchSection("notesReferences", { notes: section.notes.map((item) => item.id === note.id ? { ...item, note: e.target.value } : item) })} /></div>
            </div>
          ))}
          <Button variant="secondary" onClick={() => patchSection("notesReferences", { notes: [...section.notes, { id: uid("note"), section: "", note: "", tag: "", createdAt: today }] })}>
            Aggiungi nota
          </Button>
        </div>
      </SectionCard>

      <SectionCard title="Referenze e prospect" description="Gestione leggera ma utile per tenere il filo commerciale della relazione.">
        <div className="space-y-4">
          {section.references.map((reference) => (
            <div key={reference.id} className="grid gap-4 rounded-2xl border border-[rgba(88,153,195,0.35)] p-4 md:grid-cols-4">
              <div><Label>Nome</Label><Input value={reference.name} onChange={(e) => patchSection("notesReferences", { references: section.references.map((item) => item.id === reference.id ? { ...item, name: e.target.value } : item) })} /></div>
              <div><Label>Relazione</Label><Input value={reference.relationship} onChange={(e) => patchSection("notesReferences", { references: section.references.map((item) => item.id === reference.id ? { ...item, relationship: e.target.value } : item) })} /></div>
              <div><Label>Tag</Label><Input value={reference.tag} onChange={(e) => patchSection("notesReferences", { references: section.references.map((item) => item.id === reference.id ? { ...item, tag: e.target.value } : item) })} /></div>
              <div><Label>Data inserimento</Label><Input type="date" value={reference.createdAt} onChange={(e) => patchSection("notesReferences", { references: section.references.map((item) => item.id === reference.id ? { ...item, createdAt: e.target.value } : item) })} /></div>
            </div>
          ))}
          <Button variant="secondary" onClick={() => patchSection("notesReferences", { references: [...section.references, { id: uid("reference"), name: "", relationship: "", tag: "", createdAt: today }] })}>
            Aggiungi referenza
          </Button>
        </div>
      </SectionCard>
    </div>
  );
}
