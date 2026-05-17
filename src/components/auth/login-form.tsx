"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { sendOtp, verifyOtp } from "@/lib/api/auth";
import type { Locale } from "@/lib/i18n/routing";
import { otpSchema, phoneSchema } from "@/lib/validation/schemas";
import { normalizeApiError } from "@/lib/api/client";
import { digitsOnly, formatAzPhone, toE164AzPhone } from "@/lib/utils/format";
import { readPendingPurchase } from "@/lib/utils/pending-purchase";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

export function LoginForm({ locale }: { locale: Locale }) {
  const t = useTranslations();
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSendCode(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    const digits = digitsOnly(phone);
    const parsed = phoneSchema.safeParse(digits);

    if (!parsed.success) {
      setError(t("auth.invalidPhone"));
      return;
    }

    setLoading(true);

    try {
      await sendOtp(toE164AzPhone(digits), { locale });
      setStep("otp");
      setMessage(t("auth.codeSent"));
    } catch (apiError) {
      setError(normalizeApiError(apiError).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const digits = digitsOnly(phone);
    const parsedPhone = phoneSchema.safeParse(digits);
    const parsedOtp = otpSchema.safeParse(otp);

    if (!parsedPhone.success) {
      setError(t("auth.invalidPhone"));
      return;
    }

    if (!parsedOtp.success) {
      setError(t("auth.invalidOtp"));
      return;
    }

    setLoading(true);

    try {
      const response = await verifyOtp(toE164AzPhone(digits), parsedOtp.data, {
        locale,
      });
      await fetch("/api/auth/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: response.token,
          phone: response.user.phone,
        }),
      });

      const pending = readPendingPurchase();
      router.replace(pending ? `/${locale}/checkout` : `/${locale}/account`);
      router.refresh();
    } catch (apiError) {
      setError(normalizeApiError(apiError).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="mx-auto w-full max-w-xl p-5 sm:p-7">
      <div className="mb-6 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 text-white">
          <Phone className="h-6 w-6" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-black text-slate-950 dark:text-white">
          {t("auth.title")}
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
          {t("auth.subtitle")}
        </p>
      </div>

      {step === "phone" ? (
        <form onSubmit={handleSendCode} className="grid gap-4">
          <label
            className="text-sm font-bold text-slate-700 dark:text-slate-200"
            htmlFor="phone"
          >
            {t("auth.phoneLabel")}
          </label>
          <div className="flex rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-white/8">
            <span className="flex h-12 items-center border-r border-slate-200 px-4 text-[16px] font-bold text-slate-700 dark:border-white/10 dark:text-slate-100">
              +994
            </span>
            <Input
              id="phone"
              value={formatAzPhone(phone)}
              onChange={(event) =>
                setPhone(digitsOnly(event.target.value).slice(0, 9))
              }
              placeholder={t("auth.phonePlaceholder")}
              inputMode="numeric"
              autoComplete="tel-national"
              className="rounded-none border-0 bg-transparent"
            />
          </div>
          <Button
            type="submit"
            size="lg"
            disabled={loading}
            icon={
              loading ? (
                <Spinner />
              ) : (
                <Phone className="h-5 w-5" aria-hidden="true" />
              )
            }
          >
            {loading ? t("auth.sendingCode") : t("auth.sendCode")}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerify} className="grid gap-4">
          <label
            className="text-sm font-bold text-slate-700 dark:text-slate-200"
            htmlFor="otp"
          >
            {t("auth.otpLabel")}
          </label>
          <Input
            id="otp"
            value={otp}
            onChange={(event) =>
              setOtp(digitsOnly(event.target.value).slice(0, 4))
            }
            placeholder={t("auth.otpPlaceholder")}
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="one-time-code"
            maxLength={4}
            className="text-center text-xl font-black tracking-[0.5em]"
          />
          <Button
            type="submit"
            size="lg"
            disabled={loading}
            icon={
              loading ? (
                <Spinner />
              ) : (
                <KeyRound className="h-5 w-5" aria-hidden="true" />
              )
            }
          >
            {loading ? t("auth.verifying") : t("auth.verify")}
          </Button>
        </form>
      )}

      {message ? (
        <Alert tone="success" className="mt-5">
          {message}
        </Alert>
      ) : null}
      {error ? (
        <Alert tone="error" className="mt-5">
          {error}
        </Alert>
      ) : null}
    </Card>
  );
}
