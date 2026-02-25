import { API_BASE_URL } from "@/config/apiConfig";
import { NextRequest, NextResponse } from "next/server";

const PROTECTED_PATHS = ["/me"];
const GUEST_ONLY_PATHS = ["/auth"];

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PATHS.some((path) => pathname.startsWith(path));
}

function isGuestOnlyPath(pathname: string): boolean {
  return GUEST_ONLY_PATHS.some((path) => pathname.startsWith(path));
}

type RefreshResult =
  | { success: true; accessToken: string }
  | { success: false };

async function tryRefreshToken(refreshToken: string): Promise<RefreshResult> {
  const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  const data = await res.json().catch(() => ({}));

  if (res.ok && data.access_token) {
    return { success: true, accessToken: data.access_token };
  }

  return { success: false };
}

function requireAuth(
  pathname: string,
  accessToken: string | undefined,
  request: NextRequest,
): NextResponse | null {
  if (isProtectedPath(pathname) && !accessToken) {
    return NextResponse.redirect(new URL("/auth/request", request.url));
  }
  return null;
}

function requireGuest(
  pathname: string,
  accessToken: string | undefined,
  request: NextRequest,
): NextResponse | null {
  if (isGuestOnlyPath(pathname) && accessToken) {
    return NextResponse.redirect(new URL("/me", request.url));
  }
  return null;
}

function setAccessTokenCookie(
  response: NextResponse,
  accessToken: string,
): void {
  response.cookies.set("access_token", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60,
  });
}

function clearAuthCookies(response: NextResponse): void {
  response.cookies.delete("access_token");
  response.cookies.delete("refresh_token");
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  let accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  if (!accessToken && refreshToken) {
    const result = await tryRefreshToken(refreshToken);

    if (result.success) {
      accessToken = result.accessToken;
      const response =
        requireGuest(pathname, accessToken, request) ?? NextResponse.next();
      setAccessTokenCookie(response, accessToken);
      return response;
    } else {
      const response =
        requireAuth(pathname, undefined, request) ?? NextResponse.next();
      clearAuthCookies(response);
      return response;
    }
  }

  const authResponse = requireAuth(pathname, accessToken, request);
  if (authResponse) return authResponse;

  const guestResponse = requireGuest(pathname, accessToken, request);
  if (guestResponse) return guestResponse;

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|manifest.json|.well-known|.*\\.(?:svg|png|jpg|jpeg|gif|webp|pdf|mp4|woff2?)$).*)",
  ],
};
