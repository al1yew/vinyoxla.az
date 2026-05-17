"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Plus, ShieldCheck, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { getCurrentUser } from "@/lib/api/auth";
import { getCheckoutQuote, purchaseQuote } from "@/lib/api/orders";
import type {
  CheckoutQuote,
  PendingPurchase,
  ReportProductType,
  User,
} from "@/lib/api/types";
import type { Locale } from "@/lib/i18n/routing";
import { checkoutSelectionSchema } from "@/lib/validation/schemas";
import { normalizeApiError } from "@/lib/api/client";
import {
  clearPendingPurchase,
  savePendingPurchase,
} from "@/lib/utils/pending-purchase";
import { formatMoney } from "@/lib/utils/format";
import { ReportProductLogo } from "@/components/report-product-logo";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

export function CheckoutClient({
  locale,
  phone,
  initialPending,
}: {
  locale: Locale;
  phone: string;
  initialPending: PendingPurchase;
}) {
  const t = useTranslations();
  const router = useRouter();
  const [pending, setPending] = useState<PendingPurchase>(initialPending);
  const [quote, setQuote] = useState<CheckoutQuote | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedSet = useMemo(
    () => new Set(pending.products),
    [pending.products],
  );

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const parsed = checkoutSelectionSchema.parse(pending);
        const [nextQuote, nextUser] = await Promise.all([
          getCheckoutQuote(parsed, { locale }),
          getCurrentUser(phone, { locale }),
        ]);

        if (active) {
          setQuote(nextQuote);
          setUser(nextUser);
          savePendingPurchase(parsed);
        }
      } catch (apiError) {
        if (active) {
          setError(normalizeApiError(apiError).message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [locale, pending, phone]);

  function toggleProduct(type: ReportProductType) {
    setPending((current) => {
      const exists = current.products.includes(type);
      const products = exists
        ? current.products.filter((productType) => productType !== type)
        : [...current.products, type];

      return {
        ...current,
        products,
      };
    });
  }

  async function confirmPurchase() {
    if (!quote) {
      return;
    }

    setConfirming(true);
    setError(null);

    try {
      const response = await purchaseQuote(quote, { locale });

      if (response.status === "paid_from_balance") {
        clearPendingPurchase();
        router.replace(`/${locale}/account?success=1`);
        return;
      }

      if (response.status === "payment_required" && response.paymentUrl) {
        window.location.href = response.paymentUrl;
        return;
      }

      setError(response.message || t("checkout.empty"));
    } catch (apiError) {
      setError(normalizeApiError(apiError).message);
    } finally {
      setConfirming(false);
    }
  }

  if (loading) {
    return (
      <Card className="p-8 text-center">
        <Spinner className="mx-auto h-8 w-8 text-blue-600" />
        <p className="mt-4 font-semibold text-slate-700 dark:text-slate-200">
          {t("common.loading")}
        </p>
      </Card>
    );
  }

  if (!quote) {
    return <Alert tone="error">{error || t("checkout.empty")}</Alert>;
  }

  return (
    <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_380px] xl:grid-cols-[minmax(0,1fr)_420px]">
      <div className="grid min-w-0 gap-5">
        <Card className="p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <Badge>{t("common.vin")}</Badge>
              <h1 className="mt-4 text-3xl font-black text-slate-950 dark:text-white">
                {t("checkout.title")}
              </h1>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                {t("checkout.subtitle")}
              </p>
            </div>

            <div className="w-full rounded-lg bg-slate-100 p-4 text-sm dark:bg-slate-950/50 sm:w-auto sm:min-w-64">
              <p className="break-all font-mono font-black text-slate-950 dark:text-white">
                {quote.vin}
              </p>
              <p className="mt-2 text-slate-600 dark:text-slate-300">
                {quote.year} {quote.vehicle}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-5 sm:p-6">
          <h2 className="text-xl font-black text-slate-950 dark:text-white">
            {t("checkout.products")}
          </h2>

          <div className="mt-5 grid gap-3">
            {(["carfax", "autocheck"] as const).map((type) => {
              const product = quote.selectedProducts.find(
                (item) => item.type === type,
              );
              const selected = selectedSet.has(type);

              return (
                <div
                  key={type}
                  className="grid gap-4 rounded-lg border border-slate-200 p-4 dark:border-white/10 md:grid-cols-[minmax(0,1fr)_auto] md:items-center"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <ReportProductLogo
                      type={type}
                      className="h-11 w-28 shrink-0 sm:w-32"
                      imageClassName="max-h-6"
                    />

                    <div className="min-w-0">
                      <p className="truncate font-black text-slate-950 dark:text-white">
                        {t(`home.products.${type}.title`)}
                      </p>
                      <p className="mt-1 text-sm leading-5 text-slate-600 dark:text-slate-300">
                        {product
                          ? `${product.records} ${t("common.records").toLowerCase()}`
                          : t("checkout.bundleSuggestion")}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center md:justify-end">
                    {product ? (
                      <span className="font-black text-slate-950 dark:text-white sm:text-right">
                        {formatMoney(product.price)}
                      </span>
                    ) : null}

                    <Button
                      type="button"
                      variant={selected ? "secondary" : "primary"}
                      onClick={() => toggleProduct(type)}
                      className="w-full sm:w-auto"
                      icon={
                        selected ? (
                          <Trash2 className="h-4 w-4" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )
                      }
                    >
                      {selected
                        ? t("checkout.removeProduct")
                        : t("checkout.addProduct")}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {quote.bundleSuggestion ? (
            <Alert tone="info" className="mt-5">
              {quote.bundleSuggestion.message}
            </Alert>
          ) : null}
        </Card>
      </div>

      <Card className="flex flex-col p-5 sm:p-6 lg:grow">
        <h2 className="text-xl font-black text-slate-950 dark:text-white">
          {t("checkout.summary")}
        </h2>

        <div className="mt-5 grid gap-3 text-sm">
          <SummaryLine
            label={t("checkout.subtotal")}
            value={formatMoney(quote.subtotal)}
          />
          <SummaryLine
            label={t("checkout.discount")}
            value={`-${formatMoney(quote.discountAmount)}`}
          />
          <SummaryLine
            label={t("checkout.currentBalance")}
            value={user ? formatMoney(user.balance) : t("common.loading")}
          />

          <div className="my-2 h-px bg-slate-200 dark:bg-white/10" />

          <SummaryLine
            label={t("checkout.total")}
            value={formatMoney(quote.total)}
            strong
          />
        </div>

        <Alert tone="info" className="mt-5">
          <span className="inline-flex items-start gap-2">
            {t("checkout.secureNote")}
          </span>
        </Alert>

        {error ? (
          <Alert tone="error" className="mt-5 lg:mt-auto">
            {error}
          </Alert>
        ) : null}

        <Button
          type="button"
          size="lg"
          className="mt-5 lg:mt-auto w-full"
          disabled={confirming || pending.products.length === 0}
          onClick={confirmPurchase}
          icon={confirming ? <Spinner /> : <CreditCard className="h-5 w-5" />}
        >
          {confirming ? t("checkout.confirming") : t("checkout.confirmBuy")}
        </Button>
      </Card>
    </div>
  );
}

function SummaryLine({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-4 ${strong ? "text-lg" : ""}`}
    >
      <span className="text-slate-600 dark:text-slate-300">{label}</span>
      <span className="font-black text-slate-950 dark:text-white">{value}</span>
    </div>
  );
}
