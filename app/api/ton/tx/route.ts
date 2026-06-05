import { jsonResponse, requiredParam, tonApi } from "@/lib/ton";

export async function GET(request: Request) {
  const id = requiredParam(request.url, "id");
  if (!id) return jsonResponse({ ok: false, source: "gramscan", data: null, error: "Missing transaction id" }, 20);

  try {
    const data = await tonApi(`/events/${encodeURIComponent(id)}`, { cacheSeconds: 20 });
    return jsonResponse({ ok: true, source: "tonapi", data }, 20);
  } catch (error) {
    return jsonResponse(
      {
        ok: false,
        source: "tonapi",
        data: { id },
        error: error instanceof Error ? error.message : "Transaction/event lookup failed",
        fallbackMessage: "Exact transaction lookup on TON often needs account + LT/hash. Try opening the related address history when available."
      },
      20
    );
  }
}
