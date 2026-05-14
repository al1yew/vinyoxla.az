"use client";

import type { PendingPurchase, ReportProductType } from "@/lib/api/types";

const key = "vinyoxla_pending_purchase";
const cookieName = "vinyoxla_pending";

export function savePendingPurchase(pending: PendingPurchase) {
  const serialized = JSON.stringify(pending);
  window.sessionStorage.setItem(key, serialized);
  document.cookie = `${cookieName}=${encodeURIComponent(serialized)}; path=/; max-age=1800; samesite=lax`;
}

export function readPendingPurchase(): PendingPurchase | null {
  const stored = window.sessionStorage.getItem(key) || readCookie(cookieName);

  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored) as PendingPurchase;
  } catch {
    return null;
  }
}

export function updatePendingProducts(products: ReportProductType[]) {
  const pending = readPendingPurchase();

  if (!pending) {
    return null;
  }

  const next = {
    ...pending,
    products
  };

  savePendingPurchase(next);
  return next;
}

export function clearPendingPurchase() {
  window.sessionStorage.removeItem(key);
  document.cookie = `${cookieName}=; path=/; max-age=0; samesite=lax`;
}

function readCookie(name: string) {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1];
}
