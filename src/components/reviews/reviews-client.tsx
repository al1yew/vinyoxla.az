"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { useTranslations } from "next-intl";
import { getReviews, submitReview } from "@/lib/api/reviews";
import type { Locale } from "@/lib/i18n/routing";
import type { Review } from "@/lib/api/types";
import { reviewSchema } from "@/lib/validation/schemas";
import { normalizeApiError } from "@/lib/api/client";
import { formatDate } from "@/lib/utils/format";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";

export function ReviewsClient({ locale }: { locale: Locale }) {
  const t = useTranslations();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const data = await getReviews({ locale });

        if (active) {
          setReviews(data);
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
  }, [locale]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const parsed = reviewSchema.safeParse({ name, rating, comment });

    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      setError(
        firstIssue.path[0] === "name"
          ? t("reviews.invalidName")
          : firstIssue.path[0] === "rating"
            ? t("reviews.invalidRating")
            : t("reviews.invalidComment")
      );
      return;
    }

    setSubmitting(true);

    try {
      const review = await submitReview(parsed.data, { locale });
      setReviews((current) => [review, ...current]);
      setName("");
      setRating(5);
      setComment("");
      setSuccess(t("reviews.success"));
    } catch (apiError) {
      setError(normalizeApiError(apiError).message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid gap-7 lg:grid-cols-[1fr_0.72fr]">
      <div className="grid gap-4">
        {loading ? (
          <Card className="p-8 text-center">
            <Spinner className="mx-auto h-8 w-8 text-blue-600" />
            <p className="mt-4 text-sm font-semibold text-slate-700 dark:text-slate-200">{t("common.loading")}</p>
          </Card>
        ) : (
          reviews.map((review) => (
            <Card key={review.id} className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-black text-slate-950 dark:text-white">{review.name}</h2>
                  <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {formatDate(review.createdAt, locale)}
                  </p>
                </div>
                <Stars rating={review.rating} />
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-700 dark:text-slate-200">{review.comment}</p>
            </Card>
          ))
        )}
      </div>

      <Card className="h-fit p-5 sm:p-6">
        <h2 className="text-xl font-black text-slate-950 dark:text-white">{t("reviews.formTitle")}</h2>
        <form onSubmit={submit} className="mt-5 grid gap-4">
          <label className="grid gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
            {t("reviews.name")}
            <Input value={name} onChange={(event) => setName(event.target.value)} />
          </label>
          <label className="grid gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
            {t("reviews.rating")}
            <Select value={rating} onChange={(event) => setRating(Number(event.target.value))}>
              {[5, 4, 3, 2, 1].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </Select>
          </label>
          <label className="grid gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
            {t("reviews.comment")}
            <textarea
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              className="focus-ring min-h-32 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-[16px] text-slate-950 outline-none transition focus:border-blue-500 dark:border-white/10 dark:bg-white/8 dark:text-white"
            />
          </label>
          {error ? <Alert tone="error">{error}</Alert> : null}
          {success ? <Alert tone="success">{success}</Alert> : null}
          <Button type="submit" size="lg" disabled={submitting} icon={submitting ? <Spinner /> : undefined}>
            {submitting ? t("reviews.submitting") : t("reviews.submit")}
          </Button>
        </form>
      </Card>
    </div>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1 text-amber-400">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star key={index} className={`h-4 w-4 ${index < rating ? "fill-current" : "text-slate-300"}`} aria-hidden="true" />
      ))}
    </div>
  );
}
