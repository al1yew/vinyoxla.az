import Image from "next/image";
import type { ReportProductType } from "@/lib/api/types";
import { cn } from "@/lib/utils/cn";

const productLogos: Record<
  ReportProductType,
  {
    src: string;
    width: number;
    height: number;
  }
> = {
  carfax: {
    src: "/assets/images/carfax-logo.png",
    width: 2000,
    height: 375,
  },
  autocheck: {
    src: "/assets/images/autocheckLogo.png",
    width: 212,
    height: 61,
  },
};

export function ReportProductLogo({
  type,
  className,
  imageClassName,
}: {
  type: ReportProductType;
  className?: string;
  imageClassName?: string;
}) {
  const logo = productLogos[type];

  return (
    <span
      className={cn(
        "inline-flex h-12 w-36 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 shadow-sm shadow-slate-950/5 dark:border-white/10",
        className,
      )}
    >
      <Image
        src={logo.src}
        alt=""
        width={logo.width}
        height={logo.height}
        className={cn("max-h-7 w-auto object-contain", imageClassName)}
      />
    </span>
  );
}
