import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { getAuthSession, getPendingPurchaseCookie } from "@/lib/auth/session";
import { isLocale, type Locale } from "@/lib/i18n/routing";
import { createPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "az";
  return createPageMetadata({ locale, namespace: "login", path: "/login" });
}

export default async function LoginPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "az";
  const [session, pending] = await Promise.all([getAuthSession(), getPendingPurchaseCookie()]);

  if (session) {
    redirect(pending ? `/${locale}/checkout` : `/${locale}/account`);
  }

  return (
    <section className="container-shell min-h-[calc(100vh-72px)] py-12 sm:py-18">
      <LoginForm locale={locale} />
    </section>
  );
}
