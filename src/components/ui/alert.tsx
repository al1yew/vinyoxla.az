import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type AlertTone = "info" | "success" | "error";

const toneStyles: Record<AlertTone, string> = {
  info: "border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-400/20 dark:bg-blue-400/10 dark:text-blue-100",
  success:
    "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-100",
  error: "border-red-200 bg-red-50 text-red-900 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-100"
};

export function Alert({
  tone = "info",
  title,
  children,
  className
}: {
  tone?: AlertTone;
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const Icon = tone === "error" ? AlertCircle : tone === "success" ? CheckCircle2 : Info;

  return (
    <div className={cn("flex gap-3 rounded-lg border p-4 text-sm", toneStyles[tone], className)} role="alert">
      <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
      <div>
        {title ? <p className="font-semibold">{title}</p> : null}
        <div className="leading-6">{children}</div>
      </div>
    </div>
  );
}
