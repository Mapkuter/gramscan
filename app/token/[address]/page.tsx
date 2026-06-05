import type { Metadata } from "next";
import { DataTable, ErrorBox } from "@/components/DataTable";
import { JsonViewer } from "@/components/JsonViewer";
import { serverUrl } from "@/lib/server-url";
import { formatTokenAmount, shortHash } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ address: string }> };

async function getToken(address: string) {
  try {
    const response = await fetch(await serverUrl(`/api/ton/token?address=${encodeURIComponent(address)}`), { cache: "no-store" });
    return await response.json();
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Request failed", data: null };
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { address } = await params;
  const decoded = decodeURIComponent(address);
  return {
    title: `GramScan | TON Token ${shortHash(decoded)}`,
    description: `TON jetton ${decoded}`
  };
}

export default async function TokenPage({ params }: Props) {
  const { address } = await params;
  const decoded = decodeURIComponent(address);
  const envelope = await getToken(decoded);
  const token = envelope?.data?.metadata ? envelope.data : envelope?.data || {};
  const metadata = token?.metadata || token;

  return (
    <div className="space-y-5">
      <section className="border border-black bg-white p-4">
        <p className="text-xs uppercase text-neutral-600">Jetton</p>
        <h1 className="break-all text-2xl font-bold">{metadata?.name || shortHash(decoded)}</h1>
        <p className="mt-1 break-all font-mono text-sm text-neutral-700">{decoded}</p>
      </section>
      {!envelope?.ok ? <ErrorBox message={envelope?.error || "Token lookup failed"} /> : null}
      <section className="grid gap-3 border border-black bg-white p-4 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Token name" value={metadata?.name || "-"} />
        <Field label="Symbol" value={metadata?.symbol || "-"} />
        <Field label="Supply" value={token?.total_supply ? formatTokenAmount(token.total_supply, Number(metadata?.decimals || 9), metadata?.symbol || "") : "-"} />
        <Field label="Holders" value="Placeholder: holder count requires indexed holder data." />
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Transfers</h2>
        <DataTable
          columns={["Time", "From", "To", "Amount", "Hash/Event ID"]}
          rows={[]}
          empty="Placeholder: token transfer history requires a jetton transfer index endpoint."
        />
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Raw JSON</h2>
        <JsonViewer data={envelope} />
      </section>
    </div>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <p className="text-xs uppercase text-neutral-600">{label}</p>
      <div className="mt-1 truncate font-semibold">{value}</div>
    </div>
  );
}
