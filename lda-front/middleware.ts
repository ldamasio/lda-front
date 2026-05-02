// middleware.ts
import Negotiator from "negotiator";
import { match } from "@formatjs/intl-localematcher";
import { NextRequest, NextResponse } from "next/server";

const locales = ["en", "zh", "de", "fr", "it", "es", "pt"];
const defaultLocale = "en";
const cookieName = "i18nlang";

function getDomainLocale(request: NextRequest): string | null {
  const host = request.headers.get("host")?.split(":")[0].toLowerCase();
  if (host === "rbxsystems.ch" || host === "www.rbxsystems.ch") return "en";
  if (host === "rbx.ia.br" || host === "www.rbx.ia.br") return "pt";
  return null;
}

function getLocale(request: NextRequest): string {
  const domainLocale = getDomainLocale(request);
  if (domainLocale) return domainLocale;

  if (request.cookies.has(cookieName))
    return request.cookies.get(cookieName)!.value;
  const acceptLang = request.headers.get("Accept-Language");
  if (!acceptLang) return defaultLocale;
  const headers = { "accept-language": acceptLang };
  const languages = new Negotiator({ headers }).languages();
  return match(languages, locales, defaultLocale);
}

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/_next")) return NextResponse.next();

  const { pathname } = request.nextUrl;
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    const locale = pathname.split("/")[1];
    const response = NextResponse.next();
    response.cookies.set(cookieName, locale);
    return response;
  }

  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  const response = NextResponse.redirect(request.nextUrl);
  response.cookies.set(cookieName, locale);

  return response;
}

export const config = {
  matcher: [
    "/((?!_next|.*\\.[^/]+$).*)",
  ],
};
