import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { isJourneyPublic } from "@/lib/journey-access";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Nunca intercepta NextAuth nem API
  if (pathname.startsWith("/api/auth")) return NextResponse.next();
  if (pathname.startsWith("/api/")) return NextResponse.next();

  // Vitrine pública
  if (pathname === "/journeys" || pathname === "/journeys/") {
    return NextResponse.next();
  }

  // Libera journeys públicas
  const match = pathname.match(/^\/journeys\/([^/]+)(?:\/|$)/);
  const slug = match?.[1];
  if (slug && isJourneyPublic(slug)) return NextResponse.next();

  // Protege dashboard e journeys privadas
  const isProtected =
    pathname.startsWith("/dashboard") || pathname.startsWith("/journeys");

  if (!isProtected) return NextResponse.next();

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (token) return NextResponse.next();

  // Vai pra sua tela de login
  const url = new URL("/login", request.url);
  url.searchParams.set("callbackUrl", request.nextUrl.href);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/dashboard/:path*", "/journeys/:path*"],
};
