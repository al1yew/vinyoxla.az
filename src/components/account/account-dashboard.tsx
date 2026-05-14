"use client";

import { useEffect, useState } from "react";
import { ExternalLink, Filter, MessageCircle, Plus, Wallet } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { createTopUp } from "@/lib/api/balance";
import { getCurrentUser } from "@/lib/api/auth";
import { getReports } from "@/lib/api/reports";
import type { Locale } from "@/lib/i18n/routing";
import type { PaginatedReports, Report, ReportFilters, ReportProductType, ReportStatus, User } from "@/lib/api/types";
import { reportFiltersSchema, topUpAmountSchema } from "@/lib/validation/schemas";
import { normalizeApiError } from "@/lib/api/client";
import { contact } from "@/lib/seo/site";
import { formatDate, formatMoney, normalizeVin } from "@/lib/utils/format";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";

const pageSizes = [25, 50, 75, 100, 200] as const;

export function AccountDashboard({ locale, phone }: { locale: Locale; phone: string }) {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [reports, setReports] = useState<PaginatedReports | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [topUpOpen, setTopUpOpen] = useState(false);
  const [filters, setFilters] = useState<ReportFilters>({
    type: "all",
    status: "all",
    sortBy: "date",
    sortDirection: "desc",
    page: 1,
    pageSize: 25
  });

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const parsed = reportFiltersSchema.parse(filters);
        const [nextUser, nextReports] = await Promise.all([
          getCurrentUser(phone, { locale }),
          getReports(parsed, { locale })
        ]);

        if (active) {
          setUser(nextUser);
          setReports(nextReports);
        }
      } catch (apiError) {
        if (active) {
          setError(normalizeApiError(apiError).message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [filters, locale, phone]);

  function updateFilter<Key extends keyof ReportFilters>(key: Key, value: ReportFilters[Key]) {
    setFilters((current) => ({
      ...current,
      [key]: value,
      page: key === "page" ? Number(value) : 1
    }));
  }

  return (
    <div className="grid gap-6">
      {searchParams.get("success") ? (
        <Alert tone="success">
          {t("account.successNotice")}
        </Alert>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-[1fr_0.55fr]">
        <Card className="p-5 sm:p-6">
          <Badge>{t("nav.account")}</Badge>
          <h1 className="mt-4 text-3xl font-black text-slate-950 dark:text-white">{t("account.title")}</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{t("account.subtitle")}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <InfoTile label={t("account.phone")} value={phone} />
            <InfoTile label={t("common.balance")} value={user ? formatMoney(user.balance) : t("common.loading")} />
          </div>
        </Card>

        <Card className="flex flex-col justify-between p-5 sm:p-6">
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Wallet className="h-6 w-6" aria-hidden="true" />
            </div>
            <h2 className="mt-4 text-xl font-black text-slate-950 dark:text-white">{t("account.topUp")}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{t("account.topUpNote")}</p>
          </div>
          <Button type="button" className="mt-5 w-full" onClick={() => setTopUpOpen(true)} icon={<Plus className="h-5 w-5" />}>
            {t("account.topUp")}
          </Button>
        </Card>
      </div>

      <Card className="p-5 sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-950 dark:text-white">{t("account.reportsTitle")}</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{t("account.reportsSubtitle")}</p>
          </div>
          {loading ? <Spinner className="text-blue-600" /> : null}
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-6">
          <FilterField label={t("account.vinSearch")}>
            <Input
              value={filters.vin || ""}
              onChange={(event) => updateFilter("vin", normalizeVin(event.target.value))}
              placeholder={t("common.vin")}
            />
          </FilterField>
          <FilterField label={t("account.reportType")}>
            <Select value={filters.type} onChange={(event) => updateFilter("type", event.target.value as ReportProductType | "all")}>
              <option value="all">{t("common.all")}</option>
              <option value="carfax">{t("home.products.carfax.title")}</option>
              <option value="autocheck">{t("home.products.autocheck.title")}</option>
            </Select>
          </FilterField>
          <FilterField label={t("account.dateFrom")}>
            <Input type="date" value={filters.dateFrom || ""} onChange={(event) => updateFilter("dateFrom", event.target.value)} />
          </FilterField>
          <FilterField label={t("account.dateTo")}>
            <Input type="date" value={filters.dateTo || ""} onChange={(event) => updateFilter("dateTo", event.target.value)} />
          </FilterField>
          <FilterField label={t("common.status")}>
            <Select value={filters.status} onChange={(event) => updateFilter("status", event.target.value as ReportStatus | "all")}>
              <option value="all">{t("common.all")}</option>
              <option value="success">{t("account.statuses.success")}</option>
              <option value="failed">{t("account.statuses.failed")}</option>
              <option value="pending">{t("account.statuses.pending")}</option>
            </Select>
          </FilterField>
          <FilterField label={t("account.pageSize")}>
            <Select value={filters.pageSize} onChange={(event) => updateFilter("pageSize", Number(event.target.value) as ReportFilters["pageSize"])}>
              {pageSizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </Select>
          </FilterField>
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <FilterField label={t("account.sortBy")}>
            <Select value={filters.sortBy} onChange={(event) => updateFilter("sortBy", event.target.value as ReportFilters["sortBy"])}>
              <option value="date">{t("account.sort.date")}</option>
              <option value="vin">{t("account.sort.vin")}</option>
              <option value="type">{t("account.sort.type")}</option>
            </Select>
          </FilterField>
          <FilterField label={t("account.sortDirection")}>
            <Select value={filters.sortDirection} onChange={(event) => updateFilter("sortDirection", event.target.value as ReportFilters["sortDirection"])}>
              <option value="desc">{t("account.sort.desc")}</option>
              <option value="asc">{t("account.sort.asc")}</option>
            </Select>
          </FilterField>
        </div>

        {error ? (
          <Alert tone="error" className="mt-5">
            {error}
          </Alert>
        ) : null}

        <div className="mt-6">
          {reports && reports.items.length > 0 ? (
            <>
              <ReportsTable reports={reports.items} locale={locale} />
              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {t("common.page")} {reports.page} / {reports.totalPages}
                </p>
                <div className="flex gap-2">
                  <Button type="button" variant="secondary" disabled={reports.page <= 1} onClick={() => updateFilter("page", reports.page - 1)}>
                    {t("common.previous")}
                  </Button>
                  <Button type="button" variant="secondary" disabled={reports.page >= reports.totalPages} onClick={() => updateFilter("page", reports.page + 1)}>
                    {t("common.next")}
                  </Button>
                </div>
              </div>
            </>
          ) : loading ? null : (
            <EmptyState title={t("account.noReports")} />
          )}
        </div>
      </Card>

      <TopUpModal locale={locale} open={topUpOpen} onClose={() => setTopUpOpen(false)} />
    </div>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-100 p-4 dark:bg-slate-950/50">
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 font-black text-slate-950 dark:text-white">{value}</p>
    </div>
  );
}

function FilterField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
      {label}
      {children}
    </label>
  );
}

function ReportsTable({ reports, locale }: { reports: Report[]; locale: Locale }) {
  const t = useTranslations();

  return (
    <>
      <div className="hidden overflow-hidden rounded-lg border border-slate-200 dark:border-white/10 lg:block">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-slate-100 text-xs uppercase tracking-[0.12em] text-slate-500 dark:bg-white/8 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3">{t("common.vin")}</th>
              <th className="px-4 py-3">{t("common.type")}</th>
              <th className="px-4 py-3">{t("common.date")}</th>
              <th className="px-4 py-3">{t("common.price")}</th>
              <th className="px-4 py-3">{t("common.status")}</th>
              <th className="px-4 py-3">{t("common.open")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-white/10">
            {reports.map((report) => (
              <ReportRow key={report.id} report={report} locale={locale} />
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid gap-3 lg:hidden">
        {reports.map((report) => (
          <ReportCard key={report.id} report={report} locale={locale} />
        ))}
      </div>
    </>
  );
}

function ReportRow({ report, locale }: { report: Report; locale: Locale }) {
  const t = useTranslations();

  return (
    <tr className="bg-white dark:bg-transparent">
      <td className="px-4 py-4 font-mono font-bold text-slate-950 dark:text-white">{report.vin}</td>
      <td className="px-4 py-4 text-slate-700 dark:text-slate-200">{t(`home.products.${report.type}.title`)}</td>
      <td className="px-4 py-4 text-slate-700 dark:text-slate-200">{formatDate(report.purchaseDate, locale)}</td>
      <td className="px-4 py-4 font-bold text-slate-950 dark:text-white">{formatMoney(report.price)}</td>
      <td className="px-4 py-4"><StatusBadge status={report.status} /></td>
      <td className="px-4 py-4"><ReportAction report={report} /></td>
    </tr>
  );
}

function ReportCard({ report, locale }: { report: Report; locale: Locale }) {
  const t = useTranslations();

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono font-black text-slate-950 dark:text-white">{report.vin}</p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{t(`home.products.${report.type}.title`)}</p>
        </div>
        <StatusBadge status={report.status} />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <InfoTile label={t("common.date")} value={formatDate(report.purchaseDate, locale)} />
        <InfoTile label={t("common.price")} value={formatMoney(report.price)} />
      </div>
      <div className="mt-4">
        <ReportAction report={report} />
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: ReportStatus }) {
  const t = useTranslations();
  const styles = {
    success: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-100",
    failed: "border-red-200 bg-red-50 text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-100",
    pending: "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-100"
  };

  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${styles[status]}`}>{t(`account.statuses.${status}`)}</span>;
}

function ReportAction({ report }: { report: Report }) {
  const t = useTranslations();

  if (report.status === "failed") {
    return (
      <a href={contact.whatsapp} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-800 dark:text-blue-300">
        <MessageCircle className="h-4 w-4" aria-hidden="true" />
        {t("common.contactSupport")}
      </a>
    );
  }

  return (
    <a
      href={report.reportUrl || "#"}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center gap-2 text-sm font-bold ${
        report.status === "pending"
          ? "pointer-events-none text-slate-400"
          : "text-blue-700 hover:text-blue-800 dark:text-blue-300"
      }`}
    >
      <ExternalLink className="h-4 w-4" aria-hidden="true" />
      {t("account.openReport")}
    </a>
  );
}

function TopUpModal({ locale, open, onClose }: { locale: Locale; open: boolean; onClose: () => void }) {
  const t = useTranslations();
  const [amount, setAmount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const parsed = topUpAmountSchema.safeParse(amount);

    if (!parsed.success) {
      setError(t("account.invalidAmount"));
      return;
    }

    setLoading(true);

    try {
      const response = await createTopUp(parsed.data, { locale });
      window.location.href = response.paymentUrl;
    } catch (apiError) {
      setError(normalizeApiError(apiError).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} title={t("account.topUpTitle")} onClose={onClose}>
      <form onSubmit={submit} className="grid gap-4">
        <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{t("account.topUpNote")}</p>
        <div className="grid grid-cols-3 gap-2">
          {[10, 20, 50].map((preset) => (
            <Button key={preset} type="button" variant={amount === preset ? "primary" : "secondary"} onClick={() => setAmount(preset)}>
              {formatMoney(preset)}
            </Button>
          ))}
        </div>
        <label className="grid gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
          {t("account.customAmount")}
          <Input
            value={String(amount)}
            onChange={(event) => setAmount(Number(event.target.value.replace(/\D/g, "")))}
            inputMode="numeric"
          />
        </label>
        {error ? <Alert tone="error">{error}</Alert> : null}
        <Button type="submit" size="lg" disabled={loading} icon={loading ? <Spinner /> : <Wallet className="h-5 w-5" />}>
          {loading ? t("account.topUpLoading") : t("account.confirmTopUp")}
        </Button>
      </form>
    </Modal>
  );
}
