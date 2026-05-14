"use client";

import { Check, FileText, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReportProductType, VinSearchProduct } from "@/lib/api/types";
import { formatMoney } from "@/lib/utils/format";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function ProductCard({
  product,
  selected,
  onToggle
}: {
  product: VinSearchProduct;
  selected: boolean;
  onToggle: (type: ReportProductType) => void;
}) {
  const t = useTranslations();
  const productKey = `home.products.${product.type}` as const;

  return (
    <Card
      className={`relative overflow-hidden p-5 transition ${
        selected
          ? "border-blue-500 bg-blue-50/70 ring-4 ring-blue-100 dark:border-blue-300 dark:bg-blue-400/10 dark:ring-blue-400/10"
          : "hover:border-blue-300 dark:hover:border-blue-300/50"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-950 text-white dark:bg-white dark:text-slate-950">
            {product.type === "carfax" ? <FileText className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-950 dark:text-white">{t(`${productKey}.title`)}</h3>
            <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
              {t(`${productKey}.description`)}
            </p>
          </div>
        </div>
        {selected ? (
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
            <Check className="h-4 w-4" aria-hidden="true" />
          </span>
        ) : null}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 rounded-lg bg-slate-100 p-3 text-sm dark:bg-slate-950/50">
        <div>
          <p className="text-slate-500 dark:text-slate-400">{t("common.records")}</p>
          <p className="mt-1 font-black text-slate-950 dark:text-white">{product.records}</p>
        </div>
        <div>
          <p className="text-slate-500 dark:text-slate-400">{t("common.price")}</p>
          <p className="mt-1 font-black text-slate-950 dark:text-white">{formatMoney(product.price)}</p>
        </div>
      </div>

      <Button
        type="button"
        variant={selected ? "secondary" : "primary"}
        className="mt-5 w-full"
        onClick={() => onToggle(product.type)}
      >
        {selected ? t("common.selected") : t("common.select")}
      </Button>
    </Card>
  );
}
