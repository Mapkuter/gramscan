import { jsonResponse, tonApi } from "@/lib/ton";

export async function GET() {
  try {
    const data = await tonApi("/rates", {
      cacheSeconds: 60,
      query: { tokens: "ton", currencies: "usd" }
    });
    return jsonResponse({ ok: true, source: "tonapi", data }, 60);
  } catch (error) {
    return jsonResponse({ ok: false, source: "tonapi", data: null, error: error instanceof Error ? error.message : "Price request failed" }, 60);
  }
}
