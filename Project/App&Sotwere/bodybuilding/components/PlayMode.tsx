import { PlayerState, PlayerStatus } from "@/types";
import { TimerDisplay } from "@/components/TimerDisplay";

type PlayModeProps = {
  routineName: string;
  player: PlayerState;
  poseCount: number;
  watchMode: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onNext: () => void;
  onPrevious: () => void;
};

const statusLabel: Record<PlayerStatus, string> = {
  idle: "Standing by",
  running: "Live",
  paused: "Paused",
  finished: "Complete",
};

export function PlayMode({
  routineName,
  player,
  poseCount,
  watchMode,
  onStart,
  onPause,
  onResume,
  onReset,
  onNext,
  onPrevious,
}: PlayModeProps) {
  const canStart = poseCount > 0 && (player.status === "idle" || player.status === "finished");
  const canPause = player.status === "running";
  const canResume = player.status === "paused";
  const canGoPrevious =
    poseCount > 1 &&
    player.status !== "idle" &&
    (player.status === "finished" || player.currentIndex > 0);
  const canGoNext =
    poseCount > 1 &&
    player.status !== "idle" &&
    player.currentIndex < poseCount - 1;
  const currentName = player.currentPose?.name.trim() || "No routine loaded";

  if (watchMode) {
    return (
      <section className="panel-surface rounded-[2rem] p-5 shadow-stage">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[0.7rem] uppercase tracking-[0.35em] text-white/45">Watch Mode</p>
            <p className="mt-2 font-display text-2xl uppercase text-white/90">{routineName}</p>
          </div>
          <span className="rounded-full border border-gold/35 px-3 py-1 text-[0.7rem] uppercase tracking-[0.25em] text-goldSoft">
            {statusLabel[player.status]}
          </span>
        </div>

        <div className="mt-6 rounded-[2rem] border border-gold/18 bg-black/35 px-5 py-8 text-center">
          <p className="text-[0.7rem] uppercase tracking-[0.35em] text-white/35">Current Pose</p>
          <h2 className="mt-3 font-display text-5xl uppercase leading-none text-white sm:text-6xl">
            {currentName}
          </h2>
          <p className="mt-6 font-display text-7xl leading-none text-goldSoft">
            {Math.max(0, Math.ceil(player.poseRemainingMs / 1000))}
          </p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={canStart ? onStart : canResume ? onResume : onPause}
            disabled={poseCount === 0}
            className="gold-ring rounded-3xl bg-gold px-4 py-4 font-semibold text-black disabled:cursor-not-allowed disabled:opacity-40"
          >
            {canStart ? "Start" : canResume ? "Resume" : "Pause"}
          </button>
          <button
            type="button"
            onClick={onReset}
            className="rounded-3xl border border-white/10 bg-white/[0.03] px-4 py-4 font-medium text-white/80"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={onPrevious}
            disabled={!canGoPrevious}
            className="rounded-3xl border border-white/10 bg-white/[0.03] px-4 py-4 font-medium text-white/80 disabled:cursor-not-allowed disabled:opacity-30"
          >
            Prev
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={!canGoNext}
            className="rounded-3xl border border-white/10 bg-white/[0.03] px-4 py-4 font-medium text-white/80 disabled:cursor-not-allowed disabled:opacity-30"
          >
            Next
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="panel-surface rounded-[2rem] p-5 shadow-stage">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-white/45">Play Mode</p>
          <h2 className="mt-2 font-display text-4xl uppercase text-white sm:text-5xl">
            {routineName}
          </h2>
        </div>
        <span className="rounded-full border border-gold/35 px-4 py-2 text-xs uppercase tracking-[0.25em] text-goldSoft">
          {statusLabel[player.status]}
        </span>
      </div>

      <div className="mt-6 rounded-[2rem] border border-gold/18 bg-black/35 p-5">
        <p className="text-xs uppercase tracking-[0.3em] text-white/35">Current pose</p>
        <h3 className="mt-3 font-display text-6xl uppercase leading-none text-white sm:text-7xl">
          {currentName}
        </h3>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <TimerDisplay label="Current countdown" valueMs={player.poseRemainingMs} emphasize />
          <TimerDisplay label="Total remaining" valueMs={player.totalRemainingMs} />
        </div>

        <div className="mt-5 rounded-3xl border border-white/8 bg-white/[0.03] px-4 py-3">
          <p className="text-[0.65rem] uppercase tracking-[0.35em] text-white/40">Next pose</p>
          <p className="mt-2 font-display text-3xl uppercase text-white/85">
            {player.nextPose?.name || "Finish strong"}
          </p>
        </div>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-white/42">
          <span>
            Step {Math.min(player.currentIndex + 1, Math.max(1, poseCount))} / {Math.max(1, poseCount)}
          </span>
          <span>{Math.round(player.progress * 100)}%</span>
        </div>
        <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/[0.05]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-gold/80 to-goldSoft transition-[width] duration-300"
            style={{ width: `${player.progress * 100}%` }}
          />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <button
          type="button"
          onClick={onStart}
          disabled={!canStart}
          className="gold-ring rounded-3xl bg-gold px-4 py-4 font-semibold text-black disabled:cursor-not-allowed disabled:opacity-40"
        >
          Start
        </button>
        <button
          type="button"
          onClick={onPause}
          disabled={!canPause}
          className="rounded-3xl border border-white/10 bg-white/[0.03] px-4 py-4 font-medium text-white/80 disabled:cursor-not-allowed disabled:opacity-30"
        >
          Pause
        </button>
        <button
          type="button"
          onClick={onResume}
          disabled={!canResume}
          className="rounded-3xl border border-white/10 bg-white/[0.03] px-4 py-4 font-medium text-white/80 disabled:cursor-not-allowed disabled:opacity-30"
        >
          Resume
        </button>
        <button
          type="button"
          onClick={onPrevious}
          disabled={!canGoPrevious}
          className="rounded-3xl border border-white/10 bg-white/[0.03] px-4 py-4 font-medium text-white/80 disabled:cursor-not-allowed disabled:opacity-30"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!canGoNext}
          className="rounded-3xl border border-white/10 bg-white/[0.03] px-4 py-4 font-medium text-white/80 disabled:cursor-not-allowed disabled:opacity-30"
        >
          Skip Next
        </button>
        <button
          type="button"
          onClick={onReset}
          className="rounded-3xl border border-white/10 bg-white/[0.03] px-4 py-4 font-medium text-white/80"
        >
          Reset
        </button>
      </div>
    </section>
  );
}
