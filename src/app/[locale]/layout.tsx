import type { ReactNode } from "react";
import localFont from "next/font/local";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { getAuthSession } from "@/lib/auth/session";
import { isLocale, locales, type Locale } from "@/lib/i18n/routing";
import { JsonLd, organizationJsonLd, websiteJsonLd } from "@/lib/seo/json-ld";
import { isThemePreference, themeCookieName } from "@/lib/theme";
import "../globals.css";

const montserrat = localFont({
  src: [
    {
      path: "../../../public/assets/fonts/Montserrat-VariableFont_wght.ttf",
      style: "normal",
    },
    {
      path: "../../../public/assets/fonts/Montserrat-Italic-VariableFont_wght.ttf",
      style: "italic",
    },
  ],
  variable: "--font-montserrat",
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f6dff",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;

  if (!isLocale(rawLocale)) {
    notFound();
  }

  const locale: Locale = rawLocale;
  const messages = (await import(`../../../messages/${locale}.json`)).default;
  const session = await getAuthSession();
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get(themeCookieName)?.value;
  const theme = isThemePreference(themeCookie) ? themeCookie : null;

  return (
    <html
      lang={locale}
      className={`${montserrat.variable} ${montserrat.className}${theme ? ` ${theme}` : ""}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header locale={locale} isAuthenticated={Boolean(session)} initialTheme={theme} />
          <main>{children}</main>
          <Footer locale={locale} />
        </NextIntlClientProvider>
        <JsonLd data={[organizationJsonLd(locale), websiteJsonLd(locale)]} />
      </body>
    </html>
  );
}
