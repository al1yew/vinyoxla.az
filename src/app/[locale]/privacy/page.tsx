import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { isLocale, type Locale } from "@/lib/i18n/routing";
import { createPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "az";
  return createPageMetadata({ locale, namespace: "privacy", path: "/privacy" });
}

export default async function PrivacyPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "az";
  const t = await getTranslations({ locale });

  return (
    <section className="container-shell py-10 sm:py-14">
      <SectionHeader title={t("legal.privacyTitle")} />
      <Card className="mx-auto mt-10 max-w-3xl p-6 text-base leading-8 text-slate-700 dark:text-slate-200">
        <p>{t("legal.privacyBody")}</p>
      </Card>
    </section>
  );
}
