import * as React from "react";
import { cn } from "@/lib/utils";

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        "h-11 w-full rounded-2xl border border-[rgba(88,153,195,0.45)] bg-[#FFFFFF] px-4 text-sm text-[#0C2752] outline-none focus:border-[#5899C3] focus:ring-2 focus:ring-[rgba(88,153,195,0.22)]",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  ),
);
Select.displayName = "Select";
