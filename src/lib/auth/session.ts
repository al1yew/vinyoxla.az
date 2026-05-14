import { cookies } from "next/headers";

export type AuthSession = {
  token: string;
  phone: string;
};

export const authCookieName = "vinyoxla_auth";
export const phoneCookieName = "vinyoxla_phone";
export const pendingCookieName = "vinyoxla_pending";

export async function getAuthSession(): Promise<AuthSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(authCookieName)?.value;
  const phone = cookieStore.get(phoneCookieName)?.value;

  if (!token || !phone) {
    return null;
  }

  return {
    token,
    phone: decodeURIComponent(phone)
  };
}

export async function getPendingPurchaseCookie() {
  const cookieStore = await cookies();
  const value = cookieStore.get(pendingCookieName)?.value;

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(decodeURIComponent(value)) as { vin: string; products: string[] };
  } catch {
    return null;
  }
}
