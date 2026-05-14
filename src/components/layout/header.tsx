"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Languages, LogOut, Menu, Moon, Sun, User, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { localeLabels, locales, type Locale } from "@/lib/i18n/routing";
import { Button } from "@/components/ui/button";

export function Header({ locale, isAuthenticated }: { locale: Locale; isAuthenticated: boolean }) {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const dark = useSyncExternalStore(subscribeTheme, getThemeSnapshot, () => false);

  useEffect(() => {
    const saved = window.localStorage.getItem("vinyoxla_theme");
    const shouldUseDark = saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", shouldUseDark);
    window.dispatchEvent(new Event("vinyoxla-theme"));
  }, []);

  function toggleTheme() {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    window.localStorage.setItem("vinyoxla_theme", next ? "dark" : "light");
    window.dispatchEvent(new Event("vinyoxla-theme"));
  }

  async function logout() {
    await fetch("/api/auth/session", {
      method: "DELETE"
    });
    router.replace(`/${locale}`);
    router.refresh();
  }

  const nav = (
    <>
      <Link href={`/${locale}/about`} className="text-sm font-semibold text-slate-700 transition hover:text-blue-700 dark:text-slate-200 dark:hover:text-blue-200">
        {t("nav.about")}
      </Link>
      <Link href={`/${locale}/reviews`} className="text-sm font-semibold text-slate-700 transition hover:text-blue-700 dark:text-slate-200 dark:hover:text-blue-200">
        {t("nav.reviews")}
      </Link>
    </>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-white/50 bg-white/82 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/78">
      <div className="container-shell flex h-18 items-center justify-between gap-4">
        <Link href={`/${locale}`} className="flex items-center gap-3" aria-label={t("brand.name")}>
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-sm font-black text-white shadow-lg shadow-blue-600/20">
            VIN
          </span>
          <span className="text-lg font-black text-slate-950 dark:text-white">{t("brand.name")}</span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label={t("common.menu")}>
          {nav}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <LanguageSwitcher locale={locale} pathname={pathname} />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={dark ? t("common.lightMode") : t("common.darkMode")}
          >
            {dark ? <Sun className="h-5 w-5" aria-hidden="true" /> : <Moon className="h-5 w-5" aria-hidden="true" />}
          </Button>
          {isAuthenticated ? (
            <>
              <Link
                href={`/${locale}/account`}
                className="focus-ring inline-flex h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10"
              >
                <User className="h-4 w-4" aria-hidden="true" />
                {t("nav.account")}
              </Link>
              <Button type="button" variant="secondary" size="sm" onClick={logout} icon={<LogOut className="h-4 w-4" aria-hidden="true" />}>
                {t("nav.logout")}
              </Button>
            </>
          ) : (
            <Link
              href={`/${locale}/login`}
              className="focus-ring inline-flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
            >
              {t("nav.login")}
            </Link>
          )}
        </div>

        <Button type="button" variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen((value) => !value)} aria-label={t("common.menu")}>
          {mobileOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
        </Button>
      </div>

      {mobileOpen ? (
        <div className="border-t border-slate-200 bg-white px-4 py-4 dark:border-white/10 dark:bg-slate-950 lg:hidden">
          <nav className="container-shell flex flex-col gap-4" aria-label={t("common.menu")}>
            {nav}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <LanguageSwitcher locale={locale} pathname={pathname} />
              <Button type="button" variant="secondary" size="icon" onClick={toggleTheme} aria-label={dark ? t("common.lightMode") : t("common.darkMode")}>
                {dark ? <Sun className="h-5 w-5" aria-hidden="true" /> : <Moon className="h-5 w-5" aria-hidden="true" />}
              </Button>
              {isAuthenticated ? (
                <>
                  <Link
                    href={`/${locale}/account`}
                    className="focus-ring inline-flex h-10 items-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white"
                  >
                    <User className="h-4 w-4" aria-hidden="true" />
                    {t("nav.account")}
                  </Link>
                  <Button type="button" variant="secondary" size="sm" onClick={logout} icon={<LogOut className="h-4 w-4" aria-hidden="true" />}>
                    {t("nav.logout")}
                  </Button>
                </>
              ) : (
                <Link
                  href={`/${locale}/login`}
                  className="focus-ring inline-flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white"
                >
                  {t("nav.login")}
                </Link>
              )}
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

function LanguageSwitcher({ locale, pathname }: { locale: Locale; pathname: string }) {
  const t = useTranslations();

  return (
    <div className="flex h-10 items-center rounded-lg border border-slate-200 bg-white p-1 dark:border-white/10 dark:bg-white/8" aria-label={t("common.language")}>
      <Languages className="mx-2 h-4 w-4 text-blue-600 dark:text-blue-200" aria-hidden="true" />
      {locales.map((nextLocale) => (
        <Link
          key={nextLocale}
          href={switchLocalePath(pathname, nextLocale)}
          className={`rounded-md px-2.5 py-1.5 text-xs font-bold transition ${
            nextLocale === locale
              ? "bg-blue-600 text-white"
              : "text-slate-600 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10"
          }`}
        >
          {localeLabels[nextLocale]}
        </Link>
      ))}
    </div>
  );
}

function switchLocalePath(pathname: string, locale: Locale) {
  const parts = pathname.split("/");
  parts[1] = locale;
  return parts.join("/") || `/${locale}`;
}

function subscribeTheme(callback: () => void) {
  window.addEventListener("vinyoxla-theme", callback);
  return () => window.removeEventListener("vinyoxla-theme", callback);
}

function getThemeSnapshot() {
  return document.documentElement.classList.contains("dark");
}
