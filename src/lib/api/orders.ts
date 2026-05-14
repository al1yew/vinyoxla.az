import { mockRequest } from "./client";
import { mockCheckoutQuote, mockPurchase } from "./mock";
import type { ApiContext, CheckoutQuote, PendingPurchase, PurchaseResponse } from "./types";

export function getCheckoutQuote(pending: PendingPurchase, context: ApiContext) {
  return mockRequest<CheckoutQuote>({
    locale: context.locale,
    url: "/orders/quote",
    method: "POST",
    data: pending,
    factory: () => mockCheckoutQuote(pending, context.locale)
  });
}

export function purchaseQuote(quote: CheckoutQuote, context: ApiContext) {
  return mockRequest<PurchaseResponse>({
    locale: context.locale,
    url: "/orders/purchase",
    method: "POST",
    data: quote,
    factory: () => mockPurchase(quote, context.locale)
  });
}
