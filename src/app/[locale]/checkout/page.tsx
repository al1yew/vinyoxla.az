import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CheckoutClient } from "@/components/checkout/checkout-client";
import { getAuthSession, getPendingPurchaseCookie } from "@/lib/auth/session";
import type { PendingPurchase } from "@/lib/api/types";
import { isLocale, type Locale } from "@/lib/i18n/routing";
import { createPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "az";
  return createPageMetadata({ locale, namespace: "checkout", path: "/checkout" });
}

export default async function CheckoutPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "az";
  const [session, pendingCookie] = await Promise.all([getAuthSession(), getPendingPurchaseCookie()]);

  if (!session) {
    redirect(`/${locale}/login`);
  }

  if (!pendingCookie) {
    redirect(`/${locale}`);
  }

  const pending = pendingCookie as PendingPurchase;

  return (
    <section className="container-shell py-10 sm:py-14">
      <CheckoutClient locale={locale} phone={session.phone} initialPending={pending} />
    </section>
  );
}
