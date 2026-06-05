import { jsonResponse, tonCenter } from "@/lib/ton";

export async function GET() {
  try {
    const data = await tonCenter("/getMasterchainInfo", { cacheSeconds: 5 });
    return jsonResponse({ ok: true, source: "toncenter", data }, 5);
  } catch (error) {
    return jsonResponse({ ok: false, source: "toncenter", data: null, error: error instanceof Error ? error.message : "Latest block request failed" }, 5);
  }
}
