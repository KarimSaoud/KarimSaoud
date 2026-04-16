import { formatDurationFromMs } from "@/lib/utils";

type TimerDisplayProps = {
  label: string;
  valueMs: number;
  emphasize?: boolean;
};

export function TimerDisplay({ label, valueMs, emphasize = false }: TimerDisplayProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] px-4 py-3">
      <p className="text-[0.65rem] uppercase tracking-[0.35em] text-white/45">{label}</p>
      <p
        className={[
          "mt-2 font-display leading-none",
          emphasize ? "text-5xl text-goldSoft sm:text-6xl" : "text-3xl text-white sm:text-4xl",
        ].join(" ")}
      >
        {formatDurationFromMs(valueMs)}
      </p>
    </div>
  );
}
