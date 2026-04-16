import { Pose } from "@/types";
import { PoseList } from "@/components/PoseList";
import { formatDuration } from "@/lib/utils";

type RoutineBuilderProps = {
  routineName: string;
  poses: Pose[];
  totalSeconds: number;
  onRoutineNameChange: (name: string) => void;
  onAddPose: () => void;
  onChangePose: (pose: Pose) => void;
  onDeletePose: (id: string) => void;
  onMovePose: (index: number, direction: -1 | 1) => void;
  onApplyPreset: (routineId: string) => void;
  presets: Array<{ id: string; name: string }>;
};

export function RoutineBuilder({
  routineName,
  poses,
  totalSeconds,
  onRoutineNameChange,
  onAddPose,
  onChangePose,
  onDeletePose,
  onMovePose,
  onApplyPreset,
  presets,
}: RoutineBuilderProps) {
  return (
    <section className="panel-surface rounded-[2rem] p-5 shadow-stage">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-xl">
          <p className="text-xs uppercase tracking-[0.35em] text-white/45">Routine Builder</p>
          <h1 className="mt-2 font-display text-5xl uppercase leading-none text-white sm:text-6xl">
            Posing Caller
          </h1>
          <p className="mt-3 text-sm text-white/58 sm:text-base">
            Build your call sheet, lock the timing, and move into a premium training mode built for the gym floor.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-3xl border border-white/8 bg-white/[0.03] px-4 py-3 text-center">
            <p className="text-[0.65rem] uppercase tracking-[0.3em] text-white/40">Poses</p>
            <p className="mt-2 font-display text-4xl text-white">{poses.length}</p>
          </div>
          <div className="rounded-3xl border border-white/8 bg-white/[0.03] px-4 py-3 text-center">
            <p className="text-[0.65rem] uppercase tracking-[0.3em] text-white/40">Duration</p>
            <p className="mt-2 font-display text-4xl text-goldSoft">{formatDuration(totalSeconds)}</p>
          </div>
          <div className="rounded-3xl border border-white/8 bg-white/[0.03] px-4 py-3 text-center">
            <p className="text-[0.65rem] uppercase tracking-[0.3em] text-white/40">Status</p>
            <p className="mt-2 font-display text-4xl text-white">{poses.length > 0 ? "Ready" : "Build"}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_220px]">
        <label className="block">
          <span className="mb-2 block text-xs uppercase tracking-[0.25em] text-white/40">Routine name</span>
          <input
            value={routineName}
            onChange={(event) => onRoutineNameChange(event.target.value)}
            placeholder="Stage rehearsal"
            className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-white/20 focus:border-gold/50"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-xs uppercase tracking-[0.25em] text-white/40">Load preset</span>
          <select
            defaultValue=""
            onChange={(event) => {
              if (event.target.value) {
                onApplyPreset(event.target.value);
                event.target.value = "";
              }
            }}
            className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-gold/50"
          >
            <option value="" disabled>
              Choose preset
            </option>
            {presets.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onAddPose}
          className="gold-ring rounded-full bg-gold px-5 py-3 text-sm font-semibold text-black transition hover:brightness-105"
        >
          Add Pose
        </button>
        <div className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/65">
          Total timing updates instantly as you edit the list.
        </div>
      </div>

      <div className="mt-6">
        <PoseList
          poses={poses}
          onChangePose={onChangePose}
          onDeletePose={onDeletePose}
          onMovePose={onMovePose}
        />
      </div>
    </section>
  );
}
