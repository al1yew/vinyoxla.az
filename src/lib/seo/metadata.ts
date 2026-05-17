import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { locales, type Locale } from "@/lib/i18n/routing";
import { localizedUrl, siteUrl } from "./site";

type SeoKey =
  | "home"
  | "login"
  | "checkout"
  | "account"
  | "about"
  | "reviews"
  | "privacy"
  | "terms"
  | "paymentSuccess"
  | "paymentError";

export async function createPageMetadata({
  locale,
  namespace,
  path
}: {
  locale: Locale;
  namespace: SeoKey;
  path: string;
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: `seo.${namespace}` });
  const canonical = localizedUrl(locale, path);
  const noIndex = ["login", "checkout", "account", "paymentSuccess", "paymentError"].includes(namespace);

  return {
    metadataBase: new URL(siteUrl),
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
    icons: {
      icon: [
        {
          url: "/assets/images/icons8-car-96.png",
          sizes: "96x96",
          type: "image/png"
        }
      ],
      apple: [
        {
          url: "/assets/images/icons8-car-96.png",
          sizes: "96x96",
          type: "image/png"
        }
      ]
    },
    alternates: {
      canonical,
      languages: Object.fromEntries([
        ...locales.map((currentLocale) => [currentLocale, localizedUrl(currentLocale, path)]),
        ["x-default", localizedUrl("az", path)]
      ])
    },
    openGraph: {
      type: "website",
      locale,
      url: canonical,
      siteName: "vinyoxla.az",
      title: t("title"),
      description: t("description"),
      images: [
        {
          url: "/assets/images/fotkaOG-min.jpg",
          width: 1200,
          height: 630,
          alt: "vinyoxla.az VIN report service"
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: ["/assets/images/fotkaOG-min.jpg"]
    },
    robots: {
      index: !noIndex,
      follow: true,
      googleBot: {
        index: !noIndex,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1
      }
    }
  };
}
