import { createApiError } from "./client";
import type {
  AuthResponse,
  CheckoutQuote,
  Locale,
  PaginatedReports,
  PendingPurchase,
  PurchaseResponse,
  Report,
  ReportFilters,
  ReportProductType,
  Review,
  TopUpResponse,
  User,
  VinSearchProduct,
  VinSearchResult
} from "./types";

const productCopy: Record<
  Locale,
  Record<ReportProductType, Pick<VinSearchProduct, "title" | "description">>
> = {
  az: {
    carfax: {
      title: "Carfax hesabatı",
      description: "ABŞ və Kanada bazarı üzrə servis, qəza, sahiblilik və qeydiyyat məlumatları."
    },
    autocheck: {
      title: "AutoCheck hesabatı",
      description: "Hərrac və tarixçə məlumatlarını müqayisəli görmək üçün əlavə mənbə."
    }
  },
  en: {
    carfax: {
      title: "Carfax report",
      description: "Service, accident, ownership and registration data for US and Canada vehicles."
    },
    autocheck: {
      title: "AutoCheck report",
      description: "An additional source for comparing auction and history information."
    }
  },
  ru: {
    carfax: {
      title: "Отчет Carfax",
      description: "Сервисные, аварийные, регистрационные данные и история владельцев."
    },
    autocheck: {
      title: "Отчет AutoCheck",
      description: "Дополнительный источник для сравнения аукционной и исторической информации."
    }
  }
};

const bundleMessages: Record<Locale, string> = {
  az: "Hər iki hesabatı al və 15% qənaət et.",
  en: "Buy both reports and save 15%.",
  ru: "Купите оба отчета и сэкономьте 15%."
};

const purchaseMessages: Record<Locale, { paid: string; payment: string; failed: string }> = {
  az: {
    paid: "Alış balansınızdan ödənildi.",
    payment: "Balans kifayət etmir. Bank ödəniş səhifəsinə yönləndirilirsiniz.",
    failed: "Alış tamamlanmadı."
  },
  en: {
    paid: "The purchase was paid from your balance.",
    payment: "Your balance is not enough. Redirecting to the bank payment page.",
    failed: "The purchase was not completed."
  },
  ru: {
    paid: "Покупка оплачена с вашего баланса.",
    payment: "Баланс недостаточен. Перенаправляем на страницу оплаты банка.",
    failed: "Покупка не завершена."
  }
};

const reviews: Review[] = [
  {
    id: "review-1",
    name: "Elvin",
    rating: 5,
    comment: "BMW almadan əvvəl hesabat aldım. Zədə tarixçəsini vaxtında gördüm.",
    createdAt: "2026-03-12T10:30:00.000Z"
  },
  {
    id: "review-2",
    name: "Nigar",
    rating: 5,
    comment: "VIN yoxlama prosesi çox rahat oldu, hesabatı hesabımda dərhal gördüm.",
    createdAt: "2026-02-18T14:10:00.000Z"
  },
  {
    id: "review-3",
    name: "Rashad",
    rating: 4,
    comment: "AutoCheck və Carfax birlikdə qərar verməyimə kömək etdi.",
    createdAt: "2026-01-24T08:45:00.000Z"
  }
];

const mockReports: Report[] = [
  createReport("1", "5UXTA6C09P9R07245", "carfax", "success", "2026-05-08T12:12:00.000Z", 35),
  createReport("2", "JTDKB20U383308629", "autocheck", "success", "2026-05-04T09:44:00.000Z", 25),
  createReport("3", "SALYK2FV0LA265634", "carfax", "pending", "2026-04-28T15:20:00.000Z", 35),
  createReport("4", "3MYDLBYV3HY161482", "autocheck", "failed", "2026-04-18T11:05:00.000Z", 25),
  createReport("5", "1FTEW1CP1MKD96923", "carfax", "success", "2026-04-12T16:22:00.000Z", 35),
  createReport("6", "3G1BE6SM9HS508140", "autocheck", "success", "2026-04-01T13:35:00.000Z", 25),
  createReport("7", "JTEABFAJ5RK010268", "carfax", "success", "2026-03-26T10:13:00.000Z", 35),
  createReport("8", "WBY73AW07NFN24767", "autocheck", "pending", "2026-03-19T17:55:00.000Z", 25),
  createReport("9", "KMHCT4AE4GU085008", "carfax", "success", "2026-03-11T08:31:00.000Z", 35),
  createReport("10", "4JGDF6EE7HA806197", "autocheck", "success", "2026-03-02T12:08:00.000Z", 25)
];

export function mockVinSearch(vin: string, locale: Locale): VinSearchResult {
  return {
    vin,
    vehicle: "BMW X3 xDrive30i",
    year: 2018,
    products: [
      {
        type: "carfax",
        ...productCopy[locale].carfax,
        records: 24,
        price: 35,
        currency: "AZN",
        available: true
      },
      {
        type: "autocheck",
        ...productCopy[locale].autocheck,
        records: 17,
        price: 25,
        currency: "AZN",
        available: true
      }
    ]
  };
}

