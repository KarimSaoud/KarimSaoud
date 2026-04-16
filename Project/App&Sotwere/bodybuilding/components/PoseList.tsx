import { Pose } from "@/types";
import { PoseItem } from "@/components/PoseItem";

type PoseListProps = {
  poses: Pose[];
  onChangePose: (pose: Pose) => void;
  onDeletePose: (id: string) => void;
  onMovePose: (index: number, direction: -1 | 1) => void;
};

export function PoseList({
  poses,
  onChangePose,
  onDeletePose,
  onMovePose,
}: PoseListProps) {
  if (poses.length === 0) {
    return (
      <div className="rounded-[1.8rem] border border-dashed border-white/12 bg-white/[0.02] px-5 py-8 text-center">
        <p className="font-display text-3xl uppercase tracking-wide text-white/90">No poses yet</p>
        <p className="mx-auto mt-3 max-w-sm text-sm text-white/50">
          Add your first pose to start building a rehearsal-ready calling routine.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {poses.map((pose, index) => (
        <PoseItem
          key={pose.id}
          pose={pose}
          index={index}
          total={poses.length}
          onChange={onChangePose}
          onDelete={onDeletePose}
          onMove={onMovePose}
        />
      ))}
    </div>
  );
}
