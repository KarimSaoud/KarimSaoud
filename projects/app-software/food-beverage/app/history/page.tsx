"use client";

import { AppShell } from "@/components/app-shell";
import { HistoryOverview } from "@/components/history-overview";
import { useHydrated } from "@/hooks/use-hydrated";
import { useFoodLogStore } from "@/store/use-food-log-store";

export default function HistoryPage() {
  const hydrated = useHydrated();
  const dayLogs = useFoodLogStore((state) => state.dayLogs);
  const measurementHistory = useFoodLogStore((state) => state.measurementHistory);
  const ensureDay = useFoodLogStore((state) => state.ensureDay);

  if (!hydrated) {
    return null;
  }

  return (
    <AppShell currentPath="/history">
      <section className="mb-6">
        <h2 className="text-2xl font-semibold">Storico e futuro</h2>
      </section>

      <HistoryOverview
        logs={dayLogs}
        measurementHistory={measurementHistory}
        onEnsureDay={ensureDay}
      />
    </AppShell>
  );
}
