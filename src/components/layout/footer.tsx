import Link from "next/link";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/lib/i18n/routing";
import { contact } from "@/lib/seo/site";

export async function Footer({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale });

  return (
    <footer className="mt-20 border-t border-slate-200 bg-white/70 py-10 dark:border-white/10 dark:bg-slate-950/50">
      <div className="container-shell grid gap-8 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <Link href={`/${locale}`} className="text-xl font-black text-slate-950 dark:text-white">
            {t("brand.name")}
          </Link>
          <p className="mt-3 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-300">{t("footer.description")}</p>
          <a
            className="mt-4 inline-flex text-sm font-semibold text-blue-700 hover:text-blue-800 dark:text-blue-300"
            href={t("brand.developerUrl")}
            target="_blank"
            rel="noreferrer"
          >
            {t("brand.developerCredit")}
          </a>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">{t("footer.linksTitle")}</h2>
          <div className="mt-4 grid gap-2 text-sm">
            <Link href={`/${locale}/about`} className="text-slate-700 hover:text-blue-700 dark:text-slate-200 dark:hover:text-blue-200">
              {t("nav.about")}
            </Link>
            <Link href={`/${locale}/reviews`} className="text-slate-700 hover:text-blue-700 dark:text-slate-200 dark:hover:text-blue-200">
              {t("nav.reviews")}
            </Link>
            <Link href={`/${locale}/privacy`} className="text-slate-700 hover:text-blue-700 dark:text-slate-200 dark:hover:text-blue-200">
              {t("nav.privacy")}
            </Link>
            <Link href={`/${locale}/terms`} className="text-slate-700 hover:text-blue-700 dark:text-slate-200 dark:hover:text-blue-200">
              {t("nav.terms")}
            </Link>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">{t("footer.contactTitle")}</h2>
          <div className="mt-4 grid gap-2 text-sm">
            <a href={contact.phoneHref} className="font-semibold text-slate-800 hover:text-blue-700 dark:text-slate-100 dark:hover:text-blue-200">
              {t("footer.phoneLabel")}
            </a>
            <a href={contact.whatsapp} target="_blank" rel="noreferrer" className="font-semibold text-blue-700 hover:text-blue-800 dark:text-blue-300">
              {t("footer.whatsappLabel")}
            </a>
            <p className="text-slate-600 dark:text-slate-300">{t("about.address")}</p>
          </div>
          <div className="mt-5 flex items-center gap-3" aria-label={t("footer.paymentTitle")}>
            <Image src="/assets/images/visa-card-logo-9.png" alt="Visa" width={78} height={24} />
            <Image src="/assets/images/mastercard-logo.png" alt="Mastercard" width={30} height={24} />
          </div>
        </div>
      </div>
      <p className="container-shell mt-8 text-xs text-slate-500 dark:text-slate-400">
        © {new Date().getFullYear()} {t("brand.owner")}. {t("footer.rights")}
      </p>
    </footer>
  );
}
