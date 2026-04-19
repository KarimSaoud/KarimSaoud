"use client";

import { AppShell } from "@/components/app-shell";
import { HistoryOverview } from "@/components/history-overview";
import { useHydrated } from "@/hooks/use-hydrated";
import { useFoodLogStore } from "@/store/use-food-log-store";

export default function HistoryPage() {
  const hydrated = useHydrated();
  const dayLogs = useFoodLogStore((state) => state.dayLogs);
  const duplicateDay = useFoodLogStore((state) => state.duplicateDay);

  if (!hydrated) {
    return null;
  }

  return (
    <AppShell currentPath="/history">
      <section className="mb-6">
        <p className="text-sm text-muted-foreground">Storico e andamento</p>
        <h2 className="mt-1 text-2xl font-semibold">Settimana recente</h2>
      </section>

      <HistoryOverview logs={dayLogs} onDuplicate={duplicateDay} />
    </AppShell>
  );
}
