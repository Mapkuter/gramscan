import { jsonResponse, requiredParam, tonCenter } from "@/lib/ton";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const address = requiredParam(request.url, "address");
  if (!address) return jsonResponse({ ok: false, source: "gramscan", data: null, error: "Missing address" }, 20);

  try {
    const data = await tonCenter("/getTransactions", {
      cacheSeconds: 20,
      query: {
        address,
        limit: 20,
        lt: url.searchParams.get("lt"),
        hash: url.searchParams.get("hash")
      }
    });
    return jsonResponse({ ok: true, source: "toncenter", data }, 20);
  } catch (error) {
    return jsonResponse({ ok: false, source: "toncenter", data: null, error: error instanceof Error ? error.message : "Transactions request failed" }, 20);
  }
}
