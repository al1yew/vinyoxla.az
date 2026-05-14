import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "focus-ring h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-[16px] text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 dark:border-white/10 dark:bg-white/8 dark:text-white dark:placeholder:text-slate-500",
        className
      )}
      {...props}
    />
  )
);

Input.displayName = "Input";
