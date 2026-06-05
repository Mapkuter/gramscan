import type { Metadata } from "next";
import { AddressSummary } from "@/components/AddressSummary";
import { AddressTabs } from "@/components/AddressTabs";
import { ErrorBox } from "@/components/DataTable";
import { eventList, tonCenterTxList } from "@/lib/normalizers";
import { serverUrl } from "@/lib/server-url";
import { shortHash } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ address: string }> };

async function getJson(path: string) {
  try {
    const response = await fetch(await serverUrl(path), { cache: "no-store" });
    return await response.json();
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Request failed", data: null };
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { address } = await params;
  const decoded = decodeURIComponent(address);
  return {
    title: `GramScan | TON Address ${shortHash(decoded)}`,
    description: `TON address ${decoded}`
  };
}

export default async function AddressPage({ params }: Props) {
  const { address } = await params;
  const decoded = decodeURIComponent(address);
  const [account, events, jettons, nfts] = await Promise.all([
    getJson(`/api/ton/address?address=${encodeURIComponent(decoded)}`),
    getJson(`/api/ton/address-events?address=${encodeURIComponent(decoded)}`),
    getJson(`/api/ton/jettons?address=${encodeURIComponent(decoded)}`),
    getJson(`/api/ton/nfts?address=${encodeURIComponent(decoded)}`)
  ]);

  let transactions = events?.ok ? eventList(events.data) : [];
  let txError = events?.ok ? undefined : events?.error;
  let txFallbackMessage = events?.fallbackMessage;

  if (!events?.ok) {
    const fallback = await getJson(`/api/ton/transactions?address=${encodeURIComponent(decoded)}`);
    if (fallback?.ok) {
      transactions = tonCenterTxList(fallback.data);
      txError = undefined;
      txFallbackMessage = `TonAPI account events failed. Showing TON Center getTransactions. ${events?.error || ""}`.trim();
    }
  }

  return (
    <div className="space-y-5">
      {account?.ok ? (
        <AddressSummary address={decoded} data={account.data} source={account.source} />
      ) : (
        <ErrorBox message={account?.error || "Address lookup failed"} detail={account?.fallbackMessage} />
      )}
      <AddressTabs
        address={decoded}
        accountRaw={account}
        transactions={transactions}
        cursor={events?.data?.next_from || transactions.at(-1)?.lt}
        txError={txError}
        txFallbackMessage={txFallbackMessage}
        jettons={jettons}
        nfts={nfts}
      />
    </div>
  );
}
