import { Pose } from "@/types";

type PoseItemProps = {
  pose: Pose;
  index: number;
  total: number;
  onChange: (pose: Pose) => void;
  onDelete: (id: string) => void;
  onMove: (index: number, direction: -1 | 1) => void;
};

export function PoseItem({ pose, index, total, onChange, onDelete, onMove }: PoseItemProps) {
  return (
    <div className="rounded-[1.6rem] border border-white/8 bg-white/[0.03] p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[0.7rem] uppercase tracking-[0.35em] text-white/35">
            Pose {index + 1}
          </p>
          <p className="mt-1 text-sm text-white/55">Shape the exact call and timing.</p>
        </div>
        <button
          type="button"
          onClick={() => onDelete(pose.id)}
          className="rounded-full border border-white/10 px-3 py-1.5 text-xs font-medium text-white/65 transition hover:border-red-400/30 hover:text-red-200"
        >
          Delete
        </button>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_128px]">
        <label className="block">
          <span className="mb-2 block text-xs uppercase tracking-[0.25em] text-white/40">Pose name</span>
          <input
            value={pose.name}
            onChange={(event) => onChange({ ...pose, name: event.target.value })}
            placeholder="Front double biceps"
            className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-white/20 focus:border-gold/50"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-xs uppercase tracking-[0.25em] text-white/40">
            Seconds
          </span>
          <input
            type="number"
            min={1}
            max={600}
            value={pose.duration}
            onChange={(event) =>
              onChange({
                ...pose,
                duration: Number(event.target.value),
              })
            }
            className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-gold/50"
          />
        </label>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() => onMove(index, -1)}
          disabled={index === 0}
          className="rounded-full border border-white/10 px-3 py-2 text-sm text-white/75 transition disabled:cursor-not-allowed disabled:opacity-30 hover:border-white/20"
        >
          Move Up
        </button>
        <button
          type="button"
          onClick={() => onMove(index, 1)}
          disabled={index === total - 1}
          className="rounded-full border border-white/10 px-3 py-2 text-sm text-white/75 transition disabled:cursor-not-allowed disabled:opacity-30 hover:border-white/20"
        >
          Move Down
        </button>
      </div>
    </div>
  );
}
