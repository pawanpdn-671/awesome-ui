"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "glow";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-awesome-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-900 disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-awesome-500 text-white hover:bg-awesome-600 active:bg-awesome-700 shadow-lg shadow-awesome-500/20": variant === "primary",
            "bg-surface-800 text-surface-100 hover:bg-surface-700 border border-surface-700": variant === "secondary",
            "text-surface-300 hover:text-surface-100 hover:bg-surface-800": variant === "ghost",
            "border border-surface-700 text-surface-200 hover:bg-surface-800 hover:border-awesome-500/50": variant === "outline",
            "bg-awesome-500 text-white glow hover:bg-awesome-600": variant === "glow",
          },
          {
            "h-8 px-3 text-xs": size === "sm",
            "h-10 px-5 text-sm": size === "md",
            "h-12 px-8 text-base": size === "lg",
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };
