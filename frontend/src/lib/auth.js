export function getTokenPayload(token) {
  if (!token) return null;
  try {
    const base64 = token.split('.')[1];
    const json = atob(base64.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function getTokenExpiry(token) {
    const payload = getTokenPayload(token);
    return payload?.exp ? payload.exp * 1000 : null;
}

export function isTokenValid(token) {
    const expiry = getTokenExpiry(token);
    if (!expiry) return false;
    return Date.now() < expiry;
}

export function msUntilExpiry(token) {
    const expiry = getTokenExpiry(token);
    if (!expiry) return 0;
    return expiry - Date.now();
}