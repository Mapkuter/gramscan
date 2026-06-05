import { jsonResponse, requiredParam, tonApi } from "@/lib/ton";

export async function GET(request: Request) {
  const address = requiredParam(request.url, "address");
  if (!address) return jsonResponse({ ok: false, source: "gramscan", data: null, error: "Missing token address" }, 30);

  try {
    const data = await tonApi(`/jettons/${encodeURIComponent(address)}`, { cacheSeconds: 30 });
    return jsonResponse({ ok: true, source: "tonapi", data }, 30);
  } catch (error) {
    return jsonResponse({ ok: false, source: "tonapi", data: null, error: error instanceof Error ? error.message : "Token request failed" }, 30);
  }
}
