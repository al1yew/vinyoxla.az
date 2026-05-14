import { mockRequest } from "./client";
import { mockTopUp } from "./mock";
import type { ApiContext, TopUpResponse } from "./types";

export function createTopUp(amount: number, context: ApiContext) {
  return mockRequest<TopUpResponse>({
    locale: context.locale,
    url: "/balance/top-up",
    method: "POST",
    data: { amount },
    factory: () => mockTopUp(context.locale)
  });
}
