import { Progress } from "@/components/ui/progress";
import { formatNumber } from "@/lib/utils";

export function MacroBar({
  label,
  value,
  total
}: {
  label: string;
  value: number;
  total: number;
}) {
  const percentage = total > 0 ? (value / total) * 100 : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{formatNumber(value, 1)} g</span>
      </div>
      <Progress value={percentage} />
    </div>
  );
}
