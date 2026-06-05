import { jsonResponse, requiredParam, tonApi } from "@/lib/ton";

export async function GET(request: Request) {
  const address = requiredParam(request.url, "address");
  if (!address) return jsonResponse({ ok: false, source: "gramscan", data: null, error: "Missing address" }, 20);

  try {
    const data = await tonApi(`/accounts/${encodeURIComponent(address)}/jettons`, { cacheSeconds: 20 });
    return jsonResponse({ ok: true, source: "tonapi", data }, 20);
  } catch (error) {
    return jsonResponse({ ok: false, source: "tonapi", data: null, error: error instanceof Error ? error.message : "Jettons request failed" }, 20);
  }
}
