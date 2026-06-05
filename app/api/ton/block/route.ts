import { jsonResponse, requiredParam, tonCenter } from "@/lib/ton";

const MASTERCHAIN_SHARD = "-9223372036854775808";

export async function GET(request: Request) {
  const seqno = requiredParam(request.url, "seqno");
  if (!seqno) return jsonResponse({ ok: false, source: "gramscan", data: null, error: "Missing seqno" }, 10);

  try {
    const [header, transactions] = await Promise.all([
      tonCenter("/getBlockHeader", {
        cacheSeconds: 10,
        query: { workchain: -1, shard: MASTERCHAIN_SHARD, seqno }
      }),
      tonCenter("/getBlockTransactions", {
        cacheSeconds: 10,
        query: { workchain: -1, shard: MASTERCHAIN_SHARD, seqno, count: 40 }
      }).catch((error) => ({ ok: false, error: error instanceof Error ? error.message : "Block transactions unavailable" }))
    ]);
    return jsonResponse({ ok: true, source: "toncenter", data: { header, transactions } }, 10);
  } catch (error) {
    return jsonResponse({ ok: false, source: "toncenter", data: null, error: error instanceof Error ? error.message : "Block request failed" }, 10);
  }
}
