export const themeCookieName = "vinyoxla_theme";

export type ThemePreference = "dark" | "light";

export function isThemePreference(value: string | undefined): value is ThemePreference {
  return value === "dark" || value === "light";
}
