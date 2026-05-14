import createMiddleware from "next-intl/middleware";
import { defaultLocale, locales } from "@/lib/i18n/routing";

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always"
});

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"]
};
