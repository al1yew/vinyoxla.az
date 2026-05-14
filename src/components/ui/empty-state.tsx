import { FileSearch } from "lucide-react";

export function EmptyState({ title, text }: { title: string; text?: string }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white/70 p-8 text-center dark:border-white/15 dark:bg-white/5">
      <FileSearch className="mx-auto mb-3 h-9 w-9 text-blue-600 dark:text-blue-300" aria-hidden="true" />
      <p className="font-semibold text-slate-950 dark:text-white">{title}</p>
      {text ? <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{text}</p> : null}
    </div>
  );
}
