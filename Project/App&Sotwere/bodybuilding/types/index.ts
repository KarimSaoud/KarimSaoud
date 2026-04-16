export type Pose = {
  id: string;
  name: string;
  duration: number;
};

export type Routine = {
  id: string;
  name: string;
  poses: Pose[];
  createdAt: string;
  updatedAt: string;
};

export type RoutineSettings = {
  voiceEnabled: boolean;
  beepEnabled: boolean;
  vibrationEnabled: boolean;
  watchMode: boolean;
};

export type PlayerStatus = "idle" | "running" | "paused" | "finished";

export type PlayerState = {
  status: PlayerStatus;
  currentIndex: number;
  poseRemainingMs: number;
  totalRemainingMs: number;
  progress: number;
  currentPose: Pose | null;
  nextPose: Pose | null;
};
