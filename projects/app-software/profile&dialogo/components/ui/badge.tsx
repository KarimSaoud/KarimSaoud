import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  tone = "slate",
  children,
}: {
  className?: string;
  tone?: "slate" | "emerald" | "amber" | "rose" | "blue";
  children: ReactNode;
}) {
  const tones = {
    slate: "bg-[rgba(88,153,195,0.16)] text-[#0C2752]",
    emerald: "bg-[rgba(88,153,195,0.16)] text-[#0C2752]",
    amber: "bg-[rgba(237,130,50,0.16)] text-[#DC6E2D]",
    rose: "bg-[rgba(220,110,45,0.16)] text-[#DC6E2D]",
    blue: "bg-[rgba(88,153,195,0.16)] text-[#0C2752]",
  };
  return (
    <span className={cn("inline-flex rounded-full px-3 py-1 text-xs font-semibold", tones[tone], className)}>
      {children}
    </span>
  );
}
