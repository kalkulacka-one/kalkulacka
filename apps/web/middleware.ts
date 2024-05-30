import { type NextRequest, NextResponse } from "next/server";

const locales = ["cs", "en"];
const defaultLocale = "cs";

export function middleware(request: NextRequest): NextResponse | undefined {
  const supportedLocale = locales.some(
    (locale) =>
      request.nextUrl.pathname.startsWith(`/${locale}/`) ||
      request.nextUrl.pathname === `/${locale}`,
  );

  if (supportedLocale) {
    return;
  } else if (request.nextUrl.pathname !== "/") {
    return NextResponse.rewrite(new URL("/", request.url));
  }

  const path = `/${defaultLocale}${request.nextUrl.pathname}`;
  return NextResponse.redirect(new URL(path, request.url));
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|js|favicon.ico).*)",
};
