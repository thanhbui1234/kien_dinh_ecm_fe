export type Locale = 'vi' | 'en';

export const COOKIE_NAME = 'NEXT_LOCALE';

export function getStoredLocale(): Locale {
  if (typeof window === 'undefined') return 'vi';
  
  // 1. Check URL query param ?lang=
  const params = new URLSearchParams(window.location.search);
  const langParam = params.get('lang')?.toLowerCase();
  if (langParam === 'vi' || langParam === 'en') {
    return langParam;
  }

  // 2. Check Cookie
  const match = document.cookie.match(new RegExp('(^| )' + COOKIE_NAME + '=([^;]+)'));
  if (match && (match[2] === 'vi' || match[2] === 'en')) {
    return match[2] as Locale;
  }

  return 'vi';
}

export function setStoredLocale(locale: Locale) {
  if (typeof window === 'undefined') return;
  
  // Set Cookie for 1 year
  document.cookie = `${COOKIE_NAME}=${locale}; path=/; max-age=31536000; SameSite=Lax`;

  // Update current URL query parameter ?lang=locale to trigger re-fetch and SEO indexing
  const url = new URL(window.location.href);
  url.searchParams.set('lang', locale);
  window.location.href = url.toString();
}
