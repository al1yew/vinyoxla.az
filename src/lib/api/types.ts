import type { Locale } from "@/lib/i18n/routing";

export type { Locale };

export type Currency = "AZN";

export type ReportProductType = "carfax" | "autocheck";

export type ReportStatus = "success" | "failed" | "pending";

export type VinSearchProduct = {
  type: ReportProductType;
  title: string;
  description: string;
  records: number;
  price: number;
  currency: Currency;
  available: boolean;
};

export type VinSearchResult = {
  vin: string;
  vehicle: string;
  year: number;
  products: VinSearchProduct[];
};

export type CheckoutQuote = {
  vin: string;
  vehicle: string;
  year: number;
  selectedProducts: VinSearchProduct[];
  subtotal: number;
  discountAmount: number;
  total: number;
  currency: Currency;
  bundleSuggestion?: {
    productType: ReportProductType;
    message: string;
    discountPercent: number;
  };
};

export type PurchaseResponse = {
  status: "paid_from_balance" | "payment_required" | "failed";
  message?: string;
  paymentUrl?: string;
  orderId?: string;
};

export type User = {
  phone: string;
  balance: number;
  currency: Currency;
};

export type AuthResponse = {
  token: string;
  user: User;
};

export type Report = {
  id: string;
  vin: string;
  type: ReportProductType;
  purchaseDate: string;
  price: number;
  currency: Currency;
  status: ReportStatus;
  reportUrl?: string;
};

export type ReportFilters = {
  vin?: string;
  type?: ReportProductType | "all";
  status?: ReportStatus | "all";
  dateFrom?: string;
  dateTo?: string;
  sortBy: "date" | "vin" | "type";
  sortDirection: "asc" | "desc";
  page: number;
  pageSize: 25 | 50 | 75 | 100 | 200;
};

export type PaginatedReports = {
  items: Report[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type Review = {
  id: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export type TopUpResponse = {
  paymentUrl: string;
};

export type PendingPurchase = {
  vin: string;
  products: ReportProductType[];
};

export type ApiContext = {
  locale: Locale;
};

export type ApiError = {
  status: number;
  code: string;
  message: string;
  details?: unknown;
};
