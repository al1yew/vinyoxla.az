import type { Locale } from "@/lib/i18n/routing";
import { sanitizeVinInput } from "@/lib/validation/vin";

export function formatMoney(amount: number, currency: "AZN" = "AZN") {
  return new Intl.NumberFormat("az-AZ", {
    style: "currency",
    currency,
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2
  }).format(amount);
}

export function formatDate(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "az" ? "az-AZ" : locale, {
    year: "numeric",
    month: "short",
    day: "2-digit"
  }).format(new Date(value));
}

export function normalizeVin(value: string) {
  return sanitizeVinInput(value);
}

export function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

export function formatAzPhone(value: string) {
  const digits = digitsOnly(value).slice(0, 9);
  const parts = [
    digits.slice(0, 2),
    digits.slice(2, 5),
    digits.slice(5, 7),
    digits.slice(7, 9)
  ].filter(Boolean);

  return parts.join(" ");
}

export function toE164AzPhone(value: string) {
  return `+994${digitsOnly(value).slice(0, 9)}`;
}
