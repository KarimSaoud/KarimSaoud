import { Input } from "@/components/ui/input";
import { formatCurrency, parseCurrencyInput } from "@/lib/format";

export function CurrencyInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <Input
      inputMode="decimal"
      value={value ? formatCurrency(value) : ""}
      placeholder="EUR 0"
      onChange={(e) => onChange(parseCurrencyInput(e.target.value))}
    />
  );
}
