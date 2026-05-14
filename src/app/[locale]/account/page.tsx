import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AccountDashboard } from "@/components/account/account-dashboard";
import { getAuthSession } from "@/lib/auth/session";
import { isLocale, type Locale } from "@/lib/i18n/routing";
import { createPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "az";
  return createPageMetadata({ locale, namespace: "account", path: "/account" });
}

export default async function AccountPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "az";
  const session = await getAuthSession();

  if (!session) {
    redirect(`/${locale}/login`);
  }

  return (
    <section className="container-shell py-10 sm:py-14">
      <AccountDashboard locale={locale} phone={session.phone} />
    </section>
  );
}
