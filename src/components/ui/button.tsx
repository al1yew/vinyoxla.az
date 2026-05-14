"use client";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

export const buttonVariants = cva(
  "focus-ring inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg font-semibold transition disabled:pointer-events-none disabled:opacity-55 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 active:bg-blue-800 dark:bg-blue-500 dark:hover:bg-blue-400",
        primary:
          "bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 active:bg-blue-800 dark:bg-blue-500 dark:hover:bg-blue-400",
        secondary:
          "border border-blue-200 bg-white text-blue-700 hover:border-blue-300 hover:bg-blue-50 dark:border-white/10 dark:bg-white/8 dark:text-blue-100 dark:hover:bg-white/12",
        outline:
          "border border-slate-200 bg-white text-slate-900 hover:bg-slate-50 dark:border-white/10 dark:bg-slate-950 dark:text-white dark:hover:bg-white/10",
        ghost: "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10",
        destructive:
          "bg-red-600 text-white shadow-lg shadow-red-600/20 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-400",
        danger:
          "bg-red-600 text-white shadow-lg shadow-red-600/20 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-400"
      },
      size: {
        default: "h-11 px-5 text-sm",
        sm: "h-9 px-3 text-sm",
        md: "h-11 px-5 text-sm",
        lg: "h-13 px-6 text-base",
        icon: "h-10 w-10 p-0"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

type CommonProps = {
  icon?: ReactNode;
} & VariantProps<typeof buttonVariants>;

export function Button({
  className,
  variant,
  size,
  icon,
  children,
  disabled,
  asChild = false,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> &
  CommonProps & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled}
      {...props}
    >
      {icon}
      {children}
    </Comp>
  );
}

export function ButtonLink({
  className,
  variant,
  size,
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
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {icon}
      {children}
    </Link>
  );
}
