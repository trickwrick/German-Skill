export const ADMIN_SESSION_COOKIE = "gs_admin_session";

export function verifyAdminCredentials(username: string, password: string) {
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminUsername || !adminPassword) {
    return false;
  }

  return username === adminUsername && password === adminPassword;
}

export function getAdminSessionToken() {
  return process.env.ADMIN_SESSION_TOKEN ?? "";
}

export function isAdminSessionValid(token: string | undefined) {
  const expected = getAdminSessionToken();
  return Boolean(expected && token && token === expected);
}
