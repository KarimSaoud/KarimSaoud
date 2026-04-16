import { RoutineSettings } from "@/types";

type SettingsPanelProps = {
  settings: RoutineSettings;
  onChange: (settings: RoutineSettings) => void;
};

const toggles: Array<{
  key: keyof RoutineSettings;
  label: string;
  hint: string;
}> = [
  {
    key: "voiceEnabled",
    label: "Voice Announcements",
    hint: "Use text-to-speech when each pose begins.",
  },
  {
    key: "beepEnabled",
    label: "Cue Beep",
    hint: "Play a short warning beep one second before switching.",
  },
  {
    key: "vibrationEnabled",
    label: "Vibration",
    hint: "Vibrate on supported mobile devices when the next pose starts.",
  },
];

export function SettingsPanel({ settings, onChange }: SettingsPanelProps) {
  return (
    <section className="panel-surface rounded-[2rem] p-5 shadow-stage">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-white/45">Settings</p>
          <h2 className="mt-2 font-display text-3xl uppercase text-white">Feedback</h2>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {toggles.map((toggle) => {
          const enabled = settings[toggle.key] as boolean;

          return (
            <label
              key={toggle.key}
              className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium text-white">{toggle.label}</p>
                <p className="text-xs text-white/50">{toggle.hint}</p>
              </div>
              <button
                type="button"
                onClick={() => onChange({ ...settings, [toggle.key]: !enabled })}
                className={[
                  "relative h-8 w-14 rounded-full border transition",
                  enabled ? "border-gold/50 bg-gold/20" : "border-white/10 bg-white/[0.05]",
                ].join(" ")}
                aria-pressed={enabled}
                aria-label={toggle.label}
              >
                <span
                  className={[
                    "absolute top-1 h-6 w-6 rounded-full transition",
                    enabled ? "left-7 bg-goldSoft" : "left-1 bg-white/80",
                  ].join(" ")}
                />
              </button>
            </label>
          );
        })}
      </div>
    </section>
  );
}
