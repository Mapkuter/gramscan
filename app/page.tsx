import Link from "next/link";
import { DataTable } from "@/components/DataTable";
import { SearchBar } from "@/components/SearchBar";
import { StatCard } from "@/components/StatCard";
import { serverUrl } from "@/lib/server-url";
import { shortHash } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function getJson(path: string) {
  try {
    const response = await fetch(await serverUrl(path), { cache: "no-store" });
    return await response.json();
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Request failed", data: null };
  }
}

export default async function Home() {
  const [price, latestBlock] = await Promise.all([getJson("/api/ton/price"), getJson("/api/ton/latest-block")]);
  const block = latestBlock?.data?.result?.last;
  const seqno = block?.seqno;
  const tonUsd = price?.data?.rates?.TON?.prices?.USD || price?.data?.rates?.ton?.prices?.USD;
  const latestBlocks = typeof seqno === "number" ? Array.from({ length: 8 }, (_, index) => seqno - index).filter((item) => item >= 0) : [];

  return (
    <div className="space-y-6">
      <section className="space-y-3 border border-black bg-white p-4">
        <h1 className="text-2xl font-bold">TON Blockchain Explorer</h1>
        <SearchBar />
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="TON Price" value={tonUsd ? `$${Number(tonUsd).toFixed(4)}` : "-"} detail={price?.ok ? "TonAPI rates" : price?.error || "Unavailable"} />
        <StatCard label="Latest Block" value={seqno ? String(seqno) : "-"} detail={latestBlock?.ok ? shortHash(block?.root_hash) : latestBlock?.error || "Unavailable"} />
        <StatCard label="Network" value="TON" detail="Mainnet upstream APIs" />
        <StatCard label="Status" value={latestBlock?.ok ? "Online" : "Degraded"} detail={latestBlock?.ok ? "TON Center reachable" : "Latest block failed"} />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Latest Blocks</h2>
          <DataTable
            columns={["Seqno", "Workchain", "Shard", "Source"]}
            rows={latestBlocks.map((item) => [
              <Link key={item} className="font-mono underline underline-offset-2" href={`/block/${item}`}>
                {item}
              </Link>,
              "-1",
              shortHash(block?.shard),
              "TON Center"
            ])}
            empty="Latest block data is unavailable."
            error={latestBlock?.ok ? undefined : latestBlock?.error}
          />
        </div>
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Latest Transactions</h2>
          <DataTable
            columns={["Time", "Type", "Hash/Event ID", "From", "To", "Amount", "Fee", "Status"]}
            rows={[]}
            empty="Global latest transactions are not exposed by the configured proxy yet. Search an address to view real account events."
          />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Top Jettons</h2>
        <DataTable columns={["Token", "Symbol", "Supply", "Holders"]} rows={[]} empty="Placeholder: top jettons ranking requires a market data source." />
      </section>
    </div>
  );
}
