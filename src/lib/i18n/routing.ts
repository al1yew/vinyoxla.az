export const locales = ["az", "en", "ru"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "az";

export const localeLabels: Record<Locale, string> = {
  az: "AZ",
  en: "EN",
  ru: "RU"
};

export function isLocale(value: string | undefined): value is Locale {
  return Boolean(value && locales.includes(value as Locale));
}
