"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Car, CheckCircle2, CreditCard, Headphones, Search, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { searchVin } from "@/lib/api/vin";
import type { Locale } from "@/lib/i18n/routing";
import type { ReportProductType, VinSearchResult } from "@/lib/api/types";
import { vinSchema } from "@/lib/validation/schemas";
import { normalizeApiError } from "@/lib/api/client";
import { normalizeVin } from "@/lib/utils/format";
import { savePendingPurchase } from "@/lib/utils/pending-purchase";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { ProductCard } from "./product-card";

export function VinSearch({ locale, isAuthenticated }: { locale: Locale; isAuthenticated: boolean }) {
  const t = useTranslations();
  const router = useRouter();
  const resultRef = useRef<HTMLDivElement | null>(null);
  const [vin, setVin] = useState("");
  const [result, setResult] = useState<VinSearchResult | null>(null);
  const [selected, setSelected] = useState<ReportProductType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const parsed = vinSchema.safeParse(vin);

    if (!parsed.success) {
      setError(vin ? t("hero.errorInvalid") : t("hero.errorRequired"));
      return;
    }

    setLoading(true);
    setResult(null);
    setSelected([]);

    try {
      const data = await searchVin(parsed.data, { locale });
      setResult(data);
      setSelected(data.products.filter((product) => product.available).map((product) => product.type));
      window.setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    } catch (apiError) {
      setError(normalizeApiError(apiError).message);
    } finally {
      setLoading(false);
    }
  }

  function toggleProduct(type: ReportProductType) {
    setSelected((current) =>
      current.includes(type) ? current.filter((productType) => productType !== type) : [...current, type]
    );
  }

  function buySelected() {
    if (!result || selected.length === 0) {
      setError(t("home.noSelection"));
      return;
    }

    savePendingPurchase({
      vin: result.vin,
      products: selected
    });

    router.push(isAuthenticated ? `/${locale}/checkout` : `/${locale}/login`);
  }

  return (
    <div>
      <section className="relative isolate min-h-[calc(100vh-72px)] overflow-hidden">
        <Image
          src="/assets/images/mashina-i-fon-vmeste.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/88 to-white/24 dark:from-slate-950 dark:via-slate-950/86 dark:to-slate-950/24" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[var(--background)] to-transparent" />

        <div className="container-shell relative z-10 flex min-h-[calc(100vh-72px)] items-center py-12">
          <div className="w-full max-w-2xl">
            <Badge className="mb-5">{t("hero.eyebrow")}</Badge>
            <h1 className="max-w-3xl text-4xl font-black leading-tight text-slate-950 dark:text-white sm:text-5xl lg:text-6xl">
              {t("hero.title")}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-slate-700 dark:text-slate-200 sm:text-lg">
              {t("hero.subtitle")}
            </p>

            <form onSubmit={submit} className="mt-8 rounded-lg border border-white/70 bg-white/88 p-3 shadow-2xl shadow-slate-950/10 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/72">
              <label htmlFor="vin" className="sr-only">
                {t("hero.inputLabel")}
              </label>
              <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                <div className="relative">
                  <Car className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-600 dark:text-blue-300" aria-hidden="true" />
                  <input
                    id="vin"
                    value={vin}
                    onChange={(event) => setVin(normalizeVin(event.target.value))}
                    placeholder={t("hero.placeholder")}
                    maxLength={17}
                    autoComplete="off"
                    inputMode="text"
                    className="focus-ring h-14 w-full rounded-lg border border-slate-200 bg-white pl-12 pr-4 text-[16px] font-bold uppercase tracking-[0.08em] text-slate-950 outline-none transition placeholder:font-semibold placeholder:tracking-normal placeholder:text-slate-400 focus:border-blue-500 dark:border-white/10 dark:bg-white/8 dark:text-white dark:placeholder:text-slate-500"
                    aria-invalid={Boolean(error)}
                  />
                </div>
                <Button type="submit" size="lg" disabled={loading} icon={loading ? <Spinner /> : <Search className="h-5 w-5" aria-hidden="true" />}>
                  {loading ? t("hero.searching") : t("common.search")}
                </Button>
              </div>
              {error ? <p className="mt-3 px-1 text-sm font-semibold text-red-600 dark:text-red-300">{error}</p> : null}
            </form>

            <div className="mt-6 grid gap-3 text-sm font-semibold text-slate-700 dark:text-slate-200 sm:grid-cols-3">
              <TrustItem icon={<ShieldCheck className="h-5 w-5" />} text={t("hero.trust1")} />
              <TrustItem icon={<Headphones className="h-5 w-5" />} text={t("hero.trust2")} />
              <TrustItem icon={<CreditCard className="h-5 w-5" />} text={t("hero.trust3")} />
            </div>
          </div>
        </div>
      </section>

      {result ? (
        <section ref={resultRef} className="container-shell scroll-mt-28 py-12">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-300">
                {t("home.resultTitle")}
              </p>
              <h2 className="mt-2 text-3xl font-black text-slate-950 dark:text-white">
                {result.year} {result.vehicle}
              </h2>
              <p className="mt-2 font-mono text-sm font-bold text-slate-500 dark:text-slate-400">{result.vin}</p>
            </div>
            <Button type="button" size="lg" onClick={buySelected}>
              {t("common.buySelected")}
            </Button>
          </div>

          <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Badge><CheckCircle2 className="h-4 w-4" />{t("home.badges.delivery")}</Badge>
            <Badge><ShieldCheck className="h-4 w-4" />{t("home.badges.payment")}</Badge>
            <Badge><Car className="h-4 w-4" />{t("home.badges.reports")}</Badge>
            <Badge><Headphones className="h-4 w-4" />{t("home.badges.support")}</Badge>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1fr_1fr_0.8fr]">
            {result.products.map((product) => (
              <ProductCard
                key={product.type}
                product={product}
                selected={selected.includes(product.type)}
                onToggle={toggleProduct}
              />
            ))}
            <Card className="p-5">
              <h3 className="text-lg font-black text-slate-950 dark:text-white">{t("home.bundleTitle")}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{t("home.bundleText")}</p>
              <Button
                type="button"
                variant="secondary"
                className="mt-5 w-full"
                onClick={() => setSelected(["carfax", "autocheck"])}
              >
                {t("common.select")}
              </Button>
            </Card>
          </div>

          {error ? (
            <Alert tone="error" className="mt-6">
              {error}
            </Alert>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}

function TrustItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-3 py-2 shadow-sm shadow-slate-950/5 backdrop-blur dark:border-white/10 dark:bg-slate-950/50">
      <span className="text-blue-600 dark:text-blue-300">{icon}</span>
      {text}
    </span>
  );
}
