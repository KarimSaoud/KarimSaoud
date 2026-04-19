import { Pose } from "@/types";

export const formatDuration = (totalSeconds: number) => {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export const formatDurationFromMs = (milliseconds: number) =>
  formatDuration(Math.ceil(milliseconds / 1000));

export const getRoutineDuration = (poses: Pose[]) =>
  poses.reduce((sum, pose) => sum + pose.duration, 0);

export const clampDuration = (value: number) => {
  if (!Number.isFinite(value)) return 1;
  return Math.min(600, Math.max(1, Math.round(value)));
};

export const createId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
