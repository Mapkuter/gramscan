import Link from "next/link";
import { DataTable } from "@/components/DataTable";
import { serverUrl } from "@/lib/server-url";
import { shortHash } from "@/lib/utils";

export const metadata = {
  title: "GramScan | TON Blocks",
  description: "Latest TON masterchain blocks"
};

export const dynamic = "force-dynamic";

export default async function BlocksPage() {
  const response = await fetch(await serverUrl("/api/ton/latest-block"), { cache: "no-store" }).catch(() => null);
  const envelope = response ? await response.json() : { ok: false, error: "Latest block request failed" };
  const block = envelope?.data?.result?.last;
  const seqno = block?.seqno;
  const blocks = typeof seqno === "number" ? Array.from({ length: 25 }, (_, index) => seqno - index) : [];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Blocks</h1>
      <DataTable
        columns={["Seqno", "Workchain", "Shard", "Root hash"]}
        rows={blocks.map((item) => [
          <Link key={item} className="font-mono underline underline-offset-2" href={`/block/${item}`}>
            {item}
          </Link>,
          "-1",
          shortHash(block?.shard),
          shortHash(block?.root_hash)
        ])}
        empty="Latest block data is unavailable."
        error={envelope?.ok ? undefined : envelope?.error}
      />
    </div>
  );
}
