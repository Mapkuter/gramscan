import type { Metadata } from "next";
import Link from "next/link";
import { DataTable, ErrorBox } from "@/components/DataTable";
import { JsonViewer } from "@/components/JsonViewer";
import { serverUrl } from "@/lib/server-url";
import { formatUnixTime, shortHash } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ seqno: string }> };

async function getBlock(seqno: string) {
  try {
    const response = await fetch(await serverUrl(`/api/ton/block?seqno=${encodeURIComponent(seqno)}`), { cache: "no-store" });
    return await response.json();
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Request failed", data: null };
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { seqno } = await params;
  return {
    title: `GramScan | TON Block ${seqno}`,
    description: `TON masterchain block ${seqno}`
  };
}

export default async function BlockPage({ params }: Props) {
  const { seqno } = await params;
  const envelope = await getBlock(seqno);
  const header = envelope?.data?.header?.result || {};
  const txData = envelope?.data?.transactions?.result || {};
  const transactions = txData?.transactions || [];
  const numericSeqno = Number(seqno);

  return (
    <div className="space-y-5">
      <section className="border border-black bg-white p-4">
        <p className="text-xs uppercase text-neutral-600">Block seqno</p>
        <h1 className="font-mono text-2xl font-bold">{seqno}</h1>
      </section>
      {!envelope?.ok ? <ErrorBox message={envelope?.error || "Block lookup failed"} /> : null}
      <section className="grid gap-3 border border-black bg-white p-4 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Workchain" value="-1" />
        <Field label="Shard" value={shortHash(header?.id?.shard || "-9223372036854775808")} />
        <Field label="Time" value={formatUnixTime(header?.gen_utime)} />
        <Field label="Transactions count" value={String(txData?.incomplete ? `${transactions.length}+` : transactions.length || "-")} />
        <Field label="Previous block" value={numericSeqno > 0 ? <Link className="underline underline-offset-2" href={`/block/${numericSeqno - 1}`}>{numericSeqno - 1}</Link> : "-"} />
        <Field label="Next block" value={<Link className="underline underline-offset-2" href={`/block/${numericSeqno + 1}`}>{numericSeqno + 1}</Link>} />
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Transactions In Block</h2>
        <DataTable
          columns={["Account", "LT", "Hash"]}
          rows={transactions.map((tx: any) => [
            tx?.account ? (
              <Link key="account" className="font-mono underline underline-offset-2" href={`/address/${encodeURIComponent(tx.account)}`}>
                {shortHash(tx.account)}
              </Link>
            ) : (
              "-"
            ),
            tx?.lt || "-",
            tx?.hash ? (
              <Link key="hash" className="font-mono underline underline-offset-2" href={`/tx/${encodeURIComponent(tx.hash)}`}>
                {shortHash(tx.hash)}
              </Link>
            ) : (
              "-"
            )
          ])}
          empty="No block transactions returned by TON Center."
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
