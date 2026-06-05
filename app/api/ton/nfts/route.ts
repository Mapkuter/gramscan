import { jsonResponse, requiredParam, tonApi } from "@/lib/ton";

export async function GET(request: Request) {
  const address = requiredParam(request.url, "address");
  if (!address) return jsonResponse({ ok: false, source: "gramscan", data: null, error: "Missing address" }, 20);

  try {
    const data = await tonApi(`/accounts/${encodeURIComponent(address)}/nfts`, {
      cacheSeconds: 20,
      query: { limit: 20 }
    });
    return jsonResponse({ ok: true, source: "tonapi", data }, 20);
  } catch (error) {
    return jsonResponse({ ok: false, source: "tonapi", data: null, error: error instanceof Error ? error.message : "NFTs request failed" }, 20);
  }
}
