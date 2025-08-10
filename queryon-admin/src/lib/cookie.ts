// lib/cookies.ts

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(";").shift();
    return cookieValue || null;
  }

  return null;
}

export function setCookie(
  name: string,
  value: string,
  days: number = 365
): void {
  if (typeof document === "undefined") return;

  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

export function deleteCookie(name: string): void {
  if (typeof document === "undefined") return;

  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
}

// Language-specific functions
export function getLanguageFromCookie(): string {
  return getCookie("_lang") || "en";
}

export function setLanguageCookie(language: string): void {
  setCookie("_lang", language, 365); // Store for 1 year
}
