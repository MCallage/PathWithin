import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { isJourneyPublic } from "@/lib/journey-access";

const PUBLIC_JOURNEY_SLUGS = new Set(["emotional-reset"]);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/")) return NextResponse.next();


  // Não intercepta rotas do NextAuth
  if (pathname.startsWith("/api/auth")) return NextResponse.next();

  // Vitrine pública
  if (pathname === "/journeys" || pathname === "/journeys/") {
    return NextResponse.next();
  }

  // Pega o slug em /journeys/:slug/...
  const match = pathname.match(/^\/journeys\/([^/]+)(?:\/|$)/);
  const slug = match?.[1];

  // Journey pública (tudo liberado dentro dela)
  if (slug && isJourneyPublic(slug)) {
  return NextResponse.next();
}
  
  // Tudo que for dashboard ou outras journeys exige login
  const isProtected =
    pathname.startsWith("/dashboard") || pathname.startsWith("/journeys");

  if (!isProtected) return NextResponse.next();

  // Verifica sessão via JWT/cookie do NextAuth
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  if (token) return NextResponse.next();

  // Redireciona pro signin do NextAuth com callbackUrl
  const url = new URL("/api/auth/signin", request.url);
  url.searchParams.set("callbackUrl", request.nextUrl.href);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/dashboard/:path*", "/journeys/:path*"],
};

