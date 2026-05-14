import { mockRequest } from "./client";
import { mockSendOtp, mockUser, mockVerifyOtp } from "./mock";
import type { ApiContext, AuthResponse, User } from "./types";

export function sendOtp(phone: string, context: ApiContext) {
  return mockRequest<{ ok: boolean }>({
    locale: context.locale,
    url: "/auth/send-otp",
    method: "POST",
    data: { phone },
    factory: () => mockSendOtp(phone)
  });
}

export function verifyOtp(phone: string, otp: string, context: ApiContext) {
  return mockRequest<AuthResponse>({
    locale: context.locale,
    url: "/auth/verify-otp",
    method: "POST",
    data: { phone, otp },
    factory: () => mockVerifyOtp(phone, otp)
  });
}

export function getCurrentUser(phone: string | undefined, context: ApiContext) {
  return mockRequest<User>({
    locale: context.locale,
    url: "/auth/me",
    factory: () => mockUser(phone)
  });
}
