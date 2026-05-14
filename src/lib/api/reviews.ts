import { mockRequest } from "./client";
import { mockReviewsList, mockSubmitReview } from "./mock";
import type { ApiContext, Review } from "./types";

export function getReviews(context: ApiContext) {
  return mockRequest<Review[]>({
    locale: context.locale,
    url: "/reviews",
    factory: () => mockReviewsList()
  });
}

export function submitReview(input: Pick<Review, "name" | "rating" | "comment">, context: ApiContext) {
  return mockRequest<Review>({
    locale: context.locale,
    url: "/reviews",
    method: "POST",
    data: input,
    factory: () => mockSubmitReview(input)
  });
}
