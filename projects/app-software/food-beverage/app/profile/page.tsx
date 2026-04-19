"use client";

import { AppShell } from "@/components/app-shell";
import { ProfileHub } from "@/components/profile-hub";
import { useHydrated } from "@/hooks/use-hydrated";

export default function ProfilePage() {
  const hydrated = useHydrated();

  if (!hydrated) {
    return null;
  }

  return (
    <AppShell currentPath="/profile">
      <section className="mb-6">
        <h2 className="text-2xl font-semibold">Anagrafica e documenti</h2>
      </section>

      <ProfileHub />
    </AppShell>
  );
}
