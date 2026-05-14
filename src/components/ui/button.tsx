"use client";

import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg" | "icon";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 active:bg-blue-800 dark:bg-blue-500 dark:hover:bg-blue-400",
  secondary:
    "border border-blue-200 bg-white text-blue-700 hover:border-blue-300 hover:bg-blue-50 dark:border-white/10 dark:bg-white/8 dark:text-blue-100 dark:hover:bg-white/12",
  ghost:
    "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10",
  danger:
    "bg-red-600 text-white shadow-lg shadow-red-600/20 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-400"
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 gap-2 px-3 text-sm",
  md: "h-11 gap-2 px-5 text-sm",
  lg: "h-13 gap-2 px-6 text-base",
  icon: "h-10 w-10 p-0"
};

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  icon,
  children,
  disabled,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & CommonProps) {
  return (
    <button
      className={cn(
        "focus-ring inline-flex shrink-0 items-center justify-center rounded-lg font-semibold transition disabled:pointer-events-none disabled:opacity-55",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}

export function ButtonLink({
  className,
  variant = "primary",
  size = "md",
  icon,
  children,
  href,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> &
  CommonProps & {
    href: string;
  }) {
  return (
    <Link
      href={href}
      className={cn(
        "focus-ring inline-flex shrink-0 items-center justify-center rounded-lg font-semibold transition",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {icon}
      {children}
    </Link>
  );
}
