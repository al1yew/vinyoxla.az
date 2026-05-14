import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      data-slot="select"
      className={cn(
        "focus-ring flex h-12 w-full rounded-lg border border-slate-200 bg-white px-3 text-[16px] text-slate-950 outline-none transition focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-red-500 dark:border-white/10 dark:bg-slate-900 dark:text-white",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}
