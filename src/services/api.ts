/**
 * Thin fetch wrapper with sensible defaults.
 *
 * We accept `body: unknown` and serialise it ourselves — `Omit<RequestInit, "body">`
 * keeps the rest of the standard `RequestInit` (`method`, `headers`, `signal`,
 * `cache`, etc.) without colliding with the DOM's strict `BodyInit` union.
 */
export class APIError extends Error {
  status: number;
  details?: unknown;
  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.name = "APIError";
    this.status = status;
    this.details = details;
  }
}

export type RequestOptions = Omit<RequestInit, "body"> & { body?: unknown };

export async function request<T>(url: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, headers, signal, ...rest } = options;

  const res = await fetch(url, {
    method,
    signal,
    headers: { "Content-Type": "application/json", ...(headers ?? {}) },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    ...rest,
  });

  const text = await res.text();
  const data: unknown = text ? JSON.parse(text) : null;

  if (!res.ok) {
    let message: string = res.statusText;
    if (data && typeof data === "object" && "message" in data) {
      const raw = (data as { message: unknown }).message;
      if (typeof raw === "string" && raw.length > 0) message = raw;
    }
    throw new APIError(res.status, message, data);
  }
  return data as T;
}
