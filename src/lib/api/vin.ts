import { mockRequest } from "./client";
import { mockVinSearch } from "./mock";
import type { ApiContext, VinSearchResult } from "./types";

export function searchVin(vin: string, context: ApiContext) {
  return mockRequest<VinSearchResult>({
    locale: context.locale,
    url: `/vin/${vin}`,
    factory: () => mockVinSearch(vin, context.locale)
  });
}
