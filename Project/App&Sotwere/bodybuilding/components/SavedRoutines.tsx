import { Routine } from "@/types";
import { formatDuration, getRoutineDuration } from "@/lib/utils";

type SavedRoutinesProps = {
  routines: Routine[];
  currentRoutineId: string;
  onLoad: (routineId: string) => void;
  onSave: () => void;
  onOverwrite: (routineId: string) => void;
  onDelete: (routineId: string) => void;
};

export function SavedRoutines({
  routines,
  currentRoutineId,
  onLoad,
  onSave,
  onOverwrite,
  onDelete,
}: SavedRoutinesProps) {
  return (
    <section className="panel-surface rounded-[2rem] p-5 shadow-stage">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-white/45">Saved Routines</p>
          <h2 className="mt-2 font-display text-3xl uppercase text-white">Library</h2>
        </div>
        <button
          type="button"
          onClick={onSave}
          className="rounded-full border border-gold/40 bg-gold/15 px-4 py-2 text-sm font-medium text-goldSoft transition hover:bg-gold/20"
        >
          Save Current
        </button>
      </div>

      <div className="mt-5 space-y-3">
        {routines.length === 0 ? (
          <div className="rounded-[1.6rem] border border-dashed border-white/12 bg-white/[0.02] px-5 py-7 text-sm text-white/50">
            No saved routines yet. Save your current setup to reuse it later.
          </div>
        ) : (
          routines.map((routine) => {
            const active = routine.id === currentRoutineId;

            return (
              <div
                key={routine.id}
                className={[
                  "rounded-[1.6rem] border p-4",
                  active ? "border-gold/40 bg-gold/10" : "border-white/8 bg-white/[0.03]",
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-base font-semibold text-white">{routine.name}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.22em] text-white/40">
                      {routine.poses.length} poses • {formatDuration(getRoutineDuration(routine.poses))}
                    </p>
                  </div>
                  {active ? (
                    <span className="rounded-full border border-gold/35 px-3 py-1 text-[0.7rem] uppercase tracking-[0.25em] text-goldSoft">
                      Active
                    </span>
                  ) : null}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => onLoad(routine.id)}
                    className="rounded-full border border-white/10 px-3 py-2 text-sm text-white/75 transition hover:border-white/20"
                  >
                    Load
                  </button>
                  <button
                    type="button"
                    onClick={() => onOverwrite(routine.id)}
                    className="rounded-full border border-white/10 px-3 py-2 text-sm text-white/75 transition hover:border-white/20"
                  >
                    Overwrite
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(routine.id)}
                    className="rounded-full border border-white/10 px-3 py-2 text-sm text-white/75 transition hover:border-red-400/30 hover:text-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
