import { API_URL, API_KEY } from "../global";

interface FetchOptions extends RequestInit {
  endpoint: string;
  headers?: Record<string, string>;
  query?: Record<string, any>;
}

/**
 * Universal API fetch function
 * @param options
 * @returns response data (json)
 */
export async function apiFetch<T = any>(
  options: FetchOptions
): Promise<T | null> {
  const {
    endpoint,
    method = "GET",
    headers = {},
    body,
    query,
    ...rest
  } = options;

  // Query string
  let url = API_URL + endpoint;
  if (query && Object.keys(query).length) {
    const q = new URLSearchParams(query).toString();
    url += "?" + q;
  }

  // Default headers
  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (API_KEY) {
    defaultHeaders["Authorization"] = `Bearer ${API_KEY}`;
  }

  // Merge headers
  const mergedHeaders = { ...defaultHeaders, ...headers };

  const res = await fetch(url, {
    method,
    headers: mergedHeaders,
    body: body ? JSON.stringify(body) : undefined,
    ...rest,
  });

  if (res.status === 204) {
    return null;
  }

  if (!res.ok) {
    let errorText = "";
    try {
      errorText = await res.text();
    } catch {
      errorText = res.statusText;
    }
    throw new Error(errorText || "API Error");
  }
  return res.json();
}
