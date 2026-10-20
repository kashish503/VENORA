const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/+$/, '');

export async function apiRequest(path, options = {}) {
  const { token, body, headers = {}, ...rest } = options;
  const requestHeaders = { Accept: 'application/json', ...headers };

  if (body !== undefined) requestHeaders['Content-Type'] = 'application/json';
  if (token) requestHeaders.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...rest,
      headers: requestHeaders,
      body: body === undefined ? undefined : JSON.stringify(body)
    });
  } catch (_error) {
    throw new Error(`Cannot reach the VENORA backend at ${API_BASE}. Start the backend on port 5000 and check MongoDB connection.`);
  }

  const raw = await response.text();
  let payload = {};
  try {
    payload = raw ? JSON.parse(raw) : {};
  } catch (_error) {
    payload = { message: raw || 'Unexpected response from server.' };
  }

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error(payload.message || 'Your session has expired. Please sign in again.');
    }
    throw new Error(payload.message || `Request failed (${response.status}).`);
  }

  return payload;
}

export const API_BASE_URL = API_BASE;
