import { jsonResponse, requiredParam, tonApi, tonCenter, withFallback } from "@/lib/ton";

export async function GET(request: Request) {
  const address = requiredParam(request.url, "address");
  if (!address) return jsonResponse({ ok: false, source: "gramscan", data: null, error: "Missing address" }, 15);

  const result = await withFallback(
    async () => ({
      source: "toncenter" as const,
      data: await tonCenter("/getAddressInformation", { cacheSeconds: 15, query: { address } })
    }),
    async () => ({
      source: "tonapi" as const,
      data: await tonApi(`/accounts/${encodeURIComponent(address)}`, { cacheSeconds: 15 })
    }),
    "TON Center address lookup failed"
  );
  return jsonResponse(result, 15);
}
