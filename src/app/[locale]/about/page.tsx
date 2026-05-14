import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { MapPin, MessageCircle, Phone, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";
import { isLocale, type Locale } from "@/lib/i18n/routing";
import { JsonLd, localBusinessJsonLd } from "@/lib/seo/json-ld";
import { createPageMetadata } from "@/lib/seo/metadata";
import { contact } from "@/lib/seo/site";

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "az";
  return createPageMetadata({ locale, namespace: "about", path: "/about" });
}

export default async function AboutPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "az";
  const t = await getTranslations({ locale });

  return (
    <section className="container-shell py-10 sm:py-14">
      <SectionHeader title={t("about.title")} text={t("about.subtitle")} />

      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <Card className="p-5 sm:p-7">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 text-white">
            <ShieldCheck className="h-6 w-6" aria-hidden="true" />
          </div>
          <h2 className="mt-5 text-2xl font-black text-slate-950 dark:text-white">{t("about.ownerLine")}</h2>
          <div className="mt-5 grid gap-3 text-sm leading-6 text-slate-700 dark:text-slate-200">
            <p>{t("about.taxId")}</p>
            <p>{t("about.customOffers")}</p>
            <p>{t("about.body")}</p>
          </div>

          <div className="mt-6 rounded-lg bg-slate-100 p-5 dark:bg-slate-950/50">
            <h3 className="font-black text-slate-950 dark:text-white">{t("about.whyTitle")}</h3>
            <p className="mt-2 text-sm leading-7 text-slate-700 dark:text-slate-200">{t("about.whyText")}</p>
          </div>
        </Card>

        <div className="grid gap-5">
          <Card className="p-5 sm:p-6">
            <h2 className="text-xl font-black text-slate-950 dark:text-white">{t("footer.contactTitle")}</h2>
            <div className="mt-5 grid gap-4 text-sm text-slate-700 dark:text-slate-200">
              <div className="flex gap-3">
                <MapPin className="h-5 w-5 shrink-0 text-blue-600 dark:text-blue-300" aria-hidden="true" />
                <span>{t("about.address")}</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <ButtonLink href={contact.phoneHref} icon={<Phone className="h-5 w-5" aria-hidden="true" />}>
                  {t("about.call")}
                </ButtonLink>
                <ButtonLink href={contact.whatsapp} target="_blank" rel="noreferrer" variant="secondary" icon={<MessageCircle className="h-5 w-5" aria-hidden="true" />}>
                  {t("about.write")}
                </ButtonLink>
              </div>
            </div>
          </Card>

          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/8">
            <iframe
              title={t("about.address")}
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d877.7598151317006!2d49.83830650405541!3d40.38818137407406!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40307d16c427a84f%3A0xb26b8d650ec8e60f!2sGarant%20Auto!5e0!3m2!1sen!2saz!4v1746003654291!5m2!1sen!2saz"
              className="h-80 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>

      <JsonLd data={localBusinessJsonLd(locale)} />
    </section>
  );
}
