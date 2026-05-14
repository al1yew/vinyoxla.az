import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="card"
      className={cn(
        "rounded-lg border border-slate-200 bg-white shadow-sm shadow-slate-950/5 dark:border-white/10 dark:bg-white/8 dark:shadow-black/20",
        className
      )}
      {...props}
    />
  );
}
