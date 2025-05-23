// middleware.ts
import Negotiator from "negotiator";
import { match } from "@formatjs/intl-localematcher";
import { NextRequest, NextResponse } from "next/server";

const locales = ["en", "zh", "de", "fr", "it", "es", "pt"];
const defaultLocale = "en";
const cookieName = "i18nlang";

function getLocale(request: NextRequest): string {
  if (request.cookies.has(cookieName))
    return request.cookies.get(cookieName)!.value;
  const acceptLang = request.headers.get("Accept-Language");
  if (!acceptLang) return defaultLocale;
  const headers = { "accept-language": acceptLang };
  const languages = new Negotiator({ headers }).languages();
  console.log('Getting locale...');
  console.log(languages);
  console.log(locales);
  console.log(defaultLocale);
  return match(languages, locales, defaultLocale);
}

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/_next")) return NextResponse.next();

  const { pathname } = request.nextUrl;
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  const response = NextResponse.redirect(request.nextUrl);
  response.cookies.set(cookieName, locale);

  console.log('Redirecting to locale...');
  console.log(request.nextUrl.pathname);
  console.log(locale);
  console.log(response.cookies.get(cookieName));
  return response;
}

export const config = {
  matcher: [
    "/((?!_next).*)",
  ],
};
