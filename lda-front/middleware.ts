// middleware.ts
import Negotiator from "negotiator";
import { match } from "@formatjs/intl-localematcher";
import { NextRequest, NextResponse } from "next/server";
import { getCountryFromIP } from "./lib/geo";

const locales = ["en", "zh", "de", "fr", "it", "es", "pt"];
const defaultLocale = "en";
const cookieName = "i18nlang";

// Country to language mapping
const countryToLocale: Record<string, string> = {
  // Portuguese-speaking countries
  BR: "pt", PT: "pt", AO: "pt", MZ: "pt", GW: "pt", ST: "pt", TL: "pt",
  // English-speaking countries
  US: "en", GB: "en", AU: "en", CA: "en", NZ: "en", IE: "en", IN: "en",
  // Other languages
  DE: "de", AT: "de", CH: "de",
  FR: "fr", BE: "fr", LU: "fr", MC: "fr",
  IT: "it", SM: "it", VA: "it",
  ES: "es", MX: "es", AR: "es", CO: "es", PE: "es", VE: "es", CL: "es", EC: "es",
  CN: "zh", TW: "zh", HK: "zh", MO: "zh", SG: "zh"
};

function getClientIp(request: NextRequest): string | null {
  // Try getting IP from headers (common in hosted environments)
  const ip = request.ip || 
             request.headers.get('x-real-ip') || 
             request.headers.get('x-forwarded-for')?.split(',')[0].trim();
  return ip || null;
}

async function getLocale(request: NextRequest): Promise<string> {
  // 1. Check cookie first (user preference)
  if (request.cookies.has(cookieName)) {
    return request.cookies.get(cookieName)!.value;
  }

  // 2. Check Accept-Language header
  const acceptLang = request.headers.get("Accept-Language");
  if (acceptLang) {
    const headers = { "accept-language": acceptLang };
    const languages = new Negotiator({ headers }).languages();
    const matchedLocale = match(languages, locales, defaultLocale);
    if (matchedLocale !== defaultLocale) {
      return matchedLocale;
    }
  }

  // 3. Fallback to IP-based detection
  try {
    const ip = getClientIp(request);
    if (ip) {
      const country = await getCountryFromIP(ip);
      if (country && countryToLocale[country]) {
        return countryToLocale[country];
      }
    }
  } catch (error) {
    console.error("Error detecting country from IP:", error);
  }

  return defaultLocale;
}

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/_next")) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  const locale = await getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  const response = NextResponse.redirect(request.nextUrl);
  response.cookies.set(cookieName, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}

export const config = {
  matcher: [
    "/((?!_next).*)",
  ],
};