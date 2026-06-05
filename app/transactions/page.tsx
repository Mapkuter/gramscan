import { SearchBar } from "@/components/SearchBar";

export const metadata = {
  title: "GramScan | TON Transactions",
  description: "Search TON transactions and account events"
};

export default function TransactionsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Transactions</h1>
      <div className="border border-black bg-white p-4">
        <SearchBar />
        <p className="mt-3 text-sm text-neutral-600">Enter a transaction hash/event id, or search an address to browse real account events.</p>
      </div>
    </div>
  );
}
