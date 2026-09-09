export const THANK_YOU_CONFIG = {
  /**
   * Automatic redirect delay in milliseconds.
   * Configured: 1000ms (1 second).
   */
  redirectDelayMs: 1000,
  defaultReturnUrl: "/",
  storageKey: "fluentauf_return_url",
  /**
   * Advertising & tracking query parameters to preserve across redirects.
   */
  trackingParams: [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
    "gclid",
    "gad_source",
    "gbraid",
    "wbraid",
    "fbclid",
  ] as const,
} as const;

/**
 * Validates and sanitizes a return URL.
 * Only allows safe, same-origin relative paths (e.g., "/", "/course/german-a1", "/city/jaipur?utm_source=google").
 * Strictly prevents open-redirect attacks (e.g., "//evil.com", "/\\evil.com", "javascript:", "https://external.com").
 * Falls back safely to "/" if the URL is invalid, external, or loops back to "/thank-you".
 */
export function getSafeReturnUrl(rawUrl: string | null | undefined): string {
  if (!rawUrl || typeof rawUrl !== "string") {
    return THANK_YOU_CONFIG.defaultReturnUrl;
  }

  const trimmed = rawUrl.trim();

  // Must start with a single "/" and not protocol-relative "//" or "/\"
  if (!trimmed.startsWith("/") || trimmed.startsWith("//") || trimmed.startsWith("/\\")) {
    return THANK_YOU_CONFIG.defaultReturnUrl;
  }

  try {
    // Parse against a dummy same-origin host
    const parsed = new URL(trimmed, "http://localhost");
    if (parsed.origin !== "http://localhost") {
      return THANK_YOU_CONFIG.defaultReturnUrl;
    }

    // Prevent redirect loops to /thank-you itself
    const normalizedPath = parsed.pathname.toLowerCase().replace(/\/+$/, "");
    if (normalizedPath === "/thank-you") {
      return THANK_YOU_CONFIG.defaultReturnUrl;
    }

    return parsed.pathname + parsed.search + parsed.hash;
  } catch {
    return THANK_YOU_CONFIG.defaultReturnUrl;
  }
}

/**
 * Builds the /thank-you URL from the browser's current location,
 * preserving current tracking parameters and recording the returnUrl.
 */
export function buildThankYouUrl(): string {
  if (typeof window === "undefined") {
    return "/thank-you";
  }

  const currentPathWithQuery =
    window.location.pathname + window.location.search + window.location.hash;
  const currentParams = new URLSearchParams(window.location.search);

  // Fallback storage in sessionStorage for resilience across refreshes
  try {
    sessionStorage.setItem(THANK_YOU_CONFIG.storageKey, currentPathWithQuery);
  } catch {
    // Ignore private browsing / quota errors
  }

  const thankYouParams = new URLSearchParams();
  thankYouParams.set("returnUrl", currentPathWithQuery);

  // Copy tracking parameters so conversion tracking on /thank-you has full context
  for (const key of THANK_YOU_CONFIG.trackingParams) {
    const val = currentParams.get(key);
    if (val) {
      thankYouParams.set(key, val);
    }
  }

  return `/thank-you?${thankYouParams.toString()}`;
}
