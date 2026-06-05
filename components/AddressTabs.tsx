"use client";

import { useState } from "react";
import { DataTable, ErrorBox } from "@/components/DataTable";
import { JsonViewer } from "@/components/JsonViewer";
import { TransactionTable } from "@/components/TransactionTable";
import type { ExplorerTransaction } from "@/lib/normalizers";
import { formatTokenAmount, shortHash } from "@/lib/utils";

export function AddressTabs({
  address,
  accountRaw,
  transactions,
  cursor,
  txError,
  txFallbackMessage,
  jettons,
  nfts
}: {
  address: string;
  accountRaw: unknown;
  transactions: ExplorerTransaction[];
  cursor?: string;
  txError?: string;
  txFallbackMessage?: string;
  jettons?: any;
  nfts?: any;
}) {
  const [tab, setTab] = useState("Transactions");
  const tabs = ["Transactions", "Jettons", "NFTs", "Raw Data"];

  return (
    <section className="space-y-3">
      <div className="flex overflow-x-auto border-b border-black">
        {tabs.map((item) => (
          <button
            key={item}
            onClick={() => setTab(item)}
            className={`border border-b-0 border-black px-4 py-2 text-sm font-semibold ${tab === item ? "bg-black text-white" : "bg-white text-black"}`}
          >
            {item}
          </button>
        ))}
      </div>
      {tab === "Transactions" ? (
        <TransactionTable
          address={address}
          initialTransactions={transactions}
          initialCursor={cursor}
          initialError={txError}
          initialFallbackMessage={txFallbackMessage}
        />
      ) : null}
      {tab === "Jettons" ? (
        jettons?.ok ? (
          <DataTable
            columns={["Jetton", "Symbol", "Balance", "Wallet"]}
            rows={(jettons.data?.balances || []).map((item: any) => [
              item?.jetton?.name || "-",
              item?.jetton?.symbol || "-",
              item?.balance ? formatTokenAmount(item.balance, Number(item?.jetton?.decimals || 9), item?.jetton?.symbol || "") : "-",
              shortHash(item?.wallet_address?.address || item?.wallet_address)
            ])}
            empty="No jettons returned for this address."
          />
        ) : (
          <ErrorBox message={jettons?.error || "Jettons are unavailable."} />
        )
      ) : null}
      {tab === "NFTs" ? (
        nfts?.ok ? (
          <DataTable
            columns={["NFT", "Collection", "Address"]}
            rows={(nfts.data?.nft_items || []).map((item: any) => [
              item?.metadata?.name || item?.name || "-",
              item?.collection?.name || "-",
              shortHash(item?.address)
            ])}
            empty="No NFTs returned for this address."
          />
        ) : (
          <ErrorBox message={nfts?.error || "NFTs are unavailable."} />
        )
      ) : null}
      {tab === "Raw Data" ? <JsonViewer data={{ account: accountRaw, jettons, nfts }} /> : null}
    </section>
  );
}
