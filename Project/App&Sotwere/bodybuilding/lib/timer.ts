import { Pose, PlayerState, PlayerStatus } from "@/types";

export type TimerSnapshot = {
  status: PlayerStatus;
  currentIndex: number;
  currentStartedAtMs: number | null;
  elapsedInCurrentMs: number;
};

export const calculateRemainingTotalMs = (
  poses: Pose[],
  currentIndex: number,
  poseRemainingMs: number,
) => {
  if (poses.length === 0 || currentIndex >= poses.length) return 0;

  const remainingAfterCurrent = poses
    .slice(currentIndex + 1)
    .reduce((sum, pose) => sum + pose.duration * 1000, 0);

  return Math.max(0, poseRemainingMs + remainingAfterCurrent);
};

export const getPlayerState = (poses: Pose[], snapshot: TimerSnapshot): PlayerState => {
  const currentPose = poses[snapshot.currentIndex] ?? null;
  const nextPose = poses[snapshot.currentIndex + 1] ?? null;

  if (!currentPose) {
    return {
      status: poses.length === 0 ? "idle" : "finished",
      currentIndex: 0,
      poseRemainingMs: 0,
      totalRemainingMs: 0,
      progress: poses.length === 0 ? 0 : 1,
      currentPose: null,
      nextPose: null,
    };
  }

  const liveElapsed =
    snapshot.status === "running" && snapshot.currentStartedAtMs
      ? Date.now() - snapshot.currentStartedAtMs
      : 0;
  const elapsedInCurrentMs = snapshot.elapsedInCurrentMs + liveElapsed;
  const poseDurationMs = currentPose.duration * 1000;
  const poseRemainingMs = Math.max(0, poseDurationMs - elapsedInCurrentMs);
  const totalDurationMs = poses.reduce((sum, pose) => sum + pose.duration * 1000, 0);
  const elapsedBeforeCurrent = poses
    .slice(0, snapshot.currentIndex)
    .reduce((sum, pose) => sum + pose.duration * 1000, 0);
  const totalElapsedMs = Math.min(totalDurationMs, elapsedBeforeCurrent + elapsedInCurrentMs);
  const totalRemainingMs = calculateRemainingTotalMs(
    poses,
    snapshot.currentIndex,
    poseRemainingMs,
  );

  return {
    status: snapshot.status,
    currentIndex: snapshot.currentIndex,
    poseRemainingMs,
    totalRemainingMs,
    progress: totalDurationMs === 0 ? 0 : Math.min(1, totalElapsedMs / totalDurationMs),
    currentPose,
    nextPose,
  };
};
