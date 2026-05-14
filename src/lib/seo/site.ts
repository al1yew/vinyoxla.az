import type { Locale } from "@/lib/i18n/routing";

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://vinyoxla.az";

export const contact = {
  phoneDisplay: "+994 51 555 55 77",
  phoneHref: "tel:+994515555577",
  whatsapp: "https://wa.me/994515555577",
  address: "71A Hüseynqulu Sarabski küçəsi, AZ1022, Bakı",
  taxId: "1505094141",
  garantAutoUrl: "https://garantauto.az/",
  facebook: "https://www.facebook.com/garantauto.az",
  instagram: "https://www.instagram.com/garantauto.az/"
};

export const localizedPathnames = [
  "",
  "/login",
  "/checkout",
  "/account",
  "/payment/success",
  "/payment/error",
  "/about",
  "/reviews",
  "/privacy",
  "/terms"
] as const;

export function localizedUrl(locale: Locale, pathname = "") {
  const cleanPath = pathname === "/" ? "" : pathname;
  return `${siteUrl}/${locale}${cleanPath}`;
}
