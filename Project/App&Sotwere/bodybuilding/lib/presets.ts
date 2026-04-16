import { Routine } from "@/types";
import { createId } from "@/lib/utils";

const now = () => new Date().toISOString();

const createRoutine = (name: string, poses: Array<[string, number]>): Routine => ({
  id: createId(),
  name,
  createdAt: now(),
  updatedAt: now(),
  poses: poses.map(([poseName, duration]) => ({
    id: createId(),
    name: poseName,
    duration,
  })),
});

export const presetRoutines: Routine[] = [
  createRoutine("Men's Physique Basic", [
    ["Front stance", 10],
    ["Quarter turn right", 8],
    ["Rear stance", 10],
    ["Quarter turn right", 8],
    ["Side stance", 10],
    ["Confidence walk", 12],
  ]),
  createRoutine("Classic Physique Basic", [
    ["Front double biceps", 10],
    ["Side chest", 10],
    ["Back double biceps", 10],
    ["Abdominals and thigh", 10],
    ["Most muscular", 8],
  ]),
  createRoutine("Bodybuilding Mandatory Poses", [
    ["Front double biceps", 10],
    ["Front lat spread", 10],
    ["Side chest", 10],
    ["Back double biceps", 10],
    ["Back lat spread", 10],
    ["Side triceps", 10],
    ["Abdominals and thigh", 10],
    ["Most muscular", 8],
  ]),
];
