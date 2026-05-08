import { type HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "primary" | "success" | "warning" | "danger";
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
        {
          "bg-surface-800 text-surface-300": variant === "default",
          "bg-awesome-500/10 text-awesome-300 border border-awesome-500/20": variant === "primary",
          "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20": variant === "success",
          "bg-amber-500/10 text-amber-300 border border-amber-500/20": variant === "warning",
          "bg-red-500/10 text-red-300 border border-red-500/20": variant === "danger",
        },
        className
      )}
      {...props}
    />
  )
);
Badge.displayName = "Badge";

export { Badge };
