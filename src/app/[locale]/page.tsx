import type { Metadata } from "next";
import { VinSearch } from "@/components/home/vin-search";
import { getAuthSession } from "@/lib/auth/session";
import { isLocale, type Locale } from "@/lib/i18n/routing";
import { JsonLd, serviceJsonLd } from "@/lib/seo/json-ld";
import { createPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "az";
  return createPageMetadata({ locale, namespace: "home", path: "" });
}

export default async function HomePage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "az";
  const session = await getAuthSession();

  return (
    <>
      <VinSearch locale={locale} isAuthenticated={Boolean(session)} />
      <JsonLd data={serviceJsonLd(locale)} />
    </>
  );
}
