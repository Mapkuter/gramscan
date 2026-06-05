import type { Metadata } from "next";
import Link from "next/link";
import { CopyButton } from "@/components/CopyButton";
import { ErrorBox } from "@/components/DataTable";
import { JsonViewer } from "@/components/JsonViewer";
import { normalizeEvent } from "@/lib/normalizers";
import { serverUrl } from "@/lib/server-url";
import { formatNanoTon, formatUnixTime, shortHash } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ hash: string }> };

async function getTx(id: string) {
  try {
    const response = await fetch(await serverUrl(`/api/ton/tx?id=${encodeURIComponent(id)}`), { cache: "no-store" });
    return await response.json();
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Request failed", data: { id } };
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { hash } = await params;
  const decoded = decodeURIComponent(hash);
  return {
    title: `GramScan | TON Transaction ${shortHash(decoded)}`,
    description: `TON transaction or event ${decoded}`
  };
}

export default async function TxPage({ params }: Props) {
  const { hash } = await params;
  const decoded = decodeURIComponent(hash);
  const envelope = await getTx(decoded);
  const tx = envelope?.ok ? normalizeEvent(envelope.data) : null;

  return (
    <div className="space-y-5">
      <section className="border border-black bg-white p-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs uppercase text-neutral-600">Transaction hash / event id</p>
            <h1 className="break-all font-mono text-lg font-semibold">{decoded}</h1>
          </div>
          <CopyButton value={decoded} />
        </div>
      </section>

      {!envelope?.ok ? <ErrorBox message={envelope?.error || "Transaction lookup failed"} detail={envelope?.fallbackMessage} /> : null}

      <section className="grid gap-3 border border-black bg-white p-4 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Status" value={tx?.status || (envelope?.ok ? "Success" : "Unknown")} />
        <Field label="Time" value={formatUnixTime(tx?.time)} />
        <Field label="Block / LT" value={tx?.lt ? `LT ${tx.lt}` : "-"} />
        <Field label="Action type" value={tx?.type || "-"} />
        <Field label="From" value={tx?.from ? <AddressLink address={tx.from} /> : "-"} />
        <Field label="To" value={tx?.to ? <AddressLink address={tx.to} /> : "-"} />
        <Field label="Amount" value={formatNanoTon(tx?.amount)} />
        <Field label="Fee" value={formatNanoTon(tx?.fee)} />
      </section>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Raw JSON</h2>
        <JsonViewer data={envelope} />
      </div>
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

function AddressLink({ address }: { address: string }) {
  return (
    <Link className="font-mono underline underline-offset-2" href={`/address/${encodeURIComponent(address)}`}>
      {shortHash(address)}
    </Link>
  );
}
