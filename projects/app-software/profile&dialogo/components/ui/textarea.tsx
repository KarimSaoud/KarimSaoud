import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "min-h-[110px] w-full rounded-2xl border border-[rgba(88,153,195,0.45)] bg-[#FFFFFF] px-4 py-3 text-sm text-[#0C2752] outline-none transition placeholder:text-[rgba(12,39,82,0.45)] focus:border-[#5899C3] focus:ring-2 focus:ring-[rgba(88,153,195,0.22)]",
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";
