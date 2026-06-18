import type { AppLocale } from "./routing";

/** ISO 3166-1 alpha-2 codes for flagcdn.com (locale → representative flag). */
export const LOCALE_FLAG_ISO2: Record<AppLocale, string> = {
  en: "US",
  ar: "SA",
  es: "ES",
  fr: "FR",
};

export function localeFlagUrl(locale: AppLocale): string {
  const iso2 = LOCALE_FLAG_ISO2[locale].toLowerCase();
  return `https://flagcdn.com/w40/${iso2}.png`;
}

export function localeDisplayCode(locale: AppLocale): string {
  return locale.toUpperCase();
}
