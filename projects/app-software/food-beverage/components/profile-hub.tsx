"use client";

import { ChangeEvent, ReactNode, useEffect, useMemo, useState } from "react";
import { FileArchive, Save, Trash2, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { calculateAgeFromBirthDate, formatDateTime } from "@/lib/date";
import { formatFileSize } from "@/lib/utils";
import { useFoodLogStore } from "@/store/use-food-log-store";
import { HealthDocument, UserProfile } from "@/types";

type NumericProfileField =
  | "weightKg"
  | "goalWeightKg"
  | "leanMassKg"
  | "goalLeanMassKg"
  | "fatMassKg"
  | "goalFatMassKg";

const metricFields: Array<{
  key: NumericProfileField;
  label: string;
  suffix: string;
}> = [
  { key: "weightKg", label: "Peso", suffix: "kg" },
  { key: "goalWeightKg", label: "Obiettivo peso", suffix: "kg" },
  { key: "leanMassKg", label: "Massa magra", suffix: "kg" },
  { key: "goalLeanMassKg", label: "Obiettivo massa magra", suffix: "kg" },
  { key: "fatMassKg", label: "Massa grassa", suffix: "kg" },
  { key: "goalFatMassKg", label: "Obiettivo massa grassa", suffix: "kg" }
];

function toNullableNumber(value: string) {
  if (!value.trim()) {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Impossibile leggere il file."));
    reader.readAsDataURL(file);
  });
}

export function ProfileHub() {
  const storedProfile = useFoodLogStore((state) => state.profile);
  const healthDocuments = useFoodLogStore((state) => state.healthDocuments);
  const updateProfile = useFoodLogStore((state) => state.updateProfile);
  const saveProfileSnapshot = useFoodLogStore((state) => state.saveProfileSnapshot);
  const addHealthDocument = useFoodLogStore((state) => state.addHealthDocument);
  const removeHealthDocument = useFoodLogStore((state) => state.removeHealthDocument);

  const [profile, setProfile] = useState<UserProfile>(storedProfile);
  const [documentNotes, setDocumentNotes] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setProfile(storedProfile);
  }, [storedProfile]);

  const age = useMemo(() => calculateAgeFromBirthDate(profile.birthDate), [profile.birthDate]);

  const handleNumberChange = (field: NumericProfileField) => (event: ChangeEvent<HTMLInputElement>) => {
    setProfile((current) => ({
      ...current,
      [field]: toNullableNumber(event.target.value)
    }));
  };

  const handleSaveProfile = () => {
    updateProfile(profile);
    saveProfileSnapshot();
  };

  const handleDocumentUpload = async () => {
    if (!selectedFile) {
      return;
    }

    setIsUploading(true);

    try {
      const dataUrl = await readFileAsDataUrl(selectedFile);
      addHealthDocument({
        name: selectedFile.name,
        mimeType: selectedFile.type || "application/octet-stream",
        sizeBytes: selectedFile.size,
        notes: documentNotes.trim() || undefined,
        dataUrl
      });
      setSelectedFile(null);
      setDocumentNotes("");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Tabs defaultValue="profile">
      <TabsList>
        <TabsTrigger value="profile">
          <UserRound className="mr-2 h-4 w-4" />
          Profilo
        </TabsTrigger>
        <TabsTrigger value="documents">
          <FileArchive className="mr-2 h-4 w-4" />
          Documenti
        </TabsTrigger>
      </TabsList>

      <TabsContent value="profile">
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>{`${profile.firstName} ${profile.lastName}`.trim()}</CardTitle>
                <CardDescription>
                  {profile.birthPlace}, 17/06/1995 · {profile.heightCm} cm
                </CardDescription>
              </div>
              <div className="rounded-lg bg-secondary px-4 py-3 text-sm">
                <span className="text-muted-foreground">Età</span>
                <span className="ml-2 font-semibold">{age === null ? "—" : `${age} anni`}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-5">
              <section className="grid gap-4 rounded-lg border border-border bg-white/70 p-4 sm:grid-cols-2">
                {metricFields.map((field) => (
                  <Field key={field.key} label={field.label}>
                    <div className="relative">
                      <Input
                        type="number"
                        inputMode="decimal"
                        step="0.1"
                        value={profile[field.key] ?? ""}
                        onChange={handleNumberChange(field.key)}
                        className="pr-14"
                      />
                      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                        {field.suffix}
                      </span>
                    </div>
                  </Field>
                ))}
              </section>

              <div>
                <Button onClick={handleSaveProfile}>
                  <Save className="mr-2 h-4 w-4" />
                  Salva profilo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="documents" className="grid gap-4 xl:grid-cols-[1fr_1.2fr]">
        <Card>
          <CardHeader>
            <CardTitle>Angolo documenti sanitari</CardTitle>
            <CardDescription>Carica referti, analisi o prescrizioni e tienili nello stesso archivio locale.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Field label="File">
              <Input
                type="file"
                accept=".pdf,image/*,.doc,.docx"
                onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
              />
            </Field>
            <Field label="Note">
              <textarea
                value={documentNotes}
                onChange={(event) => setDocumentNotes(event.target.value)}
                rows={4}
                placeholder="Es. Esami del sangue annuali"
                className="w-full rounded-2xl border border-input bg-white px-4 py-3 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
              />
            </Field>
            <Button onClick={handleDocumentUpload} disabled={!selectedFile || isUploading}>
              <FileArchive className="mr-2 h-4 w-4" />
              {isUploading ? "Caricamento..." : "Salva documento"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Archivio documenti</CardTitle>
            <CardDescription>I documenti restano accessibili dal browser anche dopo la chiusura dell&apos;app.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {healthDocuments.length === 0 ? (
              <EmptyState text="Nessun documento sanitario caricato." />
            ) : (
              healthDocuments.map((document) => (
                <DocumentRow
                  key={document.id}
                  document={document}
                  onDelete={() => removeHealthDocument(document.id)}
                />
              ))
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="grid gap-2 text-sm">
      <span className="font-medium">{label}</span>
      {children}
    </label>
  );
}

function EmptyState({ text }: { text: string }) {
  return <div className="rounded-[24px] border border-dashed border-border bg-secondary/40 p-6 text-sm text-muted-foreground">{text}</div>;
}

function DocumentRow({ document, onDelete }: { document: HealthDocument; onDelete: () => void }) {
  return (
    <div className="flex flex-col gap-3 rounded-[24px] border border-border bg-white/70 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="truncate font-medium">{document.name}</p>
        <p className="text-sm text-muted-foreground">
          {formatDateTime(document.uploadedAt)} · {formatFileSize(document.sizeBytes)}
        </p>
        {document.notes ? <p className="mt-1 text-sm text-muted-foreground">{document.notes}</p> : null}
      </div>
      <div className="flex gap-2">
        <a
          href={document.dataUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-10 items-center justify-center rounded-full border border-border bg-card px-4 text-sm font-medium"
        >
          Apri
        </a>
        <Button variant="ghost" onClick={onDelete}>
          <Trash2 className="mr-2 h-4 w-4" />
          Elimina
        </Button>
      </div>
    </div>
  );
}