export function mockSendOtp(phone: string) {
  if (phone.length < 13) {
    throw createApiError(422, "invalid_phone", "Telefon nömrəsi düzgün deyil.");
  }

  return {
    ok: true
  };
}

export function mockVerifyOtp(phone: string, otp: string): AuthResponse {
  if (!["1111", "1234"].includes(otp)) {
    throw createApiError(401, "invalid_otp", "OTP kodu yanlışdır.");
  }

  return {
    token: `mock-jwt-${phone}-${Date.now()}`,
    user: mockUser(phone)
  };
}

export function mockUser(phone = "+994515555577"): User {
  return {
    phone,
    balance: 20,
    currency: "AZN"
  };
}

export function mockCheckoutQuote(pending: PendingPurchase, locale: Locale): CheckoutQuote {
  const result = mockVinSearch(pending.vin, locale);
  const selectedProducts = result.products.filter((product) => pending.products.includes(product.type));
  const subtotal = selectedProducts.reduce((sum, product) => sum + product.price, 0);
  const hasBundle = selectedProducts.length === 2;
  const discountAmount = hasBundle ? roundMoney(subtotal * 0.15) : 0;
  const missingProduct = result.products.find((product) => !pending.products.includes(product.type));

  return {
    vin: result.vin,
    vehicle: result.vehicle,
    year: result.year,
    selectedProducts,
    subtotal,
    discountAmount,
    total: roundMoney(subtotal - discountAmount),
    currency: "AZN",
    bundleSuggestion:
      !hasBundle && missingProduct
        ? {
            productType: missingProduct.type,
            message: bundleMessages[locale],
            discountPercent: 15
          }
        : undefined
  };
}

export function mockPurchase(quote: CheckoutQuote, locale: Locale): PurchaseResponse {
  const user = mockUser();

  if (!quote.selectedProducts.length) {
    return {
      status: "failed",
      message: purchaseMessages[locale].failed
    };
  }

  if (quote.total <= user.balance) {
    return {
      status: "paid_from_balance",
      message: purchaseMessages[locale].paid,
      orderId: `ord_${Date.now()}`
    };
  }

  return {
    status: "payment_required",
    message: purchaseMessages[locale].payment,
    orderId: `ord_${Date.now()}`,
    paymentUrl: `/${locale}/payment/success`
  };
}

export function mockTopUp(locale: Locale): TopUpResponse {
  return {
    paymentUrl: `/${locale}/payment/success?topup=1`
  };
}

export function mockReportsSearch(filters: ReportFilters): PaginatedReports {
  let filtered = [...mockReports];

  if (filters.vin) {
    filtered = filtered.filter((report) => report.vin.includes(filters.vin?.toUpperCase() || ""));
  }

  if (filters.type && filters.type !== "all") {
    filtered = filtered.filter((report) => report.type === filters.type);
  }

  if (filters.status && filters.status !== "all") {
    filtered = filtered.filter((report) => report.status === filters.status);
  }

  if (filters.dateFrom) {
    filtered = filtered.filter((report) => new Date(report.purchaseDate) >= new Date(filters.dateFrom || ""));
  }

  if (filters.dateTo) {
    filtered = filtered.filter((report) => new Date(report.purchaseDate) <= new Date(filters.dateTo || ""));
  }

  filtered.sort((a, b) => {
    const direction = filters.sortDirection === "asc" ? 1 : -1;

    if (filters.sortBy === "vin") {
      return a.vin.localeCompare(b.vin) * direction;
    }

    if (filters.sortBy === "type") {
      return a.type.localeCompare(b.type) * direction;
    }

    return (new Date(a.purchaseDate).getTime() - new Date(b.purchaseDate).getTime()) * direction;
  });

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / filters.pageSize));
  const page = Math.min(filters.page, totalPages);
  const start = (page - 1) * filters.pageSize;
  const items = filtered.slice(start, start + filters.pageSize);

  return {
    items,
    page,
    pageSize: filters.pageSize,
    total,
    totalPages
  };
}

export function mockReviewsList(): Review[] {
  return reviews;
}

export function mockSubmitReview(input: Pick<Review, "name" | "rating" | "comment">): Review {
  const review: Review = {
    id: `review-${Date.now()}`,
    createdAt: new Date().toISOString(),
    ...input
  };

  reviews.unshift(review);

  return review;
}

function createReport(
  id: string,
  vin: string,
  type: ReportProductType,
  status: Report["status"],
  purchaseDate: string,
  price: number
): Report {
  return {
    id,
    vin,
    type,
    status,
    purchaseDate,
    price,
    currency: "AZN",
    reportUrl: status === "success" ? `/mock-reports/${vin}-${type}.html` : undefined
  };
}

function roundMoney(value: number) {
  return Math.round(value * 100) / 100;
}
