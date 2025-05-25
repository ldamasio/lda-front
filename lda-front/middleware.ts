import Negotiator from "negotiator";
import { match } from "@formatjs/intl-localematcher";
import { NextRequest, NextResponse } from "next/server";

const locales = ["en", "zh", "de", "fr", "it", "es", "pt"];
const defaultLocale = "en";
const cookieName = "i18nlang";

// Mapeamento de países para idiomas suportados
const countryToLocale: Record<string, string> = {
  // Português
  BR: "pt", PT: "pt", AO: "pt", MZ: "pt", CV: "pt", ST: "pt", TL: "pt", GW: "pt",
  // Inglês
  US: "en", GB: "en", AU: "en", CA: "en", NZ: "en", IE: "en", ZA: "en",
  // Alemão
  DE: "de", AT: "de", CH: "de", LI: "de", LU: "de",
  // Italiano
  IT: "it", SM: "it", VA: "it",
  // Espanhol
  ES: "es", AR: "es", MX: "es", CO: "es", CL: "es", PE: "es", VE: "es", EC: "es", GT: "es", CU: "es", BO: "es", DO: "es", HN: "es", PY: "es", SV: "es", NI: "es", CR: "es", UY: "es", PA: "es", GQ: "es", PR: "es",
  // Francês
  FR: "fr", BE: "fr", MC: "fr",
  // Chinês
  CN: "zh", TW: "zh", SG: "zh", HK: "zh",
};

async function getCountryFromIP(ip: string): Promise<string | null> {
  try {
    const url = `https://ipwhois.app/json/${ip}?lang=en`;
    const res = await fetch(url, { next: { revalidate: 86400 } }); // 1 dia de cache
    if (!res.ok) return null;
    const data = await res.json();
    return data.country_code || null;
  } catch {
    return null;
  }
}

async function getLocale(request: NextRequest): Promise<string> {
  // 1. Cookie do usuário
  if (request.cookies.has(cookieName)) {
    const locale = request.cookies.get(cookieName)!.value;
    if (locales.includes(locale)) return locale;
  }
  // 2. Header Accept-Language
  const acceptLang = request.headers.get("Accept-Language");
  if (acceptLang) {
    const headers = { "accept-language": acceptLang };
    const languages = new Negotiator({ headers }).languages();
    const matched = match(languages, locales, defaultLocale);
    if (matched) return matched;
  }
  // 3. Detecta país pelo IP (X-Forwarded-For ou request.ip)
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0] : request.ip ?? "";
  if (ip && ip !== "127.0.0.1" && ip !== "::1") {
    const countryCode = await getCountryFromIP(ip);
    if (countryCode && countryToLocale[countryCode]) {
      return countryToLocale[countryCode];
    }
  }
  // 4. Fallback
  return defaultLocale;
}

// Tornar middleware assíncrono!
export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/_next")) return NextResponse.next();

  const { pathname } = request.nextUrl;
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  if (pathnameHasLocale) return;

  const locale = await getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  const response = NextResponse.redirect(request.nextUrl);
  response.cookies.set(cookieName, locale, { path: "/", httpOnly: true });

  return response;
}

export const config = {
  matcher: [
    "/((?!_next).*)",
  ],
};
