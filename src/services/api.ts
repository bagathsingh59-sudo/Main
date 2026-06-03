/**
 * Thin fetch wrapper with sensible defaults.
 */
export class APIError extends Error {
  constructor(public status: number, message: string, public details?: unknown) {
    super(message);
    this.name = "APIError";
  }
}

export async function request<T>(
  url: string,
  { method = "GET", body, headers, signal }: RequestInit & { body?: unknown } = {},
): Promise<T> {
  const res = await fetch(url, {
    method,
    signal,
    headers: { "Content-Type": "application/json", ...(headers ?? {}) },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  const data = text ? (JSON.parse(text) as unknown) : null;

  if (!res.ok) {
    const message =
      (data && typeof data === "object" && "message" in data && String((data as { message: unknown }).message)) ||
      res.statusText;
    throw new APIError(res.status, message, data);
  }
  return data as T;
}
