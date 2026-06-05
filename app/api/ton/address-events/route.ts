import { jsonResponse, requiredParam, tonApi } from "@/lib/ton";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const address = requiredParam(request.url, "address");
  const cursor = url.searchParams.get("cursor") || undefined;
  if (!address) return jsonResponse({ ok: false, source: "gramscan", data: null, error: "Missing address" }, 20);

  try {
    const data = await tonApi(`/accounts/${encodeURIComponent(address)}/events`, {
      cacheSeconds: 20,
      query: { limit: 20, before_lt: cursor }
    });
    return jsonResponse({ ok: true, source: "tonapi", data }, 20);
  } catch (error) {
    return jsonResponse({ ok: false, source: "tonapi", data: null, error: error instanceof Error ? error.message : "Account events request failed" }, 20);
  }
}
