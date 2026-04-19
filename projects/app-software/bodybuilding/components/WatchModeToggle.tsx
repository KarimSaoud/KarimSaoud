type WatchModeToggleProps = {
  enabled: boolean;
  onToggle: () => void;
};

export function WatchModeToggle({ enabled, onToggle }: WatchModeToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={[
        "rounded-full border px-4 py-2 text-sm font-medium transition",
        enabled
          ? "border-gold/50 bg-gold/15 text-goldSoft shadow-glow"
          : "border-white/10 bg-white/[0.03] text-white/72 hover:border-white/20 hover:bg-white/[0.06]",
      ].join(" ")}
      aria-pressed={enabled}
    >
      {enabled ? "Watch Mode On" : "Watch Mode"}
    </button>
  );
}
