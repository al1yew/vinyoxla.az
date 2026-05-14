import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ReviewsClient } from "@/components/reviews/reviews-client";
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
  return createPageMetadata({ locale, namespace: "reviews", path: "/reviews" });
}

export default async function ReviewsPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "az";
  const t = await getTranslations({ locale });

  return (
    <section className="container-shell py-10 sm:py-14">
      <SectionHeader title={t("reviews.title")} text={t("reviews.subtitle")} />
      <div className="mt-10">
        <ReviewsClient locale={locale} />
      </div>
    </section>
  );
}
