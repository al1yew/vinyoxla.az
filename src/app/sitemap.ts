import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/routing";
import { localizedPathnames, localizedUrl } from "@/lib/seo/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return locales.flatMap((locale) =>
    localizedPathnames.map((pathname) => ({
      url: localizedUrl(locale, pathname),
      lastModified,
      changeFrequency: pathname === "" ? "daily" : "weekly",
      priority: pathname === "" ? 1 : 0.7,
      alternates: {
        languages: Object.fromEntries([
          ...locales.map((currentLocale) => [currentLocale, localizedUrl(currentLocale, pathname)]),
          ["x-default", localizedUrl("az", pathname)]
        ])
      }
    }))
  );
}
