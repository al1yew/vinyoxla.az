import { forwardRef, type ComponentProps } from "react";
import { cn } from "@/lib/utils/cn";

export const Input = forwardRef<HTMLInputElement, ComponentProps<"input">>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      data-slot="input"
      className={cn(
        "focus-ring flex h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-[16px] text-slate-950 outline-none transition file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-red-500 dark:border-white/10 dark:bg-white/8 dark:text-white dark:placeholder:text-slate-500",
        className
      )}
      {...props}
    />
  )
);

Input.displayName = "Input";
