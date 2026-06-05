import { pickFirstString } from "@/lib/utils";

export type ExplorerTransaction = {
  id: string;
  time?: number | null;
  type: string;
  from?: string;
  to?: string;
  amount?: string | number | null;
  fee?: string | number | null;
  status: string;
  lt?: string;
  raw: unknown;
};

export function normalizeEvent(event: any): ExplorerTransaction {
  const action = event?.actions?.[0] || {};
  const tonTransfer = action?.TonTransfer || action?.ton_transfer || {};
  return {
    id: pickFirstString(event?.event_id, event?.id),
    time: event?.timestamp,
    type: pickFirstString(action?.type, event?.type, "event"),
    from: pickFirstString(tonTransfer?.sender?.address, tonTransfer?.sender, action?.from?.address),
    to: pickFirstString(tonTransfer?.recipient?.address, tonTransfer?.recipient, action?.to?.address),
    amount: tonTransfer?.amount,
    fee: event?.extra,
    status: event?.in_progress ? "Pending" : "Success",
    lt: pickFirstString(event?.lt),
    raw: event
  };
}

export function normalizeTonCenterTx(tx: any): ExplorerTransaction {
  const inMsg = tx?.in_msg || {};
  return {
    id: pickFirstString(tx?.transaction_id?.hash, tx?.hash),
    time: tx?.utime,
    type: inMsg?.value ? "transfer" : "transaction",
    from: pickFirstString(inMsg?.source),
    to: pickFirstString(inMsg?.destination, tx?.account),
    amount: inMsg?.value,
    fee: tx?.fee,
    status: tx?.success === false ? "Failed" : "Success",
    lt: pickFirstString(tx?.transaction_id?.lt, tx?.lt),
    raw: tx
  };
}

export function eventList(data: any): ExplorerTransaction[] {
  return (data?.events || []).map(normalizeEvent);
}

export function tonCenterTxList(data: any): ExplorerTransaction[] {
  return (data?.result || data || []).map(normalizeTonCenterTx);
}
