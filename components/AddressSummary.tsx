import { CopyButton } from "@/components/CopyButton";
import { QRCode } from "@/components/QRCode";
import { formatNanoTon, pickFirstString, shortHash } from "@/lib/utils";

export async function AddressSummary({ address, data, source }: { address: string; data: any; source: string }) {
  const result = data?.result || data || {};
  const balance = result?.balance ?? result?.account_state?.balance;
  const state = pickFirstString(result?.state, result?.status, result?.account_state?.type, "Unknown");
  const lastTx = result?.last_transaction_id || result?.last_transaction;
  const walletType = pickFirstString(result?.interfaces?.[0], result?.wallet_type, result?.type, "Unknown");

  return (
    <section className="grid gap-4 border border-black bg-white p-4 lg:grid-cols-[1fr_auto]">
      <div className="min-w-0 space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs uppercase text-neutral-600">Address</p>
            <h1 className="break-all font-mono text-lg font-semibold">{address}</h1>
          </div>
          <CopyButton value={address} label="Copy address" />
        </div>
        <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-xs uppercase text-neutral-600">TON balance</dt>
            <dd className="mt-1 font-semibold">{formatNanoTon(balance)}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-neutral-600">Account state</dt>
            <dd className="mt-1 font-semibold">{state}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-neutral-600">Last transaction</dt>
            <dd className="mt-1 font-mono text-sm">{shortHash(pickFirstString(lastTx?.hash, lastTx?.id)) || "-"}</dd>
            <dd className="font-mono text-xs text-neutral-600">LT {pickFirstString(lastTx?.lt) || "-"}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-neutral-600">Wallet type/interface</dt>
            <dd className="mt-1 font-semibold">{walletType}</dd>
            <dd className="text-xs text-neutral-600">Source: {source}</dd>
          </div>
        </dl>
      </div>
      <QRCode value={address} />
    </section>
  );
}
