export function Progress({ value }: { value: number }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-[rgba(88,153,195,0.24)]">
      <div className="h-full rounded-full bg-gradient-to-r from-[#0C2752] via-[#5899C3] to-[#ED8232]" style={{ width: `${value}%` }} />
    </div>
  );
}
