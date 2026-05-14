"use client";

import { X } from "lucide-react";
import { Button } from "./button";

export function Modal({
  open,
  title,
  children,
  onClose
}: {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-slate-950/60 p-3 backdrop-blur-sm sm:items-center sm:justify-center">
      <div className="w-full max-w-lg rounded-lg border border-slate-200 bg-white p-5 shadow-2xl dark:border-white/10 dark:bg-slate-950">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-slate-950 dark:text-white">{title}</h2>
          <Button type="button" variant="ghost" size="icon" onClick={onClose} aria-label={title}>
            <X className="h-5 w-5" aria-hidden="true" />
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}
