"use client";

import Image, { getImageProps } from "next/image";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Car,
  CheckCircle2,
  ClipboardPaste,
  Headphones,
  Search,
  ShieldCheck,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { searchVin } from "@/lib/api/vin";
import type { Locale } from "@/lib/i18n/routing";
import type { ReportProductType, VinSearchResult } from "@/lib/api/types";
import { vinSchema } from "@/lib/validation/schemas";
import { VIN_CODE_LENGTH, VIN_INPUT_PATTERN } from "@/lib/validation/vin";
import { normalizeApiError } from "@/lib/api/client";
import { normalizeVin } from "@/lib/utils/format";
import { savePendingPurchase } from "@/lib/utils/pending-purchase";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { ProductCard } from "./product-card";

export function VinSearch({
  locale,
  isAuthenticated,
}: {
  locale: Locale;
  isAuthenticated: boolean;
}) {
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
      setSelected(
        data.products
          .filter((product) => product.available)
          .map((product) => product.type),
      );
      window.setTimeout(() => {
        resultRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 80);
    } catch (apiError) {
      setError(normalizeApiError(apiError).message);
    } finally {
      setLoading(false);
    }
  }

  function toggleProduct(type: ReportProductType) {
    setSelected((current) =>
      current.includes(type)
        ? current.filter((productType) => productType !== type)
        : [...current, type],
    );
  }

  async function pasteVin() {
    if (!navigator.clipboard?.readText) {
      setError(t("hero.pasteUnavailable"));
      return;
    }

    try {
      const clipboardText = await navigator.clipboard.readText();
      const normalizedVin = normalizeVin(clipboardText);

      if (!normalizedVin) {
        setError(t("hero.pasteEmpty"));
        return;
      }

      setVin(normalizedVin);
      setError(null);
    } catch {
      setError(t("hero.pasteUnavailable"));
    }
  }

  function buySelected() {
    if (!result || selected.length === 0) {
      setError(t("home.noSelection"));
      return;
    }

    savePendingPurchase({
      vin: result.vin,
      products: selected,
    });

    router.push(isAuthenticated ? `/${locale}/checkout` : `/${locale}/login`);
  }

  return (
    <div>
      <section className="relative isolate min-h-[calc(100vh-72px)] overflow-hidden">
        <HeroImage />
        <div className="absolute inset-0 bg-gradient-to-b lg:bg-gradient-to-r from-white via-white/88 to-white/24 dark:from-slate-950 dark:via-slate-950/86 dark:to-slate-950/24" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[var(--background)] to-transparent" />

        <div className="container-shell relative z-10 flex lg:min-h-[calc(100vh-72px)] md:min-h-[calc(100vh-64px)] min-h-[calc(100vh-56px)] sm:items-center py-12">
          <div className="w-full max-w-xl">
            <Badge className="mb-5">{t("hero.eyebrow")}</Badge>
            <h1 className="max-w-3xl text-2xl font-black leading-tight text-slate-950 dark:text-white sm:text-5xl lg:text-6xl">
              {t("hero.title")}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-8 text-slate-700 dark:text-slate-200 md:text-lg">
              {t("hero.subtitle")}
            </p>

            <form
              onSubmit={submit}
              noValidate
              className="mt-5 rounded-lg border border-white/70  p-3 shadow-2xl shadow-slate-950/10 backdrop-blur-xl dark:border-white/10 bg-gradient-to-r from-white to-transparent dark:from-slate-950 dark:to-transparent"
            >
              <label htmlFor="vin" className="sr-only">
                {t("hero.inputLabel")}
              </label>
              <div className="grid gap-3 md:grid-cols-[1fr_auto]">
                <div className="relative">
                  <Car
                    className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 shrink-0 -translate-y-1/2 text-blue-600 dark:text-blue-300"
                    aria-hidden="true"
                  />
                  <Input
                    id="vin"
                    value={vin}
                    onChange={(event) =>
                      setVin(normalizeVin(event.target.value))
                    }
                    placeholder={t("hero.placeholder")}
                    maxLength={VIN_CODE_LENGTH}
                    minLength={VIN_CODE_LENGTH}
                    pattern={VIN_INPUT_PATTERN}
                    autoComplete="off"
                    inputMode="text"
                    className="h-14 pl-12 pr-14 font-bold uppercase tracking-[0.08em] placeholder:font-medium placeholder:tracking-[0.08em]"
                    aria-invalid={Boolean(error)}
                    aria-describedby="vin-error"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={loading}
                    onClick={pasteVin}
                    aria-label={t("hero.pasteLabel")}
                    className="absolute right-2 top-1/2 z-10 h-10 w-10 -translate-y-1/2 text-slate-500 hover:text-blue-700 dark:text-slate-300 dark:hover:text-blue-200"
                  >
                    <ClipboardPaste
                      className="h-5 w-5 shrink-0"
                      aria-hidden="true"
                    />
                  </Button>
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="md:w-36"
                  disabled={loading}
                  icon={
                    loading ? (
                      <Spinner />
                    ) : (
                      <Search className="h-5 w-5" aria-hidden="true" />
                    )
                  }
                >
                  {loading ? t("hero.searching") : t("common.search")}
                </Button>
              </div>
              <div className="mt-3 min-h-10 px-1 sm:min-h-6" aria-live="polite">
                <p
                  id="vin-error"
                  className={`text-sm font-semibold leading-5 ${
                    error
                      ? "text-red-600 dark:text-red-300"
                      : "text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {error || t("hero.pasteHint")}
                </p>
              </div>
            </form>
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
              <p className="mt-2 font-mono text-sm font-bold text-slate-500 dark:text-slate-400">
                {result.vin}
              </p>
            </div>
            <Button type="button" size="lg" onClick={buySelected}>
              {t("common.buySelected")}
            </Button>
          </div>

          <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Badge>
              <CheckCircle2 className="h-4 w-4" />
              {t("home.badges.delivery")}
            </Badge>
            <Badge>
              <ShieldCheck className="h-4 w-4" />
              {t("home.badges.payment")}
            </Badge>
            <Badge>
              <Car className="h-4 w-4" />
              {t("home.badges.reports")}
            </Badge>
            <Badge>
              <Headphones className="h-4 w-4" />
              {t("home.badges.support")}
            </Badge>
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
              <h3 className="text-lg font-black text-slate-950 dark:text-white">
                {t("home.bundleTitle")}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                {t("home.bundleText")}
              </p>
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

function HeroImage() {
  const {
    props: { srcSet: mobileSrcSet, sizes: mobileSizes },
  } = getImageProps({
    src: "/assets/images/bannertel.jpg",
    alt: "",
    width: 2000,
    height: 3250,
    sizes: "100vw",
  });

  return (
    <picture className="absolute inset-0 block">
      <source
        media="(max-width: 767px)"
        srcSet={mobileSrcSet}
        sizes={mobileSizes}
      />
      <Image
        src="/assets/images/mashina-i-fon-vmeste.jpg"
        alt=""
        fill
        fetchPriority="high"
        loading="eager"
        sizes="100vw"
        className="object-cover object-center"
      />
    </picture>
  );
}
