"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { DataTable, ErrorBox } from "@/components/DataTable";
import { PaginationButton } from "@/components/PaginationButton";
import { ExplorerTransaction, eventList, tonCenterTxList } from "@/lib/normalizers";
import { formatNanoTon, formatUnixTime, shortHash } from "@/lib/utils";

type ApiEnvelope = {
  ok: boolean;
  source: string;
  data: any;
  error?: string;
  fallbackMessage?: string;
};

function rows(transactions: ExplorerTransaction[]) {
  return transactions.map((tx) => [
    formatUnixTime(tx.time),
    tx.type,
    <Link key="id" className="font-mono underline underline-offset-2" href={`/tx/${encodeURIComponent(tx.id)}`}>
      {shortHash(tx.id)}
    </Link>,
    tx.from ? (
      <Link key="from" className="font-mono underline underline-offset-2" href={`/address/${encodeURIComponent(tx.from)}`}>
        {shortHash(tx.from)}
      </Link>
    ) : (
      "-"
    ),
    tx.to ? (
      <Link key="to" className="font-mono underline underline-offset-2" href={`/address/${encodeURIComponent(tx.to)}`}>
        {shortHash(tx.to)}
      </Link>
    ) : (
      "-"
    ),
    formatNanoTon(tx.amount),
    formatNanoTon(tx.fee),
    tx.status
  ]);
}

export function TransactionTable({
  address,
  initialTransactions,
  initialCursor,
  initialError,
  initialFallbackMessage
}: {
  address: string;
  initialTransactions: ExplorerTransaction[];
  initialCursor?: string;
  initialError?: string;
  initialFallbackMessage?: string;
}) {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [cursor, setCursor] = useState(initialCursor);
  const [error, setError] = useState(initialError);
  const [fallbackMessage, setFallbackMessage] = useState(initialFallbackMessage);
  const [loading, setLoading] = useState(false);

  const tableRows = useMemo(() => rows(transactions), [transactions]);

  async function loadMore() {
    if (loading) return;
    setLoading(true);
    setError(undefined);
    try {
      const eventsRes = await fetch(`/api/ton/address-events?address=${encodeURIComponent(address)}${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ""}`);
      const eventsEnvelope = (await eventsRes.json()) as ApiEnvelope;
      if (eventsEnvelope.ok) {
        const next = eventList(eventsEnvelope.data);
        setTransactions((current) => [...current, ...next]);
        setCursor(eventsEnvelope.data?.next_from || next.at(-1)?.lt);
        setFallbackMessage(eventsEnvelope.fallbackMessage);
        return;
      }

      const last = transactions.at(-1);
      const txRes = await fetch(`/api/ton/transactions?address=${encodeURIComponent(address)}${last?.lt ? `&lt=${encodeURIComponent(last.lt)}` : ""}`);
      const txEnvelope = (await txRes.json()) as ApiEnvelope;
      if (!txEnvelope.ok) throw new Error(txEnvelope.error || eventsEnvelope.error || "Transactions request failed");
      setTransactions((current) => [...current, ...tonCenterTxList(txEnvelope.data)]);
      setFallbackMessage(`TonAPI events unavailable. Showing TON Center transactions. ${eventsEnvelope.error || ""}`.trim());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load more transactions");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      {fallbackMessage ? <ErrorBox message="Fallback in use" detail={fallbackMessage} /> : null}
      {error ? <ErrorBox message={error} /> : null}
      <DataTable
        columns={["Time", "Type", "Hash/Event ID", "From", "To", "Amount", "Fee", "Status"]}
        rows={tableRows}
        empty="No transactions returned by the upstream APIs."
      />
      <PaginationButton onClick={loadMore} disabled={loading} label={loading ? "Loading..." : "Load more"} />
    </div>
  );
}
