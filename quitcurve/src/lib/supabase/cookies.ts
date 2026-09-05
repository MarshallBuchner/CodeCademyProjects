/**
 * Shared auth cookie settings so PKCE verifier + session cookies work on both
 * quitcurve.app and www.quitcurve.app (host-only cookies break magic links).
 */
export const authCookieOptions = {
  domain:
    process.env.NODE_ENV === "production" ? ".quitcurve.app" : undefined,
  path: "/",
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
};
