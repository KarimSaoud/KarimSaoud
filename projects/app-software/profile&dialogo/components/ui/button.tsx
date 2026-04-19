import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-xl text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-panel hover:opacity-95",
        secondary: "bg-[rgba(88,153,195,0.18)] text-[#0C2752] ring-1 ring-[rgba(88,153,195,0.55)] hover:bg-[rgba(88,153,195,0.28)]",
        ghost: "text-[#0C2752] hover:bg-[rgba(88,153,195,0.16)]",
        outline: "bg-transparent ring-1 ring-[rgba(88,153,195,0.55)] text-[#0C2752] hover:bg-[rgba(88,153,195,0.12)]",
        warning: "bg-[#DC6E2D] text-[#FFFFFF] hover:bg-[rgba(220,110,45,0.9)]",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-3",
        lg: "h-12 px-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, ...props }, ref) => {
  return <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
});
Button.displayName = "Button";

export { Button, buttonVariants };
