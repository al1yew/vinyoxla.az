import { mockRequest } from "./client";
import { mockReportsSearch } from "./mock";
import type { ApiContext, PaginatedReports, ReportFilters } from "./types";

export function getReports(filters: ReportFilters, context: ApiContext) {
  return mockRequest<PaginatedReports>({
    locale: context.locale,
    url: "/reports",
    method: "POST",
    data: filters,
    factory: () => mockReportsSearch(filters)
  });
}
