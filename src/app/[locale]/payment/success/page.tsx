import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CheckCircle2 } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { isLocale, type Locale } from "@/lib/i18n/routing";
import { createPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "az";
  return createPageMetadata({ locale, namespace: "paymentSuccess", path: "/payment/success" });
}

export default async function PaymentSuccessPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "az";
  const t = await getTranslations({ locale });

  return (
    <section className="container-shell flex min-h-[calc(100vh-72px)] items-center justify-center py-12">
      <Card className="max-w-xl p-7 text-center">
        <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-500" aria-hidden="true" />
        <h1 className="mt-5 text-3xl font-black text-slate-950 dark:text-white">{t("payment.successTitle")}</h1>
        <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">{t("payment.successText")}</p>
        <ButtonLink href={`/${locale}/account?success=1`} className="mt-6">
          {t("payment.reportsButton")}
        </ButtonLink>
      </Card>
    </section>
  );
}
