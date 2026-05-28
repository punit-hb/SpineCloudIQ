import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const badgeVariants = cva(
  "inline-flex h-7 items-center justify-center rounded-full border px-2.5 text-xs font-normal leading-none w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1.5 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-primary/20 bg-primary/5 text-primary [a&]:hover:bg-primary/10",
        secondary:
          "border-neutral-200 bg-white text-neutral-700 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300 [a&]:hover:bg-neutral-50",
        destructive:
          "border-red-200 bg-red-50 text-red-700 [a&]:hover:bg-red-100 focus-visible:ring-destructive/20 dark:border-red-900 dark:bg-red-950/20 dark:text-red-300 dark:focus-visible:ring-destructive/40",
        outline:
          "border-neutral-200 bg-white text-neutral-700 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300 [a&]:hover:bg-neutral-50",
        "status-dot":
          "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400 gap-1.5",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const Badge = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<"span"> &
    VariantProps<typeof badgeVariants> & { asChild?: boolean }
>(({ className, variant, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "span";
  const textTone = String(className ?? "");
  const dotClass =
    variant === "destructive" || /red|rose|destructive/.test(textTone)
      ? "bg-red-500"
      : /amber|yellow|orange|warning/.test(textTone)
        ? "bg-amber-500"
        : /emerald|green|success/.test(textTone)
          ? "bg-emerald-500"
          : /blue|cyan|info|primary/.test(textTone) || variant === "default"
            ? "bg-blue-500"
            : "bg-neutral-400";

  if (asChild) {
    return (
      <Comp
        ref={ref}
        data-slot="badge"
        className={cn(badgeVariants({ variant }), className)}
        {...props}
      />
    );
  }

  return (
    <Comp
      ref={ref}
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    >
      {variant === "status-dot" ? null : <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", dotClass)} />}
      {props.children}
    </Comp>
  );
});

Badge.displayName = "Badge";

export function StatusDot({
  color,
  className = "",
}: {
  color: "success" | "warning" | "error" | "info" | "neutral";
  className?: string;
}) {
  const colors = {
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    error: "bg-rose-500",
    info: "bg-blue-500",
    neutral: "bg-neutral-400",
  };
  return (
    <span
      className={`w-1.5 h-1.5 rounded-full ${colors[color]} ${className}`}
    />
  );
}

export { Badge, badgeVariants };
