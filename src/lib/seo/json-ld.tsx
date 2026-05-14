import type { Locale } from "@/lib/i18n/routing";
import { contact, localizedUrl, siteUrl } from "./site";

export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data)
      }}
    />
  );
}

export function organizationJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "vinyoxla.az",
    legalName: "Garant Auto MMC",
    url: localizedUrl(locale),
    logo: `${siteUrl}/assets/images/fotkaOG-min.jpg`,
    telephone: contact.phoneDisplay,
    taxID: contact.taxId,
    address: {
      "@type": "PostalAddress",
      streetAddress: "71A Hüseynqulu Sarabski küçəsi",
      addressLocality: "Bakı",
      postalCode: "AZ1022",
      addressCountry: "AZ"
    },
    sameAs: [contact.facebook, contact.instagram, contact.garantAutoUrl]
  };
}

export function websiteJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "vinyoxla.az",
    url: localizedUrl(locale),
    inLanguage: locale,
    potentialAction: {
      "@type": "SearchAction",
      target: `${localizedUrl(locale)}?vin={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };
}

export function localBusinessJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    name: "Garant Auto MMC",
    url: localizedUrl(locale, "/about"),
    image: `${siteUrl}/assets/images/fotkaOG-min.jpg`,
    telephone: contact.phoneDisplay,
    address: {
      "@type": "PostalAddress",
      streetAddress: "71A Hüseynqulu Sarabski küçəsi",
      addressLocality: "Bakı",
      postalCode: "AZ1022",
      addressCountry: "AZ"
    }
  };
}

export function serviceJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "VIN report checking",
    provider: {
      "@type": "Organization",
      name: "vinyoxla.az"
    },
    areaServed: {
      "@type": "Country",
      name: "Azerbaijan"
    },
    serviceType: "Vehicle history report",
    url: localizedUrl(locale)
  };
}
