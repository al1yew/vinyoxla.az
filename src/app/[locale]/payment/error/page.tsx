import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { AlertCircle, MessageCircle } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { isLocale, type Locale } from "@/lib/i18n/routing";
import { createPageMetadata } from "@/lib/seo/metadata";
import { contact } from "@/lib/seo/site";

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "az";
  return createPageMetadata({ locale, namespace: "paymentError", path: "/payment/error" });
}

export default async function PaymentErrorPage({
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
        <AlertCircle className="mx-auto h-14 w-14 text-red-500" aria-hidden="true" />
        <h1 className="mt-5 text-3xl font-black text-slate-950 dark:text-white">{t("payment.errorTitle")}</h1>
        <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">{t("payment.errorText")}</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <ButtonLink href={`/${locale}/checkout`} variant="primary">
            {t("payment.retryButton")}
          </ButtonLink>
          <ButtonLink href={contact.whatsapp} target="_blank" rel="noreferrer" variant="secondary" icon={<MessageCircle className="h-5 w-5" />}>
            {t("common.contactSupport")}
          </ButtonLink>
        </div>
      </Card>
    </section>
  );
}
