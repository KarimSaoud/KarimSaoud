import { Button } from "@/components/ui/button";

export function StepActions({
  onPrev,
  onNext,
  disablePrev,
  nextLabel = "Continua",
}: {
  onPrev: () => void;
  onNext: () => void;
  disablePrev?: boolean;
  nextLabel?: string;
}) {
  return (
    <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
      <Button variant="secondary" onClick={onPrev} disabled={disablePrev}>
        Step precedente
      </Button>
      <Button onClick={onNext}>{nextLabel}</Button>
    </div>
  );
}
