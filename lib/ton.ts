import { NextResponse } from "next/server";

const TONCENTER_BASE = "https://toncenter.com/api/v2";
const TONAPI_BASE = "https://tonapi.io/v2";

type FetchOptions = {
  cacheSeconds?: number;
  query?: Record<string, string | number | undefined | null>;
};

export type ApiResult<T> = {
  ok: boolean;
  source: "toncenter" | "tonapi" | "gramscan";
  data: T | null;
  error?: string;
  fallbackMessage?: string;
};

function withQuery(url: string, query?: FetchOptions["query"]) {
  const parsed = new URL(url);
  Object.entries(query || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") parsed.searchParams.set(key, String(value));
  });
  return parsed.toString();
}

async function readJson<T>(response: Response): Promise<T> {
  const text = await response.text();
  if (!text) return null as T;
  return JSON.parse(text) as T;
}

async function request<T>(base: string, path: string, source: ApiResult<T>["source"], options: FetchOptions = {}) {
  const headers: Record<string, string> = {};
  if (source === "toncenter" && process.env.TONCENTER_API_KEY) headers["X-API-Key"] = process.env.TONCENTER_API_KEY;
  if (source === "tonapi" && process.env.TONAPI_KEY) headers.Authorization = `Bearer ${process.env.TONAPI_KEY}`;

  const response = await fetch(withQuery(`${base}${path}`, options.query), {
    headers,
    next: { revalidate: options.cacheSeconds ?? 0 }
  });
  const data = await readJson<T>(response);
  if (!response.ok) {
    const message = typeof data === "object" && data && "error" in data ? String((data as { error: unknown }).error) : response.statusText;
    throw new Error(message || `HTTP ${response.status}`);
  }
  return data;
}

export async function tonCenter<T>(path: string, options?: FetchOptions) {
  return request<T>(TONCENTER_BASE, path, "toncenter", options);
}

export async function tonApi<T>(path: string, options?: FetchOptions) {
  return request<T>(TONAPI_BASE, path, "tonapi", options);
}

export function jsonResponse<T>(result: ApiResult<T>, cacheSeconds: number) {
  return NextResponse.json(result, {
    status: result.ok ? 200 : 502,
    headers: {
      "Cache-Control": `s-maxage=${cacheSeconds}, stale-while-revalidate=${Math.max(cacheSeconds * 3, 30)}`
    }
  });
}

export function requiredParam(url: string, key: string) {
  return new URL(url).searchParams.get(key)?.trim() || "";
}

export async function withFallback<T>(
  primary: () => Promise<{ source: ApiResult<T>["source"]; data: T }>,
  fallback: () => Promise<{ source: ApiResult<T>["source"]; data: T }>,
  message: string
): Promise<ApiResult<T>> {
  try {
    const result = await primary();
    return { ok: true, source: result.source, data: result.data };
  } catch (primaryError) {
    try {
      const result = await fallback();
      return {
        ok: true,
        source: result.source,
        data: result.data,
        fallbackMessage: `${message}: ${primaryError instanceof Error ? primaryError.message : "primary request failed"}`
      };
    } catch (fallbackError) {
      return {
        ok: false,
        source: "gramscan",
        data: null,
        error: fallbackError instanceof Error ? fallbackError.message : "All upstream requests failed",
        fallbackMessage: `${message}: fallback also failed`
      };
    }
  }
}
