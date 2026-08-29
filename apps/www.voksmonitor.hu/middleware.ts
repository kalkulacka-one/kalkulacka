import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

function shouldForceEnglish(url: NextRequest["nextUrl"]): boolean {
  const path = url.pathname.toLowerCase();
  const search = url.search.toLowerCase();
  return path.includes("2026-ogy-en") || search.includes("2026-ogy-en");
}

export function middleware(request: NextRequest) {
  const forcedLocale = shouldForceEnglish(request.nextUrl) ? "en" : undefined;
  const requestHeaders = new Headers(request.headers);

  if (forcedLocale) {
    requestHeaders.set("x-forced-locale", forcedLocale);
  }

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  if (forcedLocale) {
    response.cookies.set("NEXT_LOCALE", forcedLocale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};
